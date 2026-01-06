declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

type Title = {
  title: string;
  route?: string;
  description?: string;
};

type Grid = {
  sm: number;
  md: number;
  lg: number;
  gap: number;
  def: number;
  className?: string;
};

type User = {
  name: string;
  cc: number;
  cargo: string;
  image: string;
  id: string;
  isActive: boolean;
  eppHistory: {
    eppId: {
      name: string;
      classificationName: string;
      classification: {
        name: string;
        amount: number;
        id: string;
      };
      category: string;
      _id: string;
    };
    amount: number;
    date: string;
  }[];
};

type Button = {
  text: string;
  link: string;
};

type ElementCard = {
  name: string;
  description: string;
  serial: string;
  location: string;
  lastMovement: string;
  image: string;
};

type Bodega = {
  image: string;
  isParent: boolean;
  name: string;
  parentId: string;
  _id: string;
  hide?: boolean;
};

type PricaWorker = {
  cc: number;
  image: string;
  name: string;
  occupation: string;
  _id: string;
  isActive: boolean;
  eppHistory: EppInfo[];
  hide?: boolean;
  role: string;
  elements: {
    _id;
    name;
    category;
  }[];
};

type EppInfo = {
  amount: number;
  date: string;
  folder: Bodega;
  eppId?: {
    classification: {
      amount: number;
      id: string;
      name: string;
    }[];
    classificationName: string;
    icons: string;
    name: string;
    _id: string;
  };
};

type EppInfoApi = {
  amount: number;
  date: string;
  folder: string;
  eppId: string;
  classificationId: string;
};

type PricaWorkerToApi = {
  cc: number;
  image: string;
  name: string;
  occupation: string;
  isActive: boolean;
};

type ElementInformation = {
  name: string;
  description: string;
  code: string;
  serial: string;
  image: string;
  unit?: string;
  history: {
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
  }[];
  currentOwner: string;
  giverFolder: {
    name: string;
    _id: string;
  };
  takerFolder: {
    name: string;
    _id: string;
  };
  onDelivery: boolean;
  category: string;
  amount: number;
  provider: string;
  _id: string;
};

type RawElementInformation = {
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
  category: string;
};

type RawHistory = {
  giverFolder: string;
  takerFolder: string;
  giver: string;
  taker: string;
};

type RQItems = {
  requiredAmount: number;
  authorizedAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  observation: string;
  materialId: string;
  type?: string;
  unit?: string;
  name?: string;
};

type RQItemsForMutation = {
  requiredAmount: number;
  authorizedAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  observation: string;
  materialId: string;
};

type RQControllTypesKeys =
  | "date"
  | "project"
  | "rq"
  | "ppto"
  | "rqItems"
  | "petitioner"
  | "_id"
  | "isApproved";

type RQControllTypes = {
  date: number;
  project: {
    name: string;
    _id: string;
  };
  rq: string;
  ppto: string;
  rqItems: RQItems[];
  petitioner: {
    name: string;
    _id: string;
  };
  _id?: string;
  isApproved: boolean;
  haveOC: boolean;
};

type RQControllAPI = {
  date: string;
  project: string;
  rq: string;
  ppto: string;
  rqItems: RQItemsForMutation[];
  petitioner: string;
};

type Modal = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type Toast = {
  title: string;
  body: string;
  footer: string;
  theme: string;
};

type FormByType = {
  selectedType: "Material" | "Equipo" | "Dotacion" | "EPP" | "Herramienta";
};

enum SelectedType {
  MATERIAL = "Material",
  EQUIPO = "Equipo",
  DOTACION = "Dotación",
  EPP = "EPP",
  HERRAMIENTA = "Herramienta",
}

type AuthUser = {
  name: string;
  role: string;
  token: string;
  image: string;
  name: string;
  id: string;
};

type UseAuthTypes = {
  user: AuthUser;
  login: Function;
  logout: Function;
};

type ProviderQuery = {
  getProviders: PricaProvider[];
};

type PricaOC = {
  provider: PricaProvider;
  receiver: PricaProvider;
  date: string;
  observation: string;
  paymentMethod: string;
  deliverMethod: string;
  deliverDate: string;
  deliverConditions: string;
  deliverAddress: string;
  ocNumber: number;
  isAlive: boolean;
  project: string;
  projectName: string;
  state: string;
  rq: string;
  _id?: string;
  items: {
    name?: string;
    amount: number;
    id: string;
    unitaryPrice: number;
    totalPrice?: string;
  }[];
};

type PricaMaterial = {
  name: string;
  unit: string;
  category: string;
  _id: string;
  amount: number;
};

type SelectBox = {
  onChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  name: string;
  isEmpty: boolean;
  value: string;
  disabled?: boolean;
};

type AddState<T> = T & {
  setState: React.Dispatch<React.SetStateAction<PricaMaterial>>;
};

type RQFromQuery = {
  date: string;
  hide?: boolean;
  project: {
    name: string;
    _id: string;
  };
  rq: string;
  ppto: string;
  rqItems: RQItemsFromQuery[];
  petitioner: {
    name: string;
    _id: string;
  };
  _id?: string;
  haveOC: boolean;
  isApproved: boolean;
  isEnded: boolean;
};

type RQItemsFromQuery = {
  requiredAmount: number;
  authorizedAmount: number;
  receivedAmount: number;
  pendingAmount: number;
  observation: string;
  materialId: string;
  materialCategory: string;
  classificationId?: string;
  material?: {
    name: string;
    unit: string;
    type: string;
    _id: string;
    amount: number;
    unitaryPrice: number;
    serial: string;
    description: string;
    classification: {
      name: string;
      amount: number;
      id: string;
    }[];
    stock: {
      location: string;
      owner: string;
      amount: number;
      classificationId: string;
      stockId: string;
    }[];
  } | null;
};

type Material = {
  name: string;
  unit: string;
  type: string;
  _id?: string;
};
