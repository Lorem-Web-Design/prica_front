import { ElementFromQuery } from "../../@types/elementTypes"
import useUser from "../../customHooks/users/useUser"

type EppClassificationSelect = {
  selectedEpp: ElementFromQuery
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

type FilterStockById = {
  selectedEpp: ElementFromQuery
  userId: string
  role: string
}

export default function ElementClassificationSelect({selectedEpp, handleChange}: EppClassificationSelect){
    return(<div className="input_container">
        <label htmlFor="classificationId">Selecciona clasificación</label>
        <select name="classificationId" id="classificationId" className="editable_input" onChange={handleChange}>
          <option value="undefined">Elije la clasificación</option>
          {selectedEpp.classification.map((item, index) => (
            <option value={index} key={index}>
              {item.name} - {item.amount} Unidades
            </option>
          ))}
        </select>
      </div>)
}