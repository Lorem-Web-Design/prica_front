import { ElementFromQuery } from "../../@types/elementTypes"
import { useAuth } from "../../customHooks/centers/auth/useAuth"
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

export default function ElementStockSelect({selectedEpp, handleChange}: EppClassificationSelect){
  const {user} = useAuth()
  let stockList = filterStockById({userId: user.id, selectedEpp, role: user.role});
    return(<div className="input_container">
        <label htmlFor="classificationId">Selecciona clasificación</label>
        <select name="classificationId" id="classificationId" className="editable_input" onChange={handleChange}>
          <option value="undefined">Elije la clasificación</option>
          {stockList?.map((stock, index) => (
            <option value={index} key={index}>
              {stockClassificationName(stock.classificationId, selectedEpp.classification)} ({stock.amount} UNIDADES)
            </option>
          ))}
        </select>
      </div>)
}

function stockClassificationName(classificationId: string, classifications: ElementFromQuery["classification"]){
  let classification = classifications.find(item=>item.id === classificationId);
  return classification?.name;
}

function filterStockById({userId, selectedEpp, role}:FilterStockById){
  if(role === "admin"){
    return selectedEpp.stock
  }else{
    let avaliableStock = selectedEpp.stock?.filter(item=>item.owner === userId);
    return avaliableStock
  }
}