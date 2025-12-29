import { AuthorizedRoles } from "./authorizationTypes";

export type UserToMutation = {
  name: string;
  password: string;
  cc: string | number;
  role: AuthorizedRoles
  image: string;
  confirmPassword?: string
  hide?: boolean
};

export type EditUserToMutation = {
  name: string;
  password: string;
  cc: string | number;
  role: striing
  image: string;
  confirmPassword?: string
  _id?: string
};

export type WorkerToApi = {
  name: string,
  cc: number
  occupation: string,
  image: string
  _id?: string
  isActive: boolean | string
  eppHistory: EppInfo[]
}

export type VisibleAdmin = {
  cc: number;
  image: string;
  name: string;
  role: string;
  _id: string;
  hide?: boolean
};