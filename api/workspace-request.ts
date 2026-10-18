/* ── Leadership workspace: access requests ──────────────────────────────
   Vercel serverless function. The pop-up's "Request access" form posts
   a visitor's name, work email and organization here, and this forwards
   it to Ahmad by email, with Reply-To set to the visitor so approving is
   one reply away. No meeting is needed to ask.

   Uses Resend's HTTP API (no SDK). Set in Vercel → Settings →
   Environment Variables, then redeploy:

     RESEND_API_KEY          API key from resend.com
     WORKSPACE_REQUEST_TO    where requests arrive, e.g. your inbox
     WORKSPACE_REQUEST_FROM  optional verified sender, e.g.
                             "Portfolio <access@deeb.design>"
                             (defaults to Resend's onboarding sender)

   Until these are set the function answers 503 and the pop-up falls back
   to a pre-filled email, so no request is lost. Add a Vercel Firewall
   rate-limit rule on /api/workspace-request against spam. */

declare const process: { env: Record<string, string | undefined> };

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
};

function reply(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().replace(/[\r\n]+/g, ' ').slice(0, max) : '';
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return reply(400, { error: 'bad_request' });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(body.website, 200)) return reply(200, { ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const organization = clean(body.organization, 160);
  const area = clean(body.area, 120);
  if (!name || !organization || !EMAIL_RE.test(email)) return reply(400, { error: 'invalid' });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.WORKSPACE_REQUEST_TO;
  if (!apiKey || !to) return reply(503, { error: 'not_configured' });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.WORKSPACE_REQUEST_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `Workspace access request: ${name}, ${organization}`,
      text: [
        'New request for the Leadership & Strategy workspace.',
        '',
        `Name:          ${name}`,
        `Work email:    ${email}`,
        `Organization:  ${organization}`,
        `Started from:  ${area || 'not specified'}`,
        '',
        'Reply to this email with the password to approve.',
      ].join('\n'),
    }),
  });

  if (!res.ok) return reply(502, { error: 'send_failed' });
  return reply(200, { ok: true });
}

/* Lets the pop-up decide, before showing a form, whether requests can be
   sent automatically. When this returns false (or the API is unreachable)
   visitors get direct contact options instead of a form that would fail. */
export async function GET() {
  const enabled = Boolean(process.env.RESEND_API_KEY && process.env.WORKSPACE_REQUEST_TO);
  return reply(200, { enabled });
}
