import { Link } from "react-router-dom";
import { ROLES } from "../../enums";
import { AuthorizedRoles } from "../@types/authorizationTypes";
import { useAuth } from "../customHooks/centers/auth/useAuth";

type RuledButton = {
    roles: AuthorizedRoles,
    link: string,
    text: string
}

export default function RuledAnchorButton({roles, link, text}: RuledButton) {
    const { user } = useAuth();
    let isVisible = roles.includes(user.role)
    return (
        <Link to={link}  className={`${isVisible ? "" : "hide"} smallButton pricaTheme defaultButton`}>
        {text}
      </Link>
      
    );
  }