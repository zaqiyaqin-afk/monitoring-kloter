-- Catatan kejadian: jenis "konflik" ditambahkan, dan penerima dari antrean luring.
-- simpan_kejadian: satu item = satu kejadian lengkap (id dibuat di HP). Yang lebih baru menang;
-- item {hapus: true} menghapus kejadian. Jamaah dikirim sebagai nomor porsi.

alter table public.kejadian drop constraint kejadian_jenis_check;
alter table public.kejadian add constraint kejadian_jenis_check
  check (jenis in ('sakit', 'terpisah', 'barang_hilang', 'wafat', 'kecelakaan', 'konflik', 'lainnya'));

create function public.simpan_kejadian(p_items jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare k uuid := private.kloter_saya(); it jsonb; d timestamptz; n int := 0;
begin
  if k is null then raise exception 'BELUM_AKTIF'; end if;
  for it in select x from jsonb_array_elements(p_items) x order by x->>'diubah' loop
    d := coalesce(nullif(it->>'diubah', '')::timestamptz, now());
    if coalesce((it->>'hapus')::boolean, false) then
      delete from public.kejadian where id = (it->>'kid')::uuid and kloter_id = k and diubah <= d;
    else
      insert into public.kejadian as t (id, kloter_id, jenis, waktu, lokasi, kronologi, tindak_lanjut, status, jamaah_ids, petugas, diubah)
      values ((it->>'kid')::uuid, k, it->>'kategori', coalesce(nullif(it->>'waktuKejadian', '')::timestamptz, d),
        left(coalesce(it->>'lokasi', ''), 200), left(coalesce(it->>'kronologi', ''), 4000), left(coalesce(it->>'tindakLanjut', ''), 4000),
        case when it->>'status' = 'selesai' then 'selesai' else 'terbuka' end,
        coalesce((select array_agg(j.id) from public.jamaah j
                  where j.kloter_id = k and j.porsi in (select jsonb_array_elements_text(coalesce(it->'porsi', '[]'::jsonb)))), '{}'),
        left(coalesce(it->>'petugas', ''), 100), d)
      on conflict (id) do update set jenis = excluded.jenis, waktu = excluded.waktu, lokasi = excluded.lokasi, kronologi = excluded.kronologi,
        tindak_lanjut = excluded.tindak_lanjut, status = excluded.status, jamaah_ids = excluded.jamaah_ids, petugas = excluded.petugas, diubah = excluded.diubah
      where t.kloter_id = k and t.diubah <= excluded.diubah;
    end if;
    n := n + 1;
  end loop;
  return jsonb_build_object('ok', true, 'diterima', n);
end $$;

revoke all on function public.simpan_kejadian(jsonb) from public, anon;
grant execute on function public.simpan_kejadian(jsonb) to authenticated;
