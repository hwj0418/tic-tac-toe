import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square value={this.props.board[i]} onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ board: Array(9).fill(null)}],
      stepNum: 0,
      Xturn: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNum + 1);
    const current = history[history.length - 1];
    const cur_board = current.board;
    const winner = findWinner(cur_board);

    if (cur_board[i] || winner) return;

    const newBoard = cur_board.slice();
    newBoard[i] = this.state.Xturn ? "X" : "O";
    this.setState({
      history: history.concat([{board: newBoard}]),
      stepNum: history.length,
      Xturn: !this.state.Xturn,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      Xturn: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNum];
    const winner = findWinner(current.board);

    const movesHistory = history.map((step, move) => {
      const moveInfo = move ? "Go to move# " + move : "Restart";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{moveInfo}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = winner + " has won the game.";
    } else {
      status = "Next player: " + this.state.Xturn ? "X" : "O";
    }

    console.log(this.state.history);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            board={current.board}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{movesHistory}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function findWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
