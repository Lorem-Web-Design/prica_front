import { useQuery } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET_ELEMENTS } from "../api/myQueries";
import BottomStart from "../components/bottomStart";
import ElementList from "../components/elementsList";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Title from "../components/title";
import ElementControll from "../utils/elements.controll";
import Paginator from "../components/paginator";
import FILTROS from "../settings/filters.json";
import AS_QUERY_ELEMENT from "../data/mock.element.json";
import { ElementFromQuery } from "../@types/elementTypes";

const Element = new ElementControll([AS_QUERY_ELEMENT] as ElementFromQuery[]);

export default function Elementos() {
  const { loading, error, data } = useQuery(GET_ELEMENTS);
  const [elementLoaded, setElementsLoaded] = useState<ElementFromQuery[][]>();
  const [searchString, setSearchString] = useState<string>("");
  const elementPerPage = 12;
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => {
    if (data) {
      Element.elements = JSON.parse(JSON.stringify(data.getElements));
      setElementsLoaded(Element.pagination({ elementsPerPage: elementPerPage, elementList: Element.elements }));
    }
  }, [data, loading, error]);

  const handleSearch = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (elementLoaded) {
      if (selectedCategory === "Todos") {
        const search = Element.search("name", searchString);
        setElementsLoaded(Element.pagination({ elementList: search, elementsPerPage: elementPerPage }));
      } else {
        const search = Element.searchByCategory(selectedCategory, searchString);
        setElementsLoaded(Element.pagination({ elementList: search, elementsPerPage: elementPerPage }));
      }
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearchString(value);
  };
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Elementos" description="Listado de elementos" />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <form className="search_container" onSubmit={handleSearch}>
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
            >
              {categoria.slug}
            </div>
          );
        })}
      </Grid>
      <div className="pt_def_12"></div>
      <Paginator list={elementLoaded} />
      <div className="pt_def_12"></div>
      <Grid gap={12} sm={2} md={2} lg={2} def={1}>
        <Link className="bigButton" to={"/create/element"}>
          + Añadir elementos
        </Link>
      </Grid>
      <BottomStart />
    </Layout>
  );
}
