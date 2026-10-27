// Catatan Kejadian: daftar (Terbuka/Selesai/Semua) dan formulir isi/ubah dengan foto (maks 3).
import React, { useEffect, useState } from 'react';
import { tautanFoto } from './data/server.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const MAKS_FOTO = 3;
const kartu = { background: 'var(--kartu-bg, var(--color-surface))', borderRadius: 20, padding: 16, border: '1px solid var(--kartu-garis, var(--color-divider))', boxShadow: 'var(--kartu-bayang, 0 1px 2px rgba(0,0,0,.06))', display: 'grid', gap: 12, minWidth: 0 };
const label = { display: 'grid', gap: 6, fontSize: fs(14), fontWeight: 600, minWidth: 0 };
const isian = { minHeight: 44, width: '100%', boxSizing: 'border-box', borderRadius: 12, border: '1.5px solid var(--color-divider)', padding: '10px 12px', font: `400 ${fs(15)} var(--font-body)`, background: 'var(--color-surface)', color: 'var(--color-text)' };
const tombol = { minHeight: 46, padding: '8px 12px', lineHeight: 1.25, borderRadius: 14, border: '1.5px solid var(--color-divider)', background: 'transparent', color: 'var(--color-text)', font: `600 ${fs(15)} var(--font-body)`, cursor: 'pointer' };
const utama = { ...tombol, background: 'var(--color-accent)', color: 'var(--on-accent)', borderColor: 'var(--color-accent)' };
const pil = on => ({ minHeight: 40, padding: '6px 12px', lineHeight: 1.2, borderRadius: 999, border: '1.5px solid ' + (on ? 'var(--color-accent)' : 'var(--color-divider)'), background: on ? 'var(--color-accent)' : 'transparent', color: on ? 'var(--on-accent)' : 'var(--color-text)', font: `600 ${fs(14)} var(--font-body)`, cursor: 'pointer' });
const Ikon = ({ d, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

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
  const isi = src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <Ikon d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />;
  const gaya = { width: 76, height: 76, borderRadius: 14, overflow: 'hidden', flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)', border: '1px solid var(--color-divider)', position: 'relative' };
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
            <b style={{ fontWeight: 600 }}>{j.name}</b><br /><span style={{ color: 'var(--color-neutral-700)', fontSize: fs(12) }}>R{j.r} · Regu {j.g} · {j.porsi}</span>
          </button>))}
      </div>}
      {q.length >= 2 && !hasil.length && <span style={{ fontSize: fs(13), fontWeight: 400, color: 'var(--color-neutral-700)' }}>Tidak ada jamaah yang cocok.</span>}
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
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={kartu}>
        <div style={{ fontSize: fs(14), fontWeight: 600 }}>Jenis kejadian</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
          {d.jenis.map(j => { const on = f.kategori === j.v;
            return <button key={j.v} onClick={() => d.ubah({ kategori: j.v })} aria-pressed={on}
              style={{ ...tombol, minHeight: 48, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', fontSize: fs(14), borderColor: on ? j.w : 'var(--color-divider)', background: on ? j.w : 'transparent', color: on ? '#fff' : 'var(--color-text)' }}>
              <span style={{ flex: 'none', display: 'grid' }}><Ikon d={j.d} s={18} /></span><span style={{ minWidth: 0 }}>{j.l}</span></button>; })}
        </div>
      </div>
      <div style={kartu}>
        <PilihJamaah d={d} f={f} />
        <label style={label}>Tanggal<input type="date" style={{ ...isian, minWidth: 0 }} value={f.tgl} onChange={e => d.ubah({ tgl: e.target.value })} /></label>
        <label style={label}>Jam (WAS)<input type="time" style={{ ...isian, minWidth: 0 }} value={f.jam} onChange={e => d.ubah({ jam: e.target.value })} /></label>
        <label style={label}>Lokasi<input style={isian} value={f.lokasi} maxLength={200} onChange={e => d.ubah({ lokasi: e.target.value })} placeholder="Mis. Hotel 412 lantai 7, Mina tenda 23" /></label>
        <label style={label}>Kronologi<textarea style={{ ...isian, minHeight: 110, resize: 'vertical', lineHeight: 1.45 }} value={f.kronologi} maxLength={4000} onChange={e => d.ubah({ kronologi: e.target.value })} placeholder="Apa yang terjadi, siapa yang melapor" /></label>
        <label style={label}>Tindak lanjut<textarea style={{ ...isian, minHeight: 90, resize: 'vertical', lineHeight: 1.45 }} value={f.tindakLanjut} maxLength={4000} onChange={e => d.ubah({ tindakLanjut: e.target.value })} placeholder="Dirujuk ke KKHI, dilaporkan ke sektor, dll" /></label>
        <div style={label}>Status
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button style={pil(f.status === 'terbuka')} aria-pressed={f.status === 'terbuka'} onClick={() => d.ubah({ status: 'terbuka' })}>Terbuka</button>
            <button style={pil(f.status === 'selesai')} aria-pressed={f.status === 'selesai'} onClick={() => d.ubah({ status: 'selesai' })}>Selesai</button>
          </div>
        </div>
      </div>
      <div style={kartu}>
        <div style={{ fontSize: fs(14), fontWeight: 600 }}>Foto ({lama.length + f.berkas.length}/{MAKS_FOTO})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {lama.map(x => <Foto key={x.id} f={x} d={d} />)}
          {f.berkas.map((b, i) => (
            <div key={b.prev} style={{ width: 76, height: 76, borderRadius: 14, overflow: 'hidden', position: 'relative', flex: 'none' }}>
              <img src={b.prev} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => { URL.revokeObjectURL(b.prev); d.ubah({ berkas: f.berkas.filter((_, k) => k !== i) }); }} aria-label="Batalkan foto"
                style={{ position: 'absolute', top: 4, right: 4, width: 28, height: 28, borderRadius: 999, border: 0, background: 'rgba(0,0,0,.6)', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
            </div>))}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={tambah} style={{ display: 'none' }} />
        {sisa > 0 && <button style={tombol} onClick={() => fileRef.current && fileRef.current.click()}>Tambah foto</button>}
        <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Foto disimpan di HP dulu, lalu diunggah ke penyimpanan kloter saat ada internet.</div>
      </div>
      {kurang && <div style={{ background: 'var(--red-100)', color: 'var(--red-700)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) }}>{kurang}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button style={tombol} onClick={d.batal}>Batal</button>
        <button style={{ ...utama, opacity: kurang ? 0.5 : 1 }} disabled={!!kurang} onClick={d.simpan}>Simpan</button>
      </div>
      {!f.baru && <button style={{ ...tombol, color: 'var(--red-700)' }} onClick={() => d.hapus(f.kid)}>Hapus catatan ini</button>}
      {!f.baru && f.petugas && <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)', textAlign: 'center' }}>Dicatat oleh {f.petugas}</div>}
    </div>
  );
}

function KartuKejadian({ k, d }) {
  const j = jenisDari(d, k.kategori), selesai = k.status === 'selesai';
  const nama = k.nama.length > 2 ? k.nama.slice(0, 2).join(', ') + ` +${k.nama.length - 2}` : k.nama.join(', ');
  return (
    <button onClick={() => d.buka(k)} style={{ ...kartu, textAlign: 'left', cursor: 'pointer', color: 'var(--color-text)', font: 'inherit', borderLeft: `5px solid ${j.w}`, gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, flex: 'none', display: 'grid', placeItems: 'center', background: j.w, color: '#fff' }}><Ikon d={j.d} s={20} /></span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: fs(16), fontWeight: 700, overflowWrap: 'anywhere' }}>{j.l}</div>
          <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>{waktuTeks(k.waktuKejadian)}</div>
        </div>
        <span style={{ flex: 'none', fontSize: fs(12), fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: selesai ? 'var(--color-accent-100)' : 'var(--red-100)', color: selesai ? 'var(--color-accent-700)' : 'var(--red-700)' }}>{selesai ? 'Selesai' : 'Terbuka'}</span>
      </div>
      {nama && <div style={{ fontSize: fs(14), fontWeight: 600, overflowWrap: 'anywhere' }}>{nama}</div>}
      {k.lokasi && <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)', overflowWrap: 'anywhere' }}>📍 {k.lokasi}</div>}
      {k.kronologi && <div style={{ fontSize: fs(14), lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{k.kronologi}</div>}
      {(k.foto.length > 0 || k.belum) && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: fs(12), color: 'var(--color-neutral-700)' }}>
        {k.foto.length > 0 && <span>📷 {k.foto.length} foto</span>}
        {k.belum && <span style={{ color: '#a86d00', fontWeight: 600 }}>· belum terkirim</span>}
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
    <div style={{ display: 'grid', gap: 14 }}>
      {d.contoh && <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>Mode contoh · catatan tidak disimpan ke server.</div>}
      <button style={{ ...utama, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={d.baru}><Ikon d="M12 5v14M5 12h14" s={20} />Catat kejadian</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[['terbuka', 'Terbuka'], ['selesai', 'Selesai'], ['semua', 'Semua']].map(([v, l]) =>
          <button key={v} style={pil(saring === v)} aria-pressed={saring === v} onClick={() => setSaring(v)}>{l} ({n[v]})</button>)}
      </div>
      {!tampil.length && <div style={{ ...kartu, textAlign: 'center', color: 'var(--color-neutral-700)', fontSize: fs(14) }}>{saring === 'terbuka' ? 'Tidak ada kejadian yang masih terbuka.' : 'Belum ada catatan.'}</div>}
      {tampil.map(k => <KartuKejadian key={k.kid} k={k} d={d} />)}
    </div>
  );
}
