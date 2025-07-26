import { useMutation, useQuery } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ElementFromQuery } from "../@types/elementTypes";
import { excelSource } from "../api/datasources";
import { CREATE_REMISION } from "../api/myMutations";
import { GET_ELEMENTS, GET_REMISIONS } from "../api/myQueries";
import BodegaSelectBox from "../components/bodegaSelectBox";
import BottomStart from "../components/bottomStart";
import ElementCard from "../components/elementCard";
import ElementSelectBox from "../components/elementSelectBox";
import Grid from "../components/grid";
import InputBox from "../components/inputElement";
import Layout from "../components/layout";
import Modal from "../components/modal";
import Pagination from "../components/pagination";
import Title from "../components/title";
import Toast from "../components/toast";
import WorkerSelectBox from "../components/workerSelectBox";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import AS_QUERY_ELEMENT from "../data/mock.element.json";
import REMISION_FROM_QUERY from "../data/mock.multipleRemisionFromQuery.json";
import FILTROS from "../settings/filters.json";
import ElementControll from "../utils/elements.controll";
import Remision from "../utils/remision.controller";
import NewElementCard from "../components/newElemementCard";

const Element = new ElementControll([AS_QUERY_ELEMENT] as ElementFromQuery[]);

export default function Elementos() {
  const { loading, error, data } = useQuery(GET_ELEMENTS);
  const navigate = useNavigate();
  const [elementLoaded, setElementsLoaded] = useState<ElementFromQuery[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  //Modal de remisiones
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (data) {
      Element.elements = JSON.parse(JSON.stringify(data.getElements));
      setElementsLoaded(Element.elements);
    }
  }, [data, loading, error]);

  const handleSearch = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (elementLoaded) {
      const searchUrl = `/elementos?searchString=${searchString}&cat=${selectedCategory}`;
      navigate(searchUrl, { replace: true });
      const search = [...Element.searchByUrl(searchUrl)];
      setElementsLoaded(search);
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearchString(value);
  };

  useEffect(() => {
    if (data) {
      const searchUrl = window.location.hash.substring(1);
      const search = Element.searchByUrl(searchUrl);
      const urlParams = new URLSearchParams(searchUrl.split("?")[1]);
      const searchString = urlParams.get("searchString") || "";
      const cat = urlParams.get("cat") || "";
      setSelectedCategory(cat);
      setSearchString(searchString);
      setElementsLoaded(search);
    }
  }, [data]);
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Elementos" description="Listado de elementos" />
      <div className="inventario">
        <a href={`${excelSource()}/inventario`} className="pointer primary_theme defaultButton" target="_blank">
          Descargar inventario
        </a>
      </div>
      <Modal modal={modal} setModal={setModal}>
        <RemisionCreator />
      </Modal>
      {/* Barra de meníu inferior - shortcuts */}
      <form className="search_container" onSubmit={handleSearch} action="/elementos">
        <input type="text" placeholder="Buscar elementos..." className="search" name="search" onChange={handleChange} value={searchString} />
        <button className="searchButton" type="submit">
          Buscar
        </button>
      </form>
      <div className="pt_def_12"></div>
      <Grid gap={12} sm={2} md={2} lg={12} def={1}>
        {FILTROS.categories.map((categoria) => {
          return (
            <div
              className={`mediumBottom ${selectedCategory === categoria.slug ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(categoria.slug);
              }}
              key={categoria.name}
            >
              {categoria.slug}
            </div>
          );
        })}
      </Grid>
      <div className="pt_def_12"></div>
      <Pagination itemsPerPage={24}>
        {elementLoaded.map((element) => {
          return <NewElementCard cardInfo={element} key={element._id} />;
        })}
      </Pagination>
      <div className="pt_def_12"></div>
      <Grid gap={12} sm={2} md={2} lg={2} def={1}>
        <Link className="bigButton" to={"/create/element"}>
          + Añadir elementos
        </Link>
        <button
          className="bigButton"
          onClick={() => {
            setModal(true);
          }}
        >
          Remisión
        </button>
      </Grid>
      <BottomStart />
    </Layout>
  );
}

function RemisionCreator() {
  const { user } = useAuth();
  const remision = new Remision(REMISION_FROM_QUERY);
  const [remisionInfo, setRemisionInfo] = useState(remision.stateCopy);
  const [currentElement, setCurrentElement] = useState({ name: "", _id: "" });
  const [amount, setAmount] = useState(0);
  const [saveRemision, { data, loading, error }] = useMutation(CREATE_REMISION, {
    refetchQueries: [{query: GET_REMISIONS}],
  });

  const handleAmount = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = evt.target.value;
    setAmount(parseFloat(value));
  };

  //Toast
  const [toast, setToast] = useState(false);
  const [toastProps, setToastProps] = useState({
    title: "Titulo del toast",
    body: "Cuerpo del toast",
    footer: "Footer del toast",
    theme: "primary_theme",
  });

  const addElement = () => {
    let newElement = {
      element: {
        name: currentElement.name,
        _id: currentElement._id,
        unit: "",
      },
      amount: amount,
    };
    setAmount(0);
    remision.data.elementsList.push(newElement);
    setRemisionInfo(remision.stateCopy);
  };

  const handleProjectRemitent = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //@ts-ignore
    const name = evt.target.options[evt.target.selectedIndex].text;
    const _id = evt.target.value;
    let project = {
      name,
      _id,
    };
    remision.data.remitentProject = project;
    setRemisionInfo(remision.stateCopy);
  };

  const handleProjectReceiver = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //@ts-ignore
    const name = evt.target.options[evt.target.selectedIndex].text;
    const _id = evt.target.value;
    let project = {
      name,
      _id,
    };
    remision.data.receiverProject = project;
    setRemisionInfo(remision.stateCopy);
  };

  const handleReceiver = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //@ts-ignore
    const name = evt.target.options[evt.target.selectedIndex].text;
    const _id = evt.target.value;
    let receiverInfo = {
      name,
      _id,
      occupation: "",
    };
    remision.data.receiver = receiverInfo;
    setRemisionInfo(remision.stateCopy);
  };

  const createRemision = () => {
    remision.data.date = `${new Date()}`;
    saveRemision({
      variables: {
        remisionData: remision.toApi,
      },
    });
  };

  const handleObservation = (evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    remision.data.observation = evt.target.value;
    setRemisionInfo(remision.stateCopy);
  };
  useEffect(() => {
    if (user) {
      remision.data.remitent = {
        _id: user.id,
        name: user.name,
        role: user.role,
      };
    }
  }, [user]);

  useEffect(() => {
    if (loading) {
      setToastProps({
        title: "Procesando remisión",
        body: "Se está procesando la remisión",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (data) {
      setToastProps({
        title: "Remisión",
        body: "Remisión creada exitosamente",
        footer: "Exito",
        theme: "primary_theme",
      });
      setToast(true);
    }
    if (error) {
      setToastProps({
        title: "Remisión",
        body: "Error creando remisión, verifique sus datos",
        footer: "Exito",
        theme: "error_theme",
      });
      setToast(true);
    }
  }, [loading, error, data]);

  return (
    <div>
      <Toast
        title={toastProps.title}
        body={toastProps.body}
        theme={toastProps.theme}
        footer={toastProps.footer}
        isActive={toast}
        setToast={setToast}
      />
      <Grid gap={12} sm={2} md={2} lg={2} def={1}>
        <div>
          {/* Remitente */}
          <InputBox
            inputName="remitent"
            isEmpty={false}
            labelTag="Nombre remitente"
            onChange={() => {}}
            value={remisionInfo.remitent.name}
            type="text"
            disabled={true}
          />
          <BodegaSelectBox
            defaultOption={{ label: "Sin seleccionar", value: "UNDEFINED" }}
            isEmpty={false}
            label="Proyecto"
            name="remitentProject"
            onChange={handleProjectRemitent}
            value={remisionInfo.remitentProject._id}
          />
        </div>
        <div>
          {/* Receiver */}
          <WorkerSelectBox
            defaultOption={{ label: "Sin seleccionar", value: "UNDEFINED" }}
            isEmpty={false}
            label="Remitido a"
            name="receiver"
            onChange={handleReceiver}
            value={remisionInfo.receiver._id}
          />
          <BodegaSelectBox
            defaultOption={{ label: "Sin seleccionar", value: "UNDEFINED" }}
            isEmpty={false}
            label="Proyecto"
            name="receiverProject"
            onChange={handleProjectReceiver}
            value={remisionInfo.receiverProject._id}
          />
        </div>
        <InputBox
          inputName="observation"
          isEmpty={false}
          labelTag="Observaciones"
          onChange={handleObservation}
          value={remision.data.observation}
          type="text"
          className="col_s2"
        />
      </Grid>
      <h2>Elementos a remitir</h2>
      <Grid gap={12} sm={3} md={3} lg={2} def={1}>
        <div>
          <ElementSelectBox setCurrentElement={setCurrentElement} isEmpty={false} label="Seleccione elementos" name="elements" value="0000" />
        </div>
        <Grid gap={12} sm={3} md={3} lg={3} def={1}>
          <div className="col_s2">
            <InputBox
              inputName="elementAmount"
              isEmpty={false}
              labelTag="Cantidad a remitir"
              onChange={handleAmount}
              value={`${amount}`}
              type="number"
            />
          </div>
          <div className="flex aic jcc">
            <button className="addElementButton" onClick={addElement}>
              Añadir
            </button>
          </div>
        </Grid>
      </Grid>
      <h2>Elementos en la Remisión</h2>
      <Grid gap={12} sm={3} md={3} lg={1} def={1}>
        <table>
          <thead>
            <tr>
              <td className="txtBold">Descripción</td>
              <td className="txtBold">Cantidad</td>
            </tr>
          </thead>
          <tbody>
            {remisionInfo.elementsList.length === 0 ? (
              <tr>
                <td colSpan={2}>Añade elementos</td>
              </tr>
            ) : (
              remisionInfo.elementsList.map((element) => {
                return (
                  <tr>
                    <td>{element.element.name}</td>
                    <td>{element.amount}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Grid>
      <div className="pt_def_12"></div>
      <Grid gap={12} sm={3} md={3} lg={1} def={1}>
        <button className="pointer primary_theme defaultButton" onClick={createRemision}>
          Crear remisión
        </button>
      </Grid>
    </div>
  );
}
