import { useMutation, useQuery } from "@apollo/client";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ADD_OC, INCREMENT_OC_COUNTER, TRIGGER_HAVE_OC } from "../api/myMutations";
import { GET_RQ_BY_ID } from "../api/myQueries";
import Toast from "../components/toast";
import MOCK_OC from "../data/mock.oc.json";
import RQ_MOCK from "../data/mock.rq.json";
import OrdenDeCompra from "../utils/oc.controll";
import { OCFromQuery } from "../@types/oc.types";

type OcContextInfo = {
  toast: boolean;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
  changeDate: (evt:React.ChangeEvent<HTMLInputElement>) => void;
  deleteItem: (itemId: string) => void;
  observation: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  createOC: () => void;
  ocInfo: OCFromQuery
  setOCInfo: React.Dispatch<React.SetStateAction<OCFromQuery>>
  OC: OrdenDeCompra
  rqId: string | undefined,
  rqInfo: RQFromQuery,
};

const ContextDefaultValue: OcContextInfo = {
  toast: false,
  setToast: () => false,
  changeDate: (evt:React.ChangeEvent<HTMLInputElement>) => {},
  deleteItem: (itemId: string) => {},
  observation: (evt: React.ChangeEvent<HTMLInputElement>) => {},
  createOC: () => {},
  ocInfo: MOCK_OC,
  setOCInfo: ()=>{},
  OC: new OrdenDeCompra(MOCK_OC),
  rqId: "",
  rqInfo: RQ_MOCK
};

export const CreateOcContext = createContext(ContextDefaultValue);

export default function CreateOcProvider({ children }: PropsWithChildren) {
  const {rqId} = useParams();
  const OC = new OrdenDeCompra(MOCK_OC);
  OC.ocData.rq._id = rqId || "";
  OC.ocData.date = new Date().toISOString().slice(0, 10);
  
  //Toast Inicialization
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  
  const [ocInfo, setOCInfo] = useState<OCFromQuery>(OC.info);
  const [rqInfo, setRqInfo] = useState<RQFromQuery>(RQ_MOCK);

  const [storeOC, {data, loading, error}] = useMutation(ADD_OC, {variables: {
    ocData: OC.OC2API
  }, refetchQueries: ["GetOcs"]});
  const {loading: loadingRq, error: rqError, data: rqData} = useQuery(GET_RQ_BY_ID, {variables: {rqId}})

  const [incrementCounter, {loading: loadingCounter, error: counterError, data: counterData}] = useMutation(INCREMENT_OC_COUNTER);

  const [triggerHaveOc, {loading: loadingTrigger, error: triggerError, data: triggerData}] = useMutation(TRIGGER_HAVE_OC, {variables: {rqId: rqId, approveState: "true"}});
  
  const changeDate = (evt:React.ChangeEvent<HTMLInputElement>) => {
    OC.date = evt.target.value;
    setOCInfo(OC.stateCopy);
  }

  const deleteItem = (itemId: string) => {
    OC.deleteItem(itemId);
    setOCInfo(OC.stateCopy)
  }

  const observation = (evt: React.ChangeEvent<HTMLInputElement>) => {
    OC.observation = evt.target.value
    setOCInfo(OC.stateCopy)
  }

  const createOC = () => {
    triggerHaveOc()
    incrementCounter()
  }

  //Notifications on oc creation status
  useEffect(() => {
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Cargando...",
        body: "Su OC está siendo procesada",
        footer: "Guardando",
        theme: "primary_theme",
      });
    }
    if (data) {
      setToast(true);
      if(data.addOC.code === 400){
        setToastProps({
          title: "Error creando OC",
          body: "Campos faltantes",
          footer: "ERROR: MISSING FIELDS",
          theme: "error_theme",
        });
      }
      if(data.addOC.code === 200){
        setToastProps({
          title: "OC creada con exito",
          body: `${data.addOC.message}`,
          footer: "SUCCESS",
          theme: "primary_theme",
        });
      }
    }
    if (error) {
      setToast(true);
      try {
        setToastProps({
          title: "Error creando OC",
          //@ts-ignore
          body: `${error.graphQLErrors[0].extensions?.exception.message}`,
          /*@ts-ignore*/
          footer: `${error.cause?.extensions.code}`,
          theme: "error_theme",
        });
      } catch (err) {
        setToastProps({
          title: "Error creando OC",
          //@ts-ignore
          body: `No se ha podido completar el proceso de creación de la OC`,
          /*@ts-ignore*/
          footer: `ERROR_INTERNO`,
          theme: "error_theme",
        });
      }
    }
  }, [error, loading, data]);

  useEffect(() => {
    if (rqData) {
      setRqInfo(rqData.getRqById);
    }
  }, [rqData]);

  useEffect(()=>{
    if(triggerData && counterData){
      storeOC()
    }
  },[triggerData, counterData])

  return (
    <CreateOcContext.Provider
      value={
      {changeDate, createOC, deleteItem, observation, setToast, toast, ocInfo, setOCInfo, OC, rqId, rqInfo}
      }
    >
      <Toast body={toastProps.body} isActive={toast} setToast={setToast} theme={toastProps.theme} title={toastProps.title} footer={toastProps.footer}/>
      {children}
    </CreateOcContext.Provider>
  );
}
