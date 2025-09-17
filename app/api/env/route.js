export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    hasCF: !!process.env.CF_ACCOUNT_ID && !!process.env.CF_API_TOKEN,
    vercelEnv: process.env.VERCEL_ENV || 'unknown'
  });
}
