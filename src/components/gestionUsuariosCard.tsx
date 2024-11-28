import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { ADD_MATERIAL, CREATE_PROVIDER } from "../api/myMutations";
import GestionUsuariosIcon from "../assets/icon/shell32.dll_14_279-6.png";
import UploadIcon from "../assets/icon/upload";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import CustomContextMenu from "./customContextMenu";
import ImageUploader from "./imageUploader";
import Modal from "./modal";
import Toast from "./toast";
import EyeIcon from "../assets/icon/eye";
import InputBox from "./inputElement";
import { PricaProvider, ProviderFromQuery } from "../@types/providerTypes";
import checkForms from "../utils/checkForms";
import { GET_PROVIDERS } from "../api/myQueries";
import ApolloErrorPage from "./apolloErrorPage";
import Grid from "./grid";
import ProviderCard from "./providerCard";
import CustomContextMenuV2 from "./customContextMenuV2";
import AddIcon from "../assets/icon/addIcon";
import { AuthorizedRoles } from "../@types/authorizationTypes";
import useUser from "../customHooks/users/useUser";
import { useNavigate } from "react-router-dom";

export default function GestionUsuariosCard({roles}: {roles: AuthorizedRoles[]}) {
  const cardReference = useRef<HTMLDivElement>(null);
  const user =useUser();
  const navigate = useNavigate();
  return (
    <>
      <div className={`card_container select_none ${roles.includes(user.role) ? "" : "hide"}`} style={{ cursor: "pointer" }} ref={cardReference} onClick={()=>{navigate("/worker")}}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li
              onClick={() => {
                navigate("/admins")
              }}
            >
              <div className="option">
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

function CreateProviderForm() {
  const [createProvider, { loading, error, data }] = useMutation(CREATE_PROVIDER);
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
  const [provider, setProvider] = useState<PricaProvider>({
    name: "",
    nit: "",
    address: "",
    city: "",
    contact: "",
    contactNumber: 0,
    email: "",
  });
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
      createProvider({
          variables: {
            providerData: provider
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
            title: "Creación de proveedor",
            body: "Se está procesando la creación del proveedor, espere...",
            footer: "Exito",
            theme: "primary_theme"
        })
        setToast(true);
    }
    if(data){
        setToastProps({
            title: "Creación de proveedor",
            body: "Proveedor creado con éxito",
            footer: "Exito",
            theme: "success_theme"
        })
        setToast(true);
    }
    if(error){
        setToastProps({
            title: "Creación de proveedor",
            body: "Error creando el proveedor",
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
      <InputBox inputName="name" isEmpty={validInputs.includes("name")} labelTag="Nombre" onChange={handleChange} value={provider.name} type="text" />
      <InputBox inputName="nit" isEmpty={validInputs.includes("nit")} labelTag="NIT" onChange={handleChange} value={provider.nit} type="text" />
      <InputBox inputName="address" isEmpty={validInputs.includes("address")} labelTag="Dirección" onChange={handleChange} value={provider.address} type="text" />
      <InputBox inputName="city" isEmpty={validInputs.includes("city")} labelTag="Ciudad" onChange={handleChange} value={provider.city} type="text" />
      <InputBox inputName="contact" isEmpty={validInputs.includes("contact")} labelTag="Nombre de contacto" onChange={handleChange} value={provider.contact} type="text" />
      <InputBox
        inputName="contactNumber"
        isEmpty={validInputs.includes("contactNumber")}
        labelTag="Número contacto"
        onChange={handleChange}
        value={`${provider.contactNumber}`}
        type="number"
      />
      <InputBox inputName="email" isEmpty={validInputs.includes("email")} labelTag="Correo electrónico" onChange={handleChange} value={provider.email} type="email" />
      <button type="submit" className="mediumBottom">
        Crear Proveedor
      </button>
    </form>
    </>
  );
}

function ProvidersList(){
  const {loading, error, data} = useQuery(GET_PROVIDERS)
  if(loading){
    return (<Grid def={1} gap={12} lg={1} md={1} sm={2}>
      <div className="loader"></div>
    </Grid>)
  }
  if(error){
   return (<Grid def={1} gap={12} lg={1} md={1} sm={2}>
      {/* @ts-ignore */}
      <ApolloErrorPage customCode="500" error={error} />
    </Grid>)
  }
  if(data){
    const providers = data.getProviders as ProviderFromQuery[];
    return(
      <Grid def={1} gap={12} lg={1} md={1} sm={2}>
      {/* @ts-ignore */}
      {providers.map(provider=>{
      return(
        <ProviderCard key={provider._id} cardInfo={provider}/>
      )
     })}
    </Grid>)
  }
  return <p>Cargando información...</p>
}