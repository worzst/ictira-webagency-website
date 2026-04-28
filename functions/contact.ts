interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
  TURNSTILE_SECRET: string;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, string>;

  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Honeypot — bots fill this, humans don't
  if (data._hp) {
    return Response.json({ ok: true }); // silent reject
  }

  // Turnstile verification
  const token = data['cf-turnstile-response'];
  if (!token) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token }),
  });
  const { success } = await verify.json() as { success: boolean };
  if (!success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { name, email, firm, phone, pack, message, _source } = data;

  if (!name?.trim() || !email?.trim()) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const source = _source?.trim() || 'Unbekannt';

  const html = `
    <p><strong>Quelle:</strong> ${escape(source)}</p>
    <hr>
    <p><strong>Name:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escape(email)}">${escape(email)}</a></p>
    ${firm ? `<p><strong>Firma:</strong> ${escape(firm)}</p>` : ''}
    ${phone ? `<p><strong>Telefon:</strong> ${escape(phone)}</p>` : ''}
    ${pack ? `<p><strong>Paket:</strong> ${escape(pack)}</p>` : ''}
    ${message ? `<p><strong>Nachricht:</strong><br>${escape(message).replace(/\n/g, '<br>')}</p>` : ''}
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      reply_to: email,
      subject: `[${source}] Neue Anfrage von ${name}${firm ? ` · ${firm}` : ''}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error:', await res.text());
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
};
