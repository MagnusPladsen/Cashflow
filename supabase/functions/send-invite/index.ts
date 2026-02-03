// Supabase Edge Function: send-invite
// Requires RESEND_API_KEY and FROM_EMAIL set in Supabase function env.

import { serve } from "https://deno.land/std@0.204.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL");

serve(async (req) => {
  try {
    if (!RESEND_API_KEY || !FROM_EMAIL) {
      return new Response(JSON.stringify({ error: "Missing email config" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { email, householdName, inviteUrl } = await req.json();

    if (!email || !inviteUrl) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const subject = `You're invited to join ${householdName ?? "a household"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>You're invited</h2>
        <p>You have been invited to join <strong>${householdName ?? "a household"}</strong> on Cashflow.</p>
        <p><a href="${inviteUrl}">Accept invitation</a></p>
        <p>If the button doesn't work, copy this link: ${inviteUrl}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
