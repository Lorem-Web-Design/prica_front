import BottomStart from "../components/bottomStart";
import Card from "../components/cards";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import OC_SUB_MENU from "../routing/ocSubmenu.json"

export default function OCStart(){
    return(
        <Layout>
        {/* Titulo de la página actual */}
        <Title title="Orden de compra" description="A continuación selecciona lo que deseas hacer:"/>
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid gap={12} sm={2} md={2} lg={2} def={6} className="">
          {OC_SUB_MENU.map(item=><Card name={item.name} icon={item.icon} route={item.path} key={item.name}/>)}
        </Grid>
        <BottomStart/>
      </Layout>
    )
}