import { useState, useEffect } from "react";
import ChessTile from "./ChessTile";
import "./ChessGame.css";
import Piece  from "./Piece";
import { Movements } from "./movements";
import { gameMusic } from "../sounds";
import Promotion from "./Promotion";

export default function ChessBoard() {
    const gameSound = new Audio(gameMusic)
    const boardSize = 8;
    const [promoting, setPromoting] = useState(false);
    const [activeSquare, setActiveSquare] = useState(null)
    const [board, setBoard] = useState(
        Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null))
    );
    const [moves, setMoves] = useState(
        Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null))
    );
    const moveSets = new Movements(board)
    const [turn, setTurn] = useState("white")
    const [promotionColor, setPromotionColor] = useState(null)

    useEffect(() => {
        initialize_board();
        initializeSound();
    }, []);

    function initialize_board() {
        let newBoard = [...board];
        newBoard[0] = [
            new Piece("rook", "black"),
            new Piece("knight", "black"),
            new Piece("bishop", "black"),
            new Piece("queen", "black"),
            new Piece("king", "black"),
            new Piece("bishop", "black"),
            new Piece("knight", "black"),
            new Piece("rook", "black"),
        ];
        newBoard[1] = Array(boardSize).fill(null).map(() => new Piece("pawn", "black"));
        newBoard[6] = Array(boardSize).fill(null).map(() => new Piece("pawn", "white"));
        newBoard[7] = [
            new Piece("rook", "white"),
            new Piece("knight", "white"),
            new Piece("bishop", "white"),
            new Piece("queen", "white"),
            new Piece("king", "white"),
            new Piece("bishop", "white"),
            new Piece("knight", "white"),
            new Piece("rook", "white"),
        ];
        setBoard(newBoard);

    }

    function initializeSound(){
        gameSound.loop = true
        gameSound.volume = 0.5
        gameSound.play()
    }

    function highlightSquares(squares) {
        let newMoves = Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null));

        squares.map((square) => {
            newMoves[square[0]][square[1]] = "Highlight";
        });
        setMoves(newMoves);
    }

    function movePiece(square) {
        /*
        Create a copy of the board, update it with the moved piece
        Then handle any actions that happen due to the move
        Finally update the board
        */
        let newBoard = [...board]
        let piece = board[activeSquare[0]][activeSquare[1]]
        let targetSquare = board[square[0]][square[1]]

        newBoard[square[0]][square[1]] = piece
        newBoard[activeSquare[0]][activeSquare[1]] =  null

        piece.hasMoved = true
        if (targetSquare === null){
            piece.onMove()
        }
        else{
            piece.onTaking()
        }

        if (piece.name === "pawn" && ((square[0] === 0 && piece.color === "white") ||  (square[0] === boardSize-1 && piece.color === "black"))){
            setPromoting(true)
            setActiveSquare(square)
            setPromotionColor(piece.color)
        }

        setBoard(newBoard)
        setMoves(Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null)))
    }

    function handleClick(square, piece){
        /*  
        Handle the events that come with clicking on a tile (order matters here):
        1. If clicked on a sqaure the piece can move to, move it (event with highest priotiy)
        2. If the clicked square is not of the color of the opposing turn (turn management)
            (if its whites turn it cannot click on black pieces)
        3. Dont do anything if an empty square was clicked (always should happen for empty square)
        4. Otherwise show the possible moves of that piece (always should happen for a piece)
        */
        if (promoting){
            if (piece.isPromotion){
                handlePromotionClick(piece)
            }
            return
            
        }

        if (isMove(square) === true) {
            movePiece(square)
            if (!promoting){
                setTurn(turn === "white"? "black": "white")
            }
            return
        }

        if (!(piece === null || piece.color === turn)){
            return
        }
        
        if (piece === null){
            return
        }

        let squares = moveSets.getMoves(piece, square)

        highlightSquares(squares);
        setActiveSquare(square)
    }

    function handlePromotionClick(piece){
        let newBoard = [...board]
        newBoard[activeSquare[0]][activeSquare[1]] = piece
        setBoard(newBoard)
        setPromoting(false)
        piece.onPromotion()

    }
    
    function isMove(square) {
        return moves[square[0]][square[1]] === "Highlight"
    }

    const Pieces = ["rook", "knight", "bishop", "queen"]

    return (
        <div className="layout">
            <div className="ChessBoard">
                {board.map((row, rowIndex) => {
                    return (
                        row.map((piece, columnIndex) => {
                            let tileNumber = rowIndex * boardSize + columnIndex;
                            return (
                                <ChessTile
                                    key={"tile" + tileNumber}
                                    piece={piece}
                                    square = {[rowIndex, columnIndex]}
                                    isMove = {isMove}
                                    handleClick = {handleClick}
                                />
                            );
                        })
                    );
                })}
            </div>
                
            {promoting? 
                <div className="Promoting">{
                    Pieces.map((piece) => {
                        return (
                            <ChessTile
                                key={"promoting"}
                                piece={Object.create(new Piece(piece, promotionColor), { isPromotion: {value: true}})}
                                square = {activeSquare}
                                isMove = {isMove}
                                handleClick = {handleClick}
                        />
                        )
                    })
                }
                </div> : null
            }
        </div>
    );
}
