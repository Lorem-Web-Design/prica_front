import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";

import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_CHILDRENFOLDERS } from "../api/myQueries";
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
        navigate(`/centro_costo/info/${parentId}`, { replace: true });
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
          {myData.map(({ name, image, _id, parentId }) => (
            <FolderCard
              name={name}
              icon={image}
              route={`/centro_costo/info/${_id}`}
              key={_id}
              ID={_id} 
              isParent={false} 
              parentId={parentId}            
              />
          ))}
        </Grid>
        <BottomStart />
      </Layout>
    );
  }

  return <div>Oops, ha ocurrido un error;</div>;
}
