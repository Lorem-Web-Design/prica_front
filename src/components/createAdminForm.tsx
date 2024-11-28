import { useMutation } from "@apollo/client";
import { CREATE_ADMIN, GET_WORKERS } from "../api/myQueries";
import checkForms from "../utils/checkForms";
import InputBox from "./inputElement";
import Toast from "./toast";
import { UserToMutation } from "../@types/usersTypes";
import { useEffect, useState } from "react";
import USER_MOCK from "../data/user.mock.json";
import APP_ROLES from "../settings/roles.json"

export default function CreateAdminForm(){
    const [validInputs, setValidInputs] = useState<string[]>([]);
    const [userData, setUserData] = useState<UserToMutation>(USER_MOCK as UserToMutation);
    const [toast, setToast] = useState(false);
    const [toastProps, setToastProps] = useState({
      title: "Titulo del toast",
      body: "Cuerpo del toast",
      footer: "Footer del toast",
      theme: "primary_theme",
    });
    const [createAdmin, { data, loading, error }] = useMutation(CREATE_ADMIN, {
      refetchQueries: ['getWorkers']
    });
    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const checks = new checkForms(userData);
      const checkedInputs = checks.checkEmpty(
        { name: "name", type: "string" },
        { name: "password", type: "string" },
        { name: "confirmPassword", type: "string" },
        { name: "cc", type: "string" },
        { name: "role", type: "string" },
        { name: "image", type: "string" },
      );
      setValidInputs(checkedInputs);
      if (checkedInputs.length === 0) {
        let validPassword = userData.password === userData.confirmPassword;
        if(validPassword){
          let dataToMutation = JSON.parse(JSON.stringify(userData));
          delete dataToMutation.confirmPassword
          dataToMutation.cc = parseFloat(userData.cc as string)
          createAdmin({
            variables: { userData: dataToMutation },
          });
        }
        else{
          setToast(true)
          setToastProps(
            {
              title: "Error creando usuario",
              body: "Las contraseñas no coinciden, revisalas e intenta nuevamente",
              footer: "Error",
              theme: "error_theme",
            }
          )
        }
      }
    };
    const handleChange = (
      evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const name = evt.target.name;
      let value = evt.target.value;
      setUserData((prev)=>{
        return(
          {
            ...prev,
            [name]:value
          }
        )
      });
    };
    useEffect(() => {
      if (data) {
        setToast(true);
        if(data.addUser.code === 400){
          setToastProps({
            title: "Creación de administrador",
            body: "La identificación que introduciste para este usuario ya se encuentra en uso",
            footer: "ERROR",
            theme: "warning_theme",
          });
        }
        if(data.addUser.code === 200){
          setToastProps({
            title: "Creación de administrador",
            body: "Administrador creado exitosamente",
            footer: "SUCCESS",
            theme: "primary_theme",
          });
        }
      }
      if (error) {
        setToast(true);
        setToastProps({
          title: "Creación de administrador",
          body: "Error creando administrador",
          footer: "ERROR",
          theme: "error_theme",
        });
      }
      if (loading) {
        setToast(true);
        setToastProps({
          title: "Creación de administrador",
          body: "Las acciones están siendo ejecutadas, no cierre esta ventana",
          footer: "LOADING...",
          theme: "primary_theme",
        });
      }
    }, [loading, error, data]);
  
    return(
      <>
      <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
      <form onSubmit={handleSubmit}>
        <InputBox
            inputName="name"
            isEmpty={validInputs.includes("name")}
            labelTag="Nombre"
            onChange={handleChange}
            value={userData.name}
            type="text"
          />
          <InputBox
            inputName="password"
            isEmpty={validInputs.includes("password")}
            labelTag="Contraseña"
            onChange={handleChange}
            value={userData.password}
            type="password"
          />
          <InputBox
            inputName="confirmPassword"
            isEmpty={validInputs.includes("confirmPassword")}
            labelTag="Confirmar Contraseña"
            onChange={handleChange}
            value={userData?.confirmPassword}
            type="password"
          />
          <InputBox
            inputName="cc"
            isEmpty={validInputs.includes("cc")}
            labelTag="Identificación"
            onChange={handleChange}
            value={userData.cc as string}
            type="number"
          />
          <RolesSelectBox
          onChange={handleChange}
          isEmpty={validInputs.includes("roles")}
          label="Rol"
          name="role"
          value={userData.role}
          />
          <button type="submit" className="mediumBottom">Añadir</button>
      </form>
      </>
    )
  }

  function RolesSelectBox({ onChange, label, name, isEmpty, value, disabled }: SelectBox){
    return(
      <div className={`input_container gap_12 ${isEmpty ? 'error' : ''}`}>
          <label htmlFor={name}>{label}</label>
          <select className="editable_input width_100" id={name} name={name} onChange={onChange} value={value} disabled={disabled}>
              {APP_ROLES.roles.map(role=>{
                return(
                    <option value={role.slug} key={role.slug}>{role.name}</option>
                )
              })}
          </select>
      </div>
    )
  }