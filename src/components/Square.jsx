import "./Square.css";

export default function Square({ value }) {
    return (
        <button className="square">
            <h3>{value}</h3>
        </button>
    );
}
