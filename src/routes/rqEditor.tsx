import { useContext, useState } from "react";
import TrashCan from "../assets/icon/trashcan";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import BodegaSelectBox from "../components/bodegaSelectBox";
import BottomStart from "../components/bottomStart";
import CategorySelectBox from "../components/categorySelectBox";
import Grid from "../components/grid";
import InputBox from "../components/inputElement";
import Layout from "../components/layout";
import MaterialSelect from "../components/materialSelect";
import Modal from "../components/modal";
import RqMenu from "../components/rqMenu";
import Title from "../components/title";
import Toast from "../components/toast";
import CreateRqProvider, { CreateRqContext } from "../contexts/createRqContext";
import RQ_ITEM_MOCK from "../data/mock.newItem.json";
import RQControll from "../utils/rq.controll";

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
  const { rqControll, setRqInfo, rqOption, handleSubmit, handleChange, rqInfo, handleSelects, handleNewMaterial, elementControll, saveNewMaterial, newElement } = useContext(CreateRqContext);
  const [rqNewItem, setRqNewItem] = useState<RQItems>(RQ_ITEM_MOCK);
  const [selectedMaterial, setSelectedMaterial] = useState<PricaMaterial>({
    name: "",
    _id: "",
    unit: "",
    category: "",
    amount: 0
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
    let newItem: RQItemsFromQuery = {
      ...rqNewItem,
      materialId: selectedMaterial._id,
      material: {
        unit: selectedMaterial.unit,
        name: selectedMaterial.name,
        type: selectedMaterial.category,
        _id: selectedMaterial._id,
        amount: selectedMaterial.amount
      }
    };
    rqControll.rq.rqItems.push(JSON.parse(JSON.stringify(newItem)));
    console.log(rqControll.rq)
    setRqInfo(rqControll.stateCopy);
  };

  if (rqOption === "GENERAL") {
    return (
      <form onSubmit={handleSubmit}>
        <InputBox inputName="rq" isEmpty={false} labelTag="Título de la requisición" onChange={handleChange} value={rqInfo.rq} type="text"/>
        <div className="pt_def_12"></div>
        <InputBox inputName="ppto" isEmpty={false} labelTag="Capitulo Presupuesto" onChange={handleChange} value={rqInfo.ppto} type="text"/>
        <div className="pt_def_12"></div>
        <BodegaSelectBox
          defaultOption={{
            label: "Selecciona una bodega...",
            value: "",
          }}
          name="project"
          label="Bodega"
          onChange={handleSelects}
          isEmpty={false}
          value={rqInfo.project._id}
        />
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
        <MaterialSelect
          setState={setSelectedMaterial}
          isEmpty={false}
          label="Material"
          name="material"
          value={`${rqNewItem.materialId}`}
          setRqNewItem={setRqNewItem}
          rqNewItem={rqNewItem}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="requiredAmount"
          isEmpty={false}
          labelTag="Cantidad solicitada"
          onChange={handleNewItem}
          value={`${rqNewItem.requiredAmount}`}
          type="number"
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="authorizedAmount"
          isEmpty={false}
          labelTag="Cantidad Autorizada"
          onChange={handleNewItem}
          value={`${rqNewItem.authorizedAmount}`}
          type="number"
          disabled={true}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="receivedAmount"
          isEmpty={false}
          labelTag="Cantidad Recibida"
          onChange={handleNewItem}
          value={`${rqNewItem.receivedAmount}`}
          type="number"
          disabled={true}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="pendingAmount"
          isEmpty={false}
          labelTag="Cantidad Pendiente"
          onChange={handleNewItem}
          value={`${rqNewItem.pendingAmount}`}
          type="number"
          disabled={true}
        />
        <div className="pt_def_12"></div>
        <InputBox inputName="observation" isEmpty={false} labelTag="Observación" onChange={handleNewItem} value={`${rqNewItem.observation}`} type="text"/>
        <div className="pt_def_12"></div>
        <button className="mediumBottom" type="submit">
          Guardar
        </button>
      </form>
    );
  }
  if (rqOption === "ADD_MATERIAL") {
    return (
      <form onSubmit={saveNewMaterial}>
        <InputBox
          inputName="name"
          isEmpty={false}
          labelTag="Nombre del material"
          onChange={handleNewMaterial}
          value={newElement.name}
          type="text"
        />
        <div className="pt_def_12"></div>
        <CategorySelectBox 
        isEmpty={false}
        label="Seleccione el tipo"
        name="category"
        onChange={handleNewMaterial}
        value={newElement.category}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="unit"
          isEmpty={false}
          labelTag="Unidad de medida"
          onChange={handleNewMaterial}
          value={newElement.unit}
          type="text"
        />
        <div className="pt_def_12"></div>
        <button className="mediumBottom" type="submit">
          Agregar material
        </button>
      </form>
    );
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
            <td style={{textTransform: "uppercase"}}>{item.material?.type}</td>
            <td>{item.material?.name}</td>
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
      <Grid gap={12} sm={2} md={2} lg={2} def={9} className="rqContainer rqBorder">
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
      <Grid gap={12} sm={2} md={2} lg={2} def={9} className="rqInfoContainer rqBorder">
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
          <p>Capitulo PPTO</p>
        </div>
        <div className="col_span_def_2">
          <p>{rqInfo.rq}</p>
          <p>{rqInfo.ppto}</p>
        </div>
      </Grid>
      <div className="pt_def_16"></div>
      <Grid gap={12} sm={2} md={2} lg={2} def={1} className="rqInfoContainer">
        <table className="rqTable">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
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
      <Grid gap={12} sm={2} md={2} lg={2} def={4} className="rqInfoContainer rqBorder">
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
          <p>{user.position}</p>
        </div>
      </Grid>
    </>
  );
}
