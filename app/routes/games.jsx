import { Link, Outlet, useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request }) => {
  const user = await getUser(request);

  return { user };
};

export default function GamesRoute() {
  const { user } = useLoaderData();
  return (
    <div>
      <h1>
        <Link to="/games">Games</Link>
      </h1>
      <div>
        Hi {user.username}{" "}
        <form action="/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </div>
      <Outlet />
    </div>
  );
}
