import { choices, questions, sections } from "./questions.js";
import { calculateScores, selectAdvice } from "./scoring.js";

const state = { answers: {}, sectionIndex: 0, scores: null };
const $ = (id) => document.getElementById(id);
const views = ["introView", "questionView", "resultView"];

function showView(id) {
  views.forEach((view) => { $(view).hidden = view !== id; });
  $("exitButton").hidden = id === "introView";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestions() {
  const section = sections[state.sectionIndex];
  $("stepLabel").textContent = `${state.sectionIndex + 1} / ${sections.length}`;
  $("sectionKicker").textContent = `STEP ${state.sectionIndex + 1}　${section.short}`;
  $("sectionTitle").textContent = section.title;
  $("sectionDescription").textContent = section.description;
  const sectionQuestions = questions.filter((q) => q.section === section.id);
  $("questionList").innerHTML = sectionQuestions.map((q, index) => `
    <fieldset class="question-card" id="card-${q.id}">
      <legend><span class="question-number">${state.sectionIndex * 5 + index + 1}</span>${q.text}</legend>
      <div class="choice-grid">
        ${choices.map((choice) => `<label class="choice-label"><input type="radio" name="${q.id}" value="${choice.value}" ${state.answers[q.id] === choice.value ? "checked" : ""}><span><b>${choice.value}</b>${choice.label}</span></label>`).join("")}
      </div>
    </fieldset>`).join("");
  $("backButton").textContent = state.sectionIndex === 0 ? "説明に戻る" : "前へ";
  $("nextButton").innerHTML = state.sectionIndex === sections.length - 1 ? "結果を見る <span aria-hidden=\"true\">→</span>" : "次へ <span aria-hidden=\"true\">→</span>";
  updateProgress();
}

function updateProgress() {
  const count = Object.keys(state.answers).length;
  $("answerCount").textContent = `${count} / 20 回答`;
  $("progressBar").style.width = `${(count / 20) * 100}%`;
  $("progressBar").parentElement.setAttribute("aria-valuenow", count);
}

function validateCurrent() {
  const ids = questions.filter((q) => q.section === sections[state.sectionIndex].id).map((q) => q.id);
  const missing = ids.find((id) => state.answers[id] === undefined);
  document.querySelectorAll(".question-card").forEach((card) => card.classList.remove("missing"));
  if (!missing) { $("formError").hidden = true; return true; }
  $("formError").hidden = false;
  const card = $(`card-${missing}`);
  card.classList.add("missing");
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;
}

const advice = {
  sensory: { title: "刺激を減らす小さな調整", text: "音量、画面の明るさ、室温、座る位置など、変えられるものを一つ選んでみましょう。刺激から数分離れるだけでも、自分を整える余白になります。" },
  information: { title: "頭の中から外へ整理する", text: "依頼や予定を一覧にし、次に行う一つを決めてみましょう。割り込み後に戻る場所をメモしておくことや、変更前に確認時間を持つことも役立ちます。" },
  interpersonal: { title: "人と関わった後の回復時間", text: "相手の反応を受け止め続けた後は、一人で落ち着く時間を予定に含めてみましょう。余裕がないときの伝え方を、信頼できる人と相談しておくのも一つの方法です。" },
};

function renderResults() {
  const scores = state.scores;
  $("scoreCards").innerHTML = sections.map((section) => {
    const entry = scores[section.id];
    const isResource = section.id === "recovery";
    return `<article class="score-card ${isResource ? "resource" : ""}">
      <div class="score-top"><div><p class="score-kind">${isResource ? "回復の手がかり" : "負担の振り返り"}</p><h2>${section.resultLabel}</h2></div><p class="score-value"><strong>${entry.score}</strong><span>／20点</span></p></div>
      <div class="result-track" role="img" aria-label="得点範囲内の位置 ${entry.meter}／100"><div style="width:${entry.meter}%"></div></div>
      <p class="meter-value">得点範囲内の位置：${entry.meter}／100</p>
    </article>`;
  }).join("");
  const selected = selectAdvice(scores);
  $("adviceList").innerHTML = selected.map((id) => `<article class="advice-item"><span aria-hidden="true">${id === "sensory" ? "◌" : id === "information" ? "≡" : "◇"}</span><div><h3>${advice[id].title}</h3><p>${advice[id].text}</p></div></article>`).join("") + `<article class="advice-item recovery-tip"><span aria-hidden="true">✦</span><div><h3>今ある回復方法も大切に</h3><p>回復資源の回答を見返し、すでにできていることを続けてください。できていない項目は欠点ではなく、これから試せる選択肢です。</p></div></article>`;
}

function resetState() {
  state.answers = {}; state.sectionIndex = 0; state.scores = null;
  $("consent").checked = false; $("startButton").disabled = true;
}

function requestExit() { $("confirmDialog").showModal(); }

$("consent").addEventListener("change", (e) => { $("startButton").disabled = !e.target.checked; });
$("startButton").addEventListener("click", () => { state.sectionIndex = 0; renderQuestions(); showView("questionView"); });
$("questionList").addEventListener("change", (e) => {
  if (e.target.matches("input[type=radio]")) { state.answers[e.target.name] = Number(e.target.value); updateProgress(); e.target.closest(".question-card").classList.remove("missing"); $("formError").hidden = true; }
});
$("nextButton").addEventListener("click", () => {
  if (!validateCurrent()) return;
  if (state.sectionIndex < sections.length - 1) { state.sectionIndex += 1; renderQuestions(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  try { state.scores = calculateScores(questions, state.answers); renderResults(); showView("resultView"); }
  catch { $("formError").textContent = "結果を計算できませんでした。回答をご確認ください。"; $("formError").hidden = false; }
});
$("backButton").addEventListener("click", () => { if (state.sectionIndex === 0) showView("introView"); else { state.sectionIndex -= 1; renderQuestions(); window.scrollTo({ top: 0, behavior: "smooth" }); } });
$("exitButton").addEventListener("click", requestExit);
$("restartButton").addEventListener("click", requestExit);
$("closeButton").addEventListener("click", requestExit);
$("confirmExit").addEventListener("click", () => { resetState(); showView("introView"); });
