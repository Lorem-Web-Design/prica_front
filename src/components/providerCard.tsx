import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CREATE_PROVIDER, DELETE_OC_BY_ID, DELETE_PROVIDER, EDIT_PROVIDER_BY_ID } from "../api/myMutations";
import EyeIcon from "../assets/icon/eye";
import TrashCan from "../assets/icon/trashcan";
import CustomContextMenu from "./customContextMenu";
import Toast from "./toast";
import { PricaProvider, ProviderFromQuery } from "../@types/providerTypes";
import CustomContextMenuV2 from "./customContextMenuV2";
import EditIcon from "../assets/icon/edit";
import Modal from "./modal";
import checkForms from "../utils/checkForms";
import InputBox from "./inputElement";

type ProviderCard = {
    cardInfo: ProviderFromQuery
}
export default function ProviderCard({cardInfo}:ProviderCard){
    const [deleteProvider, {data, error, loading}] = useMutation(DELETE_PROVIDER);
    const [modal, setModal] = useState(false);
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
                title: "Eliminando Proveedor",
                body: "La operación está siendo ejecutada",
                footer: "Exito",
                theme: "primary_theme"
            })
            
        }
        if(error){
            setToast(true);
            setToastProps({
                title: "Eliminando Proveedor",
                body: "Error eliminando Proveedor",
                footer: "Error",
                theme: "error_theme"
            })
            
        }
        if(data){
            setToast(true);
            setToastProps({
                title: "Eliminando Proveedor",
                body: "El Proveedor ha sido eliminada, recargue la página para ver los resultados",
                footer: "Exito",
                theme: "success_theme"
            })
            
        }
    }, [data, error, loading]);

    return (
        <>
        <Modal modal={modal} setModal={setModal}>
        <EditProviderForm provider={cardInfo}/>
      </Modal>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className="rqCardContainer">
            <CustomContextMenuV2>
            <ul>
            <li onClick={()=>{setModal(true)}}>
              <div className="option">
                <EditIcon />
                Editar
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm(`¿Seguro que deseas eliminar el proveedor: ${cardInfo.name}?`);
                if (deleteConfirmed) {
                  deleteProvider({variables: {providerId: cardInfo._id}})
                }
              }}
            >
              <div className="option">
                <TrashCan />
                Eliminar
              </div>
            </li>
          </ul>
            </CustomContextMenuV2>
            <p className="rqTitle">{cardInfo.name}</p>
            <p className="rqDate">NIT: {cardInfo.nit}</p>
            <p className="rqDate">Ciudad: {cardInfo.city}</p>
            <p className="rqDate">Contacto: {cardInfo.contact}</p>
            <p className="rqDate">Contacto: {cardInfo.contactNumber}</p>
        </div></>
    )
}

function EditProviderForm({provider}:{provider: ProviderFromQuery}) {
  const [createProvider, { loading, error, data }] = useMutation(EDIT_PROVIDER_BY_ID);
  // Realiza chequeo de los inputs válidos
  const [validInputs, setValidInputs] = useState<string[]>([]);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
      title: "Titulo del toast",
      body: "Cuerpo del toast",
      footer: "Footer del toast",
      theme: "primary_theme"
  })
  //Provider state
  const [providerInfo, setProvider] = useState<PricaProvider>(provider);
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(provider);

    const checkedInputs = checks.checkEmpty(
      { name: "name", type: "string" },
      { name: "nit", type: "string" },
      { name: "address", type: "string" },
      { name: "city", type: "string" },
      { name: "contact", type: "string" },
      { name: "contactNumber", type: "number" },
      { name: "email", type: "string" }
    );
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0) {
      // @ts-ignore
      delete providerInfo._id;
      createProvider({
          variables: {
            providerData: providerInfo,
            providerId: provider._id
          }
      });
  }
  };
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setProvider((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if(loading){
        setToastProps({
            title: "Edición de proveedor",
            body: "Se está procesando la edición del proveedor, espere...",
            footer: "Exito",
            theme: "primary_theme"
        })
        setToast(true);
    }
    if(data){
        setToastProps({
            title: "Edición de proveedor",
            body: "Proveedor editado exitosamente",
            footer: "Exito",
            theme: "success_theme"
        })
        setToast(true);
    }
    if(error){
        setToastProps({
            title: "Edición de proveedor",
            body: "Error editando el proveedor",
            footer: "Exito",
            theme: "error_theme"
        })
        setToast(true);
    }
}, [data, error, loading]);

  return (
    <>
    <Toast
        body={toastProps.body}
        isActive={toast}
        setToast={setToast}
        theme={toastProps.theme}
        title={toastProps.title}
        footer={toastProps.footer}
      />
    <form onSubmit={handleSubmit}>
      <InputBox inputName="name" isEmpty={validInputs.includes("name")} labelTag="Nombre" onChange={handleChange} value={providerInfo.name} type="text" />
      <InputBox inputName="nit" isEmpty={validInputs.includes("nit")} labelTag="NIT" onChange={handleChange} value={providerInfo.nit} type="text" />
      <InputBox inputName="address" isEmpty={validInputs.includes("address")} labelTag="Dirección" onChange={handleChange} value={providerInfo.address} type="text" />
      <InputBox inputName="city" isEmpty={validInputs.includes("city")} labelTag="Ciudad" onChange={handleChange} value={providerInfo.city} type="text" />
      <InputBox inputName="contact" isEmpty={validInputs.includes("contact")} labelTag="Nombre de contacto" onChange={handleChange} value={providerInfo.contact} type="text" />
      <InputBox
        inputName="contactNumber"
        isEmpty={validInputs.includes("contactNumber")}
        labelTag="Número contacto"
        onChange={handleChange}
        value={`${providerInfo.contactNumber}`}
        type="number"
      />
      <InputBox inputName="email" isEmpty={validInputs.includes("email")} labelTag="Correo electrónico" onChange={handleChange} value={providerInfo.email} type="email" />
      <button type="submit" className="mediumBottom">
        Editar Proveedor
      </button>
    </form>
    </>
  );
}