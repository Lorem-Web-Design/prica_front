import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { ElementFromQuery } from "../@types/elementTypes";
import { CREATE_REMISION, DELETE_ELEMENT } from "../api/myMutations";
import { EDIT_ELEMENT, GET_ELEMENT_BY_ID, GET_REMISIONS } from "../api/myQueries";
import EditIcon from "../assets/icon/edit";
import Sitemap from "../assets/icon/sitemap";
import TrashCan from "../assets/icon/trashcan";
import checkForms from "../utils/checkForms";
import ElementEditor from "../utils/elementEditor.controll";
import BodegaSelectBox from "./bodegaSelectBox";
import CustomContextMenu from "./customContextMenu";
import ElementClassificationSelect from "./eppClassificationSelect";
import InputBox from "./inputElement";
import Modal from "./modal";
import Toast from "./toast";
import UserByRoleSelectBox from "./userByRoleSelectBox";
import { imagesSource } from "../api/datasources";
import EyeIcon from "../assets/icon/eye";
import { useNavigate } from "react-router-dom";
import ElementsCategroySelect from "./ElementsCategorySelec";
import REMISION_FROM_QUERY from "../data/mock.multipleRemisionFromQuery.json";
import Remision from "../utils/remision.controller";
import useUser from "../customHooks/users/useUser";

type RemisionCard = {
  cardInfo: ElementFromQuery;
};

export default function NewElementCard({ cardInfo }: RemisionCard) {
const elementEditor = new ElementEditor(cardInfo);
  const cardReference = useRef<HTMLDivElement>(null);
  const [deleteElement, { data, error, loading }] = useMutation(DELETE_ELEMENT);
  const [modal, setModal] = useState(false);
  const [distributeModal, setDistributeModal] = useState(false);
  
  const navigate = useNavigate();
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
        title: "Eliminando elemento",
        body: "La operación está siendo ejecutada",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Eliminando elemento",
        body: "Error eliminando elemento",
        footer: "Error",
        theme: "error_theme",
      });
    }
    if (data) {
      setToast(true);
      setToastProps({
        title: "Eliminando elemento",
        body: "El elemento ha sido eliminada, recargue la página para ver los resultados",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
  }, [data, error, loading]);

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
        <EditElementForm elementEditor={elementEditor} />
      </Modal>
      <Modal modal={distributeModal} setModal={setDistributeModal}>
        <DistributeForm cardInfo={cardInfo} />
      </Modal>
      <div className="rqCardContainer" ref={cardReference}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
          <li
              onClick={()=>navigate(`/elemento/${cardInfo._id}`)}
            >
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
              <div className="option">
                <EditIcon />
                Editar
              </div>
            </li>
            <li
              onClick={() => {
                setDistributeModal(true);
              }}
            >
              <div className="option">
                <Sitemap />
                Distribuir
              </div>
            </li>
            <li
              onClick={() => {
                const deleteConfirmed = confirm("¿Estás seguro que deseas eliminar este elemento?");
                if (deleteConfirmed) {
                  deleteElement({ variables: { deleteElementById: cardInfo._id }, refetchQueries: ["GetElements"] });
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
        <div className="newElementContainer">
        <div className="newElementImage">
          <img src={`${imagesSource()}/${cardInfo.image}`} alt={cardInfo.name} />
        </div>
        <div className="newElementInfo">
            <p className="rqTitle">{cardInfo.name}</p>
        <p className="rqDate">Clasificación: {cardInfo.classificationName}</p>
        <p className="rqDate">
          Cantidad:
          {cardInfo.classification.map((clas, index) => (
            <span style={{ paddingRight: 4 }} key={index}>
              {clas.name}:{clas.amount}
            </span>
          ))}
        </p>
        <p className="rqDate">Categoría: {cardInfo.category}</p>
        <p className="rqDate">Proyecto: {cardInfo.takerFolder.name}</p>
        </div>
        </div>
      </div>
    </>
  );
}

function EditElementForm({ elementEditor }: { elementEditor: ElementEditor }) {
    
  const [editElement, { loading, error, data }] = useMutation(EDIT_ELEMENT, {
    refetchQueries: ["GetElements", {query: GET_ELEMENT_BY_ID, variables: {id: elementEditor.element._id}}],
    variables: {
        editElementId: elementEditor.element._id,
    },
  });
  const [selectedElement, setSelectedElement] = useState<ElementFromQuery>(elementEditor.element);
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
  const [element, setElement] = useState(elementEditor.stateCopy);
  const [currentClassification, setCurrentClassification] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [singleClassification, setSingleClassification] = useState("");
  const [singleClassificationAmount, setSingleClassificationAmount] = useState(0);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(element);
    const checkedInputs = checks.checkEmpty({ name: "name", type: "string" }, { name: "classificationName", type: "string" });
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0 && element.classification.length > 0) {
      editElement({
        variables: {
          editElementId: elementEditor.element._id,
          info: elementEditor.toApi,
        },
      });
    }
  };
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    const value = evt.target.value;
    //@ts-ignore
    elementEditor.element[name] = value;
    setElement(elementEditor.stateCopy);
  };

  const addItems = () => {
    elementEditor.addNewItems(currentClassification, currentAmount);
    setElement(elementEditor.stateCopy);
  };

  const addClassification = () => {
    elementEditor.addClassification(singleClassification, singleClassificationAmount);
    setElement(elementEditor.stateCopy);
  };

  const handleCurrentClassification = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentClassification(evt.target.value);
  };

  const handleCurrentAmount = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentAmount(parseFloat(evt.target.value));
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
        title: "Actualización de Elemento",
        body: "Se está procesando la actualización del elemento, espere...",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (data) {
      setToastProps({
        title: "Actualización de Elemento",
        body: "Elemento actualizado con éxito",
        footer: "Exito",
        theme: "success_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Actualización de Elemento",
        body: "Error actualizando el Elemento",
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
        <InputBox
          inputName="name"
          isEmpty={validInputs.includes("name")}
          labelTag="Nombre"
          onChange={handleChange}
          value={element.name}
          type="text"
        />
        <InputBox
          inputName="classificationName"
          isEmpty={validInputs.includes("classificationName")}
          labelTag="Nombre clasificación (ejemplo: Tallas)"
          onChange={handleChange}
          value={element.classificationName}
          type="text"
        />
        <ElementsCategroySelect handleChange={handleChange} value={element.category} />
        <BodegaSelectBox
          defaultOption={{
            label: "Selecciona una bodega...",
            value: "",
          }}
          name="takerFolder"
          label="Bodega"
          onChange={handleChange}
          isEmpty={false}
          value={element.takerFolder._id}
          disabled={false}
          className="defaultButton"
        />
        <UserByRoleSelectBox
          defaultOption={{
            label: "Selecciona un colaborador...",
            value: "",
          }}
          name="currentOwner"
          label="Persona a cargo"
          onChange={handleChange}
          isEmpty={validInputs.includes("currentOwner")}
          value={element.currentOwner._id}
          disabled={false}
        />
        <div className="containerWithChips">
          <div className="classificationCreatorContainer">
            <ElementClassificationSelect handleChange={handleCurrentClassification} selectedEpp={selectedElement} />

            <InputBox
              inputName="currentAmount"
              isEmpty={false}
              labelTag="Cantidad a ingresar"
              onChange={handleCurrentAmount}
              value={`${currentAmount}`}
              type="number"
            />
            <div className="buttonContainer">
              <button type="button" className="mediumBottom" onClick={addItems}>
                +
              </button>
            </div>
          </div>
          <div className="chipsContainer">
            {element.classification.map((classification, index) => (
              <div className="primary_theme" key={index}>
                {classification.name}: {classification.amount}
              </div>
            ))}
          </div>
        </div>

        <h3>Añadir nueva clasificación</h3>
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
        <button type="submit" className="mediumBottom">
          Actualizar
        </button>
      </form>
    </>
  );
}

function DistributeForm({ cardInfo }: RemisionCard) {
  const {id} = useUser();
  const [editElement, { loading, error, data }] = useMutation(EDIT_ELEMENT, {
    refetchQueries: ["GetElements"],
    variables: {
      editElementId: cardInfo._id,
    },
  });
  const [selectedElement, setSelectedElement] = useState<ElementFromQuery>(cardInfo);
  const elementEditor = new ElementEditor(cardInfo);

  //Remisiones
  const remision = new Remision(REMISION_FROM_QUERY);
  const [saveRemision, { data: dataRemision, loading: loadingRemision, error: errorRemision }] = useMutation(CREATE_REMISION, {
      refetchQueries: [{query: GET_REMISIONS}],
    });
    
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
  const [element, setElement] = useState(elementEditor.stateCopy);
  const [currentClassification, setCurrentClassification] = useState("");
  const [owner, setOwner] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState(0);

  //Remision

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    //Remision information
    let remisionData = {
      receiver: owner,
      remitent: id,
      date: `${new Date()}`,
      elementsList: [{element: cardInfo._id, amount: amount}],
      receiverProject: location,
      remitentProject: "CAMBIAR !!!!!!!!!!!!!",
      observation: "Remisión generada automaticamente al realizar distribución de elementos"
    }

    saveRemision({
      variables: {
        remisionData,
      },
    });

    //Check if there is enough to distribute
    if (elementEditor.allowDistribution(currentClassification, amount)) {
      elementEditor.assignEpp({
        owner,
        location,
        amount,
        classificationId: currentClassification,
      });
      setElement(elementEditor.stateCopy);

      editElement({
        variables: {
          editElementId: cardInfo._id,
          info: elementEditor.toApi,
        },
      });
    } else {
      alert("No hay suficientes elementos");
    }
  };

  const handleCurrentClassification = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentClassification(evt.target.value);
  };

  const handleCurrentAmount = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAmount(parseFloat(evt.target.value));
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
        <BodegaSelectBox
          defaultOption={{
            label: "Selecciona una bodega...",
            value: "",
          }}
          name="takerFolder"
          label="Bodega"
          onChange={(evt) => {
            setLocation(evt.target.value);
          }}
          isEmpty={false}
          value={location}
          disabled={false}
          className="defaultButton"
        />
        <UserByRoleSelectBox
          defaultOption={{
            label: "Selecciona un colaborador...",
            value: "",
          }}
          name="currentOwner"
          label="Persona a cargo"
          onChange={(evt) => {
            setOwner(evt.target.value);
          }}
          isEmpty={validInputs.includes("currentOwner")}
          value={owner}
          disabled={false}
        />
        <div className="containerWithChips">
          <div className="classificationCreatorContainer">
            <ElementClassificationSelect handleChange={handleCurrentClassification} selectedEpp={selectedElement} />
            <InputBox
              inputName="currentAmount"
              isEmpty={false}
              labelTag="Cantidad a asignar"
              onChange={handleCurrentAmount}
              value={`${amount}`}
              type="number"
            />
          </div>
          <div className="chipsContainer">
            {element.stock?.map((classification, index) => (
              <div className="primary_theme" key={index}>
                {classification.classificationId}: {classification.amount}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="mediumBottom">
          Actualizar
        </button>
      </form>
    </>
  );
}
