import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import RQ_MOCK from "../data/mock.rq.json";
import RQ_MOCK_API from "../data/mock.rqToAPI.json";
import { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import RQControll from "../utils/rq.controll";
import RqMenu from "../components/rqMenu";
import Modal from "../components/modal";
import InputBox from "../components/inputElement";
import WorkerSelectBox from "../components/workerSelectBox";
import BodegaSelectBox from "../components/bodegaSelectBox";
import RQ_ITEM_MOCK from "../data/mock.newItem.json";
import { useMutation } from "@apollo/client";
import { CREATE_RQ } from "../api/myMutations";
import Toast from "../components/toast";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import MaterialSelect from "../components/materialSelect";

export default function RQEditor() {
  const rqControll = new RQControll(RQ_MOCK);
  const [rqInfo, setRqInfo] = useState<RQControllTypes>(rqControll.rq);
  const [rqInfoToAPI, setRqInfoToAPI] = useState<RQControllAPI>(RQ_MOCK_API);
  const [modal, setModal] = useState(false);
  const [rqOption, setRqOption] = useState("GENERAL");
  /* @ts-ignore*/
  const { user } = useAuth();

  //Save RQ in database
  const [storeRQ, { loading, data, error }] = useMutation(CREATE_RQ, {
    variables: { rqData: rqInfoToAPI },
  });

  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState<Toast>({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    /*@ts-ignore*/
    rqControll.rq[name] = value;
    setRqInfo(rqControll.stateCopy);
  };

  const handleSelects = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const name = evt.target.name;
    const value: string | number = evt.target.value;
    const selectName = evt.target.options[evt.target.selectedIndex].text;
    /*@ts-ignore*/
    rqControll.rq[name] = {
      _id: value,
      name: selectName,
    };
    setRqInfo(rqControll.stateCopy);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setModal(false);
    setRqInfo(rqControll.stateCopy);
  };

  const handleDelete = (id: string) => {
    rqControll.deleteRQItem(id);
    setRqInfo(rqControll.stateCopy);
  };

  useEffect(() => {
    console.log(rqInfoToAPI)
    setRqInfoToAPI(rqControll.rqToAPI);
  }, [rqInfo]);

  useEffect(() => {
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Cargando...",
        body: "Su RQ está siendo procesada",
        footer: "Guardando",
        theme: "primary_theme",
      });
    }
    if (data) {
      setToast(true);
      setToastProps({
        title: "RQ Creada...",
        body: "RQ Creada exitosamente",
        footer: "Operación realizada con exito",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      try {
        setToastProps({
          title: "Error creando RQ",
          //@ts-ignore
          body: `${error.graphQLErrors[0].extensions?.exception.message}`,
          /*@ts-ignore*/
          footer: `${error.cause?.extensions.code}`,
          theme: "error_theme",
        });
      } catch (err) {
        console.log(err);
        setToastProps({
          title: "Error creando RQ",
          //@ts-ignore
          body: `No se ha podido completar el proceso de creación de la RQ`,
          /*@ts-ignore*/
          footer: `ERROR_INTERNO`,
          theme: "error_theme",
        });
      }
    }
  }, [error, loading, data]);

  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Requisición" description="Crea la requisición para nuevos elementos:"/>
      <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast}
      />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <Grid gap={12} sm={2} md={2} lg={2} def={9} className="rqContainer rqBorder">
        <div className="col_span_def_2 rqLogoContainer">
          <div className="reqLogo">
            <img src={PRC_LOGO} alt="PRICA SAS" />
          </div>
        </div>
        <div className="col_span_def_5 rqFlexYCentered">
          <div className="reqTitles">
            <p className="rqCenteredText">PROCESO DE COMPRAS</p>
            <p className="rqCenteredText">
              FORMATO REQUISICION DE MATERIALES Y HERRAMIENTAS
            </p>
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
            </tr>
            <RQItems rqItems={rqInfo.rqItems} handleDelete={handleDelete} />
          </thead>
        </table>
      </Grid>
      <div className="pt_def_16"></div>
      <Grid
        gap={12}
        sm={2}
        md={2}
        lg={2}
        def={4}
        className="rqInfoContainer rqBorder"
      >
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
      <RqMenu/>
      <Modal modal={modal} setModal={setModal}>
        <GeneralRQInfo
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          rqInfo={rqInfo}
          activeTab={rqOption}
          setRqInfo={setRqInfo}
          rqControll={rqControll}
          handleSelects={handleSelects}
        />
      </Modal>
      <BottomStart />
    </Layout>
  );
}

type GeneralRQInfoTypes = {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: (
    evt: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  rqInfo: RQControllTypes;
  setRqInfo: (value: React.SetStateAction<RQControllTypes>) => void;
  activeTab: string;
  rqControll: RQControll;
  handleSelects: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
};

function GeneralRQInfo({
  handleSubmit,
  handleChange,
  rqInfo,
  activeTab,
  setRqInfo,
  rqControll,
  handleSelects,
}: GeneralRQInfoTypes) {
  const [rqNewItem, setRqNewItem] = useState<RQItems>(RQ_ITEM_MOCK);
  const [selectedMaterial, setSelectedMaterial] = useState<PricaMaterial>({
    "name": "",
    _id:"",
    "unit":"",
    "type":""
  })

  const handleNewItem = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    setRqNewItem((prev) => {
      return { ...prev, [name]: value };
    });
  };


  const addNewItem = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    let newItem:RQItems = {
        ...rqNewItem,
        materialId: selectedMaterial._id,
        unit: selectedMaterial.unit,
        name: selectedMaterial.name
    }
    rqControll.rq.rqItems.push(JSON.parse(JSON.stringify(newItem)));
    setRqInfo(rqControll.stateCopy);
  };

  if (activeTab === "GENERAL") {
    return (
      <form onSubmit={handleSubmit}>
        <InputBox
          inputName="ppto"
          isEmpty={false}
          labelTag="Capitulo Presupuesto"
          onChange={handleChange}
          value={rqInfo.ppto}
        />
        <div className="pt_def_12"></div>
        <WorkerSelectBox
          defaultOption={{
            label: "Selecciona un colaborador...",
            value: "",
          }}
          name="petitioner"
          label="Solicitante"
          onChange={handleSelects}
          isEmpty={false}
          value={rqInfo.petitioner._id}
        />
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
  if (activeTab === "RQ_ITEMS") {
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
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="authorizedAmount"
          isEmpty={false}
          labelTag="Cantidad Autorizada"
          onChange={handleNewItem}
          value={`${rqNewItem.authorizedAmount}`}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="receivedAmount"
          isEmpty={false}
          labelTag="Cantidad Recibida"
          onChange={handleNewItem}
          value={`${rqNewItem.receivedAmount}`}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="pendingAmount"
          isEmpty={false}
          labelTag="Cantidad Pendiente"
          onChange={handleNewItem}
          value={`${rqNewItem.pendingAmount}`}
        />
        <div className="pt_def_12"></div>
        <InputBox
          inputName="observation"
          isEmpty={false}
          labelTag="Observación"
          onChange={handleNewItem}
          value={`${rqNewItem.observation}`}
        />
        <div className="pt_def_12"></div>
        <button className="mediumBottom" type="submit">
          Guardar
        </button>
      </form>
    );
  }
  return <div>Mmm, algo salió mal</div>;
}

type RQITemsTypes = {
  rqItems: RQControllTypes["rqItems"];
  handleDelete: (id: string) => void;
};

function RQItems({ rqItems, handleDelete }: RQITemsTypes) {
  if (rqItems.length === 0) {
    return (
      <tr>
        <td colSpan={9}>Empieza agregando items</td>
      </tr>
    );
  }
  return (
    <>
      {rqItems.map((item, index) => {
        return (
          <tr key={index}>
            <td>{index}</td>
            <td>{item.type}</td>
            <td>{item.name}</td>
            <td>{item.unit}</td>
            <td>{item.requiredAmount}</td>
            <td>{item.authorizedAmount}</td>
            <td>{item.receivedAmount}</td>
            <td>{item.pendingAmount}</td>
            <td>{item.observation}</td>
            <td
              onClick={() => {
                handleDelete(item.materialId);
              }}
            >
              delete
            </td>
          </tr>
        );
      })}
    </>
  );
}
