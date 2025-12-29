import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ElementFromQuery, RawRemision } from "../@types/elementTypes";
import { imagesSource } from "../api/datasources";
import { EDIT_ELEMENT, GET_ELEMENT_BY_ID, GET_ELEMENTS } from "../api/myQueries";
import FROM_QUERY_ELEMENT from "../data/mock.element.json";
import checkForms from "../utils/checkForms";
import ElementEditor from "../utils/elementEditor.controll";
import ApolloErrorPage from "./apolloErrorPage";
import BodegaSelectBox from "./bodegaSelectBox";
import CategorySelectBox from "./categorySelectBox";
import Grid from "./grid";
import InputBox from "./inputElement";
import Modal from "./modal";
import Toast from "./toast";
import WorkerSelectBox from "./workerSelectBox";
import Remision from "./remision";
import GalleryViewer from "./galleryViewer";
import UnitSelector from "./selector/unitSelector";

export default function ElementById({ elementEditor }: { elementEditor: ElementEditor }) {
  var { id } = useParams();

  const [elementInfo, setElementInfo] = useState<ElementFromQuery>(FROM_QUERY_ELEMENT as ElementFromQuery);
  const [validInputs, setValidInputs] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("FOLDER");
  const [isGalleryActive, setIsGalleryActive] = useState(false)

  const { loading, error, data } = useQuery(GET_ELEMENT_BY_ID, {
    variables: { getElementById: id },
  });

  const [editElement, { data: elementData, loading: elementLoading, error: elementError }] = useMutation(EDIT_ELEMENT, {
    variables: {
      info: elementEditor.toApi,
      editElementId: id,
    },
    refetchQueries: [
      {
        query: GET_ELEMENT_BY_ID,
        variables: { getElementById: id },
      },
      "GetElements"
    ],
  });

  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    //@ts-ignore
    elementEditor.element[name] = value;
    setElementInfo(elementEditor.stateCopy);
  };

  const handleChangeFolderWithHistory = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const name = evt.target.options[evt.target.selectedIndex].text;
    let value: string | number = evt.target.value;
    //Defining new taker and giver folder
    // New giver folder is the current takerFolder if onDelivery flag is set to true
    const newGiverFolder = {
      _id: elementEditor.element.onDelivery ? elementEditor.element.giverFolder._id : elementEditor.element.takerFolder._id,
      name: elementEditor.element.onDelivery ? elementEditor.element.giverFolder.name : elementEditor.element.takerFolder.name,
    };
    //newTakerFolder is the value selected by the user
    const newTakerFolder = {
      name,
      _id: value,
    };

    const acceptChange = confirm("Obtendras una vista previa en la pestaña de Historial, una vez selecciones Registrar cambios la información se almacenará permanentemente");
    if (acceptChange) {
      //Update takerFolder and giverFolder with the new info
      elementEditor.element.takerFolder = newTakerFolder;
      elementEditor.element.giverFolder = newGiverFolder;

      const historyItem = JSON.parse(
        JSON.stringify({
          giver: elementEditor.element.currentOwner,
          giverFolder: newGiverFolder,
          taker: elementEditor.element.currentOwner,
          takerFolder: newTakerFolder,
        })
      );
      elementEditor.element.history.push(historyItem);
      setElementInfo(elementEditor.stateCopy);
    }
  };

  const handleChangeWorkerWithHistory = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const name = evt.target.options[evt.target.selectedIndex].text;
    let value: string | number = evt.target.value;
    //newTakerFolder is the value selected by the user
    const newOwner = {
      name,
      _id: value,
    };

    const acceptChange = confirm("Obtendras una vista previa en la pestaña de Historial, una vez selecciones Registrar cambios la información se almacenará permanentemente");
    if (acceptChange) {
      //Update takerFolder and giverFolder with the new info
      const historyItem = JSON.parse(
        JSON.stringify({
          giver: elementEditor.element.currentOwner,
          giverFolder: elementEditor.element.giverFolder,
          taker: newOwner,
          takerFolder: elementEditor.element.takerFolder,
        })
      );
      elementEditor.element.currentOwner = {
        name: "",
        _id: value
      };
      elementEditor.element.history.push(historyItem);
      setElementInfo(elementEditor.stateCopy);
    }
  };

  const handleFolderAndUser = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    editElement({
      variables: {
        info: elementEditor.toApi,
        editElementId: id,
      },
    });
  }

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(elementInfo);
    const checkedInputs = checks.checkEmpty(
      { name: "name", type: "string" },
      { name: "serial", type: "string" },
      { name: "description", type: "string" },
      { name: "currentOwner", type: "string" },
      { name: "unit", type: "string" }
    );
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0) {
      editElement({
        variables: {
          info: elementEditor.toApi,
          editElementId: id,
        },
      });
      if (elementData) {
        console.log("ok");
      }
      if (elementError) {
        console.log(elementError);
      }
      setToastProps({
        title: "Edición del elemento",
        body: "La información ha sido actualizada",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
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
    elementEditor.element.image = image;
    setElementInfo(elementEditor.stateCopy);
  }

  useEffect(() => {
    if (data) {
      console.log(data)
      elementEditor.element = JSON.parse(JSON.stringify(data.getElementById)) as ElementFromQuery;
      setElementInfo(data.getElementById);
    }
  }, [data]);

  useEffect(()=>{
    if(elementLoading){
      setToastProps({
          title: "Actualización en curso",
          body: "Guardando información, espere...",
          footer: "SUCCESS",
          theme: "primary_theme"
      })
      setToast(true);
  }
  if(elementData){
      setToastProps({
          title: "Actualización del elemento",
          body: "El elemento se ha actualizado exitosamente",
          footer: "SUCCESS",
          theme: "primary_theme"
      })
      setToast(true);
  }
  if(elementError){
      setToastProps({
          title: "Actualización del elemento",
          body: "Ha ocurrido un error actualizando la información del elemento",
          footer: "ERROR",
          theme: "error_theme"
      })
      setToast(true);
  }
  },[elementLoading, elementError, elementData])



  const modalChild = () => {
    if (activeTab === "WORKER") {
      return (
        <Grid gap={12} def={1} sm={1} md={1} lg={1}>
          <form onSubmit={handleFolderAndUser}>
          <WorkerSelectBox
            defaultOption={{
              label: "Selecciona un colaborador...",
              value: "",
            }}
            name="currentOwner"
            label="Persona a cargo"
            onChange={handleChangeWorkerWithHistory}
            isEmpty={validInputs.includes("currentOwner")}
            value={elementInfo.currentOwner._id}
            disabled={false}
          />
          <button className="btn mediumBottom">
            Registrar cambio
          </button>
          </form>
        </Grid>
      );
    }

    if (activeTab === "FOLDER") {
      return (
        <Grid gap={12} def={1} sm={1} md={1} lg={1}>
          <form onSubmit={handleFolderAndUser}>
          <BodegaSelectBox
            defaultOption={{
              label: "Selecciona una bodega...",
              value: "",
            }}
            name="takerFolder"
            label="Bodega"
            onChange={handleChangeFolderWithHistory}
            isEmpty={false}
            value={elementInfo.takerFolder._id}
            disabled={false}
            className="defaultButton"
          />
          <button className="btn mediumBottom" type="submit">
            Registrar cambio
          </button>
          </form>
        </Grid>
      );
    }

    if(activeTab === "REMISION"){
      return (
        <Remision elementEditor={elementEditor} setElementInfo={setElementInfo}/>
      )
    }
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (data) {
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
          {modalChild()}
        </Modal>
        <Modal modal={imageModal} setModal={setImageModal}>
          <GalleryViewer action={updateImage} isActive={isGalleryActive}/>
        </Modal>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <Grid gap={12} def={1} sm={6} md={6} lg={6} className="center_def">
            {/* <InputImage  /> */}
            <div className="user_image_container">
              <div className="user_image" onClick={()=>{
                setImageModal(true)
                setIsGalleryActive(true)
              }}>
                <img src={`${imagesSource()}/${elementInfo.image}`} alt="Element image" />
              </div>
            </div>
            <div className="new_user_info col_s5">
            <InputBox
                onChange={handleChange}
                inputName="image"
                labelTag="Imagen"
                isEmpty={validInputs.includes("image")}
                value={elementInfo.image}
                type="text"
                className="hide"
              />
              <InputBox
                onChange={handleChange}
                inputName="name"
                labelTag="Nombre"
                isEmpty={validInputs.includes("name")}
                value={elementInfo.name}
                type="text"
              />
              <UnitSelector
                onChange={handleChange}
                isEmpty={validInputs.includes("unit")}
                value={elementInfo.unit}
              />
              <InputBox
                onChange={handleChange}
                inputName="serial"
                labelTag="Referencia"
                isEmpty={validInputs.includes("serial")}
                value={elementInfo.serial}
                type="text"
              />
              <InputBox
                onChange={handleChange}
                inputName="description"
                labelTag="Descripción"
                isEmpty={validInputs.includes("description")}
                value={elementInfo.description}
                type="text"
              />
              <InputBox
                onChange={handleChange}
                inputName="provider"
                labelTag="Proveedor"
                isEmpty={validInputs.includes("provider")}
                value={elementInfo.provider}
                type="text"
              />
              <InputBox
                onChange={handleChange}
                inputName="amount"
                labelTag="Cantidad"
                isEmpty={validInputs.includes("amount")}
                value={`${elementInfo.amount}`}
                type="number"
                disabled={false}
              />
              <WorkerSelectBox
                defaultOption={{
                  label: "Selecciona un colaborador...",
                  value: "",
                }}
                name="currentOwner"
                label="Persona a cargo"
                onChange={handleChange}
                isEmpty={validInputs.includes("currentOwner")}
                value={elementInfo.currentOwner._id}
                disabled={true}
              />
              <BodegaSelectBox
                defaultOption={{
                  label: "Selecciona una bodega...",
                  value: "",
                }}
                name="takerFolder"
                label="Bodega"
                onChange={handleChange}
                isEmpty={validInputs.includes("takerFolder")}
                value={elementInfo.takerFolder._id}
                disabled={true}
              />
              <CategorySelectBox
                isEmpty={validInputs.includes("category")}
                label="Categoría"
                name="category"
                onChange={handleChange}
                value={elementInfo.category}
                disabled={false}
              />
              <Grid gap={12} def={1} sm={2} md={3} lg={4}>
                <button className="mediumBottom" type="submit">
                  Actualizar
                </button>
                <a
                  className="mediumBottom defaultButton"
                  onClick={() => {
                    setModal(true);
                    setActiveTab("REMISION");
                  }}
                >
                  Remisión
                </a>
                <a
                  className="mediumBottom defaultButton"
                  onClick={() => {
                    setModal(true);
                    setActiveTab("FOLDER");
                  }}
                >
                  Cambio de Bodega
                </a>
                <a
                  className="mediumBottom defaultButton"
                  onClick={() => {
                    setModal(true);
                    setActiveTab("WORKER");
                  }}
                >
                  Cambio Encargado
                </a>
              </Grid>
            </div>
          </Grid>
          <div style={{ paddingTop: 16 }}></div>

          
        </form>
        <Grid gap={12} def={1} sm={1} md={1} lg={1}>
            <h2>Remisiones</h2>
            <table>
              <thead>
                <tr>
                  <th>Entrega</th>
                  <th>Recibe</th>
                  <th>Bodega anterior</th>
                  <th>Bodega Actual</th>
                  <th>Cantidad entregada</th>
                </tr>
              </thead>
              <tbody>
                {elementInfo.remision.length === 0  ? <tr><td colSpan={5}>No se han creado remisiones</td></tr> : elementInfo.remision.map((remision, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{remision.giver.name}</td>
                      <td>{remision.taker.name}</td>
                      <td>{remision.giverFolder.name}</td>
                      <td>{remision.takerFolder.name}</td>
                      <td>{remision.amount}</td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
          </Grid>
          <Grid gap={12} def={1} sm={1} md={1} lg={1}>
            <h2>Historial del elemento</h2>
            <table>
              <thead>
                <tr>
                  <th>Último a cargo</th>
                  <th>Actual a cargo</th>
                  <th>Bodega anterior</th>
                  <th>Bodega Actual</th>
                </tr>
              </thead>
              <tbody>
                {elementInfo.history.length === 0  ? <tr><td colSpan={5}>Este elemento aún no tiene un historial</td></tr> :elementInfo.history.map((history, index: number) => {
                  return (
                    <tr key={index}>
                      <td>{history.giver.name}</td>
                      <td>{history.taker.name}</td>
                      <td>{history.giverFolder.name}</td>
                      <td>{history.takerFolder.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Grid>
      </>
    );
  }

  if (error) {
    //@ts-ignore
    return <ApolloErrorPage error={error.graphQLErrors[0]} customCode="400" />;
  }

  return <div>No se ha podido cargar la información :(</div>;
}

