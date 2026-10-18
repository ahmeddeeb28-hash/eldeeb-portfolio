/* ── Leadership workspace unlock ─────────────────────────────────────────
   Vercel serverless function. The landing page's Leadership & Strategy
   pop-up posts the visitor's password here; the password and the private
   links never appear in the site's code, which is public on GitHub.

   Set two environment variables in Vercel (Project → Settings →
   Environment Variables), then redeploy:

     WORKSPACE_PASSWORD   the password you share with recruiters
     WORKSPACE_LINKS      JSON, keyed by area id, for example
       {
         "strategy":   [{ "label": "Product vision deck", "href": "https://…" }],
         "operations": [{ "label": "Referral — Head of Product, Sary", "href": "https://…" }],
         "systems": [], "analytics": [], "research": [], "playbooks": []
       }

   Area ids match the `id` of each card in components/LeadershipStrategy.tsx.
   For brute-force protection, also add a Vercel Firewall rate-limit rule
   on /api/workspace-unlock (Project → Firewall → Rules). */

declare const process: { env: Record<string, string | undefined> };

type WorkspaceLink = { label: string; href: string };

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
};

function reply(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
}

/* Compares fixed-length digests in constant time, so response timing does
   not reveal how much of a guess was right. */
async function passwordMatches(guess: string, expected: string) {
  const [a, b] = await Promise.all([digest(guess), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function readLinks(): Record<string, WorkspaceLink[]> {
  try {
    const parsed = JSON.parse(process.env.WORKSPACE_LINKS || '{}');
    const out: Record<string, WorkspaceLink[]> = {};
    for (const [area, links] of Object.entries(parsed)) {
      if (!Array.isArray(links)) continue;
      out[area] = links.filter(
        (l): l is WorkspaceLink =>
          !!l && typeof l.label === 'string' && typeof l.href === 'string' && /^https:\/\//.test(l.href),
      );
    }
    return out;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const expected = process.env.WORKSPACE_PASSWORD;
  if (!expected) return reply(503, { error: 'not_configured' });

  let password = '';
  try {
    const body = await request.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return reply(400, { error: 'bad_request' });
  }
  if (!password || password.length > 200) return reply(400, { error: 'bad_request' });

  if (!(await passwordMatches(password, expected))) {
    // A short pause on every miss slows down guessing.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return reply(401, { error: 'wrong_password' });
  }

  return reply(200, { links: readLinks() });
}
