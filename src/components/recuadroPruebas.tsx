interface PruebasFrey {
    title: string
}

export default function PruebasFrey({title}: PruebasFrey){
    return(
        <div className="freyContainer">
            <p>{title}</p>
        </div>
    )
}