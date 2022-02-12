import { Form, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import {
  uniqueNamesGenerator,
  adjectives,
  animals
} from "unique-names-generator";

export const loader = async ({ request }) => {
  await requireUserId(request);
  const randomSlug = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2
  });

  return { randomSlug };
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();

  const slug = form.get("slug");
  const team1 = form.get("team1");
  const team2 = form.get("team2");
  const claimCost = form.get("claimCost");

  const game = await db.game.create({
    data: {
      slug,
      claimCost,
      board: { teams: [team1, team2] },
      hostId: userId
    }
  });

  return redirect(`/games/${game.id}`);
};

export default function NewGameRoute() {
  const { randomSlug } = useLoaderData();
  return (
    <div>
      <h2>New game</h2>
      <div className="form-wrapper">
        <Form method="post">
          <div>
            <label>
              Code: <input type="text" name="slug" defaultValue={randomSlug} />
            </label>
          </div>
          <div>
            <label>
              Team 1:{" "}
              <input type="text" name="team1" defaultValue="Los Angeles Rams" />
            </label>
          </div>
          <div>
            <label>
              Team 2:{" "}
              <input
                type="text"
                name="team2"
                defaultValue="Cincinnati Bengals"
              />
            </label>
          </div>
          <div>
            <label>
              Cost per Square: <input type="number" name="claimCost" />
            </label>
          </div>
          <button type="submit" className="button primary">
            Start
          </button>
        </Form>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
