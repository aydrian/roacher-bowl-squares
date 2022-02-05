import { Form } from "remix";
import stylesUrl from "~/styles/login.css";

export const links = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  // const actionData = useActionData();
  return (
    <>
      <header>
        <img src="/rbs-logo.svg" width={190} style={{ margin: "auto" }} />
      </header>
      <main>
        <Form method="post">
          <label>
            Username <input type="text" name="username" />
          </label>
          <label>
            Password <input type="password" name="password" />
          </label>
          <label>
            User ID (3 characters) <input type="text" maxLength={3} />
          </label>
          <div className="login-action-wrapper">
            <button
              type="submit"
              className="button primary"
              style={{ width: "130px" }}
            >
              Start
            </button>
          </div>
        </Form>
      </main>
    </>
  );
}
