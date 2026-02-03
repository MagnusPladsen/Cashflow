# Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Run `supabase/invites.sql` to enable invite acceptance for new members.
4. Run `supabase/presence.sql` to enable realtime updates for budget item tables.
5. Run `supabase/audit.sql` to track who updated items.
6. Run `supabase/activity.sql` to enable activity logs.
7. Run `supabase/ownership.sql` to prevent removing the last owner.
8. Run `supabase/activity-links.sql` to deep-link activity entries.
9. Run `supabase/invite-tokens.sql` to enable tokenized invites.
10. Run `supabase/households-default.sql` to default `created_by` on insert.
11. Run `supabase/households-rls-fix.sql` to allow initial owner creation.
12. Enable Auth providers (Apple, Google, Email) in the Supabase dashboard.
13. Deploy the `send-invite` edge function and set `RESEND_API_KEY` and `FROM_EMAIL`.
14. Add environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Notes:
- The schema includes Row Level Security policies and helper functions.
- Policies are not idempotent; if re-running, drop existing policies first.
