import { useState, useEffect } from "react";
import ChessTile from "./ChessTile";
import "./ChessGame.css";
import { Pawn, Bishop, King, Knight, Queen, Rook } from "./Pieces";

export default function ChessBoard() {
    const boardSize = 8;
    const [board, setBoard] = useState(
        Array(boardSize)
            .fill(null)
            .map((row) => new Array(boardSize).fill(null))
    );
    const [moves, setMoves] = useState(
        Array(boardSize)
            .fill(null)
            .map((row) => new Array(boardSize).fill(null))
    );

    const [activeSquare, setActiveSquare] = useState(null)


    useEffect(() => {
        initialize_board();
    }, []);

    function initialize_board() {
        let newBoard = [...board];
        newBoard[0] = [
            <Rook color="black" />,
            <Knight color="black" />,
            <Bishop color="black" />,
            <Queen color="black" />,
            <King color="black" />,
            <Bishop color="black" />,
            <Knight color="black" />,
            <Rook color="black" />,
        ];
        newBoard[1] = Array(boardSize).fill(<Pawn color="black" />);
        newBoard[6] = Array(boardSize).fill(<Pawn color="white" />);
        newBoard[7] = [
            <Rook color="white" />,
            <Knight color="white" />,
            <Bishop color="white" />,
            <King color="white" />,
            <Queen color="white" />,
            <Bishop color="white" />,
            <Knight color="white" />,
            <Rook color="white" />,
        ];
        setBoard(newBoard);
    }

    function isLightSquare(row_index, column_index) {
        let even_row = row_index % 2;
        let even_column = column_index % 2;
        return even_column === even_row;
    }

    function isMoveable(row, column) {
        return moves[row][column] === "Highlight"
    }

    function highlightSquares(squares) {
        let newBoard = Array(boardSize)
            .fill(null)
            .map((row) => new Array(boardSize).fill(null));

        squares.map((square) => {
            newBoard[square[0]][square[1]] = "Highlight";
        });
        setMoves(newBoard);
    }

    function movePiece(newRow, newColumn) {
        let newBoard = [...board]
        newBoard[newRow][newColumn] = board[activeSquare[0]][activeSquare[1]]
        newBoard[activeSquare[0]][activeSquare[1]] =  null
        setBoard(newBoard)
        setMoves(Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null)))
    }

    return (
        <div className="ChessBoard">
            {" "}
            {board.map((row, row_index) => {
                return (
                    <div key={row_index}>
                        {" "}
                        {row.map((value, column_index) => {
                            let tileNumber = row_index * boardSize + column_index;
                            return (
                                <ChessTile
                                    key={"tile" + tileNumber}
                                    isLightSquare={isLightSquare(row_index, column_index)}
                                    isMoveable={isMoveable(row_index, column_index)}
                                    value={value}
                                    column={column_index}
                                    row={row_index}
                                    highlightSquares={highlightSquares}
                                    movePiece = {movePiece}
                                    board={board}
                                    moves={moves}
                                    setActiveSquare = {setActiveSquare}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
