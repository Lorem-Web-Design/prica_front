export default function CategorySelectBox({ onChange, label, name, isEmpty, value, disabled }: SelectBox) {
    return (
      <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value} disabled={disabled}>
            <option value="Material">Materiales</option>
            <option value="Herramienta">Herramientas</option>
            <option value="EPP">EPP</option>
            <option value="Dotacion">Dotación</option>
            <option value="Equipo">Equipos</option>
        </select>
    </div>
    )
  }
