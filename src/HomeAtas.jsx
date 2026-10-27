// Bagian atas Home: kata mutiara, waktu sholat (Waktu Arab Saudi), ringkasan jamaah,
// peringatan kegiatan terlewat, dan pengingat kegiatan berikutnya.
// Waktu sholat dihitung di HP (metode Umm al-Qura), jadi tetap jalan tanpa internet.
import React, { useEffect, useState } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--color-surface)', borderRadius: 22, padding: '14px 16px', boxShadow: '0 1px 2px rgba(16,40,30,.05),0 8px 20px -14px rgba(16,40,30,.22)', display: 'grid', gap: 10, minWidth: 0 };
const judul = { fontSize: fs(13), fontWeight: 800, color: 'var(--color-neutral-700)', letterSpacing: '.02em' };

const KOTA = { Makkah: [21.4225, 39.8262], Madinah: [24.4672, 39.6111] };
const NAMA = [['fajr', 'Subuh'], ['dhuhr', 'Dzuhur'], ['asr', 'Ashar'], ['maghrib', 'Magrib'], ['isha', 'Isya']];
const jamWas = d => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(d).replace(':', '.');
const tglWas = d => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(d);

// Tanggal kalender Arab Saudi sebagai Date lokal untuk adhan (yang memakai tahun-bulan-hari)
function hariSaudi(geser = 0) { const [y, m, d] = tglWas(new Date()).split('-').map(Number); return new Date(y, m - 1, d + geser); }

function waktuSholat(kota) {
  const [lat, lng] = KOTA[kota], p = CalculationMethod.UmmAlQura(), c = new Coordinates(lat, lng);
  const hari = new PrayerTimes(c, hariSaudi(), p), besok = new PrayerTimes(c, hariSaudi(1), p), now = Date.now();
  const daftar = NAMA.map(([k, l]) => ({ l, t: hari[k] }));
  const next = daftar.find(x => x.t.getTime() > now) || { l: 'Subuh', t: besok.fajr, besok: true };
  return { daftar, next, sisa: next.t.getTime() - now };
}

function Sholat({ kotaAwal }) {
  const [kota, setKota] = useState(() => { try { return localStorage.getItem('mk.kota') || kotaAwal; } catch (e) { return kotaAwal; } });
  const [, tik] = useState(0);
  useEffect(() => { const t = setInterval(() => tik(x => x + 1), 30000); return () => clearInterval(t); }, []);
  const w = waktuSholat(kota), j = Math.floor(w.sisa / 3600000), mnt = Math.ceil((w.sisa % 3600000) / 60000);
  const pilih = k => { setKota(k); try { localStorage.setItem('mk.kota', k); } catch (e) {} };
  return (
    <div style={kartu}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={judul}>Waktu sholat · WAS</span>
        <div style={{ display: 'flex', gap: 4, background: 'var(--color-neutral-100)', borderRadius: 999, padding: 3 }}>
          {Object.keys(KOTA).map(k => <button key={k} onClick={() => pilih(k)} aria-pressed={kota === k}
            style={{ border: 0, borderRadius: 999, padding: '5px 12px', font: `700 ${fs(12.5)} var(--font-body)`, cursor: 'pointer', background: kota === k ? 'var(--color-accent)' : 'transparent', color: kota === k ? 'var(--on-accent)' : 'var(--color-text)' }}>{k}</button>)}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: fs(24), fontWeight: 800 }}>{w.next.l} {jamWas(w.next.t)}</span>
        <span style={{ fontSize: fs(14), color: 'var(--color-accent-2-700)', fontWeight: 700 }}>{j ? `${j} jam ` : ''}{mnt} menit lagi{w.next.besok ? ' (besok)' : ''}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 4 }}>
        {w.daftar.map(x => { const on = x.l === w.next.l && !w.next.besok;
          return <div key={x.l} style={{ textAlign: 'center', borderRadius: 12, padding: '6px 2px', background: on ? 'var(--color-accent-100)' : 'transparent', minWidth: 0 }}>
            <div style={{ fontSize: 'min(' + fs(11.5) + ', 12.5px)', color: 'var(--color-neutral-700)', fontWeight: 600 }}>{x.l}</div>
            <div style={{ fontSize: 'min(' + fs(13.5) + ', 15px)', fontWeight: 800, color: on ? 'var(--color-accent-800)' : 'var(--color-text)' }}>{jamWas(x.t)}</div>
          </div>; })}
      </div>
    </div>
  );
}

function Angka({ n, l, on, warna }) {
  return (
    <button onClick={on} style={{ border: 0, borderRadius: 14, padding: '8px 4px', background: warna ? 'var(--red-100)' : 'var(--color-neutral-100)', color: warna ? 'var(--red-700)' : 'var(--color-text)', cursor: on ? 'pointer' : 'default', display: 'grid', gap: 2, minWidth: 0, font: 'inherit' }}>
      <span style={{ fontSize: fs(18), fontWeight: 800 }}>{n}</span>
      <span style={{ fontSize: fs(11.5), fontWeight: 600, color: warna ? 'var(--red-700)' : 'var(--color-neutral-700)' }}>{l}</span>
    </button>
  );
}

export default function HomeAtas({ h }) {
  if (!h) return null;
  return (
    <>
      <div style={{ ...kartu, background: 'var(--hero)', color: '#fff', textAlign: 'center', gap: 4 }}>
        <div style={{ fontFamily: 'var(--font-arab)', fontSize: fs(26), color: '#e8cf86', direction: 'rtl', lineHeight: 1.5 }}>خِدْمَةُ الْحُجَّاجِ شَرَفٌ لَنَا</div>
        <div style={{ fontSize: fs(13), opacity: 0.85 }}>Melayani jamaah haji adalah kehormatan kami</div>
      </div>
      <Sholat kotaAwal={h.kota} />
      <div style={kartu}>
        <span style={judul}>Jamaah · {h.total} orang</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(74px*var(--fs,1)), 1fr))', gap: 6 }}>
          {h.ringkas.map(x => <Angka key={x.l} {...x} />)}
        </div>
        {h.catatanData && <div style={{ fontSize: fs(12.5), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>{h.catatanData}</div>}
      </div>
      {h.peringatan.length > 0 && (
        <div style={{ ...kartu, background: 'var(--red-100)' }}>
          <span style={{ ...judul, color: 'var(--red-700)' }}>Belum dicentang · kegiatan sudah lewat</span>
          {h.peringatan.map(p => (
            <button key={p.key} onClick={p.on} style={{ border: 0, background: 'transparent', textAlign: 'left', padding: 0, cursor: 'pointer', color: 'var(--red-800)', display: 'flex', justifyContent: 'space-between', gap: 10, font: 'inherit' }}>
              <span style={{ fontSize: fs(14.5), minWidth: 0 }}><b>{p.label}</b><br /><span style={{ fontSize: fs(12.5) }}>{p.sub}</span></span>
              <span style={{ fontSize: fs(15), fontWeight: 800, whiteSpace: 'nowrap' }}>{p.n} ›</span>
            </button>
          ))}
        </div>
      )}
      {h.pengingat.length > 0 && (
        <div style={{ ...kartu, background: 'var(--color-accent-2-100)' }}>
          <span style={{ ...judul, color: 'var(--color-accent-2-800)' }}>Kegiatan berikutnya</span>
          {h.pengingat.map(p => (
            <button key={p.key} onClick={p.on} style={{ border: 0, background: 'transparent', textAlign: 'left', padding: 0, cursor: 'pointer', color: 'var(--color-accent-2-900)', display: 'flex', justifyContent: 'space-between', gap: 10, font: 'inherit' }}>
              <span style={{ fontSize: fs(14.5), minWidth: 0 }}><b>{p.label}</b><br /><span style={{ fontSize: fs(12.5) }}>{p.sub}</span></span>
              <span style={{ fontSize: fs(13.5), fontWeight: 800, whiteSpace: 'nowrap' }}>{p.kapan}</span>
            </button>
          ))}
        </div>
      )}
      {h.tanpaTanggal && <div style={{ fontSize: fs(12.5), color: 'var(--color-neutral-700)', lineHeight: 1.45 }}>Atur tanggal (dan jam) kegiatan lewat tombol <b>Atur tanggal</b> supaya peringatan dan pengingat muncul di sini.</div>}
    </>
  );
}
