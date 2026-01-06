import VARIANTES from "../settings/variantes.json";

type SelectBox = {
  onChange: (
    evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  value: string;
  disabled?: boolean;
  isEmpty: boolean;
};

export default function VarietySelectBox({
  onChange,

  isEmpty,
  value,
  disabled,
}: SelectBox) {
  return (
    <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
      <label htmlFor="variedad">Elige una variedad</label>
      <select
        className="editable_input width_100"
        id="variedad"
        name="variedad"
        onChange={onChange}
        value={value}
        disabled={disabled}
      >
        <option value="SIN_DEFINIR">Seleccione una variedad</option>

        {VARIANTES.variedad.map((category) => (
          <option value={category.slug} key={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
