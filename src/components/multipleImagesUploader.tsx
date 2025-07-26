import { useState } from "react";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import imageUploader from "../services/imageUploader";
import Grid from "./grid";
import Toast from "./toast";

export default function MultipleImagesUploader() {
  const [visualImages, setVisualImages] = useState<string[]>([ELEMENT_IMAGE]);
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
  // Para subir imagenes
  const [files, setFiles] = useState<File[]>(ELEMENT_IMAGE);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const handleImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (files !== null) {
      if (files.length > 0) {
        const imagesObjects = Array.from(files).map((file: Blob | MediaSource) => URL.createObjectURL(file));
        setVisualImages(imagesObjects);
        setFiles(Array.from(files));
      }
    }
  };

  const uploadImage = async () => {
    files.forEach(async (file) => {
      const myImage = new FormData();
      myImage.append("image", file);
      if (allowedTypes.includes(file.type)) {
        setToast(true);
        setToastProps({
          title: "Cargando imagen",
          body: "La imagen está siendo guardada, por favor espere",
          footer: "LOADING_IMG",
          theme: "primary_theme",
        });
        const elementImage = await imageUploader(myImage);
        if (elementImage.status === 200) {
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
      } else {
        setToast(true);
        setToastProps({
          title: "Elemento sin imagen",
          body: "No se ha elegido una imagen para este elemento",
          footer: "ERROR_EXTENSION",
          theme: "success_theme",
        });
      }
    });
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    uploadImage();
  };

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
          <Grid def={3} gap={12} lg={5} md={2} sm={3}>
            {visualImages.map((image) => (
              <img src={image} alt={image} key={image} className="uploadedGalleryItem" />
            ))}
          </Grid>
          <div style={{ marginTop: 6 }}>
            <label htmlFor="image" className="mediumBottom">
              Añadir Imagen
            </label>
            <input type="file" onChange={handleImage} id="image" name="image" multiple />
          </div>
        </div>
        <button type="submit" className="mediumBottom">Guardar</button>
      </form>
    </>
  );
}
