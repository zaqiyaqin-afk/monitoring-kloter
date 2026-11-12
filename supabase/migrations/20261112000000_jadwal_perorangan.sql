-- Jadwal Raudhoh perorangan: daftar nomor porsi (dipisah koma), kosong untuk jadwal rombongan; jk 'O' menandai perorangan.
alter table public.jadwal_raudhoh add column if not exists porsi text not null default '';

do $$
declare d text := pg_get_functiondef('public.terima_perubahan(jsonb)'::regprocedure);
  a1 text := $q$replace(coalesce(it->>'rombongan', ''), ' ', '')) then
        insert into public.jadwal_raudhoh (kloter_id, tanggal, jam, jk, rombongan, keterangan)$q$;
  b1 text := $q$replace(coalesce(it->>'rombongan', ''), ' ', '') and r.porsi = coalesce(it->>'porsi', '')) then
        insert into public.jadwal_raudhoh (kloter_id, tanggal, jam, jk, rombongan, keterangan, porsi)$q$;
  a2 text := $q$coalesce(it->>'rombongan', ''), coalesce(it->>'keterangan', ''));$q$;
  b2 text := $q$coalesce(it->>'rombongan', ''), coalesce(it->>'keterangan', ''), coalesce(it->>'porsi', ''));$q$;
begin
  if position(a1 in d) = 0 or position(a2 in d) = 0 then raise exception 'terima_perubahan tidak sesuai yang diharapkan'; end if;
  execute replace(replace(d, a1, b1), a2, b2);
end $$;
