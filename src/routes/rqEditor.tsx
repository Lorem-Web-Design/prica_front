import { useContext, useState } from "react";
import TrashCan from "../assets/icon/trashcan";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import RQMaterialSelect from "../components/RQMaterialSelect";
import BodegaSelectBox from "../components/bodegaSelectBox";
import BottomStart from "../components/bottomStart";
import CategorySelectBox from "../components/categorySelectBox";
import CreateFolderForm from "../components/forms/creaeteFolderForm";
import Grid from "../components/grid";
import InputBox from "../components/inputElement";
import Layout from "../components/layout";
import Modal from "../components/modal";
import RqMenu from "../components/rqMenu";
import Title from "../components/title";
import Toast from "../components/toast";
import CreateRqProvider, { CreateRqContext } from "../contexts/createRqContext";
import RQ_ITEM_MOCK from "../data/mock.newItem.json";
import ELEMENT_FROM_QUERY_MOCK from "../data/mock.element.json"
import RQControll from "../utils/rq.controll";
import FolderControll from "../utils/folder.controll";
import ParentChildrenSelector from "../components/selector/parentChildrenSelector";
import CategoryMaterialSelector from "../components/selector/categoryMaterialSelector";
import EppClassificationSelect from "../components/eppClassificationSelect";
import { ElementFromQuery } from "../@types/elementTypes";
import UnitSelector from "../components/selector/unitSelector";
import WorkerSelectBox from "../components/workerSelectBox";
import ElementClassificationSelect from "../components/selector/elementClassificationSelect";

/*La vaina se puso complicada llave, acá pongo unos conceptos que te daran una luz en el futuro

Estados y constantes - Requisición

0. rqControll: Esta es la instanciación de la clase RQController

1. rqInfo: rqInfo es la información de la rq que se muestra en pantalla, es gestionada por RQController y aplicada al estado mediante el método rqControll.stateCopy

2.rqOption: Es la información del menú que está abierto si el menú de configuración general o el de añadir nuevo elemento

Nota importantisima: El componente que inicia el renderizado del contexto no puede pasar sus propiedades porque aún no han sido inicializadas
*/

export default function RQEditor() {
  return (
    <CreateRqProvider>
      <Layout>
        {/* Titulo de la página actual */}
        <Title title="Requisición" description="Crea la requisición para nuevos elementos:" />
        <ModalAndToastWrapper />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <RQLayout />
        <RqMenu />
        <BottomStart />
      </Layout>
    </CreateRqProvider>
  );
}

function GeneralRQInfo() {
  const { rqControll, setRqInfo, rqOption, handleSubmit, handleChange, rqInfo, handleSelects, handleNewMaterial, elementControll, saveNewMaterial, newElement, validInputs } = useContext(CreateRqContext);
  const [rqNewItem, setRqNewItem] = useState<RQItems>(RQ_ITEM_MOCK);
  const [selectedMaterial, setSelectedMaterial] = useState<ElementFromQuery>(ELEMENT_FROM_QUERY_MOCK as ElementFromQuery);
  const [selectedEppId, setSelectedEppId] = useState("");
  const folderControll = new FolderControll({
      image: "/assets/icons/mmcndmgr.dll_14_30612-1.png",
      isParent: false,
      name: "",
      parentId: "",
    });


  const handleNewItem = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    setRqNewItem((prev) => {
      return {
        ...prev, 
        [name]: value };
    });
  };

  const addNewItem = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    let newItem: RQItemsFromQuery;
    let categoryName = selectedMaterial.classification[parseInt(selectedEppId)]
      newItem = {
        ...rqNewItem,
        materialId: selectedMaterial._id,
        materialCategory: selectedMaterial.category,
        classificationId: categoryName?.id,
        material: {
          unit: selectedMaterial.unit,
          name: selectedMaterial.name,
          type: selectedMaterial.category,
          _id: selectedMaterial._id,
          amount: selectedMaterial.amount,
          unitaryPrice: 0,
          description: selectedMaterial.description === "" ? "SIN DEFINIR" : selectedMaterial.description,
          serial: categoryName?.name || "SIN DEFINIR",
          classification: [],
          stock: []
        }
      };
    rqControll.rq.rqItems.push(JSON.parse(JSON.stringify(newItem)));
    setRqInfo(rqControll.stateCopy);
  };

  if (rqOption === "GENERAL") {
    return (
      <form onSubmit={handleSubmit}>
        <InputBox inputName="rq" isEmpty={false} labelTag="Título de la requisición" onChange={handleChange} value={rqInfo.rq} type="text"/>
        <div className="pt_def_12"></div>
        <InputBox inputName="ppto" isEmpty={false} labelTag="PRC" onChange={handleChange} value={rqInfo.ppto} type="number"/>
        <div className="pt_def_12"></div>
        <ParentChildrenSelector  isEmpty={false} label="Bodega" name="folder" value=""/>
        <div className="pt_def_12"></div>
        <button className="mediumBottom" type="submit">
          Guardar
        </button>
      </form>
    );
  }
  if (rqOption === "RQ_ITEMS") {
    return (
      <form onSubmit={addNewItem}>
        <CategoryMaterialSelector 
          setState={setSelectedMaterial}
          isEmpty={false}
          label="Tipo"
          name="material"
          value={`${rqNewItem.materialId}`}
          setRqNewItem={setRqNewItem}/>
        <ElementClassificationSelect handleChange={(evt)=>setSelectedEppId(evt.target.value)} selectedEpp={selectedMaterial}/>
        <InputBox
          inputName="requiredAmount"
          isEmpty={false}
          labelTag="Cantidad solicitada"
          onChange={handleNewItem}
          value={`${rqNewItem.requiredAmount}`}
          type="number"
        />
        <InputBox
          inputName="authorizedAmount"
          isEmpty={false}
          labelTag="Cantidad Autorizada"
          onChange={handleNewItem}
          value={`${rqNewItem.authorizedAmount}`}
          type="number"
          disabled={true}
        />
        <InputBox
          inputName="receivedAmount"
          isEmpty={false}
          labelTag="Cantidad Recibida"
          onChange={handleNewItem}
          value={`${rqNewItem.receivedAmount}`}
          type="number"
          disabled={true}
        />
        <InputBox
          inputName="pendingAmount"
          isEmpty={false}
          labelTag="Cantidad Pendiente"
          onChange={handleNewItem}
          value={`${rqNewItem.pendingAmount}`}
          type="number"
          disabled={true}
        />
        <InputBox inputName="observation" isEmpty={false} labelTag="Observación" onChange={handleNewItem} value={`${rqNewItem.observation}`} type="text"/>
        <button className="mediumBottom" type="submit">
          Guardar
        </button>
      </form>
    );
  }
  if (rqOption === "ADD_MATERIAL") {
    return (
      <>
      <form onSubmit={saveNewMaterial}>
            <Grid gap={12} def={6} sm={1} md={1} lg={1} className="">
              <div className="new_user_info col_s5">
                <InputBox
                  onChange={handleNewMaterial}
                  inputName="name"
                  labelTag="Nombre"
                  isEmpty={validInputs.includes("name")}
                  value={newElement.name}
                  type="text"
                />
                <InputBox
                  onChange={handleNewMaterial}
                  inputName="serial"
                  labelTag="Referencia"
                  isEmpty={validInputs.includes("serial")}
                  value={newElement.serial}
                  type="text"
                />
                <InputBox
                  onChange={handleNewMaterial}
                  inputName="description"
                  labelTag="Descripción"
                  isEmpty={validInputs.includes("description")}
                  value={newElement.description}
                  type="text"
                />
                <InputBox
                  onChange={handleNewMaterial}
                  inputName="provider"
                  labelTag="Proveedor"
                  isEmpty={validInputs.includes("provider")}
                  value={newElement.provider}
                  type="text"
                />
                <InputBox
                  onChange={handleNewMaterial}
                  inputName="amount"
                  labelTag="Cantidad"
                  isEmpty={validInputs.includes("amount")}
                  value={`${newElement.amount}`}
                  type="number"
                />
                <UnitSelector onChange={handleNewMaterial} value={newElement.unit} isEmpty={validInputs.includes("unit")}/>
                <WorkerSelectBox
                  defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
                  name="currentOwner"
                  label="Persona a cargo"
                  onChange={handleNewMaterial}
                  isEmpty={validInputs.includes("currentOwner")}
                  value={newElement.currentOwner._id}
                />
                <BodegaSelectBox
                  defaultOption={{ label: "Selecciona una bodega...", value: "" }}
                  name="takerFolder"
                  label="Bodega"
                  onChange={handleNewMaterial}
                  isEmpty={validInputs.includes("takerFolder")}
                  value={newElement.takerFolder._id}
                />
                <CategorySelectBox
                  isEmpty={validInputs.includes("category")}
                  label="Categoría"
                  name="category"
                  onChange={handleNewMaterial}
                  value={newElement.category}
                />
                <div style={{ paddingTop: 24 }}>
                  <button className="bigButton" type="submit">
                    + Añadir Elemento
                  </button>
                </div>
              </div>
            </Grid>
          </form>
      </>
    );
  }
  if(rqOption === "ADD_FOLDER"){
    return(
      <CreateFolderForm folderControll={folderControll}/>
    )
  }
  return <div>Mmm, algo salió mal</div>;
}

function RQItems() {
  const { deleteItem, rqInfo } = useContext(CreateRqContext);
  if (rqInfo.rqItems.length === 0) {
    return (
      <tr>
        <td colSpan={10}>Empieza agregando items</td>
      </tr>
    );
  }
  return (
    <>
      {rqInfo.rqItems.map((item, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td style={{textTransform: "uppercase"}}>{item.material?.serial}</td>
            <td>{`${item.material?.name}`}</td>
            <td>{item.material?.unit}</td>
            <td>{item.requiredAmount}</td>
            <td>{item.authorizedAmount}</td>
            <td>{item.receivedAmount}</td>
            <td>{item.pendingAmount}</td>
            <td>{item.observation}</td>
            <td
              onClick={() => {deleteItem(item.materialId)}} className="deleteRqItem"
            >
              <TrashCan />
            </td>
          </tr>
        );
      })}
    </>
  );
}

function ModalAndToastWrapper() {
  const { toastProps, toast, setToast, modal, setModal } = useContext(CreateRqContext);
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
        <GeneralRQInfo />
      </Modal>
    </>
  );
}

function RQLayout() {
  const { user, rqInfo } = useContext(CreateRqContext);
  return (
    <>
      <Grid
          gap={12}
          sm={9}
          md={9}
          lg={9}
          def={9}
          className="rqContainer rqBorder"
        >
        <div className="col_span_def_2 rqLogoContainer">
          <div className="reqLogo">
            <img src={PRC_LOGO} alt="PRICA SAS" />
          </div>
        </div>
        <div className="col_span_def_5 rqFlexYCentered">
          <div className="reqTitles">
            <p className="rqCenteredText">PROCESO DE COMPRAS</p>
            <p className="rqCenteredText">FORMATO REQUISICION DE MATERIALES Y HERRAMIENTAS</p>
            <p className="rqCenteredText">PARTE OPERATIVA</p>
          </div>
        </div>
        <div className="rqFlexYCentered">
          <div className="rqCustom">
            <p>FECHA</p>
            <p>CÓDIGO</p>
            <p>VERSIÓN</p>
          </div>
        </div>
        <div className="rqFlexYCentered">
          <div className="rqCustomProps">
            <p>30/08/2024</p>
            <p>0001</p>
            <p>1</p>
          </div>
        </div>
      </Grid>
      <div className="pt_def_16"></div>
      <Grid
          gap={12}
          sm={9}
          md={9}
          lg={9}
          def={9}
          className="rqInfoContainer rqBorder"
        >
        <div className="col_span_def_2">
          <p>Fecha</p>
          <p>Proyecto</p>
        </div>
        <div className="col_span_def_3">
          <p>{RQControll.rqDate(Date.now())}</p>
          <p>{rqInfo.project.name}</p>
        </div>
        <div className="col_span_def_2">
          <p>No. Solicitud</p>
          <p>PRC </p>
        </div>
        <div className="col_span_def_2">
          <p>{rqInfo.rq}</p>
          <p>{rqInfo.ppto}</p>
        </div>
      </Grid>
      <div className="pt_def_16"></div>
      {/* Información de la RQ */}
      <Grid gap={12} sm={2} md={2} lg={1} def={1} className="rqInfoContainer">
        <table className="rqTable">
          <thead>
            <tr>
              <th>Código</th>
              <th>Ref</th>
              <th>Descripción</th>
              <th>Unidad</th>
              <th>Cantidad solicitada</th>
              <th>Cantidad Autorizada</th>
              <th>Cantidad recibida en obra</th>
              <th>Cantidad pendientes</th>
              <th>Observaciones</th>
              <th></th>
            </tr>
            <RQItems />
          </thead>
        </table>
      </Grid>
      <div className="pt_def_16"></div>
      {/* Información del solicitante */}
      <Grid gap={12} sm={2} md={2} lg={4} def={4} className="rqInfoContainer rqBorder">
        <div>
          <p>SOLICITANTE</p>
        </div>
        <div>
          <p>{user.name}</p>
        </div>
        <div>
          <p>CARGO</p>
        </div>
        <div>
          <p>{user.role}</p>
        </div>
      </Grid>
    </>
  );
}
