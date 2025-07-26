import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RemisionFromQuery } from "../@types/remisionTypes";
import { DELETE_REMISION_BY_ID } from "../api/myMutations";
import EyeIcon from "../assets/icon/eye";
import TrashCan from "../assets/icon/trashcan";
import CustomContextMenu from "./customContextMenu";
import Toast from "./toast";

type RemisionCard = {
    cardInfo: RemisionFromQuery
}
export default function RemisionCard({cardInfo}:RemisionCard){
    const cardReference = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [deleteRemision, {data, error, loading}] = useMutation(DELETE_REMISION_BY_ID, {refetchQueries: ["GetRemision"]});
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
                title: "Eliminando Remisión",
                body: "La operación está siendo ejecutada",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
        if(error){
            setToast(true);
            setToastProps({
                title: "Eliminando Remisión",
                body: "Error eliminando Remisión",
                footer: "Error",
                theme: "error_theme"
            })
            
        }
        if(data){
            setToast(true);
            setToastProps({
                title: "Eliminando Remisión",
                body: "La Remisión ha sido eliminada, recargue la página para ver los resultados",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
    }, [data, error, loading]);

    return (
        <>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className="rqCardContainer" onClick={()=>navigate(`/remision/viewer/${cardInfo._id}`)} ref={cardReference}>
            <CustomContextMenu cardReference={cardReference}>
            <ul>
            <li onClick={()=>navigate(`/remision/viewer/${cardInfo._id}`)}>
              <div className="option">
                <EyeIcon />
                Ver
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar esta Remisión?");
                if (deleteConfirmed) {
                  deleteRemision({variables: {remisionId: cardInfo._id}})
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
            <p className="rqTitle">REMISIÓN</p>
            <p className="rqDate">Consecutivo: {cardInfo.number}</p>
            <p className="rqDate">Fecha de creación: {new Date(cardInfo.date).toLocaleDateString()}</p>
        </div></>
    )
}