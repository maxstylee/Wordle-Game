const wordList = [
  { word: "APPLE", hint: "A sweet fruit" },
  { word: "HOUSE", hint: "Place to live" },
  { word: "WATER", hint: "Essential to drink" },
  { word: "BREAD", hint: "Bakery food item" },
  { word: "CHAIR", hint: "Furniture for sitting" },
  { word: "TABLE", hint: "Furniture with legs" },
  { word: "BEACH", hint: "Sandy ocean coast" },
  { word: "TRAIN", hint: "Public track transport" },
  { word: "CLOCK", hint: "Tells the time" },
  { word: "MONEY", hint: "Used to buy" },
  { word: "MUSIC", hint: "Pleasant sound art" },
  { word: "PLANT", hint: "Green living thing" },
  { word: "PHONE", hint: "Device for calling" },
  { word: "SHIRT", hint: "Upper body clothing" },
  { word: "SHOES", hint: "Footwear for walking" },
  { word: "PAPER", hint: "Material for writing" },
  { word: "WORLD", hint: "Our entire planet" },
  { word: "NIGHT", hint: "Time for sleep" },
  { word: "LIGHT", hint: "Opposite of dark" },
  { word: "HEART", hint: "Pumps your blood" },
  { word: "SMILE", hint: "Happy face expression" },
  { word: "RIVER", hint: "Flowing water stream" },
  { word: "EARTH", hint: "The third planet" },
  { word: "GLASS", hint: "Transparent drinking vessel" },
  { word: "CLOUD", hint: "White sky object" },
  { word: "KNIFE", hint: "Tool for cutting" },
  { word: "GRASS", hint: "Green lawn cover" },
  { word: "SUGAR", hint: "Sweet food powder" },
  { word: "HOTEL", hint: "Place for travelers" },
  { word: "PARTY", hint: "Social celebratory event" },
];
let secretWord = "";
let secretHint = "";
function chooseRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const randomTarget = wordList[randomIndex];
  secretWord = randomTarget.word;
  secretHint = randomTarget.hint;
  // console.log("საიდუმლო სიტყვაა:", secretWord);
}
const rows = document.querySelectorAll(".row");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const hintText = document.getElementById("hint-text");

let currentAttempt = 0;
let currentLetter = 0;
let isGameStarted = false;

function setupBoard() {
  rows.forEach((row, rowIndex) => {
    row.innerHTML = "";
    row.setAttribute("id", `row-${rowIndex}`);

    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const box = document.createElement("div");
      box.classList.add("letter-box", `col-${colIndex}`);
      row.appendChild(box);
    }
  });
}

function resetGame() {
  setupBoard();
  chooseRandomWord();
  hintText.textContent = secretHint;
  startBtn.classList.add("hidden");
  restartBtn.classList.add("hidden");
  isGameStarted = true;
  currentAttempt = 0;
  currentLetter = 0;
}
function correctGuess(row) {
  for (let i = 0; i < 5; i++) {
    const currentBox = row.querySelector(`.col-${i}`);
    if (currentBox) {
      currentBox.classList.add("correct");
    }
  }
}
startBtn.addEventListener("click", () => {
  chooseRandomWord();
  resetGame();
  console.log(secretWord);
});

restartBtn.addEventListener("click", () => {
  resetGame();
});

window.addEventListener("keydown", (event) => {
  if (!isGameStarted) return;

  const key = event.key;
  const activeRow = document.getElementById(`row-${currentAttempt}`);

  if (!activeRow) return;

  // 1. წაშლის ლოგიკა
  if (key === "Backspace") {
    event.preventDefault();
    if (currentLetter > 0) {
      currentLetter--;
      const boxToClear = activeRow.querySelector(`.col-${currentLetter}`);
      if (boxToClear) boxToClear.textContent = "";
    }
    return;
  }

  // 2. შემოწმების ლოგიკა
  if (key === "Enter") {
    event.preventDefault();

    // ა) შემოწმება: აქვს თუ არა მოთამაშეს ყველა ასო აკრეფილი?
    if (currentLetter < 5) {
      return;
    }
    let userGuess = "";
    for (let i = 0; i < 5; i++) {
      const box = activeRow.querySelector(`.col-${i}`);
      userGuess += box.textContent;
    }

    const secretLetters = secretWord.split("");
    const guessLetters = userGuess.split("");

    for (let i = 0; i < 5; i++) {
      const currentBox = activeRow.querySelector(`.col-${i}`);

      if (guessLetters[i] === secretLetters[i]) {
        currentBox.classList.add("correct");
      } else if (secretLetters.includes(guessLetters[i])) {
        currentBox.classList.add("almost");
      } else {
        currentBox.classList.add("absent");
      }
    }

    // დ) მოგების შემოწმება
    if (userGuess === secretWord) {
      console.log("შენ მოიგე! 🎉");
      correctGuess(activeRow);
      restartBtn.classList.remove("hidden");
      isGameStarted = false;
      return;
    }

    currentAttempt++;
    currentLetter = 0;

    if (currentAttempt >= 6) {
      restartBtn.classList.remove("hidden");
      isGameStarted = false;
    }

    return;
  }

  // 3. ასოების აკრეფის ლოგიკა
  if (key.length === 1 && key.match(/[a-z]/i)) {
    if (currentLetter >= 5) return;

    const activeBox = activeRow.querySelector(`.col-${currentLetter}`);
    if (activeBox) {
      activeBox.textContent = key.toUpperCase();
      currentLetter++;
    }
  }
});