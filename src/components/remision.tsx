import { useState } from "react";
import { ElementFromQuery, RawRemision, RemisionExtended } from "../@types/elementTypes";
import BodegaSelectBox from "./bodegaSelectBox";
import Grid from "./grid";
import InputBox from "./inputElement";
import WorkerSelectBox from "./workerSelectBox";
import UserSelectBox from "./usersSelectBox";
import ElementEditor from "../utils/elementEditor.controll";

type RemisionTypes = {
  elementEditor: ElementEditor;
  setElementInfo: (value: React.SetStateAction<ElementFromQuery>) => void;
};
export default function Remision({ elementEditor, setElementInfo }: RemisionTypes) {
  const [remision, setRemision] = useState<RemisionExtended>({
    giver: {
      name: "",
      _id: "",
    },
    taker: {
      name: "",
      _id: "",
    },
    giverFolder: {
      name: "",
      _id: "",
    },
    takerFolder: {
      name: "",
      _id: "",
    },
    amount: "",
  });
  const [validInputs, setValidInputs] = useState<string[]>([]);

  const handleRemision = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if(parseFloat(remision.amount) > elementEditor.element.amount){
        alert("No puedes mover más cantidad de la existente")
    }else{
      elementEditor.element.amount -= parseFloat(remision.amount);
        elementEditor.element.remision.push(remision);
    }
    setElementInfo(elementEditor.stateCopy);
  };

  const handleSelectChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const name = evt.target.name;
    const selectedName = evt.target.options[evt.target.selectedIndex].text;
    let value: string | number = evt.target.value;
    setRemision((prev) => {
      return {
        ...prev,
        [name]: {
          name: selectedName,
          _id: value,
        },
      };
    });
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = evt.target.name;
    let value: string | number = evt.target.value;
    setRemision((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
    <Grid gap={12} def={1} sm={1} md={1} lg={1}>
      <form onSubmit={handleRemision}>
        <UserSelectBox
          defaultOption={{
            label: "Selecciona un colaborador...",
            value: "",
          }}
          name="giver"
          label="Persona que entrega"
          onChange={handleSelectChange}
          isEmpty={validInputs.includes("currentOwner")}
          value={remision.giver._id}
          disabled={false}
        />
        <UserSelectBox
          defaultOption={{
            label: "Selecciona un colaborador...",
            value: "",
          }}
          name="taker"
          label="Persona que recibe"
          onChange={handleSelectChange}
          isEmpty={validInputs.includes("currentOwner")}
          value={remision.taker._id}
          disabled={false}
        />
        <BodegaSelectBox
          defaultOption={{
            label: "Selecciona una bodega...",
            value: "",
          }}
          name="giverFolder"
          label="Bodega de origen"
          onChange={handleSelectChange}
          isEmpty={false}
          value={remision.giverFolder._id}
          disabled={false}
          className="defaultButton"
        />
        <BodegaSelectBox
          defaultOption={{
            label: "Selecciona una bodega...",
            value: "",
          }}
          name="takerFolder"
          label="Bodega de destino"
          onChange={handleSelectChange}
          isEmpty={false}
          value={remision.takerFolder._id}
          disabled={false}
          className="defaultButton"
        />
        <InputBox
          onChange={handleChange}
          inputName="amount"
          labelTag="Cantidad"
          isEmpty={validInputs.includes("amount")}
          value={`${remision.amount}`}
          type="number"
        />
        <button className="btn mediumBottom" onClick={() => console.log("Executing")}>
          Crear remisión
        </button>
      </form>
    </Grid>
  );
}
