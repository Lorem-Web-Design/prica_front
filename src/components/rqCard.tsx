import { Link, useNavigate } from "react-router-dom"
import RQControll from "../utils/rq.controll"
import CustomContextMenu from "./customContextMenu"
import { useEffect, useRef, useState } from "react"
import EditIcon from "../assets/icon/edit"
import TrashCan from "../assets/icon/trashcan"
import EyeIcon from "../assets/icon/eye"
import { useMutation } from "@apollo/client"
import { DELETE_RQ_BY_ID } from "../api/myMutations"
import Toast from "./toast"
import { useAuth } from "../customHooks/centers/auth/useAuth"

type RQCard = {
    cardInfo: RQFromQuery
}
export default function RqCard({cardInfo}:RQCard){
    const cardReference = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [deleteRq, {data, error, loading}] = useMutation(DELETE_RQ_BY_ID);
    //User
    const {user} = useAuth()
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
                title: "Eliminando RQ",
                body: "La operación está siendo ejecutada",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
        if(error){
            setToast(true);
            setToastProps({
                title: "Eliminando RQ",
                body: "Error eliminando RQ",
                footer: "Error",
                theme: "error_theme"
            })
            
        }
        if(data){
            setToast(true);
            setToastProps({
                title: "Eliminando RQ",
                body: "La RQ ha sido eliminada, recargue la página para ver los resultados",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
    }, [data, error, loading]);

    const [isVisible, setIsVisible] = useState(false)

    useEffect(()=>{
      if(user.role === "compras"){
        if(cardInfo.isApproved){
          setIsVisible(true)
        }
      }
      
      if(user.role === "dir_proyectos" || user.role === "admin"){
        console.log("Director")
        setIsVisible(true)
      }
    },[user.role])

    return (
        <>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className={`rqCardContainer ${isVisible ? "" : "hide"}`} onClick={()=>navigate(`/requisicion/viewer/${cardInfo._id}`)} ref={cardReference}>
            <CustomContextMenu cardReference={cardReference}>
            <ul>
            <li onClick={()=>navigate(`/requisicion/viewer/${cardInfo._id}`)}>
              <div className="option">
                <EyeIcon />
                Ver
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar esta RQ?");
                if (deleteConfirmed) {
                  deleteRq({variables: {rqId: cardInfo._id}})
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
            <p className="rqTitle">{cardInfo.rq}</p>
            <p className="rqDate">Fecha de creación: {cardInfo.date}</p>
            <p className="rqDate">Proyecto: {cardInfo.project.name}</p>
            <p className="rqPetitioner">Solicitante: {cardInfo.petitioner.name}</p>
            <p className={`${cardInfo.isApproved ? "green" : "red"}`}>{`${cardInfo.isApproved ? "Aprobado" : "Pendiente"}`}</p>
        </div>
        </>
    )
}