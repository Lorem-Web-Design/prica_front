import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DELETE_WORKER_BY_ID } from "../api/myMutations";
import EyeIcon from "../assets/icon/eye";
import TrashCan from "../assets/icon/trashcan";
import LOGO_BLUE from "../assets/images/prica_logo_blue.png";
import LOGO_COLOR from "../assets/images/prica_logo_color.png";
import USER_LOGO from "../assets/images/user.png";
import CustomContextMenu from "./customContextMenu";
import Toast from "./toast";

export default function UserCard({name, cc, cargo, id}:User){
    const cardReference = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [deleteWorker, {data, error, loading}] = useMutation(DELETE_WORKER_BY_ID);
    //Toast
    const [toast, setToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        title: "Titulo del toast",
        body: "Cuerpo del toast",
        footer: "Footer del toast",
        theme: "primary_theme"
    })
    useEffect(() => {
        if(loading){
            setToast(true);
            setToastProps({
                title: "Eliminando Colaborador",
                body: "La operación está siendo ejecutada",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
        if(error){
            setToast(true);
            setToastProps({
                title: "Eliminando Colaborador",
                body: "Error eliminando colaborador",
                footer: "Error",
                theme: "error_theme"
            })
            
        }
        if(data){
            setToast(true);
            setToastProps({
                title: "Eliminando Colaborador",
                body: "El colaborador ha sido eliminado, recargue la página para ver los resultados",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
    }, [data, error, loading]);

    return (
        <>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className="userCard_container" onClick={()=>navigate(`/worker/${id}`)} ref={cardReference}>
            <CustomContextMenu cardReference={cardReference}>
            <ul>
            <li onClick={()=>navigate(`/worker/${id}`)}>
              <div className="option">
                <EyeIcon />
                Ver
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar este Colaborador?");
                if (deleteConfirmed) {
                  deleteWorker({variables: {workerId: id}})
                }
              }}
            >
              <div className="option">
                <TrashCan />
                Eliminar
              </div>
            </li>
          </ul>
            </CustomContextMenu>
            <div className="card_elements">
            <div className="userCard_header">
                <div className="userCard_logo">
                    <img src={LOGO_COLOR} alt="logo" />
                </div>
                <div className="userCard_pricaName">
                    <div className="userCard_shortname">
                        <p>PRICA SAS</p>
                    </div>
                    <div className="userCard_longName">
                        <p>PROYECTOS DE INGENIERÍA, CONSULTORÍA Y ASESORÍA</p>
                    </div>
                </div>
            </div>
            <div className="userCard_user">
                <div className="userCard_userImage">
                    <img src={USER_LOGO} alt="user" />
                </div>
                <div className="userCard_userName">
                    <p>{name}</p>
                </div>  
                <div className="userCard_userCc">
                    <p>C.C: {cc}</p>
                </div>
            </div>
            <div className="userCard_cargo">
                <p>{cargo}</p>
            </div>
            <div className="userCard_background">
                <img src={LOGO_BLUE} alt="logo" draggable={false}/>
            </div>
            </div>
        </div></>
    )
    return(
        <Link className="userCard_container " to={`/worker/${id}`}>
            <div className="userCard_header">
                <div className="userCard_logo">
                    <img src={LOGO_COLOR} alt="logo" />
                </div>
                <div className="userCard_pricaName">
                    <div className="userCard_shortname">
                        <p>PRICA SAS</p>
                    </div>
                    <div className="userCard_longName">
                        <p>PROYECTOS DE INGENIERÍA, CONSULTORÍA Y ASESORÍA</p>
                    </div>
                </div>
            </div>
            <div className="userCard_user">
                <div className="userCard_userImage">
                    <img src={USER_LOGO} alt="user" />
                </div>
                <div className="userCard_userName">
                    <p>{name}</p>
                </div>  
                <div className="userCard_userCc">
                    <p>C.C: {cc}</p>
                </div>
            </div>
            <div className="userCard_cargo">
                <p>{cargo}</p>
            </div>
            <div className="userCard_background">
                <img src={LOGO_BLUE} alt="logo" draggable={false}/>
            </div>
        </Link>
    );
}