-- Enable pg_net so Postgres can make outbound HTTP requests
create extension if not exists pg_net;

-- Forward new waitlist signups to the notify-waitlist-signup edge function,
-- which emails contact@martkamdigital.com via Resend.
create or replace function public.notify_waitlist_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://xzzflafruciaqvwfszju.supabase.co/functions/v1/notify-waitlist-signup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'bf05fdcc34e2d3357ddc9f562b92e153a88df930c885ba1f'
    ),
    body := jsonb_build_object('record', row_to_json(new))
  );
  return new;
end;
$$;

drop trigger if exists on_waitlist_insert_notify on public.waitlist;

create trigger on_waitlist_insert_notify
after insert on public.waitlist
for each row execute function public.notify_waitlist_signup();
