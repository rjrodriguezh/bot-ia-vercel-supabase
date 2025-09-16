export async function POST(req) {
  const { message } = await req.json();

  // 1) Chequear que la variable esté presente en runtime
  const hasKey = !!process.env.OPENROUTER_API_KEY;
  console.log("OPENROUTER_API_KEY presente?", hasKey);
  if (!hasKey) {
    return Response.json(
      { ok: false, error: "Falta OPENROUTER_API_KEY en el servidor" },
      { status: 500 }
    );
  }

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // Header correcto para OpenRouter:
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // Recomendados por OpenRouter (identifican tu app/origen):
        "HTTP-Referer": "https://bot-ia-vercel-supabase.vercel.app",
        "X-Title": "bot-ia-vercel-supabase"
      },
      body: JSON.stringify({
        //model: "meta-llama/llama-3.1-8b-instruct:free",
        model: "google/gemma-7b-it:free",
        messages: [
          { role: "system", content: "Eres un asistente amable y conciso." },
          { role: "user", content: message || "" }
        ]
      })
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("OpenRouter error:", data);
      return Response.json(
        { ok: false, error: data?.error?.message || "Error API OpenRouter" },
        { status: r.status || 500 }
      );
    }

    const answer = data.choices?.[0]?.message?.content ?? "Sin respuesta del modelo.";
    return Response.json({ ok: true, answer });

  } catch (e) {
    console.error("Fallo al conectar con OpenRouter:", e);
    return Response.json({ ok: false, error: "No se pudo conectar con OpenRouter" }, { status: 500 });
  }
}
