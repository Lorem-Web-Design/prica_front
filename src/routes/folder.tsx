import Layout from "../components/layout";
import BottomStart from "../components/bottomStart";
import Title from "../components/title";
import Grid from "../components/grid";
import Card from "../components/cards";
import { GET_PARENTFOLDERS } from "../api/myQueries";
import { useMutation, useQuery } from "@apollo/client";
import ApolloErrorPage from "../components/apolloErrorPage";
import Modal from "../components/modal";
import { useEffect, useState } from "react";
import InputBox from "../components/inputElement";
import BodegaSelectBox from "../components/bodegaSelectBox";
import FolderControll from "../utils/folder.controll";
import { ADD_FOLDER } from "../api/myMutations";
import Toast from "../components/toast";
import checkForms from "../utils/checkForms";
import FolderCard from "../components/folderCard";
import CreateFolderForm from "../components/forms/creaeteFolderForm";

export default function Folder() {
  const folderControll = new FolderControll({
    image: "/assets/icons/mmcndmgr.dll_14_30612-1.png",
    isParent: false,
    name: "",
    parentId: "",
  });
  const { loading, error, data } = useQuery(GET_PARENTFOLDERS);
  const [modal, setModal] = useState(false);

  if (loading)
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Centro de costos"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={2} lg={2} def={1} className="">
          {/* @ts-ignore */}
          <div className="loader"></div>
        </Grid>
        <BottomStart />
      </Layout>
    );

  if (error) {
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Centro de costos"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={2} lg={2} def={1} className="">
          {/* @ts-ignore */}
          <ApolloErrorPage error={error.graphQLErrors[0]} customCode="400" />
        </Grid>
        <BottomStart />
      </Layout>
    );
  }

  if (data) {
    let myData = data.parentFolders as Bodega[];
    return (
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Centro de costos"
          description="Sitios de almacenaje de elementos"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={3} lg={6} def={1} className="center_def">
          {myData.map(({ name, image, _id, isParent, parentId, hide }) => (
            <FolderCard
              name={name}
              icon={image}
              route={_id}
              key={_id}
              ID={_id}
              isParent={isParent}
              parentId={parentId}
              hide={hide}
            />
          ))}
          <Modal modal={modal} setModal={setModal}>
            <CreateFolderForm folderControll={folderControll} />
          </Modal>
        </Grid>
        <div className="pt_def_12"></div>
        <Grid gap={12} sm={2} md={2} lg={2} def={1}>
          <button className="mediumBottom" onClick={() => setModal(true)}>
            + Crear centro
          </button>
        </Grid>
        <BottomStart />
      </Layout>
    );
  }

  return <div>Holi!</div>;
}
