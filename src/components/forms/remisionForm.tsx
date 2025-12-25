import { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/centers/auth/useAuth";
import Remision from "../../utils/remision.controller";
import { CREATE_REMISION } from "../../api/myMutations";
import { GET_REMISIONS } from "../../api/myQueries";
import REMISION_FROM_QUERY from "../../data/mock.multipleRemisionFromQuery.json";
import { useMutation } from "@apollo/client";
import Toast from "../toast";
import Grid from "../grid";
import InputBox from "../inputElement";
import WorkerSelectBox from "../workerSelectBox";
import BodegaSelectBox from "../bodegaSelectBox";
import ElementSelectBox from "../elementSelectBox";
import ElementSelect from "../eppSelectList";
import MOCK_EPP from "../../data/mock.element.json";
import { ElementFromQuery, SelectType, Stock } from "../../@types/elementTypes";
import ElementClassificationSelect from "../selector/elementClassificationSelect";
import UserSelectBox from "../usersSelectBox";
import ElementStockSelect from "../selector/elementStockSelect";
import useUser from "../../customHooks/users/useUser";
import ParentChildrenSelectorForRemision from "../selector/parentChildrenSelectorForRemision";
import CategoryMaterialSelector from "../selector/categoryMaterialSelector";
import ELEMENT_FROM_QUERY_MOCK from "../../data/mock.element.json";
import CategoryMaterialSelectorForRm from "../selector/categoryMaterialSelectorForRm";

const remision = new Remision(REMISION_FROM_QUERY);

type RemisionTypes = {
  type: "ELEMENTS" | "EPP";
};
export default function RemisionCreator({ type }: RemisionTypes) {
  const { id } = useUser();

  const [remisionInfo, setRemisionInfo] = useState(remision.stateCopy);
  const [stockIndex, setStockIndex] = useState(0);
  const [currentElement, setCurrentElement] = useState(MOCK_EPP as ElementFromQuery);
  const [amount, setAmount] = useState(0);
  const [saveRemision, { data, loading, error }] = useMutation(CREATE_REMISION, {
    refetchQueries: [{ query: GET_REMISIONS }],
  });

  const [selectedMaterial, setSelectedMaterial] = useState<ElementFromQuery>(ELEMENT_FROM_QUERY_MOCK as ElementFromQuery);

  const handleAmount = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = evt.target.value;
    setAmount(parseFloat(value));
  };

  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const addElement = () => {
    let isAllowed = remision.allowAdd(
      amount,
      currentElement.stock?.[stockIndex]?.amount ?? 0,
      remision.data.receiver._id,
      remision.data.receiver._id
    );
    if (isAllowed) {
      let newElement = {
        element: {
          name: currentElement.name,
          _id: currentElement._id,
          unit: currentElement.unit,
          classificationId: currentElement.stock?.[stockIndex]?.classificationId || "",
          location: remision.data.receiver._id,
          stockId: currentElement.stock?.[stockIndex]?.stockId || "",
        },
        amount: amount,
      };
      setAmount(0);
      remision.data.elementsList.push(newElement);
      setRemisionInfo(remision.stateCopy);
    } else {
      alert("No hay suficientes unidades para remitir o los campos no se han llenado en su totalidad");
    }
  };

  const handleProjectReceiver = (evt: SelectType) => {
    //@ts-ignore
    const name = evt.label;
    const _id = evt.value;
    let project = {
      name,
      _id,
    };
    remision.data.receiverProject = project;
    setRemisionInfo(remision.stateCopy);
  };

  const handleReceiver = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //@ts-ignore
    const name = evt.target.options[evt.target.selectedIndex].text;
    const _id = evt.target.value;
    let receiverInfo = {
      name,
      _id,
      occupation: "",
    };
    remision.data.receiver = receiverInfo;
    setRemisionInfo(remision.stateCopy);
  };

  const createRemision = () => {
    remision.data.date = `${new Date()}`;
    saveRemision({
      variables: {
        remisionData: remision.toApi,
      },
    });
  };

  const handleObservation = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    remision.data.observation = evt.target.value;
    setRemisionInfo(remision.stateCopy);
  };

  const handleVariation = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(evt.target.value)
    const value = evt.target.value;
    remision.data.remitentProject._id = currentElement.stock?.[parseInt(value)]?.location || "";
    remision.data.remitent._id = id;
    setRemisionInfo(remision.stateCopy);
    setStockIndex(parseInt(value));
  };

  useEffect(() => {
    if (loading) {
      setToastProps({
        title: "Procesando remisión",
        body: "Se está procesando la remisión",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (data) {
      setToastProps({
        title: "Remisión",
        body: "Remisión creada exitosamente",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Remisión",
        body: "Error creando remisión, verifique sus datos",
        footer: "Exito",
        theme: "error_theme",
      });
      setToast(true);
    }
  }, [loading, error, data]);

  return (
    <div>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      <Grid gap={12} sm={2} md={2} lg={2} def={1}>
        <div>
          {/* Remitente */}
          <UserSelectBox
            isEmpty={false}
            onChange={() => {}}
            value={id}
            disabled={true}
            defaultOption={{ label: "Sin Seleccionar", value: "UNDEFINED" }}
            label="Nombre de Remitente"
            name="remitent"
          />
          <BodegaSelectBox
            defaultOption={{ label: "Sin seleccionar", value: "UNDEFINED" }}
            isEmpty={false}
            label="Proyecto"
            name="remitentProject"
            onChange={() => {}}
            value={remisionInfo.remitentProject._id}
            disabled={true}
          />
        </div>
        <div>
          {/* Receiver */}
          <WorkerSelectBox
            defaultOption={{ label: "Sin seleccionar", value: "UNDEFINED" }}
            isEmpty={false}
            label="Remitido a"
            name="receiver"
            onChange={handleReceiver}
            value={remisionInfo.receiver._id}
          />
        </div>
        <ParentChildrenSelectorForRemision
          isEmpty={false}
          label="Proyecto"
          name="receiverProject"
          value=""
          handleFolderSelect={handleProjectReceiver}
        />
        <InputBox
          inputName="observation"
          isEmpty={false}
          labelTag="Observaciones"
          onChange={handleObservation}
          value={remision.data.observation}
          type="text"
          className="col_s2"
        />
      </Grid>
      <h2>Elementos a remitir</h2>
      <CategoryMaterialSelectorForRm setState={setCurrentElement} isEmpty={false} label="Tipo" name="material" value={``} setRqNewItem={() => {}} />
      <ElementStockSelect handleChange={handleVariation} selectedEpp={currentElement} />
      {/* <ElementSelect isEmpty={false} label="Listado de elementos a remitir" name="epp" value="00123" setEpp={setCurrentElement} type={type}/> */}
      <Grid gap={12} sm={1} md={1} lg={2} def={1}>
        {/* <div>
          <ElementStockSelect handleChange={handleVariation} selectedEpp={currentElement}/>
        </div> */}
        <Grid gap={12} sm={1} md={2} lg={2} def={3}>
          <div className="col_s2">
            <InputBox
              inputName="elementAmount"
              isEmpty={false}
              labelTag="Cantidad a remitir"
              onChange={handleAmount}
              value={`${amount}`}
              type="number"
            />
          </div>
          <div className="flex aic jcc">
            <button className="addElementButton" onClick={addElement}>
              Añadir
            </button>
          </div>
        </Grid>
      </Grid>
      <h2>Elementos en la Remisión</h2>
      <Grid gap={12} sm={1} md={1} lg={1} def={1}>
        <table>
          <thead>
            <tr>
              <td className="txtBold">Descripción</td>
              <td className="txtBold">Cantidad</td>
            </tr>
          </thead>
          <tbody>
            {remisionInfo.elementsList.length === 0 ? (
              <tr>
                <td colSpan={2}>Añade elementos</td>
              </tr>
            ) : (
              remisionInfo.elementsList.map((element) => {
                return (
                  <tr key={element.element._id}>
                    <td>{element.element.name}</td>
                    <td>{element.amount}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Grid>
      <div className="pt_def_12"></div>
      <Grid gap={12} sm={3} md={3} lg={1} def={1}>
        <button className="pointer primary_theme defaultButton" onClick={createRemision}>
          Crear remisión
        </button>
      </Grid>
    </div>
  );
}
