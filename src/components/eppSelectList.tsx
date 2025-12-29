import { useQuery } from "@apollo/client";
import Select, { SingleValue } from 'react-select';
import { EppFromQuery } from "../@types/eppTypes";
import { GET_EPP_LIST } from "../api/epp.query";
import { ElementFromQuery } from "../@types/elementTypes";
import { GET_ELEMENTS } from "../api/myQueries";

type EppSelectBox = {
    label: string;
    name: string;
    isEmpty: boolean
    value: string
    setEpp: React.Dispatch<React.SetStateAction<ElementFromQuery>>
    type: string
  };


type SelectType = SingleValue<{
    value: string;
    label: string;
}>

export default function ElementSelect({ label, name, isEmpty, value, setEpp, type }: EppSelectBox){
    let query:any;
    switch (type){
        case "EPP":
            query = GET_EPP_LIST
            break
        case "ELEMENTS":
            query = GET_ELEMENTS
            break
    }
    const {data, loading, error} = useQuery(query);
    const handleSelectedMaterial = (evt: React.ChangeEvent<HTMLSelectElement>) => {}

    if(data){
        let eppList: ElementFromQuery[];
        if(type === "EPP"){
            eppList = data.getEpps;
        }
        else{
            eppList = data.getElements;
        }
        let selectPairs = eppList.map(material=>{return({
            value: material._id,
            label: material.name
        })})
        const handleSelectedEpp = (evt: SelectType) => {
            const value = evt?.value;
            const eppIndex = eppList.findIndex(epp=>epp._id === value);
            setEpp(eppList[eppIndex]);
        }

        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <Select options={selectPairs} className="editable_input" placeholder="Selecciona un material..." onChange={handleSelectedEpp}/>
    </div>
    }

    if(error){
        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Ha ocurrido un error cargando los EPPS.</option>
        </select>
    </div>
    }

    if(loading){
        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Cargando lista de Epps.</option>
        </select>
    </div>
    }

    return (
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={handleSelectedMaterial} value={value}>
            <option value="undefined">Cargando lista de EPPS.</option>
        </select>
    </div>
    )

}