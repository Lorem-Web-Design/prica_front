import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  GET_ELEMENTS_BY_ID_AND_CATEGORY,
  GET_WORKER_BY_ID,
  SUPER_QUERY,
} from "../api/myQueries";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import ElementCard from "../components/elementCard";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import UserCard from "../components/userCard";
import USER_MENU from "../settings/userMenu.json";
import { ElementFromQuery } from "../@types/elementTypes";
import EPP_LIFE_IN_DAYS from "../settings/eppLife.json";
import { DELETE_EPP_HISTORY_BY_INDEX } from "../api/myMutations";
import Toast from "../components/toast";
import TrashCan from "../assets/icon/trashcan";

export default function UserPanel() {
  const [userMenu, setUserMenu] = useState(USER_MENU);
  const [activeIndex, setActiveIndex] = useState(0);
  const { workerId, tab } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(tab);

  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title
        title="Gestión usuarios"
        description="A continuación selecciona lo que deseas hacer:"
      />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <Grid gap={12} def={6} sm={2} md={2} lg={6} className="">
        <CurrentUser />
        <div className="navigation_container col_s5">
          <div className="navigation_menu">
            {userMenu.map((item, index) => {
              return (
                <Link
                  className={`navigation_tab ${
                    item.name.toLowerCase() === tab?.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                  key={index}
                  to={`/worker/${workerId}/${item.name}`}
                  onClick={() => setSelectedCategory(item.name)}
                >
                  <span>{item.name}</span>
                  {/* <div className="border_bottom"></div> */}
                </Link>
              );
            })}
          </div>
          <div className="navigation_content" style={{ padding: 12 }}>
            <Grid
              sm={2}
              md={2}
              lg={2}
              gap={12}
              def={2}
              className={`${tab?.toLowerCase() === "epp" ? "hide" : ""}`}
            >
              <FilteredElements
                workerId={workerId}
                selectedCategory={selectedCategory}
              />
            </Grid>
            <Grid
              sm={1}
              md={1}
              lg={1}
              gap={12}
              def={1}
              className={`${tab?.toLowerCase() === "epp" ? "" : "hide"}`}
            >
              <div style={{ padding: 12 }}>
                <EPPList />
              </div>
            </Grid>
          </div>
        </div>
      </Grid>
      <BottomStart />
    </Layout>
  );
}

type FilteredElements = {
  workerId: string | undefined;
  selectedCategory: string | undefined;
};

function FilteredElements({ workerId, selectedCategory }: FilteredElements) {
  const { data, error, loading } = useQuery(GET_ELEMENTS_BY_ID_AND_CATEGORY, {
    variables: {
      workerId: workerId,
      categoryId: selectedCategory,
    },
  });
  if (data) {
    const elements: ElementFromQuery[] = data.getElementsByWorkerAndCategory;
    return (
      <>
        {elements.length ? (
          elements.map((element) => (
            <ElementCard info={element} key={element._id} />
          ))
        ) : (
          <p>No se encontraron elementos en esta categoría</p>
        )}
      </>
    );
  }
  if (error) {
    <p>Error</p>;
  }
  if (loading) {
    <div className="loader"></div>;
  }
  return <div className="loader"></div>;
}

function CurrentUser() {
  const { workerId } = useParams();
  const { data, loading, error } = useQuery(GET_WORKER_BY_ID, {
    variables: { workerId },
  });
  if (data) {
    const workerData = data.getWorkerById as PricaWorker;
    return (
      <div>
        <UserCard
          name={workerData.name}
          cc={workerData.cc}
          occupation={workerData.occupation}
          image={workerData.image}
          _id={`${workerData._id}`}
          eppHistory={workerData.eppHistory}
          isActive={workerData.isActive}
          role={workerData.role}
          elements={workerData.elements}
        />
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <div className="loader"></div>
      </div>
    );
  }
  if (error) {
    return (
      // @ts-ignore
      <ApolloErrorPage customCode="500" error={error} />
    );
  }
  return (
    <div>
      <div className="loader"></div>
    </div>
  );
}
type DeleteEppByIndex = {
  workerId: string | undefined;
  index: number;
};

function DeleteEPPByIndex({ workerId, index }: DeleteEppByIndex) {
  const [deleteEpp, { data, loading, error }] = useMutation(
    DELETE_EPP_HISTORY_BY_INDEX,
    {
      refetchQueries: ["GetWorkerById", "GetElementsByWorkerAndCategory"],
    }
  );
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  useEffect(() => {
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Eliminando EPP",
        body: "La operación está siendo ejecutada",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
    if (error) {
      setToast(true);
      setToastProps({
        title: "Eliminando EPP",
        body: "Error eliminando EPP",
        footer: "Error",
        theme: "error_theme",
      });
    }
    if (data) {
      setToast(true);
      setToastProps({
        title: "Eliminando EPP",
        body: "EPP eliminada exitosamente",
        footer: "Exito",
        theme: "primary_theme",
      });
    }
  }, [loading, error, data]);

  const handleDelete = () => {
    deleteEpp({
      variables: { workerId: workerId, index: index },
    });
  };

  return (
    <>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />

      <span
        className="deleteEPPButton"
        style={{ cursor: "pointer" }}
        onClick={() => {
          const confirmDelete = confirm(
            "¿Estás seguro que deseas eliminar esta EPP"
          );
          if (confirmDelete) {
            handleDelete();
          }
        }}
      >
        {" "}
        <TrashCan />
      </span>
    </>
  );
}

function EPPList() {
  const { workerId } = useParams();
  const { data, loading, error } = useQuery(GET_WORKER_BY_ID, {
    variables: { workerId },
  });

  if (data) {
    const workerData = data.getWorkerById as PricaWorker;
    return (
      <div className="eppSingleContainer">
        {workerData.eppHistory.map((eppInfo, index) => {
          let estado: string = "AL DÍA";
          let eppDate = new Date(eppInfo.date);
          let currentDate = new Date();
          //@ts-ignore
          let timeElapsed = Math.abs(currentDate - eppDate);

          if (EPP_LIFE_IN_DAYS.eppLife * 24 * 60 * 60 * 1000 <= timeElapsed) {
            estado = "REVISAR";
          }
          return (
            <div key={index} className="eppSingle">
              <DeleteEPPByIndex workerId={workerId} index={index} />

              <h5>{eppInfo.eppId?.name}</h5>
              <div className="eppDeliverInfo">
                <p>
                  Fecha:{" "}
                  {`${new Date(eppInfo.date).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}`}
                </p>
                <p>
                  {eppInfo.eppId?.classificationName}:{" "}
                  {eppInfo.eppId?.classification[0].name}
                </p>
                <p>Cantidad: {eppInfo.amount}</p>
                <p>Centro de costo: {eppInfo.folder.name}</p>
                <p>
                  Estado:{" "}
                  {estado === "REVISAR" ? (
                    <span className="red">{estado}</span>
                  ) : (
                    <span className="green">{estado}</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <div className="loader"></div>
      </div>
    );
  }
  if (error) {
    return (
      // @ts-ignore
      <ApolloErrorPage customCode="500" error={error} />
    );
  }
  return (
    <div>
      <div className="loader"></div>
    </div>
  );
}
