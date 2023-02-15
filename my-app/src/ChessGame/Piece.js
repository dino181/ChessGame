import React from "react";
import {BBishop, BKing, BKnight, BPawn, BQueen, BRook, WBishop, WKing, WKnight, WPawn,WQueen, WRook} from "../images/index.js";
import {capture, slide, start} from "../sounds/index.js";

export default class Piece {
    constructor(name, color){
        this.name = name
        this.color = color
        this.image = imageSelector(name, color) 
        this.moveAudio = new Audio(audioSelectorMove(name, color))
        this.takingAudio = new Audio(audioSelectorTaking(name, color))
        this.takenAudio = new Audio(audioSelectorTaken(name, color))
        this.promotionAudio = new Audio(audioSelectorPromotion(name,color))
        this.hasMoved = false;

    }

    render(){
        return (<img src={this.image} alt={this.color + "_" + this.name}/>)
    }

    onMove(){
        this.moveAudio.play()
    }

    onTaking(){
        this.takingAudio.play()   
    }

    onTaken(){
        let takenDelay = 500
        setTimeout(this.takenAudio.play.bind(this.takenAudio), takenDelay)
    }

    onPromotion(){
        this.promotionAudio.play()
    }
}


function imageSelector(piece, color){
    switch(piece){
        case "bishop":
            return color === "white" ? WBishop : BBishop

        case "king":
            return color === "white" ? WKing : BKing

        case "knight":
            return color === "white" ? WKnight : BKnight

        case "pawn":
            return color === "white" ? WPawn : BPawn

        case "queen":
            return color === "white" ? WQueen : BQueen

        case "rook":
            return color === "white" ? WRook : BRook

        default:
            return null  
    }
    
}


function audioSelectorTaking(piece, color){
    switch(piece){
        case "bishop":
            return color === "white" ? capture : capture

        case "king":
            return color === "white" ? capture : capture

        case "knight":
            return color === "white" ? capture : capture

        case "pawn":
            return color === "white" ? capture : capture

        case "queen":
            return color === "white" ? capture : capture

        case "rook":
            return color === "white" ? capture : capture

        default:
            return null  
    }
}

function audioSelectorTaken(piece, color){
    switch(piece){
        case "bishop":
            return color === "white" ? start : start

        case "king":
            return color === "white" ? start : start

        case "knight":
            return color === "white" ? start : start

        case "pawn":
            return color === "white" ? start : start

        case "queen":
            return color === "white" ? start : start

        case "rook":
            return color === "white" ? start : start

        default:
            return null  
    }
}

function audioSelectorMove(piece, color){
    switch(piece){
        case "bishop":
            return color === "white" ? slide : slide

        case "king":
            return color === "white" ? slide : slide

        case "knight":
            return color === "white" ? slide : slide

        case "pawn":
            return color === "white" ? slide : slide

        case "queen":
            return color === "white" ? slide : slide

        case "rook":
            return color === "white" ? slide : slide

        default:
            return null  
    }
}

function audioSelectorPromotion(piece, color){
    switch(piece){
        case "bishop":
            return color === "white" ? start : start

        case "king":
            return color === "white" ? start : start

        case "knight":
            return color === "white" ? start : start

        case "pawn":
            return color === "white" ? start : start

        case "queen":
            return color === "white" ? start : start

        case "rook":
            return color === "white" ? start : start

        default:
            return null  
    }
}