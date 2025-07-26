import BottomStart from "../components/bottomStart";
import Card from "../components/cards";
import EppMenu from "../components/createEpp";
import ProviderMenu from "../components/createProvider";
import Gallery from "../components/gallery";
import GestionUsuariosCard from "../components/gestionUsuariosCard";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import MENU_ITEMS from "../routing/startCards.json";

export default function Start() {
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Inicio" description="A continuación selecciona lo que deseas hacer:" />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <Grid gap={12} sm={2} md={4} lg={5} def={1} className="center_def">
      <GestionUsuariosCard roles={["admin","compras"]}/>
        {MENU_ITEMS.map((item) => (
          <Card name={item.name} icon={item.icon} route={item.path} key={item.name} />
        ))}
        <Gallery roles={["admin","compras"]}/>
        <ProviderMenu roles={["admin","compras"]}/>
        <EppMenu roles={["admin","compras"]}/>
      </Grid>
      <BottomStart />
    </Layout>
  );
}
