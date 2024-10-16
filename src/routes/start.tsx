import BottomStart from "../components/bottomStart";
import Card from "../components/cards";
import Gallery from "../components/gallery";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import MENU_ITEMS from "../routing/bottomStart.json";

export default function Start() {
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Inicio" description="A continuación selecciona lo que deseas hacer:" />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <Grid gap={12} sm={2} md={2} lg={2} def={6} className="">
        {MENU_ITEMS.map((item) => (
          <Card name={item.name} icon={item.icon} route={item.path} key={item.name} />
        ))}
        <Gallery/>
      </Grid>
      <BottomStart />
    </Layout>
  );
}
