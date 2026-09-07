import assert from "node:assert/strict";
import { questions } from "./dist/questions.js";
import { calculateScores, normalizeScore, selectAdvice } from "./dist/scoring.js";

assert.equal(questions.length, 20);
assert.equal(new Set(questions.map((q) => q.text)).size, 20);
assert.ok(questions.every((q) => q.scoringDirection === "normal"));

const minimum = Object.fromEntries(questions.map((q) => [q.id, 1]));
const maximum = Object.fromEntries(questions.map((q) => [q.id, 4]));
const minScores = calculateScores(questions, minimum);
const maxScores = calculateScores(questions, maximum);
for (const id of ["sensory", "information", "interpersonal", "recovery"]) {
  assert.equal(minScores[id].score, 5);
  assert.equal(minScores[id].meter, 0);
  assert.equal(maxScores[id].score, 20);
  assert.equal(maxScores[id].meter, 100);
}
assert.equal(normalizeScore(5), 0);
assert.equal(normalizeScore(20), 100);
assert.throws(() => calculateScores(questions, { ...minimum, [questions[0].id]: undefined }));
assert.throws(() => calculateScores(questions, { ...minimum, [questions[0].id]: 5 }));
assert.deepEqual(selectAdvice({ sensory:{meter:70}, information:{meter:66}, interpersonal:{meter:40} }), ["sensory","information"]);
console.log("All scoring and validation tests passed.");
