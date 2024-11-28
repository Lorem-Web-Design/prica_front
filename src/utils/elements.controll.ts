import { ElementFromQuery } from "../@types/elementTypes";

export default class ElementControll {
  elements: ElementFromQuery[];

  constructor(elementList: ElementFromQuery[]) {
    this.elements = elementList;
  }

  search(key: "name" | "code" | "serial", query: string) {
    const searchExpression = new RegExp(`${query}`, "i");
    let results: ElementFromQuery[] = [];
    for (const elementInfo of this.elements) {
      if (searchExpression.test(elementInfo[key])) {
        results.push(elementInfo);
      }
    }
    return results;
  }

  searchByCategory(cat: string, query: string) {
    let filterByName = this.search("name", query);
    let results: ElementFromQuery[] = [];
    for(const elementInfo of filterByName){
      if(elementInfo.category === cat){
        results.push(elementInfo)
      }
    }
    return results;
  }

  pagination({elementsPerPage,elementList,}: {elementsPerPage: number;elementList: ElementFromQuery[];}) {
    let pagination: ElementFromQuery[][] = [];
    for (let i = 0; i < elementList.length; i += elementsPerPage) {
      pagination.push(elementList.slice(i, i + elementsPerPage));
    }
    return pagination;
  }
}