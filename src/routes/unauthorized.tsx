import ApolloErrorPage from "../components/apolloErrorPage"
import BottomStart from "../components/bottomStart"
import Grid from "../components/grid"
import Layout from "../components/layout"

export default function Unauthorized(){
    const error = {
        message: "Lo siento, no estás autorizado para realizar esta acción",
        extensions: {
            code: "Tu rol no te permite acceder a esta sección de la página",
            exception: {
                stacktrace: [""]
            }
        }
    }
        return (
            <Layout>
                <Grid def={1} sm={3} md={3} lg={3} gap={12} className="">
                    <ApolloErrorPage error={error} customCode="401"/>
                </Grid>
                <BottomStart/>
            </Layout>
        )
}