export const runtime = 'nodejs';

const CANDIDATES = [
  "google/gemma-7b-it:free",
  "openchat/openchat-7b:free",
  "gryphe/mythomax-l2-13b:free",
  "qwen/qwen-2-7b-instruct:free",
];

async function ask(model, message) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://example.com",
      "X-Title": "bot-ia-vercel-supabase"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Eres un asistente amable y conciso." },
        { role: "user", content: message || "" }
      ]
    })
  });
  const data = await r.json();
  return { ok: r.ok, status: r.status, data };
}

export async function POST(req) {
  const { message } = await req.json();
  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json({ ok:false, error:"Falta OPENROUTER_API_KEY" }, { status:500 });
  }

  for (const model of CANDIDATES) {
    const { ok, status, data } = await ask(model, message);
    if (ok) {
      const answer = data.choices?.[0]?.message?.content ?? "Sin respuesta del modelo.";
      return Response.json({ ok:true, answer, model });
    }
    // Si es “No endpoints found” o rate limit, probamos el siguiente
    const msg = data?.error?.message || "";
    if (msg.includes("No endpoints found") || status === 429) {
      console.warn(`Modelo sin capacidad (${model}):`, msg);
      continue;
    }
    // Otros errores: devuelve el detalle
    return Response.json({ ok:false, error: msg || "Error API OpenRouter", model }, { status: status||500 });
  }

  return Response.json({ ok:false, error:"No hay modelos :free disponibles ahora. Intenta de nuevo en unos minutos." }, { status:503 });
}
