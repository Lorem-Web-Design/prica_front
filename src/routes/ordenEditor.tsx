import { useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { ProviderFromQuery } from "../@types/providerTypes";
import { GET_COUNTER, GET_PROVIDERS, GET_RQ_BY_ID } from "../api/myQueries";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import PRICA_LOGO from "../assets/images/prica_logo.png";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import CreateOcProvider, { CreateOcContext } from "../contexts/createOcContext";
import OrdenDeCompra from "../utils/oc.controll";
import OC_DELIVERY_INFO from "../data/ocDeliverInfo.json";
import SelectFromArray from "../components/selectFromArray";
import { OCFromQuery } from "../@types/oc.types";
import WorkerSelectBox from "../components/workerSelectBox";
import Modal from "../components/modal";
import InputBox from "../components/inputElement";
import ElementEditor from "../utils/elementEditor.controll";

type ProviderSelector = {
  OC: OrdenDeCompra;
  setOCInfo: React.Dispatch<React.SetStateAction<OCFromQuery>>;
  ocInfo: OCFromQuery;
};

function OCEditorTable() {
  const { setOCInfo, ocInfo, changeDate, OC, deleteItem, observation, createOC, rqInfo } = useContext(CreateOcContext);

  const [modal, setModal] = useState(false);

  const changeAmount = (evt: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    OC.ocData.items[itemIndex].amount = parseFloat(evt.target.value);
    setOCInfo(OC.stateCopy);
  };

  const changeUnitaryPrice = (evt: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
    OC.ocData.items[itemIndex].unitaryPrice = parseFloat(evt.target.value);
    setOCInfo(OC.stateCopy);
  };

  const changeTaker = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    OC.ocData.taker !== undefined ? (OC.ocData.taker._id = evt.target.value) : "";
    setOCInfo(OC.stateCopy);
  };

  const table = () => {
    if (ocInfo.items.length === 0) {
      return (
        <tr>
          <td colSpan={5}>
            <h4 className="colorWarning">Añada elementos desde el panel de la derecha</h4>
          </td>
        </tr>
      );
    }

    return ocInfo.items.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>
            <input disabled={false} type="text" className="observation" onChange={(evt) => changeAmount(evt, index)} value={item.amount} />
          </td>
          <td>
            <input type="text" className="observation" onChange={(evt) => changeUnitaryPrice(evt, index)} value={item.unitaryPrice} />
          </td>
          <td>
            <div className="lastCell">
              <div className="totalSum">{item.totalPrice}</div>
              <div className="deleteItem" onClick={() => deleteItem(item.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                </svg>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Orden de compra" description="" />
      <Modal modal={modal} setModal={setModal}>
        <InputBox
          onChange={(evt)=>{
            OC.ocData.discount = OC.ocData.discount ?? { name: "", value: 0 };
            OC.ocData.discount.name = evt.target.value;
            setOCInfo(OC.stateCopy);
          }}
          inputName="discountName"
          labelTag="Nombre descuento"
          isEmpty={false}
          value={`${ocInfo.discount?.name}`}
          type="text"
        />
        <InputBox
          onChange={(evt)=>{
            OC.ocData.discount = OC.ocData.discount ?? { name: "", value: 0 };
            OC.ocData.discount.value = parseFloat(evt.target.value);
            setOCInfo(OC.stateCopy);

          }}
          inputName="discountValue"
          labelTag="Valor del descuento"
          isEmpty={false}
          value={`${ocInfo.discount?.value}`}
          type="number"
        />
        <button onClick={()=>{setModal(false)}} className="pointer primary_theme defaultButton">Guardar</button>
      </Modal>
      {/* OC TABLE */}
      <Grid def={1} gap={12} lg={1} md={1} sm={1}>
        <table className="ocTable">
          <thead className="logoHeadTable">
            <tr>
              <td colSpan={4}>
                <img src={PRC_LOGO} alt="PRICA SAS" />
              </td>
              <td className="ocTitle">ORDEN DE COMPRA</td>
            </tr>
          </thead>
          <thead className="ocProvider">
            <tr>
              <td className="primary_background borderGray">Razón social</td>
              <td colSpan={2} className="borderGray">
                <ProviderSelector OC={OC} setOCInfo={setOCInfo} ocInfo={ocInfo} />
              </td>
              <td></td>
              <td className="primary_background borderGray">Fecha</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">NIT</td>
              <td colSpan={2} className="borderGray">
                {ocInfo.provider.nit}
              </td>
              <td></td>
              <td className="borderGray">
                <input type="date" name="ocDate" id="ocDate" className="ocDateInput" value={ocInfo.date} onChange={changeDate} disabled />
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Dirección</td>
              <td colSpan={2} className="borderGray">
                {ocInfo.provider.address}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Ciudad</td>
              <td colSpan={2} className="borderGray">
                {ocInfo.provider.city}
              </td>
              <td></td>
              <td className="primary_background borderGray">Orden de compra No.</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Contacto</td>
              <td colSpan={2} className="borderGray">
                {ocInfo.provider.contact}
              </td>
              <td></td>
              <td className="borderGray">
                <OCCOunter />
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Número de contacto</td>
              <td colSpan={2} className="borderGray">
                {ocInfo.provider.contactNumber}
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Correo electrónico</td>
              <td colSpan={2} className="borderGray">
                {ocInfo.provider.email}
              </td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <thead>
            <tr>
              <td colSpan={5} style={{ fontWeight: "bold" }}>
                FACTURAR A
              </td>
            </tr>
          </thead>
          <thead>
            <tr>
              <td className="primary_background borderGray">Razón social</td>
              <td colSpan={4} className="borderGray">
                PROYECTOS DE INGENIERÍA-CONSULTORÍA Y ASESORÍA SAS - PRICA SAS
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">NIT</td>
              <td colSpan={4} className="borderGray">
                901.340.603-8
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Dirección</td>
              <td colSpan={4} className="borderGray">
                C EMP PONTEVEDRA EDIFICIO VARDI CL 98 70 91 OF 410
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Ciudad</td>
              <td colSpan={4} className="borderGray">
                Bogotá
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Contacto</td>
              <td colSpan={4} className="borderGray">
                Diego Pinto
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Número de contacto</td>
              <td colSpan={4} className="borderGray">
                3143073552
              </td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Correo electrónico</td>
              <td colSpan={4} className="borderGray">
                facturacion@pricasas.com
              </td>
            </tr>
            <tr>
              <td colSpan={5} className="projectName">
                PRC {rqInfo.ppto} - {rqInfo.rq}
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
              <th>
                <SelectFromArray
                  action={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                    OC.ocData.deliverMethod = evt.target.value;
                    setOCInfo(OC.stateCopy);
                  }}
                  info={OC_DELIVERY_INFO.deliveryMethods}
                  undefined="Seleccione un método de envío"
                />
              </th>
              <th>
                <SelectFromArray
                  action={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                    OC.ocData.deliverConditions = evt.target.value;
                    setOCInfo(OC.stateCopy);
                  }}
                  info={OC_DELIVERY_INFO.deliveryConditions}
                  undefined="Seleccione condiciones de envío"
                />
              </th>
              <th>
                <input
                  type="text"
                  className="observation"
                  onChange={(evt) => {
                    OC.ocData.deliverAddress = evt.target.value;
                    setOCInfo(OC.stateCopy);
                  }}
                  value={ocInfo.deliverAddress}
                  placeholder="Ingrese dirección"
                />
              </th>
              <th>
                <SelectFromArray
                  action={(evt: React.ChangeEvent<HTMLSelectElement>) => {
                    OC.ocData.paymentMethod = evt.target.value;
                    setOCInfo(OC.stateCopy);
                  }}
                  info={OC_DELIVERY_INFO.paymentMethod}
                  undefined="Seleccione condiciones de envío"
                />
              </th>
              <th>
                <input
                  type="date"
                  name="deliverDate"
                  id="deliverDate"
                  className="ocDateInput"
                  value={ocInfo.deliverDate}
                  onChange={(evt) => {
                    OC.ocData.deliverDate = evt.target.value;
                    setOCInfo(OC.stateCopy);
                  }}
                />
              </th>
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
          <tbody>
            <tr>
              <td colSpan={5}></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="primary_background borderGray">Solicitado por</td>
              <td colSpan={2} className="borderGray">
                <input type="text" className="observation" onChange={observation} value={rqInfo.petitioner.name} disabled />
              </td>
              <td className="txtBold txtBlue">Subtotal</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(OC.Subtotal)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Proyecto</td>
              <td colSpan={2} className="borderGray">
                <input type="text" className="observation" onChange={observation} value={ocInfo.projectName} disabled />
              </td>
              <td className="txtBold txtBlue">IVA (19%)</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(OC.IVA)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Cotización No.</td>
              <td colSpan={2} className="borderGray">
                <input
                  type="text"
                  className="observation"
                  onChange={(evt) => {
                    OC.ocData.request = evt.target.value;
                    setOCInfo(OC.stateCopy);
                  }}
                  value={ocInfo.request}
                />
              </td>
              <td className="txtBold txtBlue">{ocInfo.discount?.name}</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(ocInfo.discount?.value ?? 0)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Recibe</td>
              <td colSpan={2} className="borderGray ocTaker">
                <WorkerSelectBox
                  defaultOption={{ label: "Seleccione trabajador", value: "" }}
                  isEmpty={false}
                  label=""
                  name="taker"
                  onChange={changeTaker}
                  value={ocInfo.taker?._id}
                />
              </td>
              <td className="txtBold txtBlue">Total</td>
              <td className="txtBold">{OrdenDeCompra.toCurrency(OC.Total)}</td>
            </tr>
            <tr>
              <td className="primary_background borderGray">Observaciones</td>
              <td colSpan={2} className="borderGray">
                <input type="text" className="observation" onChange={observation} value={ocInfo.observation} />
              </td>
              <td colSpan={2}>
                {" "}
                <button
                  className="pointer primary_theme defaultButton"
                  onClick={() => {
                    setModal(true);
                  }}
                >
                  Añadir descuentos
                </button>{" "}
              </td>
            </tr>
          </tfoot>
        </table>
        <button className="mediumBottom" onClick={createOC}>
          Crear Orden
        </button>
      </Grid>
      <LeftPanel />
      <BottomStart />
    </Layout>
  );
}

export default function OCEditor() {
  return (
    <CreateOcProvider>
      <OCEditorTable />
    </CreateOcProvider>
  );
}

function LeftPanel() {
  const { OC, setOCInfo, rqId } = useContext(CreateOcContext);

  const [isRevealed, setIsRevealed] = useState(false);
  const { loading, error, data } = useQuery(GET_RQ_BY_ID, { variables: { rqId } });

  if (loading) {
    return <div>Loading data...</div>;
  }
  if (error) {
    return <div>Ha ocurrido un error</div>;
  }
  if (data) {
    const rq = data.getRqById as RQFromQuery;
    OC.info.project = rq.project._id;
    OC.info.projectName = rq.project.name;
    const addElement = (item: RQItemsFromQuery) => {
      let confirmAdd = true;
      if (item.pendingAmount <= (ElementEditor.stockCounter(item.material?.stock) ?? 0)) {
        confirmAdd = confirm("¿Estás seguro que deseas añadir un elemento cuyas existencias superan a la cantidad solicitada?");
      }
      if (confirmAdd) {
        OC.addItem(item);
        setOCInfo(OC.stateCopy);
      }
    };
    return (
      <div className={`leftPanel ${isRevealed ? "" : "hideMenu"}`}>
        <div className="revealButton" onClick={() => setIsRevealed(!isRevealed)}>
          <span className="revealIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
            </svg>
          </span>
        </div>
        <div className="panelLogo">
          <div className="logo">
            <img src={PRICA_LOGO} alt="PRICA SAS" />
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
            
              {rq.rqItems.map((item, index) => {
                let itemName = item.material?.name;
                let amount = item.material?.amount;
                if (item.material) {
                  let currentClassification = item.material.classification.find((element) => element.id === item.classificationId);
                  itemName = `${item.material.name} (${currentClassification?.name})`;
                  amount = ElementEditor.stockCounter(item.material.stock);
                }
                return (
                  <tr className="elementCell" key={index}>
                    <td>{itemName}</td>
                    <td>{item.pendingAmount}</td>
                    <td>{amount}</td>
                    <td
                      onClick={() => {
                        addElement(item);
                      }}
                    >
                      <div className="addElement">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return <div>No se ha podido cagar la RQ relacionada a esta orden</div>;
}

function ProviderSelector({ OC, setOCInfo, ocInfo }: ProviderSelector) {
  const { loading, error, data } = useQuery(GET_PROVIDERS);

  if (loading) {
    return (
      <select name="provider" id="provider" className="ocSelect">
        <option value="SIN_DEFINIR">Cargando proveedores...</option>
      </select>
    );
  }
  if (error) {
    return (
      <select name="provider" id="provider" className="ocSelect">
        <option value="SIN_DEFINIR">No se ha podido cargar la información</option>
      </select>
    );
  }
  if (data) {
    const onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const value = evt.target.value;
      OC.provider({ providerList: data.getProviders, providerId: value });
      setOCInfo(OC.stateCopy);
    };

    return (
      <select name="provider" id="provider" className="ocSelect" onChange={onChange} value={ocInfo.provider._id}>
        <option value="SIN_DIFINIR">Seleccione un proveedor...</option>
        {data.getProviders.map((provider: ProviderFromQuery) => {
          return (
            <option value={provider._id} key={provider._id}>
              {provider.name}
            </option>
          );
        })}
      </select>
    );
  }

  return (
    <select name="provider" id="provider" className="ocSelect">
      <option value="SIN_DEFINIR">Error cargando proveedores</option>
    </select>
  );
}

function OCCOunter() {
  const { loading, error, data } = useQuery(GET_COUNTER);
  const { OC } = useContext(CreateOcContext);
  if (loading) {
    return <>{"Cargando..."}</>;
  }
  if (error) {
    return <>{"Error"}</>;
  }
  if (data) {
    OC.ocData.ocNumber = parseInt(data.getOcCount.oc);
    return <>{data.getOcCount.oc}</>;
  }
  return <>Cargando...</>;
}