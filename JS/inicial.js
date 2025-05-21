// Carrega os sons
const clickSound = new Audio("/sounds/click.mp3");
const selectSound = new Audio("/sounds/click.mp3");
const startSound = new Audio("/sounds/start.mp3");

let selectedDivision = null;
let selectedDifficulty = null;

const divisionButtons = document.querySelectorAll(".division");
const difficultyButtons = document.querySelectorAll(".difficulty");
const startButton = document.getElementById("start-game");

divisionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectSound.currentTime = 0;
    selectSound.play();

    divisionButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedDivision = btn.dataset.mode;
    checkSelections();
  });
});

difficultyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    difficultyButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedDifficulty = btn.dataset.difficulty;
    checkSelections();
  });
});

function checkSelections() {
  if (selectedDivision && selectedDifficulty) {
    startButton.disabled = false;
  }
}

startButton.addEventListener("click", () => {
  startSound.currentTime = 0;
  startSound.play();

  setTimeout(() => {
    const query = `/html/game.html?mode=${selectedDivision}&difficulty=${selectedDifficulty}`;
    window.location.href = query;
  }, 300);
});

const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

let musicaTocando = true;

musicToggle.addEventListener("click", () => {
  if (musicaTocando) {
    music.play();
    musicToggle.textContent = "Musica";
  } else {
    music.pause();
    musicToggle.textContent = "Mutado";
  }
  musicaTocando = !musicaTocando;
});