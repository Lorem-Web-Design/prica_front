import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { AuthorizedRoles } from "../@types/authorizationTypes";
import { ADD_MATERIAL } from "../api/myMutations";
import GalleryICon from "../assets/icon/shell32.dll_14_226-2.png";
import UploadIcon from "../assets/icon/upload";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import useUser from "../customHooks/users/useUser";
import CustomContextMenu from "./customContextMenu";
import Modal from "./modal";
import MultipleImagesUploader from "./multipleImagesUploader";
import Toast from "./toast";
import GalleryViewer from "./galleryViewer";
import EyeIcon from "../assets/icon/eye";

export default function Gallery({ roles }: { roles: AuthorizedRoles[] }) {
  const [modal, setModal] = useState(false);
  const user = useUser();
  const [storeMaterials, { loading, data, error }] = useMutation(ADD_MATERIAL);
  const cardReference = useRef<HTMLDivElement>(null);
  const [imageModal, setImageModal] = useState(false);
  const [isGalleryActive, setIsGalleryActive] = useState(false);
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
        <MultipleImagesUploader />
      </Modal>
      <Modal modal={imageModal} setModal={setImageModal}>
        <GalleryViewer action={() => {}} isActive={isGalleryActive} />
      </Modal>
      <div
        className={`card_container select_none ${roles.includes(user.role) ? "" : "hide"}`}
        style={{ cursor: "pointer" }}
        onClick={() => setModal(true)}
        ref={cardReference}
      >
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li
              onClick={() => {
                setModal(true);
              }}
            >
              <div className="option">
                <UploadIcon />
                Subir imagen
              </div>
            </li>
            <li
              onClick={() => {
                setImageModal(true);
                setIsGalleryActive(true)
              }}
            >
              <div className="option">
                <EyeIcon />
                Ver galería
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
