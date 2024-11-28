import { useState } from "react";
import Grid from "./grid";
import ElementCard from "./elementCard";
import TELESCOPE from "../assets/images/telescope.jpg"
import { ElementFromQuery } from "../@types/elementTypes";

export default function Paginator({list}: {list: ElementFromQuery[][] | undefined}){
    const [currentIndex, setCurrentIndex] = useState(0);
    if(list!==undefined && list.length>0){
        return(
            <div className="paginatorContainer">
                <Grid gap={12} sm={1} md={2} lg={3} def={1} className="">
                {list[currentIndex].map((element, index)=><ElementCard info={element} key={index}/>)}
            </Grid>
                
            <Grid gap={12} sm={2} md={2} lg={2} def={2} className="">
                <div className="paginatorPages col_s2" style={{paddingTop: 12}}>
                    <ul>
                        {list.map((item, index)=><li key={index} onClick={()=>{setCurrentIndex(index)}}>{index + 1}</li>)}
                    </ul>
                </div>
                </Grid>
            </div>
        )
    }
    return (
        <div className="notFound">
            <img src={TELESCOPE} alt="Oooops No lo encontramos...." />
            <p>No encontramos elementos...</p>
        </div>
    )
}