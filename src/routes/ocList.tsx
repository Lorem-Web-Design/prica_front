import { useQuery } from "@apollo/client";
import { GET_OCS } from "../api/myQueries";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import OcCard from "../components/ocCard";
import Title from "../components/title";
import Pagination from "../components/pagination";
import FILTROS from "../settings/filterOc.json";
import { useEffect, useState } from "react";
import OC_MOCK from "../data/mock.oc.json";
import { excelSource } from "../api/datasources";

export default function OCViewList() {
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Orden de compra" description="A continuación selecciona lo que deseas hacer:" />
      {/* Barra de meníu inferior - shortcuts */}
      <OCList />
      <BottomStart />
    </Layout>
  );
}

function OCList() {
  const { loading, error, data } = useQuery(GET_OCS);
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const [orders, setOrders] = useState<PricaOC[]>([OC_MOCK]);
  const [ordersBackup, setOrdersBackup] = useState<PricaOC[]>([OC_MOCK]);

  useEffect(() => {
    if (data) {
      setOrders(data.getOcs);
    }
  }, [data]);

  useEffect(()=>{
    if(data){
      if(selectedFilter === "todos"){
        setOrdersBackup(JSON.parse(JSON.stringify(data.getOcs)))
        setOrders(data.getOcs)
      }
      if(selectedFilter === "aprobado"){
        let approved = ordersBackup.filter(item=>item.state === "initialized" && item.isAlive===false);
        setOrders(approved)
      }
      if(selectedFilter === "reviewed"){
        let approved = ordersBackup.filter(item=>item.state === "aprobado" && item.isAlive===true);
        setOrders(approved)
      }
      if(selectedFilter === "inReview"){
        let approved = ordersBackup.filter(item=>item.state === "initialized" && item.isAlive===true);
        setOrders(approved)
      }
      if(selectedFilter === "ended"){
        let approved = ordersBackup.filter(item=>item.state === "aprobado" && item.isAlive===false);
        setOrders(approved)
      }
    }
  },[selectedFilter, data])

  if (loading) {
    return (
      <Grid gap={12} sm={2} md={2} lg={2} def={1} className="jcc aic">
        <div className="loader"></div>
      </Grid>
    );
  };

  if (error) {
    return (
      <Grid gap={12} sm={2} md={2} lg={2} def={1} className="">
        {/* @ts-ignore */}
        <ApolloErrorPage customCode="400" error={error.graphQLErrors[0]} />
      </Grid>
    );
  };

  if (data) {
    return (
      <>
      <div className="inventario">
                <a href={`${excelSource()}/oc`} className="pointer primary_theme defaultButton" target="_blank">
                  Descargar listado OC
                </a>
              </div>
              <Grid gap={12} sm={2} md={2} lg={9} def={1}>
          {FILTROS.categories.map((categoria) => {
            return (
              <div
                className={`mediumBottom ${selectedFilter === categoria.slug ? "active" : ""} ${categoria.slug === "todos" ? "hide" : ""}`}
                onClick={() => {
                  setSelectedFilter(categoria.slug);
                }}
                key={categoria.name}
              >
                {categoria.name}
              </div>
            );
          })}
        </Grid>
        <div style={{paddingBottom: 12}}></div>
      <Grid gap={12} sm={2} md={3} lg={1} def={1} className="center_def">
        <Pagination itemsPerPage={12}>
          {orders.map((rq: PricaOC) => {
            return <OcCard cardInfo={rq} key={rq._id}/>;
          })}
        </Pagination>
      </Grid></>
    );
  };

  return <p>Oops, hubo un problemas</p>;

}
