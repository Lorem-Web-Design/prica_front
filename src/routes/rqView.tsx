import { useQuery } from "@apollo/client";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import { GET_RQS } from "../api/myQueries";
import RqCard from "../components/rqCard";
import ApolloErrorPage from "../components/apolloErrorPage";

export default function RQViewList(){
    return(
        <Layout>
        {/* Titulo de la página actual */}
        <Title title="Requisiciones" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <RQList/>
        <BottomStart/>
      </Layout>
    )
}

function RQList(){
    const {loading, error, data} = useQuery(GET_RQS);
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
        <Grid gap={12} sm={2} md={2} lg={2} def={3}>
        {data.getRqs.map((rq: RQFromQuery)=>{
            return(<RqCard cardInfo={rq} key={rq._id}/>)
        })}
        </Grid>
        )
    }
    return <p>Oops, hubo un problema</p>
}