import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState({
    username: "",
    id: "",
    token: "",
    role: "",
  });
  const localUser = window.localStorage.getItem(
    "estinorteLoggedUser"
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
        role: "",
      });
    }
  }, []);
  return user;
}
