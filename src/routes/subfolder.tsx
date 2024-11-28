import Layout from "../components/layout";
import BottomStart from "../components/bottomStart";
import Title from "../components/title";
import Grid from "../components/grid";
import Card from "../components/cards";

import MENU_ITEMS from "../routing/bottomStart.json";
import { GET_CHILDRENFOLDERS } from "../api/myQueries";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import FolderCard from "../components/folderCard";

export default function Subfolder() {
  var { parentId } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_CHILDRENFOLDERS, {
    variables: { parentId: parentId },
  });

  useEffect(() => {
    if (data) {
      let myData = data.folderByParentId as Bodega[];
      if (myData.length === 0) {
        navigate(`/bodega/info/${parentId}`, { replace: true });
      }
    }
  }, [data]);

  if (loading) return <div className="loader"></div>;

  if (error) return <p>Error : {error.message}</p>;

  if (data) {
    let myData = data.folderByParentId as Bodega[];
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Bodegas"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={3} lg={6} def={1} className="center_def">
          {myData.map(({ name, image, _id }) => (
            <FolderCard
              name={name}
              icon={image}
              route={`/bodega/info/${_id}`}
              key={_id}
              ID={_id} 
              isParent={false} 
              parentId={""}            
              />
          ))}
        </Grid>
        <BottomStart />
      </Layout>
    );
  }

  return <div>Oops, ha ocurrido un error;</div>;
}
