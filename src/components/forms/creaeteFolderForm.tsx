import { useEffect, useState } from "react";
import FolderControll from "../../utils/folder.controll";
import { useMutation } from "@apollo/client";
import { ADD_FOLDER } from "../../api/myMutations";
import checkForms from "../../utils/checkForms";
import InputBox from "../inputElement";
import BodegaSelectBox from "../bodegaSelectBox";
import Toast from "../toast";

type CreateFolderForm = {
    folderControll: FolderControll;
  };
  
  export default function CreateFolderForm({ folderControll }: CreateFolderForm) {
    const [folderData, setFolderData] = useState(folderControll.stateCopy);
    const [createFolder, { data, loading, error }] = useMutation(ADD_FOLDER, {
      variables: { folderData },
      refetchQueries: ["ParentFolders", "Folders"]
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
          title: "Creación de centro de costos",
          body: "Centro de costos creado con éxito",
          footer: "SUCCESS",
          theme: "primary_theme",
        });
      }
      if (error) {
        setToast(true);
        setToastProps({
          title: "Creación de centro de costos",
          body: "Error creando centro de costos",
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
            labelTag="Nombre de centro de costos"
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
            label="A que centro de costos pertenece?"
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