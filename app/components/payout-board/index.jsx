import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export function PayoutBoard({ winners, claimCost = 1 }) {
  const split = [0.1, 0.2, 0.3, 0.4];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });
  return (
    <div className="winner-board-wrapper">
      <table className="winner-board">
        <thead>
          <tr>
            <th>Quarter</th>
            <th>Player</th>
            <th>ID</th>
            <th>Payout</th>
          </tr>
        </thead>
        <tbody>
          {winners.map(({ name, userid }, i) => {
            const payout = claimCost * 100 * split[i];
            return (
              <tr key={i}>
                <td className="quarter-cell">{i + 1}</td>
                <td className="player-cell">{name}</td>
                <td className="id-cell">{userid || name}</td>
                <td className="payout-cell">{formatter.format(payout)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
