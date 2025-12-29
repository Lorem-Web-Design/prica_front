import { PropsWithChildren, useEffect, useRef, useState } from "react";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import useMousePosition from "../customHooks/app/useMousePosition";


export default function Modal({ children, modal, setModal }: PropsWithChildren<Modal>) {
    const modalRef = useRef<HTMLDivElement>(null);
    // const [modalPosition, setModalPosition] = useState({
    //     topLeft: {x: 0, y: 0},
    //     topRight: {x: 0, y: 0},
    //     bottomLeft: {x: 0, y: 0},
    //     bottomRight: {x: 0, y: 0}
    // })

    // const mousePosition = useMousePosition();

    // useEffect(()=>{
    //     const modalProps = modalRef.current;
    //     if(modalProps){
    //         let topLeftCorner = {x: modalProps.offsetLeft, y: modalProps.offsetTop}
    //         let modalSize = {width: modalProps.clientWidth, height: modalProps.clientHeight}
    //         setModalPosition({
    //             topLeft: {x: topLeftCorner.x, y: topLeftCorner.y},
    //             topRight: {x: topLeftCorner.x + modalSize.width, y: topLeftCorner.y},
    //             bottomLeft: {x: topLeftCorner.x, y: topLeftCorner.y + modalSize.height},
    //             bottomRight: {x: topLeftCorner.x + modalSize.width, y: topLeftCorner.y + modalSize.height}
    //         })
    //     }
    // },[modal])

    // const handleVisibility = () => {
    //     //Check for x coordinates
    //     if(mousePosition.x !== null){
    //         if(mousePosition.x > modalPosition.topRight.x || mousePosition.x < modalPosition.topLeft.x){
    //             setModal(false)
    //         }
    //     }
    //     //Check for y coordinates
    //     if(mousePosition.y !== null){
    //         if(mousePosition.y < modalPosition.topRight.y || mousePosition.y > modalPosition.bottomLeft.y){
    //             setModal(false)
    //         }
    //     }
    // }
    
  return (
    <div className={`modalContainer ${modal ? '' : 'hide'}`}>
      <div className="modalBody" ref={modalRef}>
        
        <div className="modalHeader">
          <div className="modalIcon">
            <img src={PRC_LOGO} alt="PRICA SAS" />
          </div>
          <div className="closeModal" onClick={()=>setModal(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
        </div>
        </div>
        <div className="modalContent">
        {children}
        </div>
      </div>
    </div>
  );
}
