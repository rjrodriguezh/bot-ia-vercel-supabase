export async function POST(req) {
  const { message } = await req.json();

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // opcionales pero recomendados:
        "HTTP-Referer": "https://bot-ia-vercel-supabase.vercel.app",
        "X-Title": "bot-ia-vercel-supabase"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: "Eres un asistente amable y conciso." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("Error OpenRouter:", data);
      return Response.json({ ok: false, error: data.error?.message || "Error API" }, { status: 500 });
    }

    const answer = data.choices?.[0]?.message?.content ?? "No tuve respuesta.";
    return Response.json({ ok: true, answer });

  } catch (err) {
    console.error("Error en /api/chat:", err);
    return Response.json({ ok: false, error: "Error al conectar con OpenRouter" }, { status: 500 });
  }
}
