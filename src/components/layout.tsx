import { PropsWithChildren, useEffect, useState } from "react";
import PRICA_LOGO from "../assets/images/prica_logo.png";
import ORANGE from "../assets/images/orange.png";
import { Link, useLocation } from "react-router-dom";
import DropDown from "./dropdown";
import { useAuth } from "../customHooks/centers/auth/useAuth";

export default function Layout({children}: PropsWithChildren) {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState('');
  const [username, setUsername] = useState('');
  /* @ts-ignore*/
  const {logout, user} = useAuth();
  const handleLogOut = () => {
    let close = confirm("¿Deseas cerrar sesión?");
    if(close){
      logout();
    }
  }

  const location = useLocation();
  useEffect(()=>{
    if(user){
      setUsername(user.name);
    }
    if(location.pathname === "/login"){
      setIsVisible('hide');
    }
  })

  return (
    <div>
      <nav className="navigation">
        <div className="background_right">
          <img src={ORANGE} />
        </div>
        <div className="enterprise_logo">
          <Link to="/"><img src={PRICA_LOGO} alt="Prica SAS" /></Link>
          <div className="enterprise_name">
            <div className="reduced_name">
              <p>PRICA SAS</p>
            </div>
            <div className="large_name">
              <p>PROYECTOS DE INGENIERÍA, CONSULTORÍA Y ASESORÍA</p>
            </div>
          </div>
        </div>
        <div className={`user_info ${isVisible}`}>
          <div className="user_name">
            <p>Bienvenido, {username}</p>
          </div>
          <div className="user_image" onClick={()=>setIsActive(!isActive)}>
          <DropDown isActive={isActive}>
            <ul>
              <li onClick={handleLogOut}>Cerrar sesión</li>
              </ul>
          </DropDown>
          </div>
        </div>
      </nav>
      <div className="layout_container">
        {children}
        </div>
    </div>
  );
}
