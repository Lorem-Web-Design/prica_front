import {
  ApolloCache,
  ApolloError,
  useMutation,
  useQuery,
} from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APPROVE_RQ, UPDATE_RQ_BY_ID } from "../api/myMutations";
import { GET_RQ_BY_ID } from "../api/myQueries";
import PRC_LOGO from "../assets/images/prica_full_color_logo.png";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import Toast from "../components/toast";
import { CreateElementContext } from "../contexts/createElementContext";
import NotiProvider, { NotiContext } from "../contexts/notiContext";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import RQ_MOCK from "../data/mock.rq.json";
import RQControll from "../utils/rq.controll";
import { ROLES } from "../../enums";
import { Link } from "react-router-dom";

const rqControll = new RQControll(RQ_MOCK);

export default function RQViewer() {
  const { rqId } = useParams();
  const [rqInfo, setRqInfo] = useState(rqControll.stateCopy);
  const { loading, error, data } = useQuery(GET_RQ_BY_ID, {
    variables: { rqId: rqId },
  });

  useEffect(() => {
    if (data) {
      rqControll.rq = JSON.parse(JSON.stringify(data.getRqById));
      setRqInfo(rqControll.stateCopy);
    }
  }, [data]);

  return (
    <NotiProvider>
      <Layout>
        {/* Titulo de la página actual */}
        <Title
          title="Requisición"
          description="Crea la requisición para nuevos elementos:"
        />
        <div className="pt_def_48"></div>
        {/* Barra de meníu inferior - shortcuts */}
        <Grid
          gap={12}
          sm={2}
          md={2}
          lg={2}
          def={9}
          className="rqContainer rqBorder"
        >
          <div className="col_span_def_2 rqLogoContainer">
            <div className="reqLogo">
              <img src={PRC_LOGO} alt="PRICA SAS" />
            </div>
          </div>
          <div className="col_span_def_5 rqFlexYCentered">
            <div className="reqTitles">
              <p className="rqCenteredText">PROCESO DE COMPRAS</p>
              <p className="rqCenteredText">
                FORMATO REQUISICION DE MATERIALES Y HERRAMIENTAS
              </p>
              <p className="rqCenteredText">PARTE OPERATIVA</p>
            </div>
          </div>
          <div className="rqFlexYCentered">
            <div className="rqCustom">
              <p>FECHA</p>
              <p>CÓDIGO</p>
              <p>VERSIÓN</p>
            </div>
          </div>
          <div className="rqFlexYCentered">
            <div className="rqCustomProps">
              <p>30/08/2024</p>
              <p>0001</p>
              <p>1</p>
            </div>
          </div>
        </Grid>
        <div className="pt_def_16"></div>
        <Grid
          gap={12}
          sm={2}
          md={2}
          lg={2}
          def={9}
          className="rqInfoContainer rqBorder"
        >
          <div className="col_span_def_2">
            <p>Fecha</p>
            <p>Proyecto</p>
          </div>
          <div className="col_span_def_3">
            <p>{rqInfo.date}</p>
            <p>{rqInfo.project.name}</p>
          </div>
          <div className="col_span_def_2">
            <p>No. Solicitud</p>
            <p>Capitulo PPTO</p>
          </div>
          <div className="col_span_def_2">
            <p>{rqInfo.rq}</p>
            <p>{rqInfo.ppto}</p>
          </div>
        </Grid>
        <div className="pt_def_16"></div>
        <Grid gap={12} sm={2} md={2} lg={2} def={1} className="rqInfoContainer">
          <table className="rqTable">
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Unidad</th>
                <th>Cantidad solicitada</th>
                <th>Cantidad Autorizada</th>
                <th>Cantidad recibida en obra</th>
                <th>Cantidad pendientes</th>
                <th>Observaciones</th>
              </tr>
              <RQItems
                rqControll={rqControll}
                rqInfo={rqInfo}
                setRqInfo={setRqInfo}
                loading={loading}
                error={error}
              />
            </thead>
          </table>
        </Grid>
        <div className="pt_def_16"></div>
        <Grid
          gap={12}
          sm={2}
          md={2}
          lg={2}
          def={4}
          className="rqInfoContainer rqBorder"
        >
          <div>
            <p>SOLICITANTE</p>
          </div>
          <div>
            <p>{rqInfo.petitioner.name}</p>
          </div>
          <div>
            <p>CARGO</p>
          </div>
          <div>
            <p>GERENTE</p>
          </div>
        </Grid>
        <div className="pt_def_16"></div>
        <Grid gap={12} sm={2} md={2} lg={2} def={4} className="rqInfoContainer">
          <ApproveRQButton
            rqId={rqId || ""}
            approvedStatus={rqInfo.isApproved}
            haveOC={rqInfo.haveOC}
            rqControll={rqControll}
          />
          <CreateOCButton approvedStatus={rqInfo.isApproved} rqId={rqId || ""} haveOc={rqInfo.haveOC}/>
        </Grid>
        <BottomStart />
      </Layout>
    </NotiProvider>
  );
}

type RQITemsTypes = {
  rqControll: RQControll
  loading: boolean;
  rqInfo:RQFromQuery, 
  setRqInfo: React.Dispatch<React.SetStateAction<RQFromQuery>>,
  error: ApolloError | undefined;
};

function RQItems({ rqControll, error, loading, rqInfo, setRqInfo }: RQITemsTypes) {
  const {setToastProps, toastProps, toast, setToast} = useContext(NotiContext)
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const materialId = evt.target.name;
    const amount = parseFloat(evt.target.value);
    rqControll.editAmount({materialId, amount});
    setRqInfo(rqControll.stateCopy)
    }
    
  useEffect(() => {
    if(rqControll.rq.haveOC && rqControll.rq.isApproved){
      setToast(true);
      setToastProps({
        title: "Información",
        body: "Esta RQ ya ha sido aprobada y posee una Orden de Compra en curso",
        theme: "success_theme",
        footer: "INFO",
      })
    }
  }, [loading]);

  if (rqInfo.rqItems.length === 0) {
    return (
      <tr>
        <td colSpan={9}>Empieza agregando items</td>
      </tr>
    );
  }
  if (loading) {
    return <div className="loading"></div>;
  }
  if (error) {
    <div className="error">Ha ocurrido un error cargando la información</div>;
  }

  return (
    <>
    <Toast
          body={toastProps.body}
          isActive={toast}
          setToast={setToast}
          theme={toastProps.theme}
          title={toastProps.title}
          footer={toastProps.footer}
        />
      {rqInfo.rqItems.map((item, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td style={{textTransform: "uppercase"}}>{item.material?.type || "---"}</td>
            <td>{item.material?.name || "MATERIAL ELIMINADO"}</td>
            <td>{item.material?.unit || "---"}</td>
            <td>{item.requiredAmount}</td>
            <td><input type="text" className="observation" name={item.materialId} value={item.authorizedAmount} onChange={handleChange} disabled={rqInfo.haveOC ? true : false}/></td>
            <td>{item.receivedAmount}</td>
            <td>{item.pendingAmount}</td>
            <td>{item.observation}</td>
          </tr>
        );
      })}
    </>
  );
}

type ApproveRQButton = {
  rqId: string;
  approvedStatus: boolean;
  haveOC: boolean;
  rqControll: RQControll
};

function ApproveRQButton({ rqId, approvedStatus, haveOC, rqControll }: ApproveRQButton) {
  const { user } = useAuth();
  const [apprState, setApprState] = useState(`${approvedStatus}`);
  const { setToast, toast, toastProps, setToastProps } =
    useContext(NotiContext);
  const [updateRQ, { loading, error, data }] = useMutation(UPDATE_RQ_BY_ID, {
    update(cache, { data }) {
      /*@ts-ignore */
      const { getRqById } = cache.readQuery<ApolloCache<RQControllTypes>>({
        query: GET_RQ_BY_ID,
        variables: { rqId },
      });
      cache.writeQuery({
        query: GET_RQ_BY_ID,
        variables: { rqId },
        data: {
          getRqById: {
            ...getRqById,
            isApproved: !getRqById.isApproved,
          },
        },
      });
    },
  });

  let isVisible =
    user.role === ROLES["DIRECTOR_PROYECTOS"] ||
    user.role === ROLES["ADMINISTRADOR"]


  const approveRq = async (appr: string) => {
    await setApprState(appr);
    rqControll.rq.isApproved = true;
    updateRQ({
      variables: { info: rqControll.rqToAPI, rqId: rqId }
    });
  };

  useEffect(() => {
    if (data) {
      setToast(true);
      setToastProps({
        title: "Aprobando RQ",
        body: "Las acciones realizadas han sido guardadas exitosamente",
        theme: "primary_theme",
        footer: "SUCCESS",
      });
    }
    if (loading) {
      setToast(true);
      setToastProps({
        title: "Aprobando RQ...",
        body: "La RQ está siendo aprobada",
        theme: "primary_theme",
        footer: "SUCCESS",
      });
    }
    if (error) {
      console.log(error.message);
      setToast(true);
      setToastProps({
        title: "Error aprobando RQ...",
        body: `${error.message}`,
        theme: "error_theme",
        footer: `${error.cause}`,
      });
    }
  }, [data, loading, error]);

  if (approvedStatus) {
    return (
      <>
        <Toast
          body={toastProps.body}
          isActive={toast}
          setToast={setToast}
          theme={toastProps.theme}
          title={toastProps.title}
          footer={toastProps.footer}
        />
        <div className={`${isVisible && !haveOC ? "" : "hide"}`}>
          <button
            className={`smallButton error_theme`}
            onClick={() => approveRq("false")}
          >
            Rechazar RQ
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast
        body={toastProps.body}
        isActive={toast}
        setToast={setToast}
        theme={toastProps.theme}
        title={toastProps.title}
        footer={toastProps.footer}
      />
      <div className={`${isVisible ? "" : "hide"}`} style={{ width: "100%" }}>
        <button
          className={`smallButton successTheme`}
          onClick={() => approveRq("true")}
        >
          Aprobar
        </button>
      </div>
    </>
  );
}

type CreateOCButton = {
  approvedStatus: boolean;
  rqId: string
  haveOc: boolean
}

function CreateOCButton({approvedStatus, rqId, haveOc}: CreateOCButton) {
  const { user } = useAuth();
  let isVisible =
    (user.role === ROLES["COMPRAS"] || user.role === ROLES["ADMINISTRADOR"]) && approvedStatus;
  return (
      <Link to={`/oc/editor/rq/${rqId}`}  className={`${isVisible ? "" : "hide"} smallButton pricaTheme defaultButton`}>
      Crear OC
    </Link>
    
  );
}
