import { useContext, useEffect, useState } from "react";
import BodegaSelectBox from "../components/bodegaSelectBox";
import BottomStart from "../components/bottomStart";
import CategorySelectBox from "../components/categorySelectBox";
import Grid from "../components/grid";
import InputBox from "../components/inputElement";
import InputImage from "../components/inputImage";
import Layout from "../components/layout";
import Title from "../components/title";
import Toast from "../components/toast";
import WorkerSelectBox from "../components/workerSelectBox";
import CreateElementProvider, { CreateElementContext } from "../contexts/createElementContext";
import ErrorPage from "../components/errorPage";
import Modal from "../components/modal";
import GalleryViewer from "../components/galleryViewer";
import { imagesSource } from "../api/datasources";

type FormByType = {
  selectedType: "Material" | "Equipo" | "Dotacion" | "Epp" | "Herramienta";
};

enum SelectedType {
  MATERIAL = "Material",
  EQUIPO = "Equipo",
  DOTACION = "Dotacion",
  EPP = "EPP",
  HERRAMIENTA = "Herramienta",
}

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
    setFile,
    validInputs,
    setToast,
    toast,
    toastProps,
    selectedType,
    handleTypeChange,
    elementEditor,
    setElementInfo,
  } = useContext(CreateElementContext);
  const [imageModal, setImageModal] = useState(false);

  const updateImage = (image: string) => {
    elementEditor.element.image = image;
    setElementInfo(elementEditor.stateCopy);
  };

  if (selectedType === SelectedType.MATERIAL) {
    return (
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
          <Modal modal={imageModal} setModal={setImageModal}>
            <GalleryViewer action={updateImage} />
          </Modal>
          <div className="user_image_container">
            <div
              className="user_image"
              onClick={() => {
                setImageModal(true);
              }}
            >
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
            />

            <InputBox
              onChange={handleChange}
              inputName="unit"
              labelTag="Unidad"
              isEmpty={validInputs.includes("unit")}
              value={`${elementInfo.unit}`}
              type="text"
            />

            <WorkerSelectBox
              defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
              name="currentOwner"
              label="Persona a cargo"
              onChange={handleChange}
              isEmpty={validInputs.includes("currentOwner")}
              value={elementInfo.currentOwner}
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
  if (selectedType === SelectedType.EQUIPO) {
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
        <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
          <InputImage setFile={setFile} />
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
              labelTag="Serial"
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
            />
            <WorkerSelectBox
              defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
              name="currentOwner"
              label="Persona a cargo"
              onChange={handleChange}
              isEmpty={validInputs.includes("currentOwner")}
              value={elementInfo.currentOwner}
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
  if (selectedType === SelectedType.DOTACION) {
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
        <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
          <InputImage setFile={setFile} />
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
              labelTag="Serial"
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
            />
            <WorkerSelectBox
              defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
              name="currentOwner"
              label="Persona a cargo"
              onChange={handleChange}
              isEmpty={validInputs.includes("currentOwner")}
              value={elementInfo.currentOwner}
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
  if (selectedType === SelectedType.HERRAMIENTA) {
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
        <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
          <InputImage setFile={setFile} />
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
              labelTag="Serial"
              isEmpty={validInputs.includes("serial")}
              value={elementInfo.serial}
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
            />
            <InputBox
              onChange={handleChange}
              inputName="description"
              labelTag="Descripción"
              isEmpty={validInputs.includes("description")}
              value={elementInfo.description}
              type="text"
            />
            <WorkerSelectBox
              defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
              name="currentOwner"
              label="Persona a cargo"
              onChange={handleChange}
              isEmpty={validInputs.includes("currentOwner")}
              value={elementInfo.currentOwner}
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
  if (selectedType === SelectedType.EPP) {
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
        <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
          <InputImage setFile={setFile} />
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
              labelTag="Serial"
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
            />
            <WorkerSelectBox
              defaultOption={{ label: "Selecciona un colaborador...", value: "" }}
              name="currentOwner"
              label="Persona a cargo"
              onChange={handleChange}
              isEmpty={validInputs.includes("currentOwner")}
              value={elementInfo.currentOwner}
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
  return (
    <ErrorPage
      code="404"
      message="Este tipo de elemento todavía no tiene un formulario"
      description="ERR_CREATE_ELEMENT: No se ha creado el formulario para este tipo de elemento"
    />
  );
}
