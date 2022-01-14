export function Grid({
  rows,
  cols,
  claims = [],
  state = "INIT",
  participant = ""
}) {
  return (
    <div className="grid-wrapper">
      <table className="grid">
        {cols && (
          <thead>
            <th className="header"></th>
            {cols.map((i) => {
              return <th key={i}>{i}</th>;
            })}
          </thead>
        )}
        <tbody>
          {[...Array(10).keys()].map((row) => {
            return (
              <tr key={row}>
                {rows && <th className="header">{rows[row]}</th>}
                {[...Array(10).keys()].map((col) => {
                  const claim = claims.find(
                    (item) => item.row === row && item.col === col
                  );
                  return (
                    <td key={col}>
                      {claim ? (
                        <ClaimedSquare
                          row={row}
                          col={col}
                          state={state}
                          claim={claim}
                          participant={participant}
                        />
                      ) : (
                        <Square row={row} col={col} state={state} />
                      )}
                    </td>
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

function Square({ row, col, state }) {
  return (
    <div className="square">
      {state === "INIT" && (
        <button
          type="submit"
          className="square-button"
          name="square"
          // value={`${row}-${col}`}
          value={JSON.stringify({ action: "claim", row, col })}
        >
          Claim
        </button>
      )}
    </div>
  );
}

function ClaimedSquare({ row, col, state, claim, participant }) {
  if (claim?.participant === participant) {
    return (
      <div className="square claimed-self">
        {state === "INIT" ? (
          <button
            type="submit"
            className="square-button"
            name="release"
            value={`${row}-${col}`}
          >
            Release
          </button>
        ) : (
          <div>Your Square</div>
        )}
      </div>
    );
  } else {
    return (
      <div className="square claimed-other">{`Claimed by ${claim.participant}`}</div>
    );
  }
}
