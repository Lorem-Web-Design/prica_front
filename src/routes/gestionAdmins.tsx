import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VisibleAdmin } from "../@types/usersTypes";
import { GET_ADMINS } from "../api/myQueries";
import AdminCard from "../components/adminCard";
import ApolloErrorPage from "../components/apolloErrorPage";
import CreateAdminForm from "../components/createAdminForm";
import Modal from "../components/modal";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import WorkersControll from "../utils/search.controll";
import AS_QUERY_ADMIN from "../data/mock.admin.json";
import Pagination from "../components/pagination";

export default function GestionAdmins() {
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
        <Title title="Gestión de usuarios: Administradores" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <AdminsList/>
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

const Workers = new WorkersControll([AS_QUERY_ADMIN] as VisibleAdmin[]);

function AdminsList(){
  const {data, loading, error} = useQuery(GET_ADMINS);

  const [searchString, setSearchString] = useState<string>("");
    const [workersLoaded, setWorkersLoaded] = useState<VisibleAdmin[]>([]);
  
      const handleSearch = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (workersLoaded) {
          const search = Workers.search("name", searchString);
          setWorkersLoaded(search);
        }
      };
      
      const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setSearchString(value);
      };
  
        useEffect(() => {
          if (data) {
            Workers.list = JSON.parse(JSON.stringify(data.getUsers));
            setWorkersLoaded(Workers.list);
          }
        }, [data, loading, error]);

  if(data){
    return(
      <>
      <form className="search_container" onSubmit={handleSearch} style={{paddingBottom: 12}}>
        <input type="text" placeholder="Buscar usuarios..." className="search" name="search" onChange={handleChange} value={searchString} />
        <button className="searchButton" type="submit">
          Buscar
        </button>
      </form>
      <Pagination itemsPerPage={12}>
      {workersLoaded.map((worker, index)=><AdminCard name={worker.name} cc={worker.cc} role={worker.role} image={worker.image} _id={worker._id} hide={worker.hide} key={index}/>)}
      </Pagination>

    </>)
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

