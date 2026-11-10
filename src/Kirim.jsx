// Kirim pesan ke grup WhatsApp dari templat: katering, pengingat ibadah (dengan tata cara),
// undangan karom/karu, pengajian, cek kesehatan. Teks bisa diubah sebelum dikirim.
// Isian terakhir tiap templat disimpan di HP supaya tidak mengetik ulang.
import React, { useEffect, useMemo, useState } from 'react';
import { tataCaraUntuk } from './tataCara.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
// Gaya desain Cyber-Mint (token --m-* di tema.css)
const kartu = { background: 'var(--m-kartu)', border: '1.5px solid var(--m-tepi)', borderRadius: 24, padding: 16, boxShadow: 'var(--m-kartu-bayang)', color: 'var(--m-teks)', display: 'grid', gap: 10, minWidth: 0 };
const label = { display: 'grid', gap: 5, fontSize: fs(11.5), fontWeight: 600, color: 'var(--m-teks-2)', minWidth: 0 };
const input = { minHeight: 44, borderRadius: 11, border: '1.5px solid transparent', padding: '0 12px', fontSize: fs(14), fontWeight: 700, fontFamily: 'inherit', background: 'var(--m-ubin)', color: 'var(--m-teks)', width: '100%', boxSizing: 'border-box', minWidth: 0 };
const tombol = { minHeight: 46, borderRadius: 22, border: '1.5px solid var(--m-garis-kartu)', background: 'var(--m-ubin)', color: 'var(--m-teks)', font: `800 ${fs(13.5)} var(--font-body)`, cursor: 'pointer', padding: '8px 14px' };
const tombolMint = { ...tombol, border: 0, background: 'var(--m-isi)', color: 'var(--m-on-isi)', boxShadow: 'var(--m-isi-bayang)' };
const Ikon = ({ d }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

const JENIS = [
  { k: 'katering', l: 'Jadwal katering', s: 'Pengambilan makan per rombongan', d: 'M4 11h16M6 11V9a6 6 0 0 1 12 0v2M3 15h18l-2 4H5z', ubin: 'var(--m-emas-bg)', teks: 'var(--m-emas)' },
  { k: 'pengingat', l: 'Pengingat ibadah', s: 'Jadwal kegiatan dan tata caranya', d: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', ubin: 'var(--m-lembut)', teks: 'var(--m-aksen-teks)' },
  { k: 'karom', l: 'Undangan karom & karu', s: 'Pertemuan ketua rombongan dan regu', d: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 20v-2a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8', ubin: 'var(--m-safir-bg)', teks: 'var(--m-safir)' },
  { k: 'pengajian', l: 'Undangan pengajian', s: 'Untuk seluruh jamaah', d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5', ubin: 'var(--m-lembut)', teks: 'var(--m-aksen-teks)' },
  { k: 'kesehatan', l: 'Undangan cek kesehatan', s: 'Bersama tim kesehatan kloter', d: 'M6 3v6a4 4 0 0 0 8 0V3M10 13v2a5 5 0 0 0 10 0v-1M20 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', ubin: 'var(--m-koral-bg)', teks: 'var(--m-koral)' }
];

const simpanLokal = (k, v) => { try { localStorage.setItem('mk.kirim.' + k, JSON.stringify(v)); } catch (e) { } };
const bacaLokal = k => { try { return JSON.parse(localStorage.getItem('mk.kirim.' + k) || 'null'); } catch (e) { return null; } };
const hariTgl = t => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t || ''); if (!m) return ''; try { return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(t + 'T00:00:00Z')); } catch (e) { return t; } };
const jamTeks = j => (j ? j.replace(':', '.') + ' WAS' : '');
const baris = (l, v) => (v ? `${l}: ${v}` : '');
const gabung = a => a.filter(x => x !== null && x !== undefined && x !== false).join('\n').replace(/\n{3,}/g, '\n\n').trim();

function susun(jenis, f, d) {
  const salam = "Assalamu'alaikum warahmatullahi wabarakatuh", tutup = ["Wassalamu'alaikum warahmatullahi wabarakatuh", '', `${d.petugas}`, `PPIH Bimbingan Ibadah Kloter ${d.kloter}`];
  const waktu = [baris('Hari/tanggal', hariTgl(f.tgl)), baris('Waktu', jamTeks(f.jam)), baris('Tempat', f.tempat)].filter(Boolean);
  if (jenis === 'katering') {
    const daftar = (f.jadwal || []).filter(x => x.jam).map(x => `• Rombongan ${x.r}: ${jamTeks(x.jam)}`);
    return gabung([salam, '', `*Jadwal Pengambilan ${f.makan || 'Makan'} · Kloter ${d.kloter}*`, baris('Hari/tanggal', hariTgl(f.tgl)), baris('Tempat pengambilan', f.tempat), '',
      ...(daftar.length ? daftar : ['• (isi jam per rombongan)']), '', 'Mohon ketua rombongan/regu mengkoordinir pengambilan tepat waktu dan membawa wadah bila diperlukan.', f.catatan || '', '', ...tutup]);
  }
  if (jenis === 'pengingat') {
    const k = d.kegiatan.find(x => x.mode + '|' + x.n === f.kegiatan), tc = f.tataCara && k ? tataCaraUntuk(k.n) : null;
    return gabung([salam, '', `*Pengingat ${k ? k.p : 'Kegiatan Ibadah'}${k ? ' · ' + k.mode : ''}*`, `Kloter ${d.kloter}`, '', ...waktu, '',
      tc ? '*Tata cara singkat:*' : null, ...(tc ? tc.map((t, i) => `${i + 1}. ${t}`) : []), tc ? '' : null,
      f.catatan || 'Mohon jamaah bersiap lebih awal, menjaga kesehatan, dan mengikuti arahan ketua rombongan/regu.', '', ...tutup]);
  }
  const judulU = { karom: 'Undangan Pertemuan Ketua Rombongan dan Ketua Regu', pengajian: 'Undangan Pengajian Jamaah', kesehatan: 'Undangan Pemeriksaan Kesehatan' }[jenis];
  const kepada = { karom: 'Kepada Yth. Bapak/Ibu Ketua Rombongan dan Ketua Regu', pengajian: 'Kepada Yth. Bapak/Ibu Jamaah', kesehatan: 'Kepada Yth. Bapak/Ibu Jamaah' }[jenis] + ` Kloter ${d.kloter}`;
  const isi = {
    karom: baris('Acara', f.acara || 'Koordinasi kegiatan ibadah'), pengajian: [baris('Tema', f.acara), baris('Pengisi', f.pengisi)].filter(Boolean).join('\n'),
    kesehatan: [baris('Sasaran', f.sasaran || 'Seluruh jamaah'), baris('Mohon membawa', f.bawa)].filter(Boolean).join('\n')
  }[jenis];
  return gabung([salam, '', `*${judulU}*`, kepada, '', 'Dengan hormat, kami mengundang Bapak/Ibu untuk hadir pada:', ...waktu, isi, '',
    f.catatan || 'Atas perhatian dan kehadirannya kami ucapkan terima kasih.', '', ...tutup]);
}

function Form({ jenis, d, kembali }) {
  const awal = useMemo(() => ({ tataCara: true, makan: 'Makan siang', jadwal: d.rombongan.map(r => ({ r: r.r, jam: '' })), ...(bacaLokal(jenis) || {}) }), [jenis]);
  const [f, setF] = useState(awal), [teks, setTeks] = useState(''), [ubahManual, setUbahManual] = useState(false), [pesan, setPesan] = useState('');
  const set = (k, v) => { setF(x => { const y = { ...x, [k]: v }; simpanLokal(jenis, y); return y; }); setUbahManual(false); };
  const hasil = susun(jenis, f, d);
  useEffect(() => { if (!ubahManual) setTeks(hasil); }, [hasil, ubahManual]);
  const pilihKegiatan = key => {
    const k = d.kegiatan.find(x => x.mode + '|' + x.n === key);
    setF(x => { const y = { ...x, kegiatan: key, tgl: k && k.tgl ? k.tgl : x.tgl, jam: k && k.jam ? k.jam : x.jam, tempat: k && k.place ? k.place : x.tempat }; simpanLokal(jenis, y); return y; }); setUbahManual(false);
  };
  const kirim = () => { window.open('https://wa.me/?text=' + encodeURIComponent(teks), '_blank', 'noopener'); };
  const salin = async () => { try { await navigator.clipboard.writeText(teks); setPesan('Teks tersalin'); } catch (e) { setPesan('Tidak bisa menyalin otomatis; tekan lama pada teks lalu salin.'); } setTimeout(() => setPesan(''), 2500); };
  const J = JENIS.find(x => x.k === jenis);
  const I = (k, l, p = {}) => <label style={label}>{l}<input style={input} value={f[k] ?? ''} onChange={e => set(k, e.target.value)} {...p} /></label>;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button onClick={kembali} style={{ ...tombol, justifySelf: 'start', minHeight: 44, padding: '4px 16px', fontSize: fs(13), color: 'var(--m-aksen-teks)' }}>‹ Semua templat</button>
      <div style={kartu}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <b style={{ fontSize: fs(13.5), color: 'var(--m-aksen-teks)' }}>Pratinjau Templat · {J.l}</b>
          {jenis === 'pengingat' && f.tataCara && <span style={{ fontSize: fs(10), fontWeight: 800, padding: '5px 10px', borderRadius: 12, background: 'var(--m-lembut)', color: 'var(--m-aksen-teks)' }}>✓ + Tata cara</span>}
        </div>
        {jenis === 'pengingat' && (
          <label style={label}>Kegiatan
            <select style={input} value={f.kegiatan || ''} onChange={e => pilihKegiatan(e.target.value)}>
              <option value="">Pilih kegiatan…</option>
              {['Haji', 'Umrah', 'Madinah'].map(m => <optgroup key={m} label={m}>{d.kegiatan.filter(x => x.mode === m).map(x => <option key={x.n} value={x.mode + '|' + x.n}>{x.p}{x.tgl ? ' · ' + x.tgl.slice(8) + '/' + x.tgl.slice(5, 7) : ''}</option>)}</optgroup>)}
            </select>
          </label>
        )}
        {jenis === 'katering' && (
          <label style={label}>Waktu makan
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Sarapan', 'Makan siang', 'Makan malam'].map(m => <button key={m} type="button" onClick={() => set('makan', m)} aria-pressed={f.makan === m}
                style={{ ...(f.makan === m ? tombolMint : tombol), minHeight: 44, padding: '4px 14px', fontSize: fs(13) }}>{m}</button>)}
            </div>
          </label>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 150px', minWidth: 0 }}>{I('tgl', 'Tanggal', { type: 'date' })}</div>
          {jenis !== 'katering' && <div style={{ flex: '1 1 110px', minWidth: 0 }}>{I('jam', 'Jam (WAS)', { type: 'time' })}</div>}
        </div>
        {I('tempat', jenis === 'katering' ? 'Tempat pengambilan' : 'Tempat', { placeholder: jenis === 'katering' ? 'mis. Lobi hotel lantai 1' : 'mis. Musholla hotel lantai 2' })}
        {jenis === 'katering' && (
          <div style={label}>Jam per rombongan (kosongkan yang tidak ikut)
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: 8 }}>
              {(f.jadwal || []).map((x, i) => (
                <label key={x.r} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--m-ubin)', borderRadius: 11, padding: '4px 8px', minWidth: 0, color: 'var(--m-teks)' }}>
                  <b style={{ fontSize: fs(13), whiteSpace: 'nowrap' }}>R{x.r}</b>
                  <input type="time" value={x.jam} onChange={e => set('jadwal', f.jadwal.map((y, j) => (j === i ? { ...y, jam: e.target.value } : y)))} style={{ ...input, minHeight: 44, border: 0, padding: '0 4px' }} />
                </label>
              ))}
            </div>
          </div>
        )}
        {jenis === 'karom' && I('acara', 'Acara', { placeholder: 'mis. Persiapan Armuzna' })}
        {jenis === 'pengajian' && <>{I('acara', 'Tema', { placeholder: 'mis. Menjaga kemabruran haji' })}{I('pengisi', 'Pengisi', { placeholder: 'mis. Ustadz …' })}</>}
        {jenis === 'kesehatan' && <>{I('sasaran', 'Sasaran', { placeholder: 'mis. Jamaah lansia dan risti' })}{I('bawa', 'Mohon membawa', { placeholder: 'mis. Kartu kesehatan dan obat pribadi' })}</>}
        {jenis === 'pengingat' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: fs(13.5), fontWeight: 600, color: 'var(--m-teks)' }}>
            <input type="checkbox" checked={!!f.tataCara} onChange={e => set('tataCara', e.target.checked)} style={{ width: 20, height: 20, accentColor: '#14f096' }} /> Sertakan tata cara singkat
          </label>
        )}
        {I('catatan', 'Catatan tambahan (opsional)')}
      </div>
      <div style={kartu}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <b style={{ fontSize: fs(11.5), color: 'var(--m-teks-2)' }}>Pratinjau pesan (teks bisa diubah langsung):</b>
          {ubahManual && <button onClick={() => setUbahManual(false)} style={{ ...tombol, minHeight: 44, padding: '2px 10px', fontSize: fs(12.5) }}>Susun ulang</button>}
        </div>
        <textarea value={teks} onChange={e => { setTeks(e.target.value); setUbahManual(true); }} rows={14}
          style={{ ...input, minHeight: 220, padding: 12, borderRadius: 14, lineHeight: 1.5, resize: 'vertical', fontSize: fs(13), fontWeight: 400 }} />
        {jenis === 'pengingat' && f.tataCara && <div style={{ fontSize: fs(12.5), color: 'var(--m-emas)', lineHeight: 1.45 }}>Tata cara masih <b>draf</b>. Periksa isinya sebelum dikirim; teks bisa diubah langsung di kotak ini.</div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,3fr)', gap: 10 }}>
          <button onClick={salin} style={tombol}>Salin teks</button>
          <button onClick={kirim} style={tombolMint}>Kirim ke WhatsApp →</button>
        </div>
        {pesan && <div role="status" style={{ fontSize: fs(13), fontWeight: 700, color: 'var(--m-aksen-teks)' }}>{pesan}</div>}
      </div>
    </div>
  );
}

export default function Kirim({ d }) {
  const [jenis, setJenisAsli] = useState(null), [terakhir, setTerakhir] = useState(() => bacaLokal('terakhir'));
  const setJenis = k => { if (k) { simpanLokal('terakhir', k); setTerakhir(k); } setJenisAsli(k); };
  if (!d) return null;
  if (jenis) return <Form key={jenis} jenis={jenis} d={d} kembali={() => setJenis(null)} />;
  return (
    <div className="mk-kolom" style={{ gap: 10 }}>
      {JENIS.map(x => ({ ...x, mint: x.k === terakhir })).map(x => (
        <button key={x.k} onClick={() => setJenis(x.k)} style={{ borderRadius: 20, padding: '11px 14px 11px 11px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center', textAlign: 'left', cursor: 'pointer', font: 'inherit',
          background: x.mint ? 'var(--m-isi)' : 'var(--m-kartu)', border: '1.5px solid ' + (x.mint ? '#16f298' : 'var(--m-garis-kartu)'), boxShadow: 'none', color: x.mint ? 'var(--m-on-isi)' : 'var(--m-teks)' }}>
          <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 13, display: 'grid', placeItems: 'center', background: x.mint ? '#05120e' : x.ubin, color: x.mint ? '#18f59a' : x.teks }}><Ikon d={x.d} /></span>
          <span style={{ minWidth: 0, display: 'grid', gap: 1 }}><b style={{ fontSize: fs(14) }}>{x.l}</b><span style={{ fontSize: fs(11), fontWeight: 500, color: x.mint ? 'var(--m-on-isi-2)' : 'var(--m-teks-2)' }}>{x.mint ? 'Terakhir dipakai · ' : ''}{x.s}</span></span>
          <span aria-hidden="true" style={{ color: x.mint ? 'var(--m-on-isi)' : x.teks, fontSize: fs(22), fontWeight: 700 }}>›</span>
        </button>
      ))}
    </div>
  );
}
