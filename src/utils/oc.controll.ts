import { OCAPI, OCFromQuery } from "../@types/oc.types";
import { ProviderFromQuery } from "../@types/providerTypes";
import OC_DELIVERY_METHODS from "../data/ocDeliverInfo.json"

type SetProvider = {
  providerList: ProviderFromQuery[];
  providerId: string;
};

export default class OrdenDeCompra {
  ocData: OCFromQuery;

  constructor(ocData: OCFromQuery) {
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
    this.itemsTotalPriceCalculator();
    return JSON.parse(JSON.stringify(this.ocData)) as OCFromQuery;
  }

  itemsTotalPriceCalculator(){
    for(let i=0; i<this.ocData.items.length; i++){
      let currentItem = this.ocData.items[i];
      currentItem.totalPrice = this.toCurrency(currentItem.unitaryPrice * currentItem.amount);
    }
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
      amount: item.pendingAmount,
      id: item.material?._id ?? "",
      unitaryPrice: item.material?.unitaryPrice ?? 0,
      totalPrice: this.toCurrency(item.material?.unitaryPrice ?? 0 * item.pendingAmount),
      category: item.material?.type,
      classificationId: item.classificationId
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
    ocCopy["rq"] = this.ocData.rq._id
    ocCopy["takerId"] = this.ocData.taker !== undefined ? this.ocData.taker._id : "";
    //Delete repeated keys
    delete ocCopy.receiver;
    delete ocCopy._id;
    delete ocCopy.taker;
    delete ocCopy.provider;
    return ocCopy;
  }

  parseItems(list: PricaOC["items"]){
    for(let i=0; i<list.length; i++){
      const selectedList = list[i];
      delete selectedList.name
      delete selectedList.totalPrice
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

  toCurrency(price: number){
    let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });
  return USDollar.format(price);
  }

  static toCurrency(price: number){
    let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });
  return USDollar.format(price);
  }

  static OCDeliveryInfo(deliveryProp: "deliveryMethods" | "deliveryConditions" | "paymentMethod", value: string){
    const PROP_INFO = OC_DELIVERY_METHODS[deliveryProp].find(prop=>prop.value === value);
    return PROP_INFO?.name;
  }

  get Subtotal(){
   return this.ocData.items.reduce((acc, current)=>acc + (current.amount * current.unitaryPrice), 0)
  }

  get IVA(){
    return this.Subtotal * 0.19
  }

  get Total(){
    return this.Subtotal * 1.19 - (this.ocData.discount?.value ?? 0)
  }
}
