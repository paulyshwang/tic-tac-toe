function GameBoard() {
  // Create n x n square grid
  const n = 3;
  const board = [];
  for (let i = 0; i < n; i++) {
    board[i] = new Array(n).fill(" ");
  };

  const moves = [];
  let winner = "";

  const getBoard = () => board;

  const isValidMove = (row, column) => {
    if (row < 0 || row >= n || column < 0 || column >= n) {
      console.log("Invalid move: Out of bounds");
      return false;
    } else if (board[row][column] !== " ") {
      console.log("Invalid move: Occupied cell");
      return false;
    };
    
    return true;
  };

  const placeMarker = (row, column, marker) => {
    board[row][column] = marker;
    moves.push([row, column]);
    checkWinner();
  };

  const checkWinner = () => {
    const rows = new Array(n).fill(0);
    const columns = new Array(n).fill(0);
    let diagonal = 0;
    let antidiagonal = 0;
    let player = 1;

    for (let move of moves) {
      let r = move[0];
      let c = move[1];
      rows[r] += player;
      columns[c] += player;
      if (r === c) diagonal += player;
      if (r + c === n - 1) antidiagonal += player;

      if (
        Math.abs(rows[r]) === n
        || Math.abs(columns[c]) === n
        || Math.abs(diagonal) === n
        || Math.abs(antidiagonal) === n
      ) {
        if (player === 1) {
          winner = "Player 1 wins!";
          return;
        } else {
          winner = "Player 2 wins!";
          return;
        };
      };

      player *= -1;
    };

    if (moves.length === n * n) {
      winner = "Draw!";
      return;
    };
  };

  const getWinner = () => winner;

  const clearBoard = () => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        board[i][j] = " ";
      };
    };

    moves.length = 0;
    winner = "";
  }

  return {
    getBoard,
    isValidMove,
    placeMarker,
    getWinner,
    clearBoard
  };
}

function GameController() {
  const board = GameBoard();
  
  const players = [
    {
      name: "Player 1",
      marker: "X"
    },
    {
      name: "Player 2",
      marker: "O"
    }
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const resetActivePlayer = () => activePlayer = players[0];

  const playRound = (row, column) => {
    // Make sure move is legal, then place marker and switch active player
    if (board.isValidMove(row, column)) {
      board.placeMarker(row, column, activePlayer.marker);
      switchActivePlayer();
    };
  };

  return {
    getActivePlayer,
    resetActivePlayer,
    playRound,
    getBoard: board.getBoard,
    getWinner: board.getWinner,
    clearBoard: board.clearBoard
  };
}

function DisplayController() {
  const game = GameController();
  const boardDiv = document.querySelector(".board");
  const messageDiv = document.querySelector(".message");
  const restartButton = document.querySelector(".restart");
  
  restartButton.addEventListener("click", () => {
    game.clearBoard();
    game.resetActivePlayer();

    updateDisplay();
  });

  const updateDisplay = () => {
    // Clear board div
    boardDiv.textContent = "";

    // Get most recent board, active player, and win status
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winner = game.getWinner();

    if (winner) {
      // Display board with inactive cells
      board.forEach((row) => {
        row.forEach((column) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("inactive-cell");
          cellButton.textContent = column;
  
          boardDiv.appendChild(cellButton);
        });
      });

      // Announce winner
      messageDiv.textContent = winner;
    } else {
      // Display board with active cells
      board.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          cellButton.textContent = column;

          cellButton.addEventListener("click", () => {
            game.playRound(rowIndex, columnIndex);
            updateDisplay();
          });

          boardDiv.appendChild(cellButton);
        });
      });

      // Announce player turn
      messageDiv.textContent = `${activePlayer.name}'s turn.`;
    };
  };

  // Initial render
  updateDisplay();
}

DisplayController();