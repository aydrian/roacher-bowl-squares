import { Form, useLoaderData } from "remix";
import { Grid } from "~/components/game-grid";
import { db } from "~/utils/db.server";
import { shuffle, range } from "~/utils/helpers";
import { requireUserId } from "~/utils/session.server";
import stylesUrl from "../../styles/game.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ request, params }) => {
  const participantId = await requireUserId(request);

  const game = await db.game.findUnique({
    where: { id: params.gameId },
    include: { claims: { include: { participant: true } } }
  });
  // console.log(game);
  if (!game) {
    throw new Response("Not found.", {
      status: 404
    });
  }
  const isHost = participantId === game.hostId;

  const numClaims = await db.claim.count({
    where: { AND: [{ gameId: game.id }, { participantId }] }
  });

  const participants = await db.claim.findMany({
    select: { participant: true },
    where: { gameId: game.id },
    distinct: ["participantId"]
  });

  BigInt.prototype.toJSON = function () {
    return Number(this);
  };

  return { game, isHost, participantId, numClaims, participants };
};

export const action = async ({ params, request }) => {
  const participantId = await requireUserId(request);
  const form = await request.formData();
  if (form.has("sqAction")) {
    const sqAction = form.get("sqAction");
    if (sqAction === "claim") {
      const row = BigInt(form.get("row"));
      const col = BigInt(form.get("col"));
      await db.claim.create({
        data: { gameId: params.gameId, participantId, row, col }
      });
    } else if (sqAction === "release") {
      const claimId = form.get("claimId");
      await db.claim.delete({ where: { id: claimId } });
    }
    return "ok";
  }
  if (form.has("gameAction")) {
    const gameAction = form.get("gameAction");
    if (gameAction === "start") {
      const game = await db.game.findUnique({
        select: { board: true },
        where: { id: params.gameId }
      });

      const rows = shuffle(range(10));
      const cols = shuffle(range(10));
      const board = { ...game.board, rows, cols };
      await db.game.update({
        data: {
          state: "Q1",
          board
        },
        where: { id: params.gameId }
      });
    }
    return "ok";
  }
  console.log("Got a request", form);
  return "ok";
};

export default function GameRoute() {
  const { game, isHost, participantId, numClaims, participants } =
    useLoaderData();
  const remainingSquares = 100 - game.claims.length;
  return (
    <div>
      <h2>
        Game {game.slug} {isHost && "(hosting)"}
      </h2>
      <p>
        Participants: {participants.length} Remaining Squares:{" "}
        {remainingSquares}
      </p>
      {isHost && game.state === "INIT" && remainingSquares === 0 && (
        <div>
          <Form method="post">
            <button type="submit" name="gameAction" value="start">
              Start
            </button>
          </Form>
        </div>
      )}
      <p>
        Claimed {numClaims}, total cost: {numClaims * game.claimCost}
      </p>
      <Grid game={game} participantId={participantId} />
    </div>
  );
}
