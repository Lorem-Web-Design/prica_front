import { useContext, useState } from "react";
import BodegaSelectBox from "../components/bodegaSelectBox";
import BottomStart from "../components/bottomStart";
import CategorySelectBox from "../components/categorySelectBox";
import Grid from "../components/grid";
import ImageUploader from "../components/imageUploader";
import InputBox from "../components/inputElement";
import Layout from "../components/layout";
import UnitSelector from "../components/selector/unitSelector";
import Title from "../components/title";
import Toast from "../components/toast";
import WorkerSelectBox from "../components/workerSelectBox";
import CreateElementProvider, { CreateElementContext } from "../contexts/createElementContext";
import { useAuth } from "../customHooks/centers/auth/useAuth";

type FormByType = {
  selectedType: "Material" | "Equipo" | "Dotacion" | "Epp" | "Herramienta";
};

export default function CreateElement() {
  return (
    <CreateElementProvider>
      <Layout>
        {/* Titulo de la página actual */}
        <Title title="Crear elementos" description="Panel de creación de elementos" />
        <div className="pt_def_48"></div>
        {/* Formulario de los elementos se renderizará dependiendo del tipo de elemento elegido*/}
        <FormByType />
        {/* Barra de meníu inferior - shortcuts */}
        <BottomStart />
      </Layout>
    </CreateElementProvider>
  );
}

function FormByType() {
  const {
    elementInfo,
    handleChange,
    handleSubmit,
    validInputs,
    setToast,
    toast,
    toastProps,
    handleTypeChange,
    setImageUrl,
    setSaveImageTrigger,
    saveImageTrigger,
    elementEditor,
    setElementInfo,
  } = useContext(CreateElementContext);

  const { user } = useAuth();

  const [singleClassification, setSingleClassification] = useState("");
  const [singleClassificationAmount, setSingleClassificationAmount] = useState(0);

  const handleSingleClassification = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSingleClassification(evt.target.value);
  };

  const handleSingleClassificationAmount = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSingleClassificationAmount(parseInt(evt.target.value));
  };

  const addClassification = () => {
    if (elementInfo.takerFolder._id === "INDEFINIDO") {
      alert("Asigne una bodega");
    } else {
      elementEditor.addClassification(singleClassification, singleClassificationAmount, user.id);
      setElementInfo(elementEditor.stateCopy);
    }
  };

  const deleteClassification = (classificationId: string) => {
    elementEditor.deleteClassification(classificationId);
    setElementInfo(elementEditor.stateCopy);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      <Grid gap={12} def={6} sm={2} md={2} lg={6} className="">
        <ImageUploader saveImageTrigger={saveImageTrigger} setImageUrl={setImageUrl} setSaveImageTrigger={setSaveImageTrigger} />
        <div className="new_user_info col_s5">
          <InputBox
            onChange={handleChange}
            inputName="name"
            labelTag="Nombre"
            isEmpty={validInputs.includes("name")}
            value={elementInfo.name}
            type="text"
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
            className="hide"
          />
          <UnitSelector onChange={handleChange} value={elementInfo.unit} isEmpty={validInputs.includes("unit")} />
          <WorkerSelectBox
            defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
            name="currentOwner"
            label="Persona a cargo"
            onChange={handleChange}
            isEmpty={validInputs.includes("currentOwner")}
            value={elementInfo.currentOwner._id}
          />
          <InputBox
            inputName="classificationName"
            isEmpty={validInputs.includes("classificationName")}
            labelTag="Nombre clasificación (ejemplo: Tallas)"
            onChange={handleChange}
            value={elementInfo.classificationName}
            type="text"
          />
          <BodegaSelectBox
            defaultOption={{ label: "Selecciona una bodega...", value: "" }}
            name="takerFolder"
            label="Bodega"
            onChange={handleChange}
            isEmpty={validInputs.includes("takerFolder")}
            value={elementInfo.takerFolder._id}
          />
          <CategorySelectBox
            isEmpty={validInputs.includes("category")}
            label="Categoría"
            name="category"
            onChange={handleTypeChange}
            value={elementInfo.category}
          />
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
          <div className="containerWithChips">
            <div className="chipsContainer">
              {elementInfo.classification.map((classification, index) => (
                <div className="primary_theme" key={index}>
                  {classification.name}: {classification.amount}{" "}
                  <span className="material-symbols-outlined delete_category" onClick={() => deleteClassification(classification.id)}>
                    x_circle
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: 24 }}>
            <button className="bigButton" type="submit">
              + Añadir Elemento
            </button>
          </div>
        </div>
      </Grid>
    </form>
  );
}
