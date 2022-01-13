import {Link } from "remix";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Roacher Bowl Squares</h1>
      <h2>A Super Bowl Squares app using CockroachDB Serverless</h2>
      <Link to="/games">Enter</Link>
    </div>
  );
}
