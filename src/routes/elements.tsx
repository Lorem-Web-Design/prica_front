import { useQuery } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ElementFromQuery } from "../@types/elementTypes";
import { excelSource } from "../api/datasources";
import { GET_ELEMENTS } from "../api/myQueries";
import BottomStart from "../components/bottomStart";
import RemisionCreator from "../components/forms/remisionForm";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Modal from "../components/modal";
import NewElementCard from "../components/newElemementCard";
import Pagination from "../components/pagination";
import Title from "../components/title";
import AS_QUERY_ELEMENT from "../data/mock.element.json";
import FILTROS from "../settings/filters.json";
import ElementControll from "../utils/elements.controll";
import useUser from "../customHooks/users/useUser";

const Element = new ElementControll([AS_QUERY_ELEMENT] as ElementFromQuery[]);

export default function Elementos() {
  const { loading, error, data } = useQuery(GET_ELEMENTS);
  const {role} = useUser();
  const navigate = useNavigate();
  const [elementLoaded, setElementsLoaded] = useState<ElementFromQuery[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  let allowedToCreate = ["admin", "compras", "dir_proyectos", "gerente"]

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
        <RemisionCreator type="ELEMENTS"/>
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
              className={`mediumBottom ${selectedCategory === categoria.slug ? "active" : ""} ${categoria.slug === "Todos" ? "hide" : ""}`}
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
        <Link className={`bigButton ${allowedToCreate.includes(role) ? '':"hide"}`} to={"/create/element"}>
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
