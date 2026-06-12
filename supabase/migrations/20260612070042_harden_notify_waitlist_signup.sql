-- pg_net doesn't support ALTER ... SET SCHEMA; recreate it in extensions
-- schema per the Supabase security lint (its objects live in the "net"
-- schema either way, so this doesn't affect net.http_post calls).
drop extension pg_net;
create extension pg_net with schema extensions;

-- This function only needs to run as a trigger, not as a callable RPC
revoke execute on function public.notify_waitlist_signup() from public, anon, authenticated;
