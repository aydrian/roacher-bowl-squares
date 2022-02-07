import { Form, useActionData } from "remix";
import { db } from "~/utils/db.server";
import { createUserSession, register } from "~/utils/session.server";
import stylesUrl from "~/styles/index.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
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

function validateUserId(userid) {
  if (typeof userid !== "string" || userid.length !== 3) {
    return `User ID must be 3 characters long`;
  }
}

const badRequest = (data) => json(data, { status: 400 });

export const action = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const userid = form.get("userid");
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof userid !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    });
  }

  const fields = { username, password, userid };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
    userid: validateUserId(userid)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const userExists = await db.user.findFirst({
    where: { username }
  });
  if (userExists) {
    return badRequest({
      fields,
      formError: `User with username ${username} already exists`
    });
  }
  const user = await register({ username, password, userid });
  if (!user) {
    return badRequest({
      fields,
      formError: `Something went wrong trying to create a new user.`
    });
  }
  return createUserSession(user.id, "/games");
};

export default function Index() {
  const actionData = useActionData();
  return (
    <>
      <header>
        <img src="/rbs-logo.svg" width={190} style={{ margin: "auto" }} />
      </header>
      <main>
        <h1>New user</h1>
        <div className="form-wrapper">
          <Form method="post">
            <div>
              <label>
                Username{" "}
                <input
                  type="text"
                  name="username"
                  defaultValue={actionData?.fields?.username}
                  aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                  aria-describedby={
                    actionData?.fieldErrors?.username
                      ? "username-error"
                      : undefined
                  }
                />
              </label>
              {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="username-error"
                >
                  {actionData?.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  defaultValue={actionData?.fields?.password}
                  aria-invalid={
                    Boolean(actionData?.fieldErrors?.password) || undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                />
              </label>
              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData?.fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div>
              <label>
                User ID (3 characters){" "}
                <input
                  type="text"
                  name="userid"
                  maxLength={3}
                  defaultValue={actionData?.fields?.userid}
                  aria-invalid={
                    Boolean(actionData?.fieldErrors?.userid) || undefined
                  }
                  aria-describedby={
                    actionData?.fieldErrors?.userid ? "userid-error" : undefined
                  }
                />
              </label>
              {actionData?.fieldErrors?.userid ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="userid-error"
                >
                  {actionData?.fieldErrors.userid}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData?.formError}
                </p>
              ) : null}
            </div>
            <div className="form-action-wrapper">
              <button
                type="submit"
                className="button primary"
                style={{ width: "130px" }}
              >
                Start
              </button>
            </div>
          </Form>
        </div>
      </main>
    </>
  );
}
