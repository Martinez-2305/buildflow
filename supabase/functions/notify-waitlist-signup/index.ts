// Sends an email via Resend whenever a new row is inserted into public.waitlist.
// Triggered by a Postgres trigger (see supabase/migrations) using pg_net, not by
// end users directly — verify_jwt is disabled and a shared secret header is
// checked instead.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");
const NOTIFY_EMAIL = "contact@martkamdigital.com";
const FROM_ADDRESS = "BuildFlow Waitlist <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response("Email service not configured", { status: 500 });
  }

  const payload = await req.json();
  const record = payload.record ?? {};
  const name = String(record.name ?? "");
  const email = String(record.email ?? "");
  const trade = String(record.trade ?? "Not specified");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: NOTIFY_EMAIL,
      subject: "New BuildFlow waitlist signup",
      html: `
        <p>A new signup just landed on the BuildFlow waiting list:</p>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml(name)}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
          <li><strong>Trade:</strong> ${escapeHtml(trade)}</li>
        </ul>
      `,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text();
    console.error("Resend error:", errorText);
    return new Response("Failed to send notification email", { status: 502 });
  }

  return new Response("OK", { status: 200 });
});
