"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function send() {
    if (!q.trim() || loading) return;
    setLoading(true);
    setErr("");
    setA("...");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Error de respuesta");
      setA(String(data.answer || "Sin respuesta"));
    } catch (e) {
      setErr(e.message || "Error al consultar");
      setA("");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    // Enviar con Ctrl+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Bot con IA</h1>
      <p style={{ color: "#444" }}>
        Escribe tu mensaje y presiona <b>Enviar</b> (o <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).
      </p>

      <textarea
        rows={6}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
        placeholder="Ej: Dame 3 ideas de cenas saludables…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={send} disabled={loading} style={{ padding: "8px 14px", fontSize: 16 }}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
        <button
          onClick={() => { setQ(""); setA(""); setErr(""); }}
          disabled={loading}
          style={{ padding: "8px 14px", fontSize: 16 }}
        >
          Limpiar
        </button>
      </div>

      {err && (
        <div style=
