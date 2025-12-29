import BottomStart from "../components/bottomStart";
import Card from "../components/cards";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import RQ_SUB_MENU from "../routing/rqSubmenu.json"

export default function RQStart(){
    return(
        <Layout>
        {/* Titulo de la página actual */}
        <Title title="Requisiciones" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={3} md={4} lg={6} def={1} className="center_def">
          {RQ_SUB_MENU.map(item=><Card name={item.name} icon={item.icon} route={item.path} key={item.name}/>)}
        </Grid>
        <BottomStart/>
      </Layout>
    )
}