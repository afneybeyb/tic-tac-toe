import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Square = props => {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			currentPlayer: "X",
			win: null,
			filled: false,
		};
	}

	handleClick(i) {
		if (!this.state.win) {
			const squares = [...this.state.squares];
			const filled = boardFilled(squares);

			if (!squares[i] || filled) {
				squares[i] = this.state.currentPlayer;
				this.setState({
					squares,
					currentPlayer: this.state.currentPlayer === "X" ? "O" : "X",
					win: calculateWinner(squares),
					filled: boardFilled(squares),
				});
			}
		}
	}

	renderSquare(i) {
		return (
			<Square
				value={this.state.squares[i]}
				onClick={() => this.handleClick(i)}
			/>
		);
	}

	render() {
		const status = this.state.win ? `${this.state.win} won!` : `Current player: ${this.state.currentPlayer}`;

		return (
			<div className="board">
				{
					!this.state.win ? this.state.filled ? <div className="filled-message">Now it becomes interesting.You can overwrite your opponent's moves.</div> : null : null
				}
				<div className="status">{status}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
		return (
			<div className="game">
				<div className="game-board">
					<Board />
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

const calculateWinner = squares => {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	let win;
	lines.forEach(line => {
		// Checks if there is line of three same symbols. Return is the winner "X" or "O", else it returns null.
		if (squares[line[0]] != null && squares[line[0]] === squares[line[1]] && squares[line[0]] === squares[line[2]]) win = squares[line[0]];
	});
	return win;
}

// Checks all 9 fields in the board. If all of them are filled, function returns the initial true value. If it finds one empty field, it returns false.
const boardFilled = (squares => {
	let filled = true;
	squares.forEach(square => {if (!square) filled = false});
	return filled;
});

