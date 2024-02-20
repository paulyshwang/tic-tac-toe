function GameBoard() {
  // Create n x n square grid
  const n = 3;
  const board = [];
  for (let i = 0; i < n; i++) {
    board[i] = new Array(n).fill(" ");
  };

  const moves = [];
  let winner = "";

  // Eventually use this method to render UI
  // const getBoard = () => board;

  const isValidMove = (row, column) => {
    if (row < 0 || row >= n || column < 0 || column >= n) {
      console.log("Invalid move: Out of bounds");
      return false;
    } else if (board[row][column] !== " ") {
      console.log("Invalid move: Occupied cell");
      return false;
    };
    
    return true;
  }

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
          winner = "Player 1 wins!"
          return;
        } else {
          winner = "Player 2 wins!"
          return;
        };
      };

      player *= -1;
    };

    if (moves.length === n * n) {
      winner = "Draw!";
      return;
    }
  };

  const getWinner = () => winner;

  // Print board to console (unnecessary after UI)
  const printBoard = () => {
    console.log(board);
  };

  return {
    // getBoard,
    isValidMove,
    placeMarker,
    getWinner,
    printBoard
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

  // Eventually use this method to expose activePlayer to UI
  // const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = (row, column) => {
    // Make sure game isn't over
    if (board.getWinner()) {
      console.log("GAME OVER");
      return;
    }

    // Make sure move is legal, then place marker and print board
    if (board.isValidMove(row, column)) {
      board.placeMarker(row, column, activePlayer.marker);
      board.printBoard();

      // If winner exists after last move, print winner, else switch player turn
      if (board.getWinner()) {
        console.log(board.getWinner());
      } else {
        switchActivePlayer();
        console.log(`${activePlayer.name}'s turn.`)
      }
    }
  };

  // Initial play game message
  board.printBoard();
  console.log(`${activePlayer.name}'s turn.`)

  return {
    // getActivePlayer,
    playRound
  };
}

const game = GameController();