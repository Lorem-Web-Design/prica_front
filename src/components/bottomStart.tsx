import { Link } from 'react-router-dom';
import PRC_LOGO_BNW from '../assets/images/prica_logo_bnw.png';
import BOTTOM_START_OPTIONS from '../routing/bottomStart.json';

export default function BottomStart(){
    return(
        <div className="bottom_start left">
            <div className="start">
                <Link className="start_icon" to={"/"}>
                    <img src={PRC_LOGO_BNW} alt="inicio" />
                </Link>
            </div>  
            <div className="options">
                {BOTTOM_START_OPTIONS.map(option=>{
                    return (
                        <Link className='option_container' to={option.path}  key={option.name}><img src={option.icon} alt={option.name} className='option_icon'/></Link>
                    )
                })}
            </div>
        </div>
    )
}