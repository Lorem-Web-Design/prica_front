import { useMutation } from "@apollo/client";
import { createContext, PropsWithChildren, useState } from "react";
import { adminDataSource } from "../api/datasources";
import { postDataWithPayLoad } from "../api/fetchData";
import { CREATE_ELEMENT } from "../api/myMutations";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import ELEMENT_MOCK from "../data/mock.element_raw.json";
import checkForms from "../utils/checkForms";
import getToken from "../utils/getToken";

type ContextInfo = {
    toast: boolean,
    setToast: React.Dispatch<React.SetStateAction<boolean>>
    toastProps: {
        title: string,
        body: string,
        footer: string,
        theme: string
    },
    setToastProps: React.Dispatch<React.SetStateAction<Toast>>
}

const ContextDefaultValue:ContextInfo = {
    toast: false,
    setToast: () => false,
    toastProps: {
        title: "Titulo del toast",
        body: "Cuerpo del toast",
        footer: "Footer del toast",
        theme: "primary_theme"
    },
    setToastProps: () => {},
}

export const NotiContext = createContext(ContextDefaultValue);

export default function NotiProvider({children}:PropsWithChildren){
    
    const [toast, setToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        title: "Titulo del toast",
        body: "Cuerpo del toast",
        footer: "Footer del toast",
        theme: "primary_theme"
    })

    return <NotiContext.Provider value={{ toast, toastProps, setToast, setToastProps}}>
        {children}
    </NotiContext.Provider>
}