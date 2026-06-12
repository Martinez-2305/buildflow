-- Read the shared webhook secret from Supabase Vault instead of hardcoding
-- it in migration SQL (the previous value was committed to git and has
-- been rotated).
--
-- The secret itself is created out-of-band (not via migration) with:
--   select vault.create_secret('<value>', 'waitlist_webhook_secret', '...');
create or replace function public.notify_waitlist_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret
  from vault.decrypted_secrets
  where name = 'waitlist_webhook_secret';

  perform net.http_post(
    url := 'https://xzzflafruciaqvwfszju.supabase.co/functions/v1/notify-waitlist-signup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', v_secret
    ),
    body := jsonb_build_object('record', row_to_json(new))
  );
  return new;
end;
$$;
