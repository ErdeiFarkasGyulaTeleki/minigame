import Square from "./Square.jsx";

import { useState, useRef } from "react";
import { PLAYER_X, PLAYER_O } from "./Square.jsx";

export default function Board() {
    const BOARD_SIZE = 5;
    const BOARD_SQUARED = BOARD_SIZE * BOARD_SIZE;

    const REQ_TO_WIN = 3;

    function createBoard() {
        let board = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            let row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                row.push("");
            }
            board.push(row);
        }

        return board;
    }

    const [status, setStatus] = useState(createBoard());
    const [winner, setWinner] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [lastCell, setLastCell] = useState();
    const [draw, setDraw] = useState(false);
    const [wins, setWins] = useState(() => {
        const storedWins = localStorage.getItem("wins");
        return storedWins ? JSON.parse(storedWins) : { X: 0, O: 0 };
    });

    let lastPlayer = useRef();

    function isWin(board, row, col) {
        const symbol = board[row][col];
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1],
        ];

        return directions.some(([rowStep, colStep]) => {
            let matches = 1;

            for (const direction of [-1, 1]) {
                let currentRow = row + rowStep * direction;
                let currentCol = col + colStep * direction;

                while (
                    currentRow >= 0 &&
                    currentRow < BOARD_SIZE &&
                    currentCol >= 0 &&
                    currentCol < BOARD_SIZE &&
                    board[currentRow][currentCol] === symbol
                ) {
                    matches++;
                    currentRow += rowStep * direction;
                    currentCol += colStep * direction;
                }
            }

            return matches >= REQ_TO_WIN;
        });
    }

    function isGameOver() {
        return status.some((v) => v);
    }

    function handleClick(rowId, colId, player) {
        if (lastPlayer.player === player) return;
        if (status[rowId][colId] !== "") return;
        if (player !== PLAYER_O && player !== PLAYER_X) return;
        if (winner) return;

        lastPlayer.player = player;

        const newStatus = status.map((row, index) =>
            index === rowId ? row.map((value, colIndex) => (colIndex === colId ? player : value)) : row,
        );

        setStatus(newStatus);

        setLastCell([rowId, colId]);
        console.log(lastCell);

        if (isWin(newStatus, rowId, colId)) {
            setWinner(player);
            setWins((prev) => ({ ...prev, [player]: prev[player] + 1 }));

            localStorage.setItem("wins", JSON.stringify({ ...wins, [player]: wins[player] + 1 }));
        }

        if (isDraw(newStatus)) {
            setDraw(true);
            console.log("Draw!");
        }
    }

    function handlePlayAgain() {
        setStatus(createBoard());
        setLastCell(undefined);
        setWinner(undefined);
        setGameOver(false);

        lastPlayer.player = undefined;
    }

    return (
        <div className="board">
            <h1>Board</h1>
            <div>
                {status.map((row, rIndex) => (
                    <div key={rIndex} className="board-row">
                        {row.map((element, cIndex) => (
                            <Square
                                key={cIndex}
                                value={element}
                                highlight={lastCell?.[0] === rIndex && lastCell?.[1] === cIndex}
                                onSquareClick={(mouseButton) => handleClick(rIndex, cIndex, mouseButton)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {!(draw || winner) && <div>{lastPlayer.player == "X" ? "O" : "X"}'s turn</div>}

            {winner && <div>Game over! {winner} won</div>}
            {draw && <div>Draw!</div>}

            {wins.X > 0 && <div>X has won {wins.X} games</div>}
            {wins.O > 0 && <div>O has won {wins.O} games</div>}

            {(draw || winner) && <button onClick={handlePlayAgain}>Reset</button>}
        </div>
    );
}
