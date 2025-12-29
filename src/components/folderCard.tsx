import { useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DELETE_FOLDER_BY_ID, EDIT_FOLDER_BY_ID } from "../api/myMutations";
import Toast from "./toast";
import Modal from "./modal";
import FolderControll from "../utils/folder.controll";
import InputBox from "./inputElement";
import checkForms from "../utils/checkForms";
import CustomContextMenu from "./customContextMenu";
import TrashCan from "../assets/icon/trashcan";
import EditICon from "../assets/icon/sitemap";
import EditIcon from "../assets/icon/sitemap";

type Card = {
  icon: string;
  name: string;
  route: string;
  ID: string;
  isParent:boolean
  parentId: string
  hide?: boolean
};
export default function FolderCard({ icon, name, route, ID, isParent, parentId, hide }: Card) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const cardReference = useRef<HTMLDivElement>(null);

  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const [deleteFolder, { data, error, loading }] = useMutation(DELETE_FOLDER_BY_ID, { variables: { folderId: ID }, refetchQueries: ["ParentFolders"] });
  useEffect(() => {
    if (loading) {
      setToastProps({
        title: "Eliminando centro",
        body: "La operacion esta siendo ejecutada, espere...",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (data) {
      setToastProps({
        title: "Eliminando centro",
        body: "El centro ha sido eliminado, recarga la pestaña para ver los cambios",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Eliminando centro",
        body: "Ocurrio un error al ejecutar esta acción",
        footer: "Error",
        theme: "error_theme",
      });
      setToast(true);
    }
  }, [data, error, loading]);
  return (
    <>
      <Modal modal={modal} setModal={setModal}>
        <EditFolderForm
          folderInfo={{
            image: icon,
            isParent,
            name,
            parentId,
            _id: ID,
          }}
          ID={ID}
        />
      </Modal>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />

      <div
        className={`card_container select_none ${hide ? "hide" : ''}`}
        onClick={() => {
          navigate(`${route}`);
        }}
        ref={cardReference}
      >
        <CustomContextMenu cardReference={cardReference}>
        <ul>
              <li onClick={()=>setModal(true)}>
                <div className="option">
                  <EditIcon/>
                  Editar
                </div>
              </li>
              <li
                onClick={() => {
                  const deleteConfirmed = confirm(`¿Estás seguro que deseas eliminar la bodega: ${name}?`);
                  if (deleteConfirmed) {
                    deleteFolder();
                  }
                }}
              >
                <div className="option">
                  <TrashCan/>
                  Eliminar
                </div>
              </li>
            </ul>
        </CustomContextMenu>
        <div className="card_icon">
          <img src={icon} alt={name} draggable={false} />
        </div>
        <div className="card_name">
          <p className="select_none">{name}</p>
        </div>
      </div>
    </>
  );
}

type CreateFolderForm = {
  folderInfo: Bodega;
  ID: string;
};

function EditFolderForm({ folderInfo, ID }: CreateFolderForm) {
  const [folderData, setFolderData] = useState(folderInfo);
  const [editFolder, { data, loading, error }] = useMutation(EDIT_FOLDER_BY_ID);

  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const [validInputs, setValidInputs] = useState<string[]>([]);
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    let value = evt.target.value;
    setFolderData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(folderData);
    const checkedInputs = checks.checkEmpty({ name: "name", type: "string" });
    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0) {
      const fixedData = JSON.parse(JSON.stringify(folderData))
      delete fixedData._id;
      editFolder({variables: { folderData: fixedData, folderId: ID }});
    }
  };

  useEffect(() => {
    if (data) {
      setToast(true);
      setToastProps({
        title: "Edición de bodega",
        body: "Bodega editada con éxito, recarga para ver los cambios",
        footer: "SUCCESS",
        theme: "success_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Edición de bodega",
        body: "Error editando bodega",
        footer: "ERROR",
        theme: "error_theme",
      });
    }
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Edición de bodega",
        body: "Cargando datos",
        footer: "Waiting...",
        theme: "primary_theme",
      });
    }
  }, [error, loading, data]);

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
        <InputBox
          inputName="name"
          isEmpty={validInputs.includes("parentId")}
          labelTag="Nombre de bodega"
          onChange={handleChange}
          value={folderData.parentId}
          type="text"
          disabled={true}
          className="hide"
        />
        <div className="pt_def_12"></div>
        <button className="mediumBottom" type="submit">
          Guardar
        </button>
      </form>
    </>
  );
}
