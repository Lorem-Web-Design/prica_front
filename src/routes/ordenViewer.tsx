import { ApolloError, QueryResult, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_OC_BY_ID, GET_OCS } from "../api/myQueries";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import RuledActionButton from "../components/ruledActionButton";
import { KILL_OC_BY_ID } from "../api/myMutations";
import Toast from "../components/toast";
import { useEffect, useState } from "react";
import OrdenDeCompra from "../utils/oc.controll";
import OC_DELIVERY_INFO from "../data/ocDeliverInfo.json";

export default function OCViewer() {

  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Orden de compra" description="" />
      {/* OC TABLE */}
      <Grid def={1} gap={12} lg={1} md={1} sm={1}>
        <OCInfo/>
      </Grid>
      <BottomStart />
    </Layout>
  );
}

type OCResponseQuery = {
  getOcById: PricaOC
}

function OCInfo(){
  const {ocId} = useParams();
  const { loading, error, data }:QueryResult<OCResponseQuery> = useQuery(GET_OC_BY_ID, {
    variables: { ocId },
  });
      //Toast
      const [toast, setToast] = useState(false);
      const [toastProps, setToastProps] = useState({
          title: "Titulo del toast",
          body: "Cuerpo del toast",
          footer: "Footer del toast",
          theme: "primary_theme"
      })

      const [killOc, {loading: loadingKill, error:errorKill, data:dataKill}] = useMutation(KILL_OC_BY_ID, {
        refetchQueries :[
          {
            query: GET_OCS
          },
          {
            query: GET_OC_BY_ID,
            variables: {
              ocId
            }
          }
        ],
        variables: {
          ocId
        }
      })

  useEffect(() => {
    if(loadingKill){
        setToastProps({
            title: "Finalizando Orden de Compra",
            body: "Espere mientras los elementos son actualizados",
            footer: "Exito",
            theme: "primary_theme"
        })
        setToast(true);
    }
    if(dataKill){
        setToastProps({
            title: "Finalizando Orden de Compra",
            body: "Todos los elementos han sido actualizados exitosamente",
            footer: "Exito",
            theme: "primary_theme"
        })
        setToast(true);
    }
    if(errorKill){
        setToastProps({
            title: "Finalizando Orden de Compra",
            body: "Ha ocurrido un error actualizando la orden de compra",
            footer: "Exito",
            theme: "error_theme"
        })
        setToast(true);
    }
}, [errorKill, dataKill, loadingKill]);

useEffect(() => {
  if(data){
    if(!data.getOcById.isAlive){
      setToastProps({
        title: "Información importante",
        body: "Esta orden de compra ya ha sido marcada como finalizada",
        footer: "EXITO",
        theme: "success_theme"
    })
    setToast(true); 
    }
  }
}, [data]);
  
  if(data){
    return (
      <>
      <Toast
          title={toastProps.title}
          body={toastProps.body}
          theme={toastProps.theme}
          footer={toastProps.footer}
          isActive={toast}
          setToast={setToast}
        />
        <table className="ocTable">
            <thead className="logoHeadTable">
              <tr>
                <td colSpan={4}>
                  <img src={PRC_LOGO} alt="PRICA SAS" />
                </td>
                <td className="ocTitle">ORDEN DE COMPRA</td>
              </tr>
            </thead>
            <thead>
              <tr>
                <td className="primary_background borderGray">Razón social</td>
                <td colSpan={2} className="borderGray">
                  {data.getOcById.provider.name}
                </td>
                <td></td>
                <td className="primary_background borderGray">Fecha</td>
              </tr>
              <tr>
                <td className="primary_background borderGray">NIT</td>
                <td colSpan={2} className="borderGray">
                {data.getOcById.provider.nit}
                </td>
                <td></td>
                <td className="borderGray">{data.getOcById.date}</td>
              </tr>
              <tr>
                <td className="primary_background borderGray">Dirección</td>
                <td colSpan={2} className="borderGray">
                {data.getOcById.provider.address}
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="primary_background borderGray">Ciudad</td>
                <td colSpan={2} className="borderGray">
                {data.getOcById.provider.city}
                </td>
                <td></td>
                <td className="primary_background borderGray">
                  Orden de compra No.
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">Contacto</td>
                <td colSpan={2} className="borderGray">
                {data.getOcById.provider.contact}
                </td>
                <td></td>
                <td className="borderGray">{data.getOcById.ocNumber}</td>
              </tr>
              <tr>
                <td className="primary_background borderGray">
                  Número de contacto
                </td>
                <td colSpan={2} className="borderGray">
                {data.getOcById.provider.contactNumber}
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="primary_background borderGray">
                  Correo electrónico
                </td>
                <td colSpan={2} className="borderGray">
                {data.getOcById.provider.email}
                </td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td colSpan={5}>FACTURAR A</td>
            </tr>
            </tbody>
            <thead>
              <tr>
                <td className="primary_background borderGray">Razón social</td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.name}
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">NIT</td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.nit}
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">Dirección</td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.address}
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">Ciudad</td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.city}
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">Contacto</td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.contact}
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">
                  Número de contacto
                </td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.contactNumber}
                </td>
              </tr>
              <tr>
                <td className="primary_background borderGray">
                  Correo electrónico
                </td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.receiver.email}
                </td>
              </tr>
              <td colSpan={5} className="projectName">{data.getOcById.project}</td>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}> </td>
              </tr>
            </tbody>
            <thead className="generalInfo">
              <tr>
                <th className="primary_background">MÉTODO DE ENVÍO</th>
                <th className="primary_background">CONDICIONES DE ENVÍO</th>
                <th className="primary_background">ENVIAR A</th>
                <th className="primary_background">PAGO</th>
                <th className="primary_background">FECHA DE ENTREGA</th>
              </tr>
              <tr>
                <th>{OrdenDeCompra.OCDeliveryInfo("deliveryMethods", data.getOcById.deliverMethod)}</th>
                <th>{OrdenDeCompra.OCDeliveryInfo("deliveryConditions", data.getOcById.deliverConditions)}</th>
                <th>{data.getOcById.deliverAddress}</th>
                <th>{OrdenDeCompra.OCDeliveryInfo("paymentMethod", data.getOcById.paymentMethod)}</th>
                <th>{data.getOcById.deliverDate}</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td colSpan={5}></td>
            </tr>
            </tbody>
            <tbody className="ocBody">
              <tr>
                <td className="primary_background">ÍTEM</td>
                <td className="primary_background">DESCRIPCIÓN</td>
                <td className="primary_background">CANTIDAD</td>
                <td className="primary_background">PRECIO UNITARIO</td>
                <td className="primary_background">TOTAL</td>
              </tr>
              {data.getOcById.items.map((item, index)=>{
                return(
                  <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>{OrdenDeCompra.toCurrency(item.unitaryPrice)}</td>
                <td>{OrdenDeCompra.toCurrency(item.amount * item.unitaryPrice)}</td>
              </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="primary_background borderGray">Observaciones</td>
                <td colSpan={4} className="borderGray">
                {data.getOcById.observation}
                </td>
              </tr>
            </tfoot>
          </table>
          <RuledActionButton action={()=>{killOc()}} roles={["admin", "compras"]} text="Marcar Fin" className={`${data.getOcById.isAlive ? "" : "hide"}`}/>
      </>
    )
  }
  if(loading){
    return(
      <div className="loader"></div>
    )
  }
  if(error){
    /* @ts-ignore */
    return <ApolloErrorPage customCode="500" error={error}/>
  }

  return <div className="loader"></div>
}
