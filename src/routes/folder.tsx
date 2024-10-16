import Layout from "../components/layout";
import BottomStart from "../components/bottomStart";
import Title from "../components/title";
import Grid from "../components/grid";
import Card from "../components/cards";
import { GET_PARENTFOLDERS } from "../api/myQueries";
import { useMutation, useQuery } from "@apollo/client";
import ApolloErrorPage from "../components/apolloErrorPage";
import Modal from "../components/modal";
import { useEffect, useState } from "react";
import InputBox from "../components/inputElement";
import BodegaSelectBox from "../components/bodegaSelectBox";
import FolderControll from "../utils/folder.controll";
import { ADD_FOLDER } from "../api/myMutations";
import Toast from "../components/toast";
import checkForms from "../utils/checkForms";
import FolderCard from "../components/folderCard";

export default function Folder() {
  const folderControll = new FolderControll({
    image: "/assets/icons/mmcndmgr.dll_14_30612-1.png",
    isParent: false,
    name: "",
    parentId: "",
  });
  const { loading, error, data } = useQuery(GET_PARENTFOLDERS);
  const [modal, setModal] = useState(false);

  if (loading)
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Bodegas"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={2} lg={2} def={1} className="">
          {/* @ts-ignore */}
          <div className="loader"></div>
        </Grid>
        <BottomStart />
      </Layout>
    );

  if (error) {
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Bodegas"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={2} lg={2} def={1} className="">
          {/* @ts-ignore */}
          <ApolloErrorPage error={error.graphQLErrors[0]} customCode="400" />
        </Grid>
        <BottomStart />
      </Layout>
    );
  }

  if (data) {
    let myData = data.parentFolders as Bodega[];
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Bodegas"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={2} lg={2} def={6} className="">
          {myData.map(({ name, image, _id, isParent, parentId }) => (
            <FolderCard name={name} icon={image} route={_id} key={_id} ID={_id} isParent={isParent} parentId={parentId}/>
          ))}
          <Modal modal={modal} setModal={setModal}>
            <CreateFolderForm folderControll={folderControll} />
          </Modal>
        </Grid>
        <div className="pt_def_12"></div>
        <Grid gap={12} sm={2} md={2} lg={2} def={6}>
          <button className="mediumBottom" onClick={() => setModal(true)}>
            + Crear centro
          </button>
        </Grid>
        <BottomStart />
      </Layout>
    );
  }

  return <div>Holi!</div>;
}

type CreateFolderForm = {
  folderControll: FolderControll;
};
function CreateFolderForm({ folderControll }: CreateFolderForm) {
  const [folderData, setFolderData] = useState(folderControll.stateCopy);
  const [createFolder, { data, loading, error }] = useMutation(ADD_FOLDER, {
    variables: { folderData },
  });

  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const [validInputs, setValidInputs] = useState<string[]>([]);
  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    // @ts-ignore
    folderControll.folder[name] = value;
    setFolderData(folderControll.stateCopy);
  };

  const handleFolderType = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: string | number = evt.target.value;
    if (value === "parent") {
      folderControll.folder.isParent = true;
    }
    if (value === "children") {
      folderControll.folder.isParent = false;
    }
    setFolderData(folderControll.stateCopy);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (folderControll.folder.isParent === true) {
      folderControll.folder.parentId = "undefined";
    }
    const checks = new checkForms(folderControll.folder);
    const checkedInputs = checks.checkEmpty(
      { name: "parentId", type: "string" },
      { name: "name", type: "string" }
    );
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0) {
      createFolder();
      console.log("Saving folder...");
    }
  };

  useEffect(() => {
    if (data) {
      setToast(true);
      setToastProps({
        title: "Creación de bodega",
        body: "Bodega creada con éxito",
        footer: "SUCCESS",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Creación de bodega",
        body: "Error creando bodega",
        footer: "ERROR",
        theme: "error_theme",
      });
    }
  }, [data]);

  return (
    <>
      <Toast
        body={toastProps.body}
        setToast={setToast}
        theme={toastProps.theme}
        title={toastProps.title}
        footer={toastProps.footer}
        isActive={toast}
      />
      <form onSubmit={handleSubmit}>
        <InputBox
          inputName="name"
          isEmpty={validInputs.includes("name")}
          labelTag="Nombre de bodega"
          onChange={handleChange}
          value={folderData.name}
          type="text"
        />
        <div className="pt_def_12"></div>
        <div
          className={`input_container gap_12 ${
            validInputs.includes("isParent") ? "error" : ""
          }`}
        >
          <label htmlFor={"isParent"}>{"Tipo de centro"}</label>
          <select
            className="editable_input width_100"
            id={"isParent"}
            name={"isParent"}
            onChange={handleFolderType}
            value={`${folderData.isParent ? "parent" : "children"}`}
          >
            <option value="parent">Centro principal</option>
            <option value="children">Subcentro</option>
          </select>
        </div>
        <div className="pt_def_12"></div>
        <BodegaSelectBox
          defaultOption={{ label: "Seleccione el centro", value: "" }}
          isEmpty={validInputs.includes("parentId")}
          label="A que bodega pertenece?"
          name="parentId"
          onChange={handleChange}
          value={folderData.parentId}
          className={`${folderData.isParent ? "hide" : ""}`}
        />
        <div className="pt_def_12"></div>
        <button className="mediumBottom" type="submit">
          Guardar
        </button>
      </form>
    </>
  );
}
