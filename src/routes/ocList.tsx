import { useQuery } from "@apollo/client";
import { GET_OCS } from "../api/myQueries";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import OcCard from "../components/ocCard";
import Title from "../components/title";
import Pagination from "../components/pagination";

export default function OCViewList(){
    return(
        <Layout>
        {/* Titulo de la página actual */}
        <Title title="Orden de compra" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <OCList/>
        <BottomStart/>
      </Layout>
    )
}

function OCList(){
    const {loading, error, data} = useQuery(GET_OCS);
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
        <Grid gap={12} sm={2} md={3} lg={1} def={1} className="center_def">
        <Pagination itemsPerPage={12}>
        {data.getOcs.map((rq: PricaOC)=>{
            return(<OcCard cardInfo={rq} key={rq._id}/>)
        })}
        </Pagination>
        </Grid>
        )
    }
    return <p>Oops, hubo un problema</p>
}