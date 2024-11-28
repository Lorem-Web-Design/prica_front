import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GET_WORKERS } from "../api/myQueries";
import ApolloErrorPage from "../components/apolloErrorPage";
import CreateAdminForm from "../components/createAdminForm";
import Modal from "../components/modal";
import UserCard from "../components/userCard";
import { useAuth } from "../customHooks/centers/auth/useAuth";

export default function GestionUsuarios() {
  const [modal, setModal] = useState(false);
  const {user} = useAuth();
  let addWorkerButtonVisibility: boolean = false;
  const workerButtonRoles = ["admin", "gerente"];
  let addAdminButtonVisibility: boolean = false;
  const adminButtonRoles = ["admin", "gerente"]

  if(workerButtonRoles.includes(user.role)){
    addWorkerButtonVisibility = true;
  }

  if(adminButtonRoles.includes(user.role)){
    addAdminButtonVisibility = true;
  }

  return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title title="Gestión usuarios" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <WorkersList/>
        <div className="pt_def_12"></div>
        <Grid gap={12} def={1} sm={1} md={2} lg={5} className="">
          <Link to="/create/user" className={`mediumBottom defaultButton ${addWorkerButtonVisibility ? "" : "hide"}`}>Añadir colaborador</Link>
          <button className={`mediumBottom ${addAdminButtonVisibility ? "" : "hide"}`} onClick={()=>setModal(true)}>Añadir administrador</button>
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
    return(<Grid gap={12} def={1} sm={2} md={3} lg={5} className="center_def">
      {workers.map((worker, index)=><UserCard name={worker.name} cc={worker.cc} cargo={worker.occupation} image={worker.image} id={worker._id} isActive={worker.isActive} key={index}/>)}
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




