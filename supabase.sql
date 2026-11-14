-- Supabase > SQL Editor > New query > paste > Run
-- (borra la tabla si ya existía de un intento anterior; no pierdes nada si estaba vacía)

drop table if exists public.wishes;

create table public.wishes (
  id uuid not null default gen_random_uuid (),
  message text not null,
  created_at timestamp with time zone not null default now(),
  constraint wishes_pkey primary key (id),
  constraint wishes_message_check check (
    char_length(trim(both from message)) >= 1
    and char_length(trim(both from message)) <= 500
  )
) tablespace pg_default;

alter table public.wishes enable row level security;

create policy "Leer deseos"
  on public.wishes for select
  to anon, authenticated
  using (true);

create policy "Publicar deseos"
  on public.wishes for insert
  to anon, authenticated
  with check (true);

grant select, insert on public.wishes to anon, authenticated;
