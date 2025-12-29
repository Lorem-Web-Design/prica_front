export type OCFromQuery = {
  provider: PricaProvider;
  request: string;
  receiver: PricaProvider;
  project: string;
  projectName: string;
  state: string;
  date: string;
  observation: string;
  paymentMethod: string;
  deliverMethod: string;
  deliverDate: string;
  deliverConditions: string;
  deliverAddress: string;
  ocNumber: number;
  discount: {
    name: string,
    value: number
  } | null;
  isAlive: boolean;
  taker?: {
    name: string;
    _id: string;
    cc: string
    occupation: string
  };
  items: {
    name: string;
    amount: number;
    unitaryPrice: number;
    id: string;
    totalPrice?: string;
  }[];
  _id?: string;
  rq: {
    _id: string;
    rq: string;
    ppto: string;
    petitioner: {
      name: string
      _id: string
    }
  };
};

export type OCAPI = {
  date: string;
  request: string;
  deliverAddress: string;
  deliverConditions: string;
  deliverDate: string;
  deliverMethod: string;
  observation: string;
  paymentMethod: string;
  providerId: string;
  receiverId: string;
  takerId: string;
  discount: number
  items: OCItemsAPI[];
  rq: string;
};

export type OCItemsAPI = {
  amount: number;
  id: string;
};
