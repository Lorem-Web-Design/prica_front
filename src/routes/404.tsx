import ApolloErrorPage from "../components/apolloErrorPage"
import BottomStart from "../components/bottomStart"
import Grid from "../components/grid"
import Layout from "../components/layout"

export default function ConstructionPage(){
    const error = {
        message: "Página en construcción",
        extensions: {
            code: "Esta página está en construcción",
            exception: {
                stacktrace: [""]
            }
        }
    }
        return (
            <Layout>
                <Grid def={1} sm={3} md={3} lg={3} gap={12} className="">
                    <ApolloErrorPage error={error} customCode="404"/>
                </Grid>
                <BottomStart/>
            </Layout>
        )
}