import { Outlet } from "remix";

export default function GamesRoute() {
  return (
    <div>
      <h1>Games</h1>
      <Outlet />
    </div>
  );
}
