import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", color: "var(--color-casca)" }}>
          esperando Heitor
        </p>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/lab" style={{ color: "var(--color-navy)", textDecoration: "underline" }}>
            ver o ateliê →
          </Link>
        </p>
      </div>
    </main>
  );
}
