// Kirim pesan ke grup WhatsApp dari templat: katering, pengingat ibadah (dengan tata cara),
// undangan karom/karu, pengajian, cek kesehatan. Teks bisa diubah sebelum dikirim.
// Isian terakhir tiap templat disimpan di HP supaya tidak mengetik ulang.
import React, { useEffect, useMemo, useState } from 'react';
import { tataCaraUntuk } from './tataCara.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--kartu-bg)', border: '1px solid var(--kartu-garis)', borderRadius: 20, padding: 14, boxShadow: 'var(--kartu-bayang)', display: 'grid', gap: 10, minWidth: 0 };
const label = { display: 'grid', gap: 5, fontSize: fs(12.5), fontWeight: 700, color: 'var(--color-neutral-700)', minWidth: 0 };
const input = { minHeight: 42, borderRadius: 12, border: '1.5px solid var(--color-divider)', padding: '0 12px', fontSize: fs(15), fontFamily: 'inherit', background: 'var(--color-surface)', color: 'var(--color-text)', width: '100%', boxSizing: 'border-box', minWidth: 0 };
const tombol = { minHeight: 46, borderRadius: 14, border: '1.5px solid var(--color-divider)', background: 'var(--color-surface)', color: 'var(--color-text)', font: `700 ${fs(15)} var(--font-body)`, cursor: 'pointer', padding: '8px 12px' };
const Ikon = ({ d }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;

const JENIS = [
  { k: 'katering', l: 'Jadwal katering', s: 'Pengambilan makan per rombongan', d: 'M4 11h16M6 11V9a6 6 0 0 1 12 0v2M3 15h18l-2 4H5z' },
  { k: 'pengingat', l: 'Pengingat ibadah', s: 'Jadwal kegiatan dan tata caranya', d: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  { k: 'karom', l: 'Undangan karom & karu', s: 'Pertemuan ketua rombongan dan regu', d: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 20v-2a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8' },
  { k: 'pengajian', l: 'Undangan pengajian', s: 'Untuk seluruh jamaah', d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5' },
  { k: 'kesehatan', l: 'Undangan cek kesehatan', s: 'Bersama tim kesehatan kloter', d: 'M6 3v6a4 4 0 0 0 8 0V3M10 13v2a5 5 0 0 0 10 0v-1M20 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' }
];

const simpanLokal = (k, v) => { try { localStorage.setItem('mk.kirim.' + k, JSON.stringify(v)); } catch (e) {} };
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
  const isi = { karom: baris('Acara', f.acara || 'Koordinasi kegiatan ibadah'), pengajian: [baris('Tema', f.acara), baris('Pengisi', f.pengisi)].filter(Boolean).join('\n'),
    kesehatan: [baris('Sasaran', f.sasaran || 'Seluruh jamaah'), baris('Mohon membawa', f.bawa)].filter(Boolean).join('\n') }[jenis];
  return gabung([salam, '', `*${judulU}*`, kepada, '', 'Dengan hormat, kami mengundang Bapak/Ibu untuk hadir pada:', ...waktu, isi, '',
    f.catatan || 'Atas perhatian dan kehadirannya kami ucapkan terima kasih.', '', ...tutup]);
}

function Form({ jenis, d, kembali }) {
  const awal = useMemo(() => ({ tataCara: true, makan: 'Makan siang', jadwal: d.rombongan.map(r => ({ r: r.r, jam: '' })), ...(bacaLokal(jenis) || {}) }), [jenis]);
  const [f, setF] = useState(awal), [teks, setTeks] = useState(''), [ubahManual, setUbahManual] = useState(false), [pesan, setPesan] = useState('');
  const set = (k, v) => { setF(x => { const y = { ...x, [k]: v }; simpanLokal(jenis, y); return y; }); setUbahManual(false); };
  const hasil = susun(jenis, f, d);
  useEffect(() => { if (!ubahManual) setTeks(hasil); }, [hasil, ubahManual]);
  const pilihKegiatan = key => { const k = d.kegiatan.find(x => x.mode + '|' + x.n === key);
    setF(x => { const y = { ...x, kegiatan: key, tgl: k && k.tgl ? k.tgl : x.tgl, jam: k && k.jam ? k.jam : x.jam, tempat: k && k.place ? k.place : x.tempat }; simpanLokal(jenis, y); return y; }); setUbahManual(false); };
  const kirim = () => { window.open('https://wa.me/?text=' + encodeURIComponent(teks), '_blank', 'noopener'); };
  const salin = async () => { try { await navigator.clipboard.writeText(teks); setPesan('Teks tersalin'); } catch (e) { setPesan('Tidak bisa menyalin otomatis; tekan lama pada teks lalu salin.'); } setTimeout(() => setPesan(''), 2500); };
  const J = JENIS.find(x => x.k === jenis);
  const I = (k, l, p = {}) => <label style={label}>{l}<input style={input} value={f[k] ?? ''} onChange={e => set(k, e.target.value)} {...p} /></label>;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <button onClick={kembali} style={{ ...tombol, justifySelf: 'start', minHeight: 38, padding: '4px 14px', fontSize: fs(13.5) }}>‹ Semua templat</button>
      <div style={kartu}>
        <div style={{ fontSize: fs(17), fontWeight: 800 }}>{J.l}</div>
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
                style={{ ...tombol, minHeight: 38, padding: '4px 12px', fontSize: fs(13.5), background: f.makan === m ? 'var(--color-accent)' : 'var(--color-surface)', color: f.makan === m ? 'var(--on-accent)' : 'var(--color-text)', borderColor: f.makan === m ? 'var(--color-accent)' : 'var(--color-divider)' }}>{m}</button>)}
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
                <label key={x.r} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-surface)', borderRadius: 12, padding: '4px 8px', border: '1px solid var(--color-divider)', minWidth: 0 }}>
                  <b style={{ fontSize: fs(13), whiteSpace: 'nowrap' }}>R{x.r}</b>
                  <input type="time" value={x.jam} onChange={e => set('jadwal', f.jadwal.map((y, j) => (j === i ? { ...y, jam: e.target.value } : y)))} style={{ ...input, minHeight: 36, border: 0, padding: '0 4px' }} />
                </label>
              ))}
            </div>
          </div>
        )}
        {jenis === 'karom' && I('acara', 'Acara', { placeholder: 'mis. Persiapan Armuzna' })}
        {jenis === 'pengajian' && <>{I('acara', 'Tema', { placeholder: 'mis. Menjaga kemabruran haji' })}{I('pengisi', 'Pengisi', { placeholder: 'mis. Ustadz …' })}</>}
        {jenis === 'kesehatan' && <>{I('sasaran', 'Sasaran', { placeholder: 'mis. Jamaah lansia dan risti' })}{I('bawa', 'Mohon membawa', { placeholder: 'mis. Kartu kesehatan dan obat pribadi' })}</>}
        {jenis === 'pengingat' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: fs(14), fontWeight: 600 }}>
            <input type="checkbox" checked={!!f.tataCara} onChange={e => set('tataCara', e.target.checked)} style={{ width: 20, height: 20 }} /> Sertakan tata cara singkat
          </label>
        )}
        {I('catatan', 'Catatan tambahan (opsional)')}
      </div>
      <div style={kartu}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <b style={{ fontSize: fs(14) }}>Pratinjau pesan</b>
          {ubahManual && <button onClick={() => setUbahManual(false)} style={{ ...tombol, minHeight: 32, padding: '2px 10px', fontSize: fs(12.5) }}>Susun ulang</button>}
        </div>
        <textarea value={teks} onChange={e => { setTeks(e.target.value); setUbahManual(true); }} rows={14}
          style={{ ...input, minHeight: 220, padding: 12, lineHeight: 1.5, resize: 'vertical', fontSize: fs(14) }} />
        {jenis === 'pengingat' && f.tataCara && <div style={{ fontSize: fs(12.5), color: 'var(--color-accent-2-800)', lineHeight: 1.45 }}>Tata cara masih <b>draf</b>. Periksa isinya sebelum dikirim; teks bisa diubah langsung di kotak ini.</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={salin} style={tombol}>Salin teks</button>
          <button onClick={kirim} style={{ ...tombol, background: '#1f9d55', borderColor: '#1f9d55', color: '#fff' }}>Kirim ke WhatsApp</button>
        </div>
        {pesan && <div style={{ fontSize: fs(13), color: 'var(--color-accent-800)' }}>{pesan}</div>}
      </div>
    </div>
  );
}

export default function Kirim({ d }) {
  const [jenis, setJenis] = useState(null);
  if (!d) return null;
  if (jenis) return <Form key={jenis} jenis={jenis} d={d} kembali={() => setJenis(null)} />;
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ fontSize: fs(13.5), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Pilih templat, lengkapi isiannya, lalu kirim ke grup WhatsApp. Pesan bisa diubah dulu sebelum dikirim.</div>
      {JENIS.map(x => (
        <button key={x.k} onClick={() => setJenis(x.k)} style={{ ...kartu, gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text)', font: 'inherit' }}>
          <span style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--color-accent-100)', color: 'var(--color-accent-700)' }}><Ikon d={x.d} /></span>
          <span style={{ minWidth: 0 }}><b style={{ fontSize: fs(15.5) }}>{x.l}</b><br /><span style={{ fontSize: fs(13), color: 'var(--color-neutral-700)' }}>{x.s}</span></span>
          <span style={{ color: 'var(--color-accent-700)', fontSize: fs(20) }}>›</span>
        </button>
      ))}
    </div>
  );
}
