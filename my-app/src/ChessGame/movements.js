class Movements {
    constructor(board){
        this.board = board
        this.boardSize = 8
    }

    getMoves(piece, square){
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

    #movePawn(square, piece) {
        /*
        Checks which squares are available to the pawn by
        1. Checking if it can move 1 forward
        1.1. Check if it can move 2 forward
        2. Check if there is an opponnent on the diagonals
        */
        let availableSquares = []
        let moveDirection = piece.color === "white"? -1:1

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

   

    #moveKing(square, piece ) {
        /*
        Checks which squares are available to the king by evaluating the generic moveset
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
        return (this.board[square[0]][square[1]] !== null) && (this.board[square[0]][square[1]] !== "Highlight")   
    }

    #isOutOfBounds(square){
        let rowOutBounds = (square[0] < 0) || (square[0] >= this.boardSize)
        let columnOutBounds = (square[1] < 0) || (square[1] >= this.boardSize)
        return rowOutBounds || columnOutBounds
    }

    #isOpponent(square, color){
        return this.board[square[0]][square[1]].color !== color
    }


}

export {Movements}