import { AuthorizedRoles } from "./authorizationTypes";

export type UserToMutation = {
  name: string;
  password: string;
  cc: string | number;
  role: AuthorizedRoles
  image: "/img/user.png";
  confirmPassword?: string
};
