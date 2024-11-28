import { useContext, useEffect } from "react";
import ADD_ELEMENT from "../assets/icon/progman.exe_14_127-0.png";
import SAVE from "../assets/icon/setupapi.dll_14_50-2.png";
import EDIT from "../assets/icon/xpsp2res.dll_14_900-8.png";
import ADD_MATERIAL from "../assets/icon/wmploc.dll_14_1110-6.png";
import CreateRqProvider, { CreateRqContext } from "../contexts/createRqContext";
import RQ_ERRORS from "../data/error.rq.json";

export default function RqMenu() {
  const {setModal, rqInfo, setToast, setToastProps, setRqOption, storeRQ} = useContext(CreateRqContext);
  
  const handleModal = (menu: "RQ_ITEMS" | "GENERAL" | "ADD_MATERIAL") => {
    setModal(true);
    setRqOption(menu);
  };

  const handleSubmit = () => {
    if (rqInfo.rqItems.length === 0) {
      setToast(true);
      setToastProps({
        title: "Error en RQ",
        body: RQ_ERRORS[0].description,
        footer: `${RQ_ERRORS[0].title}: ${RQ_ERRORS[0].solution}`,
        theme: "error_theme",
      });
    }
    else{
        // console.log(rqInfoToAPI)
        storeRQ()
    }
  };
  return (
    <CreateRqProvider>
      <div className="bottom_start right" style={{ justifyContent: "flex-end" }}>
      <div className="options">
        <div
          className="option_container"
          onClick={() => handleModal("RQ_ITEMS")}
        >
          <div className="tooltip">
          <img
            src={ADD_ELEMENT}
            alt="Añadir elemento"
            className="option_icon"
          />
          <span className="tooltiptext">
          Añadir ítem RQ
          </span>
          </div>
          
        </div>
        <div
          className="option_container"
          onClick={() => {
            handleModal("GENERAL");
          }}
        >
          <div className="tooltip">
          <img src={EDIT} alt="Editar" className="option_icon" />
          <span className="tooltiptext">
            Opciones generales
          </span>
          </div>
          
        </div>
        <div
          className="option_container"
          onClick={() => {
            handleModal("ADD_MATERIAL");
          }}
        >
          <div className="tooltip">
          <img src={ADD_MATERIAL} alt="Editar" className="option_icon" />
          <span className="tooltiptext">
            Crear elemento
          </span>
          </div>
        </div>
        <div className="option_container" onClick={handleSubmit}>
          
          <div className="tooltip">
          <img src={SAVE} alt="Editar" className="option_icon" />
          <span className="tooltiptext">
            Guardar
          </span>
          </div>
        </div>
      </div>
    </div>
    </CreateRqProvider>
    
  );
}
