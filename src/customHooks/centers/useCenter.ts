import { useEffect, useState } from "react";
import { fetchFromEstinorteApi } from "../../services/fetchData";
import { fetchData } from "../../api/fetchData";
import { adminDataSource } from "../../api/datasources";
import getToken from "../../utils/getToken";

function useCenter(centerId: string) {
    const [singleCenter, setSingleCenter] = useState<CenterInfo>({
        name: "",
        image: "",
        description: "",
        _id: ""
    });

    useEffect(() => {
        const getData = async () => {
            const data = await fetchData(`${adminDataSource}/centers/${centerId}`, getToken())
            const response = await data?.json()
            const centerData: CenterInfo = response.res
            setSingleCenter(centerData)
        }
        getData()
    }, [])

    return { singleCenter }
}

export default useCenter;