// Kerangka tampilan: bingkai HP, kepala halaman, isi menu yang aktif, bilah bawah, lalu lembar dan dialog.
// Isi tiap menu ada di folder layar/; semua data dan aksi datang dari AppLogic lewat `v`.
import React, { useEffect, useState } from 'react';
import { css } from './dc/runtime.js';
import HalamanBaru from './HalamanBaru.jsx';
import KepalaHalaman from './layar/KepalaHalaman.jsx';
import MenuBeranda from './layar/MenuBeranda.jsx';
import MenuJamaah from './layar/MenuJamaah.jsx';
import MenuChecklist from './layar/MenuChecklist.jsx';
import MenuBadal from './layar/MenuBadal.jsx';
import MenuRekap from './layar/MenuRekap.jsx';
import MenuCetak from './layar/MenuCetak.jsx';
import BilahBawah from './layar/BilahBawah.jsx';
import LembarJamaah from './layar/LembarJamaah.jsx';
import LembarKegiatan from './layar/LembarKegiatan.jsx';
import LembarSinkron from './layar/LembarSinkron.jsx';
import DialogUmum from './layar/DialogUmum.jsx';
import Pengaturan from './layar/Pengaturan.jsx';
import LayarDoa from './doa/LayarDoa.jsx';
import LayarKultum from './doa/LayarKultum.jsx';
import { useTutupDenganEscape } from './layar/escape.js';
import { GAMBAR } from './gambar.jsx';
import { periode, kotaTersimpan } from './waktu.js';

export default function View({ v }) {
  useTutupDenganEscape(v);
  // Warna gradasi ikut waktu sholat kota yang dipilih di Home.
  const [, segarkan] = useState(0);
  useEffect(() => { const f = () => segarkan(x => x + 1); window.addEventListener('mk-kota', f); return () => window.removeEventListener('mk-kota', f); }, []);
  const tinggiKepala = v.isBeranda ? '0px' : 'calc(64px + env(safe-area-inset-top, 0px))';
  const gayaHeader = 'z-index:2;min-height:calc(64px + env(safe-area-inset-top, 0px));padding-top:env(safe-area-inset-top, 0px);box-sizing:border-box;border-radius:0 0 28px 28px';
  return (
    <div style={css(`color:var(--color-text);background:var(--mk-outer);font-family:var(--font-body);font-size:calc(15px*var(--fs,1));min-height:100vh;display:flex;justify-content:center;align-items:flex-start;padding:${v.outerPad ?? ''};box-sizing:border-box`)}>
      <div className="mk-layar" data-waktu={periode(kotaTersimpan())} style={css(`--gambar-latar:url(${GAMBAR.makkah});width:${v.fW ?? ''};height:${v.fH ?? ''};border-radius:${v.fR ?? ''};background:var(--color-bg);overflow:hidden;position:relative;box-shadow:${v.fS ?? ''};border:${v.fB ?? ''};box-sizing:border-box;flex:none`)}>
        {v.isBeranda ? null : <header className="mk-gradasi" style={css(gayaHeader)}><KepalaHalaman v={v} /></header>}
        <main ref={v.scrollRef} style={css(`position:absolute;top:${tinggiKepala};bottom:0;left:0;right:0;z-index:1;overflow-y:auto;overflow-x:hidden;padding-bottom:calc(${(v.isKejadian && v.kejadian && v.kejadian.form) || (v.isKirim && v.kirim && v.kirim.jenis) ? 0 : 104}px + env(safe-area-inset-bottom, 0px));box-sizing:border-box;container-type:inline-size`)}>
          {v.isKirim || v.isProfil || v.isKejadian ? <HalamanBaru v={v} /> : null}
          {v.isBeranda ? <MenuBeranda v={v} /> : null}
          {v.isJamaah ? <MenuJamaah v={v} /> : null}
          {v.isChecklist ? <MenuChecklist v={v} /> : null}
          {v.isBadal ? <MenuBadal v={v} /> : null}
          {v.isRekap ? <MenuRekap v={v} /> : null}
          {v.isCetak ? <MenuCetak v={v} /> : null}
          {v.isDoa ? <LayarDoa /> : null}
          {v.isKultum ? <LayarKultum k={v.kultum} /> : null}
        </main>
        {(v.isKejadian && v.kejadian && v.kejadian.form) || (v.isKirim && v.kirim && v.kirim.jenis) ? null : <BilahBawah v={v} />}
        <LembarJamaah v={v} />
        <LembarKegiatan v={v} />
        <LembarSinkron v={v} />
        <DialogUmum v={v} />
        <Pengaturan v={v} />
      </div>
    </div>
  );
}
