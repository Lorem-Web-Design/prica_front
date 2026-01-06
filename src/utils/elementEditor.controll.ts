import {
  ElementFromQuery,
  ElementToApi,
  RawRemision,
} from "../@types/elementTypes";

type AssignElementTypes = {
  newLocation: string;
  newOwner: string;
  classificationId: string;
  amountToDistribute: number;
  currentOwner: string;
};

import AS_QUERY_ELEMENT from "../data/mock.element.json";

export default class ElementEditor {
  element: ElementFromQuery;

  constructor(element: ElementFromQuery) {
    this.element = JSON.parse(JSON.stringify(element));
  }

  get stateCopy() {
    return JSON.parse(JSON.stringify(this.element)) as ElementFromQuery;
  }

  get toApi(): ElementToApi {
    
    const info = {
      name: this.element.name,
      unit: this.element.unit,
      description: this.element.description,
      code: this.element.code,
      serial: this.element.serial,
      provider: this.element.provider,
      image: this.element.image,
      amount: parseFloat(this.element.amount as unknown as string),
      history: this.historyAndRemisionToApi(this.element.history),
      remision: this.historyAndRemisionToApi(this.element.remision),
      currentOwner: this.element.currentOwner._id,
      giverFolder: this.element.takerFolder._id,
      takerFolder: this.element.takerFolder._id,
      onDelivery: true,
      category: this.element.category,
      lastMovement: `${new Date()}`,
      classification: this.element.classification,
      classificationName: this.element.classificationName,
      stock: this.element.stock,
    };
    return info;
  }

  stockFixer = () => {
      if (this.element.stock) {
        this.element.stock = this.element.stock.map((stockItem) => {
          return {
            ...stockItem,
            owner: typeof stockItem.owner === "object" ? stockItem.owner._id : stockItem.owner,
          };
        })
      }
  }

  historyAndRemisionToApi(history: ElementFromQuery["history"]): RawHistory[] {
    const cleanHistory = JSON.parse(
      JSON.stringify(history)
    ) as ElementFromQuery["history"];
    let newItem = cleanHistory.map((item) => {
      return {
        takerFolder: item.takerFolder._id,
        giverFolder: item.giverFolder._id,
        giver: item.giver._id,
        taker: item.taker._id,
        amount: parseFloat(item.amount ?? "0"),
      };
    });
    return newItem;
  }

  addClassification(name: string, amount: number, userId: string) {
    let classificationId = `${Date.now()}`;
    this.element.classification.push({
      name,
      amount,
      id: classificationId,
    });

    this.element.stock?.push({
      amount,
      classificationId,
      location: this.element.takerFolder._id,
      owner: userId,
      stockId: `${Date.now()}`,
    });
  }

  deleteClassification(classificationId: string) {
    this.element.classification = this.element.classification.filter(
      (clas) => clas.id !== classificationId
    );
    this.element.stock = this.element.stock?.filter(
      (stockItem) => stockItem.classificationId !== classificationId
    );
  }

  addNewItems(classificationId: string, amount: number) {
    let selectedClassification = this.element.classification.find(
      (clas) => clas.id === classificationId
    );
    if (selectedClassification) {
      selectedClassification.amount += amount;
    }
  }

  addStockItem(stockIndex: number, amount: number) {
    let selectedStock = this.element.stock
      ? this.element.stock[stockIndex]
      : undefined;
    if (selectedStock) {
      selectedStock.amount += amount;
    }
  }

  assignEpp({
    location,
    owner,
    classificationId,
    amount,
  }: {
    location: string;
    owner: string;
    classificationId: string;
    amount: number;
  }) {
    // Ensure the stock property exists on the element; initialize it as an empty array if it doesn't.
    if (!this.element.stock) {
      this.element.stock = [];
    }
    // Filter the stock to find entries where the owner matches the provided owner.
    const isOwner = this.element.stock.filter((item) => item.owner === owner);

    // Check if there is at least one stock entry for the given owner.
    if (isOwner.length >= 1) {
      // Look for an existing stock entry with the same classificationId for the owner.
      const isItem = isOwner.find(
        (item) => item.classificationId === classificationId
      );

      if (isItem) {
        // If a matching stock entry is found, increment its amount by the provided amount.
        isItem.amount += amount;
      } else {
        // If no matching stock entry is found, add a new stock entry for the classification.
        this.element.stock.push({
          location,
          owner,
          classificationId,
          amount,
          stockId: `${Date.now()}`,
        });
      }
    } else {
      // If no stock entries exist for the owner, add a new stock entry.
      this.element.stock.push({
        location,
        owner,
        classificationId,
        amount,
        stockId: `${Date.now()}`,
      });
    }
    this.updateClassificationOnAssign(amount, classificationId);
  }

  assignElement(
    stockIndex: number,
    amountToDistribute: number,
    newLocation: string,
    newOwner: string
  ) {
    // Ensure the stock property exists on the element; initialize it as an empty array if it doesn't.
    if (!this.element.stock) {
      this.element.stock = [];
    }
    // Filter the stock to find entries where the owner matches the provided owner.
    const selectedStock = this.element.stock[stockIndex];
    if (selectedStock.location !== newLocation) {
      this.element.stock.push({
        location: newLocation,
        owner: newOwner,
        classificationId: selectedStock.classificationId,
        amount: amountToDistribute,
        stockId: selectedStock.stockId,
      });
      selectedStock.amount -= amountToDistribute;
    }
  }

  allowDistribution(classsificationId: string, amountToDistribute: number) {
    const currentClas = this.element.stock?.find(
      (clas) => clas.classificationId === classsificationId
    );
    if (amountToDistribute > 0) {
      if (currentClas) {
        return currentClas.amount >= amountToDistribute;
      }
      return false;
    }
    return false;
  }

  userCanDistribute(userId: string, movementAmount: number) {
    const canDistribute = this.element.stock?.find(
      (item) => item.owner === userId
    );
    if (canDistribute) {
      return movementAmount <= canDistribute.amount;
    }
    return false;
  }

  updateClassificationOnAssign(amount: number, classificationId: string) {
    const generalClas = this.element.stock?.find(
      (item) => item.classificationId === classificationId
    );
    if (generalClas) {
      generalClas.amount -= amount;
    }
  }

  static stockCounter(stock: ElementEditor["element"]["stock"]) {
    return stock?.reduce(
      (acccumulator, currentValue) => acccumulator + currentValue.amount,
      0
    );
  }

  defaultElement() {
    this.element = JSON.parse(
      JSON.stringify(AS_QUERY_ELEMENT as ElementFromQuery)
    );
  }
}
