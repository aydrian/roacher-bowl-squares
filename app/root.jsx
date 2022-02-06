import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "remix";

import globalStylesUrl from "~/styles/global.css";

export const links = () => {
  return [
    { rel: "preconnnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;600;700;800&family=Roboto:wght@500;700&display=swap"
    },
    {
      rel: "stylesheet",
      href: globalStylesUrl
    }
  ];
};

export function meta() {
  return { title: "Roacher Bowl Squares" };
}

export function loader() {
  return {
    ENV: {
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER
    }
  };
}

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
