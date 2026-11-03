import "./Square.css";
import "../App.css";

export const PLAYER_X = "X";
export const PLAYER_O = "O";

export default function Square({ value, highlight, onSquareClick }) {
    function handleContextMenu(event) {
        event.preventDefault();
        onSquareClick(PLAYER_O);
    }

    return (
        <button
            className={"square" + (highlight ? " lastcell" : "")}
            onClick={() => onSquareClick(PLAYER_X)}
            onContextMenu={handleContextMenu}
        >
            <h3>{value}</h3>
        </button>
    );
}
