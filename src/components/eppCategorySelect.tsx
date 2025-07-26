
type EppClassificationSelect = {
  handleChange: (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  value?: string
}

export default function EppCategroySelect({handleChange, value}: EppClassificationSelect){
    return(<div className="input_container">
        <label htmlFor="classificationId">Selecciona categoría</label>
        <select name="category" id="category" className="editable_input" onChange={handleChange} value={value}>
          <option value="undefined">Elije la categoría</option>
          <option value="EPP">EPP</option>
          <option value="DOTACION">Dotación</option>
        </select>
      </div>)
}