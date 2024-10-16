import { useQuery } from "@apollo/client";
import Grid from "./grid";
import { GET_IMAGES } from "../api/myQueries";
import ApolloErrorPage from "./apolloErrorPage";
import { imagesSource } from "../api/datasources";

type GalleryViewer = {
    action: Function
}
export default function GalleryViewer({action}:GalleryViewer){
    const {loading, error, data} = useQuery(GET_IMAGES);
    if(data){
        let images = data.getImages as string[];
        return(
            <Grid def={4} gap={12} lg={4} md={4} sm={4}>
                {images.map((image, index)=>{
                       return <div key={index} className="galleryImageContainer" onClick={()=>{action(`images/${image}`)}}>
                            <img src={`${imagesSource()}/images/${image}`} alt={image} />
                       </div>
                    })}
                
            </Grid>
        )
    }
    if(error){
        //@ts-ignore
        return <ApolloErrorPage customCode="400" error={error} />
    }
    if(loading){
        return <div className="loader"></div>
    }
    return <p>Cargando información...</p>
}