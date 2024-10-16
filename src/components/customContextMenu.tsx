import { PropsWithChildren, useEffect, useState } from "react";

/**
 * Funcionamiento
 * 
 * CustomContextMenu debe recibir una referencia del objeto sobre el cual se va generar el menú personalizado con el objetivo de determinar las coordenadas del elemento padre.
 * 
 * El elemento padre debe tener Position set to relative
 * 
 * En caso de requerir que el elemento padre redireccione al ser clicado no se deben usar anchor elements o links, se debe utilizar un div con onClick que redireccione a la página deseada
 */
type CustomContextMenu<T> = T & { 
    cardReference:React.RefObject<HTMLDivElement | HTMLAnchorElement>
}
export default function CustomContextMenu({ children, cardReference }: CustomContextMenu<PropsWithChildren>) {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

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
    let top = cardReference.current?.offsetTop || 0;
    let left = cardReference.current?.offsetLeft || 0;
    setPoints({
      x: evt.pageX - left,
      y: evt.pageY - top,
    });
  };

  return (
    <div onContextMenu={handleContextMenu} className="contextMenuHome">
      {clicked && (
        <div
          style={{ top: points.y, left: points.x }}
          className="contextMenu"
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
