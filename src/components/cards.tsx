import { Link } from "react-router-dom";

type Card = {
  icon: string;
  name: string;
  route: string;
};
export default function Card({ icon, name, route }: Card) {

  return (
    <Link className="card_container select_none" to={route}>
      <div className="card_icon">
        <img src={icon} alt={name} draggable={false} />
      </div>
      <div className="card_name">
        <p className="select_none">{name}</p>
      </div>
    </Link>
  );
}
