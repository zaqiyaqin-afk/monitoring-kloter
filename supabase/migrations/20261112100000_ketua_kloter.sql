-- Pendaftar kloter yang belum terdaftar langsung aktif sebagai ketua kloter itu.
-- Pendaftar kloter yang sudah ada tetap menunggu, disetujui ketua kloternya atau admin.

alter table public.profil drop constraint if exists profil_peran_check;
alter table public.profil add constraint profil_peran_check check (peran in ('petugas', 'ketua', 'admin'));

create or replace function private.kode_kloter(p_embarkasi text, p_kloter text) returns text
language sql immutable set search_path = '' as $$
  select upper(trim(coalesce(p_embarkasi, ''))) || '-' || coalesce(nullif(ltrim(trim(coalesce(p_kloter, '')), '0'), ''), '0');
$$;

-- Benar bila pengguna ini ketua aktif dari kloter yang dimaksud (lewat kloter_id atau kode yang diminta).
create or replace function private.ketua_atas(p_embarkasi text, p_kloter text, p_kloter_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profil me join public.kloter k on k.id = me.kloter_id
    where me.id = (select auth.uid()) and me.peran = 'ketua' and me.status = 'aktif'
      and (k.id = p_kloter_id or k.kode = private.kode_kloter(p_embarkasi, p_kloter)));
$$;

-- Fungsi persetujuan menyalakan izin sesaat supaya penjaga profil tidak membatalkan perubahan status.
create or replace function private.jaga_profil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not private.saya_admin() and coalesce(current_setting('mk.izin', true), '') <> '1' then
    new.id := old.id; new.email := old.email; new.peran := old.peran; new.status := old.status;
    new.kloter_id := old.kloter_id; new.disetujui_oleh := old.disetujui_oleh;
    new.disetujui_pada := old.disetujui_pada;
  end if;
  return new;
end $$;

create or replace function public.mulai_kloter_baru() returns text
language plpgsql security definer set search_path = '' as $$
declare p public.profil; k uuid;
begin
  select * into p from public.profil where id = (select auth.uid()) for update;
  if p.id is null then return ''; end if;
  if p.status <> 'menunggu' then return p.status; end if;
  if coalesce(trim(p.kloter_diminta), '') = '' or coalesce(trim(p.embarkasi), '') = '' then return 'menunggu'; end if;
  insert into public.kloter (kode, nomor, embarkasi, gelombang)
  values (private.kode_kloter(p.embarkasi, p.kloter_diminta), coalesce(nullif(ltrim(trim(p.kloter_diminta), '0'), ''), '0'), upper(trim(p.embarkasi)), p.gelombang)
  on conflict (kode) do nothing
  returning id into k;
  if k is null then return 'menunggu'; end if;
  perform set_config('mk.izin', '1', true);
  update public.profil set kloter_id = k, status = 'aktif', peran = 'ketua', disetujui_pada = now() where id = p.id;
  perform set_config('mk.izin', '', true);
  return 'aktif';
end $$;
revoke execute on function public.mulai_kloter_baru() from public, anon;
grant execute on function public.mulai_kloter_baru() to authenticated;

create or replace function public.setujui_petugas(p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare p public.profil; k uuid;
begin
  select * into p from public.profil where id = p_user;
  if p.id is null then raise exception 'AKUN_TIDAK_ADA'; end if;
  if private.saya_admin() then
    if coalesce(p.kloter_diminta, '') = '' or coalesce(p.embarkasi, '') = '' then
      raise exception 'IDENTITAS_BELUM_LENGKAP';
    end if;
    insert into public.kloter (kode, nomor, embarkasi, gelombang)
    values (upper(p.embarkasi) || '-' || p.kloter_diminta, p.kloter_diminta, upper(p.embarkasi), p.gelombang)
    on conflict (kode) do update set gelombang = coalesce(public.kloter.gelombang, excluded.gelombang)
    returning id into k;
  elsif p.peran = 'petugas' and p.id <> (select auth.uid()) and private.ketua_atas(p.embarkasi, p.kloter_diminta, p.kloter_id) then
    k := private.kloter_saya();
  else
    raise exception 'BUKAN_ADMIN';
  end if;
  perform set_config('mk.izin', '1', true);
  update public.profil set kloter_id = k, status = 'aktif',
    disetujui_oleh = (select auth.uid()), disetujui_pada = now()
  where id = p_user;
  perform set_config('mk.izin', '', true);
end $$;

create or replace function public.tolak_petugas(p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare p public.profil;
begin
  select * into p from public.profil where id = p_user;
  if not (private.saya_admin() or (p.peran = 'petugas' and p.id <> (select auth.uid())
          and private.ketua_atas(p.embarkasi, p.kloter_diminta, p.kloter_id))) then
    raise exception 'BUKAN_ADMIN';
  end if;
  perform set_config('mk.izin', '1', true);
  update public.profil set status = 'ditolak', disetujui_oleh = (select auth.uid()), disetujui_pada = now()
  where id = p_user and peran <> 'admin';
  perform set_config('mk.izin', '', true);
end $$;

drop policy if exists "lihat profil" on public.profil;
create policy "lihat profil" on public.profil for select to authenticated
  using (id = (select auth.uid()) or private.saya_admin() or private.ketua_atas(embarkasi, kloter_diminta, kloter_id));
