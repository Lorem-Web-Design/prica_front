import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import USER_MENU from "../settings/userMenu.json";
import { useEffect, useState } from "react";
import ElementCard from "../components/elementCard";
import { useQuery } from "@apollo/client";
import { GET_ELEMENTS_BY_FOLDER_AND_CATEGORY } from "../api/myQueries";
import { useParams } from "react-router-dom";
import ApolloErrorPage from "../components/apolloErrorPage";
import { Categories } from "../@types/elementTypes";

export default function BodegaInfo() {
  const [userMenu, setUserMenu] = useState(USER_MENU);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Categories>("Material");
  const {folderId} = useParams();


  useEffect(() => {
    let USER_MENU_COPY = JSON.parse(JSON.stringify(USER_MENU));
    USER_MENU_COPY[activeIndex].isActive = true;
    setUserMenu(USER_MENU_COPY);
  }, []);

  const handleClick = (itemIndex: number) => {
    let USER_MENU_COPY = JSON.parse(JSON.stringify(USER_MENU));
    USER_MENU_COPY[itemIndex].isActive = true;
    setActiveIndex(itemIndex);
    setSelectedCategory(USER_MENU[itemIndex].name as Categories)
    setUserMenu(USER_MENU_COPY);
  };

  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title
        title="Elementos en bodega"
        description="Estos son los elementos de la bodega"
      />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <Grid gap={12} def={5} sm={2} md={2} lg={2} className="">
        <div className="navigation_container col_s5">
          <div className="navigation_menu">
            {userMenu.map((item, index) => {
              return (
                <a
                  className={`navigation_tab ${item.isActive ? "active" : ""}`}
                  onClick={() => handleClick(index)} key={index}
                >
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
          <div className="navigation_content" style={{ padding: 12 }}>
            <Grid sm={2} md={2} lg={2} gap={12} def={2} className="">
              <FilteredElements folderId={folderId} selectedCategory={selectedCategory}/>
            </Grid>
          </div>
        </div>
      </Grid>
      <BottomStart />
    </Layout>
  );
}

type FilteredElements = {
  folderId: string | undefined,
  selectedCategory: string
}
function FilteredElements({folderId, selectedCategory}: FilteredElements){
  const {data, error, loading} = useQuery(GET_ELEMENTS_BY_FOLDER_AND_CATEGORY   , {variables: {
    folderId: folderId,
    categoryId: selectedCategory
  }})
  if(data){
    const elements:ElementInformation[] = data.getElementsByFolderAndCategory;
    if(elements.length !== 0){
      return (
        <>{elements.map(element => <ElementCard info={element} key={element._id}/>)}</>
      );
    }
    
    return <div>No se encontraron elementos en esta categoría.</div>
    
  }
  if(error){
    // @ts-ignore
    return <ApolloErrorPage customCode="404" error={error}/>
  }
  if(loading){
    <div className="loader"></div>
  }
  return <div className="loader"></div>
}