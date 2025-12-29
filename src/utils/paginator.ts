export default class Paginator{
    static pagination<T>({itemsPerPage,list}: {itemsPerPage: number;list: T[]}) {
        let pagination: T[][] = [];
        for (let i = 0; i < list.length; i += itemsPerPage) {
          pagination.push(list.slice(i, i + itemsPerPage));
        }
        return pagination;
      }
}