import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { ADD_MATERIAL, CREATE_PROVIDER } from "../api/myMutations";
import ProviderICon from "../assets/icon/wininet.dll_14_152-6.png";
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

export default function ProviderMenu({roles}: {roles: AuthorizedRoles[]}) {
  const [modal, setModal] = useState(false);
  const [listModal, setListModal] = useState(false);
  const [storeMaterials, { loading, data, error }] = useMutation(ADD_MATERIAL);
  const cardReference = useRef<HTMLDivElement>(null);
  const user =useUser();
  // Para subir imagenes
  const [file, setFile] = useState<string | File>(ELEMENT_IMAGE);
  //Toast Inicialization
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  useEffect(() => {
    if (data) {
      setToast(true);
      setToastProps({
        title: "Creación de material",
        body: "Material creado exitosamente",
        footer: "SUCCESS",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Creación de material",
        body: "Error creando el material",
        footer: "ERROR",
        theme: "error_theme",
      });
    }
  }, [loading, data, error]);

  return (
    <>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      <Modal modal={modal} setModal={setModal}>
        <CreateProviderForm />
      </Modal>
      <Modal modal={listModal} setModal={setListModal}>
        <h2>Listado de proveedores</h2>
        <ProvidersList/>
      </Modal>
      <div className={`card_container select_none ${roles.includes(user.role) ? "" : "hide"}`} style={{ cursor: "pointer" }} onClick={() => setListModal(true)} ref={cardReference}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li
              onClick={() => {
                setListModal(true);
              }}
            >
              <div className="option">
                <EyeIcon />
                Ver proveedores
              </div>
            </li>
            <li
              onClick={() => {
                setModal(true);
              }}
            >
              <div className="option">
                <AddIcon />
                Crear proveedores
              </div>
            </li>
          </ul>
        </CustomContextMenu>
        <div className="card_icon">
          <img src={ProviderICon} alt={"Gallery"} draggable={false} />
        </div>
        <div className="card_name">
          <p className="select_none">Proveedores</p>
        </div>
      </div>
    </>
  );
}

function CreateProviderForm() {
  const [createProvider, { loading, error, data }] = useMutation(CREATE_PROVIDER, {refetchQueries: ["GetProviders"]});
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