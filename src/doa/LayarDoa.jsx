// Layar Doa: ubin per kegiatan, lalu daftar doa, langkah thawaf/sa'i (dengan penghitung), atau daftar pilihan (wirid).
// Semua petugas bisa melaporkan kesalahan; admin bisa memperbaiki teks dan mengembalikan versi lama.
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { KEGIATAN } from './rangkaian.js';
import { ambilDoa, simpanDoa, riwayatDoa, kembalikanDoa, laporkan, daftarLaporan, tandaiLaporan, sayaAdmin, kirimLaporanTertunda, imporDoa } from './data.js';
import { fs, kartu, judulBesar, label, redup, tombol, tombolUtama, tombolTipis, masukan, arab, Ikon } from './gaya.jsx';

const UKURAN = [['Kecil', 23], ['Sedang', 28], ['Besar', 34]];
const baca = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const tulis = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

function TeksArab({ teks, px }) {
  // Baris berhuruf latin di dalam teks Arab adalah petunjuk tata cara dari buku
  const blok = [];
  String(teks || '').split('\n').forEach(b => {
    const latin = /[A-Za-z]/.test(b), akhir = blok[blok.length - 1];
    if (!latin && akhir && !akhir.latin) akhir.isi += '\n' + b; else blok.push({ latin, isi: b });
  });
  return blok.map((b, i) => b.latin
    ? <p key={i} style={{ margin: 0, fontSize: fs(13), fontWeight: 500, color: 'var(--teks-3)' }}>{b.isi}</p>
    : <p key={i} lang="ar" dir="rtl" style={arab(px)}>{b.isi}</p>);
}

function KartuDoa({ d, ket, px, admin, onUbah, onLapor }) {
  return (
    <article style={{ ...kartu, gap: 14 }}>
      {ket ? <span style={{ fontSize: fs(12), fontWeight: 600, color: 'var(--color-text)' }}>{ket}</span> : null}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: fs(16), lineHeight: 1.3, flex: '1 1 200px', minWidth: 0 }}>{d.judul}</h3>
        <span style={{ fontSize: fs(11.5), color: 'var(--teks-3)', whiteSpace: 'nowrap' }}>{(d.sumber ? 'Buku ' + d.sumber + ' ' : '') + 'hal. ' + d.hal}</span>
      </div>
      <TeksArab teks={d.arab} px={px} />
      {d.latin ? <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--teks-3)', whiteSpace: 'pre-line', fontSize: fs(14) }}>{d.latin}</p> : null}
      {d.arti ? <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: fs(14.5), lineHeight: 1.6 }}><span style={{ display: 'block', ...label, color: 'var(--teks-3)', marginBottom: 2 }}>ARTI</span>{d.arti}</p> : null}
      {admin && d.catatan ? <p style={{ margin: 0, borderRadius: 12, padding: '10px 12px', background: 'var(--color-bg)', fontSize: fs(13) }}><b>Catatan admin · </b>{d.catatan}</p> : null}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => onLapor(d)} style={{ ...tombolTipis, minHeight: 40, fontSize: fs(12.5) }}>Ada yang salah?</button>
        {admin ? <button type="button" onClick={() => onUbah(d)} style={{ ...tombol, minHeight: 40, fontSize: fs(12.5) }}>Ubah</button> : null}
      </div>
    </article>
  );
}

// Lembar ditaruh langsung di body supaya berada di atas bilah bawah
function Lembar({ judul, tutup, children }) {
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={judul} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,.45)', display: 'grid', alignItems: 'end' }} onClick={tutup}>
      <div onClick={e => e.stopPropagation()} style={{ fontFamily: 'var(--font-body)', fontSize: fs(15), color: 'var(--m-teks)', background: 'var(--color-bg)', borderRadius: '22px 22px 0 0', padding: '18px 16px calc(18px + env(safe-area-inset-bottom, 0px))', maxHeight: '88vh', overflowY: 'auto', display: 'grid', gap: 12, maxWidth: 640, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <b style={{ fontSize: fs(17) }}>{judul}</b>
          <button type="button" onClick={tutup} style={{ ...tombol, minHeight: 40 }}>Tutup</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

function FormLapor({ d, tutup, kabar }) {
  const [isi, setIsi] = useState('');
  const kirim = () => {
    const h = laporkan(d, isi);
    kabar(h === 'uji' ? 'Mode uji · laporan tidak dikirim' : h === 'antre' ? 'Laporan disimpan di HP · dikirim saat ada internet' : 'Laporan terkirim ke admin');
    tutup();
  };
  return (
    <Lembar judul="Laporkan kesalahan" tutup={tutup}>
      <p style={redup}>{d.judul} · hal. {d.hal}. Tulis bagian yang salah dan perbaikannya bila tahu.</p>
      <textarea id="lapor-isi" rows={4} value={isi} onChange={e => setIsi(e.target.value)} placeholder="Contoh: harakat kata ke-3 seharusnya fathah" style={{ ...masukan, resize: 'vertical' }} />
      <button type="button" disabled={isi.trim().length < 3} onClick={kirim} style={{ ...tombolUtama, opacity: isi.trim().length < 3 ? 0.5 : 1 }}>Kirim laporan</button>
    </Lembar>
  );
}

function FormUbah({ d, tutup, kabar, setelahSimpan }) {
  const [f, setF] = useState({ judul: d.judul, arab: d.arab, latin: d.latin || '', arti: d.arti || '', catatan: d.catatan || '' });
  const [riw, setRiw] = useState(null), [sibuk, setSibuk] = useState(false), [galat, setGalat] = useState('');
  useEffect(() => { riwayatDoa(d.id).then(setRiw).catch(() => setRiw([])); }, [d.id]);
  const isian = (k, l, baris, ar) => (
    <label style={{ display: 'grid', gap: 6, fontSize: fs(12), fontWeight: 500, color: 'var(--teks-3)' }}>{l}
      <textarea id={'ubah-' + k} rows={baris} dir={ar ? 'rtl' : undefined} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })}
        style={{ ...masukan, resize: 'vertical', ...(ar ? { fontFamily: "'Amiri', serif", fontSize: 22, lineHeight: 1.9 } : {}) }} />
    </label>
  );
  const simpan = async () => {
    setSibuk(true); setGalat('');
    try { const baru = await simpanDoa(d, f); setelahSimpan(baru); kabar('Perbaikan disimpan · tampil di semua HP setelah sinkron'); tutup(); }
    catch (e) { setGalat(e.message); } finally { setSibuk(false); }
  };
  const kembalikan = async r => {
    setSibuk(true); setGalat('');
    try { await kembalikanDoa(r.id); kabar('Dikembalikan ke versi ' + r.versi); setelahSimpan(null); tutup(); }
    catch (e) { setGalat(e.message); } finally { setSibuk(false); }
  };
  return (
    <Lembar judul={'Ubah doa · hal. ' + d.hal} tutup={tutup}>
      {isian('judul', 'Judul', 1)}
      {isian('arab', 'Teks Arab (baris berhuruf latin tampil sebagai petunjuk)', 6, true)}
      {isian('latin', 'Latin', 3)}
      {isian('arti', 'Arti', 4)}
      {isian('catatan', 'Catatan admin (tidak tampil untuk petugas)', 2)}
      {galat ? <p role="alert" style={{ ...redup, color: 'var(--red-700)' }}>{galat}</p> : null}
      <button type="button" disabled={sibuk} onClick={simpan} style={tombolUtama}>{sibuk ? 'Menyimpan…' : 'Simpan perbaikan'}</button>
      <div style={{ display: 'grid', gap: 8 }}>
        <b style={{ fontSize: fs(13.5) }}>Riwayat perubahan</b>
        {riw === null ? <p style={redup}>Memuat…</p> : !riw.length ? <p style={redup}>Belum ada perubahan sebelumnya. Versi saat ini: {d.versi || 1}.</p>
          : riw.map(r => (
            <div key={r.id} style={{ ...kartu, padding: 12, gap: 6 }}>
              <span style={{ fontSize: fs(12.5), fontWeight: 500 }}>Versi {r.versi} · {new Date(r.diubah).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <p dir="rtl" style={{ ...arab(18), lineHeight: 1.8, maxHeight: 80, overflow: 'hidden' }}>{(r.isi || {}).arab}</p>
              <button type="button" disabled={sibuk} onClick={() => kembalikan(r)} style={{ ...tombolTipis, minHeight: 40, justifySelf: 'start' }}>Kembalikan ke versi ini</button>
            </div>
          ))}
      </div>
    </Lembar>
  );
}

function Impor({ kabar, setelah }) {
  const [sibuk, setSibuk] = useState(false);
  const pilih = async e => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    setSibuk(true);
    try { const n = await imporDoa(JSON.parse(await f.text())); kabar(n + ' doa diimpor'); setelah(); }
    catch (err) { kabar(err instanceof SyntaxError ? 'Berkas bukan JSON yang benar.' : err.message); }
    finally { setSibuk(false); }
  };
  return (
    <label style={{ ...tombolTipis, display: 'grid', placeItems: 'center', cursor: sibuk ? 'wait' : 'pointer' }}>
      {sibuk ? 'Mengimpor…' : 'Impor isi doa dari berkas (admin)'}
      <input type="file" id="impor-doa" accept=".json,application/json" onChange={pilih} disabled={sibuk} style={{ display: 'none' }} />
    </label>
  );
}

function LaporanMasuk({ perId, buka, kabar }) {
  const [daftar, setDaftar] = useState(null);
  const muat = () => daftarLaporan().then(setDaftar).catch(e => { setDaftar([]); kabar(e.message); });
  useEffect(() => { muat(); }, []);
  if (!daftar || !daftar.length) return null;
  return (
    <section style={kartu} aria-label="Laporan kesalahan">
      <b style={{ fontSize: fs(14.5) }}>Laporan kesalahan · {daftar.length}</b>
      {daftar.map(l => (
        <div key={l.id} style={{ display: 'grid', gap: 6, borderTop: '1px solid var(--m-garis, var(--m-tepi))', paddingTop: 10 }}>
          <span style={{ fontSize: fs(12.5), fontWeight: 500 }}>{(perId[l.doa_id] || {}).judul || l.doa_id}</span>
          <span style={{ fontSize: fs(13.5) }}>{l.pesan}</span>
          <span style={{ fontSize: fs(11.5), color: 'var(--teks-3)' }}>{l.pelapor_nama || 'Petugas'} · {new Date(l.dibuat).toLocaleDateString('id-ID')}</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {perId[l.doa_id] ? <button type="button" onClick={() => buka(l.doa_id)} style={{ ...tombol, minHeight: 40 }}>Buka doa</button> : null}
            <button type="button" onClick={() => tandaiLaporan(l.id).then(muat).catch(e => kabar(e.message))} style={{ ...tombolTipis, minHeight: 40 }}>Tandai selesai</button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function LayarDoa() {
  const [isi, setIsi] = useState({ status: 'memuat', daftar: [] });
  const [lihat, setLihat] = useState(() => baca('mk.doa.lihat', { k: null, d: null }));
  const [iUk, setIUk] = useState(() => baca('mk.doa.huruf', 1));
  const [langkah, setLangkah] = useState(() => baca('mk.doa.langkah', {}));
  const [cari, setCari] = useState('');
  const [lapor, setLapor] = useState(null), [ubah, setUbah] = useState(null), [pesan, setPesan] = useState('');
  const admin = sayaAdmin() || (import.meta.env.DEV && !sayaAdmin() && isi.dari === 'uji');

  const muat = () => ambilDoa().then(r => setIsi({ status: r.daftar.length ? 'siap' : r.dari, daftar: r.daftar, dari: r.dari })).catch(e => setIsi({ status: 'galat', daftar: [], galat: e.message }));
  useEffect(() => { muat(); const on = () => { kirimLaporanTertunda(); muat(); }; window.addEventListener('online', on); return () => window.removeEventListener('online', on); }, []);
  useEffect(() => { tulis('mk.doa.lihat', lihat); const el = document.querySelector('main'); if (el) el.scrollTop = 0; }, [lihat.k, lihat.d]);
  useEffect(() => { if (!pesan) return; const t = setTimeout(() => setPesan(''), 3200); return () => clearTimeout(t); }, [pesan]);

  const perId = useMemo(() => Object.fromEntries(isi.daftar.map(d => [d.id, d])), [isi.daftar]);
  const px = (UKURAN[iUk] || UKURAN[1])[1];
  const k = lihat.k && KEGIATAN.find(x => x.id === lihat.k);
  const satu = lihat.d && perId[lihat.d];
  const kartuDoa = (d, ket, key) => d ? <KartuDoa key={key || d.id} d={d} ket={ket} px={px} admin={admin} onUbah={setUbah} onLapor={setLapor} /> : null;
  const setelahSimpan = baru => { if (baru) setIsi(s => ({ ...s, daftar: s.daftar.map(d => (d.id === baru.id ? baru : d)) })); else muat(); };

  const alat = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {k || satu ? <button type="button" onClick={() => setLihat(satu && k ? { k: k.id, d: null } : { k: null, d: null })} style={tombol}>‹ {satu && k ? k.nama : 'Semua kegiatan'}</button> : null}
      <button type="button" onClick={() => { const n = (iUk + 1) % UKURAN.length; setIUk(n); tulis('mk.doa.huruf', n); }} style={tombolTipis} aria-label="Ganti ukuran huruf Arab">Huruf Arab: {UKURAN[iUk][0]}</button>
    </div>
  );

  let isiLayar;
  if (isi.status !== 'siap') {
    const teks = { memuat: 'Memuat doa…', 'perlu-masuk': 'Isi doa hanya bisa dibuka setelah masuk dengan akun kloter. Di mode coba, menu ini belum berisi doa.',
      offline: 'Doa belum pernah diunduh ke HP ini. Buka menu ini sekali saat ada internet; setelah itu doa bisa dibaca tanpa sinyal.',
      kosong: 'Belum ada doa yang tersimpan.', galat: 'Doa gagal dimuat: ' + (isi.galat || '') }[isi.status] || 'Belum ada doa.';
    isiLayar = (
      <div style={kartu}>
        <p style={{ ...redup, fontSize: fs(14) }}>{teks}</p>
        {isi.status === 'galat' || isi.status === 'offline' ? <button type="button" onClick={muat} style={tombol}>Coba lagi</button> : null}
        {sayaAdmin() && isi.status === 'server' ? <Impor kabar={setPesan} setelah={muat} /> : null}
      </div>
    );
  } else if (satu) {
    isiLayar = kartuDoa(satu);
  } else if (k && k.mode === 'langkah') {
    const n = k.bagian.length, i = Math.min(langkah[k.id] || 0, n - 1), b = k.bagian[i];
    const pergi = j => { const baru = { ...langkah, [k.id]: j }; setLangkah(baru); tulis('mk.doa.langkah', baru); const el = document.querySelector('main'); if (el) el.scrollTop = 0; };
    isiLayar = (
      <>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }} role="tablist" aria-label={'Langkah ' + k.nama}>
          {k.bagian.map((x, j) => (
            <button key={j} type="button" role="tab" aria-selected={j === i} title={x.judul} onClick={() => pergi(j)}
              style={{ flex: 'none', minWidth: 44, minHeight: 44, borderRadius: 999, border: '1px solid var(--m-tepi)', cursor: 'pointer', font: `600 ${fs(13)} var(--font-body)`, fontVariantNumeric: 'tabular-nums', background: j === i ? 'var(--color-accent)' : 'var(--m-kartu)', color: j === i ? 'var(--on-accent)' : 'var(--m-teks)' }}>{j + 1}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 2 }}>
          <span style={label}>LANGKAH {i + 1} DARI {n}</span>
          <h3 style={{ margin: 0, fontSize: fs(20), lineHeight: 1.25 }}>{b.judul}</h3>
          {b.ket ? <p style={redup}>{b.ket}</p> : null}
        </div>
        {b.doa.map((x, j) => kartuDoa(perId[x.id], x.ket, i + '-' + j))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
          <button type="button" disabled={i === 0} onClick={() => pergi(i - 1)} style={{ ...tombol, opacity: i === 0 ? 0.45 : 1 }}>← Sebelumnya</button>
          <button type="button" onClick={() => (i < n - 1 ? pergi(i + 1) : (pergi(0), setLihat({ k: null, d: null }), setPesan(k.nama + ' selesai')))} style={tombolUtama}>{i < n - 1 ? 'Lanjut: langkah ' + (i + 2) + ' →' : 'Selesai ✓'}</button>
        </div>
      </>
    );
  } else if (k) {
    isiLayar = k.bagian.map((b, j) => (
      <section key={j} style={{ display: 'grid', gap: 10 }}>
        <h3 style={{ ...label, margin: '6px 0 0' }}>{b.judul.toUpperCase()}</h3>
        {k.mode === 'pilih' ? (
          <div style={{ ...kartu, padding: 0, gap: 0, overflow: 'hidden' }}>
            {b.doa.map((x, q) => { const d = perId[x.id]; if (!d) return null; return (
              <button key={x.id} type="button" onClick={() => setLihat({ k: k.id, d: x.id })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', border: 0, borderTop: q ? '1px solid var(--m-garis, var(--m-tepi))' : 0, background: 'transparent', color: 'var(--m-teks)', padding: '14px 16px', minHeight: 52, font: `500 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>
                <span style={{ flex: 1, minWidth: 0 }}>{d.judul}</span><span aria-hidden="true" style={{ color: 'var(--teks-3)', fontSize: 20 }}>›</span>
              </button>); })}
          </div>
        ) : b.doa.map(x => kartuDoa(perId[x.id], x.ket))}
      </section>
    ));
  } else {
    const q = cari.trim().toLowerCase();
    const hasil = q ? isi.daftar.filter(d => (d.judul + ' ' + (d.arti || '') + ' ' + (d.latin || '')).toLowerCase().includes(q)).slice(0, 30) : [];
    const kegiatanDari = id => (KEGIATAN.find(x => x.bagian.some(b => b.doa.some(y => y.id === id))) || {}).id || null;
    isiLayar = (
      <>
        <input type="search" id="cari-doa" value={cari} onChange={e => setCari(e.target.value)} placeholder="Cari doa, misalnya: zamzam" aria-label="Cari doa" style={masukan} />
        {q ? (
          <div style={{ ...kartu, padding: 0, gap: 0, overflow: 'hidden' }}>
            {hasil.length ? hasil.map((d, q2) => (
              <button key={d.id} type="button" onClick={() => setLihat({ k: kegiatanDari(d.id), d: d.id })}
                style={{ textAlign: 'left', border: 0, borderTop: q2 ? '1px solid var(--m-garis, var(--m-tepi))' : 0, background: 'transparent', color: 'var(--m-teks)', padding: '13px 16px', minHeight: 48, font: `500 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>{d.judul}</button>
            )) : <p style={{ ...redup, padding: 16 }}>Tidak ada doa yang cocok.</p>}
          </div>
        ) : (
          <>
            {admin && isi.dari !== 'uji' ? <LaporanMasuk perId={perId} buka={id => setLihat({ k: kegiatanDari(id), d: id })} kabar={setPesan} /> : null}
            {sayaAdmin() ? <Impor kabar={setPesan} setelah={muat} /> : null}
            <div style={{ ...kartu, gap: 0, padding: '4px 16px' }}>
              {KEGIATAN.map((x, i) => (
                <button key={x.id} type="button" onClick={() => setLihat({ k: x.id, d: null })}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 58, padding: '8px 0', textAlign: 'left', border: 0, borderTop: i ? '1px solid var(--color-divider)' : 0, background: 'transparent', color: 'var(--m-teks)', cursor: 'pointer', font: 'inherit' }}>
                  <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
                    <span style={{ fontSize: fs(15), fontWeight: 500 }}>{x.nama}</span>
                    <span style={{ fontSize: fs(12.5), color: 'var(--teks-3)', lineHeight: 1.35 }}>{x.mode === 'langkah' ? x.bagian.length + ' langkah' : x.ket}</span>
                  </span>
                  <Ikon d="M9 6l6 6-6 6" />
                </button>
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="mk-kolom" style={{ padding: '12px 12px 24px', gap: 12 }}>
      <div className="mk-penuh" style={{ display: 'grid', gap: 4, padding: '0 4px' }}>
        {k || satu ? <h2 style={judulBesar}>{satu ? satu.judul : k.nama}</h2> : <p style={redup}>Pilih kegiatan. Thawaf dan sa'i dibuka langkah demi langkah, lengkap dengan hitungan putaran.</p>}
      </div>
      <div className="mk-penuh" style={{ display: 'grid', gap: 12 }}>
        {isi.status === 'siap' ? alat : null}
        {isiLayar}
        {isi.dari === 'uji' ? <p style={{ ...redup, fontSize: fs(11.5) }}>Mode uji lokal · isi dari berkas doa-lokal.json, perubahan hanya tersimpan di browser ini.</p> : null}
      </div>
      {lapor ? <FormLapor d={lapor} tutup={() => setLapor(null)} kabar={setPesan} /> : null}
      {ubah ? <FormUbah d={ubah} tutup={() => setUbah(null)} kabar={setPesan} setelahSimpan={setelahSimpan} /> : null}
      {pesan ? <div role="status" style={{ position: 'fixed', left: 16, right: 16, bottom: 'calc(100px + env(safe-area-inset-bottom, 0px))', zIndex: 50, maxWidth: 520, margin: '0 auto', padding: '12px 16px', borderRadius: 14, background: 'var(--m-teks)', color: 'var(--color-bg)', font: `500 ${fs(13)} var(--font-body)`, textAlign: 'center' }}>{pesan}</div> : null}
    </div>
  );
}
