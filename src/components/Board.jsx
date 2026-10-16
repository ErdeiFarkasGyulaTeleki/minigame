import Square from "./Square.jsx";

export default function Board() {
    return (
        <div className="board">
            <h1>Board</h1>
            <div>
                <Square />
                <Square />
                <Square />
            </div>
        </div>
    );
}
