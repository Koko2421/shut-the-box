const dice1 = document.querySelector("#die1");
const dice2 = document.querySelector("#die2");
const startButton = document.querySelector("#startButton");
const rollButton = document.querySelector("#rollButton");
const individualButton = document.querySelector("#individualButton");
const sumButton = document.querySelector("#sumButton");
const endTurnButton = document.querySelector("#endTurnButton");
const player1NameInput = document.querySelector("#player1Name");
const player2NameInput = document.querySelector("#player2Name");
const currentTurn = document.querySelector("#currentTurn");
const roundNumber = document.querySelector("#roundNumber");
const scoreRows = document.querySelector("#scoreRows");
const winnerMessage = document.querySelector("#winnerMessage");
const playAgainButton = document.querySelector("#playAgainButton");
const boxes = document.querySelectorAll(".box");

let boxesStatus = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let currentPlayer = 1;
let round = 1;
let player1Points = 0;
let player2Points = 0;
let die1, die2;

// Start the game
startButton.addEventListener("click", () => {
  const player1Name = player1NameInput.value.trim();
  const player2Name = player2NameInput.value.trim();
  if (player1Name && player2Name) {
      currentPlayer = 1;
      round = 1;
      player1Points = 0;
      player2Points = 0;

      currentTurn.textContent = `${player1Name}'s Turn`;
      roundNumber.textContent = round;

      // Hide the start section and show the game section
      document.querySelector("#startSection").style.display = "none";
      document.querySelector("#gameSection").style.display = "block";
  } else {
      alert("Please enter both player names.");
  }
});

// Roll dice
rollButton.addEventListener("click", () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    dice1.className = `bi bi-dice-${die1}`;
    dice2.className = `bi bi-dice-${die2}`;

    // Disable individual button if it's a double
    if (die1 === die2) {
        individualButton.disabled = true;
    } else {
        individualButton.disabled = false;
    }

    // Disable individual button if any of the dice results are already shut
    if (boxesStatus[die1 - 1] === "X" || boxesStatus[die2 - 1] === "X") {
        individualButton.disabled = true;
    }
    let sum = die1 + die2;
    if (sum > 9 || boxesStatus[sum - 1] === "X") {
        sumButton.disabled = true;
    } else {
        sumButton.disabled = false;
    }
    rollButton.disabled = true;
    endTurnButton.disabled = false;
});

// Shut a box
function shutBox(boxNumber) {
    const box = document.querySelector(`[data-box="${boxNumber}"]`);
    if (box) {
        box.classList.add("shut");
        box.textContent = "X";
        boxesStatus[boxNumber - 1] = "X";
    }
}

// Individual shut
individualButton.addEventListener("click", () => {
    shutBox(die1);
    shutBox(die2);
    individualButton.disabled = true;
    sumButton.disabled = true;
    rollButton.disabled = false;
});

// Sum shut
sumButton.addEventListener("click", () => {
    let sum = die1 + die2;
    shutBox(sum);
    individualButton.disabled = true;
    sumButton.disabled = true;
    rollButton.disabled = false;
});

// End turn
endTurnButton.addEventListener("click", () => {
  let points = 45 - boxesStatus.reduce((sum, val) => sum + (val === "X" ? 0 : val), 0);

  if (currentPlayer === 1) {
      player1Points += points;
      currentPlayer = 2;
  } else {
      player2Points += points;
      currentPlayer = 1;
      round += 1;
  }

  // Update the display for the next player
  currentTurn.textContent = `${currentPlayer === 1 ? player1NameInput.value : player2NameInput.value}'s Turn`;
  roundNumber.textContent = `Round: ${round}`;

  // Reset the game board
  resetBoard();
  if (round > 5) {
      gameOver();
  }
});

// Reset board for the next turn
function resetBoard() {
  boxesStatus.fill(0);
  boxes.forEach((box, index) => {
      box.classList.remove("shut");
      box.textContent = index + 1;
  });

  // Disable buttons after each turn
  rollButton.disabled = false;
  individualButton.disabled = true;
  sumButton.disabled = true;
  endTurnButton.disabled = true;
}

// Game over
function gameOver() {
    document.querySelector("#gameSection").style.display = "none";
    document.querySelector("#winner").style.display = "block";

    if (player1Points < player2Points) {
        winnerMessage.textContent = `Player 1 wins with ${player1Points} points! Player 2 had ${player2Points} points.`;
    } else {
        winnerMessage.textContent = `Player 2 wins with ${player2Points} points! Player 1 had ${player1Points} points.`;
    }
}

// Play again
playAgainButton.addEventListener("click", () => {
    boxesStatus = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    currentPlayer = 1;
    round = 1;
    player1Points = 0;
    player2Points = 0;
    document.querySelector("#winner").style.display = "none";
    document.querySelector("#startSection").style.display = "block";
    document.querySelector("#gameSection").style.display = "none";
    scoreRows.textContent = "";
});
