export async function POST(req) {
  const { message } = await req.json();
  // Por ahora: responder con echo (para probar deploy sin IA)
  return Response.json({ ok: true, answer: `Echo: ${message ?? ""}` });
}
