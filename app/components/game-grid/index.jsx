import { useFetcher } from "remix";
import { range } from "~/utils/helpers";
import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

export function Grid({ game, participantId = "" }) {
  const { board, claims = [], state = "INIT", winningSquares = [] } = game;
  const { rows, cols, teams } = board;
  return (
    <div className="grid-wrapper">
      <div className="teams team1">{teams[0]}</div>
      <div className="teams team2">{teams[1]}</div>
      <div className="table-wrapper">
        <table className="grid">
          {state !== "INIT" && cols && (
            <thead>
              <tr>
                <th className="header"></th>
                {cols.map((i) => {
                  return (
                    <th className="header team1" key={i}>
                      {i}
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {range(10).map((row) => {
              return (
                <tr key={row}>
                  {state !== "INIT" && rows && (
                    <th className="header team2">{rows[row]}</th>
                  )}
                  {range(10).map((col) => {
                    const claim = claims.find(
                      (item) => item.row === row && item.col === col
                    );
                    const isWinner =
                      winningSquares.find(
                        (item) => item.row === row && item.col === col
                      ) !== undefined;
                    return (
                      <Square
                        key={col}
                        row={row}
                        col={col}
                        state={state}
                        claim={claim}
                        participantId={participantId}
                        isWinner={isWinner}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Square({ row, col, state, claim, participantId, isWinner }) {
  const isOwn = claim && claim.participantId === participantId;
  if (state === "INIT") {
    return <InitSquare row={row} col={col} claim={claim} isOwn={isOwn} />;
  }
  return (
    <td
      className={`square ${isOwn ? "claimed-self" : "claimed-other"}${
        isWinner ? " winner" : ""
      }`}
    >
      {claim.participant.userid}
    </td>
  );
}

function InitSquare({ row, col, claim, isOwn }) {
  if (claim && !isOwn) {
    return <td className="square claimed-other">{claim.participant.userid}</td>;
  }
  const fetcher = useFetcher();
  return (
    <td className={`square ${isOwn ? "claimed-self" : ""}`}>
      <fetcher.Form replace method="post">
        <input type="hidden" name="row" value={row} />
        <input type="hidden" name="col" value={col} />
        {claim && <input type="hidden" name="claimId" value={claim.id} />}
        <button
          type="submit"
          className="square-button"
          name="sqAction"
          value={claim ? "release" : "claim"}
        >
          &nbsp;
        </button>
      </fetcher.Form>
    </td>
  );
}
