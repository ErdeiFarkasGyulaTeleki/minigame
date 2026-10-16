import { useState } from "react";
import Square from "./Square.jsx";

const LEFT = "left";
const RIGHT = "right";
const PLAYER_X = "x";
const PLAYER_O = "o";

export default function Board() {
    const [status, setStatus] = useState(["", "", ""]);

    function handleClick(idx, mouseButton) {
        let newValue;

        if (mouseButton === LEFT) {
            newValue = PLAYER_X;
        } else if (mouseButton === RIGHT) {
            newValue = PLAYER_O;
        } else {
            return;
        }

        const newStatus = status.map((value, index) => (index === idx ? newValue : value));
        setStatus(newStatus);
    }

    return (
        <div className="board">
            <h1>Board</h1>
            <div>
                {status.map((element, index) => (
                    <Square
                        key={index}
                        value={element}
                        onSquareClick={(mouseButton) => handleClick(index, mouseButton)}
                    />
                ))}
            </div>
        </div>
    );
}
