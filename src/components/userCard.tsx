import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkerToApi } from "../@types/usersTypes";
import { imagesSource } from "../api/datasources";
import { DELETE_WORKER_BY_ID, EDIT_WORKER_BY_ID, UPDATE_USER_STATUS } from "../api/myMutations";
import ActivateUser from "../assets/icon/activateUser";
import DeactivateUser from "../assets/icon/deactivateUser";
import EditIcon from "../assets/icon/sitemap";
import EyeIcon from "../assets/icon/eye";
import TrashCan from "../assets/icon/trashcan";
import LOGO_BLUE from "../assets/images/prica_logo_blue.png";
import LOGO_COLOR from "../assets/images/prica_logo_color.png";
import EPP_LIFE_IN_DAYS from "../settings/eppLife.json";
import checkForms from "../utils/checkForms";
import CustomContextMenu from "./customContextMenu";
import GalleryViewer from "./galleryViewer";
import Grid from "./grid";
import InputBox from "./inputElement";
import Modal from "./modal";
import Toast from "./toast";
import WorkerStateSelect from "./workerStateSelect";

export default function UserCard({ name, cc, _id, image, isActive, eppHistory, occupation, hide }: PricaWorker) {
  const cardReference = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [deleteWorker, { data, error, loading }] = useMutation(DELETE_WORKER_BY_ID, {
    refetchQueries: ["GetWorkers"],
  });
  const [updateUserStatus, { data: statusData, error: statusError, loading: statusLoading }] = useMutation(UPDATE_USER_STATUS, {
    refetchQueries: ["GetWorkers"],
  });
  const [modal, setModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const eppInfo = eppTimer(eppHistory);

  useEffect(() => {
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Eliminando Colaborador",
        body: "La operación está siendo ejecutada",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Eliminando Colaborador",
        body: "Error eliminando colaborador",
        footer: "Error",
        theme: "error_theme",
      });
    }
    if (data) {
      setToast(true);
      setToastProps({
        title: "Eliminando Colaborador",
        body: "El colaborador ha sido eliminado, recargue la página para ver los resultados",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
  }, [data, error, loading]);

  useEffect(() => {
    if (statusLoading) {
      setToast(true);
      setToastProps({
        title: "Actualizando estado de colaborador",
        body: "La operación está siendo ejecutada",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
    if (statusError) {
      setToast(true);
      setToastProps({
        title: "Actualizando estado de colaborador",
        body: "Error actualizando colaborador",
        footer: "Error",
        theme: "error_theme",
      });
    }
    if (statusData) {
      setToast(true);
      setToastProps({
        title: "Actualizando estado de colaborador",
        body: statusData.activateWorkerById.message,
        footer: "Exito",
        theme: "primary_theme",
      });
    }
  }, [statusData, statusError, statusLoading]);

  return (
    <>
      <Modal modal={modal} setModal={setModal}>
        <EditWorkerForm userInfo={{ name, cc, image, occupation, _id, isActive, eppHistory }} isActive={isVisible} />
      </Modal>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      <div className={`userCard_container ${hide ? "hide" : ""}`} onClick={() => navigate(`/worker/${_id}/${"Material"}`)} ref={cardReference}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li onClick={() => navigate(`/worker/${_id}/Material`)}>
              <div className="option">
                <EyeIcon />
                Ver
              </div>
            </li>
            <li
              onClick={() => {
                setModal(true);
              }}
            >
              <div
                className="option"
                onClick={() => {
                  setIsVisible(true);
                }}
              >
                <EditIcon />
                Editar
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar este Colaborador?");
                if (deleteConfirmed) {
                  deleteWorker({ variables: { workerId: _id } });
                }
              }}
            >
              <div className="option">
                <TrashCan />
                Eliminar
              </div>
            </li>
            <li
              onClick={() => {
                updateUserStatus({
                  variables: {
                    workerId: _id,
                    action: "activate",
                  },
                });
              }}
            >
              <div className="option">
                <ActivateUser />
                Activar
              </div>
            </li>
            <li
              onClick={() => {
                updateUserStatus({
                  variables: {
                    workerId: _id,
                    action: "deactivate",
                  },
                });
              }}
            >
              <div className="option">
                <DeactivateUser />
                Desactivar
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
              <p className={`${!isActive ? "red" : "green"} txt_center`}>{`${!isActive ? "Inactivo" : "Activo"}`}</p>
              <div className="txt_center">
                EPP: {eppInfo.length > 0 ? <span className="red">REVISAR</span> : <span className="green">AL DÍA</span>}
              </div>
            </div>
          </div>
          <div className="userCard_cargo">
            <p>{occupation}</p>
          </div>
          <div className="userCard_background">
            <img src={LOGO_BLUE} alt="logo" draggable={false} />
          </div>
        </div>
      </div>
    </>
  );
}

type EditWorkerForm = {
  userInfo: WorkerToApi;
  isActive: boolean;
};

function EditWorkerForm({ userInfo, isActive }: EditWorkerForm) {
  const [validInputs, setValidInputs] = useState<string[]>([]);
  const [imageModal, setImageModal] = useState(false);
  const [userData, setUserData] = useState<WorkerToApi>({
    name: userInfo.name,
    cc: userInfo.cc,
    image: userInfo.image,
    occupation: userInfo.occupation,
    isActive: userInfo.isActive,
    eppHistory: userInfo.eppHistory,
  });
  const [editWorker, { loading, error, data }] = useMutation(EDIT_WORKER_BY_ID, { refetchQueries: ["GetWorkers"] });

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
      { name: "occupation", type: "string" },
      { name: "image", type: "string" }
    );
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0) {
      userData.cc = parseFloat(`${userData.cc}`);
      userData.isActive = userData.isActive === "active" ? true : false;
      let userDataFixed = workerToApi(userData);
      editWorker({
        variables: {
          info: userDataFixed,
          workerId: userInfo._id,
        },
      });
    } else {
      setToastProps({
        title: "Error en la creación",
        body: "Verifica que todos los campos esten diligenciasdos",
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
              <img src={`${imagesSource()}/${userData.image}`} alt="user image" />
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
              inputName="occupation"
              labelTag="Cargo del colaborador"
              isEmpty={validInputs.includes("occupation")}
              value={`${userData.occupation}`}
              type="text"
            />
            <WorkerStateSelect
              isEmpty={false}
              label="Estado del colaborador"
              name="isActive"
              onChange={handleChange}
              value={`${userData.isActive ? "active" : "inactive"}`}
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

function eppTimer(eppHistory: PricaWorker["eppHistory"]) {
  let nextToExpire: any = [];
  for (let i = 0; i < eppHistory.length; i++) {
    let currentEpp = eppHistory[i];
    let currentDate = new Date();
    let eppDate = new Date(currentEpp.date);
    //@ts-ignore
    let timeElapsed = Math.abs(currentDate - eppDate);

    if (currentEpp.eppId) {
      for (let j = 0; j < currentEpp.eppId.classification.length; j++) {
        let currentEppClas = currentEpp.eppId?.classification[j];
        if (EPP_LIFE_IN_DAYS.eppLife * 24 * 60 * 60 * 1000 <= timeElapsed) {
          nextToExpire.push({
            epp: currentEpp.eppId.name,
            classificationName: currentEppClas.name,
          });
        }
      }
    }
  }
  return nextToExpire;
}

type EppHistoryFromQuery = {
  folder:{
    _id: string
  }
  eppId: {
    name: string;
    classificationName: string;
    classification: {
      name: string;
      amount: number;
      id: number;
    }[];
    category: string;
    _id: string;
  };
  amount: number;
  date: string;
};

type EppHistoryToApi = {
  eppId: string;
  amount: number;
  classificationId: number;
  folder: string;
  date: string;
};

function eppToApi(userInfo: any) {
  let fixedUserInfo = JSON.parse(JSON.stringify(userInfo));
  let fixedEpp: any;
  let fixedEppList: EppHistoryToApi[] = [];
  for (let i = 0; i < fixedUserInfo.eppHistory.length; i++) {
    let currentEpp = fixedUserInfo.eppHistory[i] as EppHistoryFromQuery;
    fixedEpp = {
      eppId: currentEpp.eppId._id,
      amount: currentEpp.amount,
      classificationId: currentEpp.eppId.classification[0].id,
      date: currentEpp.date,
      folder: currentEpp.folder._id
    }
    fixedEppList.push(fixedEpp);
  }
  delete fixedUserInfo.eppHistory;
  fixedUserInfo.eppHistory = fixedEppList;
  return fixedUserInfo;
}

function workerToApi(userInfo: any){
  let fixedUserInfo = JSON.parse(JSON.stringify(userInfo));
  delete fixedUserInfo.eppHistory
  return fixedUserInfo
}
