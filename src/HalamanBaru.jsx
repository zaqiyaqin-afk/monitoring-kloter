// Halaman bilah bawah yang baru: Menu, Kirim, Profil (tampilan, akun, persetujuan admin).
import React, { useEffect, useState } from 'react';
import * as akun from './data/akun.js';
import * as tampilan from './tampilan.js';
import { unduhExcel, bacaExcel } from './excel.js';
import { imporJamaah } from './data/server.js';
import Kirim from './Kirim.jsx';
import Kejadian from './Kejadian.jsx';
import { GAMBAR } from './gambar.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
// Gaya desain Cyber-Mint (token --m-* di tema.css)
const kartu = { background: 'var(--m-kartu)', borderRadius: 22, padding: '16px', boxShadow: 'var(--m-kartu-bayang)', color: 'var(--m-teks)', display: 'grid', gap: 12 };
const judul = { fontSize: fs(14), fontWeight: 800, color: 'var(--m-aksen-teks)' };
const keterangan = { fontSize: fs(11.5), color: 'var(--m-teks-2)', lineHeight: 1.45 };
const tombolPil = on => ({ minHeight: 44, padding: '6px 4px', lineHeight: 1.2, borderRadius: 11, border: '1.5px solid ' + (on ? '#16f298' : 'var(--m-garis-kartu)'), background: on ? 'var(--m-isi)' : 'var(--m-ubin)', color: on ? 'var(--m-on-isi)' : 'var(--m-teks)', font: `800 ${fs(12.5)} var(--font-body)`, cursor: 'pointer' });
const tombol = { minHeight: 46, padding: '8px 12px', lineHeight: 1.25, borderRadius: 14, border: '1.5px solid var(--m-garis-kartu)', background: 'var(--m-ubin)', color: 'var(--m-teks)', font: `800 ${fs(13.5)} var(--font-body)`, cursor: 'pointer' };
const tombolMint = { ...tombol, border: 0, background: 'var(--m-isi)', color: 'var(--m-on-isi)' };
const Ubin = ({ d, bg, fg }) => <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', display: 'grid', placeItems: 'center', background: bg, color: fg }}><Ikon d={d} s={19} /></span>;
const Ikon = ({ d, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

// Kartu menu: hanya Jamaah (data utama kloter) yang mint; lainnya kartu biasa dengan ubin berwarna
const WARNA_MENU = [
  { mint: true },
  { ubin: 'var(--m-lembut)', ikon: 'var(--m-aksen-teks)' },
  { ubin: 'var(--m-emas-bg)', ikon: 'var(--m-emas)' },
  { ubin: 'var(--m-safir-bg)', ikon: 'var(--m-safir)' },
  { ubin: 'var(--m-lembut)', ikon: 'var(--m-aksen-teks)' },
  { ubin: 'var(--m-koral-bg)', ikon: 'var(--m-koral)' }
];

function Menu({ v }) {
  const pr = v.menuRomb, maks = pr ? Math.max(1, ...pr.rombs.map(x => x.pct)) : 1;
  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 26, border: '1.5px solid var(--m-tepi)', padding: '22px 18px', display: 'grid', gap: 6, alignContent: 'center', minHeight: 136, boxSizing: 'border-box', boxShadow: 'var(--m-kartu-bayang)',
        background: `linear-gradient(90deg, rgba(6,26,23,.96) 0%, rgba(10,43,36,.87) 55%, rgba(20,240,150,.28) 100%), url(${GAMBAR.makkah}) center / cover no-repeat, #082420` }}>
        <h1 style={{ margin: 0, fontSize: fs(22), fontWeight: 800, lineHeight: 1.2, color: '#18f59a' }}>Menu Utama Kloter</h1>
        <p style={{ margin: 0, fontSize: fs(11.5), fontWeight: 600, lineHeight: 1.5, color: '#e2faf3' }}>Akses cepat seluruh modul manajemen jamaah, ibadah, badal, rekapitulasi, cetak PDF, dan catatan kejadian.</p>
      </div>
      <div className="mk-menu">
        {(v.menuItems || []).map((m, i) => {
          const w = WARNA_MENU[i % WARNA_MENU.length];
          return (
            <button key={m.l} onClick={m.on} style={{ borderRadius: 24, padding: '20px 12px 18px', textAlign: 'center', justifyItems: 'center', alignContent: 'start', cursor: 'pointer', border: 0, font: 'inherit', display: 'grid', gap: 6,
              background: w.mint ? 'var(--m-isi)' : 'var(--m-kartu)', boxShadow: w.mint ? 'none' : 'var(--m-kartu-bayang)', color: w.mint ? 'var(--m-on-isi)' : 'var(--m-teks)' }}>
              <span aria-hidden="true" style={{ width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', marginBottom: 6, background: w.mint ? '#05120e' : w.ubin, color: w.mint ? '#18f59a' : w.ikon }}><Ikon d={m.d} s={26} /></span>
              <span style={{ fontSize: fs(15), fontWeight: 800, lineHeight: 1.2 }}>{m.l}</span>
              <span style={{ fontSize: fs(11.5), fontWeight: 500, lineHeight: 1.35, color: w.mint ? 'var(--m-on-isi-2)' : 'var(--m-teks-2)' }}>{m.s}</span>
            </button>
          );
        })}
      </div>
      {pr && pr.rombs.length > 0 && (
        <button onClick={pr.on} style={{ borderRadius: 24, padding: '16px 18px', display: 'grid', gap: 12, border: 0, font: 'inherit', textAlign: 'left', cursor: 'pointer', background: 'var(--m-kartu)', boxShadow: 'var(--m-kartu-bayang)', color: 'var(--m-teks)' }}>
          <span style={{ display: 'grid', gap: 2 }}>
            <b style={{ fontSize: fs(13.5) }}>Progres Rombongan ({pr.rombs.length} Rombongan · {pr.regu} Regu)</b>
            <span style={{ fontSize: fs(11), color: 'var(--m-teks-2)' }}>{pr.kegiatan ? 'Fase aktif: ' + pr.kegiatan + ' · ' : ''}ketuk untuk rincian di Rekap</span>
          </span>
          <span role="img" aria-label={pr.rombs.map(x => 'Rombongan ' + x.r + ' ' + x.pct + '%').join(', ')} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4, height: 150, overflowX: 'auto' }}>
            {pr.rombs.map(x => {
              const penuh = x.n > 0 && x.pct >= 100;
              return (
                <span key={x.r} style={{ flex: '1 0 22px', display: 'grid', justifyItems: 'center', alignContent: 'end', gap: 6, height: '100%' }}>
                  <span style={{ fontSize: fs(9.5), fontWeight: 700, color: penuh ? 'var(--m-aksen-teks)' : 'var(--m-teks-2)' }}>{x.pct}%</span>
                  <span style={{ width: 16, height: Math.max(8, Math.round(x.pct / maks * 100)), borderRadius: 8, background: penuh ? 'var(--m-isi)' : 'var(--m-batang)' }} />
                  <span style={{ fontSize: fs(9.5), fontWeight: 700, color: penuh ? 'var(--m-aksen-teks)' : 'var(--m-teks-2)' }}>R{x.r}</span>
                </span>
              );
            })}
          </span>
          {pr.catatan && <span style={{ fontSize: fs(11), fontWeight: 700, color: 'var(--m-aksen-teks)' }}>● {pr.catatan}</span>}
        </button>
      )}
    </>
  );
}

function Admin() {
  const [rows, setRows] = useState(null), [galat, setGalat] = useState(''), [sibuk, setSibuk] = useState('');
  const muat = () => akun.daftarAkun().then(setRows, e => setGalat(e.message));
  useEffect(() => { muat(); }, []);
  const aksi = async (f, id) => { setSibuk(id); setGalat(''); try { await f(id); await muat(); } catch (e) { setGalat(e.message); } finally { setSibuk(''); } };
  const menunggu = (rows || []).filter(r => r.status === 'menunggu'), lain = (rows || []).filter(r => r.status !== 'menunggu');
  return (
    <div style={kartu}>
      <div style={judul}>Admin · persetujuan akun</div>
      {galat && <div style={{ background: 'var(--red-100)', color: 'var(--red-700)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) }}>{galat}</div>}
      {rows === null && !galat && <div style={{ fontSize: fs(14), color: 'var(--m-teks-2)' }}>Memuat…</div>}
      {rows && !menunggu.length && <div style={{ fontSize: fs(14), color: 'var(--m-teks-2)' }}>Tidak ada pendaftar yang menunggu.</div>}
      {menunggu.map(r => (
        <div key={r.id} style={{ borderRadius: 14, background: 'var(--m-ubin)', padding: 12, display: 'grid', gap: 8 }}>
          <div style={{ fontSize: fs(15), fontWeight: 700 }}>{r.nama || '(tanpa nama)'}</div>
          <div style={{ fontSize: fs(13), color: 'var(--m-teks-2)' }}>{r.email}<br />Kloter {r.kloter_diminta || '-'} · {r.embarkasi || '-'} · Gelombang {r.gelombang || '-'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button disabled={!!sibuk} onClick={() => aksi(akun.tolak, r.id)} style={tombol}>Tolak</button>
            <button disabled={!!sibuk} onClick={() => aksi(akun.setujui, r.id)} style={tombolMint}>{sibuk === r.id ? '…' : 'Setujui'}</button>
          </div>
        </div>
      ))}
      {lain.length > 0 && <details><summary style={{ fontSize: fs(14), cursor: 'pointer', color: 'var(--m-teks-2)' }}>Semua akun ({lain.length})</summary>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>{lain.map(r => (
          <div key={r.id} style={{ fontSize: fs(13), display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span>{r.nama || r.email}{r.peran === 'admin' ? ' · admin' : ''}</span>
            <span style={{ color: r.status === 'aktif' ? 'var(--m-aksen-teks)' : 'var(--m-koral)' }}>{r.status}{r.kloter ? ' · ' + r.kloter.kode : ''}</span>
          </div>))}</div></details>}
    </div>
  );
}

function Excel({ x }) {
  const [sibuk, setSibuk] = useState(''), [galat, setGalat] = useState(''), [pra, setPra] = useState(null), [hasil, setHasil] = useState('');
  const fileRef = React.useRef(null);
  if (!x) return null;
  const unduh = async () => { setSibuk('unduh'); setGalat(''); try { await unduhExcel(x); } catch (e) { setGalat(e.message || String(e)); } finally { setSibuk(''); } };
  const pilih = async e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return;
    setSibuk('baca'); setGalat(''); setHasil(''); try { setPra(await bacaExcel(f, x.porsiAda())); } catch (er) { setGalat(er.message || String(er)); } finally { setSibuk(''); } };
  const kirim = async () => { if (x.coba) return; setSibuk('kirim'); setGalat('');
    try { const r = await imporJamaah(pra.rows); setPra(null); setHasil(`Tersimpan: ${r.baru} jamaah baru, ${r.diubah} diperbarui${r.dilewati ? `, ${r.dilewati} dilewati` : ''}.`); x.sesudahUnggah(); }
    catch (er) { setGalat(er.message || String(er)); } finally { setSibuk(''); } };
  return (
    <div style={kartu}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Ubin d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 12l5 6M14 12l-5 6" bg="var(--m-safir-bg)" fg="var(--m-safir)" />
        <div style={{ ...judul, color: 'var(--m-safir)' }}>Excel data jamaah</div>
      </div>
      <div style={keterangan}>Berisi lembar Data jamaah dan Status ibadah (Haji, Umrah, Madinah). Lembar Data jamaah bisa dilengkapi di Excel lalu diunggah kembali.</div>
      {x.coba && <div style={{ fontSize: fs(12), color: 'var(--m-emas)', background: 'var(--m-emas-bg)', borderRadius: 12, padding: '10px 12px', lineHeight: 1.45 }}>Mode coba: Unduh Excel berisi data contoh, bisa dipakai sebagai contoh format. File yang diunggah hanya dibaca untuk pratinjau, tidak disimpan.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: x.bisaUnggah ? '1fr 1fr' : '1fr', gap: 10 }}>
        <button style={tombol} onClick={unduh} disabled={!!sibuk}>{sibuk === 'unduh' ? 'Menyiapkan…' : 'Unduh Excel'}</button>
        {x.bisaUnggah && <>
          <input ref={fileRef} type="file" accept=".xlsx" onChange={pilih} style={{ display: 'none' }} />
          <button style={tombolMint} onClick={() => fileRef.current && fileRef.current.click()} disabled={!!sibuk}>{sibuk === 'baca' ? 'Membaca file…' : 'Unggah Excel'}</button>
        </>}
      </div>
      <div style={{ fontSize: fs(11), fontWeight: 600, color: 'var(--m-aksen-teks)', lineHeight: 1.45 }}>● Sel kosong tidak menghapus isian lama; tidak ada jamaah yang dihapus.</div>
      {pra && (
        <div style={{ borderRadius: 14, background: 'var(--m-ubin)', padding: 12, display: 'grid', gap: 8, fontSize: fs(14), lineHeight: 1.45 }}>
          <b>Pratinjau "{pra.sheet}"</b>
          <div>{pra.ubah} jamaah diperbarui · {pra.baru} jamaah baru</div>
          <div style={keterangan}>Kolom terbaca: {pra.kolom.join(', ')}. Sel kosong tidak menghapus isian lama; tidak ada jamaah yang dihapus.</div>
          {pra.galat.length > 0 && <div style={{ fontSize: fs(13), color: 'var(--red-700)' }}>{pra.galat.length} baris dilewati: {pra.galat.slice(0, 3).join('; ')}{pra.galat.length > 3 ? '; …' : ''}</div>}
          {x.coba ? <>
            <div style={{ fontSize: fs(12.5), color: 'var(--m-emas)' }}>Ini hanya pratinjau. Untuk menyimpan, ketuk Selesai mencoba di Beranda lalu unggah file ini lagi.</div>
            <button style={tombol} onClick={() => setPra(null)}>Tutup pratinjau</button>
          </> : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button style={tombol} onClick={() => setPra(null)} disabled={sibuk === 'kirim'}>Batal</button>
            <button style={tombolMint} onClick={kirim} disabled={sibuk === 'kirim' || !pra.rows.length}>{sibuk === 'kirim' ? 'Menyimpan…' : 'Simpan'}</button>
          </div>)}
        </div>
      )}
      {hasil && <div role="status" style={{ background: 'var(--m-lembut)', color: 'var(--m-lembut-teks)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) }}>{hasil}</div>}
      {galat && <div style={{ background: 'var(--red-100)', color: 'var(--red-700)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) }}>{galat}</div>}
    </div>
  );
}

function Profil({ v }) {
  const [t, setT] = useState(tampilan.baca());
  const [st, setSt] = useState(akun.keadaan());
  useEffect(() => akun.dengar(setSt), []);
  const p = st.profil;
  const id = v.identitas || {};
  const namaLengkap = (akun.aktif && p && (p.nama || p.email)) || id.nama || v.ppihName || '-';
  const embarkasi = (akun.aktif && p && ((p.kloter && p.kloter.embarkasi) || p.embarkasi)) || id.embarkasi || '-';
  const kloter = (akun.aktif && p && (p.kloter ? p.kloter.kode : p.kloter_diminta)) || id.kloter || '-';
  const gelombang = (akun.aktif && p && ((p.kloter && p.kloter.gelombang) || p.gelombang)) || id.gelombang || '-';
  const barisId = [
    ['Nama lengkap', namaLengkap],
    ['Embarkasi', embarkasi],
    ['Kloter', kloter],
    ['Gelombang', gelombang]
  ];
  const ubah = x => setT(tampilan.simpan(x));
  return (
    <div className="mk-kolom" style={{ gap: 14, alignItems: 'start' }}>
      <div style={{ ...kartu, gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={{ ...judul, color: 'var(--m-safir)' }}>Identitas Pengguna</div>
          {akun.aktif && p && p.peran === 'admin' && <span className="tag tag-accent-2">Admin</span>}
        </div>
        <div style={{ display: 'grid', gap: 8, background: 'var(--m-ubin)', borderRadius: 14, padding: '12px 14px' }}>
          {barisId.map(([lbl, val], i) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingTop: i ? 8 : 0, borderTop: i ? '1px solid var(--m-garis-kartu)' : 0 }}>
              <span style={{ fontSize: fs(11.5), fontWeight: 500, color: 'var(--m-teks-2)' }}>{lbl}</span>
              <span style={{ fontSize: fs(12.5), fontWeight: 800, color: 'var(--m-teks)', textAlign: 'right', overflowWrap: 'anywhere' }}>{val}</span>
            </div>
          ))}
        </div>
        <button style={{ ...tombol, border: 0, background: 'var(--m-kartu-2)', minHeight: 44 }} onClick={id.ubah || v.openSetup}>Ubah identitas pengguna</button>
      </div>
      <div style={kartu}>
        <div style={judul}>Tampilan</div>
        <div style={{ fontSize: fs(12.5), fontWeight: 800 }}>Tema</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {tampilan.TEMA.map(x => <button key={x.v} onClick={() => ubah({ tema: x.v })} aria-pressed={t.tema === x.v} style={tombolPil(t.tema === x.v)}>{t.tema === x.v ? '✓ ' : ''}{x.l}</button>)}
        </div>
        <div style={{ fontSize: fs(12.5), fontWeight: 800 }}>Ukuran huruf</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {tampilan.UKURAN.map(x => <button key={x.v} onClick={() => ubah({ huruf: x.v })} aria-pressed={t.huruf === x.v} aria-label={x.l} style={{ ...tombolPil(t.huruf === x.v), display: 'grid', alignContent: 'center', gap: 1 }}><span aria-hidden="true" style={{ fontSize: `${Math.round(15 * x.v)}px`, lineHeight: 1 }}>A</span><span aria-hidden="true" style={{ fontSize: 10, fontWeight: 700 }}>{x.l}</span></button>)}
        </div>
        <div style={keterangan}>{tampilan.UKURAN.find(x => x.v === t.huruf).l} · tersimpan di HP ini</div>
      </div>
      <div style={kartu}>
        <div style={{ ...judul, color: 'var(--m-emas)' }}>Kloter · Tanggal berangkat</div>
        <label style={{ display: 'grid', gap: 6, fontSize: fs(11.5), fontWeight: 600, color: 'var(--m-teks-2)' }}>Tanggal berangkat
          <input type="date" defaultValue={v.tglBerangkat} key={v.tglBerangkat} onChange={e => v.setTglBerangkat(e.target.value)}
            style={{ minHeight: 44, borderRadius: 11, border: '1.5px solid transparent', padding: '0 12px', font: `800 ${fs(14)} var(--font-body)`, background: 'var(--m-ubin)', color: 'var(--m-teks)' }} />
        </label>
        <div style={keterangan}>Jamaah berumur 65 tahun atau lebih pada tanggal ini otomatis dihitung lansia.</div>
      </div>
      <Excel x={v.excel} />
      <div style={kartu}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ubin d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 7.9H7zM9.5 13.5l2 2 4-4" bg="var(--m-lembut)" fg="var(--m-aksen-teks)" />
          <div style={{ display: 'grid', minWidth: 0 }}>
            <div style={judul}>Data dan sinkron</div>
            <div style={keterangan}>Pengaturan identitas kloter, PIN akses, dan sinkronisasi data</div>
          </div>
        </div>
        <button style={{ ...tombol, border: 0, background: 'var(--m-lembut)', color: 'var(--m-aksen-teks)', minHeight: 44 }} onClick={v.openSync}>Identitas, PIN, dan status sinkron ›</button>
      </div>
      {akun.aktif && p && p.peran === 'admin' && <Admin />}
      {akun.aktif && st.sesi && <button style={{ ...tombol, color: 'var(--m-koral)', background: 'var(--m-kartu)' }} onClick={akun.keluar}>Keluar dari akun</button>}
    </div>
  );
}

export default function HalamanBaru({ v }) {
  const isi = v.isMenu ? <Menu v={v} /> : v.isKirim ? <Kirim d={v.kirim} /> : v.isKejadian ? <Kejadian d={v.kejadian} /> : <Profil v={v} />;
  const j = v.isMenu ? 'Menu' : v.isKirim ? 'Kirim' : v.isKejadian ? (v.kejadian && v.kejadian.form ? (v.kejadian.form.baru ? 'Catat kejadian' : 'Ubah catatan') : 'Catatan Kejadian') : 'Profil';
  return (
    <div style={{ padding: v.isMenu || v.isKirim || v.isProfil ? '14px 14px 24px' : '8px 20px 24px', display: 'grid', gap: 14 }}>
      {v.isMenu ? null : v.isKirim ? (
        <div style={{ display: 'grid', gap: 4, padding: '4px 4px 0' }}>
          <span style={{ fontSize: fs(11), fontWeight: 800, letterSpacing: '.06em', color: 'var(--m-aksen-teks)' }}>KIRIM PESAN WHATSAPP · {String(v.kloterLabel || '').toUpperCase()}</span>
          <span style={{ fontSize: fs(25), fontWeight: 800, lineHeight: 1.15, color: 'var(--m-teks)' }}>Kirim</span>
          <span style={{ fontSize: fs(11.5), color: 'var(--m-teks-2)', lineHeight: 1.45 }}>Pilih templat, lengkapi isiannya, lalu kirim ke grup WhatsApp. Pesan bisa diubah dulu sebelum dikirim.</span>
        </div>
      ) : v.isProfil ? (
        <div style={{ display: 'grid', gap: 4, padding: '4px 4px 0' }}>
          <span style={{ fontSize: fs(11), fontWeight: 800, letterSpacing: '.06em', color: 'var(--m-aksen-teks)' }}>PENGATURAN & DATA KLOTER · {String(v.kloterLabel || '').toUpperCase()}</span>
          <span style={{ fontSize: fs(25), fontWeight: 800, lineHeight: 1.15, color: 'var(--m-teks)' }}>Profil</span>
        </div>
      ) : <div style={{ fontSize: fs(24), fontWeight: 700 }}>{j}</div>}
      {isi}
    </div>
  );
}
