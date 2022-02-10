import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, useLoaderData } from "remix";
import Pusher from "pusher-js";
import { Grid, links as gameGridLinks } from "~/components/game-grid";
import { ScoreBoard, links as scoreBoardLinks } from "~/components/score-board";
import {
  claimSquare,
  countClaims,
  getGame,
  getParticipants,
  lockScore,
  releaseSquare,
  startGame,
  updateScore
} from "~/utils/game-logic.server";
import { sendRefresh } from "~/utils/pusher.server";
import { requireUserId } from "~/utils/session.server";
import stylesUrl from "~/styles/games/game.css";
import {
  PayoutBoard,
  links as payoutBoardLinks
} from "~/components/payout-board";

export const links = () => [
  ...gameGridLinks(),
  ...scoreBoardLinks(),
  ...payoutBoardLinks(),
  { rel: "stylesheet", href: stylesUrl }
];

export const loader = async ({ request, params }) => {
  const participantId = await requireUserId(request);

  let game = await getGame(params.gameId);
  const isHost = participantId === game.hostId;
  const numClaims = await countClaims(game.id, participantId);
  const participants = await getParticipants(game.id);

  BigInt.prototype.toJSON = function () {
    return Number(this);
  };

  return { game, isHost, participantId, numClaims, participants };
};

export const action = async ({ params, request }) => {
  const { gameId } = params;
  const participantId = await requireUserId(request);
  const form = await request.formData();

  if (form.has("sqAction")) {
    const sqAction = form.get("sqAction");
    if (sqAction === "claim") {
      await claimSquare(
        gameId,
        participantId,
        form.get("row"),
        form.get("col")
      );
    } else if (sqAction === "release") {
      await releaseSquare(form.get("claimId"));
    }
    await sendRefresh(gameId, participantId);
    return "ok";
  }
  if (form.has("gameAction")) {
    const gameAction = form.get("gameAction");
    if (gameAction === "start") {
      await startGame(gameId);
    }
    await sendRefresh(gameId, participantId);
    return "ok";
  }
  if (form.has("scoreAction")) {
    const scoreAction = form.get("scoreAction");
    const score1 = parseInt(form.get("score1"));
    const score2 = parseInt(form.get("score2"));
    if (scoreAction === "lockIn") {
      console.log(`Lock In ${score1}-${score2}`);
      await lockScore(gameId, score1, score2);
    } else if (scoreAction === "update") {
      console.log(`Update ${score1}-${score2}`);
      await updateScore(gameId, score1, score2);
    }
    await sendRefresh(gameId, participantId);
    return "ok";
  }
  // console.log("Got a request", form);
  return "ok";
};

export default function GameRoute() {
  const { game, isHost, participantId, numClaims, participants } =
    useLoaderData();
  let navigate = useNavigate();
  const remainingSquares = 100 - game.claims.length;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  if (game.state !== "FINAL") {
    useEffect(() => {
      // Pusher.logToConsole = true;
      const pusher = new Pusher(window.ENV.PUSHER_KEY, {
        cluster: window.ENV.PUSHER_CLUSTER
      });

      const channel = pusher.subscribe(game.id);
      channel.bind("refresh", function (event) {
        if (event.participantId !== participantId) {
          navigate(".", { replace: true });
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }, []);
  }

  return (
    <div>
      <div className="title-wrapper">
        <h5>{game.slug}</h5>{" "}
        {game.state === "INIT" && (
          <div className="instructions">
            <div>Select the squares you'd like to claim.</div>
            <div className="claim-cost">
              {formatter.format(game.claimCost)} / square
            </div>
          </div>
        )}
      </div>
      {false && (
        <p>
          Participants: {participants.length}{" "}
          {game.state === "INIT" &&
            `Remaining Squares: 
        ${remainingSquares}`}
        </p>
      )}
      <Grid game={game} participantId={participantId} />
      {game.state === "INIT" && (
        <div className="claim-totals">
          <div>
            <span className="claim-number">{numClaims}</span> squares claimed
          </div>
          <div>
            <span className="claim-number">
              {formatter.format(numClaims * game.claimCost)}
            </span>{" "}
            total cost
          </div>
        </div>
      )}
      {isHost && game.state === "INIT" && remainingSquares === 0 && (
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <Form replace method="post" className="start-form-wrapper">
            <button
              type="submit"
              className="button primary"
              name="gameAction"
              value="start"
            >
              Start
            </button>
          </Form>
        </div>
      )}
      {game.state !== "INIT" && (
        <>
          <ScoreBoard game={game} isHost={isHost} />
          <h5>Player Payouts</h5>
          <PayoutBoard winners={game.winners} claimCost={game.claimCost} />
        </>
      )}
    </div>
  );
}
