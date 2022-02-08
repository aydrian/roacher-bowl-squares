import { Link } from "remix";
import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

function GameItem({ game }) {
  const [team1, team2] = game.board.teams;
  const stateTitles = {
    INIT: "Claiming Squares",
    Q1: "1st quarter",
    Q2: "2nd quarter",
    Q3: "3rd quarter",
    Q4: "4th quarter",
    FINAL: "Game Over"
  };
  return (
    <li>
      <Link to={`/games/${game.id}`} className="game-item">
        <div className="game-item-title">
          <div className="game-name">{game.slug}</div>
          <div className="game-details">
            {`${team1} vs ${team2}:`} {stateTitles[game.state]}
          </div>
        </div>
        <img src="arrow.svg" width={15} />
      </Link>
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
