export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    vercelEnv: process.env.VERCEL_ENV || 'unknown'
  });
}
