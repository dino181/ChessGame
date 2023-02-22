import Piece from "./Piece"
import { start } from "../sounds"


//======= MAKE A CUSTOM BOARD =======
/*
pieces:                   colors:
 R   - rook                B - black
 H   - knight (horse)      W - white
 B   - bishop
 Q   - queen
 K   - king
 P   - pawn  
 --  - no piece 
*/
const BOARD = 
"WR WH WB WQ WK WB WH WR" + " " + 
"WP WP WP WP WP WP WP WP" + " " + 
"-- -- -- -- -- -- -- --" + " " + 
"-- -- -- -- -- -- -- --" + " " + 
"-- -- -- -- -- -- -- --" + " " + 
"-- -- -- -- -- -- -- --" + " " + 
"BP BP BP BP BP BP BP BP" + " " + 
"BR BH BB BQ BK BB BH BR"
//===================================

//=========== ADD SOUNDS ============
const whitePawnDouble = start
const blackPawnDouble = start
const blackShortCastle = start
const whiteShortCastle = start
const blackLongCastle = start
const whiteLongCastle = start


export default function createBoard(){
    let pieces = BOARD.split(/\s+/)
    let boardSize = 8
    let board = []
    let row = []
    pieces.forEach((piece, index) => {
        if (piece === "-" || piece === "--"){
            row.push(null)
        }
        else{
            row.push(createPiece(piece))
        }

        if (index%boardSize === 7){
            board.push(row)
            row = []
        }
    })
    return board
}

function createPiece(pieceString){
    let pieceInfo = pieceString.split("")
    let color = pieceInfo[0] === "W"? "white":"black"
    let piece = pieceInfo[1]
    return pieceSelector(color, piece)

}

function pieceSelector(color, piece){
    switch(piece){
        case "R": 
            return new Piece("rook", color)

        case "H": 
            return new Piece("knight", color)

        case "B": 
            return new Piece("bishop", color)

        case "P": 
            let pawnDouble = color === "white" ? whitePawnDouble : blackPawnDouble
            return Object.create(new Piece("pawn", color), {"doubleAudio": {value: new Audio(pawnDouble)}, 
                                                              "onDouble": {value: function () {this.doubleAudio.play()}}})
            

        case "K": 
            let shortCastle = color === "white" ? whiteShortCastle: blackShortCastle
            let longCastle  = color === "white" ? whiteLongCastle: blackLongCastle
            return Object.create(new Piece("king", color), {"shortCastleAudio": {value: new Audio(shortCastle)}, 
                                                "onShortCastle":{value: function () {this.shortCastleAudio.play()}},
                                                "longCastleAudio": {value: new Audio(longCastle)}, 
                                                "onLongCastle":{value: function () {this.longCastleAudio.play()}}})

        case "Q": 
            return new Piece("queen", color)

        default:
            return null
    }
    
}