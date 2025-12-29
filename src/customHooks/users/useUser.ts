import { useEffect, useState } from "react";
import { AuthorizedRoles } from "../../@types/authorizationTypes";

type UserTypes = {
  username: string,
    id: string,
    token: string,
    role: AuthorizedRoles
}
export default function useUser() {
  const [user, setUser] = useState<UserTypes>({
    username: "",
    id: "",
    token: "",
    role: "ing_proyectos" ,
  });
  const localUser = window.localStorage.getItem(
    "pricaUser"
  ) as string;

  useEffect(() => {
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUser(parsedUser);
    } else {
      setUser({
        username: "",
        id: "",
        token: "",
        role: "ing_proyectos",
      });
    }
  }, []);
  return user;
}
