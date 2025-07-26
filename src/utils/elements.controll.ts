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

  searchByUrl(url: string) {
    let results: ElementFromQuery[] = [];
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const searchString = urlParams.get('searchString') || '';
    const cat = urlParams.get('cat') || '';
    results = this.searchByCategory(cat, searchString);
    return results;
  }

  searchByCategory(cat: string, query: string) {
    let filterByName = this.search("name", query);
    console.log(filterByName);
    let results: ElementFromQuery[] = [];

    if(cat === "Todos"){
      return filterByName;
    }

    for(const elementInfo of filterByName){
      if(elementInfo.category === cat){
        results.push(elementInfo)
      }
    }
    return results;
  }
}