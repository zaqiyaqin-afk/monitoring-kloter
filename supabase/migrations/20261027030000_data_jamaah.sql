-- Data pribadi dan akomodasi jamaah.
-- ubah_data_jamaah: perubahan dari detail jamaah (lewat antrean luring, urut waktu di HP).
-- impor_jamaah: unggah Excel (butuh internet): porsi yang ada diperbarui, porsi baru ditambahkan,
-- sel kosong tidak menghapus isian lama, jamaah tidak pernah dihapus.

create function private.teks(v jsonb) returns text
language sql immutable set search_path = '' as $$ select nullif(btrim(coalesce(v #>> '{}', '')), '') $$;

-- Tanggal dari Excel/aplikasi: yyyy-mm-dd, dd/mm/yyyy, atau dd-mm-yyyy
create function private.tanggal(v text) returns date
language plpgsql immutable set search_path = '' as $$
declare m text[];
begin
  v := btrim(coalesce(v, ''));
  if v ~ '^\d{4}-\d{2}-\d{2}' then return left(v, 10)::date; end if;
  m := regexp_match(v, '^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$');
  if m is not null then return make_date(m[3]::int, m[2]::int, m[1]::int); end if;
  return null;
exception when others then return null;
end $$;

create function private.jk(v text) returns text
language sql immutable set search_path = '' as $$
  select case when upper(left(btrim(coalesce(v, '')), 1)) = 'L' then 'L' when upper(left(btrim(coalesce(v, '')), 1)) in ('P', 'W') then 'P' end
$$;

grant execute on function private.teks(jsonb), private.tanggal(text), private.jk(text) to authenticated;

create function public.ubah_data_jamaah(p_items jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare k uuid := private.kloter_saya(); it jsonb; n int := 0;
begin
  if k is null then raise exception 'BELUM_AKTIF'; end if;
  for it in select x from jsonb_array_elements(p_items) x order by x->>'waktu' loop
    update public.jamaah set
      jk = case when it ? 'jk' then private.jk(it->>'jk') else jk end,
      tgl_lahir = case when it ? 'tglLahir' then private.tanggal(it->>'tglLahir') else tgl_lahir end,
      hp = case when it ? 'hp' then private.teks(it->'hp') else hp end,
      hotel_makkah = case when it ? 'hotelMakkah' then private.teks(it->'hotelMakkah') else hotel_makkah end,
      lantai_makkah = case when it ? 'lantaiMakkah' then private.teks(it->'lantaiMakkah') else lantai_makkah end,
      kamar_makkah = case when it ? 'kamarMakkah' then private.teks(it->'kamarMakkah') else kamar_makkah end,
      tenda_arafah = case when it ? 'tendaArafah' then private.teks(it->'tendaArafah') else tenda_arafah end,
      tenda_mina = case when it ? 'tendaMina' then private.teks(it->'tendaMina') else tenda_mina end,
      hotel_madinah = case when it ? 'hotelMadinah' then private.teks(it->'hotelMadinah') else hotel_madinah end,
      lantai_madinah = case when it ? 'lantaiMadinah' then private.teks(it->'lantaiMadinah') else lantai_madinah end,
      kamar_madinah = case when it ? 'kamarMadinah' then private.teks(it->'kamarMadinah') else kamar_madinah end,
      diubah = now()
    where kloter_id = k and porsi = it->>'porsi';
    if found then n := n + 1; end if;
  end loop;
  return jsonb_build_object('ok', true, 'diubah', n);
end $$;

create function public.impor_jamaah(p_rows jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare k uuid := private.kloter_saya(); r jsonb; p text; baru int := 0; ubah int := 0; lewat int := 0;
begin
  if k is null then raise exception 'BELUM_AKTIF'; end if;
  for r in select x from jsonb_array_elements(p_rows) x loop
    p := private.teks(r->'porsi');
    if p is null then lewat := lewat + 1; continue; end if;
    if exists (select 1 from public.jamaah where kloter_id = k and porsi = p) then
      update public.jamaah set
        nama = coalesce(private.teks(r->'nama'), nama),
        rombongan = coalesce(nullif(regexp_replace(coalesce(r->>'rombongan', ''), '\D', '', 'g'), '')::smallint, rombongan),
        regu = coalesce(nullif(regexp_replace(coalesce(r->>'regu', ''), '\D', '', 'g'), '')::smallint, regu),
        jabatan = case when r->>'peran' in ('Ketua Rombongan', 'Ketua Regu') then r->>'peran' when lower(coalesce(r->>'peran', '')) = 'jamaah' then '' else jabatan end,
        jk = coalesce(private.jk(r->>'jk'), jk),
        tgl_lahir = coalesce(private.tanggal(r->>'tglLahir'), tgl_lahir),
        hp = coalesce(private.teks(r->'hp'), hp),
        resti = case when lower(coalesce(r->>'risti', '')) in ('ya', 'y', '1', 'true') then true when lower(coalesce(r->>'risti', '')) in ('tidak', 't', '0', 'false') then false else resti end,
        kursi_roda = case when lower(coalesce(r->>'kursiRoda', '')) in ('ya', 'y', '1', 'true') then true when lower(coalesce(r->>'kursiRoda', '')) in ('tidak', 't', '0', 'false') then false else kursi_roda end,
        hotel_makkah = coalesce(private.teks(r->'hotelMakkah'), hotel_makkah), lantai_makkah = coalesce(private.teks(r->'lantaiMakkah'), lantai_makkah),
        kamar_makkah = coalesce(private.teks(r->'kamarMakkah'), kamar_makkah), tenda_arafah = coalesce(private.teks(r->'tendaArafah'), tenda_arafah),
        tenda_mina = coalesce(private.teks(r->'tendaMina'), tenda_mina), hotel_madinah = coalesce(private.teks(r->'hotelMadinah'), hotel_madinah),
        lantai_madinah = coalesce(private.teks(r->'lantaiMadinah'), lantai_madinah), kamar_madinah = coalesce(private.teks(r->'kamarMadinah'), kamar_madinah),
        catatan = coalesce(private.teks(r->'catatan'), catatan),
        diubah = now()
      where kloter_id = k and porsi = p;
      ubah := ubah + 1;
    else
      if private.teks(r->'nama') is null then lewat := lewat + 1; continue; end if;
      insert into public.jamaah (kloter_id, porsi, nama, rombongan, regu, jabatan, jk, tgl_lahir, hp, resti, kursi_roda,
        hotel_makkah, lantai_makkah, kamar_makkah, tenda_arafah, tenda_mina, hotel_madinah, lantai_madinah, kamar_madinah, catatan)
      values (k, p, private.teks(r->'nama'),
        nullif(regexp_replace(coalesce(r->>'rombongan', ''), '\D', '', 'g'), '')::smallint, nullif(regexp_replace(coalesce(r->>'regu', ''), '\D', '', 'g'), '')::smallint,
        case when r->>'peran' in ('Ketua Rombongan', 'Ketua Regu') then r->>'peran' else '' end,
        private.jk(r->>'jk'), private.tanggal(r->>'tglLahir'), private.teks(r->'hp'),
        lower(coalesce(r->>'risti', '')) in ('ya', 'y', '1', 'true'), lower(coalesce(r->>'kursiRoda', '')) in ('ya', 'y', '1', 'true'),
        private.teks(r->'hotelMakkah'), private.teks(r->'lantaiMakkah'), private.teks(r->'kamarMakkah'), private.teks(r->'tendaArafah'), private.teks(r->'tendaMina'),
        private.teks(r->'hotelMadinah'), private.teks(r->'lantaiMadinah'), private.teks(r->'kamarMadinah'), coalesce(private.teks(r->'catatan'), ''));
      baru := baru + 1;
    end if;
  end loop;
  return jsonb_build_object('ok', true, 'baru', baru, 'diubah', ubah, 'dilewati', lewat);
end $$;

revoke all on function public.ubah_data_jamaah(jsonb), public.impor_jamaah(jsonb) from public, anon;
grant execute on function public.ubah_data_jamaah(jsonb), public.impor_jamaah(jsonb) to authenticated;
