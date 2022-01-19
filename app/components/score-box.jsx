import { Form, useSubmit } from "remix";

export function ScoreBox({ gameState, scores }) {
  // score = [[0,0], [0,0], [0,0], [0,0]]
  const submit = useSubmit();

  function handleChange(event) {
    submit(event.currentTarget);
  }

  return (
    <div className="scoreBox-wrapper">
      <h3>Score Box</h3>
      <Form method="post" replace>
        <input type="hidden" name="_form" value="scorebox" />
        <div>
          <label>
            1st Quarter:{" "}
            {gameState === "Q1" ? (
              <>
                <input type="text" name="score1" placeholder="Team 1" />
                <input type="text" name="score2" placeholder="Team 2" />
              </>
            ) : (
              <span>
                {scores[0][0]}-{scores[0][1]}
              </span>
            )}
          </label>
        </div>
        {["Q2", "Q3", "Q4", "FINAL"].includes(gameState) && (
          <div>
            <label>
              Second Quarter:{" "}
              {gameState === "Q2" ? (
                <input type="text" name="score" />
              ) : (
                <span>{scores[1]}</span>
              )}
            </label>
          </div>
        )}
        {["Q3", "Q4", "FINAL"].includes(gameState) && (
          <div>
            <label>
              Third Quarter:{" "}
              {gameState === "Q3" ? (
                <input type="text" name="score" />
              ) : (
                <span>{scores[2]}</span>
              )}
            </label>
          </div>
        )}
        {["Q4", "FINAL"].includes(gameState) && (
          <div>
            <label>
              Four Quarter:{" "}
              {gameState === "Q4" ? (
                <input type="text" name="score" />
              ) : (
                <span>{scores[3]}</span>
              )}
            </label>
          </div>
        )}
        {gameState !== "FINAL" && (
          <button type="submit" name="scoreAction" value="lockIn">
            Lock In
          </button>
        )}
      </Form>
    </div>
  );
}
