import { useLoaderData } from "remix";
import { Grid } from "~/components/game-grid";
import stylesUrl from "../../styles/game.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ request, params }) => {
  //const userId = await getUserId(request);
  /*const joke = await db.joke.findUnique({
    where: { id: params.jokeId }
  });
  if (!joke) {
    throw new Response("What a joke! Not found.", {
      status: 404
    });
  }
  const data: LoaderData = {
    joke,
    isOwner: userId === joke.jokesterId
  };
  return data;*/
  return { gameId: params.gameId };
};

export default function GameRoute() {
  const data = useLoaderData();
  return (
    <div>
      <h2>Game {data.gameId}</h2>
      <Grid
        rows={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        cols={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        state="INIT"
        claims={[
          { row: 1, col: 5, participant: "Bob" },
          { row: 2, col: 2, participant: "Sally" }
        ]}
        participant="Bob"
      />
    </div>
  );
}
