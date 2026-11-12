// Layar Kultum: materi malam ini (dipilih otomatis dari tanggal tiba dan gelombang), catatan penyampaian, dan daftar 41 malam.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMundur } from '../mundur.js';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { MATERI, PER_ID, NAMA_KEL, jadwalKultum } from './kultum.js';
import { catatanKultum, muatCatatanKultum, simpanCatatanKultum, kirimKultumTertunda, kultumMenunggu } from './data.js';
import { fs, kartu, judulBesar, label, redup, tombol, tombolUtama, tombolTipis, masukan } from './gaya.jsx';

const KOTA = { Makkah: [21.4225, 39.8262], Madinah: [24.4672, 39.6111] };
const BULAN_H = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];
const STATUS = [['disampaikan', 'Disampaikan'], ['belum', 'Belum'], ['ditiadakan', 'Ditiadakan']];
const hariIniSaudi = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date());
const tglPanjang = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }); };

function maghrib(iso, kota) {
  try {
    const [y, m, d] = iso.split('-').map(Number), [lat, lng] = KOTA[kota];
    const t = new PrayerTimes(new Coordinates(lat, lng), new Date(y, m - 1, d), CalculationMethod.UmmAlQura()).maghrib;
    return new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(t).replace(':', '.');
  } catch (e) { return ''; }
}

function Materi({ x }) {
  if (!x) return <p style={redup}>Belum ada materi otomatis untuk malam ini. Pilih materi lewat tombol "Ganti materi".</p>;
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <span style={label}>{x.id} · {NAMA_KEL[x.kel].toUpperCase()}</span>
      <h3 style={{ margin: 0, fontSize: fs(19), lineHeight: 1.3 }}>{x.judul}</h3>
      <p style={{ margin: 0, fontSize: fs(13.5), lineHeight: 1.55 }}><b>Dalil:</b> {x.dalil}</p>
      <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 4, fontSize: fs(14), lineHeight: 1.5 }}>{x.poin.map((p, i) => <li key={i}>{p}</li>)}</ol>
      <p style={{ margin: 0, fontSize: fs(13.5) }}><b>Penutup:</b> {x.penutup}</p>
    </div>
  );
}

export default function LayarKultum({ k }) {
  const jadwal = useMemo(() => jadwalKultum(k.tiba, k.gelombang), [k.tiba, k.gelombang]);
  const [catatan, setCatatan] = useState(() => catatanKultum());
  const [dipilih, setDipilih] = useState(null);
  const [ganti, setGanti] = useState(false), [pesan, setPesan] = useState('');
  const jejak = useRef([]);
  const pilih = t => { if (t === dipilih) return; jejak.current.push(dipilih); setDipilih(t); };
  useMundur(() => { if (ganti) { setGanti(false); return true; } if (jejak.current.length) { setDipilih(jejak.current.pop()); return true; } return false; });
  const hariIni = hariIniSaudi();

  useEffect(() => { muatCatatanKultum().then(setCatatan); const on = () => kirimKultumTertunda().then(() => muatCatatanKultum().then(setCatatan)); window.addEventListener('online', on); return () => window.removeEventListener('online', on); }, []);
  useEffect(() => { if (!pesan) return; const t = setTimeout(() => setPesan(''), 3000); return () => clearTimeout(t); }, [pesan]);

  const iHariIni = jadwal.findIndex(x => x.tanggal === hariIni);
  const malam = jadwal.find(x => x.tanggal === dipilih) || jadwal[iHariIni] || null;
  const c = malam ? catatan[malam.tanggal] || {} : {};
  const materiId = c.materi_id || (malam && malam.materi);
  const [form, setForm] = useState({});
  useEffect(() => { setForm({ pengisi: c.pengisi || '', tempat: c.tempat || '', status: c.status || 'disampaikan' }); setGanti(false); }, [malam && malam.tanggal, c.diubah]);

  const saran = kunci => [...new Set(Object.values(catatan).map(x => x[kunci]).filter(Boolean))].slice(-12);
  const simpan = (tambahan = {}) => {
    const it = { tanggal: malam.tanggal, materi_id: materiId || '', pengisi: form.pengisi.trim(), tempat: form.tempat.trim(), status: form.status, ...tambahan };
    const h = simpanCatatanKultum(it);
    setCatatan(catatanKultum());
    setPesan(h === 'lokal' ? (k.coba ? 'Mode coba · catatan hanya di HP ini' : 'Catatan disimpan di HP ini') : h === 'antre' ? 'Catatan disimpan di HP · dikirim saat ada internet' : 'Catatan kultum disimpan');
  };
  const tersampaikan = jadwal.filter(x => (catatan[x.tanggal] || {}).status === 'disampaikan').length;
  const sudahLewat = jadwal.filter(x => x.tanggal <= hariIni && !x.libur).length;

  if (!jadwal.length) {
    return (
      <div className="mk-kolom" style={{ padding: '12px 12px 24px', gap: 12 }}>
        <div className="mk-penuh" style={kartu}>
          <span style={{ fontSize: fs(22), fontWeight: 300 }}>Isi dulu tanggal tiba di Saudi</span>
          <p style={redup}>Materi tiap malam dipilih dari tanggal tiba dan gelombang kloter. Gelombang 1 di Madinah dulu, gelombang 2 di Makkah dulu.</p>
          <Pengaturan k={k} />
        </div>
      </div>
    );
  }

  return (
    <div className="mk-kolom" style={{ padding: '12px 12px 24px', gap: 12 }}>
      <div className="mk-penuh" style={{ display: 'grid', gap: 4, padding: '4px 4px 0' }}>
        <p style={redup}>Kultum ba'da Maghrib · Gelombang {k.gelombang || '1'} · {tersampaikan} dari {sudahLewat} malam sudah tersampaikan{kultumMenunggu() ? ' · ' + kultumMenunggu() + ' catatan menunggu internet' : ''}.</p>
      </div>

      {malam ? (
        <section style={{ ...kartu, border: '1.5px solid var(--m-tepi)' }} aria-label="Kultum malam ini">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <b style={{ fontSize: fs(15) }}>{malam.tanggal === hariIni ? 'Malam ini · ' : ''}Hari ke-{malam.ke}</b>
            <span style={{ fontSize: fs(12), color: 'var(--teks-3)' }}>{tglPanjang(malam.tanggal)}{malam.hijriah ? ' · ' + malam.hijriah.hari + ' ' + BULAN_H[malam.hijriah.bulan - 1] : ''}</span>
          </div>
          <span style={{ fontSize: fs(12.5), fontWeight: 500, color: 'var(--color-text)' }}>{malam.lokasi} · Maghrib {maghrib(malam.tanggal, malam.lokasi)} WAS</span>
          {malam.libur && !c.materi_id ? <p style={redup}>Tidak ada kultum malam ini karena jamaah sedang berpindah tempat (Armuzna).</p> : <Materi x={PER_ID[materiId]} />}
          {ganti ? (
            <label style={{ display: 'grid', gap: 6, fontSize: fs(12), fontWeight: 500, color: 'var(--teks-3)' }}>Pilih materi
              <select id="ganti-materi" value={materiId || ''} onChange={e => { simpan({ materi_id: e.target.value }); setGanti(false); }} style={masukan}>
                <option value="">— pilih —</option>
                {MATERI.map(x => <option key={x.id} value={x.id}>{x.id} · {x.judul}</option>)}
              </select>
            </label>
          ) : <button type="button" onClick={() => setGanti(true)} style={{ ...tombolTipis, justifySelf: 'start', minHeight: 40 }}>Ganti materi</button>}

          <div style={{ display: 'grid', gap: 10, borderTop: '1px solid var(--m-garis, var(--m-tepi))', paddingTop: 12 }}>
            <b style={{ fontSize: fs(14) }}>Catatan penyampaian</b>
            <label style={{ display: 'grid', gap: 6, fontSize: fs(12), fontWeight: 500, color: 'var(--teks-3)' }}>Pengisi kultum
              <input id="kultum-pengisi" list="saran-pengisi" value={form.pengisi || ''} onChange={e => setForm({ ...form, pengisi: e.target.value })} placeholder="Nama pengisi" style={masukan} />
            </label>
            <label style={{ display: 'grid', gap: 6, fontSize: fs(12), fontWeight: 500, color: 'var(--teks-3)' }}>Tempat
              <input id="kultum-tempat" list="saran-tempat" value={form.tempat || ''} onChange={e => setForm({ ...form, tempat: e.target.value })} placeholder="Contoh: Mushola hotel lantai 3" style={masukan} />
            </label>
            <datalist id="saran-pengisi">{saran('pengisi').map(s => <option key={s} value={s} />)}</datalist>
            <datalist id="saran-tempat">{saran('tempat').map(s => <option key={s} value={s} />)}</datalist>
            <div role="radiogroup" aria-label="Status" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
              {STATUS.map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={form.status === v} onClick={() => setForm({ ...form, status: v })}
                  style={{ ...tombol, padding: '0 6px', background: form.status === v ? 'var(--color-accent)' : 'var(--color-surface)', color: form.status === v ? 'var(--on-accent)' : 'var(--m-teks)' }}>{l}</button>
              ))}
            </div>
            <button type="button" onClick={() => simpan()} style={tombolUtama}>Simpan catatan</button>
            {c.diubah ? <span style={{ fontSize: fs(11.5), color: 'var(--teks-3)' }}>Terakhir dicatat {c.petugas ? 'oleh ' + c.petugas + ' · ' : ''}{new Date(c.diubah).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span> : null}
          </div>
        </section>
      ) : (
        <div className="mk-penuh" style={kartu}><p style={redup}>Hari ini di luar 41 malam kultum (mulai {tglPanjang(jadwal[0].tanggal)}). Pilih malam dari daftar di bawah.</p></div>
      )}

      <section className="mk-penuh" style={{ ...kartu, padding: 0, gap: 0, overflow: 'hidden' }} aria-label="Daftar malam kultum">
        {jadwal.map((x, i) => {
          const cc = catatan[x.tanggal] || {}, id = cc.materi_id || x.materi, mm = PER_ID[id], aktif = malam && malam.tanggal === x.tanggal;
          const st = cc.status === 'disampaikan' ? ['✓', 'var(--color-text)'] : cc.status === 'ditiadakan' ? ['—', 'var(--teks-3)'] : x.tanggal < hariIni && !x.libur ? ['!', 'var(--red-600)'] : ['', ''];
          return (
            <button key={x.tanggal} type="button" onClick={() => { pilih(x.tanggal); const el = document.querySelector('main'); if (el) el.scrollTop = 0; }}
              style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 24px', alignItems: 'center', gap: 10, textAlign: 'left', border: 0, borderTop: i ? '1px solid var(--m-garis, var(--m-tepi))' : 0, padding: '10px 14px', minHeight: 52, cursor: 'pointer', background: aktif ? 'var(--m-lembut)' : 'transparent', color: 'var(--m-teks)', font: 'inherit' }}>
              <span style={{ fontSize: fs(12), fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--teks-3)' }}>H-{x.ke}</span>
              <span style={{ display: 'grid', minWidth: 0 }}>
                <span style={{ fontSize: fs(13.5), fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.libur && !cc.materi_id ? 'Tidak ada kultum' : mm ? mm.judul : 'Materi bebas'}</span>
                <span style={{ fontSize: fs(11.5), color: 'var(--teks-3)' }}>{tglPanjang(x.tanggal)} · {x.lokasi}{cc.pengisi ? ' · ' + cc.pengisi : ''}</span>
              </span>
              <span aria-label={cc.status || ''} style={{ fontWeight: 600, color: st[1], textAlign: 'center' }}>{st[0]}</span>
            </button>
          );
        })}
      </section>

      <details className="mk-penuh" style={kartu}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: fs(14) }}>Tanggal tiba dan gelombang</summary>
        <Pengaturan k={k} />
      </details>
      {pesan ? <div role="status" style={{ position: 'fixed', left: 16, right: 16, bottom: 'calc(100px + env(safe-area-inset-bottom, 0px))', zIndex: 50, maxWidth: 520, margin: '0 auto', padding: '12px 16px', borderRadius: 14, background: 'var(--m-teks)', color: 'var(--color-bg)', font: `500 ${fs(13)} var(--font-body)`, textAlign: 'center' }}>{pesan}</div> : null}
    </div>
  );
}

function Pengaturan({ k }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <label style={{ display: 'grid', gap: 6, fontSize: fs(12), fontWeight: 500, color: 'var(--teks-3)' }}>Tanggal tiba di Saudi
        <input type="date" id="kultum-tiba" defaultValue={k.tiba} key={k.tiba} onChange={e => k.setTiba(e.target.value)} style={masukan} />
      </label>
      <div role="radiogroup" aria-label="Gelombang" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {['1', '2'].map(g => (
          <button key={g} type="button" role="radio" aria-checked={String(k.gelombang) === g} onClick={() => k.setGelombang(g)}
            style={{ ...tombol, background: String(k.gelombang) === g ? 'var(--color-accent)' : 'var(--color-surface)', color: String(k.gelombang) === g ? 'var(--on-accent)' : 'var(--m-teks)' }}>Gelombang {g}</button>
        ))}
      </div>
      <p style={{ ...redup, fontSize: fs(11.5) }}>Berlaku untuk satu kloter. Kosongkan tanggal tiba untuk memakai tanggal berangkat.</p>
    </div>
  );
}
