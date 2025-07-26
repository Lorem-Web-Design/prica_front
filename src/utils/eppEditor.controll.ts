import { EppFromQuery, EppToAPI } from "../@types/eppTypes";

export default class EppEditor {
  epp: EppFromQuery;

  constructor(epp: EppFromQuery) {
    this.epp = epp;
  }

  get stateCopy() {
    return JSON.parse(JSON.stringify(this.epp)) as EppFromQuery;
  }

  get toApi():EppToAPI {
    const info = {
      name: this.epp.name,
      classificationName: this.epp.classificationName,
      classification: this.epp.classification,
      category: this.epp.category
    };
    return info
  }

  addClassification(name: string, amount: number){
    this.epp.classification.push({
      name,
      amount,
      id: `${Date.now()}`
    })
  }

  addNewItems(classificationId: string, amount: number){
    let selectedClassification = this.epp.classification.find(clas=>clas.id===classificationId)
    if(selectedClassification){
      selectedClassification.amount += amount
    }
  }
}
