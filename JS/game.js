const urlParams = new URLSearchParams(window.location.search);
const modo = urlParams.get("mode");
const dificuldade = urlParams.get("difficulty");

document.getElementById("modo").textContent = modo;
document.getElementById("dificuldade").textContent = dificuldade;

const botoesPorDificuldade = {
  facil: 2,
  normal: 4,
  dificil: 9,
};

const coresDisponiveis = [
  "green", "red", "yellow", "blue", "orange", "purple", "pink", "cyan", "gray"
];

let cores = coresDisponiveis.slice(0, botoesPorDificuldade[dificuldade]);

let board = document.getElementById("game-board");
board.classList.add(`btn-${cores.length}`);

let botoes = {};
let sequencia = [];
let userInput = [];
let nivel = 1;
let podeClicar = false;
let tempoRestante = 30;
let cronometroId = null;
let pausado = false;
let tocandoSequencia = false;
let jogoRodando = false;

const nivelTexto = document.getElementById("nivel");
const statusTexto = document.getElementById("status");
const tempoTexto = document.getElementById("tempo");
const cronometro = document.getElementById("cronometro");
const botaoStart = document.getElementById("start");
const botaoPausar = document.getElementById("pause");
const botaoVoltar = document.getElementById("btn-voltar");

const sounds = {
  correct: new Audio('sounds/correct.mp3'),
  wrong: new Audio('sounds/incorrect.mp3'),
  win: new Audio('sounds/winner.mp3'),
  clickSquare: new Audio('sounds/click.mp3'),
  clickStart: new Audio('sounds/start.mp3'),
  clickOption: new Audio('sounds/click.mp3'),
};
function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

cores.forEach(cor => {
  const div = document.createElement("div");
  div.classList.add("color", cor);
  div.dataset.color = cor;
  board.appendChild(div);
  botoes[cor] = div;
});

Object.values(botoes).forEach(btn => {
  btn.addEventListener("click", () => {
    if (!podeClicar || pausado || tocandoSequencia) return;
    const cor = btn.dataset.color;
    userInput.push(cor);
    ativar(btn);
    verificarJogada();
    playSound('clickSquare');
  });
});

function ativar(botao) {
  botao.classList.add("active");
  setTimeout(() => botao.classList.remove("active"), 300);
}

function tocarSequencia() {
  let i = 0;
  podeClicar = false;
  tocandoSequencia = true;

  const intervalo = setInterval(() => {
    if (pausado) return;

    const cor = sequencia[i];
    ativar(botoes[cor]);
    i++;

    if (i >= sequencia.length) {
      clearInterval(intervalo);
      tocandoSequencia = false;
      podeClicar = true;
    }
  }, 600);
}

function proximoPasso() {
  const novaCor = cores[Math.floor(Math.random() * cores.length)];
  sequencia.push(novaCor);
  userInput = [];
  nivelTexto.textContent = `Nível: ${nivel}`;
  statusTexto.textContent = "Memorize a sequência";
  tocarSequencia();
}

function verificarJogada() {
  const index = userInput.length - 1;
  if (userInput[index] !== sequencia[index]) {
    chuvaDeEmojis("❌", 25);
    fimDeJogo();
    playSound('wrong');
    return;
  }

  if (userInput.length === sequencia.length) {
    statusTexto.textContent = "Sequência correta!";
    chuvaDeEmojis("✅", 25);
    nivel++;
    playSound('correct');

    if (modo === "classico" && nivel > 20) {
      statusTexto.textContent = "Você venceu o modo clássico!";
      podeClicar = false;
      chuvaDeEmojis("🏆", 40);
      setTimeout(mostrarRanking, 2500);
      playSound('win');
      return;
    }

    setTimeout(proximoPasso, 1000);
  }
}

function iniciarJogo() {
  sequencia = [];
  userInput = [];
  nivel = 1;
  nivelTexto.textContent = "Nível: 1";
  statusTexto.textContent = "";
  podeClicar = false;

  if (modo === "tempo") {
    tempoRestante = 30;
    tempoTexto.style.display = "block";
    cronometro.textContent = tempoRestante;
    cronometroId = setInterval(() => {
      if(!jogoRodando || pausado) return;
      tempoRestante--;
      cronometro.textContent = tempoRestante;
      if (tempoRestante <= 0) {
        clearInterval(cronometroId);
        fimDeJogo();
        botaoStart.textContent = "Iniciar";
        jogoRodando = false;
      }
    }, 1000);
  } else {
    tempoTexto.style.display = "none";
  }

  proximoPasso();
  jogoRodando = true;
  botaoStart.textContent = "Parar";
}

function pararJogo() {
  jogoRodando = false;
  podeClicar = false;
  sequencia = [];
  userInput = [];
  nivelTexto.textContent = "Nível: 0";
  statusTexto.textContent = "Jogo parado";
  tempoTexto.style.display = "none";

  if (cronometroId) {
    clearInterval(cronometroId);
    cronometroId = null;
  }

  botaoStart.textContent = "Iniciar";
}

botaoStart.addEventListener("click", () => {
  if (!jogoRodando) {
    iniciarJogo();
  } else {
    pararJogo();
  }
});

botaoPausar.addEventListener("click", () => {
  playSound('clickOption');
  pausado = !pausado;
  botaoPausar.textContent = pausado ? "Retomar" : "Pausar";
  statusTexto.textContent = pausado ? "⏸️ Jogo pausado" : "";
});

botaoVoltar.addEventListener("click", () => {
  playSound('clickOption');
  window.location.href = "index.html";
});

function fimDeJogo() {
  podeClicar = false;
  statusTexto.textContent = `Fim de jogo! Você alcançou o nível ${nivel}.`;
  if (cronometroId) clearInterval(cronometroId);
  jogoRodando = false;
  botaoStart.textContent = "Iniciar";
  setTimeout(mostrarRanking, 2000);
}

function chuvaDeEmojis(emoji = "✨", quantidade = 20) {
  const rainContainer = document.getElementById("emoji-rain");
  for (let i = 0; i < quantidade; i++) {
    const el = document.createElement("div");
    el.classList.add("emoji");
    el.textContent = emoji;
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (1 + Math.random() * 1.5) + "s";
    rainContainer.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }
}

function mostrarRanking() {
  const nome = prompt("Digite seu nome para salvar no ranking:");
  if (nome) {
    salvarPontuacao(nome, nivel);
  }
  exibirRanking();
}

function salvarPontuacao(nome, pontos) {
  const ranking = obterRanking();
  ranking.push({ nome, pontos });
  ranking.sort((a, b) => b.pontos - a.pontos);
  localStorage.setItem("rankingGenius", JSON.stringify(ranking.slice(0, 10)));
}

function obterRanking() {
  return JSON.parse(localStorage.getItem("rankingGenius")) || [];
}

document.getElementById("btn-ranking").addEventListener("click", () => {
  playSound('clickOption');
  exibirRanking();
});

function exibirRanking() {
  const rankingModal = document.getElementById("ranking-modal");
  const rankingTabela = document.getElementById("ranking-tabela");

  rankingTabela.innerHTML = `
    <tr>
      <th>Posição</th>
      <th>Jogador</th>
      <th>Pontos</th>
    </tr>
  `;

  const ranking = JSON.parse(localStorage.getItem("rankingGenius")) || [];

  ranking.sort((a, b) => b.pontos - a.pontos);

  ranking.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nome}</td>
      <td>${item.pontos}</td>
    `;
    rankingTabela.appendChild(tr);
  });

  rankingModal.style.display = "flex";
}

document.getElementById("fechar-ranking").addEventListener("click", () => {
  playSound('clickOption');
  document.getElementById("ranking-modal").style.display = "none";
});

document.getElementById("limpar-ranking").addEventListener("click", () => {
  playSound('clickOption');
  if (confirm("Tem certeza que deseja apagar todo o ranking?")) {
    localStorage.removeItem("rankingGenius");
    exibirRanking();
  }
});

const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

let musicaTocando = false;

musicToggle.addEventListener("click", () => {
  playSound('clickOption');  
  if (musicaTocando) {
    music.play();
    musicToggle.textContent = "Musica";
  } else {
    music.pause();
    musicToggle.textContent = "Mutado";
  }
  musicaTocando = !musicaTocando;
});

