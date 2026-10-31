// Halaman bilah bawah yang baru: Menu, Kirim, Profil (tampilan, akun, persetujuan admin).
import React, { useEffect, useState } from 'react';
import * as akun from './data/akun.js';
import * as tampilan from './tampilan.js';
import { unduhExcel, bacaExcel } from './excel.js';
import { imporJamaah } from './data/server.js';
import Kirim from './Kirim.jsx';
import Kejadian from './Kejadian.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--kaca)', borderRadius: 20, padding: '16px', boxShadow: 'var(--kartu-bayang)', border: '1px solid var(--kaca-garis)', display: 'grid', gap: 12 };
const judul = { fontSize: fs(14), fontWeight: 700, color: 'var(--color-neutral-700)' };
const tombolPil = on => ({ minHeight: 44, padding: '6px 4px', lineHeight: 1.2, borderRadius: 12, border: '1.5px solid ' + (on ? 'var(--color-accent)' : 'var(--kaca-garis)'), background: on ? 'var(--color-accent)' : 'var(--kaca)', color: on ? 'var(--on-accent)' : 'var(--color-text)', font: `700 ${fs(14)} var(--font-body)`, cursor: 'pointer' });
const tombol = { minHeight: 46, padding: '8px 12px', lineHeight: 1.25, borderRadius: 14, border: '1.5px solid var(--kaca-garis)', background: 'var(--kaca)', color: 'var(--color-text)', font: `700 ${fs(15)} var(--font-body)`, cursor: 'pointer' };
const Ikon = ({ d, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

const WARNA_MENU = [
  { kartu: 'kartu-safir', ubin: 'ubin ubin-safir', teks: 'var(--safir-teks)' },
  { kartu: 'kartu-emas', ubin: 'ubin ubin-emas', teks: 'var(--emas-teks)' },
  { kartu: 'kartu-zamrud', ubin: 'ubin', teks: 'var(--zamrud-teks)' },
  { kartu: 'kartu-safir', ubin: 'ubin ubin-safir', teks: 'var(--safir-teks)' },
  { kartu: 'kartu-zamrud', ubin: 'ubin', teks: 'var(--zamrud-teks)' },
  { kartu: 'kartu-koral', ubin: 'ubin ubin-koral', teks: 'var(--koral-teks)' }
];

function Menu({ v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {(v.menuItems || []).map((m, i) => {
        const w = WARNA_MENU[i % WARNA_MENU.length];
        return (
          <button key={m.l} onClick={m.on} className={w.kartu} style={{ borderRadius: 22, padding: '18px 14px', textAlign: 'center', justifyItems: 'center', alignContent: 'start', cursor: 'pointer', color: 'var(--color-text)', font: 'inherit', display: 'grid', gap: 8 }}>
            <span className={w.ubin} style={{ width: 54, height: 54, borderRadius: 16 }}><Ikon d={m.d} s={26} /></span>
            <span style={{ fontSize: fs(16), fontWeight: 800, marginTop: 2, color: w.teks }}>{m.l}</span>
            <span style={{ fontSize: fs(12.5), color: 'var(--teks-2)', lineHeight: 1.35 }}>{m.s}</span>
          </button>
        );
      })}
    </div>
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
      {rows === null && !galat && <div style={{ fontSize: fs(14), color: 'var(--color-neutral-700)' }}>Memuat…</div>}
      {rows && !menunggu.length && <div style={{ fontSize: fs(14), color: 'var(--color-neutral-700)' }}>Tidak ada pendaftar yang menunggu.</div>}
      {menunggu.map(r => (
        <div key={r.id} style={{ borderRadius: 14, background: 'var(--color-neutral-100)', padding: 12, display: 'grid', gap: 8 }}>
          <div style={{ fontSize: fs(15), fontWeight: 700 }}>{r.nama || '(tanpa nama)'}</div>
          <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>{r.email}<br />Kloter {r.kloter_diminta || '-'} · {r.embarkasi || '-'} · Gelombang {r.gelombang || '-'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button disabled={!!sibuk} onClick={() => aksi(akun.tolak, r.id)} style={tombol}>Tolak</button>
            <button disabled={!!sibuk} onClick={() => aksi(akun.setujui, r.id)} style={{ ...tombol, background: 'var(--color-accent)', color: 'var(--on-accent)', borderColor: 'var(--color-accent)' }}>{sibuk === r.id ? '…' : 'Setujui'}</button>
          </div>
        </div>
      ))}
      {lain.length > 0 && <details><summary style={{ fontSize: fs(14), cursor: 'pointer', color: 'var(--color-neutral-700)' }}>Semua akun ({lain.length})</summary>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>{lain.map(r => (
          <div key={r.id} style={{ fontSize: fs(13), display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span>{r.nama || r.email}{r.peran === 'admin' ? ' · admin' : ''}</span>
            <span style={{ color: r.status === 'aktif' ? 'var(--color-accent-700)' : 'var(--red-700)' }}>{r.status}{r.kloter ? ' · ' + r.kloter.kode : ''}</span>
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
    <div style={{ ...kartu, background: 'var(--safir-bg)', borderColor: 'var(--safir-tepi)' }}>
      <div style={{ ...judul, color: 'var(--safir-teks)' }}>Excel data jamaah</div>
      <button style={tombol} onClick={unduh} disabled={!!sibuk}>{sibuk === 'unduh' ? 'Menyiapkan…' : 'Unduh Excel'}</button>
      <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Berisi lembar Data jamaah dan Status ibadah (Haji, Umrah, Madinah). Lembar Data jamaah bisa dilengkapi di Excel lalu diunggah kembali.</div>
      {x.coba && <div style={{ fontSize: fs(13), color: 'var(--color-accent-2-800)', background: 'var(--color-accent-2-100)', borderRadius: 12, padding: '10px 12px', lineHeight: 1.45 }}>Mode coba: Unduh Excel berisi data contoh, bisa dipakai sebagai contoh format. File yang diunggah hanya dibaca untuk pratinjau, tidak disimpan.</div>}
      {x.bisaUnggah && <>
        <input ref={fileRef} type="file" accept=".xlsx" onChange={pilih} style={{ display: 'none' }} />
        <button style={tombol} onClick={() => fileRef.current && fileRef.current.click()} disabled={!!sibuk}>{sibuk === 'baca' ? 'Membaca file…' : 'Unggah Excel'}</button>
      </>}
      {pra && (
        <div style={{ borderRadius: 14, background: 'var(--color-neutral-100)', padding: 12, display: 'grid', gap: 8, fontSize: fs(14), lineHeight: 1.45 }}>
          <b>Pratinjau "{pra.sheet}"</b>
          <div>{pra.ubah} jamaah diperbarui · {pra.baru} jamaah baru</div>
          <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>Kolom terbaca: {pra.kolom.join(', ')}. Sel kosong tidak menghapus isian lama; tidak ada jamaah yang dihapus.</div>
          {pra.galat.length > 0 && <div style={{ fontSize: fs(13), color: 'var(--red-700)' }}>{pra.galat.length} baris dilewati: {pra.galat.slice(0, 3).join('; ')}{pra.galat.length > 3 ? '; …' : ''}</div>}
          {x.coba ? <>
            <div style={{ fontSize: fs(13), color: 'var(--color-accent-2-800)' }}>Ini hanya pratinjau. Untuk menyimpan, ketuk Selesai mencoba di Beranda lalu unggah file ini lagi.</div>
            <button style={tombol} onClick={() => setPra(null)}>Tutup pratinjau</button>
          </> : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button style={tombol} onClick={() => setPra(null)} disabled={sibuk === 'kirim'}>Batal</button>
            <button style={{ ...tombol, background: 'var(--color-accent)', color: 'var(--on-accent)', borderColor: 'var(--color-accent)' }} onClick={kirim} disabled={sibuk === 'kirim' || !pra.rows.length}>{sibuk === 'kirim' ? 'Menyimpan…' : 'Simpan'}</button>
          </div>)}
        </div>
      )}
      {hasil && <div style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) }}>{hasil}</div>}
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
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ ...kartu, background: 'var(--safir-bg)', borderColor: 'var(--safir-tepi)', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={{ ...judul, color: 'var(--safir-teks)' }}>Identitas Pengguna</div>
          {akun.aktif && p && p.peran === 'admin' && <span className="tag tag-accent-2">Admin</span>}
        </div>
        <div style={{ display: 'grid', gap: 8, background: 'var(--color-surface)', borderRadius: 12, padding: '12px 14px', border: '1px solid var(--safir-tepi)' }}>
          {barisId.map(([lbl, val], i) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingTop: i ? 8 : 0, borderTop: i ? '1px solid var(--color-neutral-200)' : 0 }}>
              <span style={{ fontSize: fs(13), fontWeight: 600, color: 'var(--color-neutral-700)' }}>{lbl}</span>
              <span style={{ fontSize: fs(15), fontWeight: 700, color: 'var(--color-text)', textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
        <button style={tombol} onClick={id.ubah || v.openSetup}>Ubah identitas pengguna</button>
      </div>
      <div style={{ ...kartu, background: 'var(--zamrud-bg)', borderColor: 'var(--zamrud-tepi)' }}>
        <div style={{ ...judul, color: 'var(--zamrud-teks)' }}>Tampilan</div>
        <div style={{ fontSize: fs(14), fontWeight: 600 }}>Tema</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {tampilan.TEMA.map(x => <button key={x.v} onClick={() => ubah({ tema: x.v })} aria-pressed={t.tema === x.v} style={tombolPil(t.tema === x.v)}>{x.l}</button>)}
        </div>
        <div style={{ fontSize: fs(14), fontWeight: 600 }}>Ukuran huruf</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {tampilan.UKURAN.map(x => <button key={x.v} onClick={() => ubah({ huruf: x.v })} aria-pressed={t.huruf === x.v} aria-label={x.l} style={{ ...tombolPil(t.huruf === x.v), fontSize: `${Math.round(14 * x.v)}px` }}>A</button>)}
        </div>
        <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>{tampilan.UKURAN.find(x => x.v === t.huruf).l} · tersimpan di HP ini</div>
      </div>
      <div style={{ ...kartu, background: 'var(--emas-bg)', borderColor: 'var(--emas-tepi)' }}>
        <div style={{ ...judul, color: 'var(--emas-teks)' }}>Kloter</div>
        <label style={{ display: 'grid', gap: 6, fontSize: fs(14), fontWeight: 600 }}>Tanggal berangkat
          <input type="date" defaultValue={v.tglBerangkat} key={v.tglBerangkat} onChange={e => v.setTglBerangkat(e.target.value)}
            style={{ minHeight: 44, borderRadius: 12, border: '1.5px solid var(--emas-tepi)', padding: '0 12px', font: `400 ${fs(15)} var(--font-body)`, background: 'var(--color-surface)', color: 'var(--color-text)' }} />
        </label>
        <div style={{ fontSize: fs(13), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Jamaah berumur 65 tahun atau lebih pada tanggal ini otomatis dihitung lansia.</div>
      </div>
      <Excel x={v.excel} />
      <div style={{ ...kartu, background: 'var(--zamrud-bg)', borderColor: 'var(--zamrud-tepi)' }}>
        <div style={{ ...judul, color: 'var(--zamrud-teks)' }}>Data dan sinkron</div>
        <button style={tombol} onClick={v.openSync}>Identitas, PIN, dan status sinkron</button>
      </div>
      {akun.aktif && p && p.peran === 'admin' && <Admin />}
      {akun.aktif && st.sesi && <button style={{ ...tombol, color: 'var(--red-700)' }} onClick={akun.keluar}>Keluar dari akun</button>}
    </div>
  );
}

export default function HalamanBaru({ v }) {
  const isi = v.isMenu ? <Menu v={v} /> : v.isKirim ? <Kirim d={v.kirim} /> : v.isKejadian ? <Kejadian d={v.kejadian} /> : <Profil v={v} />;
  const j = v.isMenu ? 'Menu' : v.isKirim ? 'Kirim' : v.isKejadian ? (v.kejadian && v.kejadian.form ? (v.kejadian.form.baru ? 'Catat kejadian' : 'Ubah catatan') : 'Catatan Kejadian') : 'Profil';
  return (
    <div style={{ padding: '8px 20px 24px', display: 'grid', gap: 14 }}>
      <div style={{ fontSize: fs(24), fontWeight: 700 }}>{j}</div>
      {isi}
    </div>
  );
}
