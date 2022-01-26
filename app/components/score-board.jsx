import { Form } from "remix";

export function ScoreBoard({ game, isHost }) {
  const { board, state, scores } = game;
  const [team1 = "Team 1", team2 = "Team 2"] = board.teams;
  // scores = [[0,0], [0,0], [0,0], [0,0]]
  const quarters = [
    ["Q1", "1st Quarter"],
    ["Q2", "2nd Quarter", ["Q2", "Q3", "Q4", "FINAL"]],
    ["Q3", "3rd Quarter", ["Q3", "Q4", "FINAL"]],
    ["Q4", "4th Quarter", ["Q4", "FINAL"]]
  ];

  return (
    <div className="scoreBox-wrapper">
      <h3>Score Board</h3>
      <Form method="post" replace>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{team1}</th>
              <th>{team2}</th>
            </tr>
          </thead>
          <tbody>
            {quarters.map(([quarter, label, showFor], i) => (
              <ScoreRow
                key={quarter}
                state={state}
                scores={scores[i]}
                quarter={quarter}
                label={label}
                isHost={isHost}
                showFor={showFor}
              />
            ))}
          </tbody>
          {isHost && state !== "FINAL" && (
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <button type="submit" name="scoreAction" value="update">
                    Update
                  </button>
                  <button type="submit" name="scoreAction" value="lockIn">
                    Lock In
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </Form>
    </div>
  );
}

function ScoreRow({
  state,
  scores,
  quarter,
  label,
  isHost,
  showFor = ["Q1", "Q2", "Q3", "Q4", "FINAL"]
}) {
  return showFor.includes(state) ? (
    <tr>
      <th>{label}</th>
      <td>
        {isHost && state === quarter ? (
          <input type="number" name="score1" defaultValue={scores[0]} />
        ) : (
          <span>{scores[0]}</span>
        )}
      </td>
      <td>
        {isHost && state === quarter ? (
          <input type="number" name="score2" defaultValue={scores[1]} />
        ) : (
          <span>{scores[1]}</span>
        )}
      </td>
    </tr>
  ) : null;
}
