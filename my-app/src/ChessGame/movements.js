import Piece from "./Piece";

class Movements {
    constructor(board){
        this.board = board
        this.boardSize = 8
        this.whiteDirection = 1 // Set to 1 for moving down and 1 for moving up
        this.blackDirection = -1 * this.whiteDirection // Inverse of the whiteDirection

    }

    getMoves(piece, square){
        /*
        Gets the moveset for the given piece
        */
        let squares = null
        switch(piece.name){
            case "pawn":
                squares = this.#movePawn(square, piece);
                break 

            case "rook":
                squares = this.#moveRook(square, piece);
                break 

            case "knight":
                squares = this.#moveKnight(square, piece);
                break 

            case "bishop":
                squares = this.#moveBishop(square, piece);
                break 

            case "queen":
                squares = this.#moveQueen(square, piece);
                break 

            case "king":
                squares = this.#moveKing(square, piece);
                break 

            default:
                console.log("Something went wrong");
                break
            
        }
        return squares
    }

    getCheckInfo(king, square){
        /*
        Checks if the given king is checked, checkmated or neither by:
        1. Get all pieces that can attack the king 
        2. If there are pieces that can attack the king, there is not check/checkmate
        3. Otherwise, check if the piece checking/checkmating the king be taken
        4. Otherwise, Check if the king can move
        5. lastly check if the king cannot because it is enclosed by its own color
        if any of 3-5 pass, the king is checked, if they all fail the king is checkmated

        Returns a list that contains all the info of the check/checkmate state:
        [is check, is checkmate, the pieces attacking the king, the pieces that can counter attack]
        */


        let attackingPieces = this.#getAttackingPieces(square,king)
        let isCheck = attackingPieces.length !== 0 

        if (!isCheck){
            return [false, false, null, null]
        }

        let isCheckmate = false
        let moveablePieces = []
        attackingPieces.forEach((sqr) => {
            moveablePieces = [...moveablePieces, ...this.#getAttackingPieces(sqr,this.board[sqr[0]][sqr[1]])]
        })

        if (moveablePieces.length !== 0){

            return [isCheck, isCheckmate, attackingPieces, moveablePieces]
        }

        let squares = this.#moveKing(square, king)

        if (squares.length > 0){
            return [isCheck, isCheckmate, null, null]
        }

        let newSquare = null
        let kingMoves = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
        let sameColorAound = 0

        kingMoves.map((move) => {
            newSquare = [square[0]+move[0], square[1]+move[1]]
            if(this.#isOutOfBounds(newSquare)){
                sameColorAound++
                return null
            }
            if(this.#isOccupied(newSquare) && !this.#isOpponent(newSquare, king.color)){
                sameColorAound++
                return null 
            }    
        })

        if (sameColorAound ===8){

            return [isCheck, isCheckmate, null, null]
        }


        
        isCheckmate = true
        return [isCheck, isCheckmate, null, null]

    }

    #movePawn(square, piece) {
        /*
        Checks which squares are available to the pawn by
        1. Checking if it can move 1 forward
        1.1. Check if it can move 2 forward
        2. Check if there is an opponnent on the diagonals
        */
        let availableSquares = []
        let moveDirection = piece.color === "white"? this.whiteDirection:this.blackDirection

        let newSquare = [square[0] + 1*moveDirection, square[1]]

        /* Checks moving forward and double forward*/
        if(!this.#isOutOfBounds(newSquare) && !this.#isOccupied(newSquare)){
            availableSquares.push(newSquare)

            newSquare = [square[0] + 2*moveDirection, square[1]]
            if(!piece.hasMoved && !this.#isOutOfBounds(newSquare) && !this.#isOccupied(newSquare)){
                availableSquares.push(newSquare)
            }
        }

        /* Checks for pawn on diagonals */
        newSquare = [square[0] + 1*moveDirection, square[1]+1]
        if (!this.#isOutOfBounds(newSquare) && this.#isOccupied(newSquare) && this.#isOpponent(newSquare, piece.color)){
            availableSquares.push(newSquare)   
        }

        newSquare = [square[0] + 1*moveDirection, square[1]-1]
        if (!this.#isOutOfBounds(newSquare) && this.#isOccupied(newSquare) && this.#isOpponent(newSquare, piece.color)){
            availableSquares.push(newSquare)   
        }

        return availableSquares
    }

    #moveRook(square, piece) {
        /*
        Checks which squares are available to the rook by taking its current position
        and check all axes to the edge of the board until a occupied square is found
        */
        let availableSquares = []
        let newSquare = null

        /* from current position downwards */ 
        for (let i = square[0]+1; i < this.boardSize; i++){
            newSquare = [i, square[1]]
            if (this.#isOccupied(newSquare)){
                if (this.#isOpponent(newSquare, piece.color)){
                    availableSquares.push(newSquare)
                }
                break
            }
            availableSquares.push(newSquare)
        }

        /* from current position upwards */ 
        for (let i = square[0]-1; i >= 0; i--){
            newSquare = [i, square[1]]
            if (this.#isOccupied(newSquare)){
                if (this.#isOpponent(newSquare, piece.color)){
                    availableSquares.push(newSquare)
                }
                break
            }
            availableSquares.push(newSquare)
        }

        /* from current position to the right */ 
        for (let i = square[1]+1; i < this.boardSize; i++){
            newSquare = [square[0], i]
            if (this.#isOccupied(newSquare)){
                if (this.#isOpponent(newSquare, piece.color)){
                    availableSquares.push(newSquare)
                }
                break
            }
            availableSquares.push(newSquare)
        }

        /* from current position to the left */ 
        for (let i = square[1]-1; i >= 0; i--){
            newSquare = [square[0], i]
            if (this.#isOccupied(newSquare)){
                if (this.#isOpponent(newSquare, piece.color)){
                    availableSquares.push(newSquare)
                }
                break
            }
            availableSquares.push(newSquare)
        }
            
        return availableSquares

    }

    #moveKnight( square, piece) {
        /* 
        Checks which squares are available to the knight by evaluating the generic moveset
        1. Check if the square is out of bounds
        2. Is the square occupied by a piece of the same color
        If they both fail the tile is free and add it to the possible squares
        */
        let availableSquares = []
        let newSquare = null
        let knightMoves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]


        knightMoves.map((move) => {
            newSquare = [square[0]+move[0], square[1]+move[1]]
            if(this.#isOutOfBounds(newSquare)){
                return null
            }
            if(this.#isOccupied(newSquare) && !this.#isOpponent(newSquare, piece.color)){
                return null
            }

            availableSquares.push(newSquare)        
        })

        return availableSquares
    }

    #moveBishop(square, piece){
        /*
        Checks which squares are available to the bishop by evaluating the diagonals. 
        The evaluation loops over a range the size of the board, which results in 
        checking squares out of bounds. Thus:
        1. Check if square is out of bounds
        2. Check if square is occupied
        2.1. Check if occupant is an opponent
        If both fail the tile is free and add it to the available squares

        */
        let availableSquares = []
        let newSquare = null
        let diagonals = [[-1,-1], [-1,1],[1,1],[1,-1]]

        diagonals.map((diagonal) => {       
            for (let i = 1; i < this.boardSize; i++){
                newSquare = [square[0]+ i*diagonal[0],square[1]+ i*diagonal[1]]
                if(this.#isOutOfBounds(newSquare)){
                    break
                }
                if(this.#isOccupied(newSquare)){
                    if (this.#isOpponent(newSquare, piece.color)){
                        availableSquares.push(newSquare)
                    }
                    break
                }
                availableSquares.push(newSquare)               
            }
        })
        return availableSquares

    }


    #moveQueen(square, piece){
        /*
        Checks which squares are available to the Queen by 
        combining the movesets of rook and bishop
        */
        let rookMoves = this.#moveRook(square, piece)
        let bishopMoves = this.#moveBishop(square, piece)

        let availableSquares = [...rookMoves, ...bishopMoves]
        return availableSquares
    }

   

    #moveKing(square, piece) {
        /*
        Checks which squares are available to the king by evaluating the generic moveset
        1. Check if the square is out of bounds
        2. Is the square occupied by the same color
        3. Check if the square cannot be attacked by the opponent
        afterw going through all moves check for castling
        */

        this.board[square[0]][square[1]] = null

        let availableSquares = []
        let newSquare = null

        let kingMoves = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
        kingMoves.map((move) => {
            newSquare = [square[0]+move[0], square[1]+move[1]]
            if(this.#isOutOfBounds(newSquare)){
                return null
            }

            if(this.#isOccupied(newSquare) && !this.#isOpponent(newSquare,piece.color)){
                return null
            }

            if (this.#getAttackingPieces(newSquare,piece).length !== 0){
                return null
            }

            availableSquares.push(newSquare)
        })

        if (piece.hasMoved){
            this.board[square[0]][square[1]] = piece
            return availableSquares
        }


        // short castle
        let cornerPiece = this.board[square[0]][square[1]+3]
        if (this.board[square[0]][square[1]+1] === null && this.board[square[0]][square[1]+2] === null && cornerPiece !== null){
            if(cornerPiece.name === "rook" && !cornerPiece.hasMoved && !piece.hasMoved){
                availableSquares.push([square[0], square[1]+2])
            }
        }

        cornerPiece = this.board[square[0]][square[1]-4]
        if (this.board[square[0]][square[1]-1] === null && this.board[square[0]][square[1]-2] === null && this.board[square[0]][square[1]-3] === null&& cornerPiece !== null){
            if(cornerPiece.name === "rook" && !cornerPiece.hasMoved && !piece.hasMoved){
                availableSquares.push([square[0], square[1]-2])
            }
        }

        // long castle
        this.board[square[0]][square[1]] = piece
        return availableSquares

    }

    #getAttackingPieces(square,piece){
        /*
        Retrieves a list of every piece that can attack the one 
        specified by the square and piece arguments.
        */
        let testPiece = new Piece("testPiece", piece.color)
        testPiece.hasMoved = true

        let moves = null
        let squares = []

        moves = this.#moveRook(square, testPiece)
        squares = [...squares, ...this.#findPieceInMoves("rook", moves)]
        squares = [...squares, ...this.#findPieceInMoves("queen", moves)]

        moves = this.#moveBishop(square, testPiece)
        squares = [...squares, ...this.#findPieceInMoves("bishop", moves)]
        squares = [...squares, ...this.#findPieceInMoves("queen", moves)]

        moves = this.#moveKnight(square, testPiece)
        squares = [...squares, ...this.#findPieceInMoves("knight", moves)]

        moves = this.#movePawn(square, testPiece)
        squares = [...squares, ...this.#findPieceInMoves("pawn", moves)]

        moves = this.#moveKingCheck(square, testPiece)
        squares = [...squares, ...this.#findPieceInMoves("king", moves)]

        squares = squares.filter((sqr) => sqr !== null)
        return squares
    }

    #findPieceInMoves(pieceName, moves){
        /*
        Finds all occurences of a piece with the specified name 
        in the provided moves.
        */
        let squares = []
        moves.forEach((move) => {
            let piece = this.board[move[0]][move[1]]
            if (piece !== null && piece.name === pieceName){
                squares.push(move)
            }
        });

        if (squares.length === 0){
            squares.push(null)
        }
        return squares
    }


    #moveKingCheck(square, piece) {
        /*
        Checks which squares will be attackable from an opponent king 
        Here only the squares around the king are checked
        1. Check if the square is out of bounds
        2. Is the square occupied by the same color
        */
        let availableSquares = []
        let newSquare = null
        let kingMoves = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
        kingMoves.map((move) => {
            newSquare = [square[0]+move[0], square[1]+move[1]]
            if(this.#isOutOfBounds(newSquare)){
                return null
            }

            if(this.#isOccupied(newSquare) && !this.#isOpponent(newSquare,piece.color)){
                return null
            }

            availableSquares.push(newSquare)
        })
        return availableSquares
    }

    #isOccupied(square){
        /*
        Checks if the square is occupied by a piece or not 
        */
        return (this.board[square[0]][square[1]] !== null) && (this.board[square[0]][square[1]] !== "Highlight")   
    }

    #isOutOfBounds(square){
        /*
        Checks if the square is out of bounds 
        */
        let rowOutBounds = (square[0] < 0) || (square[0] >= this.boardSize)
        let columnOutBounds = (square[1] < 0) || (square[1] >= this.boardSize)
        return rowOutBounds || columnOutBounds
    }

    #isOpponent(square, color){
        /*
        Checks if the piece on the given square is of the opposite color
        */
        return this.board[square[0]][square[1]].color !== color
    }


}

export {Movements}