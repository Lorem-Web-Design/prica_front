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
    isEmpty: boolean
    value: string
    disabled?: boolean
  };
  export default function WorkerStateSelect({ onChange, label, name, isEmpty, value, disabled }: SelectBox) {

    return(
      <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value} disabled={disabled}>
          <option value="loading">Cargando información...</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
      </select>
      </div>
    )

  }