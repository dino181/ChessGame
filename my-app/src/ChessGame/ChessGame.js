import { useState, useEffect } from "react";
import ChessTile from "./ChessTile";
import "./ChessGame.css";
import Piece  from "./Piece";
import { Movements } from "./movements";
import { gameMusic, start} from "../sounds";

export default function ChessBoard() {
    // Set pawns doubleMove sound
    const whitePawnDouble = start
    const blackPawnDouble = start


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
    const [checkmate, setCheckmate] = useState(false)
    const [check, setCheck] = useState(false)
    const [checkMovables, setCheckMovables] = useState([])

    // On boot/page refresh reset the sound and board
    useEffect(() => {
        initialize_board();
        initializeSound();
    }, []);

    function initialize_board() {
        /*
        Initializes a standard chess board
        */
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

        newBoard[1] = Array(boardSize).fill(null).map(() => Object.create(new Piece("pawn", "black"), {"doubleSound": {value: new Audio(whitePawnDouble)}, 
                                                                            "onDouble": {value: function () {this.doubleSound.play()}}}));
        newBoard[6] = Array(boardSize).fill(null).map(() => Object.create(new Piece("pawn", "white"), {"doubleSound": {value: new Audio(blackPawnDouble)}, 
                                                                            "onDouble": {value: function () {this.doubleSound.play()}}}));
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
        /*Initializes the background sound*/
        gameSound.loop = true
        gameSound.volume = 0.5
        gameSound.play()
    }

    function highlightSquares(squares) {
        /*
        Marks the squares that should be highlighted (the piece can be moved to).
        Blocks squares that contain the king.
        */
        let newMoves = Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null));

        squares.map((square) => {
            if (board[square[0]][square[1]] !== null && board[square[0]][square[1]].name === "king"){
                return null
            }
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
            targetSquare.onTaken()
        }

        if (piece.name === "pawn" && ((square[0] === 0 && piece.color === "white") ||  (square[0] === boardSize-1 && piece.color === "black"))){
            setPromoting(true)
            setActiveSquare(square)
            setPromotionColor(piece.color)
        }

        if (piece.name === "pawn" && ((piece.color === "white" && (activeSquare[0] - square[0] === 2)) ||  (piece.color === "black" && (square[0]-activeSquare[0] === 2)))){
            piece.onDouble()
        }

        setBoard(newBoard)
        setMoves(Array(boardSize).fill(null).map((row) => new Array(boardSize).fill(null)))       
        
    }

    function handleClick(square, piece){
        /*  
        Handle the events that come with clicking on a tile (order matters here):
        1. If checkmated dont do anything
        2. handle promoting pieces
        3. handle clicking on a square the piece can move to
        4. handle selecting a piece on the board
        5. block clicking on the opposing colors during a turn
        6. dont do anything when clicking on an empty square
        7. Show possible moves of piece
        */

        if (checkmate){
            return
        }

        if (promoting){
            if (piece.isPromotion){
                handlePromotionClick(piece)
                setTurn(turn === "white"? "black": "white")
                updateGameState()
                setTurn(turn === "white"? "black": "white")
            }
            return
            
        }

        if (isMove(square) === true) {
            movePiece(square)
            updateGameState()
            setTurn(turn === "white"? "black": "white")
            return
        }


        if (check && piece !== null && checkMovables !== null){
            let movable = false
            checkMovables.forEach((sqr) => {
                if (sqr[0] === square[0] && sqr[1] === square[1]){
                    movable = true
                }
            })

            if (!movable){
                return
            }
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
        /*
        Updates the board with a promoted piece and removes the promotion menu
        */
        let newBoard = [...board]
        newBoard[activeSquare[0]][activeSquare[1]] = piece
        setBoard(newBoard)
        setPromoting(false)
        piece.onPromotion()

    }
    
    function isMove(square) {
        /*
        Checks if the square can be moved to
        */
        return moves[square[0]][square[1]] === "Highlight"
    }

    function updateGameState(){
        /*
        Updates the game state by checking if the opposing king is checked/checkmated
        */
        let color = turn === "white" ? "black":"white"
        let kingData = findKing(color)
        let king = kingData[0]
        let square = kingData[1]

        let kingMoves = moveSets.kingChecked(king, square)
        let isCheck = kingMoves[0]
        let isCheckmate = kingMoves[1]
        let moveablePieces = kingMoves[2]

        if (isCheckmate){
            setCheckmate(true)
            let checkmateSound = color === "white" ? start : start
            let checkmateAudio = new Audio(checkmateSound)
            checkmateAudio.play()
            return
        }
        if (isCheck){
            setCheckMovables(moveablePieces)
            setCheck(true)

            let checkSound = color === "white" ? start : start
            let checkAudio = new Audio(checkSound)
            checkAudio.play()
            return 
        }

        setCheck(false)
    }
    
    function findKing(color){
        /*
        Finds the square that holds the king of the given color
        */
        let king = null
        let square = null
        board.map((row, rowIndex) => {
            row.map((piece, columnIndex) => {
                if(piece !== null && piece.name==="king" && piece.color === color){
                    king = piece
                    square = [rowIndex, columnIndex]
                    return null
                }
            })
        })
        return [king, square]
    }

    // Pieces for the promoting screen
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
