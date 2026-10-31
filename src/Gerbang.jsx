// Gerbang akun: aplikasi baru terbuka setelah petugas masuk dan disetujui admin.
// Bila Supabase belum diatur (.env kosong), gerbang dilewati dan aplikasi berjalan seperti biasa.
import React, { useEffect, useState } from 'react';
import * as akun from './data/akun.js';
import { EMBARKASI, TUSI } from './identitas.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const S = {
  layar: { minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  hero: { width: '100%', background: 'var(--hero)', color: '#fff', padding: '36px 20px 64px', boxSizing: 'border-box', textAlign: 'center' },
  kartu: { width: 'min(440px, calc(100% - 32px))', marginTop: -44, background: 'var(--color-surface)', borderRadius: 24, boxShadow: 'var(--shadow-lg)', padding: '20px 18px 22px', boxSizing: 'border-box', display: 'grid', gap: 12 },
  label: { fontSize: fs(13), fontWeight: 600, color: 'var(--color-neutral-700)', display: 'grid', gap: 6 },
  input: { height: 48, borderRadius: 14, border: '1.5px solid var(--color-divider)', padding: '0 14px', fontSize: fs(16), fontFamily: 'inherit', background: 'var(--color-surface)', color: 'var(--color-text)', outline: 'none', boxSizing: 'border-box', width: '100%' },
  tombol: { minHeight: 52, padding: '8px 12px', border: 0, borderRadius: 16, background: 'var(--color-accent)', color: 'var(--on-accent)', fontSize: fs(16), fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' },
  tombol2: { minHeight: 46, padding: '8px 12px', lineHeight: 1.25, border: '1.5px solid var(--color-divider)', borderRadius: 14, background: 'transparent', color: 'var(--color-text)', fontSize: fs(15), fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' },
  galat: { background: 'var(--red-100)', color: 'var(--red-700)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14) },
  info: { background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', borderRadius: 12, padding: '10px 12px', fontSize: fs(14), lineHeight: 1.5 },
  kecil: { fontSize: fs(13), color: 'var(--color-neutral-700)', lineHeight: 1.5, textAlign: 'center' }
};

function Kepala({ judul, sub }) {
  return (
    <div style={S.hero}>
      <img src="emblem-256.png" alt="" width="96" height="96" style={{ display: 'block', margin: '0 auto 10px', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.35))' }} />
      <div lang="ar" style={{ fontFamily: 'var(--font-arab)', fontSize: fs(22), lineHeight: 2.2, color: '#e8cf86', direction: 'rtl' }}>خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا</div>
      <div style={{ fontSize: fs(22), fontWeight: 700, marginTop: 8 }}>{judul}</div>
      <div style={{ fontSize: fs(14), opacity: 0.85, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function Masuk({ keDaftar, keLupa }) {
  const [email, setEmail] = useState(''), [sandi, setSandi] = useState(''), [sibuk, setSibuk] = useState(false), [galat, setGalat] = useState('');
  const kirim = async e => {
    e.preventDefault(); setGalat('');
    if (!email.trim() || !sandi) { setGalat('Isi email dan kata sandi.'); return; }
    setSibuk(true);
    try { await akun.masuk(email, sandi); } catch (er) { setGalat(er.message); } finally { setSibuk(false); }
  };
  return (
    <form style={S.kartu} onSubmit={kirim}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>Masuk</div>
      {!navigator.onLine && <div style={S.info}>Anda sedang tanpa internet. Masuk pertama kali butuh internet; setelah itu aplikasi bisa dipakai tanpa internet.</div>}
      <label style={S.label}>Email<input style={S.input} type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
      <label style={S.label}>Kata sandi<input style={S.input} type="password" autoComplete="current-password" value={sandi} onChange={e => setSandi(e.target.value)} /></label>
      {galat && <div style={S.galat} role="alert">{galat}</div>}
      <button style={{ ...S.tombol, opacity: sibuk ? 0.6 : 1 }} disabled={sibuk}>{sibuk ? 'Memeriksa…' : 'Masuk'}</button>
      <button type="button" style={S.tombol2} onClick={() => keLupa(email)}>Lupa kata sandi?</button>
      <button type="button" style={S.tombol2} onClick={keDaftar}>Belum punya akun? Daftar</button>
    </form>
  );
}

function LupaSandi({ emailAwal, keMasuk }) {
  const [email, setEmail] = useState(emailAwal || ''), [sibuk, setSibuk] = useState(false), [galat, setGalat] = useState(''), [terkirim, setTerkirim] = useState(false);
  const kirim = async e => {
    e.preventDefault(); setGalat('');
    if (!email.trim()) { setGalat('Isi email akun Anda.'); return; }
    setSibuk(true);
    try { await akun.lupaSandi(email); setTerkirim(true); } catch (er) { setGalat(er.message); } finally { setSibuk(false); }
  };
  if (terkirim) return (
    <div style={S.kartu}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>Cek email Anda</div>
      <div style={S.info}>Bila {email.trim()} terdaftar, tautan untuk membuat kata sandi baru sudah dikirim. Buka tautan itu di HP ini. Tidak ada di Kotak Masuk? Periksa folder Spam.</div>
      <button style={S.tombol} onClick={keMasuk}>Ke halaman Masuk</button>
    </div>
  );
  return (
    <form style={S.kartu} onSubmit={kirim}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>Lupa kata sandi</div>
      <div style={{ ...S.kecil, textAlign: 'left' }}>Isi email akun Anda. Kami kirim tautan untuk membuat kata sandi baru.</div>
      <label style={S.label}>Email<input style={S.input} type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
      {galat && <div style={S.galat} role="alert">{galat}</div>}
      <button style={{ ...S.tombol, opacity: sibuk ? 0.6 : 1 }} disabled={sibuk}>{sibuk ? 'Mengirim…' : 'Kirim tautan'}</button>
      <button type="button" style={S.tombol2} onClick={keMasuk}>Kembali ke Masuk</button>
    </form>
  );
}

function SandiBaru() {
  const [sandi, setSandi] = useState(''), [ulang, setUlang] = useState(''), [sibuk, setSibuk] = useState(false), [galat, setGalat] = useState('');
  const kirim = async e => {
    e.preventDefault(); setGalat('');
    if (sandi.length < 6) { setGalat('Kata sandi minimal 6 karakter.'); return; }
    if (sandi !== ulang) { setGalat('Kedua kata sandi belum sama.'); return; }
    setSibuk(true);
    try { await akun.gantiSandi(sandi); } catch (er) { setGalat(er.message); } finally { setSibuk(false); }
  };
  return (
    <form style={S.kartu} onSubmit={kirim}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>Buat kata sandi baru</div>
      <label style={S.label}>Kata sandi baru<input style={S.input} type="password" autoComplete="new-password" value={sandi} onChange={e => setSandi(e.target.value)} placeholder="Minimal 6 karakter" /></label>
      <label style={S.label}>Ulangi kata sandi baru<input style={S.input} type="password" autoComplete="new-password" value={ulang} onChange={e => setUlang(e.target.value)} /></label>
      {galat && <div style={S.galat} role="alert">{galat}</div>}
      <button style={{ ...S.tombol, opacity: sibuk ? 0.6 : 1 }} disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan kata sandi'}</button>
      <button type="button" style={S.tombol2} onClick={akun.batalPulih}>Batal</button>
    </form>
  );
}

function Daftar({ keMasuk }) {
  const [f, setF] = useState({ nama: '', email: '', sandi: '', kloter: '', embarkasi: '', gelombang: '' });
  const [sibuk, setSibuk] = useState(false), [galat, setGalat] = useState(''), [selesai, setSelesai] = useState(null);
  const ubah = k => e => setF({ ...f, [k]: e.target.value });
  const kirim = async e => {
    e.preventDefault(); setGalat('');
    const kurang = [!f.nama.trim() && 'Nama', !f.email.trim() && 'Email', f.sandi.length < 6 && 'Kata sandi (min. 6 karakter)', !f.kloter.trim() && 'Kloter', !f.embarkasi.trim() && 'Embarkasi', !f.gelombang && 'Gelombang'].filter(Boolean);
    if (kurang.length) { setGalat('Lengkapi: ' + kurang.join(', ') + '.'); return; }
    setSibuk(true);
    try { setSelesai(await akun.daftar(f)); } catch (er) { setGalat(er.message); } finally { setSibuk(false); }
  };
  if (selesai) return (
    <div style={S.kartu}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>Pendaftaran terkirim</div>
      <div style={S.info}>{selesai.perluKonfirmasi ? 'Buka email Anda dan klik tautan konfirmasi. Setelah itu masuk dengan email dan kata sandi tadi.' : 'Akun dibuat.'} Akun baru bisa dipakai setelah disetujui admin.</div>
      <button style={S.tombol} onClick={keMasuk}>Ke halaman Masuk</button>
    </div>
  );
  return (
    <form style={S.kartu} onSubmit={kirim}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>Daftar akun</div>
      <div style={S.kecil}>Khusus {TUSI}. Akun aktif setelah disetujui admin.</div>
      <label style={S.label}>Nama lengkap<input style={S.input} autoComplete="name" value={f.nama} onChange={ubah('nama')} /></label>
      <label style={S.label}>Email<input style={S.input} type="email" autoComplete="email" inputMode="email" value={f.email} onChange={ubah('email')} placeholder="nama@email.com" /></label>
      <label style={S.label}>Kata sandi<input style={S.input} type="password" autoComplete="new-password" value={f.sandi} onChange={ubah('sandi')} placeholder="Minimal 6 karakter" /></label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label style={S.label}>Nomor kloter<input style={S.input} inputMode="numeric" value={f.kloter} onChange={ubah('kloter')} placeholder="22" /></label>
        <label style={S.label}>Embarkasi<input style={S.input} list="mk-embarkasi" value={f.embarkasi} onChange={ubah('embarkasi')} placeholder="YIA" />
          <datalist id="mk-embarkasi">{EMBARKASI.map(x => <option key={x.v} value={x.v}>{x.l}</option>)}</datalist></label>
      </div>
      <div style={S.label}>Gelombang
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {['1', '2'].map(g => (
            <button type="button" key={g} onClick={() => setF({ ...f, gelombang: g })} aria-pressed={f.gelombang === g}
              style={{ ...S.tombol2, background: f.gelombang === g ? 'var(--color-accent)' : 'transparent', color: f.gelombang === g ? 'var(--on-accent)' : 'var(--color-text)', borderColor: f.gelombang === g ? 'var(--color-accent)' : 'var(--color-divider)' }}>Gelombang {g}</button>
          ))}
        </div>
      </div>
      {galat && <div style={S.galat} role="alert">{galat}</div>}
      <button style={{ ...S.tombol, opacity: sibuk ? 0.6 : 1 }} disabled={sibuk}>{sibuk ? 'Mengirim…' : 'Daftar'}</button>
      <button type="button" style={S.tombol2} onClick={keMasuk}>Sudah punya akun? Masuk</button>
    </form>
  );
}

function Menunggu({ p }) {
  const [sibuk, setSibuk] = useState(false);
  const ditolak = p && p.status === 'ditolak';
  const cek = async () => { setSibuk(true); try { await akun.muatProfil(); } finally { setSibuk(false); } };
  return (
    <div style={S.kartu}>
      <div style={{ fontSize: fs(18), fontWeight: 700 }}>{ditolak ? 'Pendaftaran ditolak' : 'Menunggu persetujuan admin'}</div>
      <div style={ditolak ? S.galat : S.info}>
        {ditolak ? 'Pendaftaran akun ini tidak disetujui. Hubungi admin bila menurut Anda ini keliru.'
          : 'Akun Anda sudah terdaftar. Admin perlu menyetujuinya sebelum data kloter bisa dibuka.'}
      </div>
      {p && <div style={{ ...S.kecil, textAlign: 'left' }}>{p.nama} · {p.email}<br />Kloter {p.kloter_diminta || '-'} · {p.embarkasi || '-'} · Gelombang {p.gelombang || '-'}</div>}
      {!ditolak && <button style={{ ...S.tombol, opacity: sibuk ? 0.6 : 1 }} disabled={sibuk} onClick={cek}>{sibuk ? 'Memeriksa…' : 'Periksa lagi'}</button>}
      <button style={S.tombol2} onClick={akun.keluar}>Keluar</button>
    </div>
  );
}

export default function Gerbang({ children }) {
  const [st, setSt] = useState(akun.keadaan());
  const [hal, setHal] = useState('masuk'), [emailLupa, setEmailLupa] = useState('');
  useEffect(() => akun.dengar(setSt), []);
  if (!akun.aktif) return children;
  // Hanya saat pengembangan (npm run dev): lewati gerbang untuk menguji layar di dalam.
  if (import.meta.env.DEV && localStorage.getItem('mk.lewatiAkun') === '1') return children;
  if (!st.siap) return <div style={S.layar} />;
  // Dibuka dari tautan "Lupa kata sandi": buat kata sandi baru dulu, walau sesinya sudah aktif
  if (st.pulih) return (
    <div style={S.layar}>
      <Kepala judul="Monitoring Ibadah Kloter" sub={TUSI} />
      {st.sesi ? <SandiBaru /> : <div style={S.kartu}>
        <div style={S.galat}>Tautan sudah tidak berlaku atau sudah dipakai. Minta tautan baru lewat "Lupa kata sandi?".</div>
        <button style={S.tombol} onClick={akun.batalPulih}>Ke halaman Masuk</button>
      </div>}
    </div>
  );
  const p = st.profil;
  if (st.sesi && !p && !st.galat) return <div style={S.layar} />;
  if (st.sesi && p && p.status === 'aktif') return children;
  // Tanpa internet: petugas yang pernah masuk dan sudah aktif tetap bisa memakai aplikasi.
  if (!st.sesi && p && p.status === 'aktif' && !navigator.onLine) return children;
  return (
    <div style={S.layar}>
      <Kepala judul="Monitoring Ibadah Kloter" sub={TUSI} />
      {st.sesi ? <Menunggu p={p} />
        : hal === 'lupa' ? <LupaSandi emailAwal={emailLupa} keMasuk={() => setHal('masuk')} />
        : hal === 'masuk' ? <Masuk keDaftar={() => setHal('daftar')} keLupa={e => { setEmailLupa(e); setHal('lupa'); }} />
        : <Daftar keMasuk={() => setHal('masuk')} />}
      <div style={{ ...S.kecil, margin: '18px 16px 28px' }}>Data tersimpan di HP dan terkirim otomatis saat ada internet.</div>
    </div>
  );
}
