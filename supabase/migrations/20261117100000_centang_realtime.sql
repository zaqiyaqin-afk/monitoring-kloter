-- Waktu centang diterima server: HP cukup mengambil centang yang berubah sejak sinkron terakhir.
alter table public.centang add column if not exists diterima timestamptz not null default now();
create index if not exists centang_kloter_diterima_idx on public.centang (kloter_id, diterima);

create or replace function private.cap_diterima() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.diterima := now();
  return new;
end $$;

drop trigger if exists centang_diterima on public.centang;
create trigger centang_diterima before insert or update on public.centang
  for each row execute function private.cap_diterima();

-- Perubahan centang dikirim langsung ke HP petugas kloter yang sama (tetap tunduk pada RLS).
alter publication supabase_realtime add table public.centang;
