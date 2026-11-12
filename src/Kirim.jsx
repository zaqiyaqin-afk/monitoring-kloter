// Kirim pesan ke grup WhatsApp dari lima templat. Isi templat bisa diubah seluruhnya; kata dalam kurung kurawal
// diisi dari isian saat mengirim. Isian terakhir dan templat hasil ubahan disimpan di HP ini saja.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { tataCaraUntuk } from './tataCara.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: 16, display: 'grid', gap: 14, minWidth: 0 };
const label = { display: 'grid', gap: 6, fontSize: fs(13.5), fontWeight: 500, minWidth: 0 };
const kecil = { fontSize: fs(12.5), fontWeight: 400, color: 'var(--teks-3)', lineHeight: 1.45 };
const input = { minHeight: 48, borderRadius: 12, border: '1px solid var(--m-tepi)', padding: '0 14px', font: `400 ${fs(15)} var(--font-body)`, background: 'var(--color-surface)', color: 'var(--color-text)', width: '100%', boxSizing: 'border-box', minWidth: 0 };
const tombol = { minHeight: 48, borderRadius: 24, border: '1px solid var(--m-tepi)', background: 'var(--color-surface)', color: 'var(--color-text)', font: `400 ${fs(14)} var(--font-body)`, cursor: 'pointer', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
const utama = { ...tombol, border: 0, background: 'var(--m-isi)', color: 'var(--m-on-isi)', fontWeight: 600 };
const pil = on => ({ ...tombol, minHeight: 44, padding: '6px 14px', borderColor: on ? 'var(--color-accent)' : 'var(--m-tepi)', background: on ? 'var(--color-accent)' : 'var(--color-surface)', color: on ? 'var(--on-accent)' : 'var(--color-text)', fontWeight: on ? 600 : 400, fontSize: fs(13) });
const bawah = { position: 'sticky', bottom: 0, margin: '0 -12px -24px', padding: '12px 12px calc(12px + env(safe-area-inset-bottom, 0px))', background: 'var(--color-surface)', borderRadius: '20px 20px 0 0', boxShadow: '0 -1px 0 var(--color-divider)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 };
const Ikon = ({ d, s = 20 }) => <svg aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d={d} /></svg>;
const SEGITIGA = 'M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
const TAMBAH = 'M12 5v14M5 12h14', SILANG = 'M6 6l12 12M18 6L6 18', PENA = 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4';

const SALAM = "Assalamu'alaikum warahmatullahi wabarakatuh";
const TUTUP = "Wassalamu'alaikum warahmatullahi wabarakatuh\n\n{nama petugas}\nPPIH Bimbingan Ibadah Kloter {kloter}";
const WAKTU = 'Hari/tanggal: {tanggal}\nWaktu: {jam}\nTempat: {tempat}';
const undangan = (judul, kepada, isi) => `${SALAM}\n\n*${judul}*\nKepada Yth. Bapak/Ibu ${kepada} Kloter {kloter}\n\nDengan hormat, kami mengundang Bapak/Ibu untuk hadir pada:\n${WAKTU}\n${isi}\n\n{catatan}\n\n${TUTUP}`;

export const JENIS = [
  { k: 'katering', l: 'Jadwal katering', s: 'Jam pengambilan dan petugas per rombongan', isian: ['waktu makan', 'tanggal', 'jam', 'tempat', 'daftar petugas', 'catatan', 'kloter', 'nama petugas'],
    bawaan: `${SALAM}\n\n*Jadwal Pengambilan {waktu makan} · Kloter {kloter}*\nHari/tanggal: {tanggal}\nWaktu: {jam}\nTempat pengambilan: {tempat}\n\nPetugas pengambil:\n{daftar petugas}\n\nMohon ketua rombongan/regu mengkoordinir pengambilan tepat waktu dan membawa wadah bila diperlukan.\n{catatan}\n\n${TUTUP}` },
  { k: 'pengingat', l: 'Pengingat ibadah', s: 'Jadwal kegiatan dan tata caranya', isian: ['kegiatan', 'tanggal', 'jam', 'tempat', 'tata cara', 'catatan', 'kloter', 'nama petugas'],
    bawaan: `${SALAM}\n\n*Pengingat {kegiatan}*\nKloter {kloter}\n\n${WAKTU}\n\n{tata cara}\n\n{catatan}\n\n${TUTUP}` },
  { k: 'karom', l: 'Undangan karom & karu', s: 'Pertemuan ketua rombongan dan regu', isian: ['tanggal', 'jam', 'tempat', 'acara', 'catatan', 'kloter', 'nama petugas'],
    bawaan: undangan('Undangan Pertemuan Ketua Rombongan dan Ketua Regu', 'Ketua Rombongan dan Ketua Regu', 'Acara: {acara}') },
  { k: 'pengajian', l: 'Undangan pengajian', s: 'Untuk seluruh jamaah', isian: ['tanggal', 'jam', 'tempat', 'tema', 'pengisi', 'catatan', 'kloter', 'nama petugas'],
    bawaan: undangan('Undangan Pengajian Jamaah', 'Jamaah', 'Tema: {tema}\nPengisi: {pengisi}') },
  { k: 'kesehatan', l: 'Undangan cek kesehatan', s: 'Bersama tim kesehatan kloter', isian: ['tanggal', 'jam', 'tempat', 'sasaran', 'bawa', 'catatan', 'kloter', 'nama petugas'],
    bawaan: undangan('Undangan Pemeriksaan Kesehatan', 'Jamaah', 'Sasaran: {sasaran}\nMohon membawa: {bawa}') }
];

const simpanLokal = (k, v) => { try { localStorage.setItem('mk.kirim.' + k, JSON.stringify(v)); } catch (e) { } };
const bacaLokal = k => { try { return JSON.parse(localStorage.getItem('mk.kirim.' + k) || 'null'); } catch (e) { return null; } };
const bacaTemplat = k => { try { return localStorage.getItem('mk.templat.' + k) || ''; } catch (e) { return ''; } };
const simpanTemplat = (k, t) => { try { if (t) localStorage.setItem('mk.templat.' + k, t); else localStorage.removeItem('mk.templat.' + k); } catch (e) { } };
const hariTgl = t => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t || ''); if (!m) return ''; try { return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(t + 'T00:00:00Z')); } catch (e) { return t; } };
const jamTeks = j => (j ? j.replace(':', '.') + ' WAS' : '');

// Nilai tiap {isian} untuk satu templat.
function nilai(jenis, f, d) {
  const nama = p => (d.jamaah.find(j => j.porsi === p) || { name: 'Porsi ' + p }).name;
  const k = d.kegiatan.find(x => x.mode + '|' + x.n === f.kegiatan), tc = jenis === 'pengingat' && f.tataCara && k ? tataCaraUntuk(k.n) : null;
  const daftar = d.rombongan.map(r => [r.r, ((f.petugas || {})[r.r] || []).map(nama)]).filter(x => x[1].length).map(([r, n]) => `• Rombongan ${r}: ${n.join(', ')}`);
  const catatan = f.catatan || (jenis === 'katering' ? '' : jenis === 'pengingat' ? 'Mohon jamaah bersiap lebih awal, menjaga kesehatan, dan mengikuti arahan ketua rombongan/regu.' : 'Atas perhatian dan kehadirannya kami ucapkan terima kasih.');
  return { kloter: d.kloter, 'nama petugas': d.petugas, tanggal: hariTgl(f.tgl), jam: jamTeks(f.jam), tempat: f.tempat || '', catatan,
    'waktu makan': f.makan || 'Makan', 'daftar petugas': daftar.length ? daftar.join('\n') : '• (pilih petugas per rombongan)',
    kegiatan: k ? k.p + ' · ' + k.mode : 'Kegiatan Ibadah', 'tata cara': tc ? '*Tata cara singkat:*\n' + tc.map((t, i) => `${i + 1}. ${t}`).join('\n') : '',
    acara: f.acara || (jenis === 'karom' ? 'Koordinasi kegiatan ibadah' : ''), tema: f.acara || '', pengisi: f.pengisi || '', sasaran: f.sasaran || 'Seluruh jamaah', bawa: f.bawa || '' };
}
// Baris yang semua isiannya kosong dibuang, supaya tidak tersisa "Waktu:" tanpa isi.
function susun(templat, n) {
  return templat.split('\n').map(b => {
    const kunci = [...b.matchAll(/\{([^{}]+)\}/g)].map(m => m[1].trim().toLowerCase()).filter(x => x in n);
    if (kunci.length && kunci.every(x => !n[x])) return null;
    return b.replace(/\{([^{}]+)\}/g, (s, x) => { const y = x.trim().toLowerCase(); return y in n ? n[y] : s; });
  }).filter(b => b !== null).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function PilihPetugas({ r, d, awal, tutup, pakai }) {
  const [pilih, setPilih] = useState(awal), [cari, setCari] = useState('');
  const semua = d.jamaah.filter(j => j.r === r), q = cari.trim().toLowerCase();
  const tampil = semua.filter(j => !q || j.name.toLowerCase().includes(q) || j.porsi.includes(q)).sort((a, b) => (b.role ? 1 : 0) - (a.role ? 1 : 0));
  const induk = typeof document !== 'undefined' && document.querySelector('.mk-layar');
  if (!induk) return null;
  return createPortal(
    <div onClick={tutup} style={{ position: 'absolute', inset: 0, background: 'var(--scrim)', display: 'flex', alignItems: 'flex-end', zIndex: 6 }}>
      <div role="dialog" aria-modal="true" aria-label={'Petugas pengambil Rombongan ' + r} onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxHeight: '88%', background: 'var(--color-surface)', borderRadius: '28px 28px 0 0', padding: '10px 16px calc(16px + env(safe-area-inset-bottom, 0px))', boxSizing: 'border-box', display: 'grid', gridTemplateRows: 'auto auto auto minmax(0,1fr) auto auto', gap: 12 }}>
        <div aria-hidden="true" style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--m-tepi)', justifySelf: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: fs(22), fontWeight: 300, lineHeight: 1.2 }}>Petugas pengambil</div>
            <div style={kecil}>Rombongan {r} · {semua.length} jamaah</div>
          </div>
          <button type="button" onClick={tutup} aria-label="Tutup" style={{ ...tombol, width: 44, minHeight: 44, padding: 0 }}><Ikon d={SILANG} /></button>
        </div>
        <input style={input} type="search" aria-label="Cari jamaah" value={cari} onChange={e => setCari(e.target.value)} placeholder="Cari nama atau nomor porsi" />
        <div style={{ overflowY: 'auto', minHeight: 120 }}>
          {tampil.map(j => { const on = pilih.includes(j.porsi);
            return (
              <button key={j.porsi} type="button" role="checkbox" aria-checked={on} onClick={() => setPilih(on ? pilih.filter(p => p !== j.porsi) : [...pilih, j.porsi])}
                style={{ width: '100%', minHeight: 60, border: 0, borderBottom: '1px solid var(--color-divider)', background: 'transparent', color: 'var(--color-text)', font: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: 1, minWidth: 0, display: 'grid' }}>
                  <span style={{ fontSize: fs(14.5), fontWeight: 500 }}>{j.name}</span>
                  <span style={kecil}>{[j.role, 'Regu ' + j.g].filter(Boolean).join(' · ')}</span>
                </span>
                <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 6, flex: 'none', display: 'grid', placeItems: 'center', border: '1.5px solid ' + (on ? 'var(--color-accent)' : 'var(--m-tepi)'), background: on ? 'var(--color-accent)' : 'var(--color-surface)', color: 'var(--on-accent)' }}>{on ? <Ikon d="M5 12.5l4.5 4.5L19 7.5" s={18} /> : null}</span>
              </button>
            ); })}
          {!tampil.length ? <div style={{ ...kecil, padding: '20px 0', textAlign: 'center' }}>Tidak ada jamaah yang cocok.</div> : null}
        </div>
        <div style={kecil}>{pilih.length} dipilih</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
          <button type="button" style={tombol} onClick={tutup}>Batal</button>
          <button type="button" style={utama} onClick={() => pakai(pilih)}>{pilih.length ? `Pakai ${pilih.length} petugas` : 'Kosongkan'}</button>
        </div>
      </div>
    </div>, induk);
}

function UbahTemplat({ J, selesai }) {
  const [isi, setIsi] = useState(() => bacaTemplat(J.k) || J.bawaan), kotak = useRef(null);
  const sisip = k => { const el = kotak.current, a = el ? el.selectionStart : isi.length, b = el ? el.selectionEnd : isi.length, t = '{' + k + '}';
    setIsi(isi.slice(0, a) + t + isi.slice(b)); requestAnimationFrame(() => { if (el) { el.focus(); el.setSelectionRange(a + t.length, a + t.length); } }); };
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={kartu}>
        <label style={label}>Isi pesan
          <span style={kecil}>Tulis pesan sesuka Anda. Kata dalam kurung kurawal diisi otomatis dari isian saat mengirim.</span>
          <textarea ref={kotak} value={isi} onChange={e => setIsi(e.target.value)} rows={16} style={{ ...input, minHeight: 320, padding: 14, lineHeight: 1.5, resize: 'vertical', fontSize: fs(13.5) }} />
        </label>
        <div style={label}>Sisipkan isian otomatis
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {J.isian.map(k => <button key={k} type="button" style={pil(false)} onClick={() => sisip(k)}>{'{' + k + '}'}</button>)}
          </div>
        </div>
        <div style={kecil}>Templat tersimpan di HP ini saja dan tidak terkirim ke server. Petugas lain tidak melihatnya.</div>
      </div>
      <div style={bawah}>
        <button type="button" style={tombol} onClick={() => setIsi(J.bawaan)}>Kembalikan bawaan</button>
        <button type="button" style={utama} disabled={!isi.trim()} onClick={() => { simpanTemplat(J.k, isi.trim() === J.bawaan.trim() ? '' : isi); selesai(); }}>Simpan templat</button>
      </div>
    </div>
  );
}

function Form({ jenis, d }) {
  const J = JENIS.find(x => x.k === jenis);
  const awal = useMemo(() => ({ tataCara: true, makan: 'Makan siang', petugas: {}, ...(bacaLokal(jenis) || {}) }), [jenis]);
  const [f, setF] = useState(awal), [teks, setTeks] = useState(''), [ubahManual, setUbahManual] = useState(false), [pesan, setPesan] = useState(''), [pilihR, setPilihR] = useState(null);
  const set = (k, v) => { setF(x => { const y = { ...x, [k]: v }; simpanLokal(jenis, y); return y; }); setUbahManual(false); };
  const hasil = susun(bacaTemplat(jenis) || J.bawaan, nilai(jenis, f, d));
  useEffect(() => { if (!ubahManual) setTeks(hasil); }, [hasil, ubahManual]);
  if (d.ubahTemplat) return <UbahTemplat J={J} selesai={() => d.ubah(false)} />;
  const pilihKegiatan = key => {
    const k = d.kegiatan.find(x => x.mode + '|' + x.n === key);
    setF(x => { const y = { ...x, kegiatan: key, tgl: k && k.tgl ? k.tgl : x.tgl, jam: k && k.jam ? k.jam : x.jam, tempat: k && k.place ? k.place : x.tempat }; simpanLokal(jenis, y); return y; }); setUbahManual(false);
  };
  const kirim = () => { window.open('https://wa.me/?text=' + encodeURIComponent(teks), '_blank', 'noopener'); };
  const salin = async () => { try { await navigator.clipboard.writeText(teks); setPesan('Teks tersalin'); } catch (e) { setPesan('Tidak bisa menyalin otomatis; tekan lama pada teks lalu salin.'); } setTimeout(() => setPesan(''), 2500); };
  const I = (k, l, p = {}) => <label style={label}>{l}<input style={input} value={f[k] ?? ''} onChange={e => set(k, e.target.value)} {...p} /></label>;
  const petugas = f.petugas || {}, nama = p => (d.jamaah.find(j => j.porsi === p) || { name: 'Porsi ' + p }).name;
  const setPetugas = (r, l) => set('petugas', { ...petugas, [r]: l });
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={kartu}>
        {jenis === 'pengingat' && (
          <label style={label}>Kegiatan
            <select style={input} value={f.kegiatan || ''} onChange={e => pilihKegiatan(e.target.value)}>
              <option value="">Pilih kegiatan…</option>
              {['Haji', 'Umrah', 'Madinah'].map(m => <optgroup key={m} label={m}>{d.kegiatan.filter(x => x.mode === m).map(x => <option key={x.n} value={x.mode + '|' + x.n}>{x.p}{x.tgl ? ' · ' + x.tgl.slice(8) + '/' + x.tgl.slice(5, 7) : ''}</option>)}</optgroup>)}
            </select>
          </label>
        )}
        {jenis === 'katering' && (
          <div style={label}>Waktu makan
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Sarapan', 'Makan siang', 'Makan malam'].map(m => <button key={m} type="button" onClick={() => set('makan', m)} aria-pressed={f.makan === m} style={pil(f.makan === m)}>{m}</button>)}
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
          {I('tgl', 'Tanggal', { type: 'date' })}
          {I('jam', jenis === 'katering' ? 'Jam pengambilan' : 'Jam (WAS)', { type: 'time' })}
        </div>
        {jenis === 'katering' && <div style={{ ...kecil, marginTop: -8 }}>Satu jam (WAS) untuk semua rombongan.</div>}
        {I('tempat', jenis === 'katering' ? 'Tempat pengambilan' : 'Tempat', { placeholder: jenis === 'katering' ? 'mis. Lobi hotel lantai 1' : 'mis. Musholla hotel lantai 2' })}
        {jenis === 'katering' && (
          <div style={{ ...label, gap: 0 }}>Petugas pengambil per rombongan
            <span style={{ ...kecil, margin: '4px 0 10px' }}>Kosongkan rombongan yang tidak ikut.</span>
            {d.rombongan.map(({ r }) => { const l = petugas[r] || [];
              return (
                <div key={r} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderTop: '1px solid var(--color-divider)' }}>
                  <span style={{ width: 28, flex: 'none', lineHeight: '44px', fontWeight: 500 }}>R{r}</span>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {l.map(p => (
                      <button key={p} type="button" onClick={() => setPetugas(r, l.filter(x => x !== p))} aria-label={'Hapus ' + nama(p)}
                        style={{ ...tombol, minHeight: 44, border: 0, background: 'var(--color-accent-200)', padding: '6px 12px 6px 14px', fontWeight: 500, fontSize: fs(13), maxWidth: '100%', textAlign: 'left' }}>
                        <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{nama(p)}</span><Ikon d={SILANG} s={16} />
                      </button>
                    ))}
                    <button type="button" style={{ ...tombol, minHeight: 44, fontSize: fs(13) }} onClick={() => setPilihR(r)}><Ikon d={TAMBAH} s={18} />{l.length ? 'Tambah petugas' : 'Pilih jamaah'}</button>
                  </div>
                </div>
              ); })}
          </div>
        )}
        {jenis === 'karom' && I('acara', 'Acara', { placeholder: 'mis. Persiapan Armuzna' })}
        {jenis === 'pengajian' && <>{I('acara', 'Tema', { placeholder: 'mis. Menjaga kemabruran haji' })}{I('pengisi', 'Pengisi', { placeholder: 'mis. Ustadz …' })}</>}
        {jenis === 'kesehatan' && <>{I('sasaran', 'Sasaran', { placeholder: 'mis. Jamaah lansia dan risti' })}{I('bawa', 'Mohon membawa', { placeholder: 'mis. Kartu kesehatan dan obat pribadi' })}</>}
        {jenis === 'pengingat' && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, fontSize: fs(14) }}>
            <input type="checkbox" checked={!!f.tataCara} onChange={e => set('tataCara', e.target.checked)} style={{ width: 24, height: 24, accentColor: '#27326e', flex: 'none' }} /> Sertakan tata cara singkat
          </label>
        )}
        {I('catatan', 'Catatan tambahan (opsional)')}
        <label style={label}>
          <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            Pratinjau pesan (teks bisa diubah langsung)
            {ubahManual && <button type="button" onClick={() => setUbahManual(false)} style={{ ...tombol, minHeight: 44, fontSize: fs(12.5) }}>Susun ulang</button>}
          </span>
          <textarea value={teks} onChange={e => { setTeks(e.target.value); setUbahManual(true); }} rows={14} style={{ ...input, minHeight: 240, padding: 14, lineHeight: 1.5, resize: 'vertical', fontSize: fs(13.5) }} />
        </label>
        {jenis === 'pengingat' && f.tataCara && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--red-100)', color: 'var(--red-700)', borderRadius: 12, padding: 12, fontSize: fs(13), fontWeight: 500, lineHeight: 1.45 }}>
            <Ikon d={SEGITIGA} />Tata cara masih draf. Periksa isinya sebelum dikirim; teks bisa diubah langsung di kotak ini.
          </div>
        )}
        <button type="button" style={{ ...tombol, justifySelf: 'start' }} onClick={() => d.ubah(true)}><Ikon d={PENA} />Ubah templat</button>
        {pesan && <div role="status" style={{ fontSize: fs(13), fontWeight: 500 }}>{pesan}</div>}
      </div>
      <div style={bawah}>
        <button type="button" onClick={salin} style={tombol}>Salin teks</button>
        <button type="button" onClick={kirim} style={utama}>Kirim ke WhatsApp</button>
      </div>
      {pilihR != null ? <PilihPetugas r={pilihR} d={d} awal={petugas[pilihR] || []} tutup={() => setPilihR(null)} pakai={l => { setPetugas(pilihR, l); setPilihR(null); }} /> : null}
    </div>
  );
}

export default function Kirim({ d }) {
  if (!d) return null;
  if (d.jenis) return <Form key={d.jenis} jenis={d.jenis} d={d} />;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ ...kecil, padding: '0 4px' }}>Pilih templat, lengkapi isiannya, lalu kirim ke grup WhatsApp. Pesan bisa diubah dulu sebelum dikirim.</div>
      <div style={{ ...kartu, gap: 0, padding: '4px 16px' }}>
        {JENIS.map((x, i) => (
          <button key={x.k} type="button" onClick={() => d.buka(x.k)} style={{ minHeight: 62, border: 0, borderTop: i ? '1px solid var(--color-divider)' : 0, background: 'transparent', color: 'var(--color-text)', font: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
              <span style={{ fontSize: fs(15), fontWeight: 500 }}>{x.l}</span>
              <span style={kecil}>{x.s}</span>
            </span>
            <Ikon d="M9 6l6 6-6 6" />
          </button>
        ))}
      </div>
    </div>
  );
}
