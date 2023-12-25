class Board {
  constructor(rows = 6, columns = 7) {
    this.rows = rows;
    this.columns = columns;
    this.grid = Array.from({ length: rows }, () => Array(columns).fill(null));
  }

  dropPac(column, pac) {
    for (let i = this.rows - 1; i >= 0; i--) {
      if (!this.grid[i][column]) {
        this.grid[i][column] = pac;
        return { row: i, column: column };
      }
    }
    return null; // Column is full
  }

  isColumnFull(column) {
    return this.grid[0][column] !== null;
  }

  printBoard() {
    console.log(
      this.grid
        .map((row) => row.map((cell) => cell || "-").join(" "))
        .join("\n")
    );
  }
}

class Player {
  constructor(name, pac) {
    this.name = name;
    this.pac = pac;
  }
}

class Game {
  constructor(player1, player2) {
    this.board = new Board();
    this.players = [new Player(player1, "X"), new Player(player2, "O")];
    this.currentPlayerIndex = 0;
    this.winner = null;
  }

  startGame() {
    this.board.printBoard();
    while (!this.winner && !this.isBoardFull()) {
      let player = this.players[this.currentPlayerIndex];
      let column = this.getPlayerMove(player);
      let position = this.board.dropPac(column, player.pac);
      if (position && this.checkWin(position.row, position.column)) {
        this.winner = player;
      }
      this.switchPlayer();
    }
    this.endGame();
  }

  getPlayerMove() {
    let column;
    do {
      column = Math.floor(Math.random() * this.board.columns);
    } while (this.board.isColumnFull(column));
    return column;
  }

  switchPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  checkWin(row, column) {
    const disc = this.players[this.currentPlayerIndex].pac;
    return (
      this.checkLine(row, column, 0, 1, disc) || // Horizontal
      this.checkLine(row, column, 1, 0, disc) || // Vertical
      this.checkLine(row, column, 1, 1, disc) || // Diagonal (down-right)
      this.checkLine(row, column, 1, -1, disc)
    ); // Diagonal (down-left)
  }

  checkLine(row, column, deltaRow, deltaColumn, disc) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
      let r = row + i * deltaRow;
      let c = column + i * deltaColumn;
      if (
        r >= 0 &&
        r < this.board.rows &&
        c >= 0 &&
        c < this.board.columns &&
        this.board.grid[r][c] === disc
      ) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }
    return false;
  }

  isBoardFull() {
    for (let i = 0; i < this.board.columns; i++) {
      if (!this.board.isColumnFull(i)) return false;
    }
    return true;
  }

  endGame() {
    if (this.winner) {
      console.log(`${this.winner.name} wins!`);
    } else {
      console.log("It's a draw!");
    }
  }
}

let game = new Game("Alice", "Bob");
game.startGame();
