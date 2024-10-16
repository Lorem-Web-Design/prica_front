import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_COUNTER, GET_PROVIDERS, GET_RQ_BY_ID } from "../api/myQueries";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import PRICA_LOGO from "../assets/images/prica_logo.png";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import MOCK_OC from "../data/mock.oc.json";
import OrdenDeCompra from "../utils/oc.controll";
import { ADD_OC } from "../api/myMutations";
import CreateOcProvider, { CreateOcContext } from "../contexts/createOcContext";


type ProviderSelector = {
  OC: OrdenDeCompra
  setOCInfo: React.Dispatch<React.SetStateAction<PricaOC>>
  ocInfo: PricaOC
}

function OCEditorTable(){
  const {setOCInfo, ocInfo, changeDate, OC, deleteItem, observation, createOC} = useContext(CreateOcContext);
  const changeAmount =  (evt: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    OC.ocData.items[itemIndex].amount = parseFloat(evt.target.value);
    setOCInfo(OC.stateCopy)
  }

  const table = () => {
    
    if(ocInfo.items.length === 0){
      return <tr><td colSpan={5}><h4 className="colorWarning">Añada elementos desde el panel de la derecha</h4></td></tr>
    }

    return(ocInfo.items.map((item, index)=>{
      return(
        <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.name}</td>
      <td><input type="text" className="observation" onChange={(evt)=>changeAmount(evt, index)} value={item.amount}/></td>
      <td>-----</td>
      <td>
        <div className="lastCell">
          <div className="totalSum">
            ------
          </div>
          <div className="deleteItem" onClick={()=>deleteItem(item.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>
          </div>
        </div>
      </td>
    </tr>
      )
    }))
  }
  
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title
        title="Orden de compra"
        description=""
      />
      {/* OC TABLE */}
      <Grid
        def={1}
        gap={12}
        lg={3}
        md={3}
        sm={3}
      >
        <table className="ocTable">
          <thead className="logoHeadTable">
            <tr>
              <td colSpan={4}>
                <img
                  src={PRC_LOGO}
                  alt="PRICA SAS"
                />
              </td>
              <td className="ocTitle">ORDEN DE COMPRA</td>
            </tr>
          </thead>
          <thead className="ocProvider">
            <tr>
              <td className="primary_background borderGray">Razón social</td>
              <td
                colSpan={2}
                className="borderGray"
              >
                <ProviderSelector OC={OC} setOCInfo={setOCInfo} ocInfo={ocInfo}/>
              </td>
              <td></td>
              <td className="primary_background borderGray">Fecha</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">NIT</td>
              <td
                colSpan={2}
                className="borderGray"
              >
                {ocInfo.provider.nit}
              </td>
              <td></td>
              <td className="borderGray">
                <input type="date" name="ocDate" id="ocDate" className="ocDateInput" value={ocInfo.date} onChange={changeDate}/>
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Dirección</td>
              <td
                colSpan={2}
                className="borderGray"
              >
                {ocInfo.provider.address}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Ciudad</td>
              <td
                colSpan={2}
                className="borderGray"
              >
                {ocInfo.provider.city}
              </td>
              <td></td>
              <td className="primary_background borderGray">
                Orden de compra No.
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Contacto</td>
              <td
                colSpan={2}
                className="borderGray"
              >
                {ocInfo.provider.contact}
              </td>
              <td></td>
              <td className="borderGray"><OCCOunter/></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">
                Número de contacto
              </td>
              <td
                colSpan={2}
                className="borderGray"
              >
                {ocInfo.provider.contactNumber}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">
                Correo electrónico
              </td>
              <td
                colSpan={2}
                className="borderGray"
              >
                {ocInfo.provider.email}
              </td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <thead>
          <tr>
            <td colSpan={5}>FACTURAR A</td>
          </tr>
          </thead>
          <thead>
            <tr>
              <td className="primary_background borderGray">Razón social</td>
              <td
                colSpan={4}
                className="borderGray"
              >
                PROYECTOS DE INGENIERÍA-CONSULTORÍA Y ASESORÍA SAS - PRICA SAS
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">NIT</td>
              <td
                colSpan={4}
                className="borderGray"
              >
                901.340.603-8
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Dirección</td>
              <td
                colSpan={4}
                className="borderGray"
              >
                C EMP PONTEVEDRA EDIFICIO VARDI CL 98 70 91 OF 410
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Ciudad</td>
              <td
                colSpan={4}
                className="borderGray"
              >
                Bogotá
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Contacto</td>
              <td
                colSpan={4}
                className="borderGray"
              >
                Diego Pinto
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">
                Número de contacto
              </td>
              <td
                colSpan={4}
                className="borderGray"
              >
                3143073552
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">
                Correo electrónico
              </td>
              <td
                colSpan={4}
                className="borderGray"
              >
                facturacion@pricasas.com
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
              <th>{ocInfo.deliverMethod}</th>
              <th>{ocInfo.deliverConditions}</th>
              <th>{ocInfo.deliverAddress}</th>
              <th>{ocInfo.paymentMethod}</th>
              <th>{ocInfo.deliverDate}</th>
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
            {table()}
          </tbody>
          <tfoot>
            <tr>
              <td className="primary_background borderGray">Observaciones</td>
              <td
                colSpan={4}
                className="borderGray"
              >
                <input type="text" className="observation" onChange={observation} value={ocInfo.observation}/>
              </td>
            </tr>
          </tfoot>
        </table>
        <button className="mediumBottom" onClick={createOC}>Crear Orden</button>
      </Grid>
      <LeftPanel/>
      <BottomStart />
    </Layout>
  );
}

export default function OCEditor() {
  return(
    <CreateOcProvider>
      <OCEditorTable/>
    </CreateOcProvider>
  )
}

function LeftPanel() {
  const {OC, setOCInfo, rqId} = useContext(CreateOcContext);

  const [isRevealed, setIsRevealed] = useState(false);
  const {loading, error, data} = useQuery(GET_RQ_BY_ID, {variables: {rqId}})

  if(loading){
    return <div>Loading data...</div>
  }
  if(error){
    return <div>Ha ocurrido un error</div>
  }
  if(data){
    const rq = data.getRqById as RQFromQuery;
    const addElement = (item: RQItemsFromQuery) => {
      let confirmAdd = true;
      if(item.authorizedAmount <= (item.material?.amount ?? 0)){
        confirmAdd = confirm("¿Estás seguro que deseas añadir un elemento cuyas existencias superan a la cantidad solicitada?")
      }
      if(confirmAdd){
        OC.addItem(item)
        setOCInfo(OC.stateCopy)
      }
    }
    return (
      <div className={`leftPanel ${isRevealed ? "" : "hideMenu"}`}>
        <div
          className="revealButton"
          onClick={() => setIsRevealed(!isRevealed)}
        >
          <span className="revealIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </span>
        </div>
        <div className="panelLogo">
          <div className="logo">
            <img src={PRICA_LOGO}alt="PRICA SAS" />
          </div>
          <div className="pricaName">
            <p id="name">PRICA SAS</p>
            <p id="extended">PROYECTOS DE INGENIERÍA, CONSULTORÍA Y ASESORÍA</p>
          </div>
        </div>
        <div className="panelBody">
        <h5 className="txtWhite">RQ: {rq.rq}</h5>
        <h5 className="txtWhite">Proyecto: {rq.project.name}</h5>
        <h5 className="txtWhite">Fecha: {rq.date}</h5>
        <table className="rqOcTable">
          <thead>
            <tr>
              <td>Material</td>
              <td>Cantidad</td>
              <td>Existencias</td>
              <td>Añadir</td>
            </tr>
          </thead>
          <tbody>
            
            {rq.rqItems.map((item, index)=>{
              return (
                <tr className="elementCell" key={index}>
                <td>{item.material?.name}</td>
                <td>{item.authorizedAmount}</td>
                <td>{item.material?.amount}</td>
                <td onClick={()=>{addElement(item)}}>
                <div  className="addElement">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
                </div>
                </td>
                </tr>
              )
            })}
            
          </tbody>
        </table>
        </div>
      </div>
    );
  }
  return <div>No se ha podido cagar la RQ relacionada a esta orden</div>
}

function ProviderSelector({OC, setOCInfo, ocInfo}: ProviderSelector){
  const {loading, error, data}= useQuery(GET_PROVIDERS);

  if(loading){
    return(
      <select name="provider" id="provider" className="ocSelect">
          <option value="SIN_DEFINIR">Cargando proveedores...</option>
      </select>
    )
  }
  if(error){
    return(
      <select name="provider" id="provider" className="ocSelect">
          <option value="SIN_DEFINIR">No se ha podido cargar la información</option>
      </select>
    )
  }
  if(data){
    const onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const value = evt.target.value;
      OC.provider({providerList: data.getProviders, providerId: value});
      setOCInfo(OC.stateCopy)
    }

    return(
      <select name="provider" id="provider" className="ocSelect" onChange={onChange} value={ocInfo.provider._id}>
        <option value="SIN_DIFINIR">Seleccione un proveedor...</option>
          {data.getProviders.map((provider: PricaProvider)=>{
            return <option value={provider._id} key={provider._id}>{provider.name}</option>
          })}
      </select>
    )
  }

  return (
    <select name="provider" id="provider" className="ocSelect">
          <option value="SIN_DEFINIR">Error cargando proveedores</option>
      </select>
  )
}

function OCCOunter() {
  const {loading, error, data}= useQuery(GET_COUNTER);
  const {OC} = useContext(CreateOcContext)
  if(loading){
    return <>{"Cargando..."}</>
  }
  if(error){
    return <>{"Error"}</>
  }
  if(data){
    OC.ocData.ocNumber = parseInt(data.getOcCount.counter)
    return <>{data.getOcCount.counter}</>
  }
  return <>Cargando...</>
}