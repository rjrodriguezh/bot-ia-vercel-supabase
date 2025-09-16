"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  async function send() {
    setA("...");
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q })
    });
    const data = await r.json();
    setA(String(data.answer ?? "Sin respuesta"));
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Bot con IA (base)</h1>
      <p>Por ahora solo hace echo del mensaje. Luego agregamos IA y BD.</p>
      <textarea
        rows={5}
        style={{ width: "100%", padding: 8 }}
        placeholder="Escribe tu mensaje…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={send}>Enviar</button>
      </div>
      <pre style={{ background: "#f3f3f3", padding: 12, marginTop: 16 }}>{a}</pre>
    </main>
  );
}
