import { ElementFromQuery, EppElementFromQuery } from "../@types/elementTypes";
import { EppFromQuery } from "../@types/eppTypes";

export default class EppsControll {
  epps: EppElementFromQuery[];

  constructor(eppsList: EppElementFromQuery[]) {
    this.epps = eppsList;
  }

  search(key: "name", query: string) {
    const searchExpression = new RegExp(`${query}`, "i");
    let results: EppElementFromQuery[] = [];
    for (const eppInfo of this.epps) {
      if (searchExpression.test(eppInfo[key])) {
        results.push(eppInfo);
      }
    }
    return results;
  }

  searchByCategory(cat: string, query: string) {
    let filterByName = this.search("name", query);
    let results: EppElementFromQuery[] = [];
    for(const eppInfo of filterByName){
      if(eppInfo.category === cat){
        results.push(eppInfo)
      }
    }
    return results;
  }
}