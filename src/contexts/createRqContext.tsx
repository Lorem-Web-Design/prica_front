import { useMutation } from "@apollo/client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ElementFromQuery } from "../@types/elementTypes";
import { CREATE_ELEMENT, CREATE_RQ } from "../api/myMutations";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import AS_QUERY_ELEMENT from "../data/mock.element.json";
import RQ_MOCK from "../data/mock.rq.json";
import RQ_MOCK_API from "../data/mock.rqToAPI.json";
import ElementEditor from "../utils/elementEditor.controll";
import RQControll from "../utils/rq.controll";

type RqContextInfo = {
  rqControll: RQControll;
  toast: boolean;
  newElement: ElementFromQuery 
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastProps: Toast;
  setToastProps: React.Dispatch<React.SetStateAction<Toast>>;
  rqInfo: RQFromQuery;
  setRqInfo: React.Dispatch<React.SetStateAction<RQFromQuery>>;
  rqInfoToAPI: RQControllAPI;
  setRqInfoToAPI: React.Dispatch<React.SetStateAction<RQControllAPI>>;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  rqOption: string;
  setRqOption: React.Dispatch<React.SetStateAction<string>>;
  storeRQ: any;
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSelects: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
  handleNewMaterial: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  saveNewMaterial: (evt: React.FormEvent<HTMLFormElement>) => void;
  deleteItem: (id: string) => void;
  user: AuthUser;
  elementControll: ElementEditor
}

const ContextDefaultValue: RqContextInfo = {
  toast: false,
  setToast: () => false,
  setToastProps: () => {},
  toastProps: {
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  },
  rqInfo: RQ_MOCK,
  setRqInfo: () => {},
  rqInfoToAPI: RQ_MOCK_API,
  setRqInfoToAPI: () => {},
  modal: false,
  setModal: () => {},
  rqOption: "",
  setRqOption: () => {},
  storeRQ: () => {},
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {},
  handleSelects: (evt: React.ChangeEvent<HTMLSelectElement>) => {},
  handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => {},
  handleNewMaterial: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {},
  saveNewMaterial: (evt: React.FormEvent<HTMLFormElement>) => {},
  deleteItem: (id: string) => {},
  newElement: AS_QUERY_ELEMENT as ElementFromQuery,
  rqControll: new RQControll(RQ_MOCK),
  user: {
    id: "",
    name: "",
    position: "",
    role: "",
    token: "",
  },
  elementControll: new ElementEditor(AS_QUERY_ELEMENT as ElementFromQuery)
};

export const CreateRqContext = createContext(ContextDefaultValue);

export default function CreateRqProvider({ children }: PropsWithChildren) {
  // Controlador de requisicion
  const elementControll = new ElementEditor(AS_QUERY_ELEMENT as ElementFromQuery)
  const rqControll = new RQControll(RQ_MOCK);
  //User authO
  const { user } = useAuth();

  //set initial values
  rqControll.rq.petitioner = {
    name: user.name,
    _id: user.id
  }
  
  //Toast Inicialization
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  //Estados
  const [rqInfo, setRqInfo] = useState<RQFromQuery>(rqControll.rq);
  const [rqInfoToAPI, setRqInfoToAPI] = useState<RQControllAPI>(RQ_MOCK_API);
  const [newElement, setNewElement] = useState(elementControll.stateCopy);

  const [modal, setModal] = useState(false);
  const [rqOption, setRqOption] = useState("GENERAL");

  //Querys and mutations
  const [storeRQ, { loading, data, error }] = useMutation(CREATE_RQ, {
    variables: { rqData: rqInfoToAPI },
  });

  const [storeMaterials, { loading: loadingMaterials, data: materialData, error: materialError }] = useMutation(CREATE_ELEMENT);

  //Handlers
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const deleteItem = (id: string) => {
    let confirmDelete = confirm(`${user.name}, ¿Seguro que deseas eliminar este elemento?`);
    if (confirmDelete) {
      rqControll.deleteRQItem(id);
      setRqInfo(rqControll.stateCopy);
    }
  };

  //Creacion de materiales
  const handleNewMaterial = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = evt.target.value;
    const name = evt.target.name;
    /*@ts-ignore*/
    elementControll.element[name] = value;
    setNewElement(elementControll.stateCopy);
  };

  const saveNewMaterial = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    storeMaterials({
      variables: { elementData: elementControll.toApi },
    })
  };

  //Effectst
  useEffect(() => {
    setRqInfoToAPI(rqControll.rqToAPI);
  }, [rqInfo]);

  //Notifications on rq creation status
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
          body: `Verifica que todos los campos esten diligenciados`,
          /*@ts-ignore*/
          footer: `${error.cause?.extensions.code}`,
          theme: "error_theme",
        });
      } catch (err) {
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

  //Notifications on material creation status
  useEffect(() => {
    if (loadingMaterials) {
      setToast(true);
      setToastProps({
        title: "Cargando...",
        body: "El Elemento esta siendo creado",
        footer: "LOADING",
        theme: "primary_theme",
      });
    }
    if (materialData) {
      setToast(true);
      setToastProps({
        title: "Elemento creado",
        body: "Elemento creado exitosamente",
        footer: "Operación realizada con exito",
        theme: "primary_theme",
      });
    }
    if (materialError) {
      setToast(true);
      try {
        setToastProps({
          title: "Error creando Elemento",
          //@ts-ignore
          body: `${error.graphQLErrors[0].extensions?.exception.message}`,
          /*@ts-ignore*/
          footer: `${error.cause?.extensions.code}`,
          theme: "error_theme",
        });
      } catch (err) {
        setToastProps({
          title: "Error creando material",
          //@ts-ignore
          body: `No se ha podido completar el proceso de creación del elemento debido a un error interno`,
          /*@ts-ignore*/
          footer: `ERROR_INTERNO`,
          theme: "error_theme",
        });
      }
    }
  }, [materialError, loadingMaterials, materialData]);

  return (
    <CreateRqContext.Provider
      value={{
        newElement,
        rqControll,
        deleteItem,
        handleChange,
        handleSelects,
        handleSubmit,
        modal,
        rqInfo,
        rqInfoToAPI,
        rqOption,
        setModal,
        setRqInfo,
        setRqInfoToAPI,
        setRqOption,
        setToast,
        toast,
        toastProps,
        storeRQ,
        user,
        setToastProps,
        handleNewMaterial,
        saveNewMaterial,
        elementControll
      }}
    >
      {children}
    </CreateRqContext.Provider>
  );
}
