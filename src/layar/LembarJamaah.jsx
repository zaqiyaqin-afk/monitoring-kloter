// Lembar detail satu jamaah: aksi cepat, udzur dan pendamping, data, progres manasik, catatan kejadian.
import React from 'react';
import { txt, arr } from '../dc/runtime.js';
import DataJamaah from '../DataJamaah.jsx';
import { Ikon, Avatar, SEGITIGA } from './MenuJamaah.jsx';

const fs = n => `calc(${n}px*var(--fs,1))`;
const blok = { background: 'var(--color-bg)', borderRadius: 20, padding: 16, display: 'grid', gap: 12, minWidth: 0 };
const judul = { fontSize: fs(16), fontWeight: 500 };
const kecil = { fontSize: fs(12.5), color: 'var(--teks-3)' };
const garis = { borderTop: '1px solid var(--color-divider)', paddingTop: 12 };
const pil = a => ({ minHeight: 44, padding: '0 14px', borderRadius: 22, border: '1px solid ' + (a ? 'var(--color-accent)' : 'var(--m-tepi)'), background: a ? 'var(--color-accent)' : 'var(--color-surface)',
  color: a ? 'var(--on-accent)' : 'var(--color-text)', font: `${a ? 600 : 400} ${fs(13)} var(--font-body)`, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 });
const tombol = { minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', boxSizing: 'border-box', fontSize: fs(14) };
const TELEPON = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z';
const OBROLAN = 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z';
const PAPAN = 'M9 4h6v3H9zM9 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H15M12 11v4M12 17.5h.01';

function BarisPilih({ label, nilai, merah, cta, on }) {
  return (
    <div style={{ ...garis, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={kecil}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: fs(14), color: merah ? 'var(--red-700)' : 'var(--color-text)' }}>
          {merah ? <Ikon d={SEGITIGA} s={16} /> : null}{txt(nilai)}
        </div>
      </div>
      <button type="button" className="btn btn-secondary" onClick={on} style={{ flex: 'none', minHeight: 44, padding: '0 16px' }}>{txt(cta)}</button>
    </div>
  );
}

export default function LembarJamaah({ v }) {
  if (!v.hasSel) return null;
  const s = v.sel || {}, sk = v.sk || {}, f = s.udzForm;
  return (
    <div onClick={v.closeSel} style={{ position: 'absolute', inset: 0, background: 'var(--scrim)', display: 'flex', alignItems: 'flex-end', zIndex: 5 }}>
      <div role="dialog" aria-modal="true" aria-label={'Detail ' + (s.name || 'jamaah')} onClick={v.stop}
        style={{ width: '100%', maxHeight: '92%', overflowY: 'auto', background: 'var(--color-surface)', borderRadius: '28px 28px 0 0', padding: '10px 16px calc(24px + env(safe-area-inset-bottom, 0px))', boxSizing: 'border-box', display: 'grid', gap: 12 }}>
        <div aria-hidden="true" style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--m-tepi)', justifySelf: 'center' }} />

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Avatar ini={s.ini} s={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: fs(22), fontWeight: 300, lineHeight: 1.2 }}>{txt(s.name)}</div>
            <div style={kecil}>{txt(s.baris)}</div>
            <div style={kecil}>{txt(s.porsi)}</div>
          </div>
          <button type="button" onClick={v.closeSel} aria-label="Tutup" style={{ width: 44, height: 44, borderRadius: 22, flex: 'none', border: '1px solid var(--m-tepi)', background: 'var(--color-surface)', color: 'var(--color-text)', display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }}>
            <Ikon d="M6 6l12 12M18 6L6 18" s={20} />
          </button>
        </div>

        {s.udz || s.risti || arr(s.lencana).length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {s.udz ? <span className="mk-lencana mk-lencana-merah"><Ikon d={SEGITIGA} s={16} />Udzur · dibadalkan</span> : null}
            {s.risti ? <span className="mk-lencana">Risti · risiko tinggi</span> : null}
            {arr(s.lencana).map((l, i) => <span key={i} className="mk-lencana">{txt(l)}</span>)}
          </div>
        ) : null}

        <button type="button" className="btn btn-primary" onClick={s.catatKejadian} style={tombol}><Ikon d={PAPAN} s={20} />Catat kejadian</button>
        {s.hp ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
            <a className="btn btn-secondary" href={s.tel} style={tombol}><Ikon d={TELEPON} s={20} />Telepon</a>
            <a className="btn btn-secondary" href={s.wa} target="_blank" rel="noopener noreferrer" style={tombol}><Ikon d={OBROLAN} s={20} />WhatsApp</a>
          </div>
        ) : null}

        {s.mqTxt ? (
          <button type="button" onClick={s.openMq} style={{ ...blok, gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', border: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'var(--color-text)' }}>
            <span style={{ fontSize: fs(14), fontWeight: 500 }}>{txt(s.mqTxt)}</span>
            <span style={{ fontSize: fs(13), color: 'var(--color-accent)', fontWeight: 500 }}>Ubah</span>
          </button>
        ) : null}

        <div style={blok}>
          <div style={judul}>Udzur dan pendamping</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: fs(14), color: s.udz ? 'var(--red-700)' : 'var(--color-text)' }}>{s.udz ? 'Udzur · dibadalkan' : 'Kondisi baik'}</div>
            <div style={kecil}>{txt(s.udzSub)}</div>
          </div>
          {f ? (
            <div style={{ display: 'grid', gap: 10, background: 'var(--color-surface)', borderRadius: 16, padding: 12 }}>
              <div style={{ fontSize: fs(14), fontWeight: 500 }}>{txt(f.title)}</div>
              <div style={kecil}>Alasan (boleh kosong) · pilih atau ketik sendiri</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {arr(f.chips).map((c, i) => <button key={i} type="button" onClick={c.on} aria-pressed={!!c.a} style={pil(c.a)}>{txt(c.l)}</button>)}
              </div>
              <input className="input" aria-label="Alasan lain" value={f.alasan} onChange={f.onAlasan} placeholder="Tulis alasan lain…" style={{ height: 44, fontSize: fs(14) }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={f.batal} style={{ minHeight: 44 }}>Batal</button>
                <button type="button" className="btn btn-primary" onClick={f.ok} style={{ minHeight: 44 }}>{txt(f.okLabel)}</button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={s.toggleUdz} style={{ ...tombol, color: s.udz ? undefined : 'var(--red-700)' }}>
              {s.udz ? null : <Ikon d={SEGITIGA} s={18} />}{txt(s.udzCta)}
            </button>
          )}
          {arr(s.riwayatUdz).length ? (
            <div style={{ ...garis, display: 'grid', gap: 6 }}>
              <div style={kecil}>Riwayat udzur</div>
              {arr(s.riwayatUdz).map((r, i) => (
                <div key={i} style={{ fontSize: fs(12.5), lineHeight: 1.4 }}>{txt(r.teks)}{r.oleh ? <span style={{ color: 'var(--teks-3)' }}>{' · ' + r.oleh}</span> : null}</div>
              ))}
            </div>
          ) : null}
          <div style={{ ...garis, display: 'grid', gap: 8 }}>
            <div style={kecil}>Kebutuhan khusus</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {arr(sk.chips).map((c, i) => (
                <button key={i} type="button" onClick={c?.on} aria-pressed={!!c?.a} style={pil(c?.a)}>{c?.a ? <Ikon d="M5 12.5l4.5 4.5L19 7.5" s={16} w={2.2} /> : null}{txt(c?.l)}</button>
              ))}
            </div>
          </div>
          <BarisPilih label="Pendamping (jamaah)" nilai={sk.pend} merah={sk.pendCta === 'Pilih'} cta={sk.pendCta} on={sk.onPend} />
          {sk.showPelb ? <BarisPilih label="Pelaksana badal tetap · 10–13 Dzh" nilai={sk.pelb} merah={sk.pelbCta === 'Pilih'} cta={sk.pelbCta} on={sk.onPelb} /> : null}
          {v.hasPelNote ? <div style={{ ...garis, fontSize: fs(13), lineHeight: 1.45 }}>{txt(s.pelNote)}</div> : null}
        </div>

        <DataJamaah d={v.selData} />

        <div style={blok}>
          <div style={judul}>Catatan</div>
          <input className="input" aria-label="Catatan jamaah" value={s.note ?? ''} onChange={v.onNote} placeholder="Tulis catatan, mis. kursi roda" style={{ height: 44, fontSize: fs(14.5) }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {arr(s.noteChips).map((c, i) => <button key={i} type="button" onClick={c?.on} style={pil(false)}>{txt(c?.l)}</button>)}
          </div>
        </div>

        <div style={{ ...blok, gap: 4 }}>
          <div style={judul}>Progres manasik</div>
          <div style={kecil}>Ketuk langkah untuk mengubah</div>
          {arr(s.rites).map((r, i) => (
            <div key={i} style={{ display: 'grid', gap: 4, borderBottom: '1px solid var(--color-divider)', padding: '2px 0' }}>
              <button type="button" className="ketuk" onClick={r?.on} aria-pressed={!!r?.d} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 44 }}>
                <span style={{ width: 24, flex: 'none', display: 'grid', placeItems: 'center', color: r?.telat ? 'var(--red-600)' : 'var(--color-accent)' }}>
                  {r?.d ? <Ikon d="M5 12.5l4.5 4.5L19 7.5" s={20} w={2.2} /> : r?.telat ? <Ikon d={SEGITIGA} s={20} />
                    : <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--m-tepi)' }} />}
                </span>
                <span style={{ flex: 1, minWidth: 0, display: 'grid' }}>
                  <span style={{ fontSize: fs(14) }}>{txt(r?.n)}</span>
                  <span style={kecil}>{txt(r?.day)}</span>
                </span>
                <span style={{ fontSize: fs(12.5), textAlign: 'right', maxWidth: '48%', color: r?.telat ? 'var(--red-700)' : 'var(--teks-3)', fontWeight: r?.telat ? 500 : 400 }}>{r?.st === '-' ? '' : txt(r?.st)}</span>
              </button>
              {r?.ubahTgl ? (
                <button type="button" onClick={r.ubahTgl} style={{ ...pil(false), justifySelf: 'start', marginLeft: 34, marginBottom: 6 }}>
                  {r.tglTxt ? 'Dilaksanakan ' + r.tglTxt + ' · ubah' : 'Atur tanggal pelaksanaan'}
                </button>
              ) : null}
            </div>
          ))}
          {s.canUlang ? <button type="button" className="btn btn-secondary" onClick={s.openUlang} style={{ ...tombol, marginTop: 8 }}>Tandai perlu ulang</button> : null}
        </div>

        <div style={blok}>
          <div style={judul}>Catatan kejadian</div>
          {arr(s.kej).length ? arr(s.kej).map((k, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, ...(i ? garis : {}) }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: fs(14), fontWeight: 500 }}>{txt(k.l)}</div>
                <div style={kecil}>{txt(k.w)}</div>
              </div>
              {k.buka ? <span className="mk-lencana mk-lencana-merah"><Ikon d={SEGITIGA} s={16} />{txt(k.st)}</span> : <span className="mk-lencana">{txt(k.st)}</span>}
            </div>
          )) : <div style={kecil}>Belum ada catatan untuk jamaah ini.</div>}
        </div>
      </div>
    </div>
  );
}
