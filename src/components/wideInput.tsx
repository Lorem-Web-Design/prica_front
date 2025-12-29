type InputBox = {
    onChange: (
      evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    inputName: string;
    isEmpty: boolean
    value: string
  };

  export default function WideInput({ onChange, inputName, isEmpty, value }: InputBox) {
    return (
      <div className= {`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <input
          type="text"
          className={`wide_input width_100`}
          name={inputName}
          id={inputName}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }
  