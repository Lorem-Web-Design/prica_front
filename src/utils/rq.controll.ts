export default class RQControll {
  rq: RQFromQuery;
  constructor(initialData: RQFromQuery) {
    this.rq = initialData;
  }

  get stateCopy() {
    return JSON.parse(JSON.stringify(this.rq)) as RQFromQuery;
  }

  set ppto(ppto: string) {
    this.rq.ppto = ppto;
  }

  static rqDate(dateNumber: number) {
    const date = new Date(dateNumber);
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    return `${month + 1}/${day}/${year}`;
  }

  deleteRQItem(id: string) {
    const itemIndex = this.rq.rqItems.findIndex((item) => item["materialId"] === id);
    if (itemIndex > -1) {
      this.rq.rqItems.splice(itemIndex, 1);
    }
  }

  get rqToAPI(): RQControllAPI {
    this.parseAmounts();
    let rqJSONToAPI = {
      date: RQControll.rqDate(Date.now()),
      project: this.rq.project._id,
      rq: this.rq.rq,
      ppto: this.rq.ppto,
      rqItems: this.parseItems(),
      petitioner: this.rq.petitioner._id,
      isApproved: this.rq.isApproved,
      haveOC: this.rq.haveOC,
      isEnded: this.rq.isEnded
    };
    return rqJSONToAPI;
  }

  parseItems(){
    let itemsCopy = JSON.parse(JSON.stringify(this.rq.rqItems)) as RQItemsFromQuery[];
    for(let i=0; i<itemsCopy.length; i++){
      let selectedItem = itemsCopy[i];
      delete selectedItem.material;
    }
    return itemsCopy
  }

  editAmount({materialId, amount}:{materialId: string, amount: number}){
    const selectedMaterialIndex = this.rq.rqItems.findIndex(el=>el.materialId===materialId);
    this.rq.rqItems[selectedMaterialIndex].authorizedAmount = amount;
  }

  parseAmounts(){
    for(let i=0; i<this.rq.rqItems.length; i++){
      const currentItem = this.rq.rqItems[i];
      currentItem.authorizedAmount = Number(currentItem.authorizedAmount)
      currentItem.receivedAmount = Number(currentItem.receivedAmount)
      currentItem.requiredAmount = Number(currentItem.requiredAmount)
      currentItem.pendingAmount = Number(currentItem.pendingAmount)
    }
  }

  get isItemsFilled(){
    return this.rq.rqItems.every(item=>item.receivedAmount > 0)
  }
}
