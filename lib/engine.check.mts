// npm run check: simulates students and asserts the engine's guarantees.
import assert from 'node:assert';
import { QUESTIONS, inTrack, createSession, choose, submitStage, finish, submissionOf, replay, report, answersOf } from './engine.ts';

// knows = highest stage the simulated student answers correctly (-1 = nothing)
function run(knows: number, chosenLevel: number | null = null, seed = 1) {
  const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let s = createSession(chosenLevel, rng);
  // Each choice gets its own question set.
  for (const qs of s.paper) qs.forEach(q => assert.ok(inTrack(q, chosenLevel), 'question from the wrong track'));
  // Progressive: inside every stage, difficulty never drops.
  for (const qs of s.paper) qs.forEach((q, i) => assert.ok(i === 0 || q.d >= qs[i - 1].d, 'difficulty dropped'));
  while (!s.done) {
    const b = s.stage;
    // Jump around the stage like a real student: answer the last question first.
    for (let i = s.paper[b].length - 1; i >= 0; i--) {
      const q = s.paper[b][i];
      s = choose(s, b, i, q.b <= knows ? q.a : (q.a + 1) % 4);
    }
    const locked = choose(s, b - 1, 0, 0);
    assert.strictEqual(locked, s, 'earlier stages must be locked');
    s = submitStage(s);
  }
  // Server replay of the same papers must give the same report.
  assert.deepStrictEqual(report(replay(chosenLevel, submissionOf(s))!), report(s));
  return report(s);
}

for (const level of [null, 1]) for (let b = 0; b <= 3; b++) {
  const n = (d: number) => QUESTIONS.filter(q => inTrack(q, level) && q.b === b && q.d === d).length;
  assert.ok(n(1) >= 1 && n(2) >= 2 && n(3) >= 1, `${level ? 'level' : 'new'} track, stage ${b} needs tiers 1,2,2,3`);
}
for (const q of QUESTIONS) assert.ok(q.o.length === 4 && q.a >= 0 && q.a < 4, q.q);

for (let seed = 1; seed <= 50; seed++) {
  assert.strictEqual(run(-1, null, seed).recommended, 1);
  assert.strictEqual(run(0, null, seed).recommended, 1);
  assert.strictEqual(run(1, null, seed).recommended, 2);
  assert.strictEqual(run(2, null, seed).recommended, 3);
  assert.ok(run(3, null, seed).beyond);
  assert.strictEqual(run(3, null, seed).total, 16);           // 4 stages × 4
  assert.strictEqual(run(-1, null, seed).total, 4);           // stops after stage 1
  assert.strictEqual(run(0, 3, seed).verdict, 'too-high');
  assert.strictEqual(run(1, 2, seed).verdict, 'fit');
  assert.strictEqual(run(2, 1, seed).verdict, 'too-low');
  assert.strictEqual(run(3, 3, seed).total, 14);              // quick checks: stages 0-1 have 3 each
}

// Time runs out mid-test: open stage is submitted, nothing beyond it counts as passed.
let s = createSession(null, () => 0.5);
s.paper[0].forEach((q, i) => { s = choose(s, 0, i, q.a); });
s = finish(s);
assert.ok(s.done && s.passed === 1 && answersOf(s).length === 8);
assert.ok(replay(null, submissionOf(s)));

// Tampering is rejected.
const sub = submissionOf(s);
assert.strictEqual(replay(null, [{ ...sub[0], ids: [...sub[0].ids].reverse() }]), null); // not easy → hard
assert.strictEqual(replay(null, [sub[0]]), null);                                       // passed but never finished
assert.strictEqual(replay(null, []), null);
assert.strictEqual(replay(1, [sub[0]]), null);                                          // beginner paper sent as a level check
assert.strictEqual(replay(null, [{ ids: sub[1].ids, choices: sub[1].choices }]), null); // stage 2 paper as stage 1

console.log('engine checks passed');
