// Halaman Kirim, Kejadian, dan Profil (tampilan, akun, persetujuan admin).
import React, { useEffect, useState } from 'react';
import * as akun from './data/akun.js';
import * as tampilan from './tampilan.js';
import { unduhExcel, bacaExcel } from './excel.js';
import { imporJamaah } from './data/server.js';
import Kirim from './Kirim.jsx';
import Kejadian from './Kejadian.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
// Gaya desain Cyber-Mint (token --m-* di tema.css)
const kartu = { background: 'var(--m-kartu)', borderRadius: 20, padding: '16px', color: 'var(--m-teks)', display: 'grid', gap: 12 };
const judul = { fontSize: fs(16), fontWeight: 500, color: 'var(--m-teks)' };
const keterangan = { fontSize: fs(12.5), color: 'var(--m-teks-2)', lineHeight: 1.45 };
const tombolPil = on => ({ minHeight: 56, padding: '6px 4px', lineHeight: 1.2, borderRadius: 16, border: '1px solid ' + (on ? 'var(--color-accent)' : 'var(--m-tepi)'), background: on ? 'var(--color-accent)' : 'var(--color-surface)', color: on ? 'var(--on-accent)' : 'var(--m-teks)', font: `${on ? 600 : 400} ${fs(12.5)} var(--font-body)`, cursor: 'pointer' });
const tombol = { minHeight: 48, padding: '8px 16px', lineHeight: 1.25, borderRadius: 24, border: '1px solid var(--m-tepi)', background: 'var(--color-surface)', color: 'var(--m-teks)', font: `400 ${fs(13.5)} var(--font-body)`, cursor: 'pointer' };
const tombolMint = { ...tombol, border: 0, background: 'var(--m-isi)', color: 'var(--m-on-isi)', fontWeight: 600 };
const Ubin = ({ d }) => <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 20, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-bg)', color: 'var(--m-teks)' }}><Ikon d={d} s={20} /></span>;
const Ikon = ({ d, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

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
        <div key={r.id} style={{ borderRadius: 16, background: 'var(--color-bg)', padding: 12, display: 'grid', gap: 8 }}>
          <div style={{ fontSize: fs(15), fontWeight: 500 }}>{r.nama || '(tanpa nama)'}</div>
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
            <span style={{ color: r.status === 'aktif' ? 'var(--m-teks)' : 'var(--red-700)' }}>{r.status}{r.kloter ? ' · ' + r.kloter.kode : ''}</span>
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
        <Ubin d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 12l5 6M14 12l-5 6" />
        <div style={judul}>Excel data jamaah</div>
      </div>
      <div style={keterangan}>Berisi lembar Data jamaah dan Status ibadah (Haji, Umrah, Madinah). Lembar Data jamaah bisa dilengkapi di Excel lalu diunggah kembali.</div>
      {x.coba && <div style={{ fontSize: fs(12.5), color: 'var(--m-teks)', background: 'var(--color-bg)', borderRadius: 12, padding: '10px 12px', lineHeight: 1.45 }}>Mode coba: Unduh Excel berisi data contoh, bisa dipakai sebagai contoh format. File yang diunggah hanya dibaca untuk pratinjau, tidak disimpan.</div>}
      <div style={{ display: 'grid', gridTemplateColumns: x.bisaUnggah ? '1fr 1fr' : '1fr', gap: 10 }}>
        <button style={tombol} onClick={unduh} disabled={!!sibuk}>{sibuk === 'unduh' ? 'Menyiapkan…' : 'Unduh Excel'}</button>
        {x.bisaUnggah && <>
          <input ref={fileRef} type="file" accept=".xlsx" onChange={pilih} style={{ display: 'none' }} />
          <button style={tombolMint} onClick={() => fileRef.current && fileRef.current.click()} disabled={!!sibuk}>{sibuk === 'baca' ? 'Membaca file…' : 'Unggah Excel'}</button>
        </>}
      </div>
      <div style={keterangan}>Sel kosong tidak menghapus isian lama; tidak ada jamaah yang dihapus.</div>
      {pra && (
        <div style={{ borderRadius: 16, background: 'var(--color-bg)', padding: 12, display: 'grid', gap: 8, fontSize: fs(14), lineHeight: 1.45 }}>
          <b>Pratinjau "{pra.sheet}"</b>
          <div>{pra.ubah} jamaah diperbarui · {pra.baru} jamaah baru</div>
          <div style={keterangan}>Kolom terbaca: {pra.kolom.join(', ')}. Sel kosong tidak menghapus isian lama; tidak ada jamaah yang dihapus.</div>
          {pra.galat.length > 0 && <div style={{ fontSize: fs(13), color: 'var(--red-700)' }}>{pra.galat.length} baris dilewati: {pra.galat.slice(0, 3).join('; ')}{pra.galat.length > 3 ? '; …' : ''}</div>}
          {x.coba ? <>
            <div style={{ fontSize: fs(12.5), color: 'var(--m-teks)' }}>Ini hanya pratinjau. Untuk menyimpan, ketuk Selesai mencoba di Beranda lalu unggah file ini lagi.</div>
            <button style={tombol} onClick={() => setPra(null)}>Tutup pratinjau</button>
          </> : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button style={tombol} onClick={() => setPra(null)} disabled={sibuk === 'kirim'}>Batal</button>
            <button style={tombolMint} onClick={kirim} disabled={sibuk === 'kirim' || !pra.rows.length}>{sibuk === 'kirim' ? 'Menyimpan…' : 'Simpan'}</button>
          </div>)}
        </div>
      )}
      {hasil && <div role="status" style={{ background: 'var(--color-accent-200)', color: 'var(--color-accent)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) }}>{hasil}</div>}
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
    <div className="mk-kolom" style={{ gap: 12, alignItems: 'start' }}>
      <div style={{ ...kartu, gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <div style={judul}>Identitas pengguna</div>
          {akun.aktif && p && p.peran === 'admin' && <span className="mk-lencana">Admin</span>}
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {barisId.map(([lbl, val], i) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingTop: i ? 8 : 0, borderTop: i ? '1px solid var(--m-garis-kartu)' : 0 }}>
              <span style={{ fontSize: fs(13), color: 'var(--m-teks-2)' }}>{lbl}</span>
              <span style={{ fontSize: fs(13.5), fontWeight: 500, color: 'var(--m-teks)', textAlign: 'right', overflowWrap: 'anywhere' }}>{val}</span>
            </div>
          ))}
        </div>
        <button style={tombol} onClick={id.ubah || v.openSetup}>Ubah identitas pengguna</button>
      </div>
      <div style={kartu}>
        <div style={judul}>Tampilan</div>
        <div style={{ fontSize: fs(13.5), fontWeight: 500 }}>Ukuran huruf</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {tampilan.UKURAN.map(x => <button key={x.v} onClick={() => ubah({ huruf: x.v })} aria-pressed={t.huruf === x.v} aria-label={x.l} style={{ ...tombolPil(t.huruf === x.v), display: 'grid', alignContent: 'center', gap: 1 }}><span aria-hidden="true" style={{ fontSize: `${Math.round(15 * x.v)}px`, lineHeight: 1 }}>A</span><span aria-hidden="true" style={{ fontSize: 11 }}>{x.l}</span></button>)}
        </div>
        <div style={keterangan}>{tampilan.UKURAN.find(x => x.v === t.huruf).l} · tersimpan di HP ini</div>
      </div>
      <div style={kartu}>
        <div style={judul}>Kloter · tanggal berangkat</div>
        <label style={{ display: 'grid', gap: 6, fontSize: fs(13.5), fontWeight: 500 }}>Tanggal berangkat
          <input type="date" defaultValue={v.tglBerangkat} key={v.tglBerangkat} onChange={e => v.setTglBerangkat(e.target.value)}
            style={{ minHeight: 48, borderRadius: 12, border: '1px solid var(--m-tepi)', padding: '0 12px', font: `400 ${fs(15)} var(--font-body)`, background: 'var(--color-surface)', color: 'var(--m-teks)' }} />
        </label>
        <div style={keterangan}>Jamaah berumur 65 tahun atau lebih pada tanggal ini otomatis dihitung lansia.</div>
      </div>
      <Excel x={v.excel} />
      <div style={kartu}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ubin d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 7.9H7zM9.5 13.5l2 2 4-4" />
          <div style={{ display: 'grid', minWidth: 0 }}>
            <div style={judul}>Data dan sinkron</div>
            <div style={keterangan}>Pengaturan identitas kloter, PIN akses, dan sinkronisasi data</div>
          </div>
        </div>
        <button style={tombol} onClick={v.openSync}>Identitas, PIN, dan status sinkron</button>
      </div>
      {akun.aktif && p && p.peran === 'admin' && <Admin />}
      {akun.aktif && st.sesi && <button style={{ ...tombol, color: 'var(--red-700)' }} onClick={akun.keluar}>Keluar dari akun</button>}
    </div>
  );
}

export default function HalamanBaru({ v }) {
  const isi = v.isKirim ? <Kirim d={v.kirim} /> : v.isKejadian ? <Kejadian d={v.kejadian} /> : <Profil v={v} />;
  return (
    <div style={{ padding: '12px 12px 24px', display: 'grid', gap: 12 }}>
      {isi}
    </div>
  );
}
