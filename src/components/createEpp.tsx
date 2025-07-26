import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthorizedRoles } from "../@types/authorizationTypes";
import { EppFromQuery } from "../@types/eppTypes";
import { ASSIGN_EPP, CREATE_ELEMENT, CREATE_EPP } from "../api/myMutations";
import AddIcon from "../assets/icon/addIcon";
import EyeIcon from "../assets/icon/eye";
import EppICon from "../assets/icon/syncui.dll_14_121.png";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import useUser from "../customHooks/users/useUser";
import MOCK_EPP from "../data/mock.element.json";
import MOCK_MOVEMENT_INFO from "../data/mock.movementInfo.json";
import checkForms from "../utils/checkForms";
import EppEditor from "../utils/eppEditor.controll";
import CustomContextMenu from "./customContextMenu";
import EppSelect from "./eppSelectList";
import Grid from "./grid";
import InputBox from "./inputElement";
import Modal from "./modal";
import Toast from "./toast";
import WorkerSelectBox from "./workerSelectBox";
import EppClassificationSelect from "./eppClassificationSelect";
import EppCategroySelect from "./eppCategorySelect";
import BodegaSelectBox from "./bodegaSelectBox";
import { ElementFromQuery } from "../@types/elementTypes";
import ElementEditor from "../utils/elementEditor.controll";
import { GET_WORKER_BY_ID } from "../api/myQueries";

export default function EppMenu({ roles }: { roles: AuthorizedRoles[] }) {
  const [modal, setModal] = useState(false);
  const [listModal, setListModal] = useState(false);
  const navigate = useNavigate();
  const cardReference = useRef<HTMLDivElement>(null);
  const user = useUser();
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

  return (
    <>
      <Modal modal={modal} setModal={setModal}>
        <CreateEppForm />
      </Modal>
      <Modal modal={listModal} setModal={setListModal}>
        <EPPsList />
      </Modal>
      <div
        className={`card_container select_none ${roles.includes(user.role) ? "" : "hide"}`}
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/epp");
        }}
        ref={cardReference}
      >
        <CustomContextMenu cardReference={cardReference}>
          <ul>
            <li
              onClick={() => {
                setListModal(true);
              }}
            >
              <div className="option">
                <EyeIcon />
                Asignar EPP
              </div>
            </li>
            <li
              onClick={() => {
                setModal(true);
              }}
            >
              <div className="option">
                <AddIcon />
                Crear Epp
              </div>
            </li>
          </ul>
        </CustomContextMenu>
        <div className="card_icon">
          <img src={EppICon} alt={"Gallery"} draggable={false} />
        </div>
        <div className="card_name">
          <p className="select_none">Dotación, EPP</p>
        </div>
      </div>
    </>
  );
}

function CreateEppForm() {
  const [createEpp, { loading, error, data }] = useMutation(CREATE_ELEMENT, {
    refetchQueries: ["GetEpps"],
  });
  const eppEditor = new ElementEditor(MOCK_EPP as ElementFromQuery);
  // Realiza chequeo de los inputs válidos
  const [validInputs, setValidInputs] = useState<string[]>([]);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  const [epp, setEpp] = useState(eppEditor.stateCopy);
  const [singleClassification, setSingleClassification] = useState("");
  const [singleClassificationAmount, setSingleClassificationAmount] = useState(0);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(epp);
    const checkedInputs = checks.checkEmpty(
      { name: "name", type: "string" },
      { name: "classificationName", type: "string" },
    );
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0 && epp.classification.length > 0) {
      createEpp({
        variables: {
          elementData: eppEditor.toApi,
        },
      });
    }
  };
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    const value = evt.target.value;
    //@ts-ignore
    eppEditor.element[name] = value;
    setEpp(eppEditor.stateCopy);
  };

  const addClassification = () => {
    eppEditor.addClassification(singleClassification, singleClassificationAmount);
    setEpp(eppEditor.stateCopy);
  };

  const handleSingleClassification = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSingleClassification(evt.target.value);
  };

  const handleSingleClassificationAmount = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSingleClassificationAmount(parseInt(evt.target.value));
  };

  useEffect(() => {
    if (loading) {
      setToastProps({
        title: "Creación de EPP",
        body: "Se está procesando la creación del EPP, espere...",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (data) {
      setToastProps({
        title: "Creación de EPP",
        body: "EPP creado con éxito",
        footer: "Exito",
        theme: "success_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Creación de EPP",
        body: "Error creando el EPP",
        footer: "Exito",
        theme: "error_theme",
      });
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
        <InputBox inputName="name" isEmpty={validInputs.includes("name")} labelTag="Nombre" onChange={handleChange} value={epp.name} type="text" />
        <InputBox
          inputName="classificationName"
          isEmpty={validInputs.includes("classificationName")}
          labelTag="Nombre clasificación (ejemplo: Tallas)"
          onChange={handleChange}
          value={epp.classificationName}
          type="text"
        />
        <EppCategroySelect handleChange={handleChange}/>
        <div className="classificationContainer"></div>
        <div className="containerWithChips">
          <div className="classificationCreatorContainer">
            <InputBox
              inputName="singleClassification"
              isEmpty={false}
              labelTag="Clasificación (Ejemplo: XS)"
              onChange={handleSingleClassification}
              value={singleClassification}
              type="text"
            />
            <InputBox
              inputName="singleAmount"
              isEmpty={false}
              labelTag="Cantidad"
              onChange={handleSingleClassificationAmount}
              value={`${singleClassificationAmount}`}
              type="number"
            />
            <div className="buttonContainer">
              <button type="button" className="mediumBottom" onClick={addClassification}>
                +
              </button>
            </div>
          </div>
          <div className="chipsContainer">
            {epp.classification.map((classification, index) => (
              <div className="primary_theme" key={index}>
                {classification.name}: {classification.amount}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="mediumBottom">
          Crear Epp
        </button>
      </form>
    </>
  );
}

function EPPsList() {
  const {id} = useUser();
  const [selectedEpp, setSelectedEpp] = useState(MOCK_EPP as ElementFromQuery);
  const EppEditor = new ElementEditor(selectedEpp);
  const [movementInfo, setMovementInfo] = useState(MOCK_MOVEMENT_INFO);
  const [assignEpp, { loading, error, data }] = useMutation(ASSIGN_EPP, {refetchQueries: ["GetEpps", {
    variables: {
      workerId: movementInfo.workerId
    },
    query: GET_WORKER_BY_ID
  }]});
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
    const value = evt.target.value;
    setMovementInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    movementInfo.eppId = selectedEpp._id;
    movementInfo.movementMaker = id;
    movementInfo.amount = parseFloat(`${movementInfo.amount}`);

    const classificationInfo = selectedEpp.classification.find((element) => element.id === movementInfo.classificationId);

    //Check if user can move the element
    if(EppEditor.userCanDistribute(id, movementInfo.amount)){
      assignEpp({
        variables: {
          movementInfo,
        },
      });
    }else{
      alert("Este usuario no puede realizar este movimiento debido a que no está autorizado o no tiene las existencias necesarias")
    }
  };

  useEffect(() => {
    if (loading) {
      setToastProps({
        title: "Asignación de EPP",
        body: "Se está procesando la creación del EPP, espere...",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (data) {
      setToastProps({
        title: "Asignación de EPP",
        body: "EPP asignado con éxito",
        footer: "Exito",
        theme: "success_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Asignación de EPP",
        body: "Error asignando el EPP",
        footer: "Error",
        theme: "error_theme",
      });
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
        <Grid def={1} gap={12} lg={1} md={1} sm={1}>
          <EppSelect isEmpty={false} label="Listado de epps" name="epp" value="00123" setEpp={setSelectedEpp} />
          <WorkerSelectBox
            defaultOption={{ label: "Sin seleccionar", value: "0123456" }}
            isEmpty={false}
            label="Selecciona colaborador"
            name="workerId"
            onChange={handleChange}
            value={movementInfo.workerId}
          />
          <BodegaSelectBox defaultOption={{label: "Selecciona centro de costos", value: ""}} isEmpty={false} label="Selecciona centro de costos" name="folder" onChange={handleChange} value={movementInfo.folder}/>
          <InputBox
              inputName="date"
              isEmpty={false}
              labelTag="Fecha de entrega"
              onChange={handleChange}
              value={`${movementInfo.date}`}
              type="date"
            />
          <Grid def={1} gap={12} lg={2} md={2} sm={2}>
           <EppClassificationSelect handleChange={handleChange} selectedEpp={selectedEpp}/> 
            <InputBox
              inputName="amount"
              isEmpty={false}
              labelTag="Cantidad a entregar"
              onChange={handleChange}
              value={`${movementInfo.amount}`}
              type="text"
            />
            
          </Grid>
          <button type="submit" className="mediumBottom">
            Asignar
          </button>
        </Grid>
      </form>
    </>
  );
}
