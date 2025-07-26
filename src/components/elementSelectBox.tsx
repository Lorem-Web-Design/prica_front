import { useQuery } from "@apollo/client";
import Select, { SingleValue } from 'react-select';
import { GET_ELEMENTS } from "../api/myQueries";
import { selectStyles } from "../utils/selectStyles";

type SelectBox = {
    label: string;
    name: string;
    isEmpty: boolean
    value: string
    setCurrentElement: React.Dispatch<React.SetStateAction<{
        name: string;
        _id: string;
    }>>
  };

  type ActivityProps = {
    name: string,
    _id: string
  }

type SelectType = SingleValue<{
    value: string;
    label: string;
}>

export default function ElementSelectBox({ label, name, isEmpty, value, setCurrentElement }:SelectBox){
    const {data, loading, error} = useQuery(GET_ELEMENTS);
    const handleSelectedMaterial = (evt: React.ChangeEvent<HTMLSelectElement>) => {}

    if(data){
        let list = data.getElements as ElementInformation[];
        let selectPairs = list.map(activity=>{return({
            value: activity._id,
            label: `${activity.name} (${activity.serial}) - ${activity.description} (${activity.unit})`
        })})

        const handleSelect = (evt: SelectType) => {
            const name = evt?.label;
            const value = evt?.value

            setCurrentElement({
                name: name || "",
                _id: value || ""
            })
        }

        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        {/* @ts-ignore */}
        <Select options={selectPairs} onChange={handleSelect} className="editable_input" placeholder="Selecciona una actividad..."  styles={selectStyles} />
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