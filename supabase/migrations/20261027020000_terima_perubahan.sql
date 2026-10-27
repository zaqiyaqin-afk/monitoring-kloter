-- Penerima antrean perubahan dari aplikasi (pengganti doPost di Code.gs).
-- Aturannya sama: kiriman ulang (id_kirim sama) dilewati, centang TERAKHIR (cap waktu di HP) yang menang,
-- setiap centang dicatat di log_kegiatan, udzur dicatat di riwayat_udzur.
-- Fungsi berjalan dengan hak pemanggil, jadi aturan RLS per kloter tetap berlaku.

alter table public.riwayat_udzur add column perangkat text not null default '';
alter table public.foto add column id_kirim text unique, add column cakupan text not null default '';

-- Nama kegiatan lama -> nama baru (sama dengan namaBaru di Code.gs dan legacy() di aplikasi)
create function private.nama_baru(n text) returns text
language plpgsql immutable set search_path = '' as $$
declare m text[];
begin
  n := btrim(coalesce(n, ''));
  case n
    when 'Ihram umrah' then return 'Ihram Umrah'; when 'Ihram di miqat' then return 'Ihram Umrah';
    when 'Tawaf' then return 'Thawaf Umrah'; when 'Sa''i' then return 'Sa''i Umrah'; when 'Tahallul' then return 'Tahallul Umrah';
    when 'Ihram' then return 'Ihram Haji'; when 'Muzdalifah Murur' then return 'Murur'; when 'Muzdalifah Murur Mabit' then return 'Murur Mabit';
    when 'Jumrah Aqabah' then return 'Jumroh Aqobah'; when 'Badal Jumrah Aqabah' then return 'Badal Jumroh Aqobah';
    when 'Tahallul Awwal' then return 'Tahallul Awwal Haji'; when 'Ifadzoh' then return 'Thawaf Ifadzoh'; when 'Wada''' then return 'Thawaf Wada''';
    else null;
  end case;
  m := regexp_match(n, '^Mabit Mina (\d+) Dzulhijjah$'); if m is not null then return 'Mabit di Mina Malam ' || m[1]; end if;
  m := regexp_match(n, '^Badal Jumrah Tanggal (\d+)$'); if m is not null then return 'Badal Jumroh ' || m[1] || ' Dzh'; end if;
  if n like 'Jumrah %' then return replace(replace(n, 'Jumrah', 'Jumroh'), 'Aqabah', 'Aqobah'); end if;
  return n;
end $$;
grant execute on function private.nama_baru(text) to authenticated;

create function public.terima_perubahan(p_items jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare
  k uuid := private.kloter_saya();
  sekarang timestamptz := now();
  it jsonb; t timestamptz; keg text; j public.jamaah; ada public.centang; ok boolean; tgl date;
  diterima int := 0; diabaikan int := 0; dobel int := 0;
begin
  if k is null then raise exception 'BELUM_AKTIF'; end if;
  if jsonb_typeof(p_items) <> 'array' then raise exception 'DATA_TIDAK_VALID'; end if;

  -- Urut waktu di HP; waktu kosong atau lebih dari 5 menit di masa depan diganti waktu server
  for it in
    select x from jsonb_array_elements(p_items) x
    order by case when (x->>'waktu') ~ '^\d{4}-\d{2}-\d{2}T' then least((x->>'waktu')::timestamptz, sekarang + interval '5 minutes') else sekarang end
  loop
    diterima := diterima + 1;
    t := case when (it->>'waktu') ~ '^\d{4}-\d{2}-\d{2}T' then (it->>'waktu')::timestamptz else sekarang end;
    if t > sekarang + interval '5 minutes' then t := sekarang; end if;

    case it->>'jenis'
    when 'pengaturan' then
      update public.kloter set pengaturan = pengaturan || coalesce(it->'nilai', '{}'::jsonb) where id = k;

    when 'tanggal', 'tempat', 'hari' then
      if it->>'jenis' = 'hari' and btrim(coalesce(it->>'hari', '')) = '' then continue; end if;
      keg := private.nama_baru(it->>'kegiatan');
      if keg = '' then continue; end if;
      update public.jadwal d set
        tanggal = case when it->>'jenis' = 'tanggal' then case when (it->>'tanggal') ~ '^\d{4}-\d{2}-\d{2}$' then (it->>'tanggal')::date end else d.tanggal end,
        tempat  = case when it->>'jenis' = 'tempat' then left(coalesce(it->>'tempat', ''), 60) else d.tempat end,
        hari    = case when it->>'jenis' = 'hari' then left(btrim(it->>'hari'), 40) else d.hari end,
        jam     = case when it->>'jenis' = 'tanggal' and (it->>'jam') ~ '^\d{1,2}[:.]\d{2}$' then replace(it->>'jam', '.', ':')::time else d.jam end,
        diubah = sekarang
      where d.kloter_id = k and d.mode = it->>'mode' and private.nama_baru(d.kegiatan) = keg;
      if not found then
        insert into public.jadwal (kloter_id, mode, kegiatan, tanggal, tempat, hari)
        values (k, it->>'mode', keg,
          case when it->>'jenis' = 'tanggal' and (it->>'tanggal') ~ '^\d{4}-\d{2}-\d{2}$' then (it->>'tanggal')::date end,
          case when it->>'jenis' = 'tempat' then left(coalesce(it->>'tempat', ''), 60) end,
          case when it->>'jenis' = 'hari' then left(btrim(it->>'hari'), 40) end)
        on conflict (kloter_id, mode, kegiatan) do nothing;
      end if;

    when 'udzur' then
      if it->>'id' is not null and exists (select 1 from public.riwayat_udzur where id_kirim = it->>'id') then dobel := dobel + 1; continue; end if;
      select * into j from public.jamaah where kloter_id = k and porsi = it->>'porsi';
      if j.id is null then diabaikan := diabaikan + 1; continue; end if;
      insert into public.riwayat_udzur (kloter_id, jamaah_id, udzur, alasan, petugas, perangkat, waktu, id_kirim)
      values (k, j.id, coalesce((it->>'udzur')::boolean, false), left(coalesce(it->>'alasan', ''), 200), left(coalesce(it->>'petugas', ''), 100), coalesce(it->>'perangkat', ''), t, it->>'id');
      -- kolom udzur jamaah mengikuti perubahan TERBARU
      if not exists (select 1 from public.riwayat_udzur r where r.jamaah_id = j.id and r.waktu > t) then
        update public.jamaah set udzur = coalesce((it->>'udzur')::boolean, false), diubah = sekarang where id = j.id;
      end if;

    when 'centang' then
      if it->>'id' is not null and exists (select 1 from public.log_kegiatan where id_kirim = it->>'id') then dobel := dobel + 1; continue; end if;
      keg := private.nama_baru(it->>'kegiatan');
      select * into j from public.jamaah where kloter_id = k and porsi = it->>'porsi';
      ok := it->>'status' = 'Selesai';
      tgl := case when not ok then null when (it->>'tanggal') ~ '^\d{4}-\d{2}-\d{2}$' then (it->>'tanggal')::date else (t at time zone 'Asia/Riyadh')::date end;
      insert into public.log_kegiatan (kloter_id, jamaah_id, waktu, perangkat, porsi, nama, kegiatan, status, pelaksana_badal, keterangan,
        tanggal_pelaksanaan, susulan, pendamping, pilihan, alasan, ulang_ke, status_ulang, id_kirim, petugas)
      values (k, j.id, t, coalesce(it->>'perangkat', ''), coalesce(it->>'porsi', ''), coalesce(it->>'nama', ''), keg, coalesce(it->>'status', ''),
        coalesce(it->>'pelaksana', ''), coalesce(it->>'keterangan', ''), tgl, ok and it->>'susulan' = 'Ya', coalesce(it->>'pendamping', ''),
        coalesce(it->>'pilihan', ''), coalesce(it->>'alasan', ''), coalesce(nullif(it->>'ulangKe', '')::smallint, 0), coalesce(it->>'statusUlang', ''),
        it->>'id', left(coalesce(it->>'petugas', ''), 100));
      if j.id is null then diabaikan := diabaikan + 1; continue; end if;
      select * into ada from public.centang where jamaah_id = j.id and kegiatan = keg;
      if ada.id is not null and ada.waktu > t then diabaikan := diabaikan + 1; continue; end if;
      insert into public.centang (kloter_id, jamaah_id, mode, kegiatan, status, tanggal, jam, susulan, petugas, waktu, id_kirim,
        pelaksana_badal, keterangan, pendamping, pilihan, alasan, ulang_ke, status_ulang)
      values (k, j.id, (select mode from public.jadwal d where d.kloter_id = k and private.nama_baru(d.kegiatan) = keg limit 1), keg,
        coalesce(it->>'status', ''), tgl,
        case when ok and (it->>'jam') ~ '^\d{1,2}[:.]\d{2}$' then replace(it->>'jam', '.', ':')::time end,
        ok and it->>'susulan' = 'Ya', left(coalesce(it->>'petugas', ''), 100), t, it->>'id',
        coalesce(it->>'pelaksana', ''), coalesce(it->>'keterangan', ''), coalesce(it->>'pendamping', ''), coalesce(it->>'pilihan', ''),
        coalesce(it->>'alasan', ''), coalesce(nullif(it->>'ulangKe', '')::smallint, 0), coalesce(it->>'statusUlang', ''))
      on conflict (jamaah_id, kegiatan) do update set
        status = excluded.status, tanggal = excluded.tanggal, jam = excluded.jam, susulan = excluded.susulan, petugas = excluded.petugas,
        waktu = excluded.waktu, id_kirim = excluded.id_kirim, pelaksana_badal = excluded.pelaksana_badal, keterangan = excluded.keterangan,
        pendamping = excluded.pendamping, pilihan = excluded.pilihan, alasan = excluded.alasan, ulang_ke = excluded.ulang_ke,
        status_ulang = excluded.status_ulang, mode = coalesce(excluded.mode, public.centang.mode);

    when 'jadwal' then
      if (it->>'tanggal') !~ '^\d{4}-\d{2}-\d{2}$' or coalesce(it->>'jam', '') = '' then continue; end if;
      if not exists (select 1 from public.jadwal_raudhoh r where r.kloter_id = k and r.tanggal = (it->>'tanggal')::date and r.jam = it->>'jam'
                     and upper(left(r.jk, 1)) = upper(left(coalesce(it->>'jk', ''), 1)) and replace(r.rombongan, ' ', '') = replace(coalesce(it->>'rombongan', ''), ' ', '')) then
        insert into public.jadwal_raudhoh (kloter_id, tanggal, jam, jk, rombongan, keterangan)
        values (k, (it->>'tanggal')::date, it->>'jam', upper(left(coalesce(it->>'jk', ''), 1)), coalesce(it->>'rombongan', ''), coalesce(it->>'keterangan', ''));
      end if;

    when 'jamaah' then
      update public.jamaah set
        udzur = coalesce((it->>'udzur')::boolean, udzur),
        catatan = coalesce(it->>'catatan', catatan),
        lansia = coalesce((it->>'lansia')::boolean, lansia),
        kursi_roda = coalesce((it->>'kursiRoda')::boolean, kursi_roda),
        pendamping = coalesce(it->>'pendamping', pendamping),
        perlu_badal = coalesce((it->>'perluBadal')::boolean, perlu_badal),
        pelaksana_badal = coalesce(it->>'pelaksanaBadal', pelaksana_badal),
        miqat = case when it ? 'miqat' then nullif(left(coalesce(it->>'miqat', ''), 60), '') else miqat end,
        diubah = sekarang
      where kloter_id = k and porsi = it->>'porsi';

    else
      diabaikan := diabaikan + 1;
    end case;
  end loop;
  return jsonb_build_object('ok', true, 'diterima', diterima, 'diabaikan', diabaikan, 'dobel', dobel);
end $$;

revoke all on function public.terima_perubahan(jsonb) from public, anon;
grant execute on function public.terima_perubahan(jsonb) to authenticated;
