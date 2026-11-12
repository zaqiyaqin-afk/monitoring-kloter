// Menu Jamaah: daftar semua jamaah dan jamaah khusus.
import React from 'react';
import { txt, arr } from '../dc/runtime.js';

const fs = n => `calc(${n}px*var(--fs,1))`;
export const SEGITIGA = 'M12 9v4M12 17h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
export const Ikon = ({ d, s = 18, w = 1.8 }) => (
  <svg aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><path d={d} /></svg>
);
export const Avatar = ({ ini, s = 40 }) => (
  <span aria-hidden="true" style={{ width: s, height: s, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--color-neutral-200)', color: 'var(--color-text)', fontWeight: 500, fontSize: s > 44 ? 16 : 13 }}>{txt(ini)}</span>
);
// Status di ujung baris: selesai = centang biru tua, masalah = lencana merah berikon, lainnya lencana bertepi.
export function Status({ k, l }) {
  if (k === 'ok') return <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', fontWeight: 500, fontSize: fs(12.5) }}><Ikon d="M5 12.5l4.5 4.5L19 7.5" s={16} w={2.2} />{txt(l)}</span>;
  if (k === 'merah') return <span className="mk-lencana mk-lencana-merah" style={{ flex: 'none' }}><Ikon d={SEGITIGA} s={16} />{txt(l)}</span>;
  return <span className="mk-lencana" style={{ flex: 'none' }}>{txt(l)}</span>;
}

const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: 16, display: 'grid', gap: 12, minWidth: 0 };
const pil = c => ({ flex: 'none', minHeight: 44, padding: '0 14px', borderRadius: 22, border: '1px solid ' + (c?.a ? 'var(--color-accent)' : 'var(--m-tepi)'), background: c?.a ? 'var(--color-accent)' : 'var(--color-surface)',
  color: c?.a ? 'var(--on-accent)' : 'var(--color-text)', font: `${c?.a ? 600 : 400} ${fs(13)} var(--font-body)`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' });
const geser = { display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -16px', padding: '0 16px', scrollbarWidth: 'none' };
const baris = { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', minHeight: 56, borderBottom: '1px solid var(--color-divider)' };

export default function MenuJamaah({ v }) {
  const jl = v.jl || {}, jk = v.jk || {};
  return (
    <div style={{ padding: '12px 12px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gridAutoRows: 'max-content', gap: 12 }}>
      <div style={kartu}>
        <div style={{ fontSize: fs(12.5), color: 'var(--teks-3)' }}>{txt(jl.count)} jamaah · {txt(jl.scope)}</div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: 0, bottom: 0, display: 'grid', placeItems: 'center', color: 'var(--color-text)', pointerEvents: 'none' }}><Ikon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" s={20} /></span>
          <input className="input" type="search" aria-label="Cari jamaah" value={jl.q ?? ''} onChange={v.onQuery} autoFocus={!!v.fokusCari} placeholder="Cari nama atau nomor porsi"
            style={{ height: 48, width: '100%', boxSizing: 'border-box', paddingLeft: 44, fontSize: fs(15), borderRadius: 12 }} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 26, border: '1px solid var(--m-tepi)' }}>
          {arr(jk.segs).map((m, i) => (
            <button key={i} type="button" onClick={m?.on} aria-pressed={!!m?.a}
              style={{ flex: 1, minWidth: 0, minHeight: 44, border: 0, borderRadius: 22, cursor: 'pointer', background: m?.a ? 'var(--color-accent)' : 'transparent', color: m?.a ? 'var(--on-accent)' : 'var(--color-text)', font: `${m?.a ? 600 : 400} ${fs(13)} var(--font-body)` }}>{txt(m?.l)}</button>
          ))}
        </div>
        {jk.isAll ? (<>
          <div style={geser}>
            {arr(jl.filters).map((c, i) => (
              <button key={i} type="button" onClick={c?.on} aria-pressed={!!c?.a} style={pil(c)}>{txt(c?.l)}<span style={{ fontWeight: 600 }}>{txt(c?.n)}</span></button>
            ))}
          </div>
          <div style={geser}>
            {arr(jl.rs).map((c, i) => (
              <button key={i} type="button" onClick={c?.on} aria-pressed={!!c?.a} aria-label={'Rombongan ' + String(c?.l).slice(1)} style={{ ...pil(c), width: 44, padding: 0, justifyContent: 'center' }}>{txt(c?.l)}</button>
            ))}
          </div>
          {jl.showG ? (
            <div style={geser}>
              {arr(jl.gs).map((c, i) => <button key={i} type="button" onClick={c?.on} aria-pressed={!!c?.a} style={pil(c)}>{txt(c?.l)}</button>)}
            </div>
          ) : null}
        </>) : (
          <div style={geser}>
            {arr(jk.chips).map((c, i) => (
              <button key={i} type="button" onClick={c?.on} aria-pressed={!!c?.a} style={pil(c)}>{txt(c?.l)}<span style={{ fontWeight: 600 }}>{txt(c?.n)}</span></button>
            ))}
          </div>
        )}
      </div>

      {jk.isAll ? (<>
        <div style={{ ...kartu, padding: '4px 16px', gap: 0 }}>
          {arr(jl.rows).map((j, i) => (
            <button key={i} type="button" className="ketuk" onClick={j?.on} style={baris}>
              <Avatar ini={j?.ini} />
              <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
                <span style={{ display: 'flex', gap: '2px 8px', alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{ fontWeight: 500, fontSize: fs(14.5), overflowWrap: 'anywhere' }}>{txt(j?.name)}</span>
                  {j?.risti ? <span className="mk-lencana" style={{ flex: 'none' }}>Risti</span> : null}
                </span>
                <span style={{ fontSize: fs(12.5), color: 'var(--teks-3)' }}>{txt(j?.sub)}</span>
                {j?.hasNote ? <span style={{ fontSize: fs(12.5), color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Catatan: {txt(j?.note)}</span> : null}
              </span>
              <Status k={j?.tagK} l={j?.tag} />
            </button>
          ))}
          {jl.empty ? <div style={{ padding: '28px 0', textAlign: 'center', fontSize: fs(14), color: 'var(--teks-3)' }}>Tidak ada jamaah yang cocok.</div> : null}
        </div>
        {jl.trunc ? <div style={{ fontSize: fs(12.5), color: 'var(--teks-3)', padding: '0 4px' }}>Menampilkan 40 dari {txt(jl.count)} · pilih rombongan untuk mempersempit</div> : null}
      </>) : null}

      {jk.isKh ? (<>
        {jk.empty ? <div style={{ ...kartu, textAlign: 'center', fontSize: fs(14), color: 'var(--teks-3)' }}>Tidak ada jamaah yang cocok. Tandai lansia atau kursi roda dari detail jamaah.</div> : null}
        {arr(jk.groups).map((g, i) => (
          <div key={i} style={{ ...kartu, gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: fs(16) }}>{txt(g?.title)}</div>
                <div style={{ fontSize: fs(12.5), color: 'var(--teks-3)' }}>{txt(g?.sub)}</div>
              </div>
              <span style={{ flex: 'none', fontSize: fs(12.5), fontWeight: 500 }}>{txt(g?.n)}</span>
            </div>
            {arr(g?.rows).map((r, k) => (
              <button key={k} type="button" className="ketuk" onClick={r?.on} style={{ ...baris, alignItems: 'flex-start' }}>
                <Avatar ini={r?.ini} />
                <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 6 }}>
                  <span style={{ fontWeight: 500, fontSize: fs(14.5) }}>{txt(r?.name)}</span>
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {arr(r?.tags).map((x, n) => <span key={n} className="mk-lencana">{txt(x?.t)}</span>)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: fs(12.5), color: r?.adaPend ? 'var(--color-text)' : 'var(--red-700)', fontWeight: r?.adaPend ? 400 : 500 }}>
                    {r?.adaPend ? null : <Ikon d={SEGITIGA} s={16} />}{txt(r?.pend)}
                  </span>
                </span>
                <span style={{ flex: 'none', marginTop: 10, color: 'var(--color-text)' }}><Ikon d="M9 6l6 6-6 6" /></span>
              </button>
            ))}
          </div>
        ))}
      </>) : null}
    </div>
  );
}
