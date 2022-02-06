import { Link } from "remix";
import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

function GameItem({ game }) {
  return (
    <li className="game-item">
      <Link to={`/games/${game.id}`}>
        {game.slug} [{game.state}]
      </Link>
      <img src="arrow.svg" width={15} />
    </li>
  );
}

export function GameList({ games }) {
  return (
    <ul className="game-list">
      {games.map((game) => {
        return <GameItem key={game.id} game={game} />;
      })}
    </ul>
  );
}
