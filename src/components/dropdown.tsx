import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BellIcon from "../assets/icon/bell";
import { imagesSource } from "../api/datasources";
import { GET_PENDING_RQS } from "../api/myQueries";
import { useQuery } from "@apollo/client";
import { useAuth } from "../customHooks/centers/auth/useAuth";

type DropdownAction = {
    image: string
    username: string
    action: Function
    isVisible: boolean
}
export default function DropDown({ username, image, action, isVisible }: PropsWithChildren<DropdownAction>) {
  const [isActive, setIsActive] = useState(false);
  const {loading, error, data} = useQuery(GET_PENDING_RQS);
  const [pendingRqs, setPendingRqs] = useState(0);
  const {user} = useAuth();

  useEffect(() => {
    if(data && user && user.role === "dir_proyectos"){
      setPendingRqs(data.getPendingRq);
    }
  }, [data, user]);
  return (
    <div className={`dropdown ${isVisible ? "" : "hide"}`}>
  <div className={`user_info`} onClick={()=>{setIsActive(!isActive)}}>
          <div className="user_name">
            <p>Bienvenido, {username}</p>
          </div>
          <div className="user_image" onClick={()=>setIsActive(!isActive)}>
          <img src={`${imagesSource()}/${image}`} alt="user image" />
          <div className={`notification ${pendingRqs > 0 ? "show" : "hide"}`}>
            <BellIcon/>
          </div>
          </div>
        </div>
  <div id="myDropdown" className={`dropdown-content ${isActive ? "show" : ""}`}>
    <div onClick={()=>action()}>Cerrar sesión</div>
  </div>
</div>
  )
}
