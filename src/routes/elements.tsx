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

export default function Elementos() {
  const {loading, error, data} = useQuery(GET_ELEMENTS);
  const [elementLoaded, setElementsLoaded] = useState<ElementInformation[][]>();
  const [searchString, setSearchString] = useState<string>("")
  const elementPerPage = 8;
  useEffect(()=>{
    if(data){
      const Element = new ElementControll(data.getElements);
      setElementsLoaded(Element.pagination({elementsPerPage: elementPerPage, elementList: Element.elements}));
    }
  },[data])

  const handleSearch = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    console.log(searchString)
    if(elementLoaded){
      const Element = new ElementControll(data.getElements);
      const search = Element.search("name", searchString);
      setElementsLoaded(Element.pagination({elementList: search, elementsPerPage: elementPerPage}))
    }
  }

  const handleChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearchString(value);
  }
  return (
    <Layout>
      {/* Titulo de la página actual */}
      <Title title="Elementos" description="Listado de elementos" />
      <div className="pt_def_48"></div>
      {/* Barra de meníu inferior - shortcuts */}
      <form className="search_container" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar elementos..."
          className="search"
          name="search"
          onChange={handleChange}
          value={searchString}
        />
        <button className="searchButton" type="submit">Buscar</button>
      </form>
      <div className="pt_def_48"></div>
      <ElementList loading={loading} error={error} data={elementLoaded}/>
      <div className="pt_def_12"></div>
      <Grid gap={12} sm={2} md={2} lg={2} def={2}>
        <Link className="bigButton" to={"/create/element"}>+ Añadir elementos</Link>
      </Grid>
      <BottomStart />
    </Layout>
  );
}
