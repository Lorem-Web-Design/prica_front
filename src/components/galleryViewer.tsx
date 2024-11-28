import { useMutation, useQuery } from "@apollo/client";
import Grid from "./grid";
import { GET_IMAGES } from "../api/myQueries";
import ApolloErrorPage from "./apolloErrorPage";
import { imagesSource } from "../api/datasources";
import CustomContextMenu from "./customContextMenu";
import { useEffect, useRef, useState } from "react";
import CustomContextMenuV2 from "./customContextMenuV2";
import { DELETE_IMAGE } from "../api/myMutations";
import TrashCan from "../assets/icon/trashcan";
import Toast from "./toast";

type GalleryViewer = {
  action: Function;
  image: string;
};
export default function GalleryViewer({ action, isActive }: { action: Function, isActive: boolean }) {
  const { loading, error, data } = useQuery(GET_IMAGES);

  if (data) {
    let images = data.getImages as string[];
    let reverseImages = [...images].reverse()
    if(isActive){
      return (
        <Grid def={4} gap={12} lg={4} md={4} sm={4}>
          {reverseImages.map((image, index) => {
            return <ImageBox action={action} image={image} key={index}/>;
          })}
        </Grid>
      );
    }
    else{
      <></>
    }
  }
  if (error) {
    //@ts-ignore
    return <ApolloErrorPage customCode="400" error={error} />;
  }
  if (loading) {
    return <div className="loader"></div>;
  }
  return <p>Cargando información...</p>;
}

function ImageBox({ action, image }: GalleryViewer) {
    const [deleteImage, {loading, error, data}] = useMutation(DELETE_IMAGE, {refetchQueries: ["GetImages"], variables: {
        imageName: image
    }}
)
    //Toast Inicialization
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  useEffect(() => {
    if (data) {
        setToast(true);
        setToastProps({
          title: "Eliminando imagen",
          body: "Imagen eliminada con exito",
          footer: "SUCCESS",
          theme: "primary_theme",
        });
      }
      if (error) {
        setToast(true);
        setToastProps({
          title: "Eliminando imagen",
          body: "No se ha podido ejecutar la acción",
          footer: "ERROR",
          theme: "error_theme",
        });
      }
  }, [loading, data, error]);
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
      <div
        className="galleryImageContainer"
        onClick={() => {
          action(`images/${image}`);
        }}
      >
        <CustomContextMenuV2>
            <ul>
            <li
              onClick={() => {
                deleteImage();
              }}
            >
              <div className="option">
                <TrashCan />
                Eliminar
              </div>
            </li>
            </ul>
        </CustomContextMenuV2>
        <img src={`${imagesSource()}/images/${image}`} alt={image} />
      </div>
      </>
  );
}
