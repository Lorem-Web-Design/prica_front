interface ApolloErrorPrica {
    customCode: string,
    error: {
        message: string,
        extensions: {
            code: string,
            exception: {
                stacktrace: string[]
            }
        }
    }
}
export default function ApolloErrorPage({error, customCode}:ApolloErrorPrica){
    try{
        return <div className="errorContainer">
        <p className="notFoundTitle">{customCode}</p>
        <p className="notFoundMessage">{error.extensions.code}</p>
        <p className="notFoundTrack">{error.message}</p>
    </div>
    }catch(err){
        return <div className="errorContainer">
        <p className="notFoundTitle">{500}</p>
        <p className="notFoundMessage">{"Sin conexión con el servidor"}</p>
        <p className="notFoundTrack">{"No se ha posido establecer la comunicación con el servidor"}</p>
    </div>
    }
    
}