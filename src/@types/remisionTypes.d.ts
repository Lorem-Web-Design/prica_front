export interface RemisionFromQuery {
  remitent: {
    name: string;
    _id: string;
    role: string;
  };
  remitentProject: {
    name: string;
    _id: string;
  };
  receiverProject: {
    name: string;
    _id: string;
  };
  receiver: {
    name: string;
    _id: string;
    occupation: string;
  };
  elementsList: {
    amount: number;
    element: {
      _id: string,
      name: string,
      unit: string
      classificationId: string,
      location: string
      stockId: string
    }
  }[];
  _id: string
  date: string
  observation: string
  number: string
}

export interface RemisionToApi {
  remitent: string;
  receiver: string;
  receiverProject: string;
  remitentProject: string;
  elementsList: {
    amount: number,
    element: string,
    classificationId: string,
    location: string
  }[];
  date: string;
  observation: string;
}
