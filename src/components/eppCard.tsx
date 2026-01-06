import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { ElementFromQuery, EppElementFromQuery } from "../@types/elementTypes";
import { DELETE_ELEMENT } from "../api/myMutations";
import { EDIT_ELEMENT } from "../api/myQueries";
import EditIcon from "../assets/icon/edit";
import Sitemap from "../assets/icon/sitemap";
import TrashCan from "../assets/icon/trashcan";
import checkForms from "../utils/checkForms";
import ElementEditor from "../utils/elementEditor.controll";
import BodegaSelectBox from "./bodegaSelectBox";
import CustomContextMenu from "./customContextMenu";
import EppCategroySelect from "./eppCategorySelect";
import EppClassificationSelect from "./eppClassificationSelect";
import InputBox from "./inputElement";
import Modal from "./modal";
import Toast from "./toast";
import UserByRoleSelectBox from "./userByRoleSelectBox";
import { useAuth } from "../customHooks/centers/auth/useAuth";

type RemisionCard = {
  cardInfo: ElementFromQuery;
};

export default function EppCard({ cardInfo }: RemisionCard) {
  const cardReference = useRef<HTMLDivElement>(null);
  const [deleteEpp, { data, error, loading }] = useMutation(DELETE_ELEMENT);
  const [modal, setModal] = useState(false);
  const [distributeModal, setDistributeModal] = useState(false);
  const eppEditor = new ElementEditor(
    JSON.parse(JSON.stringify(cardInfo)) as ElementFromQuery
  );

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
        <EditEppForm eppEditor={eppEditor} />
      </Modal>
      <Modal modal={distributeModal} setModal={setDistributeModal}>
        <DistributeForm cardInfo={cardInfo} />
      </Modal>
      <div className="rqCardContainer" ref={cardReference}>
        <CustomContextMenu cardReference={cardReference}>
          <ul>
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
                const deleteConfirmed = confirm(
                  "¿Estás seguro que deseas eliminar este elemento?"
                );
                if (deleteConfirmed) {
                  deleteEpp({
                    variables: { deleteElementById: cardInfo._id },
                    refetchQueries: ["GetEpps"],
                  });
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
        <p className="rqDate">Proyecto: {cardInfo.category}</p>
      </div>
    </>
  );
}

function EditEppForm({ eppEditor }: { eppEditor: ElementEditor }) {
  const [editEpp, { loading, error, data }] = useMutation(EDIT_ELEMENT, {
    refetchQueries: ["GetEpps"],
    variables: {
      editElementId: eppEditor.element._id,
    },
  });

  const { user } = useAuth();
  const [selectedEpp, setSelectedEpp] = useState<ElementFromQuery>(
    eppEditor.element
  );
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
  const [currentClassification, setCurrentClassification] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [singleClassification, setSingleClassification] = useState("");
  const [singleClassificationAmount, setSingleClassificationAmount] =
    useState(0);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const checks = new checkForms(epp);
    const checkedInputs = checks.checkEmpty(
      { name: "name", type: "string" },
      { name: "classificationName", type: "string" }
    );
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0 && epp.classification.length > 0) {
      editEpp({
        variables: {
          editElementId: eppEditor.element._id,
          info: eppEditor.toApi,
        },
      });
    }
  };
  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = evt.target.name;
    const value = evt.target.value;
    //@ts-ignore
    eppEditor.element[name] = value;
    setEpp(eppEditor.stateCopy);
  };

  const addItems = () => {
    eppEditor.addNewItems(currentClassification, currentAmount);
    setEpp(eppEditor.stateCopy);
  };

  const addClassification = () => {
    eppEditor.addClassification(
      singleClassification,
      singleClassificationAmount,
      user.id
    );
    setEpp(eppEditor.stateCopy);
  };

  const handleCurrentClassification = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentClassification(evt.target.value);
  };

  const handleCurrentAmount = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentAmount(parseFloat(evt.target.value));
  };

  const handleSingleClassification = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSingleClassification(evt.target.value);
  };

  const handleSingleClassificationAmount = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        <InputBox
          inputName="name"
          isEmpty={validInputs.includes("name")}
          labelTag="Nombre"
          onChange={handleChange}
          value={epp.name}
          type="text"
        />
        <InputBox
          inputName="classificationName"
          isEmpty={validInputs.includes("classificationName")}
          labelTag="Nombre clasificación (ejemplo: Tallas)"
          onChange={handleChange}
          value={epp.classificationName}
          type="text"
        />
        <EppCategroySelect handleChange={handleChange} value={epp.category} />
        <BodegaSelectBox
          defaultOption={{
            label: "Selecciona una bodega...",
            value: "",
          }}
          name="takerFolder"
          label="Bodega"
          onChange={handleChange}
          isEmpty={false}
          value={epp.takerFolder?._id}
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
          value={epp.currentOwner?._id}
          disabled={false}
          role="coord_sst"
        />
        <div className="containerWithChips">
          <div className="classificationCreatorContainer">
            <EppClassificationSelect
              handleChange={handleCurrentClassification}
              selectedEpp={selectedEpp}
            />

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
            {epp.classification.map((classification, index) => (
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
            <button
              type="button"
              className="mediumBottom"
              onClick={addClassification}
            >
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
  const [editEpp, { loading, error, data }] = useMutation(EDIT_ELEMENT, {
    refetchQueries: ["GetEpps"],
    variables: {
      editElementId: cardInfo._id,
    },
  });
  const [selectedEpp, setSelectedEpp] = useState<EppElementFromQuery>(cardInfo);
  const eppEditor = new ElementEditor(cardInfo);
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
  const [currentClassification, setCurrentClassification] = useState("");
  const [owner, setOwner] = useState("");
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    //Check if there is enough to distribute
    if (eppEditor.allowDistribution(currentClassification, amount)) {
      eppEditor.stockFixer();
      //Object to assign
      const distributeObject = {
        owner,
        location,
        amount,
        classificationId: currentClassification,
      };

      eppEditor.assignEpp(distributeObject);
      setEpp(eppEditor.stateCopy);
      editEpp({
        variables: {
          editElementId: cardInfo._id,
          info: eppEditor.toApi,
        },
      });
    } else {
      alert("No hay suficientes elementos");
    }
  };

  const handleCurrentClassification = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCurrentClassification(evt.target.value);
  };

  const handleCurrentAmount = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
          role="coord_sst"
        />
        <div className="containerWithChips">
          <div className="classificationCreatorContainer">
            <EppClassificationSelect
              handleChange={handleCurrentClassification}
              selectedEpp={selectedEpp}
            />
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
            {epp.classification.map((classification, index) => {
              return (
                <div className="primary_theme" key={index}>
                  {classification.name}: {classification.amount}
                </div>
              );
            })}
          </div>
        </div>
        <button type="submit" className="mediumBottom">
          Actualizar
        </button>
      </form>
    </>
  );
}
