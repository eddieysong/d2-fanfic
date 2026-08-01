import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="sigil">✦</span>
      <p className="kicker">Lost waypoint</p>
      <h1>This chapter could not be found.</h1>
      <Link className="button button-primary" href="/">Return to the index</Link>
    </main>
  );
}
