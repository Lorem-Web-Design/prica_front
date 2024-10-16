import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DELETE_OC_BY_ID } from "../api/myMutations";
import EyeIcon from "../assets/icon/eye";
import TrashCan from "../assets/icon/trashcan";
import CustomContextMenu from "./customContextMenu";
import Toast from "./toast";

type OCCard = {
    cardInfo: PricaOC
}
export default function OcCard({cardInfo}:OCCard){
    const cardReference = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [deleteOc, {data, error, loading}] = useMutation(DELETE_OC_BY_ID);
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
                title: "Eliminando OC",
                body: "La operación está siendo ejecutada",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
        if(error){
            setToast(true);
            setToastProps({
                title: "Eliminando OC",
                body: "Error eliminando OC",
                footer: "Error",
                theme: "error_theme"
            })
            
        }
        if(data){
            setToast(true);
            setToastProps({
                title: "Eliminando OC",
                body: "La OC ha sido eliminada, recargue la página para ver los resultados",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
    }, [data, error, loading]);

    return (
        <>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className="rqCardContainer" onClick={()=>navigate(`/oc/viewer/${cardInfo._id}`)} ref={cardReference}>
            <CustomContextMenu cardReference={cardReference}>
            <ul>
            <li onClick={()=>navigate(`/oc/viewer/${cardInfo._id}`)}>
              <div className="option">
                <EyeIcon />
                Ver
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar esta OC?");
                if (deleteConfirmed) {
                  deleteOc({variables: {ocId: cardInfo._id}})
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
            <p className="rqTitle">Orden de compra</p>
            <p className="rqDate">Consecutivo: {cardInfo.ocNumber}</p>
            <p className="rqDate">Fecha de creación: {cardInfo.date}</p>
        </div></>
    )
}