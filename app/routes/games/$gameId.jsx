import { Form, useLoaderData } from "remix";
import { Grid } from "~/components/game-grid";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import stylesUrl from "../../styles/game.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ request, params }) => {
  const participantId = await requireUserId(request);
  if (params.gameId === "test") {
    const game = {
      id: "test",
      slug: "test",
      state: "INIT",
      board: {
        teams: ["Team 1", "Team 2"],
        rows: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      },
      claims: [
        { row: 1, col: 5, participant: "Bob" },
        { row: 2, col: 2, participant: "Sally" }
      ]
    };
    const isHost = true;
    return { game, isHost, participantId };
  }
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

  BigInt.prototype.toJSON = function () {
    return Number(this);
  };

  return { game, isHost, participantId };
};

export const action = async ({ params, request }) => {
  const participantId = await requireUserId(request);
  const form = await request.formData();
  if (form.has("sqAction")) {
    const sqAction = form.get("sqAction");
    if (sqAction === "claim") {
      const row = BigInt(form.get("row"));
      const col = BigInt(form.get("col"));
      console.log(`Claiming square at (${row}, ${col})`);
      await db.claim.create({
        data: { gameId: params.gameId, participantId, row, col }
      });
    } else if (sqAction === "release") {
      const claimId = form.get("claimId");
      console.log(`Releasing claim with id ${claimId}`);
      await db.claim.delete({ where: { id: claimId } });
    }
    return "hello";
  }
  console.log("Got a request", form);
  return "hello";
};

export default function GameRoute() {
  const { game, isHost, participantId } = useLoaderData();
  return (
    <div>
      <h2>Game {game.slug}</h2>
      <p>Remaining Squares: {100 - game.claims.length}</p>
      <Grid game={game} participantId={participantId} />
    </div>
  );
}
