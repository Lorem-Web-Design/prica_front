import { useQuery } from "@apollo/client";
import { GET_WORKERS } from "../api/myQueries";
import WORKER_MOCK from "../data/mock.workers.json";
import { useEffect, useState } from "react";

type SelectBox = {
    onChange: (
      evt: React.ChangeEvent<HTMLSelectElement>
    ) => void;
    label: string;
    name: string;
    defaultOption: {label: string, value: string}
    isEmpty: boolean
    value: string | undefined
    disabled?: boolean
  };
  export default function WorkerSelectBox({ onChange, label, name, defaultOption, isEmpty, value, disabled }: SelectBox) {
    const {loading: workerLoading, error:workerError, data: worker} = useQuery(GET_WORKERS);
    if(worker){
      return (
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
          <label htmlFor={name}>{label}</label>
          <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value} disabled={disabled}>
              <option value={defaultOption.value}>{defaultOption.label}</option>
              {worker.getWorkers.map((option:PricaWorker)=><option key={option._id} value={option._id}>{option.name}</option>)}
          </select>
      </div>
      )
    }

    if(workerLoading){
      return(
        <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value}>
            <option value="loading">Cargando información...</option>
        </select>
        </div>
      )
    }

    if(workerError){
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