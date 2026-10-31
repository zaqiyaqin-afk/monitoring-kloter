// Isian data pribadi dan akomodasi di detail jamaah. Disimpan lewat antrean, jadi bisa tanpa internet.
import React, { useState } from 'react';

const fs = n => `calc(${n}px*var(--fs,1))`;
const label = { display: 'grid', gap: 5, fontSize: fs(12.5), fontWeight: 700, color: 'var(--color-neutral-700)', minWidth: 0 };
const input = { height: 44, borderRadius: 12, border: '1.5px solid var(--kaca-garis)', padding: '0 12px', fontSize: fs(15), fontFamily: 'inherit',
  background: 'var(--color-surface)', color: 'var(--color-text)', width: '100%', boxSizing: 'border-box', minWidth: 0 };
const grup = { display: 'grid', gap: 10, background: 'var(--kaca)', borderRadius: 18, padding: 14, border: '1px solid var(--kaca-garis)' };
const judul = { fontSize: fs(13), fontWeight: 800, color: 'var(--color-accent-700)' };

function Isian({ nama, k, f, set, ...p }) {
  return <label style={label}>{nama}<input style={input} value={f[k] ?? ''} onChange={e => set(k, e.target.value)} {...p} /></label>;
}

function Form({ d }) {
  const [f, setF] = useState(d.nilai);
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const ubah = Object.keys(f).filter(k => String(f[k] ?? '') !== String(d.nilai[k] ?? ''));
  const simpan = () => { if (!ubah.length) return; d.simpan(Object.fromEntries(ubah.map(k => [k, String(f[k] ?? '').trim()]))); };
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={grup}>
        <div style={judul}>Data pribadi</div>
        <div style={label}>Jenis kelamin
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[['L', 'Laki-laki'], ['P', 'Perempuan']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => set('jk', f.jk === v ? '' : v)} aria-pressed={f.jk === v}
                style={{ minHeight: 44, borderRadius: 12, border: '1.5px solid ' + (f.jk === v ? 'var(--color-accent)' : 'var(--color-divider)'), background: f.jk === v ? 'var(--color-accent)' : 'transparent',
                  color: f.jk === v ? 'var(--on-accent)' : 'var(--color-text)', font: `600 ${fs(14)} var(--font-body)`, cursor: 'pointer' }}>{l}</button>
            ))}
          </div>
        </div>
        <Isian nama="Tanggal lahir" k="tglLahir" f={f} set={set} type="date" />
        <Isian nama="Nomor HP" k="hp" f={f} set={set} inputMode="tel" placeholder="Opsional" />
        <div style={{ fontSize: fs(12.5), color: d.lansia ? 'var(--color-accent-2-700)' : 'var(--color-neutral-700)', fontWeight: 600 }}>
          {d.umur >= 0 ? `Umur ${d.umur} tahun ${d.berangkat ? 'saat berangkat' : 'hari ini'}${d.lansia ? ' · Lansia' : ''}` : 'Isi tanggal lahir: lansia (≥65 tahun) dihitung otomatis.'}
        </div>
      </div>
      <div style={grup}>
        <div style={judul}>Akomodasi Makkah</div>
        <Isian nama="Hotel" k="hotelMakkah" f={f} set={set} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 }}>
          <Isian nama="Lantai" k="lantaiMakkah" f={f} set={set} />
          <Isian nama="Kamar" k="kamarMakkah" f={f} set={set} />
        </div>
      </div>
      <div style={grup}>
        <div style={judul}>Arafah dan Mina</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 }}>
          <Isian nama="Tenda Arafah" k="tendaArafah" f={f} set={set} />
          <Isian nama="Tenda Mina" k="tendaMina" f={f} set={set} />
        </div>
      </div>
      <div style={grup}>
        <div style={judul}>Akomodasi Madinah</div>
        <Isian nama="Hotel" k="hotelMadinah" f={f} set={set} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 }}>
          <Isian nama="Lantai" k="lantaiMadinah" f={f} set={set} />
          <Isian nama="Kamar" k="kamarMadinah" f={f} set={set} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={simpan} disabled={!ubah.length} style={{ minHeight: 48, fontSize: fs(15) }}>
        {ubah.length ? 'Simpan data jamaah' : 'Belum ada perubahan'}
      </button>
    </div>
  );
}

// key = isi data tersimpan: form diisi ulang setiap kali jamaah atau datanya berganti
export default function DataJamaah({ d }) {
  if (!d) return null;
  return <Form key={d.kunci} d={d} />;
}
