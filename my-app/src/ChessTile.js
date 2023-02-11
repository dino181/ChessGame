import "./ChessTile.css";

export default function ChessTile({ isLightSquare, isMoveable, value, column, row, highlightSquares, movePiece, board, setActiveSquare}) {
    const BoardSize = 8

    function handleClick() {
        /*  
        First check if tile is movable.
        Then check if there is a piece on that square.
        If there is a piece show its possible moves.
        */
        if (isMoveable === true) {
            movePiece(row, column)
            return
        }


        if (value === null){
            return
        }

        let color = value.props.color;
        let name = value.type.name
        let tile = [row, column]
        
        setActiveSquare(tile)

        switch(name){
            case "Pawn":
                movePawn(tile,color);
                return 

            case "Rook":
                moveRook(tile,color);
                return 

            case "Knight":
                moveKnight(tile,color);
                return 

            case "Bishop":
                moveBishop(tile,color);
                return 

            case "King":
                moveKing(tile,color);
                return 

            case "Queen":
                moveQueen(tile,color);
                return 

            default:
                console.log("Something went wrong");
                return
            
        }
    }

    function movePawn(currentSquare, color) {
        let availableSquares = []
        switch(color){
            case "white":
                if (!isOccupied(currentSquare[0]-1, currentSquare[1])){
                    availableSquares.push([currentSquare[0]-1, currentSquare[1]])

                    if (currentSquare[0] === 6 && !isOccupied(currentSquare[0]-2, currentSquare[1])){
                        availableSquares.push([currentSquare[0]-2, currentSquare[1]])
                    }
                }



                if (!isOutOfBounds(currentSquare[0]-1, currentSquare[1]+ 1) && isOccupied(currentSquare[0]-1, currentSquare[1]+ 1)){
                    if (getColor(currentSquare[0]-1, currentSquare[1]+ 1) !== color){
                        availableSquares.push([currentSquare[0]-1, currentSquare[1]+ 1])
                    }
                }

                if (!isOutOfBounds(currentSquare[0]-1, currentSquare[1]- 1) && isOccupied(currentSquare[0]-1, currentSquare[1]- 1)){
                    if (getColor(currentSquare[0]-1, currentSquare[1]- 1) !== color){
                        availableSquares.push([currentSquare[0]-1, currentSquare[1]- 1])
                    }
                }
                break
                
            case "black":
                if (!isOccupied(currentSquare[0]+1, currentSquare[1])){
                    availableSquares.push([currentSquare[0]+1, currentSquare[1]])
                }

                if (currentSquare[0] === 1 && !isOccupied(currentSquare[0]+2, currentSquare[1])){
                    availableSquares.push([currentSquare[0]+2, currentSquare[1]])
                }
                break
                


            default:
                break
        }
        highlightSquares(availableSquares)
 
    }

    function moveRook(currentSquare, color) {
        let availableSquares = []

        for (let i= currentSquare[0]+1; i < BoardSize; i++){
            if (isOccupied(i, currentSquare[1])){
                if (getColor(i, currentSquare[1]) !== color){
                    availableSquares.push([i,currentSquare[1]])
                }
                break;
            }
            availableSquares.push([i,currentSquare[1]])
        }

        for (let i= currentSquare[0]-1; i >= 0; i--){
            if (isOccupied(i, currentSquare[1])){
                if (getColor(i, currentSquare[1]) !== color){
                    availableSquares.push([i,currentSquare[1]])
                }
                break;
            }
            availableSquares.push([i,currentSquare[1]])
        }

        for (let i= currentSquare[1]+1; i < BoardSize; i++){
            if (isOccupied(currentSquare[0], i)){
                if (getColor(currentSquare[0], i) !== color){
                    availableSquares.push([currentSquare[0], i])
                }
                break;
            }
            availableSquares.push([currentSquare[0], i])
        }

        for (let i= currentSquare[1]-1; i >= 0; i--){
            if (isOccupied(currentSquare[0], i, color)){
                if (getColor(currentSquare[0], i) !== color){
                    availableSquares.push([currentSquare[0], i])
                }
                break;
            }
            availableSquares.push([currentSquare[0], i])
        }

        highlightSquares(availableSquares)

    }

    function moveKnight( currentSquare, color) {
        let availableSquares = []
        let knightMovements = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
        knightMovements.map((movement) => {
            if (!isOutOfBounds(currentSquare[0]+movement[0], currentSquare[1]+movement[1])){
                if (!isOccupied(currentSquare[0]+movement[0], currentSquare[1]+movement[1])){
                    availableSquares.push([currentSquare[0]+movement[0], currentSquare[1]+movement[1]])
                }
                else if (getColor(currentSquare[0]+movement[0], currentSquare[1]+movement[1]) !== color){
                        availableSquares.push([currentSquare[0]+movement[0], currentSquare[1]+movement[1]])
                    }
            }
        
        })

        highlightSquares(availableSquares)
    }

    function moveBishop( currentSquare, color ) {
        let availableSquares = []

        let blockedOne = false
        let blockedTwo = false
        for (let i = 1; i < BoardSize-currentSquare[0]; i++){
            if (!isOutOfBounds( currentSquare[0] + i, currentSquare[1] + i)) {
                if(!isOccupied(currentSquare[0] + i, currentSquare[1] + i) && !blockedOne){
                    availableSquares.push([currentSquare[0] + i, currentSquare[1] + i])
                }
                else {
                    if (!blockedOne && getColor(currentSquare[0] + i, currentSquare[1] + i) !== color){
                        availableSquares.push([currentSquare[0] + i, currentSquare[1] + i])
                    }
                    blockedOne = true
                }
            }
            if (!isOutOfBounds( currentSquare[0] + i, currentSquare[1] - i)) {
                if(!isOccupied(currentSquare[0] + i, currentSquare[1] - i) && !blockedTwo){
                    availableSquares.push([currentSquare[0] + i, currentSquare[1] - i])
                }
                else {
                    if (!blockedTwo && getColor(currentSquare[0] + i, currentSquare[1] - i) !== color){
                        availableSquares.push([currentSquare[0] + i, currentSquare[1] - i])
                    }
                    blockedTwo = true
                }
            }
        }

        blockedOne = false
        blockedTwo = false
        for (let i = 1; i <= currentSquare[0]; i++){
            if (!isOutOfBounds( currentSquare[0] - i, currentSquare[1] + i)) {
                if(!isOccupied(currentSquare[0] - i, currentSquare[1] + i) && !blockedOne){
                    availableSquares.push([currentSquare[0] - i, currentSquare[1] + i])
                }
                else {
                    if (!blockedOne && getColor(currentSquare[0] - i, currentSquare[1] + i) !== color){
                        availableSquares.push([currentSquare[0] - i, currentSquare[1] + i])
                    }
                    blockedOne = true
                }
            }
            if (!isOutOfBounds( currentSquare[0] - i, currentSquare[1] - i)) {
                if(!isOccupied(currentSquare[0] - i, currentSquare[1] - i) && !blockedTwo){
                    availableSquares.push([currentSquare[0] - i, currentSquare[1] - i])
                }
                else {
                    if (!blockedTwo && getColor(currentSquare[0] - i, currentSquare[1] - i) !== color){
                        availableSquares.push([currentSquare[0] - i, currentSquare[1] - i])
                    }
                    blockedTwo = true
                }
            }
        }

        highlightSquares(availableSquares)
    }

    function moveKing( currentSquare, color ) {
        let availableSquares = []

        for (let i= currentSquare[0]+1; i < BoardSize; i++){
            if (isOccupied(i, currentSquare[1])){
                if (getColor(i, currentSquare[1]) !== color){
                    availableSquares.push([i,currentSquare[1]])
                }
                break;
            }
            availableSquares.push([i,currentSquare[1]])
        }

        for (let i= currentSquare[0]-1; i >= 0; i--){
            if (isOccupied(i, currentSquare[1])){
                if (getColor(i, currentSquare[1]) !== color){
                    availableSquares.push([i,currentSquare[1]])
                }
                break;
            }
            availableSquares.push([i,currentSquare[1]])
        }

        for (let i= currentSquare[1]+1; i < BoardSize; i++){
            if (isOccupied(currentSquare[0], i)){
                if (getColor(currentSquare[0], i) !== color){
                    availableSquares.push([currentSquare[0], i])
                }
                break;
            }
            availableSquares.push([currentSquare[0], i])
        }

        for (let i= currentSquare[1]-1; i >= 0; i--){
            if (isOccupied(currentSquare[0], i, color)){
                if (getColor(currentSquare[0], i) !== color){
                    availableSquares.push([currentSquare[0], i])
                }
                break;
            }
            availableSquares.push([currentSquare[0], i])
        }

        let blockedOne = false
        let blockedTwo = false
        for (let i = 1; i < BoardSize-currentSquare[0]; i++){
            if (!isOutOfBounds( currentSquare[0] + i, currentSquare[1] + i)) {
                if(!isOccupied(currentSquare[0] + i, currentSquare[1] + i) && !blockedOne){
                    availableSquares.push([currentSquare[0] + i, currentSquare[1] + i])
                }
                else {
                    if (!blockedOne && getColor(currentSquare[0] + i, currentSquare[1] + i) !== color){
                        availableSquares.push([currentSquare[0] + i, currentSquare[1] + i])
                    }
                    blockedOne = true
                }
            }
            if (!isOutOfBounds( currentSquare[0] + i, currentSquare[1] - i)) {
                if(!isOccupied(currentSquare[0] + i, currentSquare[1] - i) && !blockedTwo){
                    availableSquares.push([currentSquare[0] + i, currentSquare[1] - i])
                }
                else {
                    if (!blockedTwo && getColor(currentSquare[0] + i, currentSquare[1] - i) !== color){
                        availableSquares.push([currentSquare[0] + i, currentSquare[1] - i])
                    }
                    blockedTwo = true
                }
            }
        }

        blockedOne = false
        blockedTwo = false
        for (let i = 1; i <= currentSquare[0]; i++){
            if (!isOutOfBounds( currentSquare[0] - i, currentSquare[1] + i)) {
                if(!isOccupied(currentSquare[0] - i, currentSquare[1] + i) && !blockedOne){
                    availableSquares.push([currentSquare[0] - i, currentSquare[1] + i])
                }
                else {
                    if (!blockedOne && getColor(currentSquare[0] - i, currentSquare[1] + i) !== color){
                        availableSquares.push([currentSquare[0] - i, currentSquare[1] + i])
                    }
                    blockedOne = true
                }
            }
            if (!isOutOfBounds( currentSquare[0] - i, currentSquare[1] - i)) {
                if(!isOccupied(currentSquare[0] - i, currentSquare[1] - i) && !blockedTwo){
                    availableSquares.push([currentSquare[0] - i, currentSquare[1] - i])
                }
                else {
                    if (!blockedTwo && getColor(currentSquare[0] - i, currentSquare[1] - i) !== color){
                        availableSquares.push([currentSquare[0] - i, currentSquare[1] - i])
                    }
                    blockedTwo = true
                }
            }
        }
        highlightSquares(availableSquares)

    }

    function moveQueen(currentSquare, color ) {
        let availableSquares = []
        let QueenMovements = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]]
        QueenMovements.map((movement) => {
            if (!isOutOfBounds(currentSquare[0]+movement[0], currentSquare[1]+movement[1])){
                if (!isOccupied(currentSquare[0]+movement[0], currentSquare[1]+movement[1])){
                    availableSquares.push([currentSquare[0]+movement[0], currentSquare[1]+movement[1]])
                }
                else if (Math.abs(movement[0]) === 1 && Math.abs(movement[1]) === 1 ) {
                    if (getColor(currentSquare[0]+movement[0], currentSquare[1]+movement[1]) !== color){
                        availableSquares.push([currentSquare[0]+movement[0], currentSquare[1]+movement[1]])
                    }
                }
            }
        
        })
        highlightSquares(availableSquares)
    }


    function isOccupied(row, column, color){
        if(isOutOfBounds(row, column)){
            return true
        }

        let occupied = ((board[row][column] !== null) && (board[row][column] !== "Highlight"))        
        return occupied
    }

    function isOutOfBounds(row, column){
        let rowOutBounds = (row < 0) || (row >= BoardSize)
        let columnOutBounds = (column < 0) || (column >= BoardSize)
        return rowOutBounds || columnOutBounds
    }

    function getColor(row, column){
        return board[row][column].props.color
    }

    return (
        <button onClick={() => handleClick(value)} className={getTileClass(isLightSquare, isMoveable)}>
            <div>
                {value}
            </div>
        </button>
    )
}


function getTileClass(isLightSquare, isMoveable){
    if (isMoveable){
        return isLightSquare ? "LightSquareHighlight" : "DarkSquareHighlight"
    }

    else{
        return isLightSquare ? "LightSquare" : "DarkSquare"
    }


}