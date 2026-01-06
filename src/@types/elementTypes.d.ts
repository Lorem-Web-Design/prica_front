export type ElementToApi = {
  name: string;
  description: string;
  code: string;
  serial: string;
  provider: string;
  amount: number;
  image: string;
  history: RawHistory[];
  currentOwner: string;
  giverFolder: string;
  takerFolder: string;
  onDelivery: boolean;
  category: Categories;
};

export type SelectType = SingleValue<{
  value: string;
  label: string;
}>;

export type RawHistory = {
  giverFolder: string;
  takerFolder: string;
  giver: string;
  taker: string;
};

type HistoryAndRemision = {
  giverFolder: {
    name: string;
    _id: string;
  };
  takerFolder: {
    name: string;
    _id: string;
  };
  giver: {
    name: string;
    _id: string;
  };
  taker: {
    name: string;
    _id: string;
  };
  amount?: string;
};

export type ElementFromQuery = {
  name: string;
  description: string;
  code: string;
  serial: string;
  image: string;
  unit: string;
  history: HistoryAndRemision[];
  remision: HistoryAndRemision[];
  currentOwner: {
    name: string;
    _id: string;
  };
  giverFolder: {
    name: string;
    _id: string;
  };
  takerFolder: {
    name: string;
    _id: string;
  };
  onDelivery: boolean;
  category: Categories;
  amount: number;
  hide?: boolean;
  provider: string;
  _id: string;
  classification: Classification[];
  classificationName: string;
  stock?: Stock[];
};

type Stock = {
  amount: number;
  classificationId: string;
  owner: string;
  location: string;
  stockId: string;
};

type Classification = {
  name: string;
  amount: number;
  id: string;
};

export type RawRemision = {
  giverFolder: string;
  takerFolder: string;
  giver: string;
  taker: string;
  amount: string;
};

type MinifiedInfo = {
  name: string;
  _id: string;
};

export type RemisionExtended = {
  giverFolder: MinifiedInfo;
  takerFolder: MinifiedInfo;
  giver: MinifiedInfo;
  taker: MinifiedInfo;
  amount: string;
};

type Categories =
  | "Material"
  | "Equipo"
  | "Dotacion"
  | "EPP"
  | "Herramienta"
  | "Todos";
