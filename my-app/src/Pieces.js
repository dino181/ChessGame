import React from "react";

import {BBishop, BKing, BKnight, BPawn, BQueen, BRook, WBishop, WKing, WKnight, WPawn,WQueen, WRook} from "./images/index.js"

function Pawn({color}) {
    const name = "pawn";
    const image = color === "white" ? WPawn:BPawn;
    // const sound = color === "white" ? WPawnSound: BPawnSound

    return (<img src={image} alt={color + "_" + name}/>)
}

function Bishop({color}) {
    const image = color === "white" ? WBishop:BBishop
    // const sound = color === "white" ? WPawnSound: BPawnSound

    return (<img src={image} alt=""/>)
}

function King({color}) {
    const image = color === "white" ? WKing:BKing
    // const sound = color === "white" ? WPawnSound: BPawnSound

    return (<img src={image} alt=""/>)
}

function Knight({color}) {
    const image = color === "white" ? WKnight:BKnight
    // const sound = color === "white" ? WPawnSound: BPawnSound

    return (<img src={image} alt=""/>)
}

function Queen({color}) {
    const image = color === "white" ? WQueen:BQueen
    // const sound = color === "white" ? WPawnSound: BPawnSound

    return (<img src={image} alt=""/>)
}

function Rook({color}) {
    const image = color === "white" ? WRook:BRook
    // const sound = color === "white" ? WPawnSound: BPawnSound

    return (<img src={image} alt=""/>)
}

export {Pawn, Bishop, King, Knight, Queen, Rook}