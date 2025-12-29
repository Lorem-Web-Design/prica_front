import Select, { SingleValue } from 'react-select';
import ROLES from "../data/roles.json";

type RoleSelectBox = {
    label: string;
    name: string;
    isEmpty: boolean
    value: string
    setUserData: React.Dispatch<React.SetStateAction<PricaWorkerToApi>>
  };


type SelectType = SingleValue<{
    value: string;
    label: string;
}>

export default function RoleSelectBox({ label, name, isEmpty, value, setUserData }: RoleSelectBox){
        let selectPairs = ROLES.map(rol=>{return({
            value:rol.value,
            label: rol.name
        })})
        const handleSelectedEpp = (evt: SelectType) => {
            const value = evt?.value;
            if(value){
                setUserData(
                    prev=>{
                        return({
                            ...prev,
                            occupation:value
                        })
                    }
                );
            }
        }

        return <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
        <label htmlFor={name}>{label}</label>
        <Select options={selectPairs} className="editable_input" placeholder="Selecciona un ocupación..." onChange={handleSelectedEpp}/>
    </div>
    

}