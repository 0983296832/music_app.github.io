import React from 'react'
import HeaderCSS from "./App.module.css"
import { FaEllipsisH } from "react-icons/fa";

export default function MusicItem( { name, singer, image, setCurrentIndex, currentIndex, songIndex } ) {
    
    return (        
            <div id={songIndex} className={currentIndex === songIndex ? `${HeaderCSS.music__item} ${HeaderCSS.active}` : `${HeaderCSS.music__item}`} onClick={setCurrentIndex} >
            <div className={HeaderCSS.music__item__img}>
            <img className={HeaderCSS.music__item__thumb} src={image} alt=""/>
            </div>
            <div className={HeaderCSS.music__item__info}>
                <h3 className={HeaderCSS.music__item__title}>{name}</h3>
                <h4 className={HeaderCSS.music__item__author}>{singer}</h4>
            </div>
            <div className={HeaderCSS.music__item__option}>
                <FaEllipsisH/>
            </div>
            </div>         
    )
}