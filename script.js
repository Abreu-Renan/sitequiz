const perguntas = [
  {
    pergunta: "Para começarmos, você é homem ou mulher?",
    opcoes: ["Homem", "Mulher"],
    tema: {
      pageBg: "#f3e8ff",
      cardBg: "#faf7ff",
      primary: "#8b5cf6",
      buttonSoft: "#efe4ff",
      shadow: "rgba(139, 92, 246, 0.15)",
    },
  },
  {
    pergunta: "Se você fosse um animal, qual animal você seria?",
    opcoes: [
      "Leão, porque é corajoso e protetor",
      "Macaco, porque é brincalhão e curioso",
      "Peixinho, porque é calmo e observador",
      "Cachorro, porque é leal e companheiro",
    ],
    tema: {
      pageBg: "#fef3c7",
      cardBg: "#fffdf5",
      primary: "#f59e0b",
      buttonSoft: "#fff1c7",
      shadow: "rgba(245, 158, 11, 0.15)",
    },
  },
  {
    pergunta: "Se você fosse uma cor, qual cor você seria?",
    opcoes: [
      "Vermelho, porque é apaixonado e intenso",
      "Azul, porque é calmo e confiável",
      "Amarelo, porque é alegre e otimista",
      "Verde, porque é equilibrado e sereno",
    ],
    tema: {
      pageBg: "#dbeafe",
      cardBg: "#f8fbff",
      primary: "#3b82f6",
      buttonSoft: "#dfeeff",
      shadow: "rgba(59, 130, 246, 0.15)",
    },
  },
  {
    pergunta: "Qual é a sua faixa de idade?",
    opcoes: ["Mais de 50 anos", "Menos de 50 anos"],
    tema: {
      pageBg: "#e0f2fe",
      cardBg: "#f5fbff",
      primary: "#0ea5e9",
      buttonSoft: "#d9f4ff",
      shadow: "rgba(14, 165, 233, 0.15)",
    },
  },
  {
    pergunta: "Você quer saber o resultado do teste?",
    opcoes: ["Sim", "Não"],
    tema: {
      pageBg: "#e0e7ff",
      cardBg: "#f8f7ff",
      primary: "#8b5cf6",
      buttonSoft: "#e8e0ff",
      shadow: "rgba(139, 92, 246, 0.18)",
    },
  },
];

const quiz = document.getElementById("quiz");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const counter = document.getElementById("counter");
const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const loadingText = document.getElementById("loadingText");
const loadingSubText = document.getElementById("loadingSubText");
const progressBar = document.getElementById("progressBar");
const resultText = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");

let currentQuestion = 0;
let ultimaResposta = "";
let generoSelecionado = "";
let idadeSelecionada = "";
let selectedAnswers = {};
let audioContext = null;

function applyTheme(theme) {
  document.body.style.setProperty("--bg", theme.pageBg);
  document.body.style.setProperty("--card", theme.cardBg);
  document.body.style.setProperty("--primary", theme.primary);
  document.body.style.setProperty("--button-soft", theme.buttonSoft);
  document.body.style.setProperty("--shadow", theme.shadow);

  quiz.style.background = theme.cardBg;
  quiz.style.boxShadow = `0 18px 45px ${theme.shadow}`;
  document.body.style.background = theme.pageBg;
}

function playSound(type = "click") {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;

  audioContext ??= new AudioCtor();

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type === "final" ? "triangle" : "sine";
  oscillator.frequency.value = type === "final" ? 660 : 420;

  gainNode.gain.value = 0.04;
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / perguntas.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateBackButton() {
  backBtn.hidden = currentQuestion === 0;
}

function renderQuestion() {
  if (currentQuestion >= perguntas.length) {
    showResult();
    return;
  }

  const item = perguntas[currentQuestion];
  applyTheme(item.tema);
  updateProgress();
  updateBackButton();

  counter.textContent = `Pergunta ${currentQuestion + 1}/${perguntas.length}`;
  questionText.textContent = item.pergunta;
  optionsContainer.innerHTML = "";

  item.opcoes.forEach((opcao) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = opcao;

    if (selectedAnswers[currentQuestion] === opcao) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      selectedAnswers[currentQuestion] = opcao;
      ultimaResposta = opcao;
      playSound();

      if (currentQuestion === 0) {
        generoSelecionado = opcao;
      }

      if (currentQuestion === 3) {
        idadeSelecionada = opcao;
      }

      if (currentQuestion === perguntas.length - 1) {
        showLoadingScreen();
        return;
      }

      currentQuestion += 1;
      renderQuestion();
    });

    optionsContainer.appendChild(button);
  });
}

function showLoadingScreen() {
  quiz.style.display = "none";
  loading.classList.add("is-visible");
  result.classList.remove("is-visible");

  if (ultimaResposta === "Não") {
    loadingText.textContent = "Você é chatão mesmo hein!";
    loadingSubText.textContent = "Mas mesmo assim vou falar!";
  } else {
    loadingText.textContent = "Analisando suas respostas...";
    loadingSubText.textContent = "Carregando resultado...";
  }

  setTimeout(() => {
    loading.classList.remove("is-visible");
    showResult();
  }, 1800);
}

function showResult() {
  quiz.style.display = "none";
  result.classList.add("is-visible");
  result.classList.remove("is-hidden");

  const isMulher = generoSelecionado === "Mulher";
  const isVovo = idadeSelecionada === "Mais de 50 anos";
  const titulo = isMulher ? (isVovo ? "Vovó" : "Tia") : isVovo ? "Vovô" : "Tio";

  const tituloElement = document.querySelector("#result h2");
  tituloElement.textContent = `🎉 Parabéns! Você vai ser ${titulo}! 🎉`;

  if (ultimaResposta === "Não") {
    resultText.textContent = `Mesmo sem admitir, você já é ${titulo.toLowerCase()} no coração.`;
  } else {
    resultText.textContent = `Sim, é isso mesmo! A Meg está grávida! A gente já te vê como ${titulo.toLowerCase()}.`;
  }

  if (window.confetti) {
    playSound("final");
    window.confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 },
    });
  }
}

function resetQuiz() {
  currentQuestion = 0;
  ultimaResposta = "";
  generoSelecionado = "";
  idadeSelecionada = "";
  selectedAnswers = {};
  progressBar.style.width = "0%";
  loadingText.textContent = "Analisando suas respostas...";
  loadingSubText.textContent = "Calculando nível de titio...";
  result.classList.remove("is-visible");
  result.classList.add("is-hidden");
  quiz.style.display = "block";
  quiz.classList.remove("is-hidden");
  loading.classList.remove("is-visible");
  renderQuestion();
}

backBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

restartBtn.addEventListener("click", resetQuiz);

renderQuestion();
