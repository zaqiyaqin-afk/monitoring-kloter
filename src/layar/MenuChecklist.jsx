// Menu Massal: pilih ibadah, lalu centang per kloter/rombongan/regu/jamaah, dan daftar kegiatan per hari.
import React, { useState } from 'react';
import { txt, arr } from '../dc/runtime.js';
import PilihIbadah from '../PilihIbadah.jsx';
import { Ikon, Avatar, SEGITIGA } from './MenuJamaah.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const kartu = { background: 'var(--color-surface)', borderRadius: 20, padding: 16, display: 'grid', gap: 12, minWidth: 0 };
const label = { fontSize: fs(13.5), fontWeight: 500 };
const kecil = { fontSize: fs(12.5), color: 'var(--teks-3)', lineHeight: 1.45 };
const geser = { display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -16px', padding: '0 16px', scrollbarWidth: 'none' };
const pil = (a, lain) => ({ flex: 'none', minHeight: 44, padding: '0 14px', borderRadius: 22, border: '1px solid ' + (a ? 'var(--color-accent)' : 'var(--m-tepi)'), background: a ? 'var(--color-accent)' : 'var(--color-surface)',
  color: a ? 'var(--on-accent)' : 'var(--color-text)', font: `${a ? 600 : 400} ${fs(13)} var(--font-body)`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap', ...lain });
const wadah = n => ({ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`, gap: 4, padding: 4, borderRadius: 26, border: '1px solid var(--m-tepi)' });
const CENTANG = 'M5 12.5l4.5 4.5L19 7.5', GEMBOK = 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', TURUN = 'M6 9l6 6 6-6';

const Segmen = ({ list }) => (
  <div style={wadah(arr(list).length)}>
    {arr(list).map((m, i) => <button key={i} type="button" onClick={m?.on} aria-pressed={!!m?.a} style={pil(m?.a, { border: 0, padding: 0, minWidth: 0 })}>{txt(m?.l)}</button>)}
  </div>
);
// Kotak centang bulat: biru tua bila selesai, bertepi bila belum, huruf B untuk badal.
const Centang = ({ c, onClick, nama }) => (
  <button type="button" onClick={onClick} aria-label={nama}
    style={{ width: 44, height: 44, flex: 'none', borderRadius: 22, padding: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', border: '1.5px solid ' + c.ring, background: c.bg, color: c.fg, font: `600 ${fs(14)} var(--font-body)` }}>
    {c.mark === '✓' ? <Ikon d={CENTANG} s={22} w={2.2} /> : c.mark === '–' ? <Ikon d="M7 12h10" s={20} /> : txt(c.mark)}
  </button>
);
const merah = t => /red/.test(String(t?.bg || ''));

export default function MenuChecklist({ v }) {
  const [buka, setBuka] = useState({});
  if (v.ckPilih) return <PilihIbadah v={v} />;
  const s = v.ckSum || {};
  return (
    <div style={{ padding: '12px 12px 24px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gridAutoRows: 'max-content', gap: 12 }}>
      <div style={kartu}>
        <div style={kecil}>{txt(v.kloterLabel)} · {txt(v.d?.day)}</div>
        <div style={label}>Hari</div>
        <div ref={v.daysRef} style={{ ...geser, scrollSnapType: 'x proximity' }}>
          {arr(v.ckDays).map((c, i) => (
            <button key={i} type="button" data-today={c?.today} onClick={c?.on} aria-pressed={!!c?.sel} style={pil(c?.sel, { scrollSnapAlign: 'center' })}>
              {txt(c?.l)}{c?.td ? <span style={{ fontWeight: 400 }}>· hari ini</span> : null}
            </button>
          ))}
        </div>
        <div style={label}>Kegiatan</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {arr(v.ckPills).map((p, i) => (
            <button key={i} type="button" onClick={p?.on} aria-pressed={!!p?.a} style={pil(p?.a, { whiteSpace: 'normal', textAlign: 'left', padding: '6px 14px' })}>
              {p?.locked ? <Ikon d={GEMBOK} s={16} /> : p?.done ? <Ikon d={CENTANG} s={16} w={2.2} /> : null}
              {txt(p?.l)}{p?.now ? <span style={{ fontWeight: 400 }}>· berjalan</span> : null}
            </button>
          ))}
        </div>
        {v.ckNotCur ? <button type="button" onClick={v.ckSetCur} style={pil(false, { justifySelf: 'start' })}>Jadikan kegiatan yang sedang berlangsung</button> : null}
        {v.ckTarw ? (<>
          <div style={label}>Tarwiyah · berangkat ke Mina tanggal</div>
          <Segmen list={v.tarwBtns} />
        </>) : null}
        {v.isMad ? (<>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={label}>Jadwal Raudhoh</span><span style={kecil}>{txt(v.sexSplit)}</span>
          </div>
          {v.noSlots ? <div style={kecil}>Belum ada jadwal. Ketuk Tambah jadwal.</div> : null}
          <div style={geser}>
            {arr(v.mdDays).map((c, i) => { const a = c?.bg === 'var(--color-accent)'; return <button key={i} type="button" onClick={c?.on} aria-pressed={a} style={pil(a)}>{txt(c?.l)}</button>; })}
          </div>
          <Segmen list={v.mdSexBtns} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {arr(v.mdJams).map((c, i) => { const a = c?.rw === '2.5px';
              return (
                <button key={i} type="button" onClick={c?.on} aria-pressed={a} style={{ borderRadius: 16, minHeight: 56, padding: '6px 14px', textAlign: 'left', cursor: 'pointer', font: 'inherit', border: '1px solid ' + (a ? 'var(--color-accent)' : 'var(--m-tepi)'), background: a ? 'var(--color-accent)' : 'var(--color-surface)', color: a ? 'var(--on-accent)' : 'var(--color-text)' }}>
                  <div style={{ fontWeight: 500, fontSize: fs(14), display: 'flex', alignItems: 'center', gap: 6 }}>{c?.kunci ? <Ikon d={GEMBOK} s={15} /> : null}{txt(c?.l)}</div>
                  <div style={{ fontSize: fs(12.5) }}>{txt(c?.sub)} · {txt(c?.cnt)}</div>
                </button>
              ); })}
          </div>
          {v.mdNone ? <div style={kecil}>Belum ada jadwal {txt(v.mdSexName)} pada hari ini.</div> : null}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" onClick={v.openAddSlot} style={pil(false)}><Ikon d="M12 5v14M5 12h14" s={18} />Tambah jadwal</button>
            {v.slotActive ? <button type="button" onClick={v.clearSlot} style={pil(false)}>Tampilkan semua jamaah</button> : null}
          </div>
        </>) : null}
        <div style={label}>Cakupan</div>
        <Segmen list={v.ckScopes} />
        {v.ckShowR ? (
          <div style={geser}>
            {arr(v.ckRs).map((c, i) => (
              <button key={i} type="button" onClick={c?.on} aria-pressed={!!c?.a} aria-label={'Rombongan ' + c?.r + ', ' + c?.pct} style={pil(c?.a, { gap: 8 })}>
                {c?.low && !c?.a ? <span style={{ color: 'var(--red-600)', display: 'grid' }}><Ikon d={SEGITIGA} s={16} /></span> : null}
                <span>{txt(c?.l)}</span><span style={{ fontWeight: 500, color: c?.low && !c?.a ? 'var(--red-700)' : 'inherit' }}>{txt(c?.pct)}</span>
              </button>
            ))}
          </div>
        ) : null}
        {v.ckShowG ? <Segmen list={v.ckGs} /> : null}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: 0, bottom: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}><Ikon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" s={20} /></span>
          <input className="input" type="search" aria-label="Cari jamaah" value={v.ckQ ?? ''} onChange={v.onCkQ} placeholder="Cari nama atau nomor porsi" style={{ height: 48, width: '100%', boxSizing: 'border-box', paddingLeft: 44, fontSize: fs(15), borderRadius: 12 }} />
        </div>
      </div>

      <div style={{ ...kartu, gap: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: fs(22), fontWeight: 300, lineHeight: 1.2 }}>{txt(s.label)}</span>
          <span style={{ flex: 'none', fontSize: fs(14), fontWeight: 500 }}>{txt(s.done)} / {txt(s.total)}</span>
        </div>
        <div style={{ ...kecil, marginBottom: 10 }}>selesai {txt(s.rite)}</div>
        <div role="progressbar" aria-valuenow={parseInt(s.pct, 10) || 0} aria-valuemin={0} aria-valuemax={100} aria-label="Progres cakupan" style={{ height: 5, borderRadius: 3, background: 'var(--m-trek)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: s.pct, background: 'var(--color-accent)', borderRadius: 3 }} />
        </div>
        {s.hasNote ? <div style={{ ...kecil, marginTop: 10 }}>{txt(s.note)}</div> : null}

        {v.hasPel ? (<>
          <div style={{ ...label, marginTop: 14 }}>Pelaksana badal</div>
          {arr(v.pelGroups).map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-divider)' }}>
              <Avatar ini={p?.count} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: fs(14) }}>{txt(p?.name)}</div>
                <div style={kecil}>{txt(p?.role)} · {txt(p?.names)}</div>
              </div>
            </div>
          ))}
        </>) : null}

        {v.ckEmpty ? <div style={{ ...kecil, textAlign: 'center', padding: '24px 0 8px' }}>Tidak ada jamaah untuk kegiatan ini di cakupan ini.</div> : null}

        {v.ckHasRows ? arr(v.ckRows).map((r, i) => (
          <div key={i} style={{ display: 'grid', gap: 10, padding: '10px 0', borderTop: '1px solid var(--color-divider)', marginTop: i ? 0 : 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="button" className="ketuk" onClick={r?.onOpen} style={{ flex: 1, minWidth: 0, minHeight: 44, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ flex: 1, minWidth: 0, display: 'grid' }}>
                  <span style={{ fontWeight: 500, fontSize: fs(15) }}>{txt(r?.title)}</span>
                  <span style={kecil}>{txt(r?.sub)}</span>
                </span>
                <span style={{ flex: 'none', fontSize: fs(14), fontWeight: 500 }}>{txt(r?.cnt)}</span>
              </button>
              <Centang c={r} onClick={r?.onCheck} nama={'Centang semua ' + (r?.title ?? '')} />
            </div>
            {r?.hasDots ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {arr(r?.dots).map((o, k) => <span key={k} aria-hidden="true" style={{ width: 36, height: 36, boxSizing: 'border-box', borderRadius: 18, display: 'grid', placeItems: 'center', font: `500 12px var(--font-body)`, border: o?.bd, background: o?.bg, color: o?.fg }}>{txt(o?.ini)}</span>)}
              </div>
            ) : null}
            {r?.noDots ? (
              <div aria-hidden="true" style={{ height: 5, borderRadius: 3, background: 'var(--m-trek)', overflow: 'hidden' }}>
                <div style={{ width: r?.pct, height: '100%', borderRadius: 3, background: r?.col }} />
              </div>
            ) : null}
          </div>
        )) : null}

        {v.ckHasPeople ? arr(v.ckPeople).map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 60, padding: '8px 0', borderTop: '1px solid var(--color-divider)', marginTop: i ? 0 : 12 }}>
            <button type="button" className="ketuk" onClick={p?.onOpen} style={{ flex: 1, minWidth: 0, minHeight: 44, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar ini={p?.ini} />
              <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
                <span style={{ fontWeight: 500, fontSize: fs(14.5), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{txt(p?.name)}</span>
                <span style={{ ...kecil, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{txt(p?.sub)}</span>
                {p?.hasTags ? (
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                    {arr(p?.tags).map((t, k) => merah(t)
                      ? <span key={k} className="mk-lencana mk-lencana-merah" style={{ whiteSpace: 'normal', minHeight: 24 }}><Ikon d={SEGITIGA} s={16} />{txt(String(t?.t).replace('↺ ', ''))}</span>
                      : <span key={k} className="mk-lencana" style={{ whiteSpace: 'normal', minHeight: 24 }}>{txt(String(t?.t).replace('↺ ', ''))}</span>)}
                  </span>
                ) : null}
              </span>
            </button>
            {p?.canUl ? <button type="button" onClick={p?.onMore} aria-label={'Tandai perlu ulang: ' + (p?.name ?? '')} style={{ width: 44, height: 44, flex: 'none', border: 0, borderRadius: 22, background: 'transparent', color: 'var(--color-text)', display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }}><Ikon d="M5 12h.01M12 12h.01M19 12h.01" s={22} w={2.6} /></button> : null}
            <Centang c={{ bg: p?.cb, fg: p?.cf, ring: p?.cr, mark: p?.mark }} onClick={p?.onCheck} nama={'Centang ' + (p?.name ?? '')} />
          </div>
        )) : null}

        <div style={{ position: 'sticky', bottom: 8, zIndex: 2, marginTop: 14 }}>
          <button type="button" className="btn btn-primary" onClick={s.onAll} style={{ width: '100%', minHeight: 48, fontSize: fs(14), boxShadow: '0 0 0 4px var(--color-surface)' }}>{txt(s.action)}</button>
        </div>
      </div>

      <div style={{ ...kartu, gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <span style={{ fontSize: fs(16), fontWeight: 500 }}>{txt(v.judulKegiatan)}</span>
          <span style={{ display: 'flex', gap: 6 }}>
            {v.isUmrah ? <button type="button" onClick={v.openMiqat} style={pil(false)}>Atur miqat</button> : null}
            <button type="button" onClick={v.openTgl} style={pil(false)}>Atur tanggal</button>
          </span>
        </div>
        {arr(v.riteGroups).map((gp, i) => {
          const items = arr(gp?.items), kini = gp?.note === 'Hari ini' || items.some(r => r?.isNow), terbuka = buka[i] ?? kini, beres = items.length > 0 && items.every(r => r?.st === 'done');
          return (
            <div key={i} style={{ borderTop: '1px solid var(--color-divider)' }}>
              <button type="button" className="ketuk" onClick={() => setBuka({ ...buka, [i]: !terbuka })} aria-expanded={terbuka} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48 }}>
                {beres ? <span style={{ color: 'var(--color-accent)', display: 'grid' }}><Ikon d={CENTANG} s={18} w={2.2} /></span> : null}
                <span style={{ flex: 1, minWidth: 0, fontSize: fs(14), fontWeight: kini ? 500 : 400 }}>{txt(gp?.day)}</span>
                {kini ? <span className="mk-lencana" style={{ flex: 'none' }}>Hari ini</span> : <span style={{ ...kecil, flex: 'none' }}>{items.length} kegiatan{beres ? ' · selesai' : gp?.note ? ' · ' + gp.note : ''}</span>}
                <span style={{ flex: 'none', display: 'grid', transform: terbuka ? 'rotate(180deg)' : 'none' }}><Ikon d={TURUN} /></span>
              </button>
              {terbuka ? items.map((r, k) => (
                <button key={k} type="button" className="ketuk" onClick={r?.on} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0 10px 12px', minHeight: 48 }}>
                  <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 500, fontSize: fs(14) }}>{txt(r?.n)}</span>
                      {r?.isNow ? <span className="mk-lencana">Berjalan</span> : null}
                    </span>
                    <span style={kecil}>{[r?.place, r?.k].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span style={{ flex: 'none', textAlign: 'right', fontSize: fs(13), fontWeight: 500 }}>
                    {r?.cnt === '-' ? '' : txt(r?.cnt)}
                    {r?.hasSus ? <span style={{ display: 'block', fontWeight: 400, color: 'var(--teks-3)' }}>{txt(r?.sus)}</span> : null}
                  </span>
                </button>
              )) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
