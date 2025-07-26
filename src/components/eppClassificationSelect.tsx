import { ElementFromQuery } from "../@types/elementTypes"

type EppClassificationSelect = {
  selectedEpp: ElementFromQuery
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export default function EppClassificationSelect({selectedEpp, handleChange}: EppClassificationSelect){
    return(<div className="input_container">
        <label htmlFor="classificationId">Selecciona clasificación</label>
        <select name="classificationId" id="classificationId" className="editable_input" onChange={handleChange}>
          <option value="undefined">Elije la clasificación</option>
          {selectedEpp.classification.map((classification, index) => (
            <option value={classification.id} key={index}>
              {classification.name} ({classification.amount} UNIDADES)
            </option>
          ))}
        </select>
      </div>)
}