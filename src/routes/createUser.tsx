import Layout from "../components/layout";
import BottomStart from "../components/bottomStart";
import Title from "../components/title";
import Grid from "../components/grid";
import USER_IMAGE from "../assets/images/user.png";
import { useMutation } from "@apollo/client";
import { CREATE_USER, CREATE_WORKER } from "../api/myMutations";
import { useEffect, useState } from "react";
import Toast from "../components/toast";
import Modal from "../components/modal";
import GalleryViewer from "../components/galleryViewer";
import { imagesSource } from "../api/datasources";
import ImageUploader from "../components/imageUploader";
import RoleSelectBox from "../components/rolesSelectBox";

const userMock:PricaWorkerToApi = {
    cc: 0,
  image: 'images/default.jpg',
  name: '',
  occupation:'',
  isActive: true
}
export default function CreateUser() {
    const [userData, setUserData] = useState<PricaWorkerToApi>(userMock);
    //Input Image Inicialization
    const [imageUrl, setImageUrl] = useState<null | string>(null)
    const [saveImageTrigger, setSaveImageTrigger] = useState(false);
    //Toast
    const [toast, setToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        title: "Titulo del toast",
        body: "Cuerpo del toast",
        footer: "Footer del toast",
        theme: "primary_theme"
    })

    const [createUser, {data, error, loading}] = useMutation(CREATE_WORKER, {variables: {
        workerInfo: {...userData}
    }, refetchQueries: ["GetWorkers"]});

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const name = evt.target.name;
        let value : string | number = evt.target.value;
        if(name === "cc"){
            value = parseInt(value);
        }
        setUserData(prev=>{
            return({
                ...prev,
                [name]:value
            })
        });
    }

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        setSaveImageTrigger(true);
    }

    useEffect(() => {
        if(loading){
            setToastProps({
                title: "Creación del colaborador",
                body: "Se está procesando la creación del colaborador",
                footer: "Exito",
                theme: "primary_theme"
            })
            setToast(true);
        }
        if(data){
            setToastProps({
                title: "Creación del colaborador",
                body: "Colaborador creado con éxito",
                footer: "Exito",
                theme: "primary_theme"
            })
            setToast(true);
        }
        if(error){
            setToastProps({
                title: "Creación del colaborador",
                body: "Error creando el colaborador, revise que los campos se hayan diligenciado correctamente",
                footer: "Error",
                theme: "error_theme"
            })
            setToast(true);
        }
    }, [data, error, loading]);

    useEffect(() => {
        if(imageUrl !== null){
            createUser(
                {
                    variables:{
                        workerInfo: {...userData, image: imageUrl}
                    }
                }
            );
        }
    }, [imageUrl]);

  return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title title="Gestión usuarios" description="Añade colaboradores:"/>
        <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <form onSubmit={handleSubmit}>
        <Grid gap={12} def={1} sm={6} md={6} lg={6}>
            <div className="user_image_container">
                <ImageUploader setImageUrl={setImageUrl} saveImageTrigger={saveImageTrigger} setSaveImageTrigger={setSaveImageTrigger}/>
            </div>
            
            <div className="new_user_info col_s5">
                <div className="input_container gap_12">
                    <label htmlFor="name">Nombre de usuario</label>
                    <input type="text" className="editable_input width_100" name="name" value={userData.name} onChange={handleChange}/>
                </div>
                <div className="input_container gap_12">
                    <label htmlFor="cc">Identificación</label>
                    <input type="number" className="editable_input width_100" name="cc" value={userData.cc} onChange={handleChange}/>
                </div>
                <div className="input_container gap_12">
                    <RoleSelectBox isEmpty={false} label="Ocupación/cargo" name="role" setUserData={setUserData} value={userData.occupation}/>
                </div>
                <div  style={{paddingTop: 24}}><button className="bigButton" type="submit">+ Añadir colaborador</button></div>
            </div>
        </Grid>
        </form>
        <BottomStart/>
      </Layout>
  );
}
