// Self-check for the skill-check engine and grader:
//   node --conditions=react-server scripts/check-engine.mjs
// (the condition makes `server-only` resolve to its empty module, as it does on the server)
// Plays simulated students on every track and checks the grader, replay, tickets and proofs.
import assert from 'node:assert/strict';
import { QUESTIONS, STAGES, createSession, choose, submissionOf, questionCount, passMark, SECONDS_PER_QUESTION } from '../lib/engine.ts';
import { ANSWERS } from '../lib/answers.ts';
import { grade, replay, report, summaryOf, issueTicket, ticketAgeSeconds, timeAllowed, proofOf, verifiedSummary } from '../lib/grade.ts';

// Question bank sanity: the key is index-aligned and nothing leaks into the public bank.
assert.equal(ANSWERS.length, QUESTIONS.length);
const seen = new Set();
QUESTIONS.forEach((q, i) => {
  assert.equal(q.o.length, 4, q.q);
  assert.equal(new Set(q.o).size, 4, `duplicate option: ${q.q}`);
  assert.ok(!('a' in q) && !('e' in q), `answer shipped to the client: ${q.q}`);
  const [a, e] = ANSWERS[i];
  assert.ok(Number.isInteger(a) && a >= 0 && a < 4 && typeof e === 'string' && e, q.q);
  assert.ok(!seen.has(q.q), `duplicate question: ${q.q}`);
  seen.add(q.q);
});
const keyOf = q => ANSWERS[QUESTIONS.indexOf(q)][0];

// knows = highest stage the student answers correctly (-1 = nothing); some answers time out (null).
function play(level, knows, timeouts = 0) {
  let s = createSession(level);
  s.paper.forEach((qs, b) => qs.forEach((q, i) => {
    const right = q.b <= knows;
    s = choose(s, b, i, Math.random() < timeouts ? null : right ? keyOf(q) : (keyOf(q) + 1) % 4);
  }));
  return s;
}

for (const level of [null, 1, 2, 3]) {
  for (let run = 0; run < 500; run++) {
    const knows = Math.floor(Math.random() * 5) - 1;
    const s = play(level, knows);
    assert.equal(s.paper.flat().length, questionCount(level));
    for (const [b, qs] of s.paper.entries()) {
      assert.ok(qs.every(q => q.b === b), 'wrong stage');
      assert.deepEqual(qs.map(q => q.d), [...qs.map(q => q.d)].sort(), 'not in difficulty order');
    }
    const g = grade(s);
    assert.equal(g.passed, Math.min(knows + 1, STAGES.length), 'climb must stop at the first failed stage');
    const r = report(s, 2);
    assert.equal(r.recommended, Math.min(3, Math.max(1, knows + 1)));
    assert.equal(r.beyond, knows >= 3);
    assert.equal(r.total, s.paper.slice(0, g.stage + 1).flat().length, 'stages after the stop are not counted');
    assert.equal(r.tabSwitches, 2);
    // Server replay of the wire format must agree with local grading.
    const server = replay(level, JSON.parse(JSON.stringify(submissionOf(s))));
    assert.ok(server, 'replay rejected a genuine session');
    assert.deepEqual(report(server, 2), r);
  }
  // Timeouts count as wrong: a strong student who times out on most questions is placed low.
  const r = report(play(level, 3, 0.9));
  assert.ok(r.score < r.total);
}
// Pass marks: a stage needs its pass mark, not perfection.
for (const level of [null, 2]) for (let b = 0; b < STAGES.length; b++) assert.ok(passMark(level, b) < createSession(level).paper[b].length);

// Tampered submissions are rejected.
const s = play(2, 3);
const good = submissionOf(s);
let bad = JSON.parse(JSON.stringify(good)); bad[0].ids[0] = QUESTIONS.findIndex(q => q.b === 3); assert.equal(replay(2, bad), null, 'wrong stage');
bad = JSON.parse(JSON.stringify(good)); bad[1].ids[1] = bad[1].ids[0]; assert.equal(replay(2, bad), null, 'duplicate question');
bad = JSON.parse(JSON.stringify(good)); bad[2].choices[0] = 7; assert.equal(replay(2, bad), null, 'choice out of range');
assert.equal(replay(2, good.slice(0, 3)), null, 'every stage must be submitted');

// Tickets bound wall time; proofs bind the stored result to what the server graded.
const t = issueTicket();
assert.ok(ticketAgeSeconds(t) < 1 && ticketAgeSeconds(t) >= 0);
assert.equal(ticketAgeSeconds(t.slice(0, -1) + 'x'), null, 'forged ticket');
assert.equal(ticketAgeSeconds('zzzz.' + t.split('.')[1]), null, 'backdated ticket');
assert.equal(timeAllowed(null), 16 * (SECONDS_PER_QUESTION + 1) + 45);
assert.ok(timeAllowed(3) < timeAllowed(null));
const summary = summaryOf(report(s));
const proof = proofOf(summary);
assert.deepEqual(verifiedSummary(JSON.parse(JSON.stringify(summary)), proof), summary);
assert.equal(verifiedSummary({ ...summary, score: 99 }, proof), null, 'tampered score');
assert.equal(verifiedSummary(summary, proof.slice(1)), null, 'bad proof');

console.log(`ok: ${QUESTIONS.length} questions, 2000 sessions graded and replayed`);
