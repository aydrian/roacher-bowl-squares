import { useLoaderData } from "remix";

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
  return <div><h2>Game {data.gameId}</h2></div>;
}
