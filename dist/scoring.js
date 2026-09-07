export const SCORE_VERSION = "ORIGINAL-REFLECTION-1.0";

export function normalizeScore(score, minimum = 5, maximum = 20) {
  if (!Number.isInteger(score) || score < minimum || score > maximum) {
    throw new Error("得点が範囲外です");
  }
  return Math.round(((score - minimum) / (maximum - minimum)) * 100);
}

export function calculateScores(questions, answers) {
  if (!Array.isArray(questions) || questions.length !== 20) {
    throw new Error("質問データを確認できません");
  }
  const values = questions.map((q) => answers[q.id]);
  if (values.some((v) => !Number.isInteger(v) || v < 1 || v > 4)) {
    throw new Error("未回答または不正な回答があります");
  }

  const result = {};
  for (const question of questions) {
    result[question.section] ??= { score: 0, count: 0 };
    result[question.section].score += answers[question.id];
    result[question.section].count += 1;
  }
  for (const entry of Object.values(result)) {
    if (entry.count !== 5) throw new Error("領域別の項目数が不正です");
    entry.meter = normalizeScore(entry.score);
  }
  return result;
}

export function selectAdvice(scores) {
  const burdenIds = ["sensory", "information", "interpersonal"];
  const maximum = Math.max(...burdenIds.map((id) => scores[id].meter));
  return burdenIds.filter((id) => maximum - scores[id].meter <= 5);
}
