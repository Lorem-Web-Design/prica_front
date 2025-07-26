import { useQuery } from "@apollo/client";
import { GET_OCS, GET_REMISIONS } from "../api/myQueries";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import OcCard from "../components/ocCard";
import Title from "../components/title";
import RemisionCard from "../components/remisionCard";
import { RemisionFromQuery } from "../@types/remisionTypes";

export default function RemisionViewList(){
    return(
        <Layout>
        {/* Titulo de la página actual */}
        <Title title="Remisiones" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <RemisionList/>
        <BottomStart/>
      </Layout>
    )
}

function RemisionList(){
    const {loading, error, data} = useQuery(GET_REMISIONS);
    if(loading){
        return <Grid gap={12} sm={2} md={2} lg={2} def={1} className="jcc aic"><div className="loader"></div></Grid>
    }
    if(error){
        return <Grid gap={12} sm={2} md={2} lg={2} def={1} className="">
            {/* @ts-ignore */}
          <ApolloErrorPage customCode="400" error={error.graphQLErrors[0]}/>
        </Grid>
    }
    if(data){
        return (
        <Grid gap={12} sm={2} md={3} lg={4} def={1} className="center_def">
        {data.getRemision.map((rq: RemisionFromQuery)=>{
            return(<RemisionCard cardInfo={rq} key={rq._id}/>)
        })}
        </Grid>
        )
    }
    return <p>Oops, hubo un problema</p>
}