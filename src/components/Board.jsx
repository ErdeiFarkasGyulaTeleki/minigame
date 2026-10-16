import { useState } from "react";
import Square from "./Square.jsx";

export default function Board() {
    const [status, setStatus] = useState([1, 2, 3]);

    return (
        <div className="board">
            <h1>Board</h1>
            <div>
                {status.map((element) => (
                    <Square key={element} value={element} />
                ))}
            </div>
        </div>
    );
}
