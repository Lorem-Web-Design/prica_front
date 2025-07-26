
type ElementsClassificationSelect = {
    handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    value?: string
  }
  
  export default function ElementsCategroySelect({handleChange, value}: ElementsClassificationSelect){
      return(<div className="input_container">
          <label htmlFor="classificationId">Selecciona categoría</label>
          <select name="category" id="category" className="editable_input" onChange={handleChange} value={value}>
            <option value="undefined">Elije la categoría</option>
            <option value="Material">Material</option>
            <option value="Equipo">Equipo</option>
            <option value="Herramienta">Herramienta</option>
            <option value="EPCC">EPCC</option>
          </select>
        </div>)
  }