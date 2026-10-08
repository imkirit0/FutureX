// Self-check for the skill-check engine: node scripts/check-engine.mjs
// Plays random sessions on every track and checks the server replay agrees with the client.
import assert from 'node:assert/strict';
import { QUESTIONS, STAGES, createSession, choose, submitStage, finish, submissionOf, replay, report, inTrack, passMark } from '../lib/engine.ts';

// Question bank sanity.
const seen = new Set();
for (const q of QUESTIONS) {
  assert.equal(q.o.length, 4, q.q);
  assert.equal(new Set(q.o).size, 4, `duplicate option: ${q.q}`);
  assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, q.q);
  assert.ok(!seen.has(q.q), `duplicate question: ${q.q}`);
  seen.add(q.q);
}

for (const level of [null, 1, 2, 3]) {
  for (let run = 0; run < 2000; run++) {
    let s = createSession(level);
    for (const [b, qs] of s.paper.entries()) {
      assert.ok(qs.every(Boolean), `empty slot: level ${level} stage ${b}`);
      assert.ok(qs.every(q => inTrack(q, level) && q.b === b), 'wrong track/stage');
      assert.deepEqual(qs.map(q => q.d), [...qs.map(q => q.d)].sort(), 'not easy → hard');
    }
    // Each answer is right with a per-run skill probability; some runs time out.
    const skill = Math.random(), timeout = Math.random() < 0.1;
    while (!s.done) {
      s.paper[s.stage].forEach((q, i) => {
        const r = Math.random();
        s = choose(s, s.stage, i, r < skill ? q.a : r < 0.95 ? (q.a + 1) % 4 : null);
      });
      if (timeout) { s = finish(s); break; }
      const want = s.paper[s.stage].filter((q, i) => s.picks[s.stage][i] === q.a).length >= passMark(level, s.stage);
      const before = s.stage;
      s = submitStage(s);
      assert.equal(s.passed > before, want, 'pass mark not applied');
    }
    const server = replay(level, JSON.parse(JSON.stringify(submissionOf(s))));
    assert.ok(server, 'replay rejected a genuine session');
    assert.deepEqual(report(server), report(s));
    const r = report(s);
    assert.ok(r.recommended >= 1 && r.recommended <= 3);
    assert.equal(r.stages.length, STAGES.length);
  }
}

// A tampered submission (answers from the wrong track) is rejected.
const s = finish(createSession(2));
const bad = submissionOf(s);
bad[0].ids[0] = QUESTIONS.findIndex(q => q.k === 'new');
assert.equal(replay(2, bad), null);

console.log(`ok: ${QUESTIONS.length} questions, 8000 sessions replayed`);
