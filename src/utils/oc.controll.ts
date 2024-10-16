type SetProvider = {
  providerList: PricaProvider[];
  providerId: string;
};

export default class OrdenDeCompra {
  ocData: PricaOC;

  constructor(ocData: PricaOC) {
    this.ocData = ocData;
  }

  get info() {
    return this.ocData;
  }

  set date(date: string) {
    this.ocData.date = date;
  }

  set observation(observation: string) {
    this.ocData.observation = observation;
  }

  get stateCopy() {
    return JSON.parse(JSON.stringify(this.ocData)) as PricaOC;
  }

  provider({ providerList, providerId }: SetProvider) {
    const providerInfo = providerList.find(
      (provider) => provider._id === providerId
    );
    if (providerInfo) {
      this.ocData.provider = providerInfo;
    }
  }

  addItem(item: RQItemsFromQuery) {
    const parsedItem = {
      name: item.material?.name ?? "",
      amount: item.authorizedAmount,
      id: item.material?._id ?? "",
    };
    this.ocData.items.push(parsedItem);
  }

  deleteItem(itemId: string) {
    const itemIndex = this.itemIndexFinder(itemId);
    if (itemIndex) {
      this.ocData.items.splice(itemIndex, 1);
    }
    if (itemIndex === 0) {
      this.ocData.items.shift();
    }
  }

  get OC2API():OCAPI{
    //Create copy
    let ocCopy = JSON.parse(JSON.stringify(this.ocData));
    ocCopy["providerId"] = this.ocData.provider._id;
    ocCopy["receiverId"] = this.ocData.receiver._id;
    //Parse items
    ocCopy["items"] = this.parseItems(ocCopy.items)
    //Delete repeated keys
    delete ocCopy.receiver;
    delete ocCopy.provider;
    return ocCopy;
  }

  parseItems(list: PricaOC["items"]){
    for(let i=0; i<list.length; i++){
      const selectedList = list[i];
      delete selectedList.name
    }
    return list
  }

  private itemIndexFinder(itemId: string) {
    for (let i = 0; i < this.ocData.items.length; i++) {
      const currentItem = this.ocData.items[i];
      if (currentItem.id === itemId) {
        return i;
      }
    }
    return undefined;
  }
}
