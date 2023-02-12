import Piece from "./Piece"
import "./Promotion.css"

export default function Promotion({color, handlePromotionClick}){
    const Pieces = [new Piece("rook", color),    
                    new Piece("knight", color),
                    new Piece("bishop", color),
                    new Piece("queen", color)]

    return (
        Pieces.map((piece) => {
            return (
                <button onClick={console.log("a")} className = "promotionButton">
                    <div>
                        {piece.render()} 
                    </div>
                </button>
            )
        })
        )            

}