import { useMutation } from "@apollo/client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { CREATE_ELEMENT } from "../api/myMutations";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import AS_QUERY_ELEMENT from "../data/mock.element.json";
import ELEMENT_MOCK_API from "../data/mock.element_raw.json";
import imageUploader from "../services/imageUploader";
import checkForms from "../utils/checkForms";
import ElementEditor from "../utils/elementEditor.controll";
import { ElementFromQuery, ElementToApi } from "../@types/elementTypes";
import Toast from "../components/toast";

type ContextInfo = {
  elementInfo: ElementFromQuery;
  // setElementInfo: (elementInfo: RawElementInformation) => {},
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleTypeChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
  validInputs: string[];
  toast: boolean;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastProps: {
    title: string;
    body: string;
    footer: string;
    theme: string;
  };
  setFile: React.Dispatch<React.SetStateAction<string | File>>;
  setToastProps: React.Dispatch<React.SetStateAction<Toast>>;
  selectedType: string;
  elementEditor: ElementEditor;
  setElementInfo: React.Dispatch<React.SetStateAction<ElementFromQuery>>;
  setSaveImageTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  saveImageTrigger: boolean;
};

const ContextDefaultValue: ContextInfo = {
  elementInfo: AS_QUERY_ELEMENT as ElementFromQuery,
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {},
  handleTypeChange: (evt: React.ChangeEvent<HTMLSelectElement>) => {},
  handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => {},
  validInputs: [""],
  toast: false,
  setToast: () => false,
  toastProps: {
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  },
  setFile: () => {},
  setToastProps: () => {},
  selectedType: "Material",
  elementEditor: new ElementEditor(AS_QUERY_ELEMENT as ElementFromQuery),
  setElementInfo: () => {},
  saveImageTrigger: false,
  setImageUrl: () => {},
  setSaveImageTrigger: () => {},
};

export const CreateElementContext = createContext(ContextDefaultValue);

export default function CreateElementProvider({ children }: PropsWithChildren) {
  const elementEditor = new ElementEditor(AS_QUERY_ELEMENT as ElementFromQuery);
  // Información de los elementos
  const [elementInfo, setElementInfo] = useState<ElementFromQuery>(elementEditor.stateCopy);
  // Determina que formulario se va a mostrar dependiendo de la categoría del elemento seleccionado
  const [selectedType, setSelectedType] = useState<FormByType["selectedType"]>("Material");
  // Realiza chequeo de los inputs válidos
  const [validInputs, setValidInputs] = useState<string[]>([]);
  // Para subir imagenes
  const [file, setFile] = useState<string | File>(ELEMENT_IMAGE);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  //Input Image Inicialization
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [saveImageTrigger, setSaveImageTrigger] = useState(false);
  //Mutation for the element creation
  const [createElement, { data: elementData, loading: elementLoading, error: elementError }] = useMutation(CREATE_ELEMENT, {
    refetchQueries: ["GetElements"],
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    // @ts-ignore
    elementEditor.element[name] = value;
    if (name === "takerFolder") {
      elementEditor.element.takerFolder = {
        name,
        _id: value,
      };
    }
    if (name === "currentOwner") {
      elementEditor.element.currentOwner = {
        name,
        _id: value,
      };
    }
    setElementInfo(elementEditor.stateCopy);
  };

  const handleTypeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    let value = evt.target.value as FormByType["selectedType"];
    elementEditor.element.category = value;
    setSelectedType(value);
    setElementInfo(elementEditor.stateCopy);
  };

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const checks = new checkForms(elementEditor.toApi);
    const checkedInputs = checks.checkEmpty(
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "currentOwner", type: "string" },
      { name: "takerFolder", type: "string" },
      { name: "category", type: "string" },
      { name: "provider", type: "string" },
      { name: "image", type: "string" },
      { name: "unit", type: "string" }
    );

    setValidInputs(checkedInputs);
    if (checkedInputs.length === 0) {
      setSaveImageTrigger(true);
    }
  };

  useEffect(() => {
    if (elementLoading) {
      setToastProps({
        title: "Creación del elemento",
        body: "Se está procesando la creación del elemento",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (elementData) {
      setToastProps({
        title: "Creación del elemento",
        body: "Elemento creado con éxito",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (elementError) {
      setToastProps({
        title: "Creación del elemento",
        body: "Error creando el elemento",
        footer: "Exito",
        theme: "error_theme",
      });
      setToast(true);
    }
  }, [elementData, elementError, elementData]);

  useEffect(() => {
    if (imageUrl !== null) {
      elementEditor.element.image = imageUrl;
      createElement({
        variables: {
          elementData: elementEditor.toApi,
        },
      });
    }
  }, [imageUrl]);
  return (
    <CreateElementContext.Provider
      value={{
        elementInfo,
        handleChange,
        handleSubmit,
        validInputs,
        toast,
        toastProps,
        setFile,
        setToast,
        setToastProps,
        selectedType,
        handleTypeChange,
        elementEditor,
        setElementInfo,
        saveImageTrigger,
        setImageUrl,
        setSaveImageTrigger,
      }}
    >
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      {children}
    </CreateElementContext.Provider>
  );
}
