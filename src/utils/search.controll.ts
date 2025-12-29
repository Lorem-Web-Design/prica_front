
export default class SearchControll<T> {
  list: T[];

  constructor(list: T[]) {
    this.list = list;
  }

  search(key: "name", query: string) {
    const searchExpression = new RegExp(`${query}`, "i");
    let results: T[] = [];
    for (const listInfo of this.list) {
      // @ts-ignore
      if (searchExpression.test(listInfo[key])) {
        results.push(listInfo);
      }
    }
    return results;
  }
}