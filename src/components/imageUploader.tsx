import { postDataWithPayLoad } from "../api/fetchData";
import { adminDataSource, dataSource } from "../api/datasources";
import getToken from "../utils/getToken";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import { useEffect, useState } from "react";
import imageUploader from "../services/imageUploader";
import Toast from "./toast";
import multipleImageUploader from "../services/multipleImageUploader";

type ImageUploader = {
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>
  setSaveImageTrigger: React.Dispatch<React.SetStateAction<boolean>>
  saveImageTrigger: boolean
}
export default function ImageUploader({setImageUrl, setSaveImageTrigger, saveImageTrigger}: ImageUploader) {
  const [visualImage, setVisualImage] = useState<string>(ELEMENT_IMAGE);
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"]
  // Para subir imagenes
  const [file, setFile] = useState<File>(ELEMENT_IMAGE);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const handleImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files;
    if (file !== null) {
      if(file.length > 0){
        setVisualImage(URL.createObjectURL(file[0]));
      setFile(file[0]);
      }
    }
  };

  const uploadImage = async () => {
    const myImage = new FormData();
    myImage.append("image", file);
    if(allowedTypes.includes(file.type)){
      setToast(true);
      setToastProps({
        title: "Cargando imagen",
        body: "La imagen está siendo guardada, por favor espere",
        footer: "LOADING_IMG",
        theme: "primary_theme",
      });
      const elementImage = await imageUploader(myImage);
    if (elementImage.status === 200) {
      setImageUrl(elementImage.path)
      setToast(true);
      setToastProps({
        title: "Cargando imagen",
        body: "Imagen cargada correctamente",
        footer: "SUCCESS_IMG",
        theme: "success_theme",
      });
    }
    if (elementImage.status === 400) {
      setToast(true);
      setToastProps({
        title: "Cargando imagen",
        body: "No se ha podido cargar tu imagen, intenta nuevamente",
        footer: "ERROR_IMG",
        theme: "error_theme",
      });
    }
    }
    else{
      setImageUrl("images/default.jpg")
      setToast(true);
      setToastProps({
        title: "Elemento sin imagen",
        body: "No se ha elegido una imagen para este elemento",
        footer: "ERROR_EXTENSION",
        theme: "success_theme",
      });
    }
    
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    uploadImage()
  }

  useEffect(() => {
    if(saveImageTrigger === true){
      uploadImage()
    }
    setSaveImageTrigger(false)
  }, [saveImageTrigger]);

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
      <form onSubmit={handleSubmit}>
      <div className="uploadImageContainer">
        <div className="uploadedImage">
          <img src={visualImage} alt="Element image" />
        </div>
        <input type="file" onChange={handleImage} />
        <div style={{marginTop:6}}>
          <label htmlFor="image" className="mediumBottom">
            Añadir Imagen
          </label>
          <input type="file" onChange={handleImage} id="image" name="image" />
        </div>
      </div>
      </form>
    </>
  );
}
