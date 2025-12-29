import { QueryResult, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RemisionFromQuery } from "../@types/remisionTypes";
import { GET_REMISION_BY_ID } from "../api/myQueries";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import ApolloErrorPage from "../components/apolloErrorPage";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import { useReactToPrint } from "react-to-print";
import { useCallback, useRef } from "react";

export default function RemisionViewer() {
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Remisión" description="" />
      {/* OC TABLE */}
      <Grid def={1} gap={12} lg={1} md={1} sm={1}>
        <RemisionInfo />
      </Grid>
      <BottomStart />
    </Layout>
  );
}

type RemisionResponseQuery = {
  getRemisionById: RemisionFromQuery;
};

function RemisionInfo() {
  const { remisionId } = useParams();
  const { loading, error, data }: QueryResult<RemisionResponseQuery> = useQuery(GET_REMISION_BY_ID, {
    variables: { remisionId },
  });

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const componentRef = useRef(null);

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Remision-PRICA",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  if (data) {
    const remision = data.getRemisionById;
    return (
      <>
      <div className="printContainer">
        <div></div>
        <div className="printPage" ref={componentRef} style={{padding: 48}}>
          <table className="ocTable" style={{fontSize: 10}} border={0.5} cellPadding={4} cellSpacing={0}>
            <thead className="logoHeadTable">
              <tr>
                <td colSpan={4}>
                  <img src={PRC_LOGO} alt="PRICA SAS" className="printLogo" />
                </td>
                <td className="ocTitle" style={{fontSize: 16}}>REMISIÓN INTERNA</td>
              </tr>
            </thead>
            <thead>
              <tr>
                <td className="primary_background borderGrayThin">REMITIDO POR</td>
                <td colSpan={2} className="borderGrayThin">
                  {remision.remitent.name}
                </td>
                <td></td>
                <td className="primary_background borderGrayThin">REMISIÓN NO.</td>
              </tr>
              <tr>
                <td className="primary_background borderGrayThin">CARGO</td>
                <td colSpan={2} className="borderGrayThin">
                  {remision.remitent.role}
                </td>
                <td></td>
                <td className="borderGrayThin">{remision.number}</td>
              </tr>
              <tr>
                <td className="primary_background borderGrayThin">PROYECTO</td>
                <td colSpan={2} className="borderGrayThin">
                  {remision.remitentProject.name}
                </td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tr>
              <td colSpan={5} className="space"></td>
            </tr>
            <thead>
              <tr>
                <td className="primary_background borderGrayThin">REMITIDO A</td>
                <td colSpan={2} className="borderGrayThin">
                  {remision.receiver.name}
                </td>
                <td></td>
                <td className="primary_background borderGrayThin">FECHA</td>
              </tr>
              <tr>
                <td className="primary_background borderGrayThin">CARGO</td>
                <td colSpan={2} className="borderGrayThin">
                  {remision.receiver.occupation}
                </td>
                <td></td>
                <td className="borderGrayThin">{new Date(remision.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="primary_background borderGrayThin">PROYECTO</td>
                <td colSpan={2} className="borderGrayThin">
                  {remision.receiverProject.name}
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={5} className="space"></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}> </td>
              </tr>
            </tbody>
            <tbody className="remisionBody">
              <tr>
                <td className="primary_background">ÍTEM</td>   
                <td className="primary_background" colSpan={2}>DESCRIPCIÓN</td>
                <td className="primary_background">UNIDAD</td>
                <td className="primary_background">CANTIDAD</td>
              </tr>

              {remision.elementsList.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td colSpan={2}>{item.element.name}</td>
                    <td>{item.element.unit}</td>
                    <td>{item.amount}</td>
                  </tr>
                );
              })}
            </tbody>
            <tr>
              <td colSpan={5} className="space"></td>
            </tr>
            <tbody className="remisionBody">
              <tr>
                <td className="primary_background">Observaciones</td>
                <td colSpan={4}>{remision.observation}</td>
              </tr>
            </tbody>
            <tr>
              <td colSpan={5} className="space"></td>
            </tr>
            <tbody>
              <tr>
                <td className="field" colSpan={2}>Nombre de quién recibe: </td>
                <td colSpan={3} className="borderBottom"></td>
              </tr>
              <tr>
                <td className="field" colSpan={2}>Documento identidad: </td>
                <td colSpan={3} className="borderBottom"></td>
              </tr>
              <tr>
                <td className="field" colSpan={2}>Fecha recibido: </td>
                <td colSpan={3} className="borderBottom"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div></div>
      </div>
      <div className="flex jcc">
      <button onClick={()=>{printFn()}} className="defaultButton primary_theme pointer">Imprimir</button>
      </div>
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
