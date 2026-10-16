import "./Square.css";

export default function Square({ value, onSquareClick }) {
    function handleContextMenu(event) {
        event.preventDefault();
        onSquareClick("right");
    }

    return (
        <button className="square" onClick={() => onSquareClick("left")} onContextMenu={handleContextMenu}>
            <h3>{value}</h3>
        </button>
    );
}
