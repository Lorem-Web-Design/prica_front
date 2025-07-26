import { ElementFromQuery } from "../@types/elementTypes";
import { EppFromQuery } from "../@types/eppTypes";

export default class EppsControll {
  epps: EppFromQuery[];

  constructor(eppsList: EppFromQuery[]) {
    this.epps = eppsList;
  }

  search(key: "name", query: string) {
    const searchExpression = new RegExp(`${query}`, "i");
    let results: EppFromQuery[] = [];
    for (const eppInfo of this.epps) {
      if (searchExpression.test(eppInfo[key])) {
        results.push(eppInfo);
      }
    }
    return results;
  }

  searchByCategory(cat: string, query: string) {
    let filterByName = this.search("name", query);
    let results: EppFromQuery[] = [];
    for(const eppInfo of filterByName){
      if(eppInfo.category === cat){
        results.push(eppInfo)
      }
    }
    return results;
  }
}