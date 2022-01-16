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

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const hostedGames = await db.game.findMany({
    where: { hostId: userId },
    orderBy: { createdAt: "desc" }
  });
  console.log(hostedGames);

  const playingGames = await db.claim.findMany({
    select: { game: true },
    distinct: ["gameId"],
    where: { participantId: userId }
  });
  console.log(playingGames);

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
  const { hostedGames, playingGames } = useLoaderData();
  const actionData = useActionData();
  return (
    <div>
      <h2>Join Game</h2>
      <div>
        <Form method="post">
          <label>
            Code: <input type="text" name="slug" />
          </label>
          <button type="submit">Join</button>
          {actionData?.formError && <p>{actionData.formError}</p>}
        </Form>
      </div>
      <Link to="new">Create a Game</Link>
      <h2>Hosted Games</h2>
      {hostedGames.length ? (
        <ul>
          {hostedGames.map((game) => {
            return (
              <li key={game.id}>
                <Link to={game.id}>
                  {game.slug} - {game.createdAt} [{game.state}]
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>No hosted games. Create a new one.</div>
      )}
      <h2>Participating Games</h2>
      {playingGames.length ? (
        <ul>
          {playingGames.map(({ game }) => {
            return (
              <li key={game.id}>
                <Link to={game.id}>
                  {game.slug} - {game.createdAt} [{game.state}]
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>You are not participating in any games. Join one.</div>
      )}
    </div>
  );
}
