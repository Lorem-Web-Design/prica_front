import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { ADD_MATERIAL } from "../api/myMutations";
import GalleryICon from "../assets/icon/shell32.dll_14_226-2.png";
import UploadIcon from "../assets/icon/upload";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import CustomContextMenu from "./customContextMenu";
import ImageUploader from "./imageUploader";
import Modal from "./modal";
import Toast from "./toast";

export default function Gallery() {
  const [modal, setModal] = useState(false);
  const [storeMaterials, { loading, data, error }] = useMutation(ADD_MATERIAL);
  const cardReference = useRef<HTMLDivElement>(null);
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
        if(data){
            setToast(true)
            setToastProps({
                title: "Creación de material",
                body: "Material creado exitosamente",
                footer: "SUCCESS",
                theme: "primary_theme",
              })
        }
        if(error){
            setToast(true)
            setToastProps({
                title: "Creación de material",
                body: "Error creando el material",
                footer: "ERROR",
                theme: "error_theme",
              })
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
      <ImageUploader/>
      </Modal>

      <div className="card_container select_none" style={{ cursor: "pointer" }} onClick={() => setModal(true)}  ref={cardReference}>
      <CustomContextMenu cardReference={cardReference}>
            <ul>
            <li onClick={()=>{setModal(true)}}>
              <div className="option">
                <UploadIcon />
                Subir imagen
              </div>
            </li>
          </ul>
            </CustomContextMenu>
        <div className="card_icon">
          <img src={GalleryICon} alt={"Gallery"} draggable={false} />
        </div>
        <div className="card_name">
          <p className="select_none">Galería</p>
        </div>
      </div>
    </>
  );
}
