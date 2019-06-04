import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	
	return (
			<button className={"square "+props.win} onClick={props.onClick}>
				{props.value}
			</button>		
	);
	
}

class Board extends React.Component {
	
  renderSquare(i,j, win) {		
    return (
			<Square key={i}
			win = {win}
			value={this.props.squares[i]} 
			onClick ={() => this.props.onClick(i,j)} />
			);
  }
  
  render() {

	let parent = [];
	let num_of_square;
	let num = 0;
	let win = '';
	
	console.log(this.props.win);
	
	for (let i=0; i<3; i++) {

		let child = [];
		num_of_square = (i * 3); 
		
		for (let j=1; j<4; j++) {
			
			if (this.props.win && ( num_of_square === this.props.win[1][0] || num_of_square === this.props.win[1][1] || num_of_square === this.props.win[1][2])) {

				win = 'color';

			}
			
			child.push(this.renderSquare(num_of_square,j, win));
			num_of_square++;
			win = '';
		}
		parent.push(<div className="board-row" key={num}>{child}</div>);
		num++;
	}
	
    return (
      <div>
	  {parent}
      </div>
    );
  }
}

class Game extends React.Component {
	
  constructor(props) {

	super(props);
	this.state = {
		
		history: [{  squares: Array(9).fill(null), lastmove: {x:0,y:0} }],
		stepNumber: 0,
		xIsNext: true,
		ascendingOrder: true, //Add a toggle button that lets you sort the moves in either ascending or descending order.
	
	};

  }
 
  handleClick(i,j) {
	  	
	const history = this.state.history.slice(0, this.state.stepNumber + 1);
	const current = history[history.length - 1];	
	const squares = current.squares.slice();
	const x1 = Math.floor(i / 3) + 1;
		
	if (calculateWinner(squares) || squares[i]) {
		return;
	}
	squares[i] = this.state.xIsNext ? 'X' : 'O';

	this.setState({
	
		history: history.concat([{ squares: squares, lastmove: {x:x1,y:j} }]),
		xIsNext: !this.state.xIsNext,
		stepNumber: history.length,
	});

  }	
 
  jumpTo(step) {
	  	
	this.setState({ 
	
		stepNumber: step,
		xIsNext: (step % 2) === 0,
	
	})	
	
  }
  
  handletoggle() {
	  
	this.setState({
		
		ascendingOrder: !this.state.ascendingOrder,
		
	});

  }	

  render() {
	
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner  = calculateWinner(current.squares);
	
	const moves = history.map((step, move) => {
			
			const desc = move ? 'Go to move#' + move : 	'Go to game start';
			if (move) {
				
				var lastmove = " (" + step.lastmove.x + "," + step.lastmove.y + ")" 	
				
			}
			
			
			return (
			
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}<b>{lastmove}</b></button>
				</li>
			);
	});
		
	if (!this.state.ascendingOrder) {
		
	
		moves.sort((a, b) => {return b.key-a.key;});
	
	
	}
	
	let status;
	if (winner) {
			
		status = 'Winner: ' + winner[0];
	
	} else {
		
		if (this.state.stepNumber === 9) {
			
			status = 'The match was a draw';
		
		} else {
		
			status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');	 
		}
	}

	let order = this.state.ascendingOrder ? 'Ascending' : 'Descending'; 
	 
    return (
      <div className="game">
        <div className="game-board">
          <Board 
			win = {winner}
			squares = {current.squares}
			onClick={(i,j) => this.handleClick(i,j)}
		  />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
		  <button onClick={() => this.handletoggle()}>Change Order ({order})</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return ([squares[a], lines[i]]);
    }
  }
  return null;
}