import { PropsWithChildren, useEffect, useState } from "react";
import PRICA_LOGO from "../assets/images/prica_logo.png";
import ORANGE from "../assets/images/orange.png";
import { Link, useLocation } from "react-router-dom";
import DropDown from "./dropdown";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import imageUploader from "../services/imageUploader";
import { imagesSource } from "../api/datasources";
import { useQuery } from "@apollo/client";
import { GET_PENDING_RQS } from "../api/myQueries";
import BellIcon from "../assets/icon/bell";

export default function Layout({children}: PropsWithChildren) {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
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
      setImage(user.image);
    }
    if(location.pathname === "/login"){
      setIsVisible(false);
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
        <DropDown image={image} username={username} action={handleLogOut} isVisible={isVisible}/>
      </nav>
      <div className="layout_container">
        {children}
        </div>
    </div>
  );
}
