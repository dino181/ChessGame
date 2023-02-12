import "./ChessTile.css";

export default function ChessTile({piece, square, isMove, handleClick}) {
    function getTileClass(){
        let lightSquare = isLightSquare()
        let move = isMove(square)

        if (!move){
            return lightSquare ? "LightSquare" : "DarkSquare"
        }
        return lightSquare ? "LightSquareHighlight" : "DarkSquareHighlight"
    }

    function isLightSquare() {
        let even_row = square[0] % 2;
        let even_column = square[1] % 2;
        return even_column === even_row;
    }

    return (
        <button onClick={() => handleClick(square, piece)} className={getTileClass()}>
            <div>
                {piece !== null ? piece.render(): null} 
            </div>
        </button>
    )
}


