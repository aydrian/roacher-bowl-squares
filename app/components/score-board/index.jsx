import { useState } from "react";
import { Form } from "remix";
import styles from "./styles.css";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import dialogStyleUrl from "@reach/dialog/styles.css";

export const links = () => [
  { rel: "stylesheet", href: dialogStyleUrl },
  { rel: "stylesheet", href: styles }
];

const quarters = [
  ["Q1"],
  ["Q2", ["Q2", "Q3", "Q4", "FINAL"]],
  ["Q3", ["Q3", "Q4", "FINAL"]],
  ["Q4", ["Q4", "FINAL"]]
];

export function ScoreBoard({ game, isHost }) {
  // TODO: Make dialog close on submit
  const [showDialog, setShowDialog] = useState(false);
  const { board, state, scores } = game;
  const [team1 = "Team 1", team2 = "Team 2"] = board.teams;

  return (
    <div className="score-board-wrapper">
      <div className="score-board-list">
        {quarters.map(([quarter, showFor], i) => {
          return (
            <QuarterScores
              key={quarter}
              state={state}
              quarter={quarter}
              scores={scores[i]}
              showFor={showFor}
            />
          );
        })}
      </div>
      {isHost && state !== "FINAL" ? (
        <>
          <button
            type="button"
            className="button primary"
            onClick={() => setShowDialog(true)}
          >
            Update Score
          </button>
          <DialogOverlay
            isOpen={showDialog}
            onDismiss={() => setShowDialog(false)}
            style={{
              paddingLeft: "20px",
              paddingRight: "20px",
              backgroundColor: "hsla(0, 0%, 10%, 0.96)"
            }}
          >
            <DialogContent
              aria-label="Join a game"
              style={{ width: "auto", borderRadius: "15px" }}
            >
              <h3>{game.slug}</h3>
              <p>Score Keeping</p>
              <EditScoreBoard game={game} isHost={isHost} />
            </DialogContent>
          </DialogOverlay>
        </>
      ) : null}
    </div>
  );
}

export function EditScoreBoard({ game, isHost }) {
  const { board, state, scores } = game;
  const [team1 = "Team 1", team2 = "Team 2"] = board.teams;
  // scores = [[0,0], [0,0], [0,0], [0,0]]

  return (
    <div className="edit-score-board">
      <Form method="post" replace>
        <table className="score-board">
          <thead>
            <tr>
              <th></th>
              <th>{team1}</th>
              <th>{team2}</th>
            </tr>
          </thead>
          <tbody>
            {quarters.map(([quarter, showFor], i) => (
              <ScoreRow
                key={quarter}
                state={state}
                scores={scores[i]}
                quarter={quarter}
                isHost={isHost}
                showFor={showFor}
              />
            ))}
          </tbody>
          {isHost && state !== "FINAL" && (
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <div className="button-wrapper">
                    <button
                      type="submit"
                      className="button primary"
                      name="scoreAction"
                      value="update"
                    >
                      Update
                    </button>
                    <button
                      type="submit"
                      className="button secondary"
                      name="scoreAction"
                      value="lockIn"
                    >
                      Lock In
                    </button>
                  </div>
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
  isHost,
  showFor = ["Q1", "Q2", "Q3", "Q4", "FINAL"]
}) {
  return showFor.includes(state) ? (
    <tr>
      <th>{quarter}</th>
      <td>
        {isHost && state === quarter ? (
          <input
            type="number"
            className="input-score-number"
            name="score1"
            defaultValue={scores[0]}
          />
        ) : (
          <span>{scores[0]}</span>
        )}
      </td>
      <td>
        {isHost && state === quarter ? (
          <input
            type="number"
            className="input-score-number"
            name="score2"
            defaultValue={scores[1]}
          />
        ) : (
          <span>{scores[1]}</span>
        )}
      </td>
    </tr>
  ) : null;
}

function QuarterScores({
  state,
  quarter,
  scores,
  showFor = ["Q1", "Q2", "Q3", "Q4", "FINAL"]
}) {
  // TODO: dim quarters not in showFor
  return (
    <div className="quarter-scores">
      <div className="quarter-title">{quarter}</div>
      <div className="quarter-score team1">{scores && scores[0]}</div>
      <div className="quarter-score team2">{scores && scores[1]}</div>
    </div>
  );
}
