import { useState } from 'react';

function Square({
  value,
  onSquareClick,
  highlight = false,
}: {
  value: string | null;
  onSquareClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      // applies highlight from css to winning line
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[], moveIndex: number) => void;
}) {
  function handleClick(i: number) {
    const { winner } = calculateWinner(squares);

    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const { winner, line, isDraw } = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  // additional improvements #2:
  const boardRows = [0, 1, 2].map((row) => {
    // create 3 board rows
    const squaresInRow = [0, 1, 2].map((col) => {
      // create 3 squares per row
      const index = row * 3 + col; // allows for correct indexing of each square
      return (
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          // additional improvemens #4
          // highlight the winning line
          highlight={line.includes(index)}
        />
      );
    });

    return (
      <div key={row} className="board-row">
        {squaresInRow}
      </div>
    );
  });

  return (
    // don't forget to add status tag back in
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function calculateWinner(squares: (string | null)[]): {
  winner: string | null;
  line: number[];
  isDraw?: boolean;
} {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return the winning line as well as the winning symbol
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  //return null;

  // checks for if all squares are filled in
  const isDraw = squares.every(Boolean);
  // if true, return isDraw as true
  return isDraw
    ? { winner: null, line: [], isDraw: true }
    : { winner: null, line: [] };
}

export default function Game() {
  //const [xIsNext, setXIsNext] = useState(true);
  // redundant bc see that when xIsNext = True, always even, and xIsNext = False, always odd
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  // history is an array of arrays of strings or nulls

  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // track movement in the game
  const [moveLocations, setMoveLocations] = useState<number[]>([]);
  // arr of numbers that reps the index of the square clicked for a move

  function handlePlay(nextSquares: (string | null)[], moveIndex: number) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextMoveLocations = [
      ...moveLocations.slice(0, currentMove),
      moveIndex,
    ];

    setHistory(nextHistory);
    setMoveLocations(nextMoveLocations);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    // number bc index of a move in history
    setCurrentMove(nextMove);
  }

  // additional improvements #3:
  const [isAscending, setIsAscending] = useState(true);

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const index = moveLocations[move - 1];
      const x = Math.floor(index / 3) + 1;
      const y = (index % 3) + 1;
      description = `Go to move #${move} (${x}, ${y})`;
    } else {
      description = 'Go to game start';
    }

    // additional improvements #1:
    if (move === currentMove) {
      return <li key={move}>You are at move #{move}</li>;
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  // sort ascend/descend depending on flag
  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* toggle button */}
        <button onClick={() => setIsAscending(!isAscending)}>
          Sort Moves: {isAscending ? 'Descending' : 'Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
