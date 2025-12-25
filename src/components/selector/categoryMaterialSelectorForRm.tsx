import { useQuery } from "@apollo/client";
import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { ElementFromQuery } from "../../@types/elementTypes";
import { GET_ELEMENTS_BY_CATEGORY } from "../../api/myQueries";
import CATEGORIES from "../../settings/categories.json";
import { selectStyles } from "../../utils/selectStyles";

type SelectBox = {
  label: string;
  name: string;
  isEmpty: boolean;
  value: string;
  setState: React.Dispatch<React.SetStateAction<ElementFromQuery>>
  setRqNewItem: (value: React.SetStateAction<RQItems>) => void
};

type ActivityProps = {
  name: string;
  _id: string;
};

type SelectType = SingleValue<{
  value: string;
  label: string;
}>;

type ChildrenByParent = {
    category: string
    value: string;
    setState: React.Dispatch<React.SetStateAction<ElementFromQuery>>
    setRqNewItem: (value: React.SetStateAction<RQItems>) => void
}

export default function CategoryMaterialSelectorForRm({ label, name, isEmpty, value, setState, setRqNewItem }: SelectBox) {
  const [parentId, setParentId] = useState("")
  let selectPairs = CATEGORIES.categories.map((activity) => {
    return {
      value: activity.slug,
      label: activity.name,
    };
  });

  const handleSelect = (evt: SelectType) => {
    const value = evt?.value;
    setParentId(value || "")
  };

  return (
    <>
    <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {/* @ts-ignore */}
      <Select styles={selectStyles}
        options={selectPairs}
        onChange={handleSelect}
        className="editable_input"
        placeholder="Selecciona un categoría..."
      />
    </div>
    <MaterialSelector category={parentId} value={value} setRqNewItem={setRqNewItem} setState={setState}/>
    </>
  );
}

function MaterialSelector({category, setRqNewItem, setState}: ChildrenByParent){
    const { data, loading, error } = useQuery(GET_ELEMENTS_BY_CATEGORY, {variables: {category}});
    const handleSelectedMaterial = (evt: React.ChangeEvent<HTMLSelectElement>) => {};
    if (data) {
      let materialList = sortElements(JSON.parse(JSON.stringify(data.getElementByCategory)) as ElementFromQuery[]);
        let selectPairs = materialList.map(material=>{return({
            value: material._id,
            label: `${material.name} (${material.serial}) - ${material.description} (${material.unit})`
        })})
        const handleSelectedMaterial = (evt: SelectType) => {
            const value = evt?.value;
            const materialIndex = materialList.findIndex(material=>material._id === value);
            setRqNewItem((prev) => {
                return { ...prev, materialId: value ?? "" };
              });
            setState(materialList[materialIndex])
        }
  
      return (
        <>
        <div className={`input_container gap_12`}>
          <label htmlFor="childrenSelect">Seleccione elemento</label>
          {/* @ts-ignore */}
          <Select styles={selectStyles}
            options={selectPairs}
            onChange={handleSelectedMaterial}
            className="editable_input"
            placeholder="Selecciona un elemento..."
          />
        </div>
        </>
      );
    }
  
    if (error) {
      return (
        <div className={`input_container gap_12`}>
          <label htmlFor="childrenSelect">Seleccione centro de costos</label>
          <select className="editable_input width_100" id="childrenSelect" name="childrenSelect" onChange={handleSelectedMaterial} value={0}>
            <option value="undefined">Para cargar, seleccione una categoría</option>
          </select>
        </div>
      );
    }
  
    if (loading) {
      return (
        <div className={`input_container gap_12`}>
          <label htmlFor="childrenSelect">Seleccione centro de costos</label>
          <select className="editable_input width_100" id="childrenSelect" name="childrenSelect" onChange={handleSelectedMaterial} value={0}>
            <option value="undefined">Ha ocurrido un error cargando los centros de costos.</option>
          </select>
        </div>
      );
    }
  
    return (
      <div className={`input_container gap_12`}>
        <label htmlFor="childrenSelect">Seleccione centro de costos</label>
        <select className="editable_input width_100" id="childrenSelect" name="childrenSelect" onChange={handleSelectedMaterial} value={0}>
            <option value="undefined">Ha ocurrido un error cargando los centros de costos.</option>
          </select>
      </div>
    );
}

function sortElements(list: ElementFromQuery[]){
  let materialList = JSON.parse(JSON.stringify(list)) as ElementFromQuery[];
  materialList = materialList.sort((a, b)=>{
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  })
  return materialList;
}