export default function Title({title, route, description}: Title){
    return(
        <div className="title_route">
            <p style={{fontSize: 28}}>{title}</p>
            <p>{route}</p>
            <p>{description}</p>
        </div>
    );
}