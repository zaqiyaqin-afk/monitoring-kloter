-- Menu Doa dan Kultum.
-- Isi doa berlaku untuk semua kloter dan hanya bisa dibaca akun yang sudah aktif (isi buku tidak ikut ke repo publik).
-- Hanya admin yang mengubah isi doa; setiap perubahan menyimpan versi lama di doa_riwayat supaya bisa dikembalikan.
-- Petugas melaporkan kesalahan lewat doa_laporan. Catatan penyampaian kultum disimpan per kloter.

create function private.saya_aktif() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profil where id = (select auth.uid()) and status = 'aktif');
$$;
revoke all on function private.saya_aktif() from public;
grant execute on function private.saya_aktif() to authenticated;

-- ---------- Doa ----------
create table public.doa (
  id text primary key,                       -- contoh: thawaf-03, wirid-05 (sama dengan id di aplikasi)
  kategori text not null,
  judul text not null,
  hal text not null default '',              -- halaman di buku sumber
  sumber text not null default '',           -- '' = buku doa manasik, 'Etho' = buku wirid
  arab text not null,
  latin text not null default '',
  arti text not null default '',
  catatan text not null default '',
  urutan integer not null default 0,
  versi integer not null default 1,
  diubah timestamptz not null default now(),
  diubah_oleh uuid references auth.users on delete set null
);
create index on public.doa (diubah_oleh);

create table public.doa_riwayat (
  id bigint generated always as identity primary key,
  doa_id text not null references public.doa on delete cascade,
  versi integer not null,
  isi jsonb not null,                        -- baris doa sebelum diubah
  diubah timestamptz not null,
  diubah_oleh uuid references auth.users on delete set null,
  disimpan timestamptz not null default now()
);
create index on public.doa_riwayat (doa_id, versi desc);
create index on public.doa_riwayat (diubah_oleh);

-- Setiap perubahan: versi naik, penanda waktu dan pengubah diisi server, versi lama masuk riwayat.
create function private.doa_berubah() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.doa_riwayat (doa_id, versi, isi, diubah, diubah_oleh)
  values (old.id, old.versi, to_jsonb(old) - 'id', old.diubah, old.diubah_oleh);
  new.id := old.id;
  new.versi := old.versi + 1;
  new.diubah := now();
  new.diubah_oleh := (select auth.uid());
  return new;
end $$;
create trigger doa_berubah before update on public.doa
  for each row execute function private.doa_berubah();

create table public.doa_laporan (
  id uuid primary key default gen_random_uuid(),
  doa_id text not null references public.doa on delete cascade,
  pesan text not null check (char_length(pesan) between 3 and 2000),
  pelapor uuid not null default auth.uid() references auth.users on delete cascade,
  pelapor_nama text not null default '',
  kloter_id uuid references public.kloter on delete set null,
  status text not null default 'baru' check (status in ('baru', 'selesai')),
  dibuat timestamptz not null default now()
);
create index on public.doa_laporan (doa_id);
create index on public.doa_laporan (pelapor);
create index on public.doa_laporan (kloter_id);

alter table public.doa enable row level security;
alter table public.doa_riwayat enable row level security;
alter table public.doa_laporan enable row level security;

create policy "baca doa" on public.doa for select to authenticated using (private.saya_aktif());
create policy "admin tambah doa" on public.doa for insert to authenticated with check (private.saya_admin());
create policy "admin ubah doa" on public.doa for update to authenticated using (private.saya_admin()) with check (private.saya_admin());
create policy "admin hapus doa" on public.doa for delete to authenticated using (private.saya_admin());

create policy "admin baca riwayat" on public.doa_riwayat for select to authenticated using (private.saya_admin());

create policy "kirim laporan" on public.doa_laporan for insert to authenticated
  with check (private.saya_aktif() and pelapor = (select auth.uid()));
create policy "baca laporan" on public.doa_laporan for select to authenticated
  using (pelapor = (select auth.uid()) or private.saya_admin());
create policy "admin tandai laporan" on public.doa_laporan for update to authenticated
  using (private.saya_admin()) with check (private.saya_admin());

-- Admin mengembalikan doa ke versi lama; versi yang sedang dipakai ikut masuk riwayat.
create function public.kembalikan_doa(p_riwayat bigint) returns void
language plpgsql security invoker set search_path = '' as $$
declare r public.doa_riwayat;
begin
  if not private.saya_admin() then raise exception 'BUKAN_ADMIN'; end if;
  select * into r from public.doa_riwayat where id = p_riwayat;
  if r.id is null then raise exception 'RIWAYAT_TIDAK_ADA'; end if;
  update public.doa set kategori = r.isi->>'kategori', judul = r.isi->>'judul', hal = r.isi->>'hal', sumber = r.isi->>'sumber',
    arab = r.isi->>'arab', latin = r.isi->>'latin', arti = r.isi->>'arti', catatan = r.isi->>'catatan',
    urutan = (r.isi->>'urutan')::integer
  where id = r.doa_id;
end $$;
revoke all on function public.kembalikan_doa(bigint) from public, anon;
grant execute on function public.kembalikan_doa(bigint) to authenticated;

-- ---------- Catatan kultum (per kloter, satu baris per tanggal) ----------
create table public.kultum_catatan (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  tanggal date not null,
  materi_id text not null default '',
  pengisi text not null default '',
  tempat text not null default '',
  status text not null default 'disampaikan' check (status in ('disampaikan', 'belum', 'ditiadakan')),
  petugas text not null default '',
  diubah timestamptz not null default now(),
  unique (kloter_id, tanggal)
);
alter table public.kultum_catatan enable row level security;
create policy "data kloter" on public.kultum_catatan for all to authenticated
  using (private.boleh_kloter(kloter_id)) with check (private.boleh_kloter(kloter_id));

revoke all on public.doa, public.doa_riwayat, public.doa_laporan, public.kultum_catatan from anon;
