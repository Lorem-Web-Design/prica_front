import { useEffect, useState } from "react";
import FOLDER_MOCK from "../data/mock.folder.json";
import { GET_FOLDERS } from "../api/myQueries";
import { useQuery } from "@apollo/client";

type SelectBox = {
    onChange: (
      evt: React.ChangeEvent<HTMLSelectElement>
    ) => void;
    label: string;
    name: string;
    defaultOption: {label: string, value: string}
    isEmpty: boolean
    value: string
    className?: string
    disabled?: boolean
  };
  export default function BodegaSelectBox({ onChange, label, name, defaultOption, isEmpty, value, className, disabled }: SelectBox) {
    const {loading, error, data} = useQuery(GET_FOLDERS);
    
    if(data){
      return(
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value} disabled={disabled}>
            <option value={defaultOption.value}>{defaultOption.label}</option>
            {data.folders.map((option:Bodega)=><option key={option._id} value={option._id}>{option.name}</option>)}
        </select>
        </div>
      )
    }

    if(loading){
      return(
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value}>
            <option value="loading">Cargando información...</option>
        </select>
        </div>
      )
    }

    if(error){
      return(
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value}>
            <option value="loading">Error cargando información...</option>
        </select>
        </div>
      )
    }

    return(
      <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value}>
          <option value="loading">Cargando información...</option>
      </select>
      </div>
    )
  }
  