-- Penyesuaian agar seluruh isi Sheet lama bisa dipindah tanpa kehilangan data.
-- Badal mengikuti logika aplikasi yang sudah ada: pelaksana badal dicatat pada baris centang
-- kegiatan badal, dan 'Perlu Badal' / 'Pelaksana Badal' pada jamaah. Tabel badal terpisah dibuang.

drop table public.badal;

-- Jamaah: kolom yang ada di Sheet tapi belum ada di skema awal.
alter table public.jamaah
  add column lansia boolean not null default false,        -- tanda manual; tanggal lahir tetap dipakai bila ada
  add column pendamping text not null default '',          -- teks asli "NAMA (porsi)"; pendamping_id bila cocok
  add column perlu_badal boolean not null default false,
  add column pelaksana_badal text not null default '';

-- Jabatan memakai istilah Sheet.
alter table public.jamaah drop constraint jamaah_jabatan_check;
update public.jamaah set jabatan = case jabatan when 'karom' then 'Ketua Rombongan' when 'karu' then 'Ketua Regu' else '' end;
alter table public.jamaah add constraint jamaah_jabatan_check check (jabatan in ('', 'Ketua Rombongan', 'Ketua Regu'));

-- Log: salinan apa adanya dari tab Log (riwayat lengkap, tidak pernah diubah).
create table public.log_kegiatan (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  jamaah_id uuid references public.jamaah on delete set null,
  waktu timestamptz not null,
  perangkat text not null default '',
  porsi text not null,
  nama text not null default '',
  kegiatan text not null,
  status text not null,
  pelaksana_badal text not null default '',
  keterangan text not null default '',
  tanggal_pelaksanaan date,
  susulan boolean not null default false,
  pendamping text not null default '',
  pilihan text not null default '',
  alasan text not null default '',
  ulang_ke smallint not null default 0,
  status_ulang text not null default '',
  id_kirim text unique,
  petugas text not null default ''
);
create index on public.log_kegiatan (kloter_id);
create index on public.log_kegiatan (jamaah_id);

-- Centang = status terakhir per jamaah x kegiatan, lengkap dengan isian tambahan seperti di Log.
alter table public.centang drop constraint centang_jamaah_id_mode_kegiatan_key;
alter table public.centang alter column mode drop not null;
alter table public.centang
  add column status text not null default 'Selesai',
  add column pelaksana_badal text not null default '',
  add column keterangan text not null default '',
  add column pendamping text not null default '',
  add column pilihan text not null default '',
  add column alasan text not null default '',
  add column ulang_ke smallint not null default 0,
  add column status_ulang text not null default '';
alter table public.centang drop column selesai;
alter table public.centang add constraint centang_jamaah_kegiatan_key unique (jamaah_id, kegiatan);
create index on public.centang (jamaah_id);

-- Foto lama hanya ada di Google Drive, jadi lokasi Supabase boleh kosong.
alter table public.foto alter column path drop not null;
alter table public.foto add constraint foto_ada_lokasi check (path is not null or drive_url is not null);

create table public.petugas (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  nama text not null,
  jabatan text not null default 'Petugas',
  urutan smallint not null default 0
);
create index on public.petugas (kloter_id);

create table public.jadwal_raudhoh (
  id uuid primary key default gen_random_uuid(),
  kloter_id uuid not null references public.kloter on delete cascade,
  tanggal date,
  jam text not null default '',
  jk text not null default '',
  rombongan text not null default '',
  keterangan text not null default ''
);
create index on public.jadwal_raudhoh (kloter_id);

alter table public.log_kegiatan enable row level security;
alter table public.petugas enable row level security;
alter table public.jadwal_raudhoh enable row level security;

-- Log hanya boleh ditambah dan dibaca, tidak diubah atau dihapus.
create policy "baca log" on public.log_kegiatan for select to authenticated
  using (private.boleh_kloter(kloter_id));
create policy "tambah log" on public.log_kegiatan for insert to authenticated
  with check (private.boleh_kloter(kloter_id));
create policy "data kloter" on public.petugas for all to authenticated
  using (private.boleh_kloter(kloter_id)) with check (private.boleh_kloter(kloter_id));
create policy "data kloter" on public.jadwal_raudhoh for all to authenticated
  using (private.boleh_kloter(kloter_id)) with check (private.boleh_kloter(kloter_id));

revoke all on public.log_kegiatan, public.petugas, public.jadwal_raudhoh from anon;

-- Admin yang mendaftar langsung terhubung ke kloternya bila kloter itu sudah ada.
create or replace function private.profil_baru() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  adm boolean := exists (select 1 from private.admin_awal where lower(email) = lower(new.email));
  k uuid;
begin
  if adm then
    select id into k from public.kloter
    where kode = upper(coalesce(m->>'embarkasi', '')) || '-' || coalesce(m->>'kloter', '');
  end if;
  insert into public.profil (id, email, nama, kloter_diminta, embarkasi, gelombang, peran, status, kloter_id)
  values (new.id, new.email, coalesce(m->>'nama', ''), m->>'kloter', m->>'embarkasi',
          case when m->>'gelombang' in ('1', '2') then (m->>'gelombang')::smallint end,
          case when adm then 'admin' else 'petugas' end,
          case when adm then 'aktif' else 'menunggu' end, k);
  return new;
end $$;
