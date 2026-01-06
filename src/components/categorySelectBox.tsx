import CATEGORIES from "../settings/categories.json";

export default function CategorySelectBox({
  onChange,
  label,
  name,
  isEmpty,
  value,
  disabled,
}: SelectBox) {
  return (
    <div className={`input_container gap_12 ${isEmpty ? "error" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <select
        className="editable_input width_100"
        id={name}
        name={name}
        onChange={onChange}
        value={value}
        disabled={disabled}
      >
        {CATEGORIES.categories.map((category) => (
          <option value={category.slug} key={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
