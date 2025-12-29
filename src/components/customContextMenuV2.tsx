import { PropsWithChildren, useEffect, useRef, useState } from "react";
import useMousePosition from "../customHooks/app/useMousePosition";

/**
 * Funcionamiento
 * 
 * CustomContextMenu debe recibir una referencia del objeto sobre el cual se va generar el menú personalizado con el objetivo de determinar las coordenadas del elemento padre.
 * 
 * El elemento padre debe tener Position set to relative
 * 
 * En caso de requerir que el elemento padre redireccione al ser clicado no se deben usar anchor elements o links, se debe utilizar un div con onClick que redireccione a la página deseada
 */

export default function CustomContextMenuV2({ children }: PropsWithChildren) {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const contextHome = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition()
  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleContextMenu = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.preventDefault();
    setClicked(true);
    let coord = contextHome.current?.getBoundingClientRect()
    setPoints({
      x: (mouse.x ?? 0) - (coord?.left ?? 0),
      y: (mouse.y ?? 0) - (coord?.top ?? 0),
    });
  };

  return (
    <div onContextMenu={handleContextMenu} className="contextMenuHomeV2" ref={contextHome}>
      {clicked && (
        <div
          style={{ top: points.y, left: points.x }}
          className="contextMenuV2"
          onClick={(evt) => {
            evt.stopPropagation();
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
