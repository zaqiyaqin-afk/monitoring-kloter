// Menu Badal: jamaah udzur dan pelaksana badal jumroh 10–13 Dzulhijjah.
import React from 'react';
import { txt, arr } from '../dc/runtime.js';
import { Ikon, Avatar, SEGITIGA } from './MenuJamaah.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: 16, display: 'grid', gap: 12, minWidth: 0 };
const kecil = { fontSize: fs(12.5), color: 'var(--teks-3)', lineHeight: 1.45 };
const pil = a => ({ flex: 'none', minHeight: 44, padding: '0 14px', borderRadius: 22, border: '1px solid ' + (a ? 'var(--color-accent)' : 'var(--m-tepi)'), background: a ? 'var(--color-accent)' : 'var(--color-surface)',
  color: a ? 'var(--on-accent)' : 'var(--color-text)', font: `${a ? 600 : 400} ${fs(13)} var(--font-body)`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, whiteSpace: 'nowrap' });

export default function MenuBadal({ v }) {
  const b = v.bd || {}, kurang = /belum punya pelaksana/.test(String(b.fab || '')), siap = /^Centang/.test(String(b.fab || ''));
  return (
    <div style={{ padding: '12px 12px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gridAutoRows: 'max-content', gap: 12 }}>
      <div style={kartu}>
        <div style={kecil}>{txt(b.n)} jamaah dibadalkan · 10–13 Dzulhijjah</div>
        {b.notHaji ? (<>
          <div style={{ fontSize: fs(14) }}>Badal jumroh hanya ada di mode Haji.</div>
          <button type="button" className="btn btn-primary" onClick={b.toHaji} style={{ minHeight: 48 }}>Pindah ke mode Haji</button>
        </>) : null}
        {b.isJ ? <button type="button" className="btn btn-primary" onClick={b.onAdd} style={{ minHeight: 48, fontSize: fs(14), gap: 8 }}><Ikon d="M12 5v14M5 12h14" s={20} />Tambah</button> : null}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 4, padding: 4, borderRadius: 26, border: '1px solid var(--m-tepi)' }}>
          {arr(b.segs).map((m, i) => <button key={i} type="button" onClick={m?.on} aria-pressed={!!m?.a} style={{ ...pil(m?.a), border: 0, padding: 0 }}>{txt(m?.l)}</button>)}
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', margin: '0 -16px', padding: '0 16px' }}>
          {arr(b.days).map((d, i) => <button key={i} type="button" onClick={d?.on} aria-pressed={!!d?.a} style={pil(d?.a)}>{txt(d?.l)}</button>)}
        </div>
        <input className="input" type="search" aria-label="Cari jamaah atau pelaksana" value={b.q ?? ''} onChange={b.onQ} placeholder="Cari jamaah atau pelaksana" style={{ height: 48, fontSize: fs(15), borderRadius: 12 }} />
      </div>

      <div className="mk-gradasi" style={{ ...kartu, background: undefined, gap: 6 }}>
        <div style={{ fontSize: fs(12.5) }}>Badal · {txt(b.dayLbl)}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 300, fontSize: fs(32), lineHeight: 1 }}>{txt(b.done)}</span>
          <span style={{ fontSize: fs(14) }}>/ {txt(b.tot)} sudah dibadalkan · {txt(b.pct)}</span>
        </div>
        <div role="progressbar" aria-valuenow={parseInt(b.pct, 10) || 0} aria-valuemin={0} aria-valuemax={100} aria-label="Progres badal" style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,.3)', overflow: 'hidden', marginTop: 4 }}>
          <div style={{ height: '100%', width: b.pct, background: '#ffffff', borderRadius: 3 }} />
        </div>
      </div>

      {b.isJ ? (<>
        {kurang ? (
          <button type="button" onClick={b.onFab} style={{ border: 0, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, padding: '8px 14px', borderRadius: 12, background: 'var(--red-100)', color: 'var(--red-700)', font: `500 ${fs(13.5)} var(--font-body)` }}>
            <Ikon d={SEGITIGA} s={20} />{txt(b.fab)}
          </button>
        ) : null}
        {b.empty ? <div style={{ ...kartu, textAlign: 'center', ...kecil }}>Belum ada jamaah yang dibadalkan. Jamaah udzur otomatis masuk; lainnya lewat tombol Tambah.</div> : (
          <div style={{ ...kartu, gap: 0, padding: '4px 16px' }}>
            {arr(b.rows).map((r, i) => { const udzur = r?.tag === 'Udzur', tanpa = /red/.test(String(r?.subFg));
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderTop: i ? '1px solid var(--color-divider)' : 0 }}>
                  <Avatar ini={r?.ini} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <button type="button" className="ketuk" onClick={r?.on} style={{ display: 'block', minHeight: 44 }}>
                      <span style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 500, fontSize: fs(14.5) }}>{txt(r?.name)}</span>
                        {udzur ? <span className="mk-lencana mk-lencana-merah"><Ikon d={SEGITIGA} s={16} />Udzur</span> : <span className="mk-lencana">{txt(r?.tag)}</span>}
                      </span>
                      <span style={{ display: 'block', marginTop: 2, fontSize: fs(12.5), lineHeight: 1.4, color: tanpa ? 'var(--red-700)' : 'var(--teks-3)', fontWeight: tanpa ? 500 : 400 }}>{txt(r?.sub)}</span>
                    </button>
                    <div data-sorot="tidak" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                      {arr(r?.days).map((d, k) => { const l = String(d?.l || ''), selesai = l.includes('✓'), na = l.includes('NA'), kini = l.includes('•'), hari = l.replace(/ (✓|•|NA)$/, '');
                        return (
                          <button key={k} type="button" onClick={d?.on} aria-pressed={selesai} aria-label={hari + ' Dzulhijjah' + (selesai ? ', sudah dibadalkan' : na ? ', tidak wajib' : ', belum')}
                            style={{ ...pil(selesai), minWidth: 54, padding: '0 10px', ...(kini && !selesai ? { borderColor: 'var(--color-accent)', borderWidth: 2 } : {}), ...(na ? { background: 'var(--color-neutral-200)', borderColor: 'var(--color-neutral-200)' } : {}) }}>
                            {hari}{selesai ? <Ikon d="M5 12.5l4.5 4.5L19 7.5" s={16} w={2.2} /> : na ? ' NA' : null}
                          </button>
                        ); })}
                    </div>
                  </div>
                </div>
              ); })}
          </div>
        )}
        {!kurang ? (
          <div style={{ position: 'sticky', bottom: 8, zIndex: 2 }}>
            <button type="button" className={siap ? 'btn btn-primary' : 'btn btn-secondary'} onClick={b.onFab} disabled={!siap} style={{ width: '100%', minHeight: 48, fontSize: fs(14) }}>{txt(b.fab)}</button>
          </div>
        ) : null}
      </>) : null}

      {b.isP ? (<>
        {arr(b.groups).map((g, i) => { const tanpa = g?.ini === '!';
          return (
            <div key={i} style={{ ...kartu, gap: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                {tanpa ? <span style={{ width: 40, height: 40, borderRadius: 20, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--red-100)', color: 'var(--red-600)' }}><Ikon d={SEGITIGA} s={20} /></span> : <Avatar ini={g?.ini} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: fs(14.5), color: tanpa ? 'var(--red-700)' : 'var(--color-text)' }}>{txt(g?.name)}</div>
                  <div style={kecil}>{txt(g?.role)}</div>
                </div>
                <span style={{ flex: 'none', fontWeight: 300, fontSize: fs(22) }}>{txt(g?.n)}</span>
              </div>
              {arr(g?.items).map((x, k) => { const selesai = String(x?.st).includes('✓');
                return (
                  <button key={k} type="button" className="ketuk" onClick={x?.on} aria-pressed={selesai} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 44, padding: '6px 0', borderTop: '1px solid var(--color-divider)', fontSize: fs(13.5) }}>
                    <span>{txt(x?.name)} <span style={{ color: 'var(--teks-3)' }}>· {txt(x?.sub)}</span></span>
                    <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500, color: selesai ? 'var(--color-accent)' : 'var(--color-text)' }}>{String(x?.st).replace(' ✓', '')}{selesai ? <Ikon d="M5 12.5l4.5 4.5L19 7.5" s={16} w={2.2} /> : null}</span>
                  </button>
                ); })}
            </div>
          ); })}
        <div style={{ ...kecil, padding: '0 4px' }}>Aturan: semua jamaah boleh menjadi pelaksana dan melontar untuk dirinya sendiri serta jamaah yang dibadalkan pada waktu yang sama.</div>
      </>) : null}
    </div>
  );
}
