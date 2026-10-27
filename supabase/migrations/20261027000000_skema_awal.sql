-- Skema awal Monitoring Ibadah Kloter (Supabase).
-- Prinsip: setiap baris data milik satu kloter; petugas hanya melihat kloternya sendiri,
-- admin melihat semua. Akun baru berstatus 'menunggu' sampai disetujui admin.
-- Email admin pertama TIDAK ditulis di sini: isi tabel private.admin_awal setelah migrasi.

create schema if not exists private;
grant usage on schema private to authenticated;

create table private.admin_awal (email text primary key);

-- ---------- Kloter & profil ----------
create table public.kloter (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,                 -- contoh: SUB-12
  nomor text not null,
  embarkasi text not null,
  gelombang smallint check (gelombang in (1, 2)),
  tahun_hijriah smallint not null default 1448,
  pengaturan jsonb not null default '{}'::jsonb,
  dibuat timestamptz not null default now()
);

create table public.profil (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  nama text not null default '',
  tusi text not null default 'PPIH Bimbingan Ibadah Kloter',
  kloter_diminta text,
  embarkasi text,
  gelombang smallint check (gelombang in (1, 2)),
  kloter_id uuid references public.kloter on delete set null,
  peran text not null default 'petugas' check (peran in ('petugas', 'admin')),
  status text not null default 'menunggu' check (status in ('menunggu', 'aktif', 'ditolak')),
  disetujui_oleh uuid references auth.users on delete set null,
  disetujui_pada timestamptz,
  dibuat timestamptz not null default now()
);
create index on public.profil (kloter_id);
create index on public.profil (disetujui_oleh);

-- ---------- Fungsi bantu (schema private, tidak terekspos API) ----------
create function private.saya_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profil
                 where id = (select auth.uid()) and peran = 'admin' and status = 'aktif');
$$;

create function private.kloter_saya() returns uuid
language sql stable security definer set search_path = '' as $$
  select kloter_id from public.profil where id = (select auth.uid()) and status = 'aktif';
$$;

create function private.boleh_kloter(k uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.saya_admin() or (k is not null and k = private.kloter_saya());
$$;

revoke all on function private.saya_admin(), private.kloter_saya(), private.boleh_kloter(uuid) from public;
grant execute on function private.saya_admin(), private.kloter_saya(), private.boleh_kloter(uuid) to authenticated;

-- Profil dibuat otomatis saat mendaftar, dari data isian pendaftaran.
create function private.profil_baru() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  adm boolean := exists (select 1 from private.admin_awal where lower(email) = lower(new.email));
begin
  insert into public.profil (id, email, nama, kloter_diminta, embarkasi, gelombang, peran, status)
  values (new.id, new.email, coalesce(m->>'nama', ''), m->>'kloter', m->>'embarkasi',
          case when m->>'gelombang' in ('1', '2') then (m->>'gelombang')::smallint end,
          case when adm then 'admin' else 'petugas' end,
          case when adm then 'aktif' else 'menunggu' end);
  return new;
end $$;
create trigger profil_baru after insert on auth.users
  for each row execute function private.profil_baru();

-- Petugas boleh mengubah nama/identitasnya, tapi bukan peran, status, atau kloter.
create function private.jaga_profil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not private.saya_admin() then
    new.id := old.id; new.email := old.email; new.peran := old.peran; new.status := old.status;
    new.kloter_id := old.kloter_id; new.disetujui_oleh := old.disetujui_oleh;
    new.disetujui_pada := old.disetujui_pada;
  end if;
  return new;
end $$;
create trigger jaga_profil before update on public.profil
  for each row execute function private.jaga_profil();

-- Admin menyetujui pendaftar: kloter dibuat bila belum ada, lalu akun diaktifkan.
create function public.setujui_petugas(p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare p public.profil; k uuid;
begin
  if not private.saya_admin() then raise exception 'BUKAN_ADMIN'; end if;
  select * into p from public.profil where id = p_user;
  if p.id is null then raise exception 'AKUN_TIDAK_ADA'; end if;
  if coalesce(p.kloter_diminta, '') = '' or coalesce(p.embarkasi, '') = '' then
    raise exception 'IDENTITAS_BELUM_LENGKAP';
  end if;
  insert into public.kloter (kode, nomor, embarkasi, gelombang)
  values (upper(p.embarkasi) || '-' || p.kloter_diminta, p.kloter_diminta, upper(p.embarkasi), p.gelombang)
  on conflict (kode) do update set gelombang = coalesce(public.kloter.gelombang, excluded.gelombang)
  returning id into k;
  update public.profil set kloter_id = k, status = 'aktif',
    disetujui_oleh = (select auth.uid()), disetujui_pada = now()
  where id = p_user;
end $$;

create function public.tolak_petugas(p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not private.saya_admin() then raise exception 'BUKAN_ADMIN'; end if;
  update public.profil set status = 'ditolak', disetujui_oleh = (select auth.uid()), disetujui_pada = now()
  where id = p_user and peran <> 'admin';
end $$;

revoke all on function public.setujui_petugas(uuid), public.tolak_petugas(uuid) from public, anon;
grant execute on function public.setujui_petugas(uuid), public.tolak_petugas(uuid) to authenticated;

-- ---------- Data kloter ----------
create table public.jamaah (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  porsi text not null,
  nama text not null,
  jk text check (jk in ('L', 'P')),
  tgl_lahir date,                            -- lansia dihitung di aplikasi (>= 65 tahun)
  rombongan smallint,
  regu smallint,
  jabatan text not null default '' check (jabatan in ('', 'karom', 'karu')),
  resti boolean not null default false,
  kursi_roda boolean not null default false,
  pendamping_id uuid references public.jamaah on delete set null,
  hp text,
  udzur boolean not null default false,
  catatan text not null default '',
  miqat text,
  hotel_makkah text, lantai_makkah text, kamar_makkah text,
  tenda_arafah text, tenda_mina text,
  hotel_madinah text, lantai_madinah text, kamar_madinah text,
  diubah timestamptz not null default now(),
  unique (kloter_id, porsi)
);
create index on public.jamaah (pendamping_id);

create table public.jadwal (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  mode text not null check (mode in ('Haji', 'Umrah', 'Madinah')),
  kegiatan text not null,
  hari text,                                 -- label Hijriyah, diketik bebas
  tanggal date,
  jam time,
  tempat text,
  diubah timestamptz not null default now(),
  unique (kloter_id, mode, kegiatan)
);

-- Status terakhir per jamaah x kegiatan. 'waktu' = jam di HP saat dicentang (untuk sinkron luring).
create table public.centang (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  jamaah_id uuid not null references public.jamaah on delete cascade,
  mode text not null check (mode in ('Haji', 'Umrah', 'Madinah')),
  kegiatan text not null,
  selesai boolean not null default true,
  tanggal date,
  jam time,
  susulan boolean not null default false,
  petugas text,
  waktu timestamptz not null default now(),
  id_kirim text unique,
  unique (jamaah_id, mode, kegiatan)
);
create index on public.centang (kloter_id);

create table public.riwayat_udzur (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  jamaah_id uuid not null references public.jamaah on delete cascade,
  udzur boolean not null,
  alasan text not null default '',
  petugas text,
  waktu timestamptz not null default now(),
  id_kirim text unique
);
create index on public.riwayat_udzur (kloter_id);
create index on public.riwayat_udzur (jamaah_id);

create table public.badal (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  jamaah_id uuid not null references public.jamaah on delete cascade,     -- yang dibadalkan
  kegiatan text not null,                                                -- hari lempar jumrah
  pelaksana_id uuid references public.jamaah on delete set null,
  waktu timestamptz not null default now(),
  unique (jamaah_id, kegiatan)
);
create index on public.badal (kloter_id);
create index on public.badal (pelaksana_id);

create table public.kejadian (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  jenis text not null check (jenis in ('sakit', 'terpisah', 'barang_hilang', 'wafat', 'kecelakaan', 'lainnya')),
  waktu timestamptz not null default now(),
  lokasi text not null default '',
  kronologi text not null default '',
  tindak_lanjut text not null default '',
  status text not null default 'terbuka' check (status in ('terbuka', 'selesai')),
  jamaah_ids uuid[] not null default '{}',
  petugas text,
  id_kirim text unique,
  diubah timestamptz not null default now()
);
create index on public.kejadian (kloter_id);

create table public.foto (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  mode text,
  kegiatan text,
  kejadian_id uuid references public.kejadian on delete set null,
  tanggal date,
  keterangan text not null default '',
  path text not null,                        -- lokasi di bucket 'foto': <kloter_id>/<id>.jpg
  drive_url text,                            -- terisi setelah dipindah ke Google Drive
  petugas text,
  dibuat timestamptz not null default now()
);
create index on public.foto (kloter_id);
create index on public.foto (kejadian_id);

create table public.templat_pesan (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  jenis text not null check (jenis in ('katering', 'pengingat', 'undangan_karom_karu', 'undangan_pengajian', 'undangan_kesehatan')),
  judul text not null,
  isi text not null,
  diubah timestamptz not null default now(),
  unique (kloter_id, jenis, judul)
);

-- ---------- Row Level Security ----------
alter table public.kloter enable row level security;
alter table public.profil enable row level security;
alter table public.jamaah enable row level security;
alter table public.jadwal enable row level security;
alter table public.centang enable row level security;
alter table public.riwayat_udzur enable row level security;
alter table public.badal enable row level security;
alter table public.kejadian enable row level security;
alter table public.foto enable row level security;
alter table public.templat_pesan enable row level security;

create policy "lihat kloter" on public.kloter for select to authenticated
  using (private.boleh_kloter(id));
create policy "ubah kloter" on public.kloter for update to authenticated
  using (private.boleh_kloter(id)) with check (private.boleh_kloter(id));
create policy "admin tambah kloter" on public.kloter for insert to authenticated
  with check (private.saya_admin());
create policy "admin hapus kloter" on public.kloter for delete to authenticated
  using (private.saya_admin());

create policy "lihat profil" on public.profil for select to authenticated
  using (id = (select auth.uid()) or private.saya_admin());
create policy "ubah profil" on public.profil for update to authenticated
  using (id = (select auth.uid()) or private.saya_admin())
  with check (id = (select auth.uid()) or private.saya_admin());
create policy "admin hapus profil" on public.profil for delete to authenticated
  using (private.saya_admin());

do $$
declare t text;
begin
  foreach t in array array['jamaah', 'jadwal', 'centang', 'riwayat_udzur', 'badal', 'kejadian', 'foto', 'templat_pesan'] loop
    execute format('create policy "data kloter" on public.%I for all to authenticated
                    using (private.boleh_kloter(kloter_id)) with check (private.boleh_kloter(kloter_id))', t);
  end loop;
end $$;

-- Tamu (belum login) tidak boleh menyentuh tabel apa pun.
revoke all on all tables in schema public from anon;

-- ---------- Penyimpanan foto ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('foto', 'foto', false, 3145728, array['image/jpeg', 'image/png', 'image/webp']);

create policy "foto kloter" on storage.objects for all to authenticated
  using (bucket_id = 'foto' and private.boleh_kloter(((storage.foldername(name))[1])::uuid))
  with check (bucket_id = 'foto' and private.boleh_kloter(((storage.foldername(name))[1])::uuid));
