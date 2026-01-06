import { useQuery } from "@apollo/client";
import Select, { SingleValue } from "react-select";
import { GET_CHILDRENFOLDERS, GET_PARENTFOLDERS } from "../../api/myQueries";
import { selectStyles } from "../../utils/selectStyles";
import { useContext, useState } from "react";
import { CreateRqContext } from "../../contexts/createRqContext";

type SelectBox = {
  label: string;
  name: string;
  isEmpty: boolean;
  value: string;
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
  parentId: string;
};

export default function ParentChildrenSelector({
  label,
  name,
  isEmpty,
  value,
}: SelectBox) {
  const { data, loading, error } = useQuery(GET_PARENTFOLDERS);
  const handleSelectedMaterial = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ) => {};
  const [parentId, setParentId] = useState("");
  if (data) {
    let list = data.parentFolders as ActivityProps[];
    let selectPairs = list.map((activity) => {
      return {
        value: activity._id,
        label: activity.name,
      };
    });

    const handleSelect = (evt: SelectType) => {
      const value = evt?.value;
      setParentId(value || "");
    };

    return (
      <>
        <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
          <label htmlFor={name}>{label}</label>
          {/* @ts-ignore */}
          <Select
            styles={selectStyles}
            options={selectPairs}
            onChange={handleSelect}
            className="editable_input"
            placeholder="Selecciona un centro de costos..."
          />
        </div>
        <ChildrenByParentSelect parentId={parentId} />
      </>
    );
  }

  if (error) {
    return (
      <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
        <label htmlFor={name}>{label}</label>
        <select
          className="editable_input width_100"
          id={name}
          name={name}
          onChange={handleSelectedMaterial}
          value={value}
        >
          <option value="undefined">
            Ha ocurrido un error cargando los centros de costos.
          </option>
        </select>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
        <label htmlFor={name}>{label}</label>
        <select
          className="editable_input width_100"
          id={name}
          name={name}
          onChange={handleSelectedMaterial}
          value={value}
        >
          <option value="undefined">Cargando centros de costos.</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <select
        className="editable_input width_100"
        id={name}
        name={name}
        onChange={handleSelectedMaterial}
        value={value}
      >
        <option value="undefined">Cargando centros de costos.</option>
      </select>
    </div>
  );
}

function ChildrenByParentSelect({ parentId }: ChildrenByParent) {
  const { data, loading, error } = useQuery(GET_CHILDRENFOLDERS, {
    variables: { parentId },
  });
  const { handleFullSelects } = useContext(CreateRqContext);
  const handleSelectedMaterial = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ) => {};

  if (data) {
    let list = data.folderByParentId as ActivityProps[];
    let selectPairs = list.map((activity) => {
      return {
        value: activity._id,
        label: activity.name,
      };
    });

    return (
      <>
        <div className={`input_container gap_12`}>
          <label htmlFor="childrenSelect">Seleccione centro de costos</label>
          {/* @ts-ignore */}
          <Select
            styles={selectStyles}
            options={selectPairs}
            onChange={handleFullSelects}
            className="editable_input"
            placeholder="Selecciona una centro de costos..."
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className={`input_container gap_12`}>
        <label htmlFor="childrenSelect">Seleccione centro de costos</label>
        <select
          className="editable_input width_100"
          id="childrenSelect"
          name="childrenSelect"
          onChange={handleSelectedMaterial}
          value={0}
        >
          <option value="undefined">
            Ha ocurrido un error cargando los centros de costos.
          </option>
        </select>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`input_container gap_12`}>
        <label htmlFor="childrenSelect">Seleccione centro de costos</label>
        <select
          className="editable_input width_100"
          id="childrenSelect"
          name="childrenSelect"
          onChange={handleSelectedMaterial}
          value={0}
        >
          <option value="undefined">
            Ha ocurrido un error cargando los centros de costos.
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className={`input_container gap_12`}>
      <label htmlFor="childrenSelect">Seleccione centro de costos</label>
      <select
        className="editable_input width_100"
        id="childrenSelect"
        name="childrenSelect"
        onChange={handleSelectedMaterial}
        value={0}
      >
        <option value="undefined">
          Ha ocurrido un error cargando los centros de costos.
        </option>
      </select>
    </div>
  );
}
