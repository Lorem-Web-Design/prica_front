import { ApolloError, QueryResult, useMutation, useQuery } from "@apollo/client";
import { json, useParams } from "react-router-dom";
import { GET_OC_BY_ID, GET_OCS } from "../api/myQueries";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import RuledActionButton from "../components/ruledActionButton";
import { APPROVE_ORDER, KILL_OC_BY_ID } from "../api/myMutations";
import Toast from "../components/toast";
import { useEffect, useState } from "react";
import OrdenDeCompra from "../utils/oc.controll";
import OC_MOCK from "../data/mock.oc.json";
import { OCFromQuery } from "../@types/oc.types";

export default function OCViewer() {
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Orden de compra" description="" />
      {/* OC TABLE */}
      <Grid def={1} gap={12} lg={1} md={1} sm={1}>
        <OCInfo />
      </Grid>
      <BottomStart />
    </Layout>
  );
}

type OCResponseQuery = {
  getOcById: OCFromQuery;
};

const OCControll = new OrdenDeCompra(OC_MOCK);

function OCInfo() {
  const { ocId } = useParams();
  const [ordenDeCompra, setOrdenDeCompra] = useState(OCControll.ocData);
  const { loading, error, data }: QueryResult<OCResponseQuery> = useQuery(GET_OC_BY_ID, {
    variables: { ocId },
  });
  //Permitir revision
  const [review, setReview] = useState(false);
  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const [killOc, { loading: loadingKill, error: errorKill, data: dataKill }] = useMutation(KILL_OC_BY_ID, {
    refetchQueries: [
      {
        query: GET_OCS,
      },
      {
        query: GET_OC_BY_ID,
        variables: {
          ocId,
        },
      },
    ],
    variables: {
      ocId,
    },
  });

  const [approveOc, { loading: loadingApprove, error: errorApprove, data: dataApprove }] = useMutation(APPROVE_ORDER, {
    refetchQueries: [
      {
        query: GET_OCS,
      },
      {
        query: GET_OC_BY_ID,
        variables: {
          ocId,
        },
      },
    ],
    variables: {
      ocData: {
        ...OCControll.OC2API,
        state: "aprobado"
      },
      ocId
    },
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>, index: number) => {
    OCControll.ocData.items[index].amount = parseFloat(evt.target.value);
    setOrdenDeCompra(JSON.parse(JSON.stringify(OCControll.ocData)))
  }

  useEffect(() => {
    if (loadingKill) {
      setToastProps({
        title: "Finalizando Orden de Compra",
        body: "Espere mientras los elementos son actualizados",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (dataKill) {
      setToastProps({
        title: "Finalizando Orden de Compra",
        body: "Todos los elementos han sido actualizados exitosamente",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (errorKill) {
      setToastProps({
        title: "Finalizando Orden de Compra",
        body: "Ha ocurrido un error actualizando la orden de compra",
        footer: "Exito",
        theme: "error_theme",
      });
      setToast(true);
    }
  }, [errorKill, dataKill, loadingKill]);

  useEffect(() => {
    if (data) {
      OCControll.ocData = JSON.parse(JSON.stringify(data.getOcById));
      setReview(OCControll.ocData.state === "aprobado" ? false : true)
      setOrdenDeCompra(OCControll.ocData)
      if (!OCControll.ocData.isAlive) {
        setToastProps({
          title: "Información importante",
          body: "Esta orden de compra ya ha sido marcada como finalizada",
          footer: "EXITO",
          theme: "success_theme",
        });
        setToast(true);
      }
    }
  }, [data]);

  if (data) {
    
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
                {OCControll.ocData.provider.name}
              </td>
              <td></td>
              <td className="primary_background borderGray">Fecha</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">NIT</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.provider.nit}
              </td>
              <td></td>
              <td className="borderGray">{new Date(ordenDeCompra.date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Dirección</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.provider.address}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Ciudad</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.provider.city}
              </td>
              <td></td>
              <td className="primary_background borderGray">Orden de compra No.</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Contacto</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.provider.contact}
              </td>
              <td></td>
              <td className="borderGray">{ordenDeCompra.ocNumber}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Número de contacto</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.provider.contactNumber}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Correo electrónico</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.provider.email}
              </td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ fontWeight: "bold" }}>
                FACTURAR A
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <td className="primary_background borderGray">Razón social</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.name}
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">NIT</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.nit}
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Dirección</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.address}
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Ciudad</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.city}
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Contacto</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.contact}
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Número de contacto</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.contactNumber}
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Correo electrónico</td>
              <td colSpan={4} className="borderGray">
                {ordenDeCompra.receiver.email}
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="projectName">
                PRC {ordenDeCompra.rq?.ppto} - {ordenDeCompra.rq?.rq}
              </td>
            </tr>
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
              <th>{OrdenDeCompra.OCDeliveryInfo("deliveryMethods", ordenDeCompra.deliverMethod)}</th>
              <th>{OrdenDeCompra.OCDeliveryInfo("deliveryConditions", ordenDeCompra.deliverConditions)}</th>
              <th>{ordenDeCompra.deliverAddress}</th>
              <th>{OrdenDeCompra.OCDeliveryInfo("paymentMethod", ordenDeCompra.paymentMethod)}</th>
              <th>{new Date(ordenDeCompra.deliverDate).toUTCString()}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
            <td colSpan={5} style={{paddingTop: 12}}></td>
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
            {ordenDeCompra.items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                  <input type="number" className="observation" onChange={(evt)=>{handleChange(evt, index)}} value={`${item.amount}`} disabled={!review}/>
                    </td>
                  <td>{OrdenDeCompra.toCurrency(item.unitaryPrice)}</td>
                  <td>{OrdenDeCompra.toCurrency(item.amount * item.unitaryPrice)}</td>
                </tr>
              );
            })}
          </tbody>
          <tbody>
            <tr>
              <td colSpan={5} style={{paddingTop: 12}}></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="primary_background borderGray">Solicitado por</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.rq.petitioner.name}
              </td>
              <td className="txtBold txtBlue">Subtotal</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(OCControll.Subtotal)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Proyecto</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.projectName}
              </td>
              <td className="txtBold txtBlue">IVA (19%)</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(OCControll.IVA)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Cotización No.</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.request}
              </td>
              <td className="txtBold txtBlue">{ordenDeCompra.discount?.name}</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(ordenDeCompra.discount?.value ?? 0)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Recibe</td>
              <td colSpan={2} className="borderGray ocTaker">
                <span className="txtBold txtBlue">Nombre</span>: {ordenDeCompra.taker?.name} / <span className="txtBold txtBlue">C.C.</span> {ordenDeCompra.taker?.cc} / <span className="txtBold txtBlue">Cargo: </span>{ordenDeCompra.taker?.occupation}
              </td>
              <td className="txtBold txtBlue">Total</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(OCControll.Total)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Observaciones</td>
              <td colSpan={2} className="borderGray">
                {ordenDeCompra.observation}
              </td>
            </tr>
          </tfoot>
        </table>
        <Grid def={2} gap={12} lg={2} md={2} sm={2}>
        <RuledActionButton
          action={() => {
            approveOc();
          }}
          roles={["admin", "compras"]}
          text="Revisar"
          className={`${ordenDeCompra.state === "aprobado" ? "hide" : ""}`}
        />
        <RuledActionButton
          action={() => {
            killOc();
          }}
          roles={["admin", "compras"]}
          text="Actualizar inventario"
          className={`${ordenDeCompra.isAlive ? "" : "hide"}`}
        />
        </Grid>
      </>
    );
  }
  if (loading) {
    return <div className="loader"></div>;
  }
  if (error) {
    /* @ts-ignore */
    return <ApolloErrorPage customCode="500" error={error} />;
  }

  return <div className="loader"></div>;
}
