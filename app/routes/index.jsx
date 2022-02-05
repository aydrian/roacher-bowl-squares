import { Form, Link, redirect, useActionData, useSearchParams } from "remix";
import { createUserSession, getUserId, login } from "~/utils/session.server";
import stylesUrl from "~/styles/login.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/games");
  }
  return { ok: true };
};

function validateUsername(username) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

const badRequest = (data) => json(data, { status: 400 });

export const action = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/games";
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const user = await login({ username, password });
  if (!user) {
    return badRequest({
      fields,
      formError: `Username/Password combination is incorrect`
    });
  }
  return createUserSession(user.id, redirectTo);
};

export default function Index() {
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  return (
    <>
      <header>
        <img src="/rbs-logo.svg" width={190} style={{ margin: "auto" }} />
      </header>
      <main>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <label>
            Username <input type="text" name="username" />
          </label>
          <label>
            Password <input type="password" name="password" />
          </label>
          <div className="login-action-wrapper">
            <Link
              to="/register"
              className="button secondary"
              style={{ width: "130px" }}
            >
              Register
            </Link>
            <button
              type="submit"
              className="button primary"
              style={{ width: "130px" }}
            >
              Log in
            </button>
          </div>
        </Form>
      </main>
    </>
  );
}
