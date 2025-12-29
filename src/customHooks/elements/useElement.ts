import { useEffect, useState } from "react";

//types
import { fetchData } from "../../api/fetchData";
import { adminDataSource } from "../../api/datasources";
import getToken from "../../utils/getToken";
const initialValue: ElementInfo = {
    name: "Sin elemento",
    category: "EQUIPMENT",
    code: "COMP123",
    image: "/image/computer.png",
    currentPersonInCharge: "",
    numeroInterno: "",
    causacion:"",
    siigo:"",
    location: [
        { lastLocation: "ACEPALMA", currentLocation: "ZFT", actualLocation: "" },
    ],
    history: [
        {
            lastLocation: "ACEPALMA",
            currentLocation: "ZFT",
            date: "16/01/1998",
            deliverId: "",
            deliverName: "",
            transferId: "",
            transferName: "",
            receiverId: "",
            receiverName: "",
            vehicleId: "",
            vehiclePlate: "",
            personInCharge: "",
        },
    ],
    description: "Nuevo Equipo",
    centerCode: "12356787654",
    _id: "",
    serial: "",
    cost: "",
    invoice: "",
    state: "",
    deliverState: "",
    fixingInfo: "",
    groupId: "",
    subGroupId: "",
    gallery: []
};
function useSingleElement(elementId: string) {

    const [singleElement, setSingleElement] = useState<ElementInfo>(initialValue);
    const updateSingleElement = async () => {
        const data = await fetchData(`${adminDataSource}/elementsById/${elementId}`, getToken());
        const userData = await data?.json();
        setSingleElement(userData.res);
    };
    useEffect(() => {
        console.log(singleElement)
        updateSingleElement();
    }, []);

    return { singleElement, updateSingleElement };
}

export default useSingleElement;
