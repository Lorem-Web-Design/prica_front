import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";


import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserToMutation } from "../@types/usersTypes";
import { CREATE_ADMIN, GET_WORKERS } from "../api/myQueries";
import ApolloErrorPage from "../components/apolloErrorPage";
import InputBox from "../components/inputElement";
import Modal from "../components/modal";
import Toast from "../components/toast";
import UserCard from "../components/userCard";
import USER_MOCK from "../data/user.mock.json";
import checkForms from "../utils/checkForms";

export default function GestionUsuarios() {
  const [modal, setModal] = useState(false);
  return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title title="Gestión usuarios" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <WorkersList/>
        <div className="pt_def_12"></div>
        <Grid gap={12} def={3} sm={2} md={2} lg={2} className="">
          <Link to="/create/user" className="mediumBottom defaultButton">Añadir colaborador</Link>
          <button className="mediumBottom" onClick={()=>setModal(true)}>Añadir administrador</button>
        </Grid>
        <Modal modal={modal} setModal={setModal}>
              <CreateAdminForm/>
          </Modal>
        <BottomStart/>
      </Layout>
  );
}

function WorkersList(){
  const {data, loading, error} = useQuery(GET_WORKERS);
  if(data){
    const workers:PricaWorker[] = data.getWorkers;
    return(<Grid gap={12} def={5} sm={2} md={2} lg={2} className="">
      {workers.map((worker, index)=><UserCard name={worker.name} cc={worker.cc} cargo={worker.occupation} image={worker.image} id={worker._id} key={index}/>)}
    </Grid>)
  }
  if(loading){
    return(
      <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
        <div className="loader"></div>
    </Grid>
    )
  }
  if(error){
    console.log(error)
    return(
      <Grid gap={12} def={1} sm={2} md={2} lg={2} className="">
        {/* @ts-ignore */}
        <ApolloErrorPage customCode="400" error={error} />
    </Grid>
    )
  }

  return(
    <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
      <div className="loader"></div>
  </Grid>
  )
}


function CreateAdminForm(){
  const [validInputs, setValidInputs] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserToMutation>(USER_MOCK as UserToMutation);
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });
  const [createAdmin, { data, loading, error }] = useMutation(CREATE_ADMIN);
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
            <option value="gerente">Gerente</option>
            <option value="dir_proyectos">Director de proyectos</option>
            <option value="compras">Compras</option>
            <option value="ing_proyectos">Ingeniero de proyectos</option>
        </select>
    </div>
  )
}