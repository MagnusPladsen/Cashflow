# Supabase Setup

1. Create a Supabase project.
1. Open the SQL editor and run `supabase/schema.sql`.
2. Run `supabase/invites.sql` to enable invite acceptance for new members.
3. Run `supabase/presence.sql` to enable realtime updates for budget item tables.
4. Run `supabase/audit.sql` to track who updated items.
5. Run `supabase/activity.sql` to enable activity logs.
6. Run `supabase/ownership.sql` to prevent removing the last owner.
7. Run `supabase/activity-links.sql` to deep-link activity entries.
8. Run `supabase/invite-tokens.sql` to enable tokenized invites.
9. Enable Auth providers (Apple, Google, Email) in the Supabase dashboard.
10. Deploy the `send-invite` edge function and set `RESEND_API_KEY` and `FROM_EMAIL`.
11. Add environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Notes:
- The schema includes Row Level Security policies and helper functions.
- Policies are not idempotent; if re-running, drop existing policies first.
