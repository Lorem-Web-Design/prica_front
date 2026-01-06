import { MODE } from "./mode"
//Tests3
export function excelSource(){
    if(MODE === "PRODUCTION"){
        return "https://api.lorem.fun/createExcel"
    }
    if(MODE === "DEV"){
        return "http://localhost:3500/createExcel"
    }
    return "http://localhost:3500/createExcel"
}

export function dataSource(){
    if(MODE === "PRODUCTION"){
        return "https://api.lorem.fun/prica"
    }
    if(MODE === "DEV"){
        return "http://localhost:3500/prica"
    }
    return "http://localhost:3500/prica"
}

export function imagesSource(){
    if(MODE === "PRODUCTION"){
        return "https://api.lorem.fun"
    }
    if(MODE === "DEV"){
        return "http://localhost:3500"
    }
    return "http://localhost:3500"
}

export function adminDataSource(){
    if(MODE === "PRODUCTION"){
        return "https://api.lorem.fun/admin"
    }
    if(MODE === "DEV"){
        return "http://localhost:3500/admin"
    }
    return "http://localhost:3500/admin"
}


export function graphDataSource(){
    if(MODE === "PRODUCTION"){
        return "https://graph.lorem.fun/"
    }
    if(MODE === "DEV"){
        return "http://localhost:5000/"
    }
    return "http://localhost:5000/"
}

