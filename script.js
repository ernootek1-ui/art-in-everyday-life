// Navigation menu
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Gallery category filters
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryCards = document.querySelectorAll(".gallery-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    const filter = button.dataset.filter;
    galleryCards.forEach(card => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

// Learn-more modal
const modal = document.getElementById("learnModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalExample = document.getElementById("modalExample");
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".learn-more").forEach(button => {
  button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.title;
    modalDescription.textContent = button.dataset.description;
    modalExample.textContent = button.dataset.example;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("modalClose").focus();
  });
});
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalDone").addEventListener("click", closeModal);
modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

// Three-question learning quiz
const quiz = [
  {
    question: "Which of these can be considered art in everyday life?",
    answers: ["A. A thoughtfully designed outfit", "B. A decorated building", "C. Both A and B"],
    correct: 2,
    explanation: "Correct! Fashion and architecture both use creative choices such as color, shape, texture, and balance."
  },
  {
    question: "What can traditional crafts help preserve?",
    answers: ["A. Cultural stories and skills", "B. Only modern technology", "C. Nothing from the past"],
    correct: 0,
    explanation: "That's right! Crafts pass down knowledge, techniques, stories, and cultural identity across generations."
  },
  {
    question: "Which design principle can you notice in repeating leaf patterns?",
    answers: ["A. Rhythm or repetition", "B. Volume only", "C. Temperature"],
    correct: 0,
    explanation: "Exactly! Repeated shapes and patterns create rhythm, which is one way nature inspires artists."
  }
];
let questionIndex = 0;
let answered = false;
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextButton = document.getElementById("nextQuestion");
const countEl = document.getElementById("quizCount");

function renderQuestion() {
  const item = quiz[questionIndex];
  answered = false;
  countEl.textContent = `QUESTION ${questionIndex + 1} OF ${quiz.length}`;
  questionEl.textContent = item.question;
  feedbackEl.textContent = "Choose an answer to see if you're right.";
  feedbackEl.className = "feedback";
  nextButton.disabled = true;
  nextButton.textContent = questionIndex === quiz.length - 1 ? "Finish quiz →" : "Next question →";
  answersEl.innerHTML = "";
  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answersEl.appendChild(button);
  });
}
function chooseAnswer(selected) {
  if (answered) return;
  answered = true;
  const item = quiz[questionIndex];
  const buttons = [...answersEl.querySelectorAll(".answer")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add("correct");
    else if (index === selected) button.classList.add("incorrect");
  });
  const isCorrect = selected === item.correct;
  feedbackEl.textContent = isCorrect ? item.explanation : `Not quite. ${item.explanation}`;
  feedbackEl.classList.add(isCorrect ? "good" : "bad");
  nextButton.disabled = false;
}
nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (questionIndex < quiz.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    questionIndex = 0;
    renderQuestion();
    questionEl.textContent = "Great work, art detective! Ready to explore again?";
    feedbackEl.textContent = "You completed all 3 questions. Keep noticing the art around you!";
    feedbackEl.className = "feedback good";
    nextButton.textContent = "Try the quiz again →";
    // Keep the final completion message visible until the user restarts.
    nextButton.onclick = () => {
      nextButton.onclick = null;
      renderQuestion();
    };
  }
});
renderQuestion();
