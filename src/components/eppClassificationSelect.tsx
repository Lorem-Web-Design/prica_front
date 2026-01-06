import { ElementFromQuery } from "../@types/elementTypes";
import useUser from "../customHooks/users/useUser";

type EppClassificationSelect = {
  selectedEpp: ElementFromQuery;
  handleChange: (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

type FilterStockById = {
  selectedEpp: ElementFromQuery;
  userId: string;
  role: string;
};

export default function EppClassificationSelect({
  selectedEpp,
  handleChange,
}: EppClassificationSelect) {
  const { id, role } = useUser();
  let stockList = filterStockById({ userId: id, selectedEpp, role });
  return (
    <div className="input_container">
      <label htmlFor="classificationId">Selecciona clasificación</label>
      <select
        name="classificationId"
        id="classificationId"
        className="editable_input"
        onChange={handleChange}
      >
        <option value="undefined">Elije la clasificación</option>
        {stockList?.map((stock, index) => (
          <option value={`${stock.classificationId}-${index}`} key={index}>
            {stockClassificationName(
              stock.classificationId,
              selectedEpp.classification
            )}{" "}
            ({stock.amount} UNIDADES)
          </option>
        ))}
      </select>
    </div>
  );
}

function stockClassificationName(
  classificationId: string,
  classifications: ElementFromQuery["classification"]
) {
  let classification = classifications.find(
    (item) => item.id === classificationId
  );
  return classification?.name;
}

function filterStockById({ userId, selectedEpp, role }: FilterStockById) {
  if (role === "admin") {
    return selectedEpp.stock;
  } else {
    let avaliableStock = selectedEpp.stock?.filter(
      (item) => item.owner === userId
    );
    return avaliableStock;
  }
}
