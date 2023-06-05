// Description: Tic Tac Toe game using minimax algorithm
const gameBoard = document.querySelector('#game-board');
const gameInfo = document.querySelector('.info');
const playAgainBtn = document.querySelector('.play-again-btn');
const startCells = [
  " ", " ", " ", " ", " ", " ", " ", " ", " "
]; // 9 cells

let currentPlayer = "player"; // player or robot
gameInfo.textContent = "Player goes first";

// Create game board
function createBoard() {
  startCells.forEach((_cell, index) => { 
    const cellElement = document.createElement('div'); // create 9 cells
    cellElement.classList.add('square'); // add class square to each cell
    cellElement.id = index; // add id to each cell
    cellElement.addEventListener('click', handleCellClick); // add event listener to each cell
    gameBoard.append(cellElement); // append each cell to game board
  });
}
createBoard();

// Handle cell click event
function handleCellClick(e) { 
  if (currentPlayer !== "player") { // if it's not player's turn, return
    return; // do nothing
  }

  // if it's player's turn
  const cellIndex = parseInt(e.target.id); // get cell index
  if (startCells[cellIndex] === " ") { // if cell is empty
    const circleDiv = document.createElement('div'); // create circle div
    circleDiv.classList.add('circle'); // add class circle to circle div
    e.target.append(circleDiv); // append circle div to cell
    startCells[cellIndex] = "O"; // update startCells array

    const isWin = checkWin(); // check if player wins
    if (isWin === "circle") {
      gameInfo.textContent = "Circle wins!";
      endGame();
      return; 
    } else if (isWin === "tie") { // check if it's a tie
      gameInfo.textContent = "It's a tie!"; 
      endGame();
      return;
    }

    // if it's not a win or tie, change to robot's turn
    currentPlayer = "robot";
    gameInfo.textContent = "Cross turn";
    e.target.removeEventListener('click', handleCellClick);

    setTimeout(robotMove, 500); // robot move after 0.5s
  }
}

// Robot move function
function robotMove() {
  if (currentPlayer !== "robot") { // if it's not robot's turn,
    return;
  }

  // if it's robot's turn
  const bestMove = findBestMove(startCells, currentPlayer); // find best move
  const cellElement = document.getElementById(bestMove.index.toString()); // get cell element

  // add cross div to cell
  const crossDiv = document.createElement('div'); // create cross div
  crossDiv.classList.add('cross'); // add class cross to cross div
  cellElement.append(crossDiv);
  startCells[bestMove.index] = "X";

  // check if robot wins or it's a tie
  const isWin = checkWin(); 
  if (isWin === "cross") {
    gameInfo.textContent = "Cross wins!";
    endGame();
    return;
  } else if (isWin === "tie") {
    gameInfo.textContent = "It's a tie!";
    endGame();
    return;
  }

// if it's not a win or tie, change to player's turn
  currentPlayer = "player";
  gameInfo.textContent = "Player's turn";

  cellElement.removeEventListener('click', handleCellClick); // remove event listener
}

// Find best move function
function findBestMove(board, player) {
  let bestScore = -Infinity; // -Infinity for maximizing
  let bestMoves = []; // best moves array

  // loop through each cell
  for (let i = 0; i < board.length; i++) { 
    if (board[i] === " ") { // if cell is empty
      board[i] = player; // update board
      const score = minimax(board, 0, false); // minimax algorithm
      board[i] = " "; // reset board
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [i];
      } else if (score === bestScore) {
        bestMoves.push(i); // add best move to best moves array
      }
    }
  }

  // randomly choose a best move
  const randomIndex = Math.floor(Math.random() * bestMoves.length); // random index
  const bestMove = bestMoves[randomIndex]; // best move
  return { index: bestMove }; // return best move
}

// Minimax algorithm
const scores = { // scores object
  cross: 1, // cross wins
  circle: -1, // circle wins
  tie: 0 // tie
};

// minimax function
function minimax(board, depth, isMaximizing, alpha, beta) { // alpha-beta pruning
  const result = checkWin();

  // if it's a win or tie, return score
  if (result !== null) { 
    return scores[result]; 
  }

  if (isMaximizing) { // if it's maximizing player
    let bestScore = -Infinity; // -Infinity for maximizing

    // loop through each cell
    for (let i = 0; i < board.length; i++) {
      if (board[i] === " ") {
        board[i] = "X";
        const score = minimax(board, depth + 1, false, alpha, beta);
        board[i] = " ";
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) {
          break; // Beta cutoff
        }
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

// if it's minimizing player
    for (let i = 0; i < board.length; i++) {
      if (board[i] === " ") {
        board[i] = "O";
        const score = minimax(board, depth + 1, true, alpha, beta);
        board[i] = " ";
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
          break; // Alpha cutoff
        }
      }
    }

    return bestScore;
  }
}

// Check win function
function checkWin() {
  const theSquare = document.querySelectorAll('.square');
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6] // diagonal
  ];

  // loop through each winning combo
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (
      theSquare[a].firstChild?.classList.contains('circle') &&
      theSquare[b].firstChild?.classList.contains('circle') &&
      theSquare[c].firstChild?.classList.contains('circle')
    ) {
      return "circle";
    }
    if (
      theSquare[a].firstChild?.classList.contains('cross') &&
      theSquare[b].firstChild?.classList.contains('cross') &&
      theSquare[c].firstChild?.classList.contains('cross')
    ) {
      return "cross";
    }
  }

  if (startCells.every(cell => cell !== " ")) {
    return "tie";
  }

  return null;
}

function endGame() {
  const cells = document.querySelectorAll('.square'); // get all cells
  cells.forEach(cell => { // remove event listener from each cell
    cell.removeEventListener('click', handleCellClick); 
  });
  playAgainBtn.style.display = "block";
}

// Play again button
playAgainBtn.addEventListener('click', resetGame);

// Reset game function
function resetGame() {
  startCells.fill(" "); // reset startCells array
  currentPlayer = "player";
  gameInfo.textContent = "Player goes first";
  const cells = document.querySelectorAll('.square');
  cells.forEach(cell => {
    cell.innerHTML = "";
    cell.addEventListener('click', handleCellClick);
  });
  playAgainBtn.style.display = "none"; // hide play again button
}

