import { useState, useEffect } from "react";
import ChessTile from "./ChessTile";
import "./ChessGame.css";
import Piece  from "./Piece";
import { Movements } from "./movements";
import { gameMusic, start} from "../sounds";
import createBoard from "./ChessBoard";

export default function ChessBoard() {
    // Set special sounds
    // ======= ADD CUSTOM SOUNDS ======= 
    const checkmateSoundWhite = start
    const checkmateSoundBlack = start
    const checkSoundWhite = start
    const checkSoundBlack = start
    const gameSound = new Audio(gameMusic)
    // =================================
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
    const [defendingPieces, setDefendingPieces] = useState([])
    const [attackingPieces, setAttackingPieces] = useState()

    // On boot/page refresh reset the sound and board
    useEffect(() => {
        setBoard(createBoard())
        // initialize_board();
        initializeSound();
    }, []);

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

        if (piece.name === "king" && (square[1] - activeSquare[1] === 2)){
            let rook = board[square[0]][square[1]+1]
            board[square[0]][square[1]-1] = rook
            board[square[0]][square[1]+1] = null
            piece.onShortCastle()
        }

        if (piece.name === "king" && (activeSquare[1] - square[1] === 2)){
            let rook = board[square[0]][square[1]-2]
            board[square[0]][square[1]+1] = rook
            board[square[0]][square[1]-2] = null
            piece.onLongCastle()
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
                updateGameState(turn)
            }
            return
            
        }

        if (isMove(square) === true) {
            movePiece(square)
            updateGameState(turn === "white" ? "black":"white")
            setTurn(turn === "white"? "black": "white")
            return
        }


        if (check && piece !== null && defendingPieces !== null && piece.name !== "king"){
            let moves = moveSets.getMoves(piece, square)
            let squares = []
            moves.forEach((move) => {
                attackingPieces.forEach((attackingPiece) => {
                    if (move[0] === attackingPiece[0] && move[1] === attackingPiece[1]){
                        squares.push(move)
                    }
                })
            });

            highlightSquares(squares);
            setActiveSquare(square)
            
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

    function updateGameState(color){
        /*
        Updates the game state by checking if the opposing king is checked/checkmated
        */
        let kingData = findKing(color)
        let king = kingData[0]
        let square = kingData[1]

        let checkInfo = moveSets.getCheckInfo(king, square)
        let isCheck = checkInfo[0]
        let isCheckmate = checkInfo[1]
        let attackingPieces = checkInfo[2]
        let defendingPieces = checkInfo[3]

        if (isCheckmate){
            setCheckmate(true)
            let checkmateSound = color === "white" ? checkmateSoundWhite : checkmateSoundBlack
            let checkmateAudio = new Audio(checkmateSound)
            checkmateAudio.play()
            return
        }
        if (isCheck){
            setAttackingPieces(attackingPieces)
            setDefendingPieces(defendingPieces)
            setCheck(true)

            let checkSound = color === "white" ? checkSoundWhite : checkSoundBlack
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
