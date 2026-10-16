import "./Square.css";

export default function Square({ value, onSquareClick }) {
    function handleContextMenu() {
        event.preventDefault();
        onSquareClick();
    }

    return (
        <button className="square" onClick={onSquareClick} onContextMenu={handleContextMenu}>
            <h3>{value}</h3>
        </button>
    );
}
