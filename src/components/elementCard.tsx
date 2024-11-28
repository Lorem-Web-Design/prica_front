import { useEffect, useRef, useState } from "react"
import { imagesSource } from "../api/datasources"
import { useMutation } from "@apollo/client";
import { DELETE_ELEMENT } from "../api/myMutations";
import { Link, useNavigate } from "react-router-dom";
import Toast from "./toast";
import CustomContextMenu from "./customContextMenu";
import TrashCan from "../assets/icon/trashcan";
import EyeIcon from "../assets/icon/eye";
import { ElementFromQuery } from "../@types/elementTypes";

interface ElementCardInfo {
    info: ElementFromQuery
}

export default function ElementCard(element:ElementCardInfo){
    const [isActive, setIsActive] = useState(false);
    const [deleteElementById, {loading, data, error}] = useMutation(DELETE_ELEMENT, {variables: {deleteElementById: element.info._id}, refetchQueries: ["GetElements"]})
    const navigate = useNavigate();
    const cardReference = useRef<HTMLDivElement>(null);
    const handleDelete = () => {
        const deleteItem = confirm("Estas seguro que deseas eliminar este elemento?");
        if(deleteItem){
            deleteElementById();
        }
    }
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
                title: "Eliminando elemento",
                body: "La operación está siendo ejecutada",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
        if(error){
            setToast(true);
            setToastProps({
                title: "Eliminando elemento",
                body: "Error eliminando elemento",
                footer: "Error",
                theme: "error_theme"
            })
            
        }
        if(data){
            setToast(true);
            setToastProps({
                title: "Eliminando elemento",
                body: "El elemento ha sido eliminado, recargue la página para ver los resultados",
                footer: "Exito",
                theme: "success_theme"
            })
            
        }
    }, [data, error, loading]);

    return (
        <>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className="elementCard_container" onClick={()=>navigate(`/elemento/${element.info._id}`)} ref={cardReference}>
        <CustomContextMenu cardReference={cardReference}>
            <ul>
            <li onClick={()=>navigate(`/elemento/${element.info._id}`)}>
              <div className="option">
                <EyeIcon />
                Ver
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar este elemento?");
                if (deleteConfirmed) {
                  deleteElementById()
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
            <div className="inside_container">
            <div className="elementCard_image">
                <img src={`${imagesSource()}/${element.info.image}`} alt={element.info.name} />
            </div>
            <div className="elementCard_info">
                <p className="elementCard_title">{element.info.name}</p>
                <p>Serial: {element.info.serial}</p>
                <p>Ubicación: {element.info.onDelivery ? element.info.giverFolder.name : element.info.takerFolder.name}</p>
                <p>Último movimiento: {}</p>
            </div>
            </div>
        </div>
        </>
        
    )
}