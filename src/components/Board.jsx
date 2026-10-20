import Square from "./Square.jsx";

import { useState, useRef, use } from "react";
import { PLAYER_X, PLAYER_O } from "./Square.jsx";

export default function Board() {
    const BOARD_SIZE = 3;
    const BOARD_SQUARED = BOARD_SIZE * BOARD_SIZE;

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
    const [lastCell, setLastCell] = useState();
    const [draw, setDraw] = useState(false);

    let lastPlayer = useRef();

    function isWin(newStatus, y, x) {
        let status = newStatus;

        let symbol = status[x][y];

        // Tracks matches based on index, where:
        // 0: on the X axis (horizontal)
        // 1: on the Y axis (vertical)
        // 2: diagonal 1
        // 3: diagonal 2
        let matches = [0, 0, 0, 0];

        function hasEnoughMatches() {
            return matches.includes(BOARD_SIZE);
        }

        for (let i = 0; i < BOARD_SIZE; i++) {
            if (status[i][y] === symbol) {
                matches[0]++;
            }

            if (hasEnoughMatches()) return true;

            if (status[x][i] === symbol) {
                matches[1]++;
            }

            if (hasEnoughMatches()) return true;

            if (status[i][i] === symbol) {
                matches[2]++;
            }

            if (hasEnoughMatches()) return true;

            if (status[BOARD_SIZE - i - 1][i] === symbol) {
                matches[3]++;
            }

            if (hasEnoughMatches()) return true;
        }

        return false;
    }

    function getPlacedSymbolsFromBoard(newStatus) {
        let number = 0;

        newStatus.forEach((row) => {
            row.forEach((place) => {
                if (place == "X" || place == "O") number++;
            });
        });

        return number;
    }

    function isDraw(newStatus) {
        return getPlacedSymbolsFromBoard(newStatus) === BOARD_SQUARED;
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

        if (isWin(newStatus, colId, rowId)) {
            setWinner(player);
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
        setDraw(false);

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
            {winner && <div>Game over! {winner} won</div>}
            {winner && <button onClick={handlePlayAgain}>Reset</button>}
            {winner && <div>Draw!</div>}
            {winner && <button onClick={handlePlayAgain}>Reset</button>}
        </div>
    );
}
