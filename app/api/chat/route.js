export async function POST(req) {
  const { message } = await req.json();

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Eres un asistente amable y conciso." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await r.json();
    const answer = data.choices?.[0]?.message?.content ?? "No tuve respuesta.";

    return Response.json({ ok: true, answer });
  } catch (err) {
    console.error("Error en /api/chat:", err);
    return Response.json({ ok: false, error: "Error al conectar con OpenAI" }, { status: 500 });
  }
}
