// Halaman bilah bawah yang baru: Menu, Kirim, Profil (tampilan, akun, persetujuan admin).
import React, { useEffect, useState } from 'react';
import * as akun from './data/akun.js';
import * as tampilan from './tampilan.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,.06)', border: '1px solid var(--color-divider)', display: 'grid', gap: 12 };
const judul = { fontSize: fs(13), fontWeight: 700, color: 'var(--color-neutral-700)', letterSpacing: '.02em', textTransform: 'uppercase' };
const tombolPil = on => ({ minHeight: 44, padding: '6px 4px', lineHeight: 1.2, borderRadius: 12, border: '1.5px solid ' + (on ? 'var(--color-accent)' : 'var(--color-divider)'), background: on ? 'var(--color-accent)' : 'transparent', color: on ? 'var(--on-accent)' : 'var(--color-text)', font: `600 ${fs(14)} var(--font-body)`, cursor: 'pointer' });
const tombol = { minHeight: 46, padding: '8px 12px', lineHeight: 1.25, borderRadius: 14, border: '1.5px solid var(--color-divider)', background: 'transparent', color: 'var(--color-text)', font: `600 ${fs(15)} var(--font-body)`, cursor: 'pointer' };
const Ikon = ({ d, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;

function Menu({ v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {(v.menuItems || []).map(m => (
        <button key={m.l} onClick={m.on} style={{ ...kartu, textAlign: 'left', cursor: 'pointer', color: 'var(--color-text)', font: 'inherit', gap: 8 }}>
          <span style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}><Ikon d={m.d} /></span>
          <span style={{ fontSize: fs(16), fontWeight: 700 }}>{m.l}</span>
          <span style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>{m.s}</span>
        </button>
      ))}
      <div style={{ ...kartu, gap: 8, opacity: 0.7 }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--color-accent-2-100)', color: 'var(--color-accent-2-700)' }}><Ikon d="M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></span>
        <span style={{ fontSize: fs(16), fontWeight: 700 }}>Catatan Kejadian</span>
        <span style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>Segera hadir</span>
      </div>
    </div>
  );
}

function Kirim() {
  const daftar = ['Jadwal pengambilan katering per rombongan', 'Pengingat kegiatan ibadah dan tata caranya', 'Undangan pertemuan karom dan karu', 'Undangan pengajian jamaah', 'Undangan pengecekan kesehatan'];
  return (
    <div style={kartu}>
      <div style={judul}>Kirim pesan ke grup</div>
      <div style={{ fontSize: fs(14), color: 'var(--color-neutral-700)', lineHeight: 1.5 }}>Templat pesan WhatsApp sedang disiapkan. Nanti setiap templat bisa diubah lalu dikirim ke grup.</div>
      {daftar.map(d => <div key={d} style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--color-neutral-100)', fontSize: fs(15) }}>{d}</div>)}
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

function Profil({ v }) {
  const [t, setT] = useState(tampilan.baca());
  const [st, setSt] = useState(akun.keadaan());
  useEffect(() => akun.dengar(setSt), []);
  const p = st.profil;
  const ubah = x => setT(tampilan.simpan(x));
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {akun.aktif && p && (
        <div style={{ ...kartu, background: 'var(--hero)', color: '#fff', border: 0 }}>
          <div style={{ fontSize: fs(18), fontWeight: 700 }}>{p.nama || p.email}</div>
          <div style={{ fontSize: fs(14), opacity: 0.85 }}>{p.tusi}<br />{p.email}</div>
          <div style={{ fontSize: fs(14) }}>Kloter {p.kloter ? p.kloter.kode : (p.kloter_diminta || '-')} · Gelombang {p.gelombang || '-'}{p.peran === 'admin' ? ' · Admin' : ''}</div>
        </div>
      )}
      <div style={kartu}>
        <div style={judul}>Tampilan</div>
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
      <div style={kartu}>
        <div style={judul}>Data dan sinkron</div>
        <button style={tombol} onClick={v.openSync}>Identitas, Sheet, dan status sinkron</button>
      </div>
      {akun.aktif && p && p.peran === 'admin' && <Admin />}
      {akun.aktif && st.sesi && <button style={{ ...tombol, color: 'var(--red-700)' }} onClick={akun.keluar}>Keluar dari akun</button>}
    </div>
  );
}

export default function HalamanBaru({ v }) {
  const isi = v.isMenu ? <Menu v={v} /> : v.isKirim ? <Kirim /> : <Profil v={v} />;
  const j = v.isMenu ? 'Menu' : v.isKirim ? 'Kirim' : 'Profil';
  return (
    <div style={{ padding: '8px 20px 24px', display: 'grid', gap: 14 }}>
      <div style={{ fontSize: fs(24), fontWeight: 700 }}>{j}</div>
      {isi}
    </div>
  );
}
