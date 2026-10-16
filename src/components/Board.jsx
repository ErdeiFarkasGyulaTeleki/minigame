import { useState } from "react";
import Square from "./Square.jsx";

export default function Board() {
    const [status, setStatus] = useState([1, 2, 3]);

    function handleClick(idx) {
        setStatus((currentStatus) => currentStatus.map((value, index) => (index === idx ? value + 1 : value)));
    }

    return (
        <div className="board">
            <h1>Board</h1>
            <div>
                {status.map((element, index) => (
                    <Square key={index} value={element} onSquareClick={() => handleClick(index)} />
                ))}
            </div>
        </div>
    );
}
