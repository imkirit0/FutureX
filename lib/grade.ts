import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { ANSWERS } from './answers.ts';
import {
  QUESTIONS, SECONDS_PER_QUESTION, STAGES, passMark, questionCount, tiersFor,
  type Choice, type Question, type Report, type Session, type StageSubmission, type Summary,
} from './engine.ts';

const keyOf = new Map(QUESTIONS.map((q, i) => [q, ANSWERS[i]]));
const answerOf = (q: Question) => keyOf.get(q)![0];

export type Graded = Session & { stage: number; passed: number; done: boolean };

export const stageScore = (s: Session, b: number) => s.paper[b].filter((q, i) => s.picks[b][i] === answerOf(q)).length;

// Walk the stages in order: the climb stops at the first stage below its pass mark.
export function grade(s: Session): Graded {
  let passed = 0;
  for (let b = 0; b < STAGES.length; b++) {
    if (stageScore(s, b) < passMark(s.chosenLevel, b)) return { ...s, stage: b, passed, done: true };
    passed = b + 1;
  }
  return { ...s, stage: STAGES.length - 1, passed, done: true };
}

// Rebuild the session from the submitted papers so results can't be faked.
export function replay(chosenLevel: number | null, stages: unknown): Session | null {
  if (!Array.isArray(stages) || stages.length !== STAGES.length) return null;
  const s: Session = { chosenLevel, paper: [], picks: [] };
  for (const [b, st] of (stages as StageSubmission[]).entries()) {
    const tiers = tiersFor(chosenLevel, b);
    const qs = Array.isArray(st?.ids) ? st.ids.map(id => QUESTIONS[id]) : [];
    const choices = Array.isArray(st?.choices) ? st.choices : [];
    if (qs.length !== tiers.length || choices.length !== tiers.length || new Set(qs).size !== qs.length) return null;
    if (qs.some((q, i) => !q || q.b !== b || q.d !== tiers[i])) return null; // must be a progressive paper
    if (choices.some(c => c !== null && !(Number.isInteger(c) && c >= 0 && c < 4))) return null;
    s.paper[b] = qs;
    s.picks[b] = choices;
  }
  return s;
}

export function report(s: Session, tabSwitches = 0): Report {
  const g = grade(s);
  const review = g.paper.slice(0, g.stage + 1).flatMap((qs, b) =>
    qs.map((q, i) => {
      const [a, e] = keyOf.get(q)!;
      const choice: Choice = g.picks[b][i];
      return { b, t: q.t, q: q.q, o: q.o, choice, a, e, correct: choice === a };
    }));
  const stages = STAGES.map((name, b) => {
    const xs = review.filter(r => r.b === b);
    const status = b < g.passed ? 'passed' : xs.length ? 'stopped' : 'not reached';
    return { name, right: xs.filter(r => r.correct).length, total: xs.length, status } as Report['stages'][number];
  });

  const byTopic = new Map<string, { topic: string; right: number; total: number }>();
  for (const r of review) {
    const t = byTopic.get(r.t) ?? { topic: r.t, right: 0, total: 0 };
    t.total++; if (r.correct) t.right++;
    byTopic.set(r.t, t);
  }
  const topics = [...byTopic.values()];

  const top = g.passed - 1; // highest stage passed, -1 = none
  const recommended = Math.min(3, Math.max(1, top + 1));
  const verdict = !s.chosenLevel ? null
    : recommended === s.chosenLevel ? 'fit' : recommended < s.chosenLevel ? 'too-high' : 'too-low';

  return {
    chosenLevel: s.chosenLevel, recommended, verdict, top,
    score: review.filter(r => r.correct).length,
    total: review.length,
    strengths: topics.filter(t => t.right / t.total >= 0.75).map(t => t.topic),
    gaps: topics.filter(t => t.right / t.total < 0.5).map(t => t.topic),
    tabSwitches,
    beyond: top === 3,
    stages, review,
  };
}

export const summaryOf = (r: Report): Summary => ({
  chosenLevel: r.chosenLevel, recommended: r.recommended, verdict: r.verdict, score: r.score, total: r.total,
  top: r.top, strengths: r.strengths, gaps: r.gaps, tabSwitches: r.tabSwitches,
});

// ---- Signatures: the server vouches for when a quiz started and for what it graded. ----
// ponytail: HMAC key derived from DATABASE_URL when SKILL_CHECK_SECRET is unset, so every
// instance agrees without extra config. Set SKILL_CHECK_SECRET to rotate independently.
const KEY = createHash('sha256').update(process.env.SKILL_CHECK_SECRET ?? process.env.DATABASE_URL ?? 'futurex-dev').digest();
const sign = (msg: string) => createHmac('sha256', KEY).update(msg).digest('base64url');
const verify = (msg: string, sig: unknown) => {
  if (typeof sig !== 'string') return false;
  const a = Buffer.from(sign(msg)), b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
};

// A ticket is issued when the student presses Start; grading rejects answers that arrive
// after the quiz could possibly have run (every question timed out) plus a little slack.
export const GRACE_SECONDS = 45;
export const timeAllowed = (chosenLevel: number | null) => questionCount(chosenLevel) * (SECONDS_PER_QUESTION + 1) + GRACE_SECONDS;

export function issueTicket(): string {
  const t = Date.now().toString(36);
  return `${t}.${sign('ticket:' + t)}`;
}
export function ticketAgeSeconds(ticket: unknown): number | null {
  if (typeof ticket !== 'string') return null;
  const [t, sig] = ticket.split('.');
  if (!t || !verify('ticket:' + t, sig)) return null;
  return (Date.now() - parseInt(t, 36)) / 1000;
}

export const proofOf = (summary: Summary) => sign('summary:' + JSON.stringify(summary));
export const verifiedSummary = (summary: unknown, proof: unknown): Summary | null =>
  summary && typeof summary === 'object' && verify('summary:' + JSON.stringify(summary), proof) ? (summary as Summary) : null;
