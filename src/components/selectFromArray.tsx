type SelectFromArray = {
  info: {
    name: string;
    value: string;
  }[];
  action: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  undefined: string
};

export default function SelectFromArray(array: SelectFromArray) {
  return (
    <select onChange={(evt)=>{array.action(evt)}} className="ocSelect">
        <option value="SIN_DEFINIR">{array.undefined}</option>
      {array.info.map((item, index) => {
        return (
          <option key={index} value={item.value}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
}
