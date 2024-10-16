import { useQuery } from "@apollo/client";
import { GET_MATERIALS } from "../api/myQueries";


type MaterialSelectBox = {
    // onChange: (
    //   evt: React.ChangeEvent< HTMLSelectElement>
    // ) => void;
    label: string;
    name: string;
    isEmpty: boolean
    value: string
    setState: React.Dispatch<React.SetStateAction<PricaMaterial>>
    setRqNewItem: (value: React.SetStateAction<RQItems>) => void
    rqNewItem: RQItems
  };

export default function MaterialSelect({ label, name, isEmpty, value, setState, setRqNewItem, rqNewItem }: MaterialSelectBox){
    const {data, loading, error} = useQuery(GET_MATERIALS);
    const handleSelectedMaterial = (evt: React.ChangeEvent<HTMLSelectElement>) => {

    }

    if(data){
        let materialList = data.getElements as PricaMaterial[];
        const handleSelectedMaterial = (evt: React.ChangeEvent<HTMLSelectElement>) => {
            const value = evt.target.value;
            const materialIndex = materialList.findIndex(material=>material._id === value);
            setRqNewItem((prev) => {
                return { ...prev, materialId: value };
              });
            setState(materialList[materialIndex])
        }

        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Selecciona un material</option>
            {materialList.map(material=>{
                return(
                    <option value={material._id} key={material._id}>{material.name}</option>
                )
            })}
        </select>
    </div>
    }

    if(error){
        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Ha ocurrido un error cargando los materiales.</option>
        </select>
    </div>
    }

    if(loading){
        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Cargando lista de materiales.</option>
        </select>
    </div>
    }

    return (
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Cargando lista de materiales.</option>
        </select>
    </div>
    )

}