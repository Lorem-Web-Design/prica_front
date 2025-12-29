import { OperationVariables } from "@apollo/client";
import ErrorPage from "./errorPage";
import Paginator from "./paginator";
import ApolloErrorPage from "./apolloErrorPage";
import ElementCard from "./elementCard";

export default function ElementList({loading, error, data}:OperationVariables){
    if(loading){
        return <div className="loader"></div>
    }
    if(data){ 
        return(
            <Paginator list={data}/>
        )
    }
    if(error){
      return (<ApolloErrorPage error={error.graphQLErrors[0]} customCode="400"/>
      );
    }
    return <div>Este recurso no se ha podido cargar</div>
}