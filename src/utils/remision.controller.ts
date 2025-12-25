import { RemisionFromQuery, RemisionToApi } from "../@types/remisionTypes";

export default class Remision {
  data: RemisionFromQuery;

  constructor(remision: RemisionFromQuery) {
    this.data = remision;
  }

  get stateCopy() {
    return JSON.parse(JSON.stringify(this.data)) as RemisionFromQuery;
  }

  get toApi():RemisionToApi {
    return {
      receiver: this.data.receiver._id,
      remitent: this.data.remitent._id,
      date: this.data.date,
      elementsList: this.data.elementsList.map(item=>{
        return({
          element: item.element._id,
          amount: item.amount,
          classificationId: item.element.classificationId,
          location: item.element.location,
          stockId: item.element.stockId
        })
      }),
      receiverProject: this.data.receiverProject._id,
      remitentProject: this.data.remitentProject._id,
      observation: this.data.observation
    }
  }

  allowAdd(amountToDistribute: number, selectedStockAmount: number, receiver: string, receiverProjectId: string){
    return amountToDistribute <=selectedStockAmount && receiver !== "" && receiverProjectId !== ""
  }


}
