import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { imagesSource } from "../api/datasources";
import { DELETE_WORKER_BY_ID, EDIT_USER, EDIT_WORKER_BY_ID } from "../api/myMutations";
import EditIcon from "../assets/icon/sitemap";
import EyeIcon from "../assets/icon/eye";
import TrashCan from "../assets/icon/trashcan";
import LOGO_BLUE from "../assets/images/prica_logo_blue.png";
import LOGO_COLOR from "../assets/images/prica_logo_color.png";
import USER_LOGO from "../assets/images/user.png";
import CustomContextMenu from "./customContextMenu";
import Toast from "./toast";
import Modal from "./modal";
import InputBox from "./inputElement";
import checkForms from "../utils/checkForms";
import { EditUserToMutation, UserToMutation, VisibleAdmin, WorkerToApi } from "../@types/usersTypes";
import GalleryViewer from "./galleryViewer";
import Grid from "./grid";
import { DELETE_ADMINS } from "../api/myQueries";

export default function AdminCard({ name, cc, role, _id, image, hide }: VisibleAdmin) {
  const cardReference = useRef<HTMLDivElement>(null);
  const [deleteWorker, { data, error, loading }] = useMutation(DELETE_ADMINS);
  const [modal, setModal] = useState(false);
  const [isActive, setIsActive] = useState(false);

  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  useEffect(() => {
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Eliminando Administrador",
        body: "La operación está siendo ejecutada",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Eliminando Administrador",
        body: "Error eliminando administrador",
        footer: "Error",
        theme: "error_theme",
      });
    }
    if (data) {
      setToast(true);
      setToastProps({
        title: "Eliminando Administrador",
        body: "El administrador ha sido eliminado, recargue la página para ver los resultados",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
  }, [data, error, loading]);

  return (
    <>
      <Modal modal={modal} setModal={setModal}>
        <EditAdminForm userInfo={{ name, cc, image, role, _id }} isActive={isActive} />
      </Modal>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      <div className={`userCard_container ${hide ? "hide" : ''}`} ref={cardReference}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li onClick={() => setModal(true)}>
              <div
                className="option"
                onClick={() => {
                  setIsActive(true);
                }}
              >
                <EditIcon />
                Editar
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar este administrador?");
                if (deleteConfirmed) {
                  deleteWorker({ variables: { userId: _id } });
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
        <div className="card_elements">
          <div className="userCard_header">
            <div className="userCard_logo">
              <img src={LOGO_COLOR} alt="logo" />
            </div>
            <div className="userCard_pricaName">
              <div className="userCard_shortname">
                <p>PRICA SAS</p>
              </div>
              <div className="userCard_longName">
                <p>PROYECTOS DE INGENIERÍA, CONSULTORÍA Y ASESORÍA</p>
              </div>
            </div>
          </div>
          <div className="userCard_user">
            <div className="userCard_userImage">
              <img src={`${imagesSource()}/${image}`} alt="user" />
            </div>
            <div className="userCard_userName">
              <p>{name}</p>
            </div>
            <div className="userCard_userCc">
              <p>C.C: {cc}</p>
            </div>
          </div>
          <div className="userCard_cargo">
            <p>{roleParser(role)}</p>
          </div>
          <div className="userCard_background">
            <img src={LOGO_BLUE} alt="logo" draggable={false} />
          </div>
        </div>
      </div>
    </>
  );
}

type EditAdminForm = {
  userInfo: VisibleAdmin;
  isActive: boolean;
};

function EditAdminForm({ userInfo, isActive }: EditAdminForm) {
  const [validInputs, setValidInputs] = useState<string[]>([]);
  const [imageModal, setImageModal] = useState(false);
  const [userData, setUserData] = useState<EditUserToMutation>({
    name: userInfo.name,
    cc: userInfo.cc,
    image: userInfo.image,
    role: userInfo.role,
    password: "",
    confirmPassword: "",
  });
  const [editWorker, { loading, error, data }] = useMutation(EDIT_USER, { refetchQueries: ["GetUsers"] });

  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    let value = evt.target.value;
    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(userData);
    const checkedInputs = checks.checkEmpty(
      { name: "name", type: "string" },
      { name: "cc", type: "number" },
      { name: "password", type: "string" },
      { name: "confirmPassword", type: "string" },
      { name: "image", type: "string" }
    );
    setValidInputs(checkedInputs);
    let matchPassword = userData.password === userData.confirmPassword;
    if (checkedInputs.length === 0 && matchPassword) {
      userData.cc = parseFloat(`${userData.cc}`);
      editWorker({
        variables: {
          info: {
            name: userData.name,
            role: userData.role,
            password: userData.password,
            image: userData.image,
            cc: userData.cc,
          },
          userId: userInfo._id,
        },
      });
    } else {
      setToastProps({
        title: "Error en la creación",
        body: "Verifica que todos los campos esten diligenciasdos y que las contraseñas ingresadas coincidan",
        footer: "Error: Campos incompletos",
        theme: "error_theme",
      });
      setToast(true);
    }
  };
  const updateImage = (image: string) => {
    setUserData((prev) => {
      return {
        ...prev,
        image: image,
      };
    });
    setToast(true);
    setToastProps({
      title: "Imagen seleccionada",
      body: "La imagen ha sido seleccionada",
      footer: "SUCCESS",
      theme: "success_theme",
    });
  };

  useEffect(() => {
    if (data) {
      setToastProps({
        title: "Edición del elemento",
        body: "La información ha sido actualizada, actualice la página para ver los cambios",
        footer: "Exito",
        theme: "success_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Edición del elemento",
        body: "La información no ha podido actualizarse",
        footer: "ERROR",
        theme: "error_theme",
      });
      setToast(true);
    }
    if (loading) {
      setToastProps({
        title: "Edición del elemento",
        body: "La información está siendo guardada",
        footer: "Loading...",
        theme: "primary_theme",
      });
      setToast(true);
    }
  }, [loading, error, data]);

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
      <Modal modal={imageModal} setModal={setImageModal}>
        <GalleryViewer action={updateImage} isActive={isActive} />
      </Modal>
      <form onSubmit={handleSubmit}>
        <Grid gap={12} def={1} sm={1} md={2} lg={3}>
          <div className="user_image_container">
            <div className="user_image">
              <img src={`${imagesSource()}/${userData.image}`} alt="Portada" />
            </div>
            <div style={{ paddingTop: 12 }} onClick={() => setImageModal(true)}>
              <a className="mediumBottom input_container">Cambiar imagen</a>
            </div>
          </div>
          <div className="col_span_def_2">
            <InputBox
              onChange={handleChange}
              inputName="name"
              labelTag="Nombre del colaborador"
              isEmpty={validInputs.includes("name")}
              value={userData.name}
              type="text"
            />
            <InputBox
              onChange={handleChange}
              inputName="cc"
              labelTag="Identificación del colaborador"
              isEmpty={validInputs.includes("cc")}
              value={`${userData.cc}`}
              type="number"
            />
            <InputBox
              onChange={handleChange}
              inputName="password"
              labelTag="Contraseña"
              isEmpty={validInputs.includes("password")}
              value={`${userData.password}`}
              type="text"
            />
            <InputBox
              onChange={handleChange}
              inputName="confirmPassword"
              labelTag="Confirmar nueva contraseña"
              isEmpty={validInputs.includes("confirmPassword")}
              value={`${userData.confirmPassword}`}
              type="text"
            />
          </div>
        </Grid>
        <div style={{ paddingTop: 12 }}>
          <button className="mediumBottom defaultButton" type="submit">
            Guardar cambios
          </button>
        </div>
      </form>
    </>
  );
}

function roleParser(role: string): string {
  let roleParsed: string = "";
  switch (role) {
    case "admin":
      roleParsed = "Administrador";
      break;
    case "gerente":
      roleParsed = "Gerente";
      break;
    case "ing_proyectos":
      roleParsed = "Ingeniero de Proyectos";
      break;
    case "dir_proyectos":
      roleParsed = "Director de Proyectos";
      break;
    case "coord_sst":
      roleParsed = "SST";
      break;
    case "compras":
      roleParsed = "Compras";
      break;
    case "super":
      roleParsed = "Superuser";
      break;
  }
  return roleParsed;
}
