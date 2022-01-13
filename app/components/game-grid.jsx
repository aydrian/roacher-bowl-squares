export function Grid({
  rows = [],
  cols = [],
  claims = [],
  state = "INIT",
  participant = ""
}) {
  return (
    <div className="grid-wrapper">
      <div className="headers-top">
        {rows.map((i) => {
          return <Header key={i}>{i}</Header>;
        })}
      </div>
      <div className="headers-side">
        {cols.map((i) => {
          return <Header key={i}>{i}</Header>;
        })}
      </div>
      <div className="grid">
        {[...Array(100).keys()].map((i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const claim = claims.find(
            (item) => item.row === row && item.col === col
          );
          return claim ? (
            <ClaimedSquare
              key={i}
              row={row}
              col={col}
              state={state}
              claim={claim}
              participant={participant}
            />
          ) : (
            <Square key={i} row={row} col={col} state={state} />
          );
        })}
      </div>
    </div>
  );
}

function Header({ children }) {
  return <div className="header">{children}</div>;
}

function Square({ row, col, state }) {
  return (
    <div className="square">
      {state === "INIT" && <button className="square-button">Claim</button>}
    </div>
  );
}

function ClaimedSquare({ row, col, state, claim, participant }) {
  if (claim?.participant === participant) {
    return (
      <div className="square claimed-self">
        {state === "INIT" ? (
          <button className="square-button">Release</button>
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
