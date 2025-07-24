let score = 0;
let stressLevel = 0;
let timeLeft = 10;
let timer;
let currentPhrase = "";
let currentIndex = 0;
let quizAnswers = [];
let currentQuizStage = 0;
let currentQuestion = 0;
let timeBonus = 0;

const phrases = [
  "A pressão no trabalho pode afetar a saúde mental",
  "É importante fazer pausas durante o dia de trabalho",
  "Respirar fundo ajuda a reduzir o estresse momentâneo",
  "Conversar com colegas pode aliviar a tensão no trabalho",
  "Estabelecer limites saudáveis é fundamental",
  "A qualidade do sono impacta diretamente no desempenho",
  "Atividades físicas regulares melhoram a resistência ao estresse",
  "Reconhecer os próprios limites é sinal de inteligência emocional",
  "Pequenas pausas para alongamento fazem diferença",
  "Organizar as tarefas pode reduzir a ansiedade",
  "A saúde mental merece atenção constante",
  "Praticar mindfulness pode ajudar no equilíbrio emocional",
  "O apoio social é essencial para o bem-estar",
  "Buscar ajuda profissional é um ato de coragem",
  "A alimentação influencia o humor e a energia",
  "Dormir bem é fundamental para a saúde mental",
  "Manter uma rotina equilibrada ajuda a controlar o estresse",
  "O contato com a natureza pode melhorar o humor",
  "Expressar sentimentos evita o acúmulo de tensões",
  "A prática de hobbies reduz a ansiedade",
  "Desconectar-se das redes sociais ajuda a relaxar",
  "Meditação diária contribui para a clareza mental",
  "Ouvir música pode aliviar momentos difíceis",
  "Exercícios de alongamento aliviam a tensão muscular",
  "O suporte familiar é importante para a saúde emocional",
];

const dassQuestions = [
  [
    "Senti-me sem esperanca",
    "Senti que nao tinha nada a esperar",
    "Senti-me triste ou deprimido",
    "Senti que a vida nao tinha sentido",
    "Senti dificuldade em tomar iniciativa para fazer coisas",
    "Nao consegui ter nenhum sentimento positivo",
    "Senti que nao valia nada como pessoa",
  ],
  [
    "Senti-me agitado",
    "Senti que estava com os nervos a flor da pele",
    "Senti-me assustado sem motivo",
    "Senti dificuldade em relaxar",
    "Senti-me tao inquieto que nao conseguia ficar parado",
    "Senti-me repentinamente assustado sem motivo",
    "Senti medo sem razao aparente",
  ],
  [
    "Senti dificuldade em me acalmar",
    "Senti que estava sempre reagindo exageradamente as situacoes",
    "Senti que estava usando muito a energia nervosa",
    "Senti que nao conseguia tolerar interrupcoes",
    "Senti-me impaciente",
    "Senti que estava a ponto de explodir",
    "Senti dificuldade em relaxar",
  ],
];

const startScreen = document.getElementById("start-screen");
const typingGame = document.getElementById("typing-game");
const quizSection = document.getElementById("quiz-section");
const resultsScreen = document.getElementById("results");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const phraseDisplay = document.getElementById("phrase-display");
const userInput = document.getElementById("user-input");
const timerDisplay = document.getElementById("timer");
const stressBar = document.getElementById("stress-progress");
const stressLevelDisplay = document.getElementById("stress-level");
const scoreDisplay = document.getElementById("score");
const quizContainer = document.getElementById("quiz-container");
const resultsContent = document.getElementById("results-content");
const successSound = document.getElementById("success-sound");
const errorSound = document.getElementById("error-sound");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
userInput.addEventListener("input", checkInput);

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function startGame() {
  startScreen.style.display = "none";
  typingGame.style.display = "block";
  score = 0;
  stressLevel = 0;
  updateScore();
  updateStress();
  newPhrase();
  startTimer();
}

function newPhrase() {
  currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  currentIndex = 0;
  displayPhrase();
  userInput.value = "";
  userInput.focus();
}

function displayPhrase() {
  let html = "";
  for (let i = 0; i < currentPhrase.length; i++) {
    let char = currentPhrase[i];
    if (i < currentIndex) {
      html += `<span class="correct">${char}</span>`;
    } else if (i === currentIndex) {
      html += `<span class="current">${char}</span>`;
    } else {
      html += `<span>${char}</span>`;
    }
  }
  phraseDisplay.innerHTML = html;
}

function checkInput(e) {
  const char = e.target.value.slice(-1);
  const expected = currentPhrase[currentIndex];

  if (
    removeAccents(char.toLowerCase()) === removeAccents(expected.toLowerCase())
  ) {
    currentIndex++;
    displayPhrase();
    e.target.value = "";

    if (currentIndex === currentPhrase.length) {
      score++;
      updateScore();
      decreaseStress(5);

      successSound.play();

      newPhrase();
      resetTimer();
    }
  } else if (char !== "") {
    const before = currentPhrase.slice(0, currentIndex);
    const wordStart = before.lastIndexOf(" ") + 1;
    currentIndex = wordStart >= 0 ? wordStart : 0;
    e.target.value = "";
    displayPhrase();
    errorSound.play();
    increaseStress(15);
  }
}

function startTimer() {
  const baseTimePerChar = 0.2;
  let baseTime = Math.ceil(currentPhrase.length * baseTimePerChar);

  timeLeft = baseTime - Math.floor(score / 3) + timeBonus;

  if (timeLeft < 3) timeLeft = 3;

  updateTimer();

  timer = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);
      errorSound.currentTime = 0;
      errorSound.play();
      increaseStress(20);
      newPhrase();
      startTimer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function updateTimer() {
  timerDisplay.textContent = `Tempo: ${timeLeft}s`;
}

function increaseStress(amount) {
  stressLevel += amount;
  if (stressLevel > 100) stressLevel = 100;
  updateStress();

  if (stressLevel >= 100) {
    startQuiz();
  }
}

function decreaseStress(amount) {
  stressLevel -= amount;
  if (stressLevel < 0) stressLevel = 0;
  updateStress();
}

function updateStress() {
  stressBar.style.width = `${stressLevel}%`;
  stressLevelDisplay.textContent = `Estresse: ${stressLevel}%`;
  if (stressLevel > 70) {
    stressBar.style.backgroundColor = "#e74c3c";
  } else if (stressLevel > 30) {
    stressBar.style.backgroundColor = "#f39c12";
  } else {
    stressBar.style.backgroundColor = "#2ecc71";
  }
}

function startQuiz() {
  clearInterval(timer);
  typingGame.style.display = "none";
  quizSection.style.display = "block";

  currentQuestion = 0;
  quizAnswers = [];

  showNextQuestion();
}

function showNextQuestion() {
  quizContainer.innerHTML = "";

  if (currentQuestion >= 7) {
    currentQuizStage++;

    if (currentQuizStage >= 3) {
      showResults();
      return;
    }

    // Voltar ao jogo após etapa de quiz
    quizSection.style.display = "none";
    typingGame.style.display = "block";
    stressLevel = 0;
    updateStress();
    newPhrase();
    startTimer();
    return;
  }

  const questionDiv = document.createElement("div");
  questionDiv.className = "quiz-question";

  const questionText = document.createElement("p");
  questionText.textContent = dassQuestions[currentQuizStage][currentQuestion];
  questionDiv.appendChild(questionText);

  const optionsDiv = document.createElement("div");
  optionsDiv.className = "quiz-options";

  for (let i = 0; i <= 3; i++) {
    const option = document.createElement("div");
    option.className = "quiz-option";
    option.textContent = getOptionText(i);
    option.dataset.value = i;

    option.addEventListener("click", function () {
      const selected = optionsDiv.querySelector(".selected");
      if (selected) selected.classList.remove("selected");
      this.classList.add("selected");
    });

    optionsDiv.appendChild(option);
  }

  questionDiv.appendChild(optionsDiv);
  quizContainer.appendChild(questionDiv);

  const nextBtn = document.createElement("button");
  nextBtn.textContent =
    currentQuestion === 6 ? "Finalizar Etapa" : "Próxima Pergunta";
  nextBtn.addEventListener("click", function () {
    const selectedOption = quizContainer.querySelector(".selected");
    if (selectedOption) {
      quizAnswers.push({
        category: currentQuizStage,
        question: currentQuestion,
        answer: parseInt(selectedOption.dataset.value),
      });

      const answerValue = parseInt(selectedOption.dataset.value);
      quizAnswers.push({
        category: currentQuizStage,
        question: currentQuestion,
        answer: answerValue,
      });

      // 🎯 Aplicar bônus de tempo
      if (answerValue === 2) timeBonus += 1;
      if (answerValue === 3) timeBonus += 2;

      currentQuestion++;
      showNextQuestion();
    } else {
      alert("Por favor, selecione uma opção antes de continuar.");
    }
  });

  quizContainer.appendChild(nextBtn);
}

function getOptionText(value) {
  return ["Nunca", "Às vezes", "Frequentemente", "Quase sempre"][value];
}

function showResults() {
  quizSection.style.display = "none";
  resultsScreen.style.display = "block";

  const depressionScore = quizAnswers
    .filter((a) => a.category === 0)
    .reduce((sum, a) => sum + a.answer, 0);

  const anxietyScore = quizAnswers
    .filter((a) => a.category === 1)
    .reduce((sum, a) => sum + a.answer, 0);

  const stressScore = quizAnswers
    .filter((a) => a.category === 2)
    .reduce((sum, a) => sum + a.answer, 0);

  resultsContent.innerHTML = `
    <h3>Seus Resultados:</h3>
    <p>Pontuação total no jogo: ${score}</p>

    <div class="result-category">
      <h4>Depressão</h4>
      <p>Pontuação: ${depressionScore} (${getSeverity(
    depressionScore,
    "depression"
  )})</p>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${
          (depressionScore / 21) * 100
        }%; background-color: #3498db;"></div>
      </div>
    </div>

    <div class="result-category">
      <h4>Ansiedade</h4>
      <p>Pontuação: ${anxietyScore} (${getSeverity(
    anxietyScore,
    "anxiety"
  )})</p>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${
          (anxietyScore / 21) * 100
        }%; background-color: #e74c3c;"></div>
      </div>
    </div>

    <div class="result-category">
      <h4>Estresse</h4>
      <p>Pontuação: ${stressScore} (${getSeverity(stressScore, "stress")})</p>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${
          (stressScore / 21) * 100
        }%; background-color: #f39c12;"></div>
      </div>
    </div>

    <p>Lembre-se: este quiz não substitui uma avaliação profissional. Se você se identificou com algumas dessas questões, considere buscar apoio psicológico.</p>
  `;
}

function getSeverity(score, category) {
  const thresholds = {
    depression: { normal: 9, moderate: 13, severe: 20 },
    anxiety: { normal: 7, moderate: 9, severe: 14 },
    stress: { normal: 14, moderate: 18, severe: 25 },
  };

  if (score >= thresholds[category].severe) return "Severo";
  if (score >= thresholds[category].moderate) return "Moderado";
  if (score >= thresholds[category].normal) return "Leve";
  return "Normal";
}

function updateScore() {
  scoreDisplay.textContent = `Pontuação: ${score}`;
}

function restartGame() {
  resultsScreen.style.display = "none";
  startScreen.style.display = "block";
}
