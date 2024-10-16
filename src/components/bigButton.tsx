import { Link } from "react-router-dom";

export default function BigButton({text, link}: Button){
    return(
        <Link className="bigButton mt_def_24" to={link}>
            {text}
        </Link>
    );
}