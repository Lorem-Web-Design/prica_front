import { ElementFromQuery, ElementToApi, RawRemision } from "../@types/elementTypes";

export default class ElementEditor {
  element: ElementFromQuery;

  constructor(element: ElementFromQuery) {
    this.element = element;
  }

  get stateCopy() {
    return JSON.parse(JSON.stringify(this.element)) as ElementFromQuery;
  }

  get toApi():ElementToApi {
    const info = {
      name: this.element.name,
      unit: this.element.unit,
      description: this.element.description,
      code: this.element.code,
      serial: this.element.serial,
      provider: this.element.provider,
      image: this.element.image,
      amount: parseFloat(this.element.amount as unknown as string),
      history: this.historyAndRemisionToApi(this.element.history),
      remision: this.historyAndRemisionToApi(this.element.remision),
      currentOwner: this.element.currentOwner._id,
      giverFolder: this.element.takerFolder._id,
      takerFolder: this.element.takerFolder._id,
      onDelivery: true,
      category: this.element.category,
      lastMovement: "09/25/2024",
    };

    return info;
  }

  historyAndRemisionToApi(history: ElementFromQuery["history"]): RawHistory[] {
    const cleanHistory = JSON.parse(JSON.stringify(history)) as ElementFromQuery["history"];
    let newItem = cleanHistory.map((item) => {
      return {
        takerFolder: item.takerFolder._id,
        giverFolder: item.giverFolder._id,
        giver: item.giver._id,
        taker: item.taker._id,
        amount: parseFloat(item.amount ?? "0")
      };
    })
    return newItem;
  }

}
