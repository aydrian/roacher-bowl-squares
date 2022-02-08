import { Link, Outlet, useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";
import stylesUrl from "~/styles/games.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ request }) => {
  const user = await getUser(request);

  return { user };
};

export default function GamesRoute() {
  const { user } = useLoaderData();
  return (
    <div>
      <header>
        <Link to="/games">
          <img src="/rbs-logo.svg" width={80} />
        </Link>
        <div className="user-wrapper">
          Hello, <span>{user.username}</span>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="button primary"
              style={{ width: "75px", padding: "5px" }}
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="max-width-wrapper">
        <Outlet />
      </main>
    </div>
  );
}
