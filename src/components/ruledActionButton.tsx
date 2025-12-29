import { Link } from "react-router-dom";
import { ROLES } from "../../enums";
import { AuthorizedRoles } from "../@types/authorizationTypes";
import { useAuth } from "../customHooks/centers/auth/useAuth";

type RuledButton = {
    roles: string[],
    action: Function,
    text: string,
    className?: string
}

export default function RuledActionButton({roles, action, text, className}: RuledButton) {
    const { user } = useAuth();
    let isVisible = roles.includes(user.role)
    return (
        <button className={`${isVisible ? "" : "hide"} smallButton pricaTheme defaultButton ${className}`} onClick={()=>{action()}}>{text}</button>
    );
  }