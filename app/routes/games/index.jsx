import { useState } from "react";
import {
  Link,
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData
} from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import dialogStyleUrl from "@reach/dialog/styles.css";
import { GameList, links as gameListLinks } from "~/components/game-list";

export const links = () => [
  ...gameListLinks(),
  { rel: "stylesheet", href: dialogStyleUrl }
  //{ rel: "stylesheet", href: styles }
];

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const hostedGames = await db.game.findMany({
    where: { hostId: userId },
    orderBy: { createdAt: "desc" }
  });

  const claims = await db.claim.findMany({
    select: { game: true },
    distinct: ["gameId"],
    where: { participantId: userId }
  });
  const playingGames = claims.map((claim) => claim.game);

  return { hostedGames, playingGames };
};

const badRequest = (data) => json(data, { status: 400 });

export const action = async ({ request }) => {
  const form = await request.formData();
  const slug = form.get("slug");
  const game = await db.game.findUnique({
    select: { id: true },
    where: { slug }
  });

  if (!game) {
    return badRequest({
      formError: `No game found using that code.`
    });
  }

  return redirect(`/games/${game.id}`);
};

export default function Index() {
  const [showDialog, setShowDialog] = useState(false);
  const { hostedGames, playingGames } = useLoaderData();
  const actionData = useActionData();
  return (
    <div>
      <h2>Hosted Games</h2>
      <Link to="new">Create a Game</Link>
      {hostedGames.length ? (
        <GameList games={hostedGames} />
      ) : (
        <div>No hosted games. Create a new one.</div>
      )}
      <h2>Participating Games</h2>
      <button
        type="button"
        className="button primary"
        onClick={() => setShowDialog(true)}
      >
        Join a game
      </button>
      <DialogOverlay
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
        style={{ backgroundColor: "hsla(0, 0%, 10%, 0.96)" }}
      >
        <DialogContent
          aria-label="Join a game"
          style={{ borderRadius: "15px" }}
        >
          <Form method="post">
            <label>
              Game code: <input type="text" name="slug" />
            </label>
            <button type="submit" className="button primary">
              Join now
            </button>
            {actionData?.formError && <p>{actionData.formError}</p>}
          </Form>
        </DialogContent>
      </DialogOverlay>
      {playingGames.length ? (
        <GameList games={playingGames} />
      ) : (
        <div>You are not participating in any games. Join one.</div>
      )}
    </div>
  );
}
