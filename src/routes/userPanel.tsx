import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_ELEMENTS_BY_ID_AND_CATEGORY, GET_WORKER_BY_ID } from "../api/myQueries";
import USER_IMAGE from "../assets/images/user.png";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import ElementCard from "../components/elementCard";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import UserCard from "../components/userCard";
import USER_MENU from "../settings/userMenu.json";


export default function UserPanel() {
  const [userMenu, setUserMenu] = useState(USER_MENU);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Material");
  const { workerId } = useParams();

  useEffect(() => {
    let USER_MENU_COPY = JSON.parse(JSON.stringify(USER_MENU));
    USER_MENU_COPY[activeIndex].isActive = true;
    setUserMenu(USER_MENU_COPY);
  }, []);

  const handleClick = (itemIndex: number) => {
    let USER_MENU_COPY = JSON.parse(JSON.stringify(USER_MENU));
    USER_MENU_COPY[itemIndex].isActive = true;
    setActiveIndex(itemIndex);
    setSelectedCategory(USER_MENU[itemIndex].name);
    setUserMenu(USER_MENU_COPY);
  };

  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Gestión usuarios" description="A continuación selecciona lo que deseas hacer:" />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <Grid gap={12} def={6} sm={2} md={2} lg={2} className="">
        <CurrentUser />
        <div className="navigation_container col_s5">
          <div className="navigation_menu">
            {userMenu.map((item, index) => {
              return (
                <div className={`navigation_tab ${item.isActive ? "active" : ""}`} onClick={() => handleClick(index)} key={index}>
                  <span>{item.name}</span>
                  <div className="border_bottom"></div>
                </div>
              );
            })}
          </div>
          <div className="navigation_content" style={{ padding: 12 }}>
            <Grid sm={2} md={2} lg={2} gap={12} def={2} className="">
              <FilteredElements workerId={workerId} selectedCategory={selectedCategory} />
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
  selectedCategory: string;
};

function FilteredElements({ workerId, selectedCategory }: FilteredElements) {
  const { data, error, loading } = useQuery(GET_ELEMENTS_BY_ID_AND_CATEGORY, {
    variables: {
      workerId: workerId,
      categoryId: selectedCategory,
    },
  });
  if (data) {
    const elements: ElementInformation[] = data.getElementsByWorkerAndCategory;
    return (
      <>
        {elements.map((element) => (
          <ElementCard info={element} />
        ))}
      </>
    );
  }
  if (error) {
    <p>Error</p>;
  }
  if (loading) {
    <div className="loading"></div>;
  }
  return <p>No hay elementos...</p>;
}

function CurrentUser() {
  const { workerId } = useParams();
  const { data, loading, error } = useQuery(GET_WORKER_BY_ID, { variables: { workerId } });
  if (data) {
    const workerData = data.getWorkerById as PricaWorker;
    return (
      <div>
        <UserCard name={workerData.name} cc={workerData.cc} cargo={workerData.occupation} image={USER_IMAGE} id={`${workerData._id}`} />
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
