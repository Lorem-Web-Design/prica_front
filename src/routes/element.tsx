import Layout from "../components/layout";
import BottomStart from "../components/bottomStart";
import Title from "../components/title";
import { useState } from "react";
import Toast from "../components/toast";
import ElementById from "../components/elementById";
import ElementEditor from "../utils/elementEditor.controll";
import ELEMENT_MOCK from "../data/mock.element.json";
import { ElementFromQuery } from "../@types/elementTypes";

export default function ElementInformation() {
    const elementEditor = new ElementEditor(ELEMENT_MOCK as ElementFromQuery);
    const [toast, setToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        title: "Titulo del toast",
        body: "Cuerpo del toast",
        footer: "Footer del toast",
        theme: "primary_theme"
    })

    return (
        <Layout>
            {/* Titulo de la página actual */}
            <Title title="Crear elementos" description="Panel de creación de elementos" />
            <Toast title={toastProps.title} body={toastProps.body} theme={toastProps.theme} footer={toastProps.footer} isActive={toast} setToast={setToast} />
            <div className="pt_def_48"></div>
            {/* Barra de meníu inferior - shortcuts */}
            <ElementById elementEditor={elementEditor}/>
            <BottomStart />
        </Layout>
    );
}
