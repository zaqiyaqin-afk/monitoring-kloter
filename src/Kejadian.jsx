// Catatan Kejadian: daftar (Terbuka/Selesai/Semua) dan formulir isi/ubah dengan foto (maks 3).
import React, { useEffect, useState } from 'react';
import { tautanFoto } from './data/server.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const MAKS_FOTO = 3;
const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: 16, border: 0, display: 'grid', gap: 12, minWidth: 0 };
const label = { display: 'grid', gap: 6, fontSize: fs(13.5), fontWeight: 500, minWidth: 0 };
const isian = { minHeight: 44, width: '100%', boxSizing: 'border-box', borderRadius: 12, border: '1px solid var(--m-tepi)', padding: '10px 12px', font: `400 ${fs(15)} var(--font-body)`, background: 'var(--color-surface)', color: 'var(--color-text)' };
const tombol = { minHeight: 48, padding: '8px 16px', lineHeight: 1.25, borderRadius: 24, border: '1px solid var(--m-tepi)', background: 'var(--color-surface)', color: 'var(--color-text)', font: `400 ${fs(14)} var(--font-body)`, cursor: 'pointer' };
const utama = { ...tombol, background: 'var(--m-isi)', color: 'var(--m-on-isi)', borderColor: 'transparent', fontWeight: 600 };
const pil = on => ({ minHeight: 44, padding: '6px 14px', lineHeight: 1.2, borderRadius: 22, border: '1px solid ' + (on ? 'var(--color-accent)' : 'var(--m-tepi)'), background: on ? 'var(--color-accent)' : 'var(--color-surface)', color: on ? 'var(--on-accent)' : 'var(--color-text)', font: `${on ? 600 : 400} ${fs(13)} var(--font-body)`, cursor: 'pointer' });
const SEGITIGA = 'M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
const Ikon = ({ d, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}><path d={d} /></svg>;

const jenisDari = (d, v) => d.jenis.find(j => j.v === v) || d.jenis[d.jenis.length - 1];
function waktuTeks(iso) {
  try { return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(new Date(iso)).replace(/\./g, ':') + ' WAS'; }
  catch (e) { return ''; }
}

// Foto dari server dibuka lewat tautan sementara; gambar kecilnya dimuat bila ada internet.
function Foto({ f, d }) {
  const [src, setSrc] = useState(f.src);
  useEffect(() => {
    if (f.src || !f.link.startsWith('supabase:') || !navigator.onLine) return;
    let hidup = true; tautanFoto(f.link.slice(9)).then(u => { if (hidup) setSrc(u); }, () => {});
    return () => { hidup = false; };
  }, [f.src, f.link]);
  const isi = src ? <img src={src} alt="" width="76" height="76" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <Ikon d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />;
  const gaya = { width: 76, height: 76, borderRadius: 14, overflow: 'hidden', flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-neutral-100)', color: 'var(--teks-3)', border: '1px solid var(--color-divider)', position: 'relative' };
  return f.link
    ? <a href={f.link} onClick={e => d.bukaFoto(e, f.link)} target="_blank" rel="noopener noreferrer" style={gaya} aria-label="Buka foto">{isi}</a>
    : <div style={gaya}>{isi}{f.antre && <span style={{ position: 'absolute', bottom: 4, left: 4, right: 4, fontSize: fs(10), background: 'rgba(0,0,0,.6)', color: '#fff', borderRadius: 6, textAlign: 'center' }}>antre</span>}</div>;
}

function PilihJamaah({ d, f }) {
  const [cari, setCari] = useState('');
  const q = cari.trim().toLowerCase();
  const hasil = q.length < 2 ? [] : d.jamaah.filter(j => !f.porsi.includes(j.porsi) && (j.name.toLowerCase().includes(q) || j.porsi.includes(q))).slice(0, 8);
  const nama = p => (d.jamaah.find(j => j.porsi === p) || { name: 'Porsi ' + p }).name;
  return (
    <div style={label}>
      Jamaah terkait
      {f.porsi.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {f.porsi.map(p => (
          <button key={p} onClick={() => d.ubah({ porsi: f.porsi.filter(x => x !== p) })} aria-label={'Hapus ' + nama(p)}
            style={{ ...pil(true), display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%', textAlign: 'left' }}>
            <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{nama(p)}</span><span aria-hidden="true">×</span>
          </button>))}
      </div>}
      <input style={isian} value={cari} onChange={e => setCari(e.target.value)} placeholder="Ketik nama atau nomor porsi" />
      {hasil.length > 0 && <div style={{ display: 'grid', gap: 4, borderRadius: 12, border: '1px solid var(--color-divider)', padding: 4, background: 'var(--color-surface)' }}>
        {hasil.map(j => (
          <button key={j.porsi} onClick={() => { d.ubah({ porsi: [...f.porsi, j.porsi] }); setCari(''); }}
            style={{ border: 0, background: 'transparent', color: 'var(--color-text)', textAlign: 'left', padding: '8px 10px', borderRadius: 10, minHeight: 44, cursor: 'pointer', font: `400 ${fs(14)} var(--font-body)` }}>
            <b style={{ fontWeight: 600 }}>{j.name}</b><br /><span style={{ color: 'var(--teks-3)', fontSize: fs(12) }}>R{j.r} · Regu {j.g} · {j.porsi}</span>
          </button>))}
      </div>}
      {q.length >= 2 && !hasil.length && <span style={{ fontSize: fs(13), fontWeight: 400, color: 'var(--teks-3)' }}>Tidak ada jamaah yang cocok.</span>}
    </div>
  );
}

function Formulir({ d }) {
  const f = d.form, fileRef = React.useRef(null);
  const lama = (d.list.find(k => k.kid === f.kid) || { foto: [] }).foto;
  const sisa = MAKS_FOTO - lama.length - f.berkas.length;
  const tambah = e => { const fl = [...(e.target.files || [])].slice(0, Math.max(0, sisa)); e.target.value = '';
    d.ubah({ berkas: [...f.berkas, ...fl.map(file => ({ file, prev: URL.createObjectURL(file) }))] }); };
  const kurang = !f.porsi.length && !['barang_hilang', 'konflik', 'lainnya'].includes(f.kategori) ? 'Pilih minimal satu jamaah.' : !f.kronologi.trim() ? 'Kronologi belum diisi.' : '';
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={kartu}>
        <div style={{ fontSize: fs(13.5), fontWeight: 500 }}>Jenis kejadian</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {d.jenis.map(j => { const on = f.kategori === j.v;
            return <button key={j.v} onClick={() => d.ubah({ kategori: j.v })} aria-pressed={on}
              style={pil(on)}>{j.l}</button>; })}
        </div>
      </div>
      <div style={kartu}>
        <PilihJamaah d={d} f={f} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
          <label style={label}>Tanggal<input type="date" style={{ ...isian, minWidth: 0 }} value={f.tgl} onChange={e => d.ubah({ tgl: e.target.value })} /></label>
          <label style={label}>Jam (WAS)<input type="time" style={{ ...isian, minWidth: 0 }} value={f.jam} onChange={e => d.ubah({ jam: e.target.value })} /></label>
        </div>
        <label style={label}>Lokasi<input style={isian} value={f.lokasi} maxLength={200} onChange={e => d.ubah({ lokasi: e.target.value })} placeholder="Mis. Hotel 412 lantai 7, Mina tenda 23" /></label>
        <label style={label}>Kronologi<textarea style={{ ...isian, minHeight: 110, resize: 'vertical', lineHeight: 1.45 }} value={f.kronologi} maxLength={4000} onChange={e => d.ubah({ kronologi: e.target.value })} placeholder="Apa yang terjadi, siapa yang melapor" /></label>
        <label style={label}>Tindak lanjut<textarea style={{ ...isian, minHeight: 90, resize: 'vertical', lineHeight: 1.45 }} value={f.tindakLanjut} maxLength={4000} onChange={e => d.ubah({ tindakLanjut: e.target.value })} placeholder="Dirujuk ke KKHI, dilaporkan ke sektor, dll" /></label>
        <div style={label}>Status
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4, borderRadius: 26, border: '1px solid var(--m-tepi)' }}>
            <button style={{ ...pil(f.status === 'terbuka'), border: 0 }} aria-pressed={f.status === 'terbuka'} onClick={() => d.ubah({ status: 'terbuka' })}>Terbuka</button>
            <button style={{ ...pil(f.status === 'selesai'), border: 0 }} aria-pressed={f.status === 'selesai'} onClick={() => d.ubah({ status: 'selesai' })}>Selesai</button>
          </div>
        </div>
      </div>
      <div style={kartu}>
        <div style={{ fontSize: fs(13.5), fontWeight: 500 }}>Foto ({lama.length + f.berkas.length}/{MAKS_FOTO})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {lama.map(x => <Foto key={x.id} f={x} d={d} />)}
          {f.berkas.map((b, i) => (
            <div key={b.prev} style={{ width: 76, height: 76, borderRadius: 14, overflow: 'hidden', position: 'relative', flex: 'none' }}>
              <img src={b.prev} alt="" width="76" height="76" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => { URL.revokeObjectURL(b.prev); d.ubah({ berkas: f.berkas.filter((_, k) => k !== i) }); }} aria-label="Batalkan foto"
                style={{ position: 'absolute', top: 0, right: 0, width: 44, height: 44, borderRadius: 999, border: 0, background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
            </div>))}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={tambah} style={{ display: 'none' }} />
        {sisa > 0 && <button style={{ ...tombol, justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 8 }} onClick={() => fileRef.current && fileRef.current.click()}><Ikon d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" s={20} />Tambah foto</button>}
        <div style={{ fontSize: fs(13), color: 'var(--teks-3)', lineHeight: 1.45 }}>Foto disimpan di HP dulu, lalu diunggah ke penyimpanan kloter saat ada internet.</div>
      </div>
      {kurang && <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--red-100)', color: 'var(--red-700)', borderRadius: 12, padding: '10px 12px', fontSize: fs(13.5), fontWeight: 500 }}><Ikon d={SEGITIGA} s={20} />{kurang}</div>}
      {!f.baru && <button style={{ ...tombol, color: 'var(--red-700)' }} onClick={() => d.hapus(f.kid)}>Hapus catatan ini</button>}
      {!f.baru && f.petugas && <div style={{ fontSize: fs(12.5), color: 'var(--teks-3)', textAlign: 'center' }}>Dicatat oleh {f.petugas}</div>}
      {/* Batal dan Simpan menetap di bawah layar supaya selalu terjangkau di form panjang. */}
      <div style={{ position: 'sticky', bottom: 0, margin: '0 -12px -24px', padding: '12px 12px calc(12px + env(safe-area-inset-bottom, 0px))', background: 'var(--color-surface)', borderRadius: '20px 20px 0 0', boxShadow: '0 -1px 0 var(--color-divider)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button style={tombol} onClick={d.batal}>Batal</button>
        <button style={{ ...utama, opacity: kurang ? 0.5 : 1 }} disabled={!!kurang} onClick={d.simpan}>Simpan</button>
      </div>
    </div>
  );
}

function KartuKejadian({ k, d }) {
  const j = jenisDari(d, k.kategori), selesai = k.status === 'selesai';
  const nama = k.nama.length > 2 ? k.nama.slice(0, 2).join(', ') + ` +${k.nama.length - 2}` : k.nama.join(', ');
  return (
    <button onClick={() => d.buka(k)} style={{ ...kartu, textAlign: 'left', cursor: 'pointer', color: 'var(--color-text)', font: 'inherit', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{ width: 40, height: 40, borderRadius: 20, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-neutral-200)', color: 'var(--color-text)' }}><Ikon d={j.d} s={20} /></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: fs(15), fontWeight: 500, overflowWrap: 'anywhere' }}>{j.l}</div>
          <div style={{ fontSize: fs(13), color: 'var(--teks-3)' }}>{waktuTeks(k.waktuKejadian)}</div>
        </div>
        {selesai ? <span className="mk-lencana" style={{ flex: 'none' }}>Selesai</span> : <span className="mk-lencana mk-lencana-merah" style={{ flex: 'none' }}><Ikon d={SEGITIGA} s={16} />Terbuka</span>}
      </div>
      {nama && <div style={{ fontSize: fs(14), fontWeight: 500, overflowWrap: 'anywhere' }}>{nama}</div>}
      {k.lokasi && <div style={{ fontSize: fs(13), color: 'var(--teks-3)', overflowWrap: 'anywhere' }}>Lokasi: {k.lokasi}</div>}
      {k.kronologi && <div style={{ fontSize: fs(14), lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{k.kronologi}</div>}
      {(k.foto.length > 0 || k.belum) && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: fs(12), color: 'var(--teks-3)' }}>
        {k.foto.length > 0 && <span>{k.foto.length} foto</span>}
        {k.belum && <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>· belum terkirim</span>}
      </div>}
    </button>
  );
}

export default function Kejadian({ d }) {
  const [saring, setSaring] = useState('terbuka');
  if (!d) return null;
  if (d.sheet) return <div style={kartu}><div style={{ fontSize: fs(15), lineHeight: 1.5 }}>Catatan Kejadian memakai akun kloter. Masuk dengan akun yang sudah disetujui admin untuk memakainya.</div></div>;
  if (d.form) return <Formulir d={d} />;
  const n = { terbuka: d.list.filter(k => k.status !== 'selesai').length, selesai: d.list.filter(k => k.status === 'selesai').length, semua: d.list.length };
  const tampil = d.list.filter(k => saring === 'semua' || (saring === 'selesai' ? k.status === 'selesai' : k.status !== 'selesai'));
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={kartu}>
        {d.contoh && <div style={{ fontSize: fs(12.5), color: 'var(--teks-3)' }}>Mode contoh · catatan tidak disimpan ke server.</div>}
        <button style={{ ...utama, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={d.baru}><Ikon d="M12 5v14M5 12h14" s={20} />Catat kejadian</button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: 4, borderRadius: 26, border: '1px solid var(--m-tepi)' }}>
          {[['terbuka', 'Terbuka'], ['selesai', 'Selesai'], ['semua', 'Semua']].map(([v, l]) =>
            <button key={v} style={{ ...pil(saring === v), border: 0, padding: '6px 4px' }} aria-pressed={saring === v} onClick={() => setSaring(v)}>{l} ({n[v]})</button>)}
        </div>
      </div>
      {!tampil.length && <div style={{ ...kartu, justifyItems: 'center', textAlign: 'center', padding: '28px 16px', gap: 8 }}>
        <span style={{ width: 56, height: 56, borderRadius: 28, display: 'grid', placeItems: 'center', background: 'var(--color-bg)' }}><Ikon d="M9 4h6v3H9zM9 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H15M12 11v4M12 17.5h.01" s={24} /></span>
        <div style={{ fontSize: fs(14.5), fontWeight: 500 }}>{saring === 'terbuka' ? 'Tidak ada kejadian yang masih terbuka.' : 'Belum ada catatan.'}</div>
        <div style={{ fontSize: fs(12.5), color: 'var(--teks-3)', lineHeight: 1.45, maxWidth: 280 }}>Bila ada jamaah sakit, terpisah, atau kehilangan barang, ketuk Catat kejadian.</div>
      </div>}
      {tampil.map(k => <KartuKejadian key={k.kid} k={k} d={d} />)}
    </div>
  );
}
