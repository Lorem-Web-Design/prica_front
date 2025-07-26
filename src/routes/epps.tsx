import { useQuery } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ElementFromQuery } from "../@types/elementTypes";
import BottomStart from "../components/bottomStart";
import Grid from "../components/grid";
import Layout from "../components/layout";
import Modal from "../components/modal";
import Paginator from "../components/paginator";
import Title from "../components/title";
import MOCK_EPP from "../data/mock.epp.json";
import FILTROS from "../settings/filterEpp.json";
import EppEditor from "../utils/eppEditor.controll";
import Pagination from "../components/pagination";
import { EppFromQuery } from "../@types/eppTypes";
import EppsControll from "../utils/epps.controll";
import EppCard from "../components/eppCard";
import { GET_EPP_LIST } from "../api/epp.query";

const Epp = new EppsControll([MOCK_EPP] as EppFromQuery[]);

export default function EppPage() {
  const { loading, error, data } = useQuery(GET_EPP_LIST);
  const [elementLoaded, setElementsLoaded] = useState<EppFromQuery[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  //Modal de remisiones
  const [modal, setModal] = useState(false);


  useEffect(() => {
    if (data) {
      Epp.epps = JSON.parse(JSON.stringify(data.getEpps));
      setElementsLoaded(Epp.epps);
    }
  }, [data, loading, error]);

  const handleSearch = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (elementLoaded) {
      if (selectedCategory === "Todos") {
        const search = Epp.search("name", searchString);
        setElementsLoaded(search);
      } else {
        const search = Epp.searchByCategory(selectedCategory, searchString);
        console.log(search)
        setElementsLoaded(search);
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
      <Title title="EPP y Dotación" description="Listado de Epps y dotación" />
      <Modal modal={modal} setModal={setModal}>
        
      </Modal>
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
        {FILTROS.categories.map((categoria, index) => {
          return (
            <div
              className={`mediumBottom ${selectedCategory === categoria.slug ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(categoria.slug);
              }}
              key={index}
            >
              {categoria.slug}
            </div>
          );
        })}
      </Grid>
      <div className="pt_def_12"></div>
      {/* <Paginator list={elementLoaded} /> */}
      <Pagination itemsPerPage={12}>
        {elementLoaded.map((element)=>{
         return <EppCard cardInfo={element as unknown as ElementFromQuery} key={element._id}/>
        })}
      </Pagination>
      <div className="pt_def_12"></div>
      <BottomStart />
    </Layout>
  );
}
