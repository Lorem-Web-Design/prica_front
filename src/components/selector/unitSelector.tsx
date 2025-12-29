import UNITS from "../../settings/units.json";

type SelectBox = {
    onChange: (
      evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => void;
    value: string
    disabled?: boolean
    isEmpty: boolean;
  };

export default function UnitSelector({onChange, value, disabled,isEmpty }: SelectBox){
    
    return(
        <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
        <label htmlFor="unit">Unidad de medida</label>
        <select className="editable_input width_100" id="unit" name="unit" onChange={onChange} value={value} disabled={disabled}>
            <option value="SIN_DEFINIR">Seleccione unidad de medida</option>
            {UNITS.map((option)=><option key={option.value} value={option.value}>{option.name} ({
                option.value})</option>)}
        </select>
        </div>
    )
}