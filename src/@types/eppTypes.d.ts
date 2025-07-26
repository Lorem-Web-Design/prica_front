export interface EppFromQuery {
    name: string
    icon: string
    classificationName: string,
    classification: {
        name: string,
        amount: number,
        id: string
    }[]
    _id: string
    category: "EPP" | "DOTACION"
}

export interface EppToAPI {
    name: string
    classificationName: string,
    classification: {
        name: string,
        amount: number
    }[]
}