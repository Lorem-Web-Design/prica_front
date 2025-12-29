import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthorizedRoles } from "../@types/authorizationTypes";
import EyeIcon from "../assets/icon/eye";
import GestionUsuariosIcon from "../assets/icon/shell32.dll_14_279-6.png";
import useUser from "../customHooks/users/useUser";
import CustomContextMenu from "./customContextMenu";

export default function GestionUsuariosCard({roles}: {roles: AuthorizedRoles[]}) {
  const cardReference = useRef<HTMLDivElement>(null);
  const {role} = useUser();
  const navigate = useNavigate();
  let adminUserVisibility = true;

  if(role === "coord_sst"){
    adminUserVisibility = false
  }

  return (
    <>
      <div className={`card_container select_none ${roles.includes(role) ? "" : "hide"}`} style={{ cursor: "pointer" }} ref={cardReference} onClick={()=>{navigate("/worker")}}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li
              onClick={() => {
                navigate("/admins")
              }}
              className={`${adminUserVisibility ? "" : "hide"}`} 
            >
              <div className={`option`}>
                <EyeIcon />
                Ver Administradores
              </div>
            </li>
            <li
              onClick={() => {
                navigate("/worker")
              }}
            >
              <div className="option">
              <EyeIcon />
                Ver Colaboradores
              </div>
            </li>
          </ul>
        </CustomContextMenu>
        <div className="card_icon">
          <img src={GestionUsuariosIcon} alt={"Gestión de usuarios"} draggable={false} />
        </div>
        <div className="card_name">
          <p className="select_none">Gestión de usuarios</p>
        </div>
      </div>
    </>
  );
}