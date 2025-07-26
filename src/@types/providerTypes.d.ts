export interface PricaProvider {
    name: string
    nit: string
    address: string
    city: string
    contact: string
    contactNumber: number
    email: string
}



export interface ProviderFromQuery extends PricaProvider { 
    _id: string
}