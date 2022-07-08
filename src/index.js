import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Simple component, that represents each field on board. It is clickable and it shows either "X", "O", or nothing.
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
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div className="board">
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
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			currentStep: 0,
			currentPlayer: "X",
			win: null,
			filled: false,
		};
	}

	jumpTo(stepNum) {
		this.setState({
			currentStep: stepNum,
			currentPlayer: (stepNum % 2 === 0) ? "X" : "O",
			win: null,
			filled: false,
		});
	}

	handleClick(i) {
		// Continues only if the game is not won yet
		if (!this.state.win) {
			const history = this.state.history.slice(0, this.state.currentStep + 1);
			// Takes the last board squares status from history
			const squares = [...history[history.length - 1].squares];
			const filled = boardFilled(squares);

			// If the selected field is empty or the game board is full, write the value into the field
			if (!squares[i] || filled) {
				squares[i] = this.state.currentPlayer;
				// Adds new squares to the history and changes the state values 
				this.setState({
					history: history.concat([{
						squares: squares,
					}]),
					currentStep: history.length,
					currentPlayer: this.state.currentPlayer === "X" ? "O" : "X",
					win: calculateWinner(squares),
					filled: boardFilled(squares),
				});
			}
		}
	}

	render() {
		// Saves current game board state to const
		const history = this.state.history;
		const current = history[this.state.currentStep];

		const moves = history.map((squares, i) => {
			const buttonText = i ? `Go to move #${i}` : `Go to game START`;
			return ((history.length !== 1) ? (
				<button key={i} onClick={() => this.jumpTo(i)}>{buttonText}</button>
			) : null);
		});

		const status = this.state.win ? `${this.state.win} won!` : `Current player: ${this.state.currentPlayer}`;

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div className="game-status">{status}</div>
					{
						!this.state.win ? this.state.filled ? <div className="filled-message">Now it becomes interesting.You can overwrite your opponent's moves.</div> : null : null
					}
					<div className="moves">{moves}</div>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// Checks if there is line of three same symbols. Return value is the winner "X" or "O", else it returns null.
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

