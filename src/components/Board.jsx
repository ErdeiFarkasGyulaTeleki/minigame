import { useState } from "react";
import Square from "./Square.jsx";

const LEFT = "left";
const RIGHT = "right";
const PLAYER_X = "x";
const PLAYER_O = "o";

export default function Board() {
    const [status, setStatus] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    function handleClick(rowId, colId, mouseButton) {
        let newValue;

        if (mouseButton === LEFT) {
            newValue = PLAYER_X;
        } else if (mouseButton === RIGHT) {
            newValue = PLAYER_O;
        } else {
            return;
        }

        const newStatus = status.map((row, index) =>
            index === rowId ? row.map((value, colIndex) => (colIndex === colId ? newValue : value)) : row,
        );
        setStatus(newStatus);
    }

    return (
        <div className="board">
            <h1>Board</h1>
            <div>
                {status.map((row, rIndex) => (
                    <div key={rIndex} className="board-row">
                        {row.map((element, index) => (
                            <Square
                                key={index}
                                value={element}
                                onSquareClick={(mouseButton) => handleClick(rIndex, index, mouseButton)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
