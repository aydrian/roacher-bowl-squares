import { Form } from "remix";
import { range } from "~/utils/helpers";

export function Grid({ game, participantId = "" }) {
  const { board, claims = [], state = "INIT" } = game;
  const { rows, cols, teams } = board;
  return (
    <div className="grid-wrapper">
      <div className="team1">{teams[0]}</div>
      <div className="team2">{teams[1]}</div>
      <table className="grid">
        {state !== "INIT" && cols && (
          <thead>
            <th className="header"></th>
            {cols.map((i) => {
              return <th key={i}>{i}</th>;
            })}
          </thead>
        )}
        <tbody>
          {range(10).map((row) => {
            return (
              <tr key={row}>
                {state !== "INIT" && rows && (
                  <th className="header">{rows[row]}</th>
                )}
                {range(10).map((col) => {
                  const claim = claims.find(
                    (item) => item.row === row && item.col === col
                  );
                  return (
                    <td key={col}>
                      <Square
                        row={row}
                        col={col}
                        state={state}
                        claim={claim}
                        participantId={participantId}
                      />
                    </td>
                    /*<td key={col}>
                      /*{claim ? (
                        <ClaimedSquare
                          row={row}
                          col={col}
                          state={state}
                          claim={claim}
                          participantId={participantId}
                        />
                      ) : (
                        <Square row={row} col={col} state={state} />
                      )}
                    </td>*/
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Square({ row, col, state, claim, participantId }) {
  const isOwn = claim && claim.participantId === participantId;
  if (state === "INIT") {
    return <InitSquare row={row} col={col} claim={claim} isOwn={isOwn} />;
  }
  return (
    <div className={`square ${isOwn ? "claimed-self" : "claimed-other"}`}>
      {claim.participant.username}
    </div>
  );
}

function InitSquare({ row, col, claim, isOwn }) {
  if (claim && !isOwn) {
    return (
      <div className="square claimed-other">{claim.participant.username}</div>
    );
  }
  return (
    <div className={`square ${isOwn ? "claimed-self" : ""}`}>
      <Form method="post">
        <input type="hidden" name="row" value={row} />
        <input type="hidden" name="col" value={col} />
        {claim && <input type="hidden" name="claimId" value={claim.id} />}
        <button
          type="submit"
          className="square-button"
          name="sqAction"
          value={claim ? "release" : "claim"}
        >
          {claim ? "Release" : "Claim"}
        </button>
      </Form>
    </div>
  );
}

/*function Square({ row, col, state }) {
  return (
    <div className="square">
      {state === "INIT" && (
        <Form method="post">
          <input type="hidden" name="row" value={row} />
          <input type="hidden" name="col" value={col} />
          <button
            type="submit"
            className="square-button"
            name="sqAction"
            value="claim"
          >
            Claim
          </button>
        </Form>
      )}
    </div>
  );
}

function ClaimedSquare({ row, col, state, claim, participantId }) {
  if (claim?.participantId === participantId) {
    return (
      <div className="square claimed-self">
        {state === "INIT" ? (
          <Form method="post">
            <input type="hidden" name="row" value={row} />
            <input type="hidden" name="col" value={col} />
            <input type="hidden" name="claimId" value={claim.id} />
            <button
              type="submit"
              className="square-button"
              name="sqAction"
              value="release"
            >
              Release
            </button>
          </Form>
        ) : (
          <div>Your Square</div>
        )}
      </div>
    );
  } else {
    return (
      <div className="square claimed-other">{claim.participant.username}</div>
    );
  }
}*/
