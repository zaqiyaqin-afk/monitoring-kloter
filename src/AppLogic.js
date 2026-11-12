// Logika aplikasi (state, sinkron, perhitungan). Tampilan ada di View.jsx.
import React from 'react';
import { DCLogic } from './dc/runtime.js';
import { ambilSemua, kirimPerubahan, unggahFoto, tautanFoto, SB_URL } from './data/server.js';
import { keadaan as akunKeadaan, dengar as dengarAkun } from './data/akun.js';
import { kompres, keBase64, simpanFoto, hapusFoto, semuaFoto } from './data/fotoStore.js';
import { JENIS_KEJADIAN, labelKejadian, dariKejadian, uuid } from './kejadian.js';
import { TUSI, EMBARKASI, CATATAN_GELOMBANG, MIQAT, miqatBawaan, kurangIdentitas, pesanKurang, dariPengaturan, kePengaturan } from './identitas.js';
import { bacaCfg, simpanCfg, bacaSnap, simpanSnap, bacaAntrean, simpanAntrean, bacaAntreanCadangan, mintaPenyimpananTetap } from './data/localStore.js';

// Nama isian data pribadi <-> nama kolom di data jamaah
const KOLOM_DATA = { jk: 'Jenis Kelamin', tglLahir: 'Tanggal Lahir', hp: 'Nomor HP', hotelMakkah: 'Hotel Makkah', lantaiMakkah: 'Lantai Makkah', kamarMakkah: 'Kamar Makkah',
  tendaArafah: 'Tenda Arafah', tendaMina: 'Tenda Mina', hotelMadinah: 'Hotel Madinah', lantaiMadinah: 'Lantai Madinah', kamarMadinah: 'Kamar Madinah' };
const keKolom = it => Object.fromEntries(Object.entries(KOLOM_DATA).filter(([k]) => k in it).map(([k, kol]) => [kol, it[k] ?? '']));
const dariKolom = row => Object.fromEntries(Object.entries(KOLOM_DATA).map(([k, kol]) => [k, String(row[kol] ?? '')]));

export default class AppLogic extends DCLogic {
  ketua = ['Ahmad', 'Sulastri', 'Rofiq', 'Maimunah', 'Yusuf', 'Hartini', 'Imam', 'Siti', 'Bahrul'];
  data = {
    haji: { label: 'Haji', kicker: 'Kloter {K} · Haji 1448 H', print: 'Kloter {K} · Haji 1448 H', day: '10 Dzulhijjah',
      deadline: 'Waktu afdal lontar berakhir saat Maghrib · 18.52 WAS', cur: 8,
      rites: (() => {
        const A = '7/8 Dzulhijjah', R = [
          { n: 'Tarwiyah', p: 'Tarwiyah', k: 'Sunnah', day: A, place: 'Mina', g: 'tarw', tarw: true, ab: 'Tr' },
          { n: 'Non Tarwiyah', p: 'Non Tarwiyah', k: 'Opsi', day: A, place: 'Langsung ke Arafah', g: 'tarw', ab: 'NT', pil: 'Non Tarwiyah' },
          { n: 'Niat Haji', p: 'Niat Haji', k: 'Rukun', day: A, place: 'Makkah' },
          { n: 'Ihram Haji', p: 'Ihram Haji', k: 'Rukun', day: A, place: 'Makkah' },
          { n: 'Wukuf di Arafah', p: 'Wukuf di Arafah', k: 'Rukun', day: '9 Dzulhijjah', place: 'Arafah', g: 'wukuf', ab: '✓' },
          { n: 'Safari Wukuf', p: 'Safari Wukuf', k: 'Rukun', day: '9 Dzulhijjah', place: 'Arafah', g: 'wukuf', safari: true, ab: 'S', pil: 'Safari' },
          { n: 'Murur Mabit', p: 'Murur Mabit', k: 'Wajib', day: 'Malam 10 Dzulhijjah', place: 'Muzdalifah', g: 'muzd', malam: true, ab: 'MM', pil: 'Murur Mabit' },
          { n: 'Murur', p: 'Murur', k: 'Wajib', day: 'Malam 10 Dzulhijjah', place: 'Muzdalifah', g: 'muzd', malam: true, ab: 'Mr', pil: 'Murur' },
          { n: 'Jumroh Aqobah', p: 'Jumroh Aqobah', k: 'Wajib', day: '10 Dzulhijjah', place: 'Jamarat, Mina', g: 'j10', verb: 'melontar', ab: '✓' },
          { n: 'Badal Jumroh Aqobah', p: 'Badal Jumroh Aqobah', k: 'Badal', day: '10 Dzulhijjah', place: 'Jamarat, Mina', g: 'j10', badal: true, ab: 'B', pil: 'Badal' },
          { n: 'Tahallul Awwal Haji', p: 'Tahallul Awwal', k: 'Wajib', day: '10 Dzulhijjah', place: 'Mina' }
        ];
        [11, 12, 13].forEach(d => { const M = 'Malam ' + d + ' Dzulhijjah', D = d + ' Dzulhijjah', x = d === 13;
          R.push({ n: 'Mabit di Mina Malam ' + d, p: 'Mabit di Mina', k: 'Wajib', day: M, place: 'Mina', g: 'mb' + d, malam: true, d13: x, ab: 'M', pil: 'Mabit' });
          R.push({ n: 'Tanazul Mina Malam ' + d, p: 'Tanazul Mina', k: 'Wajib', day: M, place: 'Hotel Makkah', g: 'mb' + d, malam: true, d13: x, ab: 'T', pil: 'Tanazul' });
          [['Ula', 'u'], ['Wustho', 'w'], ['Aqobah', 'a']].forEach(([a, c]) => R.push({ n: `Jumroh ${a} ${d} Dzh`, p: 'Jumroh ' + a, k: 'Wajib', day: D, place: 'Jamarat, Mina', g: 'j' + d + c, d13: x, verb: 'melontar' }));
          R.push({ n: `Badal Jumroh ${d} Dzh`, p: 'Badal Jumroh ' + d + ' Dzh', k: 'Badal', day: D, place: 'Jamarat, Mina', g: 'b' + d, opt: true, badal: true, covers: ['j' + d + 'u', 'j' + d + 'w', 'j' + d + 'a'], d13: x, ab: 'B', pil: 'Badal' });
          if (d === 12) { R.push({ n: 'Nafar Awwal', p: 'Nafar Awwal', k: 'Opsi', day: D, place: 'Mina → Makkah', g: 'nafar', nafarAwwal: true, ab: 'NA', pil: 'Nafar Awwal' }); R.push({ n: 'Lanjut Nafar Tsani', p: 'Lanjut Nafar Tsani', k: 'Opsi', day: D, place: 'Tetap di Mina', g: 'nafar', ab: 'L', pil: 'Lanjut Nafar Tsani' }); }
          if (x) R.push({ n: 'Nafar Tsani', p: 'Nafar Tsani', k: 'Wajib', day: D, place: 'Mina → Makkah', d13: true });
        });
        R.push({ n: 'Thawaf Ifadzoh', p: 'Thawaf Ifadzoh', k: 'Rukun', day: "Ifadzoh & Sa'i", place: 'Masjidil Haram', pend: true, verb: 'thawaf' });
        R.push({ n: "Sa'i Haji", p: "Sa'i Haji", k: 'Rukun', day: "Ifadzoh & Sa'i", place: 'Mas’a' });
        R.push({ n: 'Tahallul Tsani Haji', p: 'Tahallul Tsani', k: 'Wajib', day: 'Tahallul Tsani', place: 'Makkah' });
        R.push({ n: "Thawaf Wada'", p: "Thawaf Wada'", k: 'Wajib', day: "Wada'", place: 'Masjidil Haram', pend: true });
        return R;
      })() },
    madinah: { label: 'Madinah', kicker: 'Kloter {K} · Madinah', print: 'Kloter {K} · Madinah', day: 'Madinah', cur: 0,
      rites: [{ n: 'Raudhoh', p: 'Raudhoh', s: 'Raudhoh', k: 'Sunnah', day: 'Madinah', place: 'Masjid Nabawi', verb: 'ke Raudhoh' }] },
    umrah: { label: 'Umrah', kicker: 'Kloter {K} · Umrah wajib', print: 'Kloter {K} · Umrah wajib', day: '2 Dzulqa’dah',
      deadline: "Sa'i bersama dijadwalkan 21.30 WAS", cur: 3,
      rites: [
        { n: 'Niat Umrah', p: 'Niat Umrah', k: 'Rukun', place: 'Miqat', day: '1 Dzulqa’dah' },
        { n: 'Ihram Umrah', p: 'Ihram Umrah', k: 'Rukun', place: '', day: '1 Dzulqa’dah' },
        { n: 'Miqat', p: 'Miqat (belum ditentukan)', k: 'Wajib', place: '', day: '1 Dzulqa’dah', miqat: true },
        { n: 'Thawaf Umrah', p: 'Thawaf Umrah', k: 'Rukun', place: 'Masjidil Haram', day: '2 Dzulqa’dah', verb: 'thawaf', pend: true, ulang: 'Thawaf' },
        { n: "Sa'i Umrah", p: "Sa'i Umrah", k: 'Rukun', place: 'Mas’a', day: '2 Dzulqa’dah', ulang: "Sa'i" },
        { n: 'Tahallul Umrah', p: 'Tahallul Umrah', k: 'Rukun', place: 'Makkah', day: '2 Dzulqa’dah', ulang: 'Tahallul' }
      ] }
  };
  jm = (() => {
    const M = ['Ahmad', 'Muhammad', 'Abdul', 'Hasan', 'Imam', 'Rofiq', 'Yusuf', 'Bahrul', 'Slamet', 'Sutrisno', 'Mulyadi', 'Zainal', 'Syaiful', 'Karim', 'Fauzi'];
    const F = ['Siti', 'Sulastri', 'Maimunah', 'Hartini', 'Aminah', 'Fatimah', 'Khodijah', 'Sri', 'Nurul', 'Rahmah', 'Zubaidah'];
    const L = ['Hidayat', 'Rahman', "Ma'ruf", 'Wahyudi', 'Santoso', 'Fadilah', 'Hasyim', 'Mansur', 'Latif', 'Sholeh', 'Anwar', 'Salim', 'Effendi', 'Aziz'];
    const SIZES = [39, 39, 40, 39, 40, 39, 40, 39, 39], out = [];
    SIZES.forEach((n, ri) => { for (let x = 0; x < n; x++) { const i = out.length, fn = i % 2 ? F[(i * 7) % F.length] : M[(i * 5) % M.length], ln = L[(i * 11 + 3) % L.length];
      const g = Math.floor(x / 10) + 1, gx = x % 10;
      const role = x === 0 ? 'Ketua Rombongan' : (g === 1 ? gx === 1 : gx === 0) ? 'Ketua Regu' : '';
      out.push({ id: i, idx: x, r: ri + 1, g, role, name: fn + ' ' + ln, ini: fn[0] + ln[0], porsi: '13' + String(100000 + i * 37).slice(-6),
        hp: '08' + String(1200000000 + i * 7919337).slice(0, 10), risti: (i * 17) % 11 === 0, sex: i % 2 ? 'P' : 'L' }); } });
    return out;
  })();
  cfg = bacaCfg();
  queue = bacaAntrean();
  // Baru masuk/keluar mode coba (halaman dimuat ulang): jangan minta PIN lagi
  _dariCoba = (() => { try { const v = sessionStorage.getItem('mk.dariCoba'); sessionStorage.removeItem('mk.dariCoba'); return !!v; } catch (e) { return false; } })();
  _inflight = new Set(); // item antrean yang sedang dikirim: jangan diubah di tempat
  state = (() => {
    const p = this.props || {}, mode = (this.cfg && this.cfg.mode) || (p.mode === 'umrah' ? 'umrah' : 'haji');
    const U = [13, 77, 141, 190, 255, 322], MISS = [52, 200, 301];
    const udz = this.jm.map(j => U.includes(j.id));
    const GH = [40, 38, 36, 33, 31, 30, 29, 28, 22], GU = [40, 34, 30, 28, 24, 20, 18, 14, 10];
    Object.keys(this.data).forEach(m => { this.data[m].cur = this.curOf(m); });
    const H = this.data.haji.rites, Hk = n => H.findIndex(r => r.n === n), UR = this.data.umrah.rites, Uk = n => UR.findIndex(r => r.n === n), mur = j => udz[j.id] || j.idx >= 35;
    const hv = { 'Tarwiyah': j => j.idx < 26, 'Non Tarwiyah': j => j.idx >= 26, 'Niat Haji': () => true, 'Ihram Haji': () => true, 'Wukuf di Arafah': j => !udz[j.id], 'Safari Wukuf': j => udz[j.id],
      'Murur': mur, 'Murur Mabit': j => !mur(j) && !MISS.includes(j.id), 'Jumroh Aqobah': j => j.idx < GH[j.r - 1] && !udz[j.id], 'Badal Jumroh Aqobah': j => [13, 77].includes(j.id) };
    const done = {
      haji: H.map(r => this.jm.map(j => !!(hv[r.n] && hv[r.n](j)))),
      umrah: UR.map(r => this.jm.map(j => ['Niat Umrah', 'Ihram Umrah', 'Miqat'].includes(r.n) ? true : r.n === 'Thawaf Umrah' ? j.idx < GU[j.r - 1] && !udz[j.id] && j.id !== 4 : false)),
      madinah: [this.jm.map(j => j.r <= 2 && j.sex === 'P' && !udz[j.id])]
    };
    const ex = {}, WHY = { 13: 'Kursi roda', 77: 'Dirawat di KKHI/RS', 141: 'Lansia/Risti' };
    this.jm.forEach(j => { if (udz[j.id]) ex['haji|' + Hk('Safari Wukuf') + '|' + j.id] = { pil: 'Safari', alasan: WHY[j.id] || 'Dirawat di KKHI/RS' }; if (j.idx < 26) ex['haji|' + Hk('Tarwiyah') + '|' + j.id] = { pil: 'Tarwiyah 8 Dzh' }; });
    ex['haji|' + Hk('Badal Jumroh Aqobah') + '|13'] = ex['haji|' + Hk('Badal Jumroh Aqobah') + '|77'] = { pil: 'Badal', pel: 'p2' };
    ex['umrah|' + Uk('Thawaf Umrah') + '|4'] = { stUlang: 'Perlu ulang', alasan: 'Kurang putaran', ulangKe: 1, rencana: '' };
    ex['umrah|' + Uk('Thawaf Umrah') + '|6'] = { ulangKe: 2, stUlang: 'Selesai diulang', pend: 'p2' };
    const cur = this.data[mode].cur;
    return { tab: p.startTab || 'beranda', mode, udz, mq: {}, done, sel: null, tg: {}, ex, safDlg: null, ulDlg: null, susDlg: null, slotDlg: null, confirm: null, toast: null, picker: null, undo: null, notes: { 13: 'Kursi roda', 77: 'Dirawat di KKHI', 141: 'Lansia, ikut murur' }, noteDraft: '',
      // PIN diminta sekali; setelah benar, HP tetap terbuka saat dimuat ulang sampai dikunci lewat "Kunci sekarang"
      locked: !!(this.cfg && this.cfg.pin && !this.cfg.terbuka) && !this.perluPindahAkun() && !this._dariCoba, pin: '', pinErr: false, setup: !this.cfg || this.perluPindahAkun(),
      su: { url: (this.cfg && this.cfg.url) || '', key: (this.cfg && this.cfg.key) || '', kloter: (this.cfg && this.cfg.kloter) || '', device: (this.cfg && this.cfg.device) || 'HP', pin: (this.cfg && this.cfg.pin) || '', ppih: (this.cfg && this.cfg.ppih) || '', embarkasi: (this.cfg && this.cfg.embarkasi) || '', gelombang: (this.cfg && this.cfg.gelombang) || '', err: '', busy: false, ...this.suDariAkun() },
      sync: { pending: this.queue.length, last: '-', err: '' }, syncOpen: false,
      badal: { haji: { [Hk('Badal Jumroh Aqobah')]: { 13: 'p2', 77: 'p2' } }, umrah: {}, madinah: {} },
      jl: { q: '', f: 'semua', r: 0, v: 'semua', kf: 'semua' }, bd: { v: 'jamaah', q: '', day: 0 }, pp: null,
      kh: (() => { const o = {}; this.jm.forEach(j => { const i = j.id, l = (i * 13) % 17 === 0, kr = (i * 7) % 29 === 0 || i === 13; if (l || kr || j.risti) { const mate = this.jm.find(x => x.r === j.r && x.g === j.g && x.id !== i && !x.risti && x.idx % 3 === 1); o[i] = { lansia: l, kroda: kr, pend: i % 4 !== 0 && mate ? mate.name + ' (' + mate.porsi + ')' : '' }; } }); return o; })(),
      ck: { rite: cur, scope: 'rombongan', r: 3, g: 1, slot: null, mdTgl: null, mdSex: 'L', tarwD: 8 },
      pr: { scope: 'rombongan', r: 3, g: 1, rites: [cur], fmt: 'hadir', orient: 'auto', slot: null, sheet: mode === 'umrah' ? 'umrah' : mode === 'madinah' ? 'raudhoh' : 'armuzna' } };
  })();
  byP = {};
  saveCfg(p) { this.cfg = { ...(this.cfg || {}), ...p }; simpanCfg(this.cfg); }
  saveQueue() { simpanAntrean(this.queue); }
  qKey(q) { return q.id || [q.jenis, q.porsi, q.kegiatan, q.waktu].join('|'); }
  mergeQueue(items, src) { const have = new Set(this.queue.map(q => this.qKey(q))); let n = 0;
    (items || []).forEach(it => { if (it && it.jenis && !have.has(this.qKey(it))) { this.queue.push(it); have.add(this.qKey(it)); n++; } });
    if (n) { this.queue.sort((a, b) => Date.parse(a.waktu) - Date.parse(b.waktu)); this.saveQueue(); const snap = this.readSnap(); if (snap && this.live()) this.build(snap); this.setState(s => ({ sync: { ...s.sync, pending: this.queue.length } })); this.flash(n + ' perubahan dipulihkan dari ' + src); if (this.live()) setTimeout(() => this.syncNow(true), 1200); }
    return n; }
  backupSave() { const now = new Date().toISOString(), data = { app: 'monitoring-kloter', versi: 1, dibuat: now, kloter: this.kloter(), perangkat: (this.cfg && this.cfg.device) || '', antrean: this.queue, jadwalTambahan: this.localJadwal() };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })); a.download = 'cadangan-kloter-' + this.klLabel().replace(/\s+/g, '-') + '-' + now.slice(0, 16).replace(/[:T]/g, '') + '.json';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); this.flash('Cadangan disimpan · ' + this.queue.length + ' perubahan belum terkirim'); }
  backupLoad() { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
    inp.onchange = () => { const f = inp.files && inp.files[0]; if (!f) return; f.text().then(t => { const d = JSON.parse(t); if (!d || d.app !== 'monitoring-kloter') throw new Error('x');
      if (Array.isArray(d.jadwalTambahan) && d.jadwalTambahan.length) { const loc = this.localJadwal(), ks = new Set(loc.map(r => JSON.stringify(r))); d.jadwalTambahan.forEach(r => { if (!ks.has(JSON.stringify(r))) loc.push(r); }); try { localStorage.setItem('mk.jadwalx', JSON.stringify(loc)); } catch (e) {} }
      const n = this.mergeQueue(d.antrean, 'file cadangan'); if (!n) this.flash('Tidak ada perubahan baru di file cadangan'); }).catch(() => this.flash('File cadangan tidak dikenali')); };
    inp.click(); }
  live() { return !!(this.cfg && this.cfg.url && !this.cfg.demo); }
  // Profil akun yang sudah disetujui dan punya kloter (null bila belum/tanpa Supabase)
  akunSb() { const p = akunKeadaan().profil; return p && p.status === 'aktif' && p.kloter_id && p.kloter ? p : null; }
  pakaiAkun() { return !!(this.cfg && this.cfg.url === SB_URL); }
  // HP yang masih memakai Sheet (atau mode contoh) dipindah ke akun saat akun sudah aktif
  perluPindahAkun() { return !!this.akunSb() && !this.pakaiAkun() && !this.coba(); }
  // Mode coba: data contoh di memori; tidak ada yang masuk antrean atau terkirim ke server.
  // Masuk dan keluar memuat ulang halaman supaya data contoh atau data kloter dibangun dari awal.
  coba() { return !!(this.cfg && this.cfg.demo); }
  mulaiCoba(id) { this.saveCfg({ ...(id || {}), demo: true }); this.gantiModeCoba(true); }
  selesaiCoba() {
    this.saveCfg({ demo: false });
    if (!this.akunSb() && !this.pakaiAkun()) { this.setState({ setup: true }); return; }
    this.gantiModeCoba(false);
  }
  gantiModeCoba(masuk) {
    try {
      ['mk.tgldemo', 'mk.haridemo', 'mk.miqatdemo'].forEach(k => localStorage.removeItem(k));
      // Jadwal Raudhoh tambahan milik kloter disisihkan selama mencoba; jadwal coba-coba dibuang saat selesai
      if (masuk) { if (localStorage.getItem('mk.jadwalx.asli') == null) localStorage.setItem('mk.jadwalx.asli', localStorage.getItem('mk.jadwalx') || '[]'); localStorage.removeItem('mk.jadwalx'); }
      else { const a = localStorage.getItem('mk.jadwalx.asli'); if (a != null) localStorage.setItem('mk.jadwalx', a); else localStorage.removeItem('mk.jadwalx'); localStorage.removeItem('mk.jadwalx.asli'); }
      sessionStorage.setItem('mk.dariCoba', '1');
    } catch (e) {}
    location.reload();
  }
  suDariAkun() { const p = this.akunSb(); if (!p) return {};
    return { url: SB_URL, key: 'akun', ppih: p.nama || '', kloter: p.kloter.kode, embarkasi: p.kloter.embarkasi || p.embarkasi || '', gelombang: String(p.kloter.gelombang || p.gelombang || '') }; }
  namaServer() { return 'server'; }
  tempatFoto() { return 'penyimpanan kloter'; }
  // Foto di Supabase dibuka lewat tautan sementara; foto lama di Drive langsung dibuka
  async bukaFoto(e, link) { if (!String(link).startsWith('supabase:')) return; e.preventDefault();
    try { window.open(await tautanFoto(link.slice(9)), '_blank', 'noopener'); } catch (er) { this.flash(er.message || 'Foto tidak bisa dibuka'); } }
  kloter() { return (this.cfg && this.cfg.kloter) || ''; }
  klLabel() { const K = this.kloter(); return !K ? 'Kloter' : /^kloter/i.test(K) ? K : 'Kloter ' + K; }
  tz(zone) { try { return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zone }).format(new Date()).replace(':', '.'); } catch (e) { return this.hhmm(new Date()); } }
  hhmm(d) { return String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0'); }
  readSnap() { return bacaSnap(); }
  componentDidMount() {
    { const tryL = i => { const c = ['emblem-256.png', 'icon-192.png', 'app/icon-192.png'], im = new Image(); im.onload = () => { this._logo = c[i]; const b = this.logoBox.current; if (b) { im.alt = ''; im.width = 30; im.height = 30; im.style.cssText = 'width:30px;height:30px;display:block'; b.textContent = ''; b.appendChild(im); } }; im.onerror = () => { if (i + 1 < c.length) tryL(i + 1); }; im.src = c[i]; }; tryL(0); }
    if (!this.live()) this.applyJadwal([]);
    if (!this.live()) this.jadwal = this.jadwal.concat(this.parseJadwal(this.localJadwal()).map((x, i) => ({ ...x, id: this.jadwal.length + i })));
    this._onResize = () => this.forceUpdate(); window.addEventListener('resize', this._onResize);
    this._onOnline = () => this.syncNow(true); window.addEventListener('online', this._onOnline); window.addEventListener('offline', this._onResize);
    this._lk = setInterval(() => { const lu = (this.cfg && this.cfg.lockUntil) || 0; if (this.state.locked && lu && Date.now() < lu + 1500) this.forceUpdate(); }, 1000);
    this._iv = setInterval(() => { if (this.live() && !document.hidden && (this.queue.length || Date.now() - (this._lp || 0) > 300000)) this.syncNow(true); }, 60000); this._clk = setInterval(() => { this.checkReminder(); const mn = new Date().getMinutes(); if (!document.hidden && mn !== this._lm) { this._lm = mn; this.forceUpdate(); } }, 5000); setTimeout(() => this.checkReminder(), 3000);
    Object.keys(this.data).forEach(m => { this.data[m].cur = this.curOf(m); });
    // Saat pindah ke akun, antrean ditahan dulu supaya terkirim ke akun, bukan ke Sheet lama
    if (this.live()) { const snap = this.readSnap(); if (snap) this.build(snap); if (!this.perluPindahAkun()) this.syncNow(true); }
    // Profil akun bisa baru selesai dimuat setelah layar tampil: tawarkan pindah ke akun saat itu juga
    this._lepasAkun = dengarAkun(() => { if (this.perluPindahAkun() && !this.state.setup) this.setState(s => ({ setup: true, locked: false, su: { ...s.su, ...this.suDariAkun(), err: '' } })); });
    mintaPenyimpananTetap();
    this.refreshFoto().then(() => this.unggahAntre());
    bacaAntreanCadangan(items => this.mergeQueue(items, 'salinan cadangan di perangkat'));
    // Tombol back HP: tangani di aplikasi; di Home tanpa jendela terbuka, biarkan keluar
    this._onPop = () => { if (this.kembali()) { try { history.pushState({ mk: 1 }, ''); } catch (e) {} } };
    try { history.pushState({ mk: 1 }, ''); } catch (e) {} window.addEventListener('popstate', this._onPop);
    this._onInstall = e => { e.preventDefault(); this._installEvt = e; this.forceUpdate(); }; window.addEventListener('beforeinstallprompt', this._onInstall);
    this._onVis = () => { if (!document.hidden && this.live() && (this.queue.length || Date.now() - (this._lp || 0) > 60000)) this.syncNow(true); }; document.addEventListener('visibilitychange', this._onVis);
  }
  componentWillUnmount() { if (this._lepasAkun) this._lepasAkun(); window.removeEventListener('popstate', this._onPop); window.removeEventListener('beforeinstallprompt', this._onInstall); window.removeEventListener('resize', this._onResize); window.removeEventListener('online', this._onOnline); document.removeEventListener('visibilitychange', this._onVis); window.removeEventListener('offline', this._onResize); clearInterval(this._iv); clearInterval(this._clk); clearInterval(this._lk); }
  build(snap) {
    const ord = { 'Ketua Rombongan': 0, 'Ketua Regu': 1 };
    this._berangkat = String(((snap.pengaturan || {})['Tanggal Berangkat']) || '');
    this._kej = snap.kejadian || [];
    // Isian data pribadi/akomodasi yang belum terkirim tetap tampil setelah aplikasi dibuka ulang
    this.raw = {}; (snap.jamaah || []).forEach(r => { if (r['Nomor Porsi']) this.raw[String(r['Nomor Porsi']).trim()] = { ...r }; });
    this.queue.forEach(q => { if (q.jenis === 'dataJamaah' && this.raw[q.porsi]) Object.assign(this.raw[q.porsi], keKolom(q)); });
    const rows = (snap.jamaah || []).filter(r => r['Nama'] && r['Nomor Porsi']).map(r => ({ r: Number(r['Rombongan']) || 0, g: Number(r['Regu']) || 0,
      role: r['Peran'] === 'Ketua Rombongan' || r['Peran'] === 'Ketua Regu' ? r['Peran'] : '', name: String(r['Nama']).trim(), porsi: String(r['Nomor Porsi']).trim(),
      hp: String(r['Nomor HP'] || '').trim(), sex: (s => s.startsWith('P') ? 'P' : s.startsWith('L') ? 'L' : '')(String(r['Jenis Kelamin'] || '').trim().toUpperCase()), risti: r['Risti'] === 'Ya', udz: r['Udzur'] === 'Ya', note: String(r['Catatan'] || ''), lansia: r['Lansia'] === 'Ya' || this.umur((this.raw[String(r['Nomor Porsi']).trim()] || r)['Tanggal Lahir']) >= 65, kroda: r['Kursi Roda'] === 'Ya', pend: String(r['Pendamping'] || '').trim(), pb: r['Perlu Badal'] === 'Ya', pelb: String(r['Pelaksana Badal'] || '').trim(), mq: String(r['Miqat'] || '').trim() }))
      .sort((a, b) => a.r - b.r || a.g - b.g || ((ord[a.role] ?? 2) - (ord[b.role] ?? 2)) || a.name.localeCompare(b.name));
    const cnt = {};
    this.jm = rows.map((x, i) => { cnt[x.r] = (cnt[x.r] ?? -1) + 1; const w = x.name.split(/\s+/);
      return { id: i, idx: cnt[x.r], r: x.r, g: x.g, role: x.role, name: x.name, ini: ((w[0] || '')[0] || '') + ((w[1] || '')[0] || ''), porsi: x.porsi, hp: x.hp, risti: x.risti, sex: x.sex }; });
    this.byP = {}; this.jm.forEach(j => { this.byP[j.porsi] = j.id; });
    { const sj = this.parseJadwal(snap.jadwal), kf = x => x.tgl + '|' + x.jam + '|' + x.sex, have = new Set(sj.map(kf)), loc = this.localJadwal();
      localStorage.setItem('mk.jadwalx', JSON.stringify(loc.filter(r => { const p = this.parseJadwal([r])[0]; return p && !have.has(kf(p)); })));
      const pend = this.parseJadwal(loc).filter(x => !have.has(kf(x))).map((x, i) => ({ ...x, id: sj.length + i })); this.jadwal = sj.concat(pend); }
    this.petugas = (snap.petugas || []).filter(p => p['Nama']).map((p, i) => ({ key: 'p' + i, name: String(p['Nama']), role: String(p['Jabatan'] || 'Petugas') }));
    this.applyJadwal(snap.jadwalKegiatan);
    const st = this.normSt(snap.status || {}), done = {}, badal = {}, notes = {}, tg = {}, ex = {};
    rows.forEach((x, i) => { if (x.note) notes[i] = x.note; });
    Object.keys(this.data).forEach(m => { badal[m] = {}; done[m] = this.data[m].rites.map((r, k) => this.jm.map(j => { const s = st[j.porsi + '|' + r.n];
      if (s && s.status === 'Selesai') tg[m + '|' + k + '|' + j.id] = { t: String(s.tanggal || '').slice(0, 10), s: s.susulan === true || s.susulan === 'Ya', j: String(s.jam || '').slice(0, 5) };
      if (s && (s.pilihan || s.alasan || s.pendamping || s.ulangKe || s.statusUlang)) ex[m + '|' + k + '|' + j.id] = { pil: s.pilihan || '', alasan: s.alasan || '', pend: s.pendamping ? this.pelKey(s.pendamping) : '', ulangKe: Number(s.ulangKe) || 0, stUlang: s.statusUlang || '' };
      if (s && s.pelaksana) { const key = this.pelKey(s.pelaksana); if (key) (badal[m][k] = badal[m][k] || {})[j.id] = key; }
      return !!s && s.status === 'Selesai'; })); });
    const kh = {}; rows.forEach((x, i) => { if (x.lansia || x.kroda || x.pend || x.pb || x.pelb) kh[i] = { lansia: x.lansia, kroda: x.kroda, pend: x.pend, pb: x.pb, pelb: x.pelb }; });
    const mq = {}; rows.forEach((x, i) => { if (x.mq) mq[i] = x.mq; });
    const S = { udz: rows.map(x => x.udz), mq, notes, done, badal, tg, ex, kh };
    this.queue.forEach(it => { if (it.jenis === 'centang') { const sv = st[it.porsi + '|' + this.legacy(it.kegiatan)]; if (sv && Date.parse(sv.waktu) > Date.parse(it.waktu)) return; } this.applyItem(S, it); });
    this.setState(s => ({ ...S, sel: s.sel != null && s.sel < this.jm.length ? s.sel : null }));
  }
  applyJadwal(rows) {
    Object.keys(this.data).forEach(m => this.data[m].rites.forEach(r => { if (!r._o) r._o = { day: r.day, place: r.place }; r.day = r._o.day; r.place = r._o.place; }));
    (rows || []).forEach(x => { const X = this.data[String(x['Mode'] || '').trim().toLowerCase()]; if (!X) return; const r = X.rites.find(r => r.n === this.legacy(String(x['Kegiatan'] || '').trim())); if (!r) return;
      const h = String(x['Hari'] || '').trim(), t = String(x['Tempat'] || '').trim(); if (h) r.day = h; if (t) r.place = t;
      r.tgl = /^\d{4}-\d{2}-\d{2}$/.test(String(x['Tanggal'] || '').trim()) ? String(x['Tanggal']).trim() : '';
      r.jam = /^\d{1,2}[:.]\d{2}/.test(String(x['Jam'] || '')) ? String(x['Jam']).slice(0, 5).replace('.', ':') : ''; });
    // Tanggal yang diubah di HP ini tetapi belum terkirim (atau mode contoh) menimpa data server
    const lokal = this.live() ? this.queue.filter(q => q.jenis === 'tanggal') : Object.entries(this.tglDemo()).map(([k, v]) => { const [mode, kegiatan] = k.split('|'); return { mode, kegiatan, tanggal: v }; });
    lokal.forEach(q => { const X = this.data[String(q.mode).toLowerCase()], r = X && X.rites.find(r => r.n === q.kegiatan); if (r) { r.tgl = q.tanggal || ''; if (q.jam !== undefined) r.jam = q.jam; } });
    // Label hari Hijriyah yang diketik di HP ini (belum terkirim / mode contoh)
    const hariL = this.live() ? this.queue.filter(q => q.jenis === 'hari') : Object.entries(this.hariDemo()).map(([k, v]) => { const [mode, kegiatan] = k.split('|'); return { mode, kegiatan, hari: v }; });
    hariL.forEach(q => { const X = this.data[String(q.mode).toLowerCase()], r = X && X.rites.find(r => r.n === q.kegiatan); if (r && q.hari) r.day = q.hari; });
    // Miqat kloter: tempat di Jadwal Kegiatan (atau yang belum terkirim), bila kosong diusulkan dari gelombang
    const mqR = this.data.umrah.rites.find(r => r.miqat);
    if (mqR) { const qT = this.live() ? this.queue.filter(q => q.jenis === 'tempat' && q.kegiatan === mqR.n).pop() : null, dT = !this.live() ? localStorage.getItem('mk.miqatdemo') : null;
      if (qT) mqR.place = qT.tempat; else if (dT != null) mqR.place = dT;
      mqR.placeAuto = !mqR.place; if (!mqR.place) mqR.place = miqatBawaan(this.cfg && this.cfg.gelombang); }
    this.data.umrah.rites.forEach(r => { if (r.miqat) r.p = r.place ? 'Miqat ' + r.place : 'Miqat (belum ditentukan)'; });
  }
  fmtTgl(t) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t || ''); return m ? +m[3] + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][+m[2] - 1] : ''; }
  susN(m, k, D) { const S = this.state; return this.jm.filter(j => D[k][j.id] && (S.tg[m + '|' + k + '|' + j.id] || {}).s).length; }
  curOf(m) { const n = this.cfg && this.cfg.curN && this.cfg.curN[m], k = n ? this.data[m].rites.findIndex(r => r.n === n) : -1; return k >= 0 ? k : this.data[m].cur; }
  legacy(n) { n = String(n || '').trim(); const L = { 'Ihram umrah': 'Ihram Umrah', 'Ihram di miqat': 'Ihram Umrah', 'Tawaf': 'Thawaf Umrah', "Sa'i": "Sa'i Umrah", 'Tahallul': 'Tahallul Umrah', 'Ihram': 'Ihram Haji', 'Muzdalifah Murur': 'Murur', 'Muzdalifah Murur Mabit': 'Murur Mabit', 'Jumrah Aqabah': 'Jumroh Aqobah', 'Badal Jumrah Aqabah': 'Badal Jumroh Aqobah', 'Tahallul Awwal': 'Tahallul Awwal Haji', 'Ifadzoh': 'Thawaf Ifadzoh', "Wada'": "Thawaf Wada'" };
    if (L[n]) return L[n]; let m; if ((m = /^Mabit Mina (\d+) Dzulhijjah$/.exec(n))) return 'Mabit di Mina Malam ' + m[1]; if ((m = /^Badal Jumrah Tanggal (\d+)$/.exec(n))) return 'Badal Jumroh ' + m[1] + ' Dzh';
    if (/^Jumrah /.test(n)) return n.replace('Jumrah', 'Jumroh').replace('Aqabah', 'Aqobah'); return n; }
  normSt(st) { const o = {}; Object.entries(st || {}).forEach(([key, v]) => { const i = key.indexOf('|'), n = this.legacy(key.slice(i + 1)), k2 = key.slice(0, i) + '|' + n; if (!o[k2] || Date.parse(v.waktu) >= Date.parse(o[k2].waktu)) o[k2] = { ...v, kegiatan: n }; }); return o; }
  meta(m) { this._meta = this._meta || {}; if (this._meta[m]) return this._meta[m];
    const R = this.data[m].rites, M = { slotOf: [], slots: {}, cov: {}, req: [], firstK: {} };
    R.forEach((r, k) => { const g = r.g || r.n; M.slotOf[k] = g; (M.slots[g] = M.slots[g] || []).push(k); if (M.firstK[g] == null) { M.firstK[g] = k; if (!r.opt) M.req.push(g); } (r.covers || []).forEach(c => (M.cov[c] = M.cov[c] || []).push(k)); });
    return (this._meta[m] = M); }
  nafarA(m, j, D) { if (m !== 'haji') return false; if (this._naK == null) this._naK = this.data.haji.rites.findIndex(r => r.nafarAwwal); return !!(D || this.state.done.haji)[this._naK][j.id]; }
  naLock(m, k, j, D) { return !!(this.data[m].rites[k].d13 && this.nafarA(m, j, m === 'haji' ? D : null)); }
  skip(m, k, j, D) { const r = this.data[m].rites[k]; return this.naLock(m, k, j, D) || !!(r.miqat && !r.place); }
  satBy(m, g, j, D) { const M = this.meta(m); for (const k of M.slots[g] || []) if (D[k][j.id]) return k; for (const k of M.cov[g] || []) if (D[k][j.id]) return k; return -1; }
  sat(m, k, j, D) { const r = this.data[m].rites[k]; if (r.opt) return !!D[k][j.id]; return this.satBy(m, this.meta(m).slotOf[k], j, D) >= 0; }
  tgt(m, k, j, D) { const S = this.state, r = this.data[m].rites[k]; if (this.skip(m, k, j, D)) return false; return r.opt ? !!(S.udz[j.id] || D[k][j.id]) : !S.udz[j.id]; }
  badalCand(k, list) { const S = this.state, m = S.mode, D = S.done[m], r = this.data[m].rites[k], M = this.meta(m);
    return (list || this.scopeList(S.ck)).filter(j => !this.naLock(m, k, j, D) && !D[k][j.id] && (r.opt ? !(r.covers || []).every(g => (M.slots[g] || []).some(x => D[x][j.id])) : !this.sat(m, k, j, D)))
      .sort((a, b) => (S.udz[b.id] ? 1 : 0) - (S.udz[a.id] ? 1 : 0)); }
  // Susulan otomatis: dilaksanakan SETELAH tanggal jadwal. Tanpa tanggal jadwal, pakai penanda lama (sus).
  autoSus(r, tgl, sus, x) { if (r && r.tgl && tgl && !(x && x.ulangKe)) return tgl > r.tgl; return !!sus; }
  // Centang ini terlambat dari jadwal? Bila tanggal jadwal belum diisi, pakai urutan kegiatan berlangsung.
  telat(m, kk) { const r = this.data[m].rites[kk]; return r.tgl ? this.defTgl(r) > r.tgl : kk < this.data[m].cur; }
  tglDemo() { try { return JSON.parse(localStorage.getItem('mk.tgldemo')) || {}; } catch (e) { return {}; } }
  modeLabel(m) { return { haji: 'Haji', umrah: 'Umrah', madinah: 'Madinah' }[m] || m; }
  // Atur tanggal jadwal untuk sekelompok kegiatan (satu hari). Ikut antrean offline.
  // Jam kegiatan (WAS) untuk sekelompok kegiatan; dikirim bersama tanggalnya
  setJamJadwal(m, names, jam) {
    const X = this.data[m], items = [];
    names.forEach(nm => { const r = X.rites.find(x => x.n === nm); if (!r) return; r.jam = jam;
      if (!this.live()) return;
      const ex = this.queue.find(q => q.jenis === 'tanggal' && q.mode === this.modeLabel(m) && q.kegiatan === nm && !this._inflight.has(q));
      if (ex) { ex.jam = jam; ex.tanggal = r.tgl || ''; ex.waktu = new Date().toISOString(); } else items.push({ jenis: 'tanggal', mode: this.modeLabel(m), kegiatan: nm, tanggal: r.tgl || '', jam }); });
    if (this.live()) { this.saveQueue(); this.push(items); }
    this.forceUpdate();
  }
  setTglJadwal(m, names, tgl) {
    const X = this.data[m], items = [], demo = this.tglDemo();
    names.forEach(n => { const r = X.rites.find(r => r.n === n); if (!r) return; r.tgl = tgl;
      if (this.live()) { const ex = this.queue.find(q => q.jenis === 'tanggal' && q.mode === this.modeLabel(m) && q.kegiatan === n && !this._inflight.has(q));
        if (ex) { ex.tanggal = tgl; ex.waktu = new Date().toISOString(); } else items.push({ jenis: 'tanggal', mode: this.modeLabel(m), kegiatan: n, tanggal: tgl, ...(r.jam ? { jam: r.jam } : {}) }); }
      else demo[this.modeLabel(m) + '|' + n] = tgl; });
    if (this.live()) { this.saveQueue(); this.push(items); } else try { localStorage.setItem('mk.tgldemo', JSON.stringify(demo)); } catch (e) {}
    this.forceUpdate();
  }
  /* Foto kegiatan */
  fotoInput = React.createRef();
  fotoList = [];
  _thumbs = {};
  async refreshFoto() {
    try { this.fotoList = await semuaFoto(); } catch (e) { this.fotoList = []; }
    const ada = new Set(this.fotoList.map(f => f.id));
    Object.keys(this._thumbs).forEach(id => { if (!ada.has(id)) { URL.revokeObjectURL(this._thumbs[id]); delete this._thumbs[id]; } });
    this.fotoList.forEach(f => { if (!this._thumbs[f.id] && f.kecil) this._thumbs[f.id] = URL.createObjectURL(f.kecil); });
    this.forceUpdate();
  }
  async pilihFoto(e) {
    const file = e.target.files && e.target.files[0]; e.target.value = '';
    if (!file) return;
    try {
      const { penuh, kecil } = await kompres(file), S = this.state, X = this.data[S.mode];
      this.setState({ fotoDlg: { penuh, kecil, prev: URL.createObjectURL(kecil), kb: Math.round(penuh.size / 1024), rite: X.cur, scope: 'kloter', r: 1, g: 1, ket: '' } });
    } catch (err) { this.flash('Foto tidak bisa dibaca: ' + (err.message || err)); }
  }
  async simpanFotoDlg() {
    const d = this.state.fotoDlg, S = this.state, X = this.data[S.mode], r = X.rites[d.rite];
    const cakupan = d.scope === 'kloter' ? 'Seluruh kloter' : d.scope === 'rombongan' ? 'Rombongan ' + d.r : 'Rombongan ' + d.r + ' · Regu ' + d.g;
    const f = { id: String((this.cfg && this.cfg.device) || 'hp').replace(/[^\w-]/g, '') + '-foto-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      waktu: new Date().toISOString(), tanggal: this.todayKey(), mode: X.label, kegiatan: r.n, cakupan, keterangan: String(d.ket || '').trim().slice(0, 200),
      petugas: this.ppih(), kloter: this.klLabel(), penuh: d.penuh, kecil: d.kecil, status: this.live() ? 'antre' : 'lokal' };
    try { await simpanFoto(f); } catch (e) { this.flash('Gagal menyimpan foto di HP: ' + (e.message || e)); return; }
    URL.revokeObjectURL(d.prev); this.setState({ fotoDlg: null });
    await this.refreshFoto();
    this.flash(this.live() ? (navigator.onLine ? 'Foto disimpan · mengunggah…' : 'Foto disimpan di HP · diunggah saat ada internet') : 'Mode contoh · foto hanya disimpan di HP ini');
    this.unggahAntre();
  }
  // Unggah foto antre satu per satu. Berhenti di kegagalan pertama; dicoba lagi saat sinkron berikutnya.
  async unggahAntre() {
    if (!this.live() || !navigator.onLine || this._fotoBusy) return;
    this._fotoBusy = true; this.setState({ fotoErr: '' });
    try {
      // Foto kejadian menunggu kejadiannya terkirim lebih dulu
      const tunggu = new Set(this.queue.filter(q => q.jenis === 'kejadian').map(q => q.kid));
      for (const f of this.fotoList.filter(x => x.status === 'antre' && !tunggu.has(x.kejadian)).reverse()) {
        const { penuh, kecil, ...meta } = f;
        const out = await unggahFoto(this.cfg.url, this.cfg.key, meta, await keBase64(penuh));
        await simpanFoto({ ...f, penuh: null, status: 'terkirim', link: out.url || '', terkirim: new Date().toISOString() });
        await this.refreshFoto();
      }
    } catch (e) { this.setState({ fotoErr: e.message || String(e) }); }
    this._fotoBusy = false; this.forceUpdate();
  }
  async buangFoto(f) {
    if (f.status === 'antre' && !window.confirm('Foto ini belum terunggah. Hapus dari HP?')) return;
    await hapusFoto(f.id); await this.refreshFoto(); this.flash(f.status === 'terkirim' ? 'Dihapus dari HP · tetap ada di ' + this.tempatFoto() : 'Foto dihapus');
  }
  // Catatan kejadian: data dari server ditimpa antrean yang belum terkirim (mode contoh: hanya di memori)
  daftarKejadian() {
    const m = new Map((this._kej || []).map(k => [k.kid, k]));
    [...(this._kejDemo || []), ...this.queue.filter(q => q.jenis === 'kejadian')].forEach(q => {
      if (q.hapus) m.delete(q.kid); else m.set(q.kid, { ...dariKejadian(q), foto: (m.get(q.kid) || {}).foto || [], belum: this.live() });
    });
    return [...m.values()].sort((a, b) => Date.parse(b.waktuKejadian) - Date.parse(a.waktuKejadian));
  }
  async simpanKejadian(rec, berkas) {
    const it = { jenis: 'kejadian', ...dariKejadian(rec), petugas: rec.petugas || this.ppih(), diubah: new Date().toISOString() };
    if (this.live()) this.push([it]); else this._kejDemo = (this._kejDemo || []).filter(x => x.kid !== it.kid).concat(it);
    const nama = it.porsi.map(p => (this.jm.find(x => x.porsi === p) || {}).name).filter(Boolean).join(', ');
    for (const file of berkas || []) {
      try {
        const { penuh, kecil } = await kompres(file);
        await simpanFoto({ id: String((this.cfg && this.cfg.device) || 'hp').replace(/[^\w-]/g, '') + '-foto-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          waktu: new Date().toISOString(), tanggal: this.todayKey(), mode: 'Kejadian', kegiatan: 'Kejadian · ' + labelKejadian(it.kategori), cakupan: nama, keterangan: it.lokasi.slice(0, 200),
          petugas: it.petugas, kloter: this.klLabel(), penuh, kecil, status: this.live() ? 'antre' : 'lokal', kejadian: it.kid });
      } catch (e) { this.flash('Foto tidak bisa disimpan: ' + (e.message || e)); }
    }
    if ((berkas || []).length) await this.refreshFoto();
    this.setState({ kejForm: null });
    this.flash(!this.live() ? 'Mode contoh · catatan hanya ada sementara di HP ini' : navigator.onLine ? 'Catatan kejadian disimpan' : 'Catatan disimpan di HP · dikirim saat ada internet');
  }
  async hapusKejadian(kid) {
    if (!window.confirm('Hapus catatan kejadian ini? Foto yang sudah terunggah tetap ada di galeri.')) return;
    const it = { jenis: 'kejadian', kid, hapus: true, diubah: new Date().toISOString() };
    if (this.live()) this.push([it]); else this._kejDemo = (this._kejDemo || []).filter(x => x.kid !== kid).concat(it);
    for (const f of this.fotoList.filter(f => f.kejadian === kid && f.status !== 'terkirim')) await hapusFoto(f.id);
    await this.refreshFoto();
    this.setState({ kejForm: null }); this.flash('Catatan kejadian dihapus');
  }
  kejBaru(porsi = []) { const now = new Date(), was = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000);
    return { kid: uuid(), kategori: 'sakit', tgl: this.todayKey(), jam: String(was.getHours()).padStart(2, '0') + ':' + String(was.getMinutes()).padStart(2, '0'),
      lokasi: '', kronologi: '', tindakLanjut: '', status: 'terbuka', porsi, foto: [], berkas: [], baru: true }; }
  kejadianVals() {
    const S = this.state, F = S.kejForm, sheet = this.live() && !this.pakaiAkun();
    const nama = p => { const j = this.jm.find(x => x.porsi === p); return j ? j.name : 'Porsi ' + p; };
    const fotoDari = k => { const lokal = this.fotoList.filter(f => f.kejadian === k.kid), ada = new Set(lokal.map(f => f.id));
      return lokal.map(f => ({ id: f.id, src: this._thumbs[f.id] || '', link: f.link || '', antre: f.status === 'antre' }))
        .concat((k.foto || []).filter(f => !ada.has(f.id)).map(f => ({ id: f.id, src: '', link: 'supabase:' + f.path }))); };
    const list = sheet ? [] : this.daftarKejadian().map(k => ({ ...k, nama: k.porsi.map(nama), foto: fotoDari(k) }));
    const now = new Date(), was = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000);
    return {
      sheet, contoh: !this.live(), list, jenis: JENIS_KEJADIAN,
      jamaah: this.jm.map(j => ({ porsi: j.porsi, name: j.name, r: j.r, g: j.g })),
      form: F || null,
      baru: () => this.setState({ kejForm: this.kejBaru() }),
      buka: k => { const w = new Date(new Date(k.waktuKejadian).getTime() + 3 * 3600000).toISOString();
        this.setState({ kejForm: { ...k, tgl: w.slice(0, 10), jam: w.slice(11, 16), berkas: [], baru: false } }); },
      ubah: x => this.setState(s => ({ kejForm: { ...s.kejForm, ...x } })),
      batal: () => this.setState({ kejForm: null }),
      simpan: () => { const f = this.state.kejForm; this.simpanKejadian({ ...f, waktuKejadian: f.tgl + 'T' + (f.jam || '00:00') + ':00+03:00' }, f.berkas.map(b => b.file)); },
      hapus: kid => this.hapusKejadian(kid),
      bukaFoto: (e, link) => this.bukaFoto(e, link)
    };
  }
  miqatKloter() { const r = this.data.umrah.rites.find(r => r.miqat); return (r && r.place) || ''; }
  miqatOf(j) { return (this.state.mq || {})[j.id] || this.miqatKloter(); }
  // Atur miqat. scope 'kloter': jadi miqat kloter dan semua pengecualian per jamaah dihapus.
  // 'rombongan' / 'regu' / 'jamaah': disimpan per jamaah ('' = ikut miqat kloter).
  setMiqat(scope, val, { r, g, id } = {}) {
    val = String(val || '').trim().slice(0, 60);
    const S = this.state, mq = { ...(S.mq || {}) }, items = [];
    const setJ = (j, v) => { const lama = mq[j.id] || ''; if (lama === v) return; if (v) mq[j.id] = v; else delete mq[j.id]; items.push({ jenis: 'jamaah', porsi: j.porsi, miqat: v }); };
    if (scope === 'kloter') {
      if (!val) { this.flash('Pilih atau ketik miqat dulu'); return; }
      const mR = this.data.umrah.rites.find(x => x.miqat);
      if (this.live()) { const ex = this.queue.find(q => q.jenis === 'tempat' && q.kegiatan === mR.n && !this._inflight.has(q));
        if (ex) { ex.tempat = val; ex.waktu = new Date().toISOString(); this.saveQueue(); } else items.push({ jenis: 'tempat', mode: 'Umrah', kegiatan: mR.n, tempat: val }); }
      else try { localStorage.setItem('mk.miqatdemo', val); } catch (e) {}
      this.jm.forEach(j => setJ(j, ''));
    } else {
      const list = scope === 'jamaah' ? [this.jm[id]] : this.mem(r, scope === 'regu' ? g : undefined);
      list.forEach(j => setJ(j, val === this.miqatKloter() && scope === 'jamaah' ? '' : val));
    }
    if (this.live()) this.push(items);
    this.setState({ mq, mqDlg: null });
    if (scope === 'kloter') this.applyJadwal(this.live() ? (this.readSnap() || {}).jadwalKegiatan : []);
    const n = items.filter(i => i.jenis === 'jamaah').length;
    this.flash(scope === 'kloter' ? 'Miqat kloter: ' + val : (val || 'Ikut miqat kloter') + ' · ' + (scope === 'jamaah' ? this.jm[id].name : n + ' jamaah diubah'));
  }
  hariDemo() { try { return JSON.parse(localStorage.getItem('mk.haridemo')) || {}; } catch (e) { return {}; } }
  // Ganti label hari Hijriyah (diketik bebas) untuk sekelompok kegiatan. Ikut antrean offline -> kolom Hari di Jadwal Kegiatan.
  setHariJadwal(m, names, hari) {
    hari = String(hari || '').trim().slice(0, 40); if (!hari) { this.flash('Label hari tidak boleh kosong'); return; }
    const X = this.data[m], items = [], demo = this.hariDemo();
    names.forEach(n => { const r = X.rites.find(r => r.n === n); if (!r) return; r.day = hari;
      if (this.live()) { const ex = this.queue.find(q => q.jenis === 'hari' && q.mode === this.modeLabel(m) && q.kegiatan === n && !this._inflight.has(q));
        if (ex) { ex.hari = hari; ex.waktu = new Date().toISOString(); } else items.push({ jenis: 'hari', mode: this.modeLabel(m), kegiatan: n, hari }); }
      else demo[this.modeLabel(m) + '|' + n] = hari; });
    if (this.live()) { this.saveQueue(); this.push(items); } else try { localStorage.setItem('mk.haridemo', JSON.stringify(demo)); } catch (e) {}
    this.flash('Label hari diubah · ' + hari); this.forceUpdate();
  }
  // Ubah tanggal pelaksanaan satu jamaah untuk kegiatan yang sudah dicentang; Susulan dihitung ulang.
  ubahTglJamaah(id, k, tgl) {
    const S = this.state, m = S.mode, key = m + '|' + k + '|' + id, today = this.todayKey();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl || '')) { this.flash('Pilih tanggal dulu'); return; }
    if (tgl > today) { this.flash('Tanggal pelaksanaan tidak boleh setelah hari ini'); return; }
    const ex = S.ex[key] || {};
    this.commit([id], true, k, tgl, (S.tg[key] || {}).s, ex.ulangKe ? ex : { ...ex });
    const r = this.data[m].rites[k]; this.setState({ tgJ: null });
    this.flash('Tanggal ' + r.p + ' · ' + this.fmtTgl(tgl) + (this.autoSus(r, tgl, (S.tg[key] || {}).s, ex) ? ' · Susulan' : ' · tepat waktu'));
  }
  fmtHari(t) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t || ''); if (!m) return ''; try { return new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))); } catch (e) { return this.fmtTgl(t); } }
  defTgl(r) { const t = this.todayKey(); if (r && r.malam && this.wasHour() < 12) { const d = new Date(t + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10); } return t; }
  fmtH(t) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t || ''); if (!m) return ''; try { const p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])));
      const d = +(p.find(x => x.type === 'day') || {}).value, mo = +(p.find(x => x.type === 'month') || {}).value; if (!d || !mo) throw 0;
      return d + ' ' + ['Muh', 'Saf', 'Rab I', 'Rab II', 'Jum I', 'Jum II', 'Raj', "Sya'", 'Ram', 'Syaw', 'Dzq', 'Dzh'][mo - 1]; } catch (e) { return this.fmtTgl(t); } }
  badalTxt(j, k) { const S = this.state, r = this.data.haji.rites[k], key = ((S.badal.haji || {})[k] || {})[j.id], d = (/(\d+) Dzh/.exec(r.n) || /(\d+) Dzulhijjah/.exec(r.day) || [])[1] || '10';
    const what = r.covers ? 'Jumroh Ula, Wustho, dan Aqobah ' + d + ' Dzh' : 'Jumroh Aqobah ' + d + ' Dzh';
    return `${j.name} (R${j.r}/Regu ${j.g}) badal lempar ${what} oleh pelaksana badal ` + (key ? this.pelText(key) : '(pelaksana belum dicatat)'); }
  pelKey(txt) { txt = String(txt || '').trim(); if (!txt) return null; let m = /\(([^)]+)\)\s*$/.exec(txt); if (m && this.byP[m[1]] != null) return 'j' + this.byP[m[1]];
    const nm = txt.replace(/\s*\([^)]*\)\s*$/, ''); m = /\(Jamaah R(\d+)\)\s*$/.exec(txt);
    if (m) { const j = this.jm.find(j => j.name === nm && j.r === +m[1]); if (j) return 'j' + j.id; }
    const p = this.petugas.find(p => p.name === nm || p.name === txt); if (p) return p.key; return 'x:' + nm; }
  pelText(key) { if (!key) return ''; if (key.slice(0, 2) === 'x:') return key.slice(2); if (key[0] === 'p') return this.pelName(key) + ' (Petugas)'; const j = this.jm[+key.slice(1)]; return j ? j.name + ' (Jamaah R' + j.r + ')' : ''; }
  khOf(id) { return (this.state.kh || {})[id] || {}; }
  isKh(j) { const k = this.khOf(j.id); return !!(j.risti || k.lansia || k.kroda); }
  pendKey(id) { const p = this.khOf(id).pend; if (!p) return null; const m = /\(([^)]+)\)\s*$/.exec(p); if (m) { const j = this.jm.find(x => x.porsi === m[1]); if (j) return 'j' + j.id; } return this.pelKey(p); }
  pendDesc(id) { const k = this.pendKey(id); if (!k) return ''; if (k[0] === 'j') { const p = this.jm[+k.slice(1)]; return p ? p.name + ' · R' + p.r + '·' + p.g : ''; } return this.pelName(k); }
  needBadal(j) { return !!(this.state.udz[j.id] || this.khOf(j.id).pb); }
  pelbKey(id) { const t = this.khOf(id).pelb; return t ? this.pelKey(t) : null; }
  storeKey(key) { if (!key) return ''; if (key[0] === 'j') { const j = this.jm[+key.slice(1)]; return j ? j.name + ' (' + j.porsi + ')' : ''; } return this.pelText(key); }
  setKh(id, patch) { const j = this.jm[id]; if (!j) return; this.setState(s => ({ kh: { ...(s.kh || {}), [id]: { ...((s.kh || {})[id] || {}), ...patch } } }));
    const it = { jenis: 'jamaah', porsi: j.porsi }; if (patch.lansia !== undefined) it.lansia = patch.lansia; if (patch.kroda !== undefined) it.kursiRoda = patch.kroda; if (patch.pend !== undefined) it.pendamping = patch.pend || ''; if (patch.pb !== undefined) it.perluBadal = patch.pb; if (patch.pelb !== undefined) it.pelaksanaBadal = patch.pelb || '';
    this.push([it]); }
  badalRites() { const H = this.data.haji.rites; return H.map((r, k) => r.badal ? { k, d: +((/(\d+) Dzh/.exec(r.n) || /(\d+) Dzulhijjah/.exec(r.day) || [])[1] || 10) } : null).filter(Boolean); }
  pelOfB(j, k) { const f = this.pelbKey(j.id); if (f) return f; const mm = this.state.badal.haji || {}; if (k != null && (mm[k] || {})[j.id]) return mm[k][j.id]; for (const b of this.badalRites()) if ((mm[b.k] || {})[j.id]) return mm[b.k][j.id]; return null; }
  badalCommit(k, js) { const S = this.state; if (S.mode !== 'haji') { this.flash('Pindah ke mode Haji dulu'); return 0; } const by = {}; js.forEach(j => { const p = this.pelOfB(j, k); if (p) (by[p] = by[p] || []).push(j.id); }); let n = 0;
    Object.keys(by).forEach(p => { const ids = by[p]; n += ids.length; this.setState(s => { const b = { ...s.badal }, mm = { ...b.haji }, map = { ...(mm[k] || {}) }; ids.forEach(id => map[id] = p); mm[k] = map; b.haji = mm; return { badal: b }; }); this.commit(ids, true, k, undefined, k < this.data.haji.cur, { pel: p, pil: 'Badal' }); });
    return n; }
  badalToggle(j, k) { const S = this.state; if (S.mode !== 'haji') { this.flash('Pindah ke mode Haji dulu'); return; } if (this.naLock('haji', k, j, S.done.haji)) { this.flash('Nafar Awwal · hari 13 tidak wajib'); return; }
    if (S.done.haji[k][j.id]) { this.commit([j.id], false, k); this.flash('Badal ' + j.name.split(' ')[0] + ' dibatalkan'); return; }
    if (!this.pelOfB(j, k)) { this.setState({ pp: { kind: 'pelb', id: j.id, q: '', sel: null, src: 'jamaah' } }); return; }
    this.badalCommit(k, [j]); this.flash('Badal ' + j.name.split(' ')[0] + ' oleh ' + this.pelName(this.pelOfB(j, k))); }
  savePp() { const P = this.state.pp; if (!P || !P.sel) return; const tj = P.id != null ? this.jm[P.id] : null;
    if (P.kind === 'pend') { this.setKh(P.id, { pend: this.storeKey(P.sel) }); this.flash('Pendamping ' + tj.name.split(' ')[0] + ': ' + this.pelName(P.sel)); }
    else if (P.kind === 'pelb') { this.setKh(P.id, { pelb: this.pelText(P.sel) }); this.flash('Pelaksana badal ' + tj.name.split(' ')[0] + ': ' + this.pelName(P.sel)); }
    else if (P.kind === 'addb') { const id = +P.sel.slice(1); this.setKh(id, { pb: true }); this.flash(this.jm[id].name.split(' ')[0] + ' masuk daftar badal'); }
    this.setState({ pp: null }); }
  delPp() { const P = this.state.pp; if (!P || P.id == null) return; if (P.kind === 'pend') this.setKh(P.id, { pend: '' }); if (P.kind === 'pelb') this.setKh(P.id, { pelb: '' }); this.setState({ pp: null }); }
  applyItem(S, it) {
    const id = this.byP[it.porsi]; if (id == null) return;
    if (it.jenis === 'udzur') { S.udz[id] = !!it.udzur; return; }
    if (it.jenis === 'jamaah') { if (it.udzur !== undefined) S.udz[id] = it.udzur; if (it.miqat !== undefined) { S.mq = S.mq || {}; if (it.miqat) S.mq[id] = it.miqat; else delete S.mq[id]; } if (it.catatan !== undefined) S.notes[id] = it.catatan;
      if (['lansia', 'kursiRoda', 'pendamping', 'perluBadal', 'pelaksanaBadal'].some(f => it[f] !== undefined)) { S.kh = S.kh || {}; const o = { ...(S.kh[id] || {}) }; if (it.lansia !== undefined) o.lansia = it.lansia; if (it.kursiRoda !== undefined) o.kroda = it.kursiRoda; if (it.pendamping !== undefined) o.pend = it.pendamping; if (it.perluBadal !== undefined) o.pb = it.perluBadal; if (it.pelaksanaBadal !== undefined) o.pelb = it.pelaksanaBadal; S.kh[id] = o; } return; }
    Object.keys(this.data).forEach(m => { const k = this.data[m].rites.findIndex(r => r.n === this.legacy(it.kegiatan)); if (k < 0) return;
      S.done[m][k][id] = it.status === 'Selesai'; { const tk = m + '|' + k + '|' + id; if (it.status === 'Selesai') S.tg[tk] = { t: it.tanggal || '', s: it.susulan === 'Ya', j: it.jam || '' }; else delete S.tg[tk]; if (it.pilihan || it.alasan || it.pendamping || it.ulangKe || it.statusUlang) S.ex[tk] = { pil: it.pilihan || '', alasan: it.alasan || '', pend: it.pendamping ? this.pelKey(it.pendamping) : '', ulangKe: Number(it.ulangKe) || 0, stUlang: it.statusUlang || '' }; else delete S.ex[tk]; } if (it.pelaksana) { const key = this.pelKey(it.pelaksana); if (key) (S.badal[m][k] = S.badal[m][k] || {})[id] = key; } });
  }
  push(items) {
    if (!this.live()) { this.bump(); return; }
    items.forEach(it => { if (!it.waktu) it.waktu = new Date().toISOString(); if (!it.petugas) it.petugas = this.ppih(); if (!it.id) it.id = String((this.cfg && this.cfg.device) || 'hp').replace(/[^\w-]/g, '').slice(0, 12) + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7); if (it.jenis === 'jamaah' || it.jenis === 'dataJamaah' || it.jenis === 'kejadian') { const ex = this.queue.find(q => q.jenis === it.jenis && (it.jenis === 'kejadian' ? q.kid === it.kid : q.porsi === it.porsi) && !this._inflight.has(q)); if (ex) { Object.assign(ex, it); return; } } this.queue.push(it); });
    this.saveQueue(); this.setState(s => ({ sync: { ...s.sync, pending: this.queue.length } }));
    clearTimeout(this._sy); this._sy = setTimeout(() => this.syncNow(true), 1500);
  }
  item(k, id, val, pel, tgl, sus, x) { const S = this.state, m = S.mode, r = this.data[m].rites[k], j = this.jm[id], X0 = x || {};
    const key = pel !== undefined ? pel : X0.pel !== undefined ? X0.pel : r.badal ? (S.badal[m][k] || {})[id] : null;
    const ent = S.tg[m + '|' + k + '|' + id], ee = x ? X0 : val ? (S.ex[m + '|' + k + '|' + id] || {}) : {}, tg = val ? (tgl || (ent && ent.t) || this.defTgl(r)) : '', sf = val ? (sus !== undefined ? sus : !!(ent && ent.s)) : false;
    const slotK = m === 'madinah' && S.ck.slot != null && this.jadwal[S.ck.slot] ? this.slotLabel(this.jadwal[S.ck.slot]) : '';
    return { jenis: 'centang', waktu: new Date().toISOString(), perangkat: (this.cfg && this.cfg.device) || '', porsi: j.porsi, nama: j.name, kegiatan: r.n, status: val ? 'Selesai' : 'Belum', tanggal: tg, jam: val ? this.hhmmWas() : '', susulan: sf ? 'Ya' : 'Tidak',
      pelaksana: val && key ? this.pelText(key) : '', keterangan: [this._ket || '', ee.rencana ? 'Rencana ulang ' + this.fmtTgl(ee.rencana) : '', slotK].filter(Boolean).join(' · '),
      pendamping: ee.pend ? this.pelText(ee.pend) : '', pilihan: val ? (r.miqat ? this.miqatOf(j) : (ee.pil || r.pil || '')) : '', alasan: ee.alasan || '', ulangKe: ee.ulangKe ? String(ee.ulangKe) : '', statusUlang: ee.stUlang || '' }; }
  mergeSnap(snap, items) { snap.status = snap.status || {};
    items.forEach(it => { if (it.jenis === 'centang') snap.status[it.porsi + '|' + it.kegiatan] = { waktu: it.waktu, kegiatan: it.kegiatan, status: it.status, pelaksana: it.pelaksana, tanggal: it.tanggal, jam: it.jam || '', susulan: it.susulan === 'Ya', pendamping: it.pendamping, pilihan: it.pilihan, alasan: it.alasan, ulangKe: it.ulangKe, statusUlang: it.statusUlang };
      else if (it.jenis === 'pengaturan') snap.pengaturan = { ...(snap.pengaturan || {}), ...it.nilai };
      else if (it.jenis === 'dataJamaah') { const r = (snap.jamaah || []).find(x => String(x['Nomor Porsi']) === it.porsi); if (r) Object.assign(r, keKolom(it)); }
      else if (it.jenis === 'kejadian') { const l = (snap.kejadian || []).filter(x => x.kid !== it.kid), lama = (snap.kejadian || []).find(x => x.kid === it.kid);
        snap.kejadian = it.hapus ? l : l.concat({ ...dariKejadian(it), foto: (lama && lama.foto) || [] }); }
      else if (it.jenis === 'hari') { const rows = snap.jadwalKegiatan = snap.jadwalKegiatan || [], r = rows.find(x => x['Mode'] === it.mode && this.legacy(x['Kegiatan']) === it.kegiatan);
        if (r) r['Hari'] = it.hari; else rows.push({ 'Mode': it.mode, 'Kegiatan': it.kegiatan, 'Hari': it.hari }); }
      else if (it.jenis === 'tanggal') { const rows = snap.jadwalKegiatan = snap.jadwalKegiatan || [], r = rows.find(x => x['Mode'] === it.mode && this.legacy(x['Kegiatan']) === it.kegiatan);
        if (r) { r['Tanggal'] = it.tanggal; if (it.jam !== undefined) r['Jam'] = it.jam; } else rows.push({ 'Mode': it.mode, 'Kegiatan': it.kegiatan, 'Tanggal': it.tanggal, 'Jam': it.jam || '' }); }
      else { if (it.jenis === 'udzur') (snap.riwayatUdzur = snap.riwayatUdzur || []).push({ 'Waktu': it.waktu, 'Nomor Porsi': it.porsi, 'Nama': it.nama, 'Status': it.udzur ? 'Udzur' : 'Tidak udzur', 'Alasan': it.alasan, 'Petugas': it.petugas, 'ID Kirim': it.id });
        const r = (snap.jamaah || []).find(x => String(x['Nomor Porsi']) === it.porsi); if (r) { if (it.miqat !== undefined) r['Miqat'] = it.miqat; if (it.udzur !== undefined) r['Udzur'] = it.udzur ? 'Ya' : 'Tidak'; if (it.catatan !== undefined) r['Catatan'] = it.catatan; } } }); }
  fetchAll(url, key, ping) { return ambilSemua(url, key, { ping }); }
  // Kirim seluruh antrean ke url (per 300 item). Item yang terkirim dihapus dari antrean.
  async flushQueue(url, key) {
    while (this.queue.length) {
      const sent = this.queue.slice(0, 300);
      sent.forEach(q => this._inflight.add(q));
      try { await kirimPerubahan(url, key, sent); }
      finally { sent.forEach(q => this._inflight.delete(q)); }
      this.queue = this.queue.filter(q => !sent.includes(q)); this.saveQueue();
      const snap = this.readSnap(); if (snap) { this.mergeSnap(snap, sent); simpanSnap(snap); }
      this.setState(s => ({ sync: { ...s.sync, pending: this.queue.length } }));
    }
  }
  async syncNow(quiet) {
    if (!this.live()) { if (!quiet) this.flash('Mode contoh · belum masuk akun kloter'); this.setState(s => ({ sync: { ...s.sync, pending: 0, last: this.hhmm(new Date()) } })); return; }
    // HP yang masih tercatat memakai Sheet menahan antreannya sampai pindah ke akun
    if (this._busy || !this.pakaiAkun()) return;
    if (!navigator.onLine) { this.setState(s => ({ sync: { ...s.sync, pending: this.queue.length, err: '' } })); if (!quiet) this.flash('Tidak ada sinyal · data aman di perangkat'); return; }
    this._busy = true; this.setState(s => ({ sync: { ...s.sync, busy: true } }));
    const { url, key } = this.cfg;
    try {
      await this.flushQueue(url, key);
      const data = await this.fetchAll(url, key);
      simpanSnap(data); this.build(data); this._lp = Date.now();
      this.setState(s => ({ sync: { ...s.sync, pending: this.queue.length, last: this.hhmm(new Date()), err: '', busy: false } }));
      if (!quiet) this.flash('Tersinkron dengan ' + this.namaServer());
      this.unggahAntre();
    } catch (e) {
      this.setState(s => ({ sync: { ...s.sync, pending: this.queue.length, err: 'Gagal sinkron: ' + (e.message || e), busy: false } }));
      if (!quiet) this.flash('Gagal sinkron · data tetap aman di perangkat');
    }
    this._busy = false;
    if (this.queue.length && !this.state.sync.err) this._sy = setTimeout(() => this.syncNow(true), 800);
  }
  async connect() {
    const su = this.state.su, url = SB_URL, key = 'akun';
    const err = !this.akunSb() ? 'Masuk dengan akun yang sudah disetujui admin dulu.' : !/^\d{4}$/.test(su.pin) ? 'PIN harus 4 angka' : '';
    if (err) { this.patch('su', { err }); return; }
    // Sudah memakai akun, hanya identitas/PIN berubah: simpan langsung, tidak perlu internet
    if (this.pakaiAkun()) {
      const kurang = kurangIdentitas(su); if (kurang.length) { this.patch('su', { err: pesanKurang(kurang) }); return; }
      const id = this.identitas(su), lama = this.cfg;
      this.saveCfg({ device: su.device, pin: su.pin, terbuka: true, ...id }); this.applyJadwal((this.readSnap() || {}).jadwalKegiatan);
      if (Object.keys(id).some(k => String(id[k]) !== String(lama[k] || ''))) this.pushPengaturan(kePengaturan(id));
      this.setState(s => ({ setup: false, su: { ...s.su, ...id, err: '', okMsg: '' } })); this.flash('Pengaturan disimpan'); return;
    }
    this.patch('su', { busy: true, err: '' });
    try {
      // HP yang pindah dari Sheet: antreannya tidak dibuang, terkirim ke akun setelah tersambung
      const data = await this.fetchAll(url, key);
      // HP baru: kolom identitas yang kosong diisi dari pengaturan kloter di server
      const dariServer = dariPengaturan(data.pengaturan), isi = { ...su };
      Object.keys(dariServer).forEach(k => { if (!String(isi[k] || '').trim() && dariServer[k]) isi[k] = dariServer[k]; });
      const kurang = kurangIdentitas(isi);
      if (kurang.length) { this.patch('su', { ...isi, busy: false, err: pesanKurang(kurang) }); return; }
      const id = this.identitas(isi);
      this.saveCfg({ url, key, device: su.device, pin: su.pin, demo: false, terbuka: true, ...id });
      if (Object.keys(id).some(k => String(id[k]) !== String(dariServer[k] || ''))) this.pushPengaturan(kePengaturan(id));
      simpanSnap(data); this.build(data);
      this.setState(s => ({ setup: false, locked: false, su: { ...s.su, ...id, busy: false }, sync: { pending: this.queue.length, last: this.hhmm(new Date()), err: '' }, tab: 'beranda' }));
      this.flash(this.jm.length ? this.jm.length + ' jamaah dibaca dari akun kloter' : 'Tersambung · data jamaah kloter belum ada');
      if (this.queue.length) this.syncNow(true);
    } catch (e) { this.patch('su', { busy: false, err: (e.message || e) }); }
  }
  todayKey() { return this.tz('Asia/Riyadh') && new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date()); }
  wasHour() { try { return Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(new Date())); } catch (e) { return new Date().getHours(); } }
  remindHour() { return (this.cfg && this.cfg.remindHour) || 21; }
  rekapDue() { return this.wasHour() >= this.remindHour() && (!this.cfg || this.cfg.lastRekap !== this.todayKey()); }
  checkReminder() {
    if (!this.rekapDue() || this._notif === this.todayKey()) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    this._notif = this.todayKey();
    const opt = { body: 'Saatnya merekap kegiatan hari ini dan mengirim ke grup WhatsApp.', icon: 'icon-192.png', tag: 'rekap' };
    if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(r => r.showNotification('Pengingat rekap harian', opt)).catch(() => {}); else try { new Notification('Pengingat rekap harian', opt); } catch (e) {}
  }
  waText() {
    const S = this.state, X = this.data[S.mode], D = S.done[S.mode], ci = X.cur, day = X.rites[ci].day;
    const ks = X.rites.map((r, k) => k).filter(k => X.rites[k].day === day), n = this.jm.length, udz = this.jm.filter(j => S.udz[j.id]);
    const tgt = k => this.jm.filter(j => this.tgt(S.mode, k, j, D)), pct = (a, b) => b ? Math.round(a / b * 100) : 0, L = [];
    const rombs = [...new Set(this.jm.map(j => j.r))].sort((a, b) => a - b);
    L.push('*REKAP HARIAN ' + this.klLabel().toUpperCase() + '*');
    L.push(day + ' · ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    L.push('Pukul ' + this.tz('Asia/Riyadh') + ' WAS / ' + this.tz('Asia/Jakarta') + ' WIB');
    L.push(''); L.push('Jamaah: ' + n + ' · Udzur: ' + udz.length + ' · Risti: ' + this.jm.filter(j => j.risti).length);
    L.push(''); L.push('*Kegiatan hari ini*');
    ks.forEach(k => { const t = tgt(k), d = t.filter(j => D[k][j.id]).length; L.push((d >= t.length && t.length ? '✅ ' : '⏳ ') + X.rites[k].n + ': ' + d + '/' + t.length + ' (' + pct(d, t.length) + '%)'); });
    { const sl = X.rites.map((r, k) => ({ r, n: this.susN(S.mode, k, D) })).filter(x => x.n); if (sl.length) { L.push(''); L.push('*Susulan*'); sl.forEach(x => L.push('- ' + x.r.n + ': ' + x.n + ' susulan')); } }
    L.push(''); L.push('*Per rombongan · ' + X.rites[ci].n + '*');
    rombs.forEach(r => { const l = this.mem(r).filter(j => this.tgt(S.mode, ci, j, D)), d = l.filter(j => this.sat(S.mode, ci, j, D)).length; L.push('R' + r + ' (' + this.ketuaR(r).name.split(' ')[0] + '): ' + d + '/' + l.length + (d === l.length && l.length ? ' ✅' : '')); });
    const belum = this.jm.filter(j => this.tgt(S.mode, ci, j, D) && !this.sat(S.mode, ci, j, D));
    if (belum.length) { L.push(''); L.push('*Belum ' + X.rites[ci].p + '* (' + belum.length + ')'); belum.slice(0, 20).forEach(j => L.push('- ' + j.name + ' (R' + j.r + '/' + j.g + ')')); if (belum.length > 20) L.push('- dan ' + (belum.length - 20) + ' jamaah lainnya'); }
    ks.filter(k => X.rites[k].badal).forEach(k => { const bl = this.jm.filter(j => D[k][j.id] || (S.udz[j.id] && !this.sat(S.mode, k, j, D))); if (!bl.length) return; const map = S.badal[S.mode][k] || {}; L.push(''); L.push('*' + X.rites[k].n + '*');
      bl.forEach(j => L.push('- ' + j.name + ' → ' + (this.pelName(map[j.id]) || 'belum ada pelaksana') + (D[k][j.id] ? ' ✅' : ''))); });
    if (S.mode === 'madinah' && this.jadwal.length) { L.push(''); L.push('*Jadwal Raudhoh*');
      this.jadwal.forEach(s => { const l = this.jm.filter(j => this.inSlot(j, s) && !S.udz[j.id]), d = l.filter(j => D[0][j.id]).length; L.push((d === l.length && l.length ? '✅ ' : '⏳ ') + this.slotLabel(s) + ': ' + d + '/' + l.length); }); }
    L.push(''); L.push('PPIH Bimbingan Ibadah Kloter: ' + this.ppih()); L.push('_Dikirim dari aplikasi Monitoring Kloter_');
    return L.join('\n');
  }
  async copyWa() { const t = this.waText(); try { await navigator.clipboard.writeText(t); } catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (er) {} ta.remove(); }
    this.saveCfg({ lastRekap: this.todayKey() }); this.setState({ copied: true }); setTimeout(() => this.setState({ copied: false }), 2000); }
  setCur(k) { const m = this.state.mode; this.data[m].cur = k; this.saveCfg({ curN: { ...((this.cfg && this.cfg.curN) || {}), [m]: this.data[m].rites[k].n } }); this.setState(s => ({ pr: { ...s.pr, rites: [k] } })); this.flash('Kegiatan berlangsung: ' + this.data[m].rites[k].n); }
  scrollRef = React.createRef();
  daysRef = React.createRef();
  pdfRef = React.createRef();
  componentDidUpdate() { const S = this.state; if (this._lastTab !== S.tab) {
      // Riwayat layar untuk tombol kembali (juga tombol back HP)
      if (this._lastTab && !this._dariKembali) { this._riwayat = [...(this._riwayat || []), this._lastTab].slice(-20); try { history.pushState({ mk: 1 }, ''); } catch (e) {} }
      this._dariKembali = false; this._lastTab = S.tab; if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; }
    const sig = S.tab + '|' + S.mode + '|' + this.data[S.mode].cur; if (S.tab !== 'checklist') this._daySig = null; else if (this._daySig !== sig) { this._daySig = sig; requestAnimationFrame(() => this.centerToday()); } }
  // Tutup jendela yang terbuka dulu; bila tidak ada, kembali ke layar sebelumnya. true = ada yang ditangani.
  kembali() {
    const S = this.state, tutup = ['sel', 'syncOpen', 'tglOpen', 'galeri', 'fotoDlg', 'susDlg', 'safDlg', 'ulDlg', 'slotDlg', 'mqDlg', 'tgJ', 'pp', 'confirm', 'pdf', 'kejForm'].find(k => S[k] != null && S[k] !== false);
    if (tutup) { this.setState({ [tutup]: ['syncOpen', 'tglOpen', 'galeri', 'pdf'].includes(tutup) ? false : null }); return true; }
    if (S.tab === 'kirim' && S.kirimLayar) { this.setState({ kirimLayar: S.kirimLayar.ubah ? { ...S.kirimLayar, ubah: false } : null }); return true; }
    if (S.tab === 'checklist' && !S.ckPilih && S.ckDariPilih) { this.setState({ ckPilih: true, ckDariPilih: false }, () => { if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; }); return true; }
    const r = this._riwayat || [];
    if (r.length) { this._dariKembali = true; const t = r[r.length - 1]; this._riwayat = r.slice(0, -1); this.setState({ tab: t }); return true; }
    if (S.tab !== 'beranda') { this._dariKembali = true; this.setState({ tab: 'beranda' }); return true; }
    return false;
  }
  centerToday() { const c = this.daysRef.current; if (!c) return; const t = c.querySelector('[data-today="y"]'); if (t) c.scrollLeft = t.offsetLeft - (c.clientWidth - t.offsetWidth) / 2; }
  exportCsv() {
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"', S = this.state, L = [['Waktu ekspor', 'Mode', 'Nomor Porsi', 'Nama', 'Rombongan', 'Regu', 'Udzur', 'Catatan', 'Kegiatan', 'Status', 'Pelaksana Badal', 'Tanggal Pelaksanaan', 'Susulan', 'Belum terkirim'].map(esc).join(',')], now = new Date().toISOString();
    const pend = new Set(this.queue.filter(q => q.jenis === 'centang').map(q => q.porsi + '|' + q.kegiatan));
    Object.keys(this.data).forEach(m => this.data[m].rites.forEach((r, k) => this.jm.forEach(j => { const key = r.badal ? ((S.badal[m] || {})[k] || {})[j.id] : null;
      L.push([now, m, "'" + j.porsi, j.name, j.r, j.g, S.udz[j.id] ? 'Ya' : 'Tidak', S.notes[j.id] || '', r.n, S.done[m][k][j.id] ? 'Selesai' : 'Belum', key ? this.pelText(key) : '', ((S.done[m][k][j.id] && (S.tg[m + '|' + k + '|' + j.id] || {}).t) || ''), (S.done[m][k][j.id] && (S.tg[m + '|' + k + '|' + j.id] || {}).s ? 'Ya' : 'Tidak'), pend.has(j.porsi + '|' + r.n) ? 'Ya' : ''].map(esc).join(',')); })));
    const blob = new Blob(['\ufeff' + L.join('\r\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'cadangan-' + this.klLabel().replace(/\s+/g, '-') + '-' + now.slice(0, 16).replace(/[:T]/g, '') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    this.flash('CSV cadangan diunduh · ' + (L.length - 1) + ' baris');
  }
  jadwal = [['Sel, 13 Okt', '02.00–04.00', 'P', [1, 2, 3]], ['Sel, 13 Okt', '22.00–00.00', 'L', [1, 2, 3]], ['Rab, 14 Okt', '02.00–04.00', 'P', [4, 5, 6]], ['Rab, 14 Okt', '22.00–00.00', 'L', [4, 5, 6]], ['Kam, 15 Okt', '02.00–04.00', 'P', [7, 8, 9]], ['Kam, 15 Okt', '22.00–00.00', 'L', [7, 8, 9]]]
    .map(([tgl, jam, sex, romb], i) => ({ id: i, tgl, jam, sex, romb, ket: '' }));
  parseJadwal(rows) {
    return (rows || []).filter(r => r['Tanggal'] || r['Jam']).map((r, i) => {
      const m = /(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/.exec(r['Tanggal'] || ''); let tgl = String(r['Tanggal'] || '');
      if (m) { const d = new Date(+m[3], +m[2] - 1, +m[1]); tgl = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }); }
      const jk = String(r['Jenis Kelamin'] || '').trim().toUpperCase(), sex = jk.startsWith('P') ? 'P' : jk.startsWith('L') ? 'L' : '';
      const romb = []; String(r['Rombongan'] || '').split(/[,;\s]+/).forEach(t => { const a = /^(\d+)\s*[-–]\s*(\d+)$/.exec(t); if (a) { for (let x = +a[1]; x <= +a[2]; x++) romb.push(x); } else if (+t) romb.push(+t); });
      return { id: i, tgl, jam: String(r['Jam'] || ''), sex, romb, ket: String(r['Keterangan'] || '') }; });
  }
  inSlot(j, s) { return (!s.sex || j.sex === s.sex) && (!s.romb.length || s.romb.includes(j.r)); }
  slotLabel(s) { return s.tgl + ' · ' + s.jam + ' · ' + (s.sex === 'P' ? 'Perempuan' : s.sex === 'L' ? 'Laki-laki' : 'Campur') + (s.romb.length ? ' · R' + s.romb.join(',') : ''); }
  ketuaR(r) { return this.jm.find(j => j.r === r && j.role === 'Ketua Rombongan') || { name: '-' }; }
  ketuaG(r, g) { return this.jm.find(j => j.r === r && j.g === g && j.role === 'Ketua Regu') || { name: '-' }; }
  mem(r, g) { return this.jm.filter(j => (!r || j.r === r) && (!g || j.g === g) && (!this._slotF || this._slotF(j))); }
  scopeList(s) { return s.scope === 'kloter' ? this.mem() : s.scope === 'rombongan' ? this.mem(s.r) : this.mem(s.r, s.g); }
  scopeLabel(s) { return s.scope === 'kloter' ? 'Seluruh kloter' : s.scope === 'rombongan' ? 'Rombongan ' + s.r : `Rombongan ${s.r} · Regu ${s.g}`; }
  flash(msg, undo) { clearTimeout(this._t); this.setState({ toast: msg, undo: undo || null }); this._t = setTimeout(() => this.setState({ toast: null, undo: null }), undo ? 8000 : 2400); }
  doUndo() { const u = this.state.undo; if (!u) return; this.push(u.ids.map((id, n) => this.item(u.rite, id, u.prev[n]))); this.setState(s => { const all = { ...s.done }, arr = all[u.mode].slice(), row = arr[u.rite].slice(); u.ids.forEach((id, n) => row[id] = u.prev[n]); arr[u.rite] = row; all[u.mode] = arr; const tg = { ...s.tg }; u.ids.forEach((id, n) => { if (!u.prev[n]) delete tg[u.mode + '|' + u.rite + '|' + id]; }); return { done: all, tg }; }); this.flash('Centang massal dibatalkan'); }
  setNote(id, t) { this.setState(s => ({ notes: { ...s.notes, [id]: t } })); this.push([{ jenis: 'jamaah', porsi: this.jm[id].porsi, catatan: t }]); }
  pressPin(d) {
    const c = this.cfg || {}; if (Date.now() < (c.lockUntil || 0)) return;
    const s = this.state; if (d === 'del') { this.setState({ pin: s.pin.slice(0, -1), pinErr: false }); return; }
    const p = (s.pin + d).slice(0, 4); if (p.length < 4) { this.setState({ pin: p, pinErr: false }); return; }
    if (p === (c.pin || '1234')) { this.saveCfg({ pinFails: 0, lockUntil: 0, terbuka: true }); this.setState({ pin: '', locked: false, pinErr: false }); return; }
    const f = (c.pinFails || 0) + 1; if (f >= 5) this.saveCfg({ pinFails: 0, lockUntil: Date.now() + 300000 }); else this.saveCfg({ pinFails: f });
    this.setState({ pin: '', pinErr: true });
  }
  patch(key, p) { this.setState(s => ({ [key]: { ...s[key], ...p } })); }
  bump() { this.setState(s => ({ sync: { ...s.sync, pending: 0, last: this.hhmm(new Date()) } })); }
  setDone(ids, val, rite, x) {
    const S = this.state, kk = rite ?? S.ck.rite;
    if (!val) { this.commit(ids, false, kk); return; }
    this.reqCheck(ids, kk, x);
  }
  reqCheck(ids, kk, x, c) {
    const S = this.state, m = S.mode, D = S.done[m], r = this.data[m].rites[kk];
    ids = ids.filter(id => !D[kk][id] && !this.naLock(m, kk, this.jm[id], D)); if (!ids.length) { if (c) this.setState({ confirm: null }); return; }
    if (r.badal) { this.setState({ confirm: null }); this.openPicker(kk, ids, this.badalCand(kk).map(j => j.id)); return; }
    if (r.safari && !(x && x.alasan)) { this.setState({ confirm: null, safDlg: { ids, k: kk, why: '', cat: '', c } }); return; }
    const ul = ids.filter(id => (S.ex[m + '|' + kk + '|' + id] || {}).stUlang === 'Perlu ulang');
    if (ul.length && ul.length === ids.length) { const e0 = S.ex[m + '|' + kk + '|' + ids[0]] || {}; this.setState({ confirm: null, susDlg: { ids, rite: kk, tgl: this.todayKey(), c, x, ulang: (e0.ulangKe || 1) + 1, pend: '', pq: '' } }); return; }
    if (this.telat(m, kk)) { this.setState({ confirm: null, susDlg: { ids, rite: kk, tgl: this.defTgl(r), c, x, pend: '', pq: '' } }); return; }
    if (r.tarw) x = { pil: 'Tarwiyah ' + (S.ck.tarwD || 8) + ' Dzh', ...(x || {}) };
    this.commit(ids, true, kk, undefined, false, x);
    if (c) { this.setState({ confirm: null }); this.flash(ids.length + ' jamaah dicentang', { mode: m, rite: kk, ids, prev: ids.map(() => false) }); }
  }
  conflicts(m, k) { const M = this.meta(m), r = this.data[m].rites[k], out = new Set();
    if (!r.opt) (M.slots[M.slotOf[k]] || []).forEach(x => out.add(x));
    (r.covers || []).forEach(g => (M.slots[g] || []).forEach(x => out.add(x)));
    (M.cov[M.slotOf[k]] || []).forEach(x => out.add(x)); out.delete(k); return [...out]; }
  commit(ids, val, kk, tgl, sus, x) {
    const S = this.state, m = S.mode, D = S.done[m], conf = val ? this.conflicts(m, kk) : [], items = [];
    const r = this.data[m].rites[kk], t0 = tgl || this.defTgl(r);
    if (val) sus = this.autoSus(r, t0, sus, x);
    ids.forEach(id => { conf.forEach(k2 => { if (D[k2][id]) items.push(this.item(k2, id, false)); }); items.push(this.item(kk, id, val, undefined, tgl, sus, x)); });
    this.push(items);
    this.setState(s => { const all = { ...s.done }, arr = all[m].slice(), tg = { ...s.tg }, ex = { ...s.ex }, row = arr[kk].slice();
      conf.forEach(k2 => { arr[k2] = arr[k2].slice(); });
      ids.forEach(i => { row[i] = val; const key = m + '|' + kk + '|' + i;
        if (val) { tg[key] = { t: t0, s: !!sus }; ex[key] = { ...(x || {}), pil: (x && x.pil) || r.pil || '' }; } else { delete tg[key]; delete ex[key]; }
        conf.forEach(k2 => { if (arr[k2][i]) { arr[k2][i] = false; delete tg[m + '|' + k2 + '|' + i]; delete ex[m + '|' + k2 + '|' + i]; } }); });
      arr[kk] = row; all[m] = arr; return { done: all, tg, ex }; });
  }
  saveUlang() { const d = this.state.ulDlg; if (!d || !d.why) return; const S = this.state, m = 'umrah', X = this.data[m], D = S.done[m], j = this.jm[d.id];
    const ks = X.rites.map((r, k) => r.ulang && (d.tahap === 'Seluruh rangkaian' || r.ulang === d.tahap) ? k : -1).filter(k => k >= 0 && D[k][j.id]);
    if (!ks.length) { this.flash('Tahap ' + d.tahap + ' belum dicentang'); return; }
    const alasan = d.why + ((d.cat || '').trim() ? ' · ' + d.cat.trim() : '');
    this.push(ks.map(k => { const ee = S.ex[m + '|' + k + '|' + j.id] || {}; return this.item(k, j.id, false, undefined, undefined, undefined, { stUlang: 'Perlu ulang', alasan, ulangKe: ee.ulangKe || 1, rencana: d.rencana }); }));
    this.setState(s => { const all = { ...s.done }, arr = all[m].slice(), ex = { ...s.ex }, tg = { ...s.tg };
      ks.forEach(k => { arr[k] = arr[k].slice(); arr[k][j.id] = false; const key = m + '|' + k + '|' + j.id; ex[key] = { stUlang: 'Perlu ulang', alasan, ulangKe: (s.ex[key] || {}).ulangKe || 1, rencana: d.rencana }; delete tg[key]; });
      all[m] = arr; return { done: all, ex, tg, ulDlg: null }; });
    this.flash(j.name.split(' ')[0] + ' ditandai perlu ulang · ' + ks.map(k => X.rites[k].p).join(', ')); }
  saveSaf() { const d = this.state.safDlg; if (!d || !d.why || (d.why === 'Lainnya' && !(d.cat || '').trim())) return; this.setState({ safDlg: null });
    this.reqCheck(d.ids, d.k, { pil: 'Safari', alasan: d.why + ((d.cat || '').trim() ? ' · ' + d.cat.trim() : '') }, d.c); }
  group(items) { const out = []; items.forEach(it => { let g = out[out.length - 1]; if (!g || g.day !== it.day) out.push(g = { day: it.day, items: [] }); g.items.push(it); }); return out; }
  petugas = [{ key: 'p1', name: 'Hasan Basri', role: 'Ketua Kloter' }, { key: 'p2', name: 'Ust. Mahfudz Ali', role: 'Pembimbing Ibadah' }, { key: 'p3', name: 'Ust. Ridwan Kamil', role: 'Pembimbing Ibadah' }];
  pelName(key) { if (!key) return ''; if (key.slice(0, 2) === 'x:') return key.slice(2); if (key[0] === 'p') return (this.petugas.find(p => p.key === key) || { name: '-' }).name; return (this.jm[+key.slice(1)] || { name: '-' }).name; }
  pelRole(key) { if (!key) return ''; if (key.slice(0, 2) === 'x:') return 'Nama lain'; if (key[0] === 'p') return (this.petugas.find(p => p.key === key) || { role: '' }).role; const j = this.jm[+key.slice(1)]; return j ? `Jamaah R${j.r} · Regu ${j.g}` : ''; }
  ownRite(k) { const R = this.data[this.state.mode].rites; for (let i = k - 1; i >= 0; i--) if (!R[i].badal && /Aq[ao]bah/.test(R[i].n)) return i; return -1; }
  openPicker(k, ids, cand) { this.setState({ picker: { k, sel: ids, cand: cand || null, q: '', pel: null, src: 'jamaah' } }); }
  applyPicker() { const P = this.state.picker; if (!P || !P.sel.length || !P.pel) return; const S = this.state, m = S.mode, n = P.sel.length, name = this.pelName(P.pel), past = P.k < this.data[m].cur;
    this.setState(s => { const b = { ...s.badal }, mm = { ...b[m] }, map = { ...(mm[P.k] || {}) }; P.sel.forEach(id => map[id] = P.pel); mm[P.k] = map; b[m] = mm; return { badal: b, picker: null }; });
    this.commit(P.sel, true, P.k, undefined, past, { pel: P.pel, pil: 'Badal' });
    this.flash(`Badal · ${n} jamaah oleh ${name}`, { mode: m, rite: P.k, ids: P.sel, prev: P.sel.map(() => false) }); }
  eligible(j, k) { const S = this.state, m = S.mode, r = this.data[m].rites[k]; if (this.naLock(m, k, j, S.done[m])) return false; return r.badal ? true : !S.udz[j.id]; }
  askMass(list, label) {
    const S = this.state, m = S.mode, k = S.ck.rite, D = S.done[m], R = this.data[m].rites[k], rite = R.n;
    if (R.badal) { const c = this.badalCand(k, list); if (!c.length) { this.flash('Tidak ada jamaah yang perlu dibadalkan di cakupan ini'); return; } this.openPicker(k, c.filter(j => S.udz[j.id]).map(j => j.id), c.map(j => j.id)); return; }
    const elig = list.filter(j => this.eligible(j, k)), todo = elig.filter(j => !this.sat(m, k, j, D)), mine = elig.filter(j => D[k][j.id]);
    if (!elig.length) { this.flash('Semua jamaah di cakupan ini udzur atau tidak wajib'); return; }
    const u = list.filter(j => S.udz[j.id]).length, alt = elig.length - todo.length - mine.length, na = list.filter(j => this.naLock(m, k, j, D)).length;
    const skip = [u ? u + ' jamaah udzur dilewati' : '', alt ? alt + ' jamaah sudah memilih kegiatan lain' : '', na ? na + ' jamaah Nafar Awwal tidak wajib' : ''].filter(Boolean).join(' · ');
    const c = !todo.length
      ? (mine.length ? { title: 'Batalkan centang?', body: `${label}: ${mine.length} jamaah akan ditandai belum “${rite}”.`, cta: 'Batalkan centang', ids: mine.map(j => j.id), val: false, label } : null)
      : { title: `Centang semua · ${todo.length} jamaah?`, body: `Tandai ${todo.length} jamaah (${label}) selesai untuk kegiatan “${rite}”. Bisa dibatalkan selama 8 detik.` + (skip ? ' ' + skip + '.' : ''), cta: 'Ya, centang', ids: todo.map(j => j.id), val: true, label };
    if (!c) { this.flash('Semua jamaah sudah memilih kegiatan lain'); return; }
    if (this.props.skipConfirm === true) this.apply(c); else this.setState({ confirm: c });
  }
  apply(c) { const S = this.state, m = S.mode, rite = S.ck.rite, prev = c.ids.map(id => S.done[m][rite][id]);
    if (c.val) { this.reqCheck(c.ids, rite, undefined, c); return; }
    this.commit(c.ids, false, rite); this.setState({ confirm: null });
    this.flash(`Centang ${c.label} dibatalkan`, { mode: m, rite, ids: c.ids, prev }); }
  badalHtml(list, ks, esc) {
    const S = this.state, X = this.data[S.mode], D = S.done[S.mode];
    return ks.filter(k => X.rites[k].badal).map(k => { const map = S.badal[S.mode][k] || {};
      const rows = list.filter(j => S.udz[j.id]).map(j => `<tr><td>${esc(j.name)}</td><td>R${j.r}·${j.g}</td><td>${esc(this.pelName(map[j.id]) || '-')}</td><td class="c">${D[k][j.id] ? '✓' : ''}</td></tr>`).join('');
      return rows ? `<h2>${esc(X.rites[k].n)}</h2><table><thead><tr><th>Jamaah udzur</th><th>Romb·Regu</th><th>Pelaksana badal</th><th class="c">Selesai</th></tr></thead><tbody>${rows}</tbody></table>` : ''; }).join('');
  }
  sigs(sc) { return sc === 'regu' ? ['Ketua Regu', 'Ketua Rombongan'] : sc === 'rombongan' ? ['Ketua Rombongan', 'Ketua Kloter'] : ['Ketua Kloter', 'Pembimbing Ibadah']; }
  ppih() { return (this.cfg && this.cfg.ppih) || TUSI; }
  // nilai: { 'Nama Baris di tab Pengaturan': nilai }. Ikut antrean, jadi aman saat offline.
  pushPengaturan(nilai) {
    if (!this.live()) return;
    const ex = this.queue.find(q => q.jenis === 'pengaturan' && !this._inflight.has(q));
    if (ex) { Object.assign(ex.nilai, nilai); ex.waktu = new Date().toISOString(); this.saveQueue(); this.push([]); return; }
    this.push([{ jenis: 'pengaturan', nilai: { ...nilai } }]);
  }
  // Nilai tab Pengaturan: data server terakhir, ditimpa perubahan yang masih di antrean
  // Umur (tahun) pada tanggal berangkat kloter; tanpa tanggal berangkat dihitung dari hari ini
  umur(tgl) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(tgl || '')); if (!m) return -1;
    const b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(this._berangkat || '') || null, d = b ? new Date(+b[1], b[2] - 1, +b[3]) : new Date();
    let u = d.getFullYear() - +m[1]; if (d.getMonth() + 1 < +m[2] || (d.getMonth() + 1 === +m[2] && d.getDate() < +m[3])) u--; return u;
  }
  simpanDataJamaah(porsi, nilai) {
    const it = { jenis: 'dataJamaah', porsi, ...nilai };
    if (this.raw && this.raw[porsi]) Object.assign(this.raw[porsi], keKolom(it));
    const snap = this.live() ? this.readSnap() : null; if (snap) { this.mergeSnap(snap, [it]); simpanSnap(snap); }
    this.push([it]);
    if (snap) this.build(snap); else this.forceUpdate();
    this.flash('Data jamaah disimpan' + (navigator.onLine ? '' : ' · terkirim saat ada internet'));
  }
  setTglBerangkat(v) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return;
    this.pushPengaturan({ 'Tanggal Berangkat': v });
    if (!this.live()) { this._berangkat = v; this.forceUpdate(); this.flash('Mode coba · tanggal berangkat tidak disimpan'); return; }
    const snap = this.readSnap(); if (snap) { snap.pengaturan = { ...(snap.pengaturan || {}), 'Tanggal Berangkat': v }; simpanSnap(snap); this.build(snap); }
    this.flash('Tanggal berangkat disimpan · lansia dihitung ulang');
  }
  // Pengaturan kultum per kloter: tanggal tiba di Saudi (bawaan: tanggal berangkat) dan gelombang
  aturKultum() {
    const a = this.live() ? this.aturKloter() : (() => { try { return JSON.parse(localStorage.getItem('mk.kultum.atur') || '{}'); } catch (e) { return {}; } })();
    return { tiba: a['Tanggal Tiba'] || this._berangkat || '', gelombang: String(a['Gelombang'] || (this.cfg && this.cfg.gelombang) || '1') };
  }
  setAturKultum(kunci, v) {
    if (kunci === 'Tanggal Tiba' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return;
    if (!this.live()) {
      try { const a = JSON.parse(localStorage.getItem('mk.kultum.atur') || '{}'); a[kunci] = v; localStorage.setItem('mk.kultum.atur', JSON.stringify(a)); } catch (e) {}
      this.forceUpdate(); this.flash('Mode coba · tersimpan di HP ini saja'); return;
    }
    this.pushPengaturan({ [kunci]: v });
    const snap = this.readSnap(); if (snap) { snap.pengaturan = { ...(snap.pengaturan || {}), [kunci]: v }; simpanSnap(snap); }
    this.forceUpdate(); this.flash((kunci === 'Gelombang' ? 'Gelombang' : 'Tanggal tiba') + ' disimpan untuk kloter' + (navigator.onLine ? '' : ' · dikirim saat ada internet'));
  }
  // Data bagian atas Home: ringkasan jamaah, kegiatan terlewat yang belum dicentang, dan kegiatan berikutnya
  // Kartu "Progres Rombongan" di layar Menu: ketuntasan kegiatan yang sedang aktif per rombongan
  menuRomb() {
    try {
      if (!this.jm.length) return null;
      const S = this.state, st = this.rekapStats(), R = this.data[S.mode].rites[this.data[S.mode].cur];
      const rombs = [...st.rombs].sort((a, b) => a.r - b.r), regu = new Set(this.jm.map(j => j.r + '|' + j.g)).size;
      const tuntas = rombs.filter(x => x.n && x.pct >= 100).map(x => x.r), top = rombs.reduce((a, b) => (b.pct > a.pct ? b : a), rombs[0]);
      return { rombs, regu, kegiatan: R ? R.n : '', on: () => this.setState({ tab: 'rekap' }),
        catatan: tuntas.length ? 'Rombongan ' + tuntas.join(', ') + ' telah mencapai 100% ketuntasan fase aktif' : top ? 'Tertinggi: Rombongan ' + top.r + ' · ' + top.pct + '%' : '' };
    } catch (e) { return null; }
  }

  homeVals() {
    const S = this.state, jm = this.jm, hit = f => jm.filter(f).length, kh = j => this.khOf(j.id) || {};
    const hari = this.todayKey(), besok = new Date(hari + 'T00:00:00Z'); besok.setUTCDate(besok.getUTCDate() + 1); const tglBesok = besok.toISOString().slice(0, 10);
    const keJamaah = p => () => this.setState(s => ({ tab: 'jamaah', jl: { ...s.jl, ...p } }));
    const keCk = (m, k) => () => { this.saveCfg({ mode: m }); this.setState(s => ({ mode: m, tab: 'checklist', ckPilih: false, ck: { ...s.ck, rite: k } })); };
    const L = hit(j => j.sex === 'L'), P = hit(j => j.sex === 'P'), lansia = hit(j => kh(j).lansia), pend = hit(j => this.pendKey(j.id));
    const ringkas = [
      { n: L, l: 'Laki-laki' }, { n: P, l: 'Perempuan' }, { n: lansia, l: 'Lansia', on: keJamaah({ v: 'kh', kf: 'lansia' }) }, { n: pend, l: 'Didampingi', on: keJamaah({ v: 'kh', kf: 'semua' }) },
      { n: hit(j => j.risti), l: 'Risti', on: keJamaah({ v: 'kh', kf: 'risti' }), warna: true }, { n: hit(j => kh(j).kroda), l: 'Kursi roda', on: keJamaah({ v: 'kh', kf: 'kroda' }) },
      { n: hit(j => S.udz[j.id]), l: 'Udzur', on: keJamaah({ v: 'semua', f: 'udzur' }) }, { n: jm.length - L - P, l: 'JK kosong' }];
    const peringatan = [], pengingat = []; let adaTgl = false;
    Object.keys(this.data).forEach(m => { const X = this.data[m], D = (S.done || {})[m], M = this.meta(m); if (!D) return;
      M.req.forEach(g => { const ks = M.slots[g] || [], tgl = ks.map(k => X.rites[k].tgl).filter(Boolean).sort()[0]; if (!tgl) return; adaTgl = true;
        if (tgl >= hari) return;
        const n = jm.filter(j => !S.udz[j.id] && !this.skip(m, ks[0], j, D) && this.satBy(m, g, j, D) < 0).length; if (!n) return;
        const r = X.rites[M.firstK[g]];
        const tot = jm.filter(j => !S.udz[j.id] && !this.skip(m, ks[0], j, D)).length;
        peringatan.push({ key: m + g, label: r.p, sub: this.modeLabel(m) + ' · ' + this.fmtHari(tgl), n, tot, tgl, on: keCk(m, M.firstK[g]) }); });
      X.rites.forEach((r, k) => { if (!r.tgl || r.tgl < hari || r.opt) return;
        adaTgl = true;
        const jam = r.jam || '', lewat = r.tgl === hari && jam && jam.replace('.', ':') < this.hhmmWas();
        if (lewat) return;
        const selisihHari = Math.round((Date.parse(r.tgl + 'T00:00:00Z') - Date.parse(hari + 'T00:00:00Z')) / 86400000);
        const labelHari = r.tgl === hari ? 'Hari ini' : r.tgl === tglBesok ? 'Besok' : selisihHari <= 14 ? selisihHari + ' hari lagi' : this.fmtHari(r.tgl);
        const subTempat = [this.modeLabel(m), r.place, r.tgl > tglBesok && selisihHari <= 14 ? this.fmtHari(r.tgl) : ''].filter(Boolean).join(' · ');
        pengingat.push({ key: m + k, label: r.p, sub: subTempat, kapan: labelHari + (jam ? ' ' + jam.replace(':', '.') : ''), urut: r.tgl + (jam || '99'), on: keCk(m, k) }); }); });
    peringatan.sort((a, b) => b.tgl.localeCompare(a.tgl)); pengingat.sort((a, b) => a.urut.localeCompare(b.urut));
    const simulasi = !adaTgl;
    if (simulasi) {
      const H = this.data.haji.rites, iWukuf = Math.max(0, H.findIndex(r => /Wukuf/i.test(r.n))), iMuz = Math.max(0, H.findIndex(r => /Muzdalifah|Murur/i.test(r.n)));
      const iAqobah = Math.max(0, H.findIndex(r => /Aqobah/i.test(r.n) && !r.badal)), iMina = Math.max(0, H.findIndex(r => /Malam 11/i.test(r.n))), iJum11 = Math.max(0, H.findIndex(r => /11 Dzh/i.test(r.n) && !r.badal));
      const totAktif = Math.max(1, jm.filter(j => !S.udz[j.id]).length);
      // Kloter tanpa jamaah: jangan tampilkan angka "belum dicentang" rekaan
      if (!peringatan.length && jm.length) {
        peringatan.push(
          { key: 'sim-wukuf', label: (H[iWukuf] && H[iWukuf].p) || 'Wukuf di Arafah', sub: 'Haji · 9 Dzulhijjah · Tenda Arafah', n: 12, tot: totAktif, tgl: hari, on: keCk('haji', iWukuf) },
          { key: 'sim-muz', label: (H[iMuz] && H[iMuz].p) || 'Mabit di Muzdalifah', sub: 'Haji · Malam 10 Dzulhijjah · Muzdalifah', n: 18, tot: totAktif, tgl: hari, on: keCk('haji', iMuz) }
        );
      }
      if (!pengingat.length) {
        pengingat.push(
          { key: 'sim-aqobah', label: (H[iAqobah] && H[iAqobah].p) || 'Jumroh Aqobah', sub: 'Haji · Jamarat, Mina · Wajib', kapan: 'Hari ini 16.30', urut: '1', on: keCk('haji', iAqobah) },
          { key: 'sim-mina11', label: (H[iMina] && H[iMina].p) || 'Mabit di Mina Malam 11', sub: 'Haji · Tenda Mina · Wajib', kapan: 'Hari ini 20.00', urut: '2', on: keCk('haji', iMina) },
          { key: 'sim-jum11', label: (H[iJum11] && H[iJum11].p) || 'Lempar Jumroh 11 Dzh', sub: 'Haji · Jamarat, Mina · Ula, Wustha, Aqobah', kapan: 'Besok 13.30', urut: '3', on: keCk('haji', iJum11) }
        );
      }
    }
    const khBase = jm.filter(j => this.isKh(j)), kejTerbuka = this.pakaiAkun() || !this.live() ? this.daftarKejadian().filter(k => k.status !== 'selesai').length : 0;
    const X = this.data[S.mode], ci = X.cur, R = X.rites[ci], RS = this.rekapStats();
    return { total: jm.length, ringkas, peringatan: peringatan.slice(0, 5), pengingat: pengingat.slice(0, 4), tanpaTanggal: !adaTgl, simulasiJadwal: simulasi,
      khusus: { n: khBase.length, tanpa: khBase.filter(j => !this.pendKey(j.id)).length, on: keJamaah({ v: 'kh', kf: 'semua' }) },
      kejadian: { n: kejTerbuka, on: () => this.setState({ tab: 'kejadian' }) },
      cur: { m: S.mode, mode: this.modeLabel(S.mode), n: R.n, day: R.day || '', place: R.place || '', k: S.mode === 'madinah' ? 'Sunnah' : (R.k || ''), done: RS.done, tot: RS.tot, pct: RS.pct,
        ket: X.deadline || '', on: () => this.setState(s => ({ tab: 'checklist', ckPilih: false, ck: { ...s.ck, rite: ci } })) },
      jalan: ['haji', 'umrah', 'madinah'].map(m => this.perjalanan(m)),
      kota: S.mode === 'madinah' ? 'Madinah' : 'Makkah',
      catatanData: jm.length - L - P > 0 ? 'Jenis kelamin dan tanggal lahir bisa diisi di detail jamaah atau lewat Unggah Excel (Profil).' : '' };
  }
  // Tahapan perjalanan per ibadah (Madinah: tiap kegiatan satu tahap) dan kemajuannya
  tahapan(m) {
    const X = this.data[m], idx = re => X.rites.map((r, k) => re.test(r.n) ? k : -1).filter(k => k >= 0), span = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i), nR = X.rites.length;
    if (m === 'madinah') return X.rites.map((r, k) => [r.p || r.n, [k]]);
    if (m === 'haji') { const f = n => X.rites.findIndex(r => r.n === n), w = f('Wukuf di Arafah'), mu = f('Murur Mabit'), a = f('Jumroh Aqobah'), t = f('Thawaf Ifadzoh');
      return [['Mina 8', span(0, w)], ['Arafah 9', span(w, mu)], ['Muzdalifah', span(mu, a)], ['Mina 10–13', span(a, t)], ['Makkah', span(t, nR)]].filter(x => x[1].length); }
    return [['Miqat', idx(/^(Niat|Ihram) Umrah$|^Miqat$/)], ['Thawaf', idx(/^Thawaf/)], ["Sa'i", idx(/^Sa'i/)], ['Tahallul', idx(/^Tahallul/)]].filter(x => x[1].length);
  }
  perjalanan(m) {
    const S = this.state, X = this.data[m], D = (S.done || {})[m] || [], n = this.jm.length || 1;
    const isi = k => (D[k] || []).filter(Boolean).length / n, wajib = X.rites.map((r, k) => k).filter(k => !X.rites[k].opt && X.rites[k].k !== 'Opsi');
    const pct = wajib.length ? Math.round(wajib.reduce((a, k) => a + Math.min(1, isi(k)), 0) / wajib.length * 100) : 0;
    const titik = this.tahapan(m).map(([l, ks]) => { const kw = ks.filter(k => wajib.includes(k)), sel = (kw.length ? kw : ks).every(k => isi(k) >= 0.95);
      return { l, s: sel ? 'ok' : ks.includes(X.cur) && pct > 0 ? 'now' : 'todo' }; });
    const now = titik.find(t => t.s === 'now');
    return { m, nama: m === 'madinah' ? 'Ibadah Madinah' : 'Perjalanan ' + this.modeLabel(m), pct,
      sub: pct >= 100 ? 'Selesai semua' : now ? 'Sekarang · ' + now.l : pct > 0 ? 'Sedang berjalan' : m === 'madinah' ? 'Semua sunnah · belum dimulai' : 'Belum dimulai', titik,
      on: () => this.gantiIbadah(m, { tab: 'checklist', ckPilih: false, ckDariPilih: false }) };
  }
  // Pindah ibadah: kegiatan terpilih ikut pindah ke kegiatan berlangsung ibadah itu (seperti tombol mode lama)
  gantiIbadah(m, extra) { const c = this.data[m].cur; this.saveCfg({ mode: m }); this.setState(s => ({ mode: m, ck: { ...s.ck, rite: c }, pr: { ...s.pr, rites: [c] }, ...extra }), () => { if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; }); }
  pilihIbadah() {
    const S = this.state, ket = { haji: 'Rukun · wajib · sunnah', umrah: 'Umrah wajib', madinah: 'Semua sunnah' }, judul = { haji: 'Armuzna & Makkah', umrah: 'Umrah Wajib', madinah: 'Masjid Nabawi' };
    return ['haji', 'umrah', 'madinah'].map(m => { const p = this.perjalanan(m), X = this.data[m], r = X.rites[X.cur] || {};
      return { m, label: this.modeLabel(m).toUpperCase(), judul: judul[m], badge: p.pct >= 100 ? 'Selesai ✓' : ket[m], pct: p.pct,
        sub: m === 'madinah' ? 'Raudhoh per jadwal' : p.pct >= 100 ? 'Semua kegiatan selesai' : 'Sekarang: ' + (r.n || '-'), aktif: S.mode === m,
        cta: 'Buka checklist ' + (m === 'madinah' ? 'Madinah' : this.modeLabel(m).toLowerCase()),
        on: () => { this.gantiIbadah(m, { ckPilih: false, ckDariPilih: true }); try { history.pushState({ mk: 1 }, ''); } catch (e) {} } }; });
  }
  hhmmWas() { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); }
  statusExcel() {
    const S = this.state;
    return Object.keys(this.data).map(m => ({ mode: this.modeLabel(m), kegiatan: this.data[m].rites.map(r => r.n),
      baris: this.jm.map(j => ({ j, sel: this.data[m].rites.map((r, k) => { if (!(((S.done || {})[m] || [])[k] || [])[j.id]) return '';
        const t = (S.tg || {})[m + '|' + k + '|' + j.id]; return t && t.t ? t.t + (t.j ? ' ' + t.j : '') + (t.s ? ' (susulan)' : '') : '✓'; }) })) }));
  }
  aturKloter() { const p = { ...(((this.readSnap() || {}).pengaturan) || {}) }; this.queue.forEach(q => { if (q.jenis === 'pengaturan') Object.assign(p, q.nilai); }); return p; }
  // Udzur dikirim sebagai catatan tersendiri (tidak digabung) agar riwayat lengkap walau diubah berkali-kali saat offline.
  simpanUdzur(j, udzur, alasan) {
    const it = { jenis: 'udzur', porsi: j.porsi, nama: j.name, udzur, alasan: String(alasan || '').trim(), perangkat: (this.cfg && this.cfg.device) || '', waktu: new Date().toISOString() };
    if (this.live()) this.push([it]); else { it.petugas = this.ppih(); this._riwDemo = [it].concat(this._riwDemo || []); }
    this.setState(s => { const a = s.udz.slice(); a[j.id] = udzur; return { udz: a, udzForm: null }; });
    this.flash(udzur ? 'Ditandai udzur · masuk daftar badal' : 'Status udzur dihapus');
  }
  // Riwayat udzur satu jamaah, terbaru dulu: data server + yang masih di antrean.
  riwayatUdzur(porsi) {
    const P = String(porsi), snap = (this.live() && this.readSnap()) || {};
    const server = (snap.riwayatUdzur || []).filter(r => String(r['Nomor Porsi']) === P).map(r => ({ waktu: r['Waktu'], udzur: r['Status'] === 'Udzur', alasan: r['Alasan'] || '', petugas: r['Petugas'] || '', id: r['ID Kirim'] }));
    const ids = new Set(server.map(r => r.id).filter(Boolean));
    const antre = this.queue.concat(this._riwDemo || []).filter(q => q.jenis === 'udzur' && q.porsi === P && !ids.has(q.id)).map(q => ({ waktu: q.waktu, udzur: q.udzur, alasan: q.alasan, petugas: q.petugas, antre: this.live() }));
    return server.concat(antre).sort((a, b) => Date.parse(b.waktu) - Date.parse(a.waktu));
  }
  fmtWaktu(t) { const d = new Date(t); if (isNaN(d)) return String(t || ''); try { return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(d).replace(',', '') + ' WAS'; } catch (e) { return d.toLocaleString(); } }
  idLengkap() { return !!this.cfg && !kurangIdentitas(this.cfg).length; }
  identitas(su) { return { ppih: su.ppih.trim(), kloter: su.kloter.trim(), embarkasi: su.embarkasi.trim().toUpperCase(), gelombang: String(su.gelombang) }; }
  prTitle() { return this.sheetDef(this.state.pr.sheet || 'armuzna').title; }
  sheetDef(sh) {
    const H = this.data.haji.rites, U = this.data.umrah.rites, rng = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);
    if (sh === 'umrah') return { kind: 'tbl', title: 'Lembar Ceklis Umrah Wajib', mode: 'umrah', land: false, secs: [{ ks: rng(0, U.length) }] };
    if (sh === 'raudhoh') return { kind: 'raudhoh', title: 'Lembar Ceklis Raudhoh', mode: 'madinah', land: false };
    if (sh === 'harian') return { kind: 'harian', title: 'Rekap Harian', mode: this.state.mode, land: false };
    if (sh === 'khusus') return { kind: 'khusus', title: 'Daftar Jamaah Khusus & Pendamping', mode: this.state.mode, land: false };
    if (sh === 'badal') return { kind: 'badal', title: 'Daftar Badal Jumroh per Pelaksana', mode: 'haji', land: false };
    const t0 = H.findIndex(r => r.n === 'Mabit di Mina Malam 11'), t1 = H.findIndex(r => r.n === 'Thawaf Ifadzoh');
    if (sh === 'makkah') return { kind: 'tbl', title: "Lembar Ceklis Haji · Ifadzoh, Sa'i, Tahallul Tsani & Wada'", mode: 'haji', land: false, secs: [{ ks: rng(t1, H.length) }] };
    if (sh === 'tasyrik') return { kind: 'tbl', title: 'Lembar Ceklis Haji · Hari Tasyrik', mode: 'haji', land: true,
      secs: [11, 12, 13].map(d => ({ label: 'Malam ' + d + ' & ' + d + ' Dzh', ks: rng(t0, t1).filter(k => new RegExp('(^| )' + d + ' ').test(H[k].day)) })) };
    return { kind: 'tbl', title: 'Lembar Ceklis Haji · Armuzna', mode: 'haji', land: true, secs: [{ ks: rng(0, t0) }] };
  }
  sheetCols(m, ks) { const M = this.meta(m), R = this.data[m].rites, out = [], seen = {};
    ks.forEach(k => { const r = R[k]; if (r.opt) return; const g = M.slotOf[k]; if (seen[g]) return; seen[g] = 1; const rs = M.slots[g];
      out.push({ g, ks: rs, k0: rs[0], label: rs.map(x => R[x].badal ? 'Badal' : R[x].p).join(' / '), short: rs.length > 1 ? rs.map(x => R[x].ab && R[x].ab !== '✓' ? R[x].ab : R[x].p.split(' ')[0]).join('/') : r.p }); });
    return out; }
  grpHdr(m, cols) { const R = this.data[m].rites, out = [];
    cols.forEach(c => { const r = R[c.k0], g = out[out.length - 1]; if (g && g.day === r.day) { g.span++; g.places.add(r.place); } else out.push({ day: r.day, span: 1, places: new Set([r.place]) }); });
    return out.map(g => { const pl = [...g.places].filter(Boolean); return { label: String(g.day).replace('Dzulhijjah', 'Dzh').replace('Dzulqa’dah', 'Dzq') + (pl.length === 1 ? ' · ' + pl[0] : ''), span: g.span, col: 'span ' + g.span }; }); }
  cellOf(m, col, j, foot) {
    const S = this.state, R = this.data[m].rites, D = S.done[m];
    if (this.naLock(m, col.k0, j, D)) return { t: 'na', v: '-' };
    const k = this.satBy(m, col.g, j, D);
    if (k < 0) return col.ks.some(x => (S.ex[m + '|' + x + '|' + j.id] || {}).stUlang === 'Perlu ulang') ? { t: 'pu', v: 'PU' } : { t: 'box', v: '' };
    const r = R[k], e = S.tg[m + '|' + k + '|' + j.id] || {}, x = S.ex[m + '|' + k + '|' + j.id] || {}, sus = !!e.s;
    if (r.badal) { const n = foot ? foot(j, k) : 0; return { t: 'b', v: 'B' + (n ? '<sup>' + n + '</sup>' : ''), vt: 'B', sus }; }
    if (x.ulangKe >= 2) return { t: 'ok', v: 'U' + x.ulangKe, sus };
    return col.ks.length > 1 && (/^(tarw|wukuf|muzd)/.test(r.g || '') || /Mabit|Tanazul/.test(r.n)) ? { t: 'ok pf', v: r.p, sus } : col.ks.length > 1 && r.ab && r.ab !== '✓' ? { t: 'ok', v: r.ab, sus } : { t: 'ok', v: '✓', sus };
  }
  ketOf(m, cols, j) { const S = this.state, R = this.data[m].rites, D = S.done[m], out = [];
    if (S.notes[j.id]) out.push(S.notes[j.id]);
    { const pk = this.pendKey(j.id); if (pk && this.isKh(j)) out.push('Pendamping: ' + this.pelName(pk)); }
    cols.forEach(c => { const k = this.satBy(m, c.g, j, D);
      (k >= 0 ? [k] : c.ks).forEach(x => { const e = S.tg[m + '|' + x + '|' + j.id] || {}, ee = S.ex[m + '|' + x + '|' + j.id] || {}, r = R[x], d = D[x][j.id];
        if (d && e.s) out.push('Susulan ' + r.p + (e.t ? ' ' + this.fmtH(e.t) : '') + (ee.pend ? ', didampingi ' + this.pelName(ee.pend) : ''));
        if (d && r.safari && ee.alasan) out.push('Safari: ' + ee.alasan);
        if (d && ee.ulangKe >= 2) out.push(r.p + ' ulang ke-' + ee.ulangKe + (e.t ? ' ' + this.fmtTgl(e.t) : '') + (ee.pend && !e.s ? ', didampingi ' + this.pelName(ee.pend) : ''));
        if (!d && ee.stUlang === 'Perlu ulang') out.push('Perlu ulang ' + r.p + (ee.alasan ? ' (' + ee.alasan + ')' : '')); }); });
    if (cols.some(c => this.naLock(m, c.k0, j, D))) out.push('Nafar Awwal');
    return [...new Set(out)].join('; '); }
  localJadwal() { try { return JSON.parse(localStorage.getItem('mk.jadwalx')) || []; } catch (e) { return []; } }
  openAddSlot() { const S = this.state, cs = S.ck.slot != null ? this.jadwal[S.ck.slot] : null; this.setState({ slotDlg: { tgl: this.todayKey(), a: '', b: '', sex: (cs && cs.sex) || S.ck.mdSex || 'L', romb: [], ket: '' } }); }
  saveSlot() {
    const d = this.state.slotDlg; if (!d || !d.tgl || !d.a || !d.b || !d.romb.length) return;
    const [y, m, dd] = d.tgl.split('-'), raw = { 'Tanggal': dd + '/' + m + '/' + y, 'Jam': d.a.replace(':', '.') + '–' + d.b.replace(':', '.'), 'Jenis Kelamin': d.sex, 'Rombongan': d.romb.join(','), 'Keterangan': (d.ket || '').trim() };
    const loc = this.localJadwal(); loc.push(raw); localStorage.setItem('mk.jadwalx', JSON.stringify(loc));
    const ns = { ...this.parseJadwal([raw])[0], id: this.jadwal.length }; this.jadwal = this.jadwal.concat([ns]);
    this.push([{ jenis: 'jadwal', tanggal: d.tgl, jam: raw['Jam'], jk: d.sex, rombongan: raw['Rombongan'], keterangan: raw['Keterangan'] }]);
    this.setState(s => ({ slotDlg: null, ck: { ...s.ck, mdTgl: ns.tgl, mdSex: d.sex, slot: this.jadwal.length - 1, scope: 'kloter' } }));
    this.flash('Jadwal ditambahkan · ' + ns.tgl + ' ' + ns.jam);
  }
  printHtml(preview) {
    const PRINT_FONTS = "@font-face{font-family:'IBM Plex Sans';font-weight:300;font-display:block;src:url(data:font/woff2;base64,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)}@font-face{font-family:'IBM Plex Sans';font-weight:400;font-display:block;src:url(data:font/woff2;base64,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)}@font-face{font-family:'IBM Plex Sans';font-weight:600;font-display:block;src:url(data:font/woff2;base64,d09GMgABAAAAAF68ABIAAAAA3ugAAF5UAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGjQbgbpaHIRiBmA/U1RBVFoAhHwIKgmfAxEMCoG4eIGaUAuEHgABNgIkA4g4BCAFhG4HiG0MgSgbY8wnonn3FRi3DQC63sa8uKONDrRuB1TRM7dtZiDYOIBte9Ge/f//aUljjLUN23EooKr19bCKiKoyW1ux9XXdBnJm8+jYkcje3WZzawcm6tbNPnPA5ugXbq7YDvEM6VW1kMZbeZOebfscF916vN6Dv8vC8ms19iitGWWnqJ/JDT8y3bB6LlmtzvqoiFBRMpUXXGnX3csOTEvDbDZb78ETB6WYJaZJ88Rs+CcLdyTXShGmL+VISrLVhIsejoPM1sPFlR0cK+pSO9oV+KBLy1PvOrSXvKV/IbtfZBUYux6iaqxTL0Gwls7ufZIysCQG4StZyApVDY7IIZ0Pz9/8c+9DWKPbwkA314jmPgj3bXreFrV6v2em94JYAfHnFMoQglBoi3U40D0AcyuFAYMhNWCVLFkkY8WyoFfUAImJA0aF0HqHWVh4hwmKJ5xXRl3KKedxaeWjF/3yRB3iv91L54hnMt5B47WaBDwowUwAK/3f73BqNVYUN9myJFuOLTtxTTZtI8fZluyVfC2ABPDP4l+A/x6gB/RKI+wOwEPofz637CX/54coooUdqp6BFYe2mYooKwarp0vdjqO9XGnMkRyOq6uteH7SM8XB4GHRLzkA/4/7sbN935chD1ENkdIIDVKHTGwiktr1P3Pp+7JszsyWWKkrFa8EmjgEywH0OsQlUoFcPPZyDJx7Pu/gnApzYcWNKTAPOdlC/Y9TbNavbH7ufsL9jn7VGHqqjRrpYmABHglver9hVlgXZMYQ21nyxri6zESh3sWrWgCr88iWv1qmdff09MSd2XB7YRVTvfdz4jJgFmCvGkD8gOkA0wHmg89k/kECTAeYDNj/nzYzR9EUadp0KaqUd+0q1wV7wfrAx4MNBD+zK2MHycICDR5JoBGjc4Y/+uNfAP8BgDK2r4PaivNfZ/VTATzKSy5pVDi7expCh2PE5lS5FfCmF7dqLT96ZzojWYU32rgUJF6wreu5jtOQgtjav9JvkGH/dZpk68uxHPYPkAuAIzDMd/z2WzN2K2+dygdEhIu7XwQSWAMMnv/2+1+9M3sN6/072OCS8NDmotN4PzRK5M99fjDRRDKJnswaq6slFuknMquTo1hLlEgk9AQP3/taafpOgSDfpwfps30ku8gmIyiImpTxmYJUQY7/P2awd/7+Hbo1WHTL+C+wS4JGrSqs7Zl1TW8ql00VWYxRVdPaSM5lZChTuYJYUawgyBWEqZ3/mquu/ycpJjQjMMp6s0qv6ZURleO+u32r/Pr1U1AUMMRoQjKCjCSk6UeH7jdJgN0k9Ag9ZlZB3gvNSEZUTysmJ9GjHfdwOO2eRA/Xw8L787XvHQmSLV0Ml8EYY4zJ1s9WzYkmsrtGvmOF8ITHBGNcIcRhDuN2m9sn/Xn179W+1xcRCRJCkCEMIiK8Zc1qCCBi2xFWY4Oe8Ur7XR/HFg3Ei2hUMqyPP38rV/SmrOkZJoGIkkfS/op+JwWoByDxiFDESCNRo2xBbHMG8clvTFDCgUFAHRVWYqd9768i+ezF9ipCr+rnVuB+X/J4HXZYoHxjEOwiy2Sh6N7ctp/b60i+Jhr/hvt7WgcpJOTPpSrqFbZDoPsV+VCoXvpPeuGL6/fpZUQEgrCWBuQfkjkdR1ICicjsakvrWl1/XbVUn7+KinOVky1DqqQJ648dLWLooCUUTXgC/PbFO3qP3XXdRadddNR+O2121FrLLTTb1Kwz3visNtLgQPV1UXckA2cWiaSTNLv1iCuDTI22sUZ81iRGSOcOJbjiTxyRaGnSM+eaKpSLbI8rNOsGG0GEE0sVGp0z1++KRBSZDa9l1jf9wIYTkdjiPn2/PrkvMYrZmpgEHDHHXwmWU8b+ugrW8fgvq0JiLCOWBKyFMjbBRH6mmy7AHHMEWmSRIEssEWyzLUJss02YI44Id8wxEQzBuPvsiKUEzFCIsD3tk+/gl9/4JmnhMKeuaqKV+v11+btfe9nj7vZ9833V9S72YWfv9alz89HGG1u3bkebGm243jpqKlB1ZRVWUFaWdMdmReL445OZUcKHLLm4om51wLXqbgT//Ijv21zPi+Qy26csf5MxUaNe7wiee5hqkxULVqWv20E2LiKdQhN0AuSPOKJkDT6kc4c4SpDhp3JbSCGFXHSN9b1UgGZdaU0lnFjy0Ogc6zdLMWG2di14GEO+p21t7GetRAVGa09rGfY4iViIxFnxv/TJACEAdRgQMGRKxII3I75CuRllAn+TzBZmriUSLLdZhm2OKXLCGU0IqEYAgfhBRIip2lovCYKCWqiJWIhG9hMSms5Qji9mladeTwaobCqUz+eU55Z2Pm/tbZRAkhQwUzqGigonSzFelZyZmmeZ66QLC5RhoiH1DIRNX8zIZExWlmxUjuPkOl6e4+TvzVPTYPIsps6yVYAyFqEZhG6FwCOAR7CYKrBjFTpOkWMVC1crDMxMYrgjsrZC57EYjPLU4v6ra//atpr+YsuWbbEXfn6duTk5W8Yy8G72YbvqzV9W7BJctdtAlLDaMZoK/6wY+TRYZcoJ1KkjotVI7JyHDBlJm39JDxU1zXAzddeiGuJGwu5RNN6aJNN+SAH5xjdWiZMR4AfwW0ujrLnMQTnstDNDsBEuvvBoKwZ8TY0a43sTlOk5pC3WgxS3SpRBnldgkslohmcJWI4xNVWaNEiqKzCSZkQ1nRhMgosZGw3V9nBOAlcdp51pkvpMvb95Jwn67RPVVb+zhUGew/peK698VMdhp50pPy79VD7W9GkjMBvWbjtyttzE63f5gMbcsYM47LQz5UeFn3brK2biAJ49+FFh28TExCRN8qbW8HFBq9C3VkazcbCm7Lbt3HNh3mrwW2Qj5POwixsRd84DvFpPZ7I8cjzz+NsZPwp+ErZSXYGRtHRX/viGoKrTrbidvFDE3KiF/Kj2k/pgz9Z/NrPLPlHrBZ3JYnM3seMHTsTJdKoBKBMzLs8znIdZLoMtGK33M28DzlymEemiKjlM5MqTX9RzhGa/UBKYZrp55ttjr31feCibreLQufIF7TXzmHXGbuFUcfu8lX8C1HMj6N+IN5lIV7QYfVn/btnuxlETNwFp9v/SFAunS8B6M/V2YlftETZskCqOBXPkEeueaTVo1ElnXZxz3gUXXXLZFdc8aMmu3xHXbvECafML6YEqqIaaGi1Ow8h5bAzwDfShhclshPHCR1aFuY5nHD1yLPAf+C/8r4cSYezs+gVN3xGGaE/b2sY0M2b3R6S7eNhhA3TSTk/yPHAD8yoU7V1DpVt2cl5RbupCcc0UwQxKGQI8vD2g04a0ymyQ09x2qJX30ElQgZfIq1xIlOGjVPcZVrPNDNshKFcyl+O6UhbwTsSCFtI3KU/liyEFxtCOOG2XH7Z90TSDr5FZFcwSp3hJdhWAFToqQescVeP0SgCO3SyZML1yqLPgPmWKvB5uZStuma8ontlG6kk2m2H7iZ42ryoHT/rgKnhnTW6KMKgGX93YtMOF0H8lFdfqXtBP+iLuEjhvGDCE+Y8MaN0M6CHVu6YwCmnQrrQAaJETT0Y1loPggAAA764kp/TRWJdk+E12aAWwPiAn0ka4uX6AUTOAIIsvP+hk3lkGNmgel7Rb50+PrSrw587wwtyFzH4dNQfFEZN1DltWl2c3iepK0oS3Vn2NYEZm8AoCIFqmYcIjzGAW1LAaQaW90nMhsprDbKiQYmUMB0rbUIfXo9KQNbXPqnnRZYMuCqrDYAdW8YNHZVeT47ALgCdFKDPMnKnYQBI27SOtALXG5bR/tmwZRX+d+JcykIQip+FhVJ1e8VskQYc8sbKqbZ6YtuoWeCC60/HzWNn6FUBLzT0u0E3TkRFUSspkjjpMjFa34Z4hUvRXP5LdpvYTjlEUjYWEciSFdpRccDW3tFwpyvYYCgm5vlFW2eDjK2IODystDZSps5esoeIvSo+T1CSY1moi2gceZ6KnHlTTTwcSR6MIktuh4z3HUw2p7aBbVzlGeYx2el2FOKlty5EteUAFWAt5USw36ktWZO4L7aX6fn6GYN2YG/XAVdrBhNgmFRJZqpqIvHCfbadJI9dE4JGaJuSpzmoQMMnj9qDdMJpA8UQGFkRkIfgLh1/WWCwzZoKCtc08sGZdmapnklq0jYkj1gE1V7l8YcnzpES5HFQWTmDhwnC9fbVNoVlVHP5It9ld4MWH8yyTjdpSOO55ADLYtavWnJEKZV43JVw7YK/2tSyWabmyJqy4ZcgK92UyUJbsQ5COWiJi1i6J+IjJ+SXYCONP0rTWYJgWj5aizMK5y3M7Ksl65Z/3lIZBA0Jh5Oph/rZRGQm5oIGM7nnYU7/DEqv07fUv0FNZWbUzPdmHLrokEZquRka94yB45019kxWCJfVE/xdZQtY4tmxZsufIijMXtmRkHCi4c+TFiwsfAVwFCeImRCh3SVJ4SlPMR5UqsWrUiNNJF/FGWiLJMltU22af9g44pocTzgzxt6C/bUptUNCMc+baYZTjICDhtIkFGAEaWxjgAQAeUNqFpfgoXVB2Q7VhkvbYAYOS39clS+tG4srSspKTIU6fkvFFBmRiQPOhYcmSknR1vOzIQTJ0BhQqZrmYgCmbA74rkE8Pvvw+ZYBZDmSAPkE43rEiAnHo2g8zAMaB1oEBiHYGAANKJzMJQApI7bLYAgwBjYHSBQeMSHM/bJIsV3Fl6Xwh3QHM0vgjw3FiQHGFRtQak+7quSm9QO7WgFnITkTZqmRgUkmMLQbSkFzlLP+OpSLJ75kq4vfyg/wE3mmejfMvZ7/6lXHEHCz7OrswJjtk/hCzFlmDLBFznh9ktDDwqUT6dbqH9pKGpf5I3UR1kU+Tu8gichTpIMmU8i+xNjcXSjhOUBCYOAv2C4wB/SM6gJpCKVDc8AokEZmgA6UR8TeBnxHnhaxEEecQUzL+QfgsPAdOg34F3QN9K+E0f3PE/N6rOJ6NdxpKulExWYuLMOQx5LjQnVSbsns/ni1pkZ/AD7rp19dCe9lMdVXPBD+ngkgRNHkf/7lEG4Epf8PoH8H+hKn4X+MW4iix6GWL0YOgTBW/+5ir2D8tvI88Ef3m+l39SBUsgUHKR7aGgIrPb1eu25JmK9aM2NGV4265bYJ3plZPzZLOo9Vfge+wV1lduUDBCS7eNL9SEAmLElP//6U26WrjxJxbk30zuYQPmpL7yNPzNr6v25kCyyASQsJIBIkiMSSOJLAklsLSWAbLYgiGYhiGYwRGYhRGL3N5Pi+kYiqlcqqkaqqlxqa5aW3am7W0njbSZmK+HlI/ZmEdrEa4yzAyjk3hYVdqYbIiWx02TTsgZzN+ygxXlqw++t5UY4QQQgghhBCqpCnNqEZJWUVVrdSbjq6evoGh0aOYs93vZhDigDt7FsKDhZA92HTJLKUMIkGGGeY6ww1osmJ8byqWG8BNm2BLRkpaRhYChcERSNQ03eZSvhQAKCopq6iqlTrU0dXTNzA0ehQDfnJQrvZIt/R/tBm2rmxe2hNINeNocosAaxyuRr3IXYu8o05ppGa00I4O0UVP38DQqKy16zZs3orZG4AAgIgcXPCKICssSkR90lAYy6pltyZWlq3JlipnoTH143bmj3GTBQEIWVhEVEy8JJCklLSMLAQKgyOQHWWEbEYpsBSVlFVU1T5ePZmEEEIIzdtaw0/KcIiWbAZlUEOziuqtKQezW4eVIQ4CPoFzzf1cKIegoFCERUTFxN+1CYpdtsqHBtKUlnb/JZVwcXHPcolEnVGeVqDn0nP1x2QyKTDuH/x7Z2z6UBRFURRFURRF3alYXAtjjDF+m6yu9Uf1IR8kNZ1RdKUWMTF9WMBZkQP0LGB2nufbzTdBllCERUTFxJt4SDcgZZJJJj8aMum2dZyuUH9ibSdYmW+r285xFbS2HNk5FbK9bX46rvx7e9EuRv85yW1tuVwul8vlbtoGRzNa2qXTdvX0DQyNylq9bsPmMfNFh/VXd/9Fx18wrgVKgLG2uCJM8372DrPdT3h3X7BxKAgoRklZRVWtNBiaWtplLa7bsNn0rV0zsBxKcsDFW/LJTMyYFtMKZRShZFBFdYWm/3TamU5Mkisl0F7P5G49LqhtCTsc4bTxARbWwvne4G8DgoLzkIVFRMXES6JMSknLyE5PNdNi9h04nD5ukBKFwRFI1DQtKMd1Xi4eX7py7cZjTz7e05qlNE3TNN327fa7mctK+vxVi5klaSlBJiYzLctmPbW3jmOY8GDeygQRAAAAYJYyLWPfgcPpUxFntPNycVpUUlZRVSuNtqmlfd4VWADFON1zC28+sniaaVrMLJRWhHI+qFbqndD0K+3tKBN6N5/t9xsbU7kEYKlt637BxpZtO5vje2eLcdqx5lPwtEhoxXwCrG27Rh7UFhYRFRPfTrxPZqmKNDKyH3uqNiSOx0DmgRoGRyBRTUeJxXUsybKVkgMgXwr7l65cu/HYk+mnmwZbU0u7dDZdPX0DQ6M1Q+ooEgExcNLcwjuFx0M1IrU6NNFYMyWwIYRyVzDhTzdu/r17IO+tb+Yv8BkSdbKkIh2ZLmsgTdMT7SRQYHAEsqOMkpAwNDQ0NDQ0TJjnNVraMyCEEMKEPz/bY9IYABzjGF5XsTDbGUKMc41Fib5ColkZrbQ24BBwFkwAAHx3AAAAAAA5OWfOnDlz5swZYhjmnTCd9CWA9XrjygwWh1W+LsMqPFFWPUvwCAdktEYUmK6t0jcEYhiGYZi3aeS0rxwOh8PhvG2Hir95GKiQj+EiDVn2NxWJiIetipA8yi18q8DZ4ZidIMvfRSLlj6vRBo/VW0VFxd99kZKOsL/1d9iFx/OhCADwzoGPJi+YkHEqnG2rGItOBFEgwEx+hd7WjWoB8M5Sj5CTkxvnBAT4fD6fz387/vBZ53NPsCj4iAmJifGrjiSrDAe8Uy0nf1rn0qRP597684CwPZYZmzU3TQs748g/ZtjUr02Sxz6MHm2/gFFFq8Za27fcVfXJ3iyQxs9kLGwX3NN+8HjY+kOuHjNLr9XDjY2NZ1FRVbvmONc/+lxLTEw8LSYHgALMGlWnZkfAWZge4OSr1nwgkmfn/e/OPJX3wpfzdwOwhzjQF4PdHIoj5VhwvJwA4KRTTpcz3ZzdPsczD10oi3F97s7wDIDXV+KNvX0cn5M5HA6Hs3RMuXwGAIHC4IgghSqLACxZtlJyfPKlMCkqKauoNnh9JubiG2zfAuA77H8YJtFdwP8G18kvuP9F/PW/AeB34L+sFU7KKiDJimiEv/1LSPTNw0/yAa7Pv32oySFvqzrBrNVKkkEGdTiNt0zYKFxAypnC12/7WfZm92F/Och2yJFyrPJ4ORE/6ZTT5Qzb2XJO2MIXvsJ0NfWs7HnbFyUvk6+vxRu8nQ4AECRCwiKiYuJP+Dccl2iH8jZvM6mlpKyiqvZx6oC+GWQgAxnIQAZqrFm3QTGXw1XB8vnuXKAhlBcpicu4TMimkWq/bI/dlNK2w3BbU6IrMpg2lVjy7HD4j49rA0+Dryhrjy0UW8zaqq1pqLnxr3aVWgf1CnuaUgq0ynTA0bH+1uCOVtPDP1KXwNH5bs6fChAhShSJkfH0hGCKkn4rWB2wDdhV0gI0ZhqYlV0MByjzZyzIoiXLVnzohq292xWi20CAtIIR0uKdi2oKD6g1Wl2JgVzk91pC5TZVMIIYweicTJtzqxPWZ3oTYC1h58ndZfao8nmP0yYBoVAoFAqFNjY2M9z3oHvYN4FtdtzX8Iw0OeSbWl557Y233n2M94A27acIc3Nzc3Nz86VAyY509fQNDI32M6REBIQPlNglw+RxaFPMKnE0Oou8jo1yOSMu8GHhaSdOdr5acBzHcTzxx9M+mM2vGKWc4OJtS5gFk8oWaoqu1N/M0Dfm5gZ/fDv3q35itYwfuQ9Y2/KP3WuRjJS0jOwwL+PE0MCAI5CoslguWbZSck3+sXPt3K/R1dM3MDRaMf8QeROAL2PYBTFV7inr3JR8qqsxbd7ExtBhhufAN37yS6ZqDBzj9m5QHWq/NicpmZltN9jvzr3LpaHTpVHrbr/s6oU5f7prbqb5xQIG9rafXzBXPRu0PV3dzPAk1TEvYsCWkK1/KHGUEY55OFvU+c+u4RTebXrp/qrlzEtr22mXkh8Hs1CERUTFxIfk6/mtOD2G3CKvUhBSVFJWUVWbrv/hDVNTS7t0/vDJZ1989c338vPlug2b9zE7kjUBtx1//OTKEgYPjYE4VBX1YGmfOXLCkK9ykfs//T43Rj6lUBaVlFVU1Upj1tTSDkb9JP0jIiIiIrcJXWoytxwZurcepBcoTX80gRBCCCGEEELulEoe+yBrkzk1az6+Eld251TRNUEPnAhx79YNGkyHGDDsgMTkVMknXGc6REQkseSfdoQzRkyWprC0VlfIUWutXkBB6bzRfU/dcUWqt6PP2cWOT/8XHWEA7rGsCrVy/QWR+IC3feGu6N+mLVJ3t6LxQJfBYBB5xY8sp51I2QucohKTi2rFplVsr9ip3Z073cy+K/vjwLTKzAmwPTQcrjyi7ig+yWk5TZLkRK1ffTW8DsjgAxeI3kNilpSUtIwsBAqDI5Coa7veQgkURVEUFQqRSCQSiUR9BBJ34PJQBYyC1c94Kxrdr5Db8Veebv5f+/98q+jWG78MZHdPexIHml1lK63qYRXyPMUVZISkSVq1SVrh0eMlYe7lXr7Mb3O/6qaouhy8T3AyQAUcghu8IsgVPlASyssUmpgEqlAXzaCd6NV0p92WpfVs69jG4HjrdIwTk+ttGHFTPNrtg/xxd8Fe7Iv9/OSBXq2olMPxI3GUk8eI42SxL5yjub3srLBsnys9n7xQLp5/Vcidhs9Vuk+8ibcl2A8Ji4iKiZfEICklLSN746nZrAZHETHPtSQQCAQCgUAikZxJumg+q2XRkuW0MqP6ViwWi8VicYq3UDQSnUMDafSzwCbwdixid3wi2TP6zri/0aRj+kp6pKevFKgv9QY+3Gqo9aSepzYbK91go/u53pMfvqTJYzY+5Z8VgCb+C8kJD0Qvxa+Njo37mEa6rlOq8nfdEky7J/QOrb+RvmTUzHWYmOM3tQRewp93gWsCAABIUIEENwUMUNrojM3T1rGUBhm0ll6MQ7Py5DyrKUEjXiVpRfBwXK805qrWrh+4SnQCDgaZQ7lwRuT7KKwVo1xdhQ0AjGIMLrph6PyzUUKzGa022u19WqyT6VbUYj4f7GgoRsoY5Xg5wXbSKafLmY5ml/NAPTSuf+mWm+I15Y29nYO8UqlUKpVKgiAIYgYECoMjkKiPpAHvd+HChQsXLo5/VNjw3q8+M2KR2XgOnotRzy4iOBO+FXk7fif5j5E+83jPpDB9I32rCDBNnzlG6h8q7h7V9MAPA0ZitvY1Jb8SNW0dE2I+NamoNVPHUzrV6fCqtwy5csJasu7c3zO+Yh6w97i5kb8jJIkUAu9zR+SqTfKbYvAkG+Dqd/a6w0WGrQtPCPRxMHJmBqvDrm/d6XMrXsYfCZIQKyKLyZK+kdIKvrIiUL+00r0fRhu5zW3NfB2WHtu1kVfz3L96qzujSmhoJsxacRoumdcK0CKMGCuBZZsv8K4lShHFm1dSSlpJLnPWcm2vOWRgmfJa/Xf0bX7j2qYL4RimkEssm8/d1ynZuFzkZ1FwKRYq3apcoFJNqH48hZDKqpdEnr7nHoYcPOX3nLj5YRYjZQI66ZTTcWbsZjWEuremacf7uVtHWERUTLxLIPwyTFWkJSNbpvLPBclQGByBRE3TzeJ4yXK3EgGIJPJejSvXbjyuv4IeJ3Zk2mIzqoJ7jJ0Tgf/c4Pvcv+vcWN66G7/jTHzy2uosBVhrie7LaKk58/a0RpFvSqpYTYLWLxcseaROrIjC9dsiOzJFSZb0wfa5rdwbQaCrvampfb02h2vUGOAOc5lx3Bqi8dSrJ8dOVmrV0sPV1NSOGXWbok0XKfkLmw20SrXzqK/MLRyMw5dPEFnFjKF3p1+XBiT+rna2hp65zC8tWLRk2YoP28MeLdJ32x5Ui8VuRa0VnuZUdE1M4GqaTp14Bm3I/BVGpwoiL7jy4QEHBt/QVrX/Zs4Yb5gd1iH7Jecl75R/JCAJCSHkaAJku0SZ2izUmKfvyDNkI3cJOAIgaFy8g+vaFQ5CUBN1EAgCJ5GKTt7vbt3V2+qbMWCEDx6Rb19bjqPKleMp8WWFE8k7o6lxZtKYTqW579AVcAWmAqmQr1CsUA7NABZr7Mmj9BXog0I2paMSx7J9/LMTWifLqTi7F+c176wSyYxye+GOu+6574EXXnrltTfeeveY6crh1WAt/zNAHIgLeIFC3Hz5/FJMJPMmhxxyWZe0L2PWQx19QwbyYIol9VUpyRCZdLskT3KWB3lS5UltjF3gzoHuAAeDdOwUoCpVuUNNO8U7hfJJliPWW9mjYwp/ktl6U+7N7CP2e/pAJ4M5hxwpxySNmxgm5UyV6ZiZx1ntvlP9XNBrSQ/i4XQeCdYhYRFRMfGSeEhKScvIQqAwOAKJ+sRpxPyGRmyipf1AXIfXdDxDZHVVJawS2baXQYw9jNQ8rwK3bnQTVa8rMJ0o6zcZTl4DSo03Ape/oIqU/zVY49YOC1A4v6hWrd6e0lqrrddEvTh9OAU3m2Eq7HAe6Ba8LZ/xNygArzgp817WZI4E9UZ0MrcvYXwyQ99l2Mi0g2X7g+22k8paQTFD9MB4JekYCSIA93EpLLR95U8fgFuE36px/f+UTL9FtwlQfmNLlmpQngugI1lKZlhszgzlsRTIj0M0PnNDommkZKxogh2LvCqrrFZ1V/uWq0aVnpt5NFLN0tmhhbot56/uwYJh/Z11sUmlI1JF+z4MwJUuSvau4Qcno2wj7LyzqO0oEiaqQF/rREQPiQrl4qqFA/S5jsuha0YNars2DkxMslyTW+M4LwB96YwQ81rw3NbO8iHsYIJ8JAtNt+AgBPgmdDFp1/J8IrKy109q5eeT0s4Anqu2hLRh+apNOcMJRSZjyvTFzTm3ukxb5VmXUv7Kk+8HEEIIZz5/mm1GiwOdDgUhY6DA4AgkapoGFplvLFi0ZNmKD7uHVtE06GqMPNC0kWUDu0tap/GZG4KV6FY8l/TYk6TbqPyttI1aC32cHlKFgiMMr05Z6XvCjFBU1XOvSWHtoz6ADsAy5AcLHBluZKYnkoCAEBAeSdQbUbC38IKryn9d12+/SvP0lE09XuNyjB+IIEoJ/QWHVl2uCiTW+jNL5Oo9l+4AgSbyi32wxycCoUiKJDjhaqX5N/F1nVp3Gkk+vzMrO16bXqMv6CtESAV/9vy+uD/sa/1Znd7je9Ou3QVbvIkbvgH8p+fxs/AcfHY8w0/vE3xsj+LB54tJvH+/z91T96676w7cFbfnzrt96fXn9drzf/vd6+DVe7Vcefvf146LbjTvhVRz6d/s7W+Lq9svN+kA4C7+dhHzNB4+qLh34Up4/h2yFteG9daqWDlLtfiLuYgriupnfgpGN8jR9bCvutzZMY5tAwJSDAmHBIloBgpviYn5CGd2VPK/92/ZKqXVqOdp1KhYs3Ylug2oNGlSvWnTGsyb12jRkiYrVrRYs6bVLbe1ydvT4dCRQSdODTvz1LTn3lv10Q/3/MV45r//PWcyFKbCQYHoqsktl71oFM2iVbQLKX7CkBkzKyVQ0AWR/oMXsRK+J+P+YFZrwk/lj0DQR1vRxP9KSR02pTKGWb11UBr+etfuTuoTBE3TNE2vNaLLtGaebpY7BcUtSrgPPnpgUewuHv3WTSxWLMWylTVERx8G63nRTPzIy+kh4T9wrb9e3F5NbIb6v9iPkdjW6VhPeMcSo6xiJODf/x6KNxtLHQuIaaYz6bct84WbZC9PX/Q3nrOWcJChwfBN8a1853s/+skvfr2IIps+1m8ucOnKtRuPPekMsVb+bTETAGDNkzYa7AcwBwBzZQgrZal885emLNhHKMIiomLiZS1bt2FzPwQu3CsW790uw0KPGvGgvL+K0H80aTEf1UjLyEKgMDgCieoW1KKZPXr0OONeSv1s6qti2wVaLWWVVkgn4nWGvH+RrGvMwKR4V/LIaNd41+QIQwSM4z0DEn8tER7tsS2CLpkATu3qcbpjp3X9loLVFk9p6Lg04YXHrELzvL2dtTmSPDFZrBAby6PdoyJ7i1yUPPR8Tu2DdxmM6ZLgus1faE/oZnF4EahLILV5ehS0vCYcHWvIsoD7O9Fgy43WtEFG1DupRs1FWv3R10QC7dGFIX+rmO5CZN3VNYSMji5R3OGjoS+TxLg56xien/R//CaDFuPPQWEoOmlpCrJAsRLYg2HfR/vjQFGZ/qGGf3obXIqmJFinY1zq+5NGvXl4KTZN7rZP+MoE7BI4BreAFyXIcL0qanZxsoXfUUS3w5WEd+/j0jvuhW5OMa2zMCdHdeBkR0AWKDse0+t32EbyzppVd8zDViG2cBovx3jGy6aQ2/NRGI/XeTotOSI/1IV0pKunb2BotPrJlpDm71nkHx0s/bO6I+5zVIhLJRboZrOIEEl1v1ua9G83rztKROzNpUmm20sRIERghPWC145T6HhFjlN8Ir/V9DQi4VJH/9SxwPMLOAVVXK+Ss1AjlnUfaIVIEoAkB4WwH4elKCFRPFjKE6STcTW9Ko0vyRRbJz7fhbkaliAEhEJLFD51B6Yy/qbH7f5QR7jeW9Wxw25sdnK/QGiNnye37sfaJiLPazfWEHxZn2bwvq9aSKF8bFzbhhQEBgQOJAgQWJB4AqLYmr/CdImC0ktk8fAWIcri9oWmm5MQwhCWcDU/24DEdz/98ht/9XH9NcphhEE4IcxAgFoI9mlRpK2OQmEbN3Y44LjVCQMvXEkk3l1MSI74D3qODbiOzWZ+Ldpe/qQQmzrXr4VhwagpZ/OzX6hvu8+nvh78wmxewfFIlEHbL8qDnF3424o3XSu/OUw8HHWxkPdQSEpizJm978Nzfa1veAjHHF7bbHLOdXFW25qP5cBgt2dcPVfXaV8wz//lrlVHjE35FOAg789qcP3rd0w8URLOayk14BiOMqDFQNgE+gAwe39AOEg6/7uW/vsLldWBP4HcALIO3Q06oQJjumafv5R+6KFfi4+JDIfOHy8SG/lvlL4m4qFcWeExKBrBIFGQ/oWBtGsxYAoekBdP7cjXCZvN/5zmiceR8BMhXpkmvfX3fymn7Dk3l2dhvl9LGZYRMbJPhP3AfsF+K1U5KetyVu7KQ/kt9l61rvq3ulcXavl/0z/Qib9ICco162NhOGXN+ye9cglTMMKXfy2TMv+x9OW+r9kbN9kP377l8H/YqDk8wRL8+wD/Hr0gdzzycBPA88P/82lGikix09vTI3+Vv/Lv/G/RLyMmiCywGewFl42HmANATPu48PH9Ex+XYsD5x6xGqWxdDdcoQZYKlbroQSVJmjoZMvXTV3/lElWpV62bVK+ReTtu/FeMUI0mtbonAiWGGGawEZq10GvTXpFBiYLOCx31csFFr5zVaoCPzuug2GOPPFFmg7XW2WS9jTbbYpftdthpn9322Gub/Q474KCjDuntiNNOOOmUM45baqxRRhtvjHEmmGiayaaYarYZZpplkrkWmme+xRboY5FVllthpdWWWeOYJb756ovvcuRSy5NPkzp8iiHJ3ST5lCSdSaD89aRfM56/z86vAJOOx5Ht+1u3DA0O9Pf1rurp7ursaG9rbWluagw21NcFVtau8NdUV1Uurygv85WWFBcVej3uTAW5+Fez6WQ8fPni+bOng36v22l//F52cnwtjWGQcGN1UqsmEWHCjdNaNYWTwP3xzWDIEfTQ28HIt5rGWjFsocFl6/gLxVKzn7cLMZIbb4RDf6PBmAfD3FNLZ0AdnJm8Leou38ZfuN8LlqglOp06PdV1Gum+CuhRKCgoyAQUNZ+NsGQqqk2k29R28ssohpwwGo4t+xVtnughap2ERl8WFUqpA5ZQWcDc7rl4xSWBeXIPMbOWLjEKJnGYY1ziOn/51ELu+jMiOJLnL7227tAMm/eqkWczNQmEvUmkbF5tE6LLQ1KrRoa2GNNPpajTnyq53xaQiJ+q/ldGLAl1iRfSKAGEUzsYFrRwiJqkLx2MpEeaYLY6gamR/IOiaLkkbMs8N8HFvAUpToWSkLm4U2OA3OV5DaFyCXqOQsIbMALmbGdFJGVxj0/29dHj48dnOy3sVKRP8auwfUOAT9gPqYViwDhH4ZLMLq3HbAko6AoasoRG3cxgSOWijT6Z1Vk14wea3P8WoYVOnXFRr+8uo1ZtRTboOKeR9YHJCKBIEMOvwBLEUc4ae7KOYKwYU5r3SMu6meR5ZVji4cO62YqFQmOgyTBvZ3Q7Z0wPPgxO841kmY+zu3weWLK34HbIdzC4NKLn+xYzElqDiI9uytra2SL0Aj4gHI3MkpG4TB8mDyMxJ9oJ4lUdYVzHLv8oeeRwgBsCHQ14yS1u0fVrzXhOBP3Sb8xaCojs1Hgtkcd1EznarJXrtFalVsSga6p5B8OoX7iXNz4ANJM0b6fuvQ+LRTHp07SGrf4+btzeFGKtxc0dTRGh6G4J5SU4MmUHF7SEHoJLAip8WHlOHjvJvUazPJtjfzUfK8G3KIztEaOji2CHm7VqakCStT8yqUjf6e9+uVi/z1kKzAPPP/BPZuZt3g0Ua0IatLgvi16d1KW93FoWyVEr5HxWMvKWlpIvFopjxhAb1KUowZKcZ2vh7ptCWGB9BLqzgJZY1NvHmgAub1FkKeK6D4tlg1Vx1WMVMA1SUeC7fKKUsAM6wt4CJisGJt1pd9iD/f7k58YKuHqxXlsbEtjlSg6PdccPrUmgqrdg0pYYmCIFMSIkQMm0BqEdoHWRWWTI1V+6gteq3JO/0Mo9HZ2ny8Ct+irfiq1DvqWElCSFyJ2qD1Q8cErzON+h0UC0K5MItoKjeheskzYdFyuIGVWaYIQN13g1MERQp2mxlShuSBiJ1yIlQ+P0SGUap4TJ4GDLKz2Yi9s68gaTWZJwtZgFx5YyalOczcI4xAN6D5hyj7FGbl9SVnqYT2HNxcnDD744aN5wDWd4am4Cyh7FaulCYGtbgZ8du50hlkeonHvPS2dEwDmzF+4AbVnDGCWwKjT4Wu/RGeYLcJdDh1zd7jymOkNVonQOzgj4wDPXHUOvqFW6a4tHHH22FB05sIwt7TEQOQZhHbYRXgJcrtbsTyHRniQ9oAs+xpiyefna71ZggDiRLT0pmMz4Sp1QX+F+RM8PFMsPjlD29E/7JQMoXXMJntmTY3udBy66bV5C0OiEzQm2zZI/9ki1z4E5sOhdMhgHo7efaKHRuxz+p6Hd1HRZtocmAtmcBaHiNHPL+2NAvf2RgbTIudM2J23YtyQcTUBxNz2FEwGSjWBXfk/iXxnIi2/PgN87MnJ36OhAFJOdn+UZm+aw/CMd/9IDt8z9OPGE8DlNq/50WEqo+n2zJ/mCgpZnrgXTM85ypD/rj/VuEHUPX68l9SKlBA5w6BmzkY8YDoHckwQ8GR50H9CR6GCoo5V3NzrBPvjFuyNU9C2F3VwtNB/WAnHyonf6I3WVin8LgbwD1xIDaVi012kLRbnS+6Iza+KtMMKYNcrTqMho8u+8xlfoAkcaAjKPbJtkMiVkHsBAt1irVSoja5kYhEi9fRThTW8DlU2JjFMFzY0MPi8a+OSQIaKBCyK9vMGlsTdmJD7dxO+ZfUGgKIMl75JSU51wXVPvZJdylcMGbLbmoekns54toBNgeYQY1XdXBd64WlVzryU071GIPJ+rDDbOr+wTVRa6gwRhMnQhdkn3qd/nFmz53f/mZjSX3WbvFwFrPfsansnTA4PsyacoMK8sZp5WTfx3hEj+/zEIKXArexTmx0ZrouLdsuFArv4dY8WHD0XO7y7odQGepGzNhKdfpETEmmo4v+ZpRC8ezIXRrqU1GA2MJxjnnjNK7yf3HSGDfYwYT+DSR5LvCGimbG63TRWZWrJzjJuoENlVHKF2sAmm+IxbNVzyR8Tb4KgUeMdTc56nIYgnne3kfWNw5Y1pJ1KcSO5cHeR/V6N0ypsEijHNX1o8dKHOX9nIezCE+NRbG9f1tmguZj32oppm/kw/d9M1AkV2No1KyMCpbH4F0ZeoO5SWzVfjsVVU9gpuk1u9Lg8cGSQtzKLxMz1Q3aPxBlg19lSJMTqhY2xnC2ekMhPIK6gNFFdQIxzbngMgKBFxyRuIBgDZDqI3NH0CtD5YguIg5HJouQF0b5BzO4N5Muikq0wMSjQSAQodBMevTBEVkDqpLpXnyN/5c0hCaX327UAWS1ReUihXmW5QHZpd7kZZX6N15/WcZCi7g2xqOHvOTIYQpkG/GczsRhYB6QJZctlUXfHvDLvY4uVnPvZ7JrVM1k5Js6fpi7GmlF3K7ixm9HcnX0WxG/ZvXCsTL+4Q6/Znvi4QGIMJP85FEF/Ztab3LhpstoRPMuFs07TELbj/c42f1anFbdi2kiQczC48rf0Sa9YC8Nr4vUQt0zeDetvUXkw1w5Mc28HjwpcSn5pd7pIc0y37bOV9koS0Cl/etAK7gaYUzu8l2f91UDuxC5rj4CXba034QNJKNGZ8D+c8YCQi5zWmpi3e9hKwgz78woKqZMVDPafBVJIRZ44EyCKZLzN3xUGMhHKV/RDh6gHJq4O9wCQlhNA61QQz9V4usGLsbUZLXLo7TYUlY9PnBeRq/hoJJhgigXhyAEW+kcFN45qBXMrKNRTJ7Wwwe1VShdluPfX+D1U4Bc1N9SASVsU3SnV02YyI0a6zOYsLye0iIGx617fFBwvsEALZZm+JLtfzmKuoPx/fcBX059s8zK4tyi2RcUvnSN9ua2g1kv2Irs7AVtGB7/mehXTLXN14ZaHfHK1zW27rvE3LnUOfm+edEroIMfixSBrPEismGzauMV1D3KomkIyxZ1DBAP8mtGOSOCc6D6tJJRWTENOweEnkCD158ztvkl6n+ppHNGxTxO6CPySQYL6meVqy19GLRvLbzSoWqOKEPcc3IsSk1arDw9w5IhIXrsb9xj2nxaLjXUd9+gVtFKGo71iZ1EkS7540YZaJlHZEcVHxKvv2m+xLRqFWjAmPITd1ZlcDa6G1RAVxkajK5WGWo1S/vauXAIurBfmwCnm+6VY0V2XrTBQjjGaaQKWEzO5lG0rv9x77wSqQRGJf7u1nqjd3N3o/bf3lrHurBH4U1qcY2CA5ANkwUBTScWfB08qy7KYV5ThP52Re5AkzWHnKDz0EgqTrVshqoSvihIrKo5ffun1dEmIfqqCJBTpNu3L/qjCob5EgqM7A58RcwYI8dbYQEIRgNTOPeBrOG0NQ9kwPCB8b1hKi0SL4e+YD0bRsjbz5TnQeBUsIGhnl7pE2YPcA/WxJkZH6NFW0OUx2q6/5VnD/dcggAGeLY2WFvGsCP3jEiwlJvsB8ayR39XzaGhQsJug6EzkFvzIvUdsyqsMbgxDCCcB756vpXZYKhbR1kpFlFLLLMpk6TBN7INNuQ3Qk0rYX7mIvoND2MXQtaPrcTUUkCkqGAoc8XzwhFHLir6NQy57tG52eFnzVynZ7NbARquEfg+VrY+m6U97s8ucVd/26/Haxd/VKoQgSHzVHaDK/lkuS9sgm0CsdIaM3pONkLFaVwl8H4MfzPF29nauXwFR+XdPe2Vk4+RLw0YPPk3SqAeYAay6EvWUDsyhZqah0ruMJjhgrvl6TDnfq26Pj2fpGLaEqVCKYv2a3smBYv3dDYfEq0c5FTp2HvonlMxAvJtkRzL4cslpWh7NHseTMNUZYuksSHoIHx+bH8097IvgSxSex4XJy1+RYlqasWHaG5yq7Y1vWlp3R5BxbvCKkDTiSfKGu80WBhWo+GqZLon+StkF7Qxg1N3vP3No0wTJYxfJ+xG50n9zEjKqibbp8JEbcTLyn3+d3bVPwRUZ9s+Rd6haV8LMQMlKUn8ASoITkV7CfU8AlsrEFKuXdNnRsfYkwNqVftCSJRRNEr/3z3Dxoz8c3l5lhsElK2CjAOlGIZblSlScH3Prp8nDv0dNOrYiNGPwsrBA/WVEGHVbGfeoOge92Oyvh5dmT+XYZcqi1ga/uW23NsxfTfn8m0C1iq/rtfnY7X+9kSmY91mzz6p4pjD9qUmRghqsX6x0cqu6qd89wBdYXaNvYnMVRxlWZFiAwfQqYsI2B7SapUIrjgQgc7SEY+IYq1gM7aOuONZ+QzMwdsfNFGVmFfSB/9dhg2hks4Aijw3CUSLZhhy0MuYzNovKBfxETyEAMrW2ESIqi6zqj/zJuC7erF2vqKwcNW8FSIbqCIAoRbdV4j5GzkZSTR7/jDyRtG3sGSHofeOwu6dDenHyV28Ws/PGWhazeOvJhq62bgbG0icvAxRnkRqwC4dlvvzSPy/QPlQyXeQ6XyKUgzFFxgGVgGbgGFIp2o74bA1pjtMyJKK0ts/QuXGgN2KLsUR0YLIHx1e1Y6Bmlo5t23gkaX/YYW9n39a9i4pTmT11teXwLIVT+afEeggj2Z+HXbMh3GFfleoDW3baVc5//ADir1lAI27ib3oZUCdw4aMRCDajhlIR+7+ROvb/Jf160l6wzzjnUAcvaBpeByEqOqoWjcDodXIdVBr7KFxsU/aoqy3X/LB0gp/pc1obp1AKdhEbYufM8zvN+LyV7wOB+xNhT6NRN6u4IzsBExn50PuqN3hYJPQCKFe3cbvFIfU/P8w7adq1/mA7To9xtOkiqF123prchIDSkWeB1u7HO2uzV0Rl9rihvJ5dmoLy7HrTe1kVIXb60q644t70vMzyr3PHzH03o+0Y4i8qByAU3xlpWiZbdNJLcdsa6/nkxXIktHKRXs6FQb32Lq61v21cv5mfxBuNzK4ZGnIWT50uLkJMYhA4ds+nglfLByD5kDZAQKNtrkLbufnJzoFPyXjJvrfGaz2oozh2/5LIU0htB62Pd7+HR0w+IO1J84Nu5OL2294npDsPgA8rDGQSgvwncz5tzo2gGYwYLkFOSdMwPWVSvaU48mQ/ImL1HzB02UFP7BujiBBM9NpbOWbXJrNrQtTUTiuZdU2xkBuYrjnRaqbdl6JgAxLBIT6dWEPzLOrQYBBMthNpAHks0cihCBL1oOu/W60xDIGPiXPOmOa4Mu0RrUQ8i5NGJh4adumq1ldcotwpq38yfHUwx4zJZI8zK3eos28dG22F/GQ++qzfksC9ZZ4bWt754uu7wx1hx0rc73iNx/xpls6q7tse6yqD+yF5FVlRMBnRaERDwNzqVN0MO74q1dTH03SRmhtWzLuE4+Twum8cP0v1+tIjd21ZVxcmcwDrLybQB2LxAY6zhSrJ8ANFy7q2FEedbduhiHWlzc5MOFjaHmlYrDqrRcdt5IysaIsEWdlMOYxNBho+L7I0tG1Zb1syNAzbNnTf/b37BDO4c+GETcwBg8QigJmn89G8R7vwb7tZ3iceex3HxetT1PgLoNfETB0/syM3RCvlaH0HnJNG/4jEqaGb1Z0VCe1VtsfN3/qm2LG4cJh6zNwX11SRUNpof9r1VwFe6Mlht+fmsFleGkm/jfxaW1xP1zIsJnUaMw6YBGI5MJXKlyVRk0/0eNuB7G5+ndmawWqq1NvzTS82zCp4D8qu9XJkqzSWSqbhowDRsHDEdmgIBBTs2dnV2bAjaK7QrKpk9cKpAoBIVCQVqAYM5V8KEaqo14Po3jd1z//8lU5Ag6wqVuC0nK72tRmXJqtRzmww09zJRhjaDdbtTY/m7lm/6BI8eJwLnI1OCP6aUHbKWW81ao1HnrqgJ1pTXHMJh6UKBqZlUVlCN/IOUGjcO+pOBpezMBzxgWfkCtr2YroPfIsWTcomZpStjBskmFp9tL6Lpk/tDH+bFJybg3yrOszbnwto5UwufxqLjpQr53u2VzD/J8ZQ/mIwISjwZyCv+qwQBCI8UaENGrkJLHh3/qqjRl/UV/V6nme73cML+0ohkjrzqElOPLK2FCX99E+lEjeSS+YhEJI9M5iETEfyK3KieqCRjib/HqFTqDbqKte/FPVMQ0/2enOowjTc4sP7UtcsZ2waeaEx7MbFapVwprejp0sZc74nqyQ97rEoXC228xJCFbJnckl1fLdEQHXb+IN4Tt9Kg508jOekGa1I3Cgoy+enlyxG3YKPJfMIW2FaggrdHUiLZzeMc6y6K42DjlbmePO7aZEx1ykkiv30FI7qbPPcsRU9B7vPCH1azZJSKbKXQx86jYL+CzOVcv9X8sSaFwVyLhFwnCpusKWQly+IvcPIMCcFWk2n5mw/nfhj8qVaXC8qyKLl8azENZfSoNBoF1lpOQZkQzoa1NeU1GT5Ub37YZbVE2fWZwm1M2J0izp4oVNa2Y5Fdhp+5MxGmNN3PbeDDayPb+fOUKQBrSjoflM+zd6T/p8Kbbx6NXK16QHo7NOVt5QMCeBJ4bEmq5mho9dGRkyGT4RtWnALUnkIxf3OBW25UXMwYoFsrCiGGWXy3C4zrC0fdOFoRIw8v3+WLU0ARa0bSJv8UTg4+mTkYvkV0Alsbhq1NO4HLmlXnlZZkCjLefh0O4Tz4nCFiOh0C/g+098/CODgoHobjwN5DnzoAjY+DYCDxcVBWMcgzaDfuaWwy7h/M8Xg77ERHQPJSLZKY8nyuWmdeqUlizEBXy4nW7jxw1uz/3UNW445g0LhjyOpuDbZx9CSyTVIrJVv1JE4bGP3Z7GeNhgl8ED9l4Mz3z37SKJtIDCaiYv2A3kKNPWtVpnlvY6N135psr3cgi2iuljPMYjnPQqNlyQMyWraVxqeq4UEyY2QlsIP8F5lA7p/txxAw/bOCelm156GnWlbtfehF1M8U/54h8JRyNSU15TFZrdA1ryhkLG/V9+C/L0s8K7648cLe6gsr7T16c9trfPgW1JOts/1acEzW7IbKS6bRUOPo8ksbZjt7a0MFVesiRsOFK0MbegnPb5Tr14VuLu2cXT+xQflA7pFM01hTk0XY5vYMP8GwXZBnYJBzJH4pObu143GMDEq21C+h5DxswfP9s2KlW8ApVio54j8r5RnZpxNwLhfGhHM4cB5Y6y/RKlQymhm0Ml+6tarYr7GK9E3LnYZopeb4Ooy4Fb1MVUsUbv6XptIrKhVJo4iNq6I7atefIhNSGsjZlXGqIDe9gC6U3UqFhmwVKCO1UR4eI1uUIXMHuDZ7I3+9M2evkSwS7SAjOFPhCpAO5ObRHWKV1NeYhqJprmj7tZcb45MsM73HhHDDRS73NMIgPLZqVwW/PygvLbVFef0V4JEtd2eGqrNlj0Klj3TxPnDWln0z/Rob7VYo55bdtsFo7P2lSr+ls3WNz2wuCNDeC0l9j5Bwp+KbrB0b/wjd/Me6b7Pvle/YCwrdDcJ0DSS8PLxpjBSyi7Tuf+MIdkMQ1FT1ZUHwf03VXyLoIGdDrnCsvl64ryHH6arPEe5TyJ0i11mbKoNkp3eJIVmy1C6cJe5KZ3+rycDiH2s+XARuPZWpOfL5NftuDK525f22hY+6eXbmMuZJuuCt2Tr6S5nVx9aZKgQCj0zMdDvsf2xowXy8VytdlRJBD7CYevpQtjlwLwct0VWnShwitc1RHT6opJG0XJnCU8+1aryEfzKLja0agVh8mx3BVnPkWu23nUPSQNL5A5+7K9z9U1csX1kJITP14tgnES8sVVRpEV9UotNJ/A3yLIWb8ExZZGz+I10iVaYDhT+k0R2va2JgQzgmyBFQSduzLam9hpX5+eemMsVNNab6GH3d9a7PUsUeHr9EpZP7AzLL8hTJBVIs6aI4JUV8cXhQLkhSeKtf2171BJ7dr0PSQZl1fIlbrDHnfAXkKuwyR2tZIGBNh+zNxwV+lTA14kLhAD+zIv0iM4l5MV10cy14M03K76HH0dfy+Wsf592jJZ0yp/ah8G4NMbq6a93nGO/G5xer9PKaOopq638HNrxJnyL40RBsqSmZZ67g8vPTuClaBT/3LjOLzWSbXamytFwiR8dhkFRKfnNr340Yc9LuGmX9iqcjm3pLsZvREbGf7xfuWZmTHJ4kjcWEQndwvttzxI8OhYJSLxn3URy32ycrCmfa2kv0X4bq1qwRTkWxaLXHQq3LlEv4c6Kwsz1shoFJ9Wp1VK+ByaB59oZpSiGoVgiJ7rDh8i0d/epcfT0rM4der03V0uoyM+tTdRGfJhMU4CawFAuhzlH11Lm0/EV0NxpI/gvgBwAf/TXyXwTGnfnF/wtwUxSlFZOAbaXQnNgEjDNq0/ZboTRh4L5ryYvFW5cQ6QcpZvZIvag+ZvQyVYsGC9NrLuT9d+7g9EFoMjo3ZtMLqg4FFqSvOB+Z8fnGO4vKi9n4Di0NncgXVZ8uiPns4M3N0ES0Hhi+OsXx/r6VBq392wdDwrmr24dClJf4sV/4DyeGL5EJIl5IVUgvQCeh8+m0fN6vIPm9GyIK/lImXr2E7jCJmBSd/K5C/3tfU8YVuiQSTraD+zC7dbc9JEsgjqExqIzgthr6WYHBxeSxyulCo+607aoBwlmpTGrqwLbqLqOToVYPEzilYk6Og31bklG4l1ZV6XhuWgljwj4Mb820r6JtyTRl07fauh2tkX4M8xgQnVa8HMY+hIio3GLruQ0w2zBrAggeOd973mO9bo3j/3EvFi0YKadwU+dT/bTlND8dbbmUco/lDnb662ngaRvG3bGgaHpFrJPuSNUqbsXcxR36+nQE4XrGMXessJVbauJ/aa+JOn4taaQYMFMcTQnemwmSu0WWVEq+UmkRE6ITkiF5/DRz4qlvcULct6cSkw6s9jwQvT7NGgesPA9J54muT8pgx3s14u/1A1+t91cgtg8y8F4kn28uosi5pah+hW34KYmpwSdK+x/pE7uVjKtoBl+fF5NE1TAEAmMhiQB8hZS2oU9pdAcBLO173MVRJesqJpVvKF9Gomisnye9aqPqwHW/1qs7EGi//CgWVq+pEbzedCjdmy4sFosBYWnpK4pUi77F8kXICMi3M79g38pAwRjqvufMscDKgn02pXJ7q1bbbFaZJzTNttvbXiF2U3ML3MvrC4uW17lVmWJmPu3dDCyxnWixJeAC3+bRJJly1hOqyCUQeCQSizBb9OzfQVMRKUo6mj6hqZtGUxPJrxAg+NSNaVWl3/CRdCiYPSLVLMcrJ7DLFkDRoIVlWMGJnZaHJtGPIsPRBwp0lrg+LL3eis6oDHMBbBvtGwHhrvShTVoB4jg1dgZzvIHGv8JNcwgs0iTCHQJu+0VpjJEs1trVqkPuPDFOmByd/DUMvQue/rUx0+XLz7ehTIf7WkBLWkGVUleQiJ3CrhP2NI+XyWJmCfiAQPKeM/iCFxk3F1HlRiLdlQhEixmJsLQm7S4NSvKCMT88DUQcix9T4HyH2SF1a5zS0k0hpZudsvo1Ie+wcb59inigCzO9BzOdi55ekdWBeNef1Y6WSIO9bF2JfHcFYg/jxYg9qHf3mOnmcvY2SPh2SDH72oraqLGFlAbMMTUGgipM1VM/Yaf0LiksgLcw5XySTx74aHL55MeBj5epYxL/m1s+B/QdD5ycrJw8ETjxsDlZOFc5hzhnWbd1rtYb1m05gF4/nhoI/u/G8huPlLQcOASeQ6Nr5OE1tMHXJcIS/XPL53RzlXPRvwLWLzl//uaDOhhholGlgL7bnetd/6Yadex7ahUmAVdJpVbiEjBVwBtjNqVWgBOM9bbxnQAmWqtPNiz/AZhWS1HH7/UW6rVFRX/Hqshkq/3dIwcFXXvV8RRyeuOFhToEeuF4HFIhZ0QkFo1wuJe/dhJbna/aHVe2ura2fI0rttpXddWmsHm472oOW78ZWnDxi7KVj8Z/YhR5TGaSgsEqBLkGc4xjDQ3GfYPZLkU+flZdpDIpmVyxQ//9y+zfwCTwb9kvv8jUirl6bleRlvuDN4WFW+gsISvpkWBoZZW65SZaLvGs4JkcK6XOIvXBezTBO2mwibLrVQcjYiIFbM0JYB6mNNO3qkfcs2r2IvtWWoLWc952GIX5mmQqY+dReGLoav1za1wRn2bmCPm5tdyCnHoRPFMnsjMl6gYClLPpD12sPtbDoRv5aSJvXTqOMjwxMjAykT1hsWM3HZdv3oQO3YAenZQ3fcjDcn8viCqq59D5Q0u9xOkZnvtZi2xsHKaXjPxqEtqz1XH+swoOxxwn9vzE+tOtsfxTy9PxMtGBifCRr8wYkT0vX50mNJQR1U4s/Ssus5xuVn9WLLRRNg9dCb+arEmiZlbo2U0GmmeZSK12Q5Lc/88jiNKn0YW8xd1fCkLvJWKFq3Ac/xdTOxeTwW/FRB++WbJM5YnxjQY6OzaQ9y5eMrJ+1DSkDFp9su5aqdEWUEgaHWZuwCuTCw18S9ak1PtOrmDeypSauWUXvjl4nVxOkM1QxdQZGYF402UOYHd02JUKh0dsq9LrY5xMLU+VrUy+xZzTGLI6YUpqCGupszOT83igFZrv0uSghC/RytKjQhIiQqq6jc7vvElFPIlGLooMbUDl+RZ871FCXe7sAfC3sTh9o55pSE46Gy50MjNMfrW43RlevMIkcVLbw0WuVKW5UiFsdBDraVFolazbnWrL336+dvWhrMqiXLk75YrJ2G7E4BxYxI+mx+m+x3S5w6aLClXslEp3KhJ6KPxrU5hOWuYXGI01fHGZLk9AmDAkIaGRT8bkao7xytEetl/9c5lycmo+Z3LAOYNvNE4QgoQpY+OnmsS38Pv0xQ6nbw9zW17+Uvo51n4IltPx4dSaRcgFtUQGciWbq73HSch5AovPgn8TDXqLYPCt24LtbAOJZJKs261ltx/r8HVofSCGLTFE6HDw5W5pSk+2M4RCNzgUZrpSwXDpPp6FQcmXBeDrfCGb7xetZ0QjfuObmZQ8UYVY21BK4frU/2TvXm98gPWuzjSPNTWb92KiF/vb9KVGUyuLmmQg1MDmL7cMoLIKypx+51RUOd8/2999RukWcooVCk4J2CnPyK9PwDlcGBPGpoVrr13pmeuRC4cYiLs3Ec6vgRSff5+LbtkYBmlJmVHZzT63y9ay2y0+l7uQzYhrIRvJLTjscKP0v8bDYLUhXldyP1yTs8tZO0DPg8jXG5H2+gL619CQ5Dkw8ly2FXnFkCZX6eVctkI9oWOgGqhE9OkYQPxWGGTLrw1+JZantggYhOv3AILvUrjZYq1MTZOquNO1GOS3SaGJeDSRl2jI0x8zb/ux+hFHzclVjYQXDmNYM5YzEbWA97kknl6elm43m8VqGlLBvWRDo36EASALiOQ7FcbImBuYUyqjzaHm0fIUamKnkZOftU+5qZTEUcoE6Q6jVoWahQNhC3DEUxgQvkA+ZSjupTaqrauRlrhTKp1NysLvogBmDBi6Lk2l1qXRMYYZAGUXnmWT6n5CbAYDEzcjYNOJQPA0dDdyPDEKPI6EnwFHJZ4h6OlcWr5CldQlz51NtsvgizMNWoPNsbW0dUMjv04QyAV4JPQpeSYsxPk0yGVYbzchM38mowdjV+emK3czKSwJgCbxktB+QETan2yNCss+DVZHWK4yoKNhu8ONYI26e6emLz14oNOq1B3Y0Jzp6mlADtuvVmu10dOg+w/WbrXazwbgaofmYDtUal3xJjfECnGmJsTv+vcZMJsElV0qpPE/drVgS4OX5oWd95BfQZNgi2TyIiwJ+upIuS9iauzO/K9zwkIsnIWgNVt5Db9/LCEh2Ln9VXP9PPoV7mVMOpf02kImW16TKHPXCebIavgEDA2bgKMnhpCqxSxDLKOn2A9bGyfae9mJIMSyZaZ7ss9zIj4HiebYHR/u3zmejZNYLo/Lxk+VglB/sO4K3j/jHeAuRyJ+6BxTYRiFlPOkeGgyNJ5EXgoTLwUC+7o6JnS4wtm3S/RegEy5A02C/Xz8jdnkS4maI7jLOOt5fHw59zUyO8JL874pJ0uoTW9CntC77vz3aSKJL1vVsmje0iI2rHq0+rYahmjY2CcpLgr9KBEkUerMotfNDfO613T6vBd7vSKR74x+l6SCH4VgoEfecQSKgRylhn9d6B3gViI88TI0owgG7Md1TOjwjhdgi+1+hlUSuRtskbyk3tTDPdImU1mPIx6a50g3W+myO9Anu09IzjIV2OxGvTfXxtcRJ9aZUfUxZNLVFBB7TBHSTTuLOZ4cAzmKwZyDxCR/SC11QCkN9JQWFCY1TRUnPWTtrSdx9M2q0iwDs1wBcjrneESuyUVt1BR0LqCnkMKl1bTfdJreSagiV1R79fr03/h6/7X/jufwwatv/42v57Wafo8ar2ahIvs2+9K8nmaiTv1ty/SEd+i/8fX+a55jHbz64b/x9bzGPnj1hh7HDv+6BIHQ3xP/1/tE/VlTbasvXBb+qweDQOgv/1F0+HczCIT+8h/P9M9YvDr8GxUEQn/9//whoMO/fkEg9Jf/00JIdePegDzfD5bTpuZEbhUAzHJ38lK5qBTKO9flnv9/Vl4oeuUVfM13D5KHL8CSwsmtDwdcmU++wG6xANPnbwtrtlz2Pt43md+sK5yRo43OfQm50k9YTJkbXZyXFHNNLliF7yEyL3shCPwzxYGAOD6zPOPrGL6jYv468SvFlbCoeYhTlFWPucEIBlxmiMphpwqiOZSfG9qUUq2zADHm7c4bPGjJWiKUaCUaRqcXmAKTYQi7uswQ40W7qAwS0NcS8tq6BpQz+daAJe5Dcc2ZmaUWHUoMKmca1sCuEIi9DNqL6xzI3HGOQ0IiTrg1wfPX2cSuyhlecAizYRmDyhkOqUliJ7ytMRRTZxYOg+KHpud8fAzjsbOPT80ETeuN4xivjX14Pq7WmJFyGhHEPzV/3vBskBHcAld9z3fd9thORW0MQVsINIrnAr0IrRiN7N31mqAvIZTdAdG9WoW52PemS59P5/2FUNpJNtydoKqXQ6gDOtKiUs15iS2usYmEtHq8nVs5Xw2+mFaUuQclORNfgBRhxY3es3DeFIBKabP7ld1EfqFPJ6U2nfe0gRRLTyoD+rTXMl4EMVhSbbWVEpdRxJy4xek3uPvhh/UaD96XN0+e/P67qlpclYGPpgErt95hTS60eYH8N7w/Dq+v53MV/rT//nslFLTsoHn+VUGLC8dwzazovYAzHQSslHqVlEyUuNpztW2WenAhS1oi95nBCkJw22IIMN187w12QAuoJZraeZMkCfRuXdsTJnY10lZWfpK05fGiJ6Jjz7DhdkXCZxzu5szs2suqIYuTwuolztu5BV7JQc+8Jg94PCt63xnrINduAl/H6NAXR1I5mpweWT3dGUsLSOkl4yRj6A5aTsVhK5EnghE0FcujPRhyKeWQ1SGuHODBcrWDZUTzriu0fI2Jop6oKBZ2NqVTN/MEgeZ1g7AZq8xIDnII0TkbWepjzNSKJN8wa7I2OU7ibTCZ+yqIUlrwSLuFWToNvb6pmXNQfYmsbD2hB8NJJEtZGjDlcIsPPZx3PappGnQHRdPPZiOQ8sgljM27Ch8O4BmfYee8nk9H6Avx1M7PptPJNks2DXL1RPCGFBNFbdMMJxGqdsZjAmqhTkW6bjKwtjbIncfns3w4RIk0Z/MbHRfNbLjBQP02qyentdBahYlLH76FgIQCrczmVjewzgF5aeL5QmFUhnOOJtrV0KRxT2AuDIwIApViPIq9i+5QRxetaO3hx97PkZbNqqHNpfIm3h4/xqryGXONoekO6HyEpmYoSRcCDZiguzglOV8D7gHe8w49wkHeAgKgQQ0qiTRUHh8HHvVpx1pAEj2xZsHuZNRn1mk2nMtFrUWFUp35XGkaGMgcS95DANfhSGSH5pfWsNbEFWkA8kZAjQCdUmfwZSJ1pLVC14ntUmRD57pF6bDOEZ2HiOnOwIsxY0hbQpB9SsVM76NstlAI3A22c/RYqhtynfRbxuflyMD32s34l0Ybbfz4/07X+rsfYWQaLbdWI43atnVJSj1kmfWwmqvdGIu7ynCMSoVAjizNWmSNHf98GzbXRZGgOTpmpByrFdJUbWJDCqw1NibmuM2cLWAzHDOF1k4NI8qsSmulBHkFzY96VTCyL5ddc2zQpmEajlphHrEQ1OGjJt/OJgWAiVdNAseJGujrDfysyIyXzFbWtiPTCwyZcQRips8ujN0qZz+eTA5yTH/aPjcvtrt5MFprIRl9RKH0Ks8ObEoIwmq61WodXtRT9dNPo2NdP3d/OoZKoc+vXOFnpoKTp573omf6ihD0tQJJf8PpOvBozzsLQJ7oDh5rEJmkiu/1VgCE9WZrW7DEKyY0tr9kWEx2dJRCkUoVREt/DOkmiKoyPE5FAsffdn5LrHUOlKrIS4CnR7JzGrRIASpeqdfW0gyNXffcmaF260RQiwhq6ppqCbreCCtwaEmFvV2jY87cXqSJUUdYAR5V9u8Jno7OUw4zOsY3gm9IOpF2b3inmYitKfp8czPbbNDp2Jtgxng64NyoqJWY1oJXtcFLIUEirP2R/b7/mRx+mx33+KKrM9IuFjXh+qE2QppQTCjolDZ2gQQe1sxhnKnS8+2O9usbfVPr+ZzZh3VqAqhg8qZQvupMN5t2TbHpun3bpvvplJGRqIADrmQCRbJ44BlB9ediPHJ7b0Ibz3mHRilGXODExXNhW0xfUnTS/a4aXqFFyTt+5IP3fHn5NDyO7cslCuHVuEbEKIhOmY3lxX1AABWGZjyTRqrlZqkByiRRQzzcW8bytajiut+ZhUKzPLemReF2QfbXAXPAECpDIlyBW9iXBpeKZkyW8cr3VKCkMih4GOtDB1wBKB80z7Ko+LdBWcVwkzOaoo9j8zCmpLjyDE2cJKHXQs1LdhdCIA4B06dV1oGkJaAyi4VUPEjuTh18BaZ8fkWM1Xf3sklVrSAppfByPhYtsFJXUCMAegHsVEXJc0kVrRLSwt5FnSDOWUQaSCEjAxhWLbrUE9Azkfu26iIvIJumsd+xMI7ZgAoNrEi2JbNpgova2XMXwvHoS5uERPCB6I/zSs7Gl5cz6flyigsKaG2Pk5PYbN3cS8cu+8U7DWo9rkkptJZUxY6qUHHnBmSsywbLypov2fKeXj2f3+qr9t7eSn7+2ZgX4bc+vmijfq5RHoteLuZz+/zqvtDauT7t74Py3cBTYlDMIy5co7OB/e2o5p/mzjcbpSQ10JECfpjsiShPa20yxDbS/ehSIEQK0eIhKtqidVXIlL3mMhOJbHOi+wq1ElUzuSjyHsFrowrf+pW72jtJu2CJPYzn3uDQqaWtOe9k9xCT4pDgHkamAyN4SbOnh5t1Ze0uILi5+Zt8eXOI5v6ddQFFKSkHcLyPB+WCDCrQztkVMEV2686bNl/yrktc9UqlW+anPUbl0oJFjCNVz3gZq18tccBCIPfsuTs4H64jxspWYDd8SMRaukfSpklq4MyCn6pIVZ8qBxcXYUgNbBekfDKkTgnrCdoaZHVDt0Qb5GP0M4In7YOuXPoVqM+XaFBDADji/MSfhMtLsclucDgNO9ZBms19uWj10ud8MCgfnAHetbSDSsBxLkpvgbt/pvgwBs/4DE/jkZiTA/SFQ8lsgegq3TNRay5yyWjmDfVIj+YtoqZRCsw9fPmyGF+wEf+EiRmE63oV7vX59PR8a+NGk4gjYyakZF8wlujjMSFi7tV5d2aEoAgQvUyirQoBKAilQFefA9CehUhR0gjpDm+phTRwuYpPyy5/OePy+RJdLht7PoO8HZQM05ofdgZmssork5JSGhMTcI5Pri/grcwykwjt+7ns49xYsFUJMYE8f5FXcR1Vzr3VA8FpuEDjfs8PSjBBTDbALVT5nTVqpeb+OXmZShPgSCe3IXZaKf+L75qHRsW4nYthVymzaakca8BdZQTuagDgV92YubpcX6qVA+7qQeBXGWxoUKZ0obHn5eDesMZAVhWArwNQv/tBNZ8rfwBZ3Qh8XYPpP2CXBN32DgLFCGgJx3Hoz/dYnHstN0IirwFvAfcBlyCAPp1Pp16frTiHp+NS/BhwDb4HdQrHGUWT3vYmGQBtEjK+iTn6S4drA0aQmxD8TPoZAABgJTDARmClAV7cuAaQwaNXh1PrOuzIgdGI2XYNPpUqr4tnK9IZ2UP9cAgAzOgHL42FLvqq3B8VWA/FoxWTUi+PUf6jDOBR71aGLlYY8Nn5YMCfYAR5bPeXdvtq70cH9OpEMPwF8IGH/TFKSYsphFvGJQcZrA1GlVtYLcofHbVIl3pcylFCgGWL7pfZDVM1bMDPAMCd/nje5R69YRoS8sF4ZWCu7rONJlH+8PYE8o4Tcl8OEAYc1Z8YHzFqxHzWHeZGgFH/aU16fTZGiEdHCgD8DN6A+7n2oAGM22Y4TrKX3WkQCmd06I3D+wpd2yhNjZiI4AaswHjGT7g4S2c8vCRGEgwx4MEtCBXRXZY1TZ4bHQkKK8CpOgIkFdPsz6KuDAQUQ3+P6qpY9Jb+96IYPfB4/eQcwKvnVwui1OTHKwdUo4CA7xiAjtnECwBhG/g0lWhAbpKWRdECPulRdSnc5sJMbilkXRyHUqltoQpYXMf5e7hoJNyjpbwWyUvXVVsaMzI/u/8Xjmliuzu50ZAUQayLZd6+EFF8o+gYy26lbq/gTlYUEEriap++3JHDQopj1/FxiIR6cNR/eahfJbYNPm7V7GxPym4XkzHdPtNaZm0hzmLKFnC/F8iGVJgAUXz+bLx7TfjoE5sNImshH9GQl8UpdCmjXEoy5BKK2vQLABn5RhOihKJsGBJeVRkyRYHPSHoJKo7i5UERUP1JDznlBdNkCsq+81tG6hKSGhYlJNO4lylMmZDvknwsNC2G/xlWLrJ7KAZYYG5yaQO7TPHOYe65JSwAeOYbnk2dr9ax1TPXeDYpntXM6qfr41WVgxLPD+9KknTk1XrBNfEcB2U7Wc9gyJvKonCPYorKslZeaWIGDJPycwMuwDf1f0u6BCQsnhvHaAseYo0R/rxJv8dQwQwq0XEGUAqeIRaCExcmGGgPZfUhKA0qLeMuYvhzKi1QSf6N5VMlyDkexlHOLk7iKGOWUg4pZ9PAMpWc27vELmVjFDEu0vXqUcSFzqWXtkBXM8Z9vbFo1HUevLVrOAalATUcPtZoo7NPtc23XTtXvyhtkfIz3sB9jq+Vgwf8ExXviRGIBijEycWiTPiZDTHl3YdBQCPHMUhFBFga27xHeAe/RxmFxR4j2s2z7OE9jp39ezx30/eMBKtjMk5/hSkT4SeIGwlvOeu7tudPzDUCNbaKII3F31gwMViig3ZqtZehq1o6LerlTLrOcalTPAxaXTXfS4MWTbOuaDRoF4lbg45WhoZsUnlaNuhJp8nYdUnc7qqjSH78+lKvsxZJomur8tUlqONbasEmfnKlysqknvCT/D4FRVGvd96O+dLbkwriK5C/gFcjKtN+E5URqq/aJt3o1OqsKr90k0gqpPZeOltkSCtojyDNQhJE51P4tvNKoKMjTaY5YWdUsMHfXQPfJV8UoJxWYrrN0QAwLSFIkSpNugyqhCIz4U/sLnKVzF/2FChU9P1DYakob255JTkFJTfuPHjy4s2HLz+U/9UNFCRYiFBhwkWIFCVaDHMWLFmxZsOWHXsORGRMbLZFIlNrODLmRIyz3Q5bbXPUMfsdsMpqS7AWc2VAIla8KjXMxNkbAISq6Q030hijjTXPfEMSRngY4iWoZeS9KT7YScqZiyNGWGqfoYnAMALTHdSijU6r9tpZqINXOuqsi05u6Kq7HroFiJ566aOv3hbpZ5NR3ulvoEEGeGO3U06os0699SbSJhIvNTjptDPOfmck2biETX/tJtlgo7euuqbZda/NSBQ++uRDVRFjHdfDCaGIFBtJpFS1hiqT5/VnscZ9JXFNelQoC1RqjdbUzIW5haWVtUsbWmert3PVp74bt+7sHdzn7C5hlqwG2Zy1/Pq+3NVYW8XlWq7Aplu8fidh8qo2m8u6Nb7mkmB4S2GihJLKVkppl5ZqKKa4QiWUVLZSSju1Akd2er5lVeV/B0LWrtzv307l+fees3esDS2nbepMVuCBSiitmAKXZjufOvYu8TUGy9+k/xUyG8rrN1b8z516RQWr/GXl/ypLnoZOZFQ+tqEbOs6KbS59q0f+G3LI3Yiun25zEzYZ3qcUlAfcDPqRNr+F/eO/BX41FKa0O05Up9Xpxki8jDWK9At3Vcmml5OL6XnlbHpaOZlmciFnciLHlaPpYeVgul/Zm+5WdqbpJKkdyYHsyY4ko1my+59AgA2iv6i6Qek2RwN4xRvQtx1ZmXXqYQ6HFUUtv/GR6Pfo979+4UydEPe34n+1cMRIZCwZZtzcml1Pru6hIxO+1K8B)}";
    const S = this.state, P = S.pr, shd = this.sheetDef(P.sheet || 'armuzna'), land = shd.land, esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    this._slotF = null; const list = this.scopeList(P), ppih = this.ppih();
    const was = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(new Date()).replace(/(\d{2}):(\d{2})/, '$1.$2') + ' WAS';
    const kr = P.scope !== 'kloter' ? this.ketuaR(P.r).name : '';
    const css = `@page{size:A4 ${land ? 'landscape' : 'portrait'};margin:11mm 12mm 14mm;@bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font:7.5pt 'IBM Plex Sans',system-ui,sans-serif;color:#5c5c5c}@bottom-left{content:"Monitoring Ibadah Kloter · ${String(this.klLabel()).replace(/["\\]/g, '')}";font:7.5pt 'IBM Plex Sans',system-ui,sans-serif;color:#5c5c5c}}*{box-sizing:border-box}body{font-family:'IBM Plex Sans',system-ui,sans-serif;color:#1f1f1f;font-size:8.5pt;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}.hd{display:flex;gap:11pt;align-items:center;padding-bottom:7pt;margin-bottom:8pt;border-bottom:1.2pt solid #27326e}.kb{flex:none;min-width:34mm;padding:6pt 9pt;border-radius:7pt;color:#fff;background:linear-gradient(180deg,#1b2a6b,#2b3f92);line-height:1.3}.kb b{display:block;font-size:10pt;font-weight:600}.kb span{font-size:7.5pt}h1{font-weight:300;font-size:17pt;line-height:1.15;margin:0 0 2pt}.m{font-size:8.5pt;color:#3a3a3a;line-height:1.4}table{width:calc(100% - 2px);margin:0 1px;border-collapse:collapse;table-layout:fixed}th,td{border:0;border-bottom:.6pt solid #c8c8c8;padding:3pt 2.4pt;vertical-align:middle}th{background:#e6e8f4;color:#27326e;font-size:7pt;line-height:1.15;text-align:center;font-weight:600;word-break:normal;overflow-wrap:break-word;hyphens:manual}th .thn{display:block;font-size:5.6pt;letter-spacing:-.1pt;font-weight:600;color:#5c5c5c}th.ph{background:#fff;border:0 none #fff !important;padding:0 0 6pt;text-align:left;font-weight:400;font-size:8.5pt;line-height:1.3;word-break:normal;color:#1f1f1f}th.ph .hd{margin-bottom:0}tbody.end{break-inside:avoid;page-break-inside:avoid}tr.sigr td.sigc{border:0 none #fff !important;background:#fff !important;padding:0;text-align:left;vertical-align:top;overflow:visible;font-size:8.5pt}.tail{break-inside:avoid;break-before:avoid;page-break-inside:avoid;page-break-before:avoid}.tail>.lg:first-child,.tail>.bn:first-child{margin-top:5pt}.lg,.bn,.sig{break-before:avoid}th.g{background:#27326e;color:#fff;font-size:6.8pt;border-bottom-color:#27326e}td.ok.pf{font-size:6.4pt;font-weight:600;color:#27326e;line-height:1.15;overflow-wrap:break-word}tr.rg td:not(.su):not(.b):not(.s):not(.pu){background:#f6f6f6}tr.rt td{border-top:.9pt solid #27326e}thead{display:table-header-group}tr{break-inside:avoid}td{overflow-wrap:anywhere}td.c{text-align:center}th.gr{background:#e6e8f4;color:#27326e;text-align:left;font-size:7.5pt;padding:3pt 5pt}td.wr{color:#b42318;font-weight:600}.kt2{display:inline-block;font-size:6.6pt;font-weight:600;padding:0 4pt;border-radius:6pt;margin:0 2pt 1pt 0}.k-r{background:#fdecea;color:#b42318}.k-l{background:#ededed;color:#1f1f1f}.k-k{background:#e6e8f4;color:#27326e}td.nw{white-space:nowrap;overflow-wrap:normal;word-break:keep-all;font-size:8pt;font-variant-numeric:tabular-nums}td.nm{font-size:8pt;line-height:1.2;overflow-wrap:break-word}td.ok{color:#27326e;font-weight:600;font-size:10pt}td.s{background:#fdf0c4;color:#5a3f00;font-weight:600}td.b{background:#e6e8f4;color:#27326e;font-weight:600}td.na{color:#5c5c5c}td.su{background:#fdf0c4}td.pu{background:#fde2d3;color:#8a3b12;font-weight:600}sup{font-size:6pt}.bn{margin-top:6pt;font-size:8pt;line-height:1.45;break-inside:avoid}.bn ol{margin:3pt 0 0 14pt;padding:0}.bx{display:inline-block;width:3.4mm;height:3.4mm;border:.7pt solid #3a3a3a;border-radius:.7mm;vertical-align:middle}td.kt{font-size:7.5pt;line-height:1.25}small{color:#5c5c5c}.rs{color:#b42318}.lg{margin-top:5pt;font-size:8pt;color:#3a3a3a;display:flex;gap:10pt;flex-wrap:wrap;align-items:center}.lg i{font-style:normal;font-weight:600;padding:0 3pt;border-radius:2pt}.sig{display:grid;grid-template-columns:repeat(3,1fr);column-gap:14mm;margin-top:9mm;break-inside:avoid;font-size:9pt;text-align:center}.s1{display:flex;flex-direction:column;align-items:center}.t{height:2.7em;line-height:1.3;display:flex;align-items:flex-end;justify-content:center}.n{margin-top:15mm;width:85%;border-top:.6pt solid #1f1f1f;padding-top:3pt;font-weight:600;min-height:1.6em;line-height:1.25;text-align:center}section+section{break-before:page}${preview ? `@media screen{html{background:transparent}body{zoom:${land ? .3 : .43};width:${land ? 297 : 210}mm;margin:6mm auto;padding:0;background:transparent}section{background:#fff;padding:12mm;margin:0 0 10mm;box-shadow:0 4px 18px rgba(0,0,0,.18)}}` : ''}`;
    const tahunH = (() => { try { return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { year: 'numeric', timeZone: 'Asia/Riyadh' }).format(new Date()).replace(/\D/g, '') + ' H'; } catch (e) { return ''; } })();
    const head = (title, sub) => `<div class="hd"><div class="kb"><b>${esc(this.klLabel())}</b><span>${esc((this.modeLabel(shd.mode || S.mode) + ' ' + tahunH).trim())}</span></div><div><h1>${esc(title)}</h1><div class="m">${sub}</div></div></div>`;
    const meta = (n, x) => [x ? esc(x) : '', esc(this.scopeLabel(P)), kr ? 'Ketua Rombongan: ' + esc(kr) : '', n + ' jamaah', 'Dicetak ' + esc(was)].filter(Boolean).join(' · ');
    const sig = (t, n) => `<div class="s1"><div class="t">${t}</div><div class="n">${n ? esc(n) : '&nbsp;'}</div></div>`;
    const sigs = `<div class="sig">${sig('Ketua Rombongan', kr)}${sig('PPIH Bimbingan Ibadah Kloter', ppih)}${sig('Mengetahui,<br>Ketua Kloter', '')}</div>`;
    const legend = `<div class="lg"><b>Simbol:</b><span><i style="color:#27326e;font-size:10pt">✓</i> hadir/selesai</span><span><i style="background:#fdf0c4;color:#5a3f00">&nbsp;&nbsp;</i> latar amber = susulan</span><span><span class="bx"></span> belum (centang manual)</span></div>`;
    const AB = { Tr: 'Tarwiyah', NT: 'Non Tarwiyah', S: 'Safari Wukuf', MM: 'Murur Mabit', Mr: 'Murur', M: 'Mabit', T: 'Tanazul', NA: 'Nafar Awwal', L: 'Lanjut Nafar Tsani' };
    const legendFor = t => `<div class="lg"><b>Simbol:</b><span><i style="color:#27326e;font-size:10pt">✓</i> selesai</span><span><i style="background:#fdf0c4;color:#5a3f00">&nbsp;&nbsp;</i> latar amber = susulan</span>${[...t.used].map(a => `<span><i>${a}</i> ${AB[a] || a}</span>`).join('')}${t.hasB ? '<span><i style="background:#e6e8f4;color:#27326e">B</i> Badal (nomor = keterangan di bawah)</span>' : ''}${t.hasNA ? '<span><i>NA</i> Nafar Awwal · <i>-</i> hari 13 tidak wajib</span>' : ''}${t.umrah ? '<span><i>U2</i> ulang ke-2</span><span><i style="background:#fde2d3;color:#8a3b12">PU</i> perlu ulang</span>' : ''}<span><span class="bx"></span> belum (centang manual)</span></div>`;
    const cellH = c => c.t === 'box' ? '<td class="c"><span class="bx"></span></td>' : `<td class="c ${c.t}${c.sus ? ' su' : ''}">${c.v}</td>`;
    const tbl = (m, ks, lst) => {
      const R = this.data[m].rites, cols = this.sheetCols(m, ks), notes = [], fmap = {}, foot = (j, k) => { const key = j.id + '|' + k; if (!fmap[key]) { notes.push(this.badalTxt(j, k)); fmap[key] = notes.length; } return fmap[key]; };
      const nm = land ? 58 : 44, kt = land ? 40 : 24, rw = P.scope === 'kloter' ? 12 : 9;
      const colg = `<col style="width:8mm"><col style="width:${nm}mm"><col style="width:21mm"><col style="width:${rw}mm">${cols.map(() => '<col>').join('')}<col style="width:${kt}mm">`;
      const g = this.grpHdr(m, cols).map(x => `<th class="g" colspan="${x.span}">${esc(x.label)}</th>`).join('');
      let bandN = 0; const band = lst.map((j, i) => (i && (lst[i - 1].g !== j.g || lst[i - 1].r !== j.r) ? ++bandN : bandN));
      const rows = lst.map((j, i) => `<tr class="${band[i] % 2 ? 'rg' : ''}${i && band[i] !== band[i - 1] ? ' rt' : ''}"><td class="c nw">${i + 1}</td><td class="nm">${esc(j.name)}${j.risti ? ' <b class="rs">Risti</b>' : ''}${j.role ? ' <small>(' + esc(j.role) + ')</small>' : ''}</td><td class="nw">${esc(j.porsi)}</td><td class="c nw">${P.scope === 'kloter' ? 'R' + j.r + '·' + j.g : j.g}</td>${cols.map(c => cellH(this.cellOf(m, c, j, foot))).join('')}<td class="kt">${esc(this.ketOf(m, cols, j))}</td></tr>`).join('');
      const used = new Set(); cols.forEach(c => { if (c.ks.length > 1) c.ks.forEach(k => { const a = R[k].ab; if (a && a !== '✓' && a !== 'B' && !/^(tarw|wukuf|muzd)/.test(R[k].g || '') && !/Mabit|Tanazul/.test(R[k].n)) used.add(a); }); });
      const html = `<table><colgroup>${colg}</colgroup><thead><tr><th class="g" colspan="4"></th>${g}<th class="g"></th></tr><tr><th>No</th><th>Nama jamaah</th><th>No. porsi</th><th>${P.scope === 'kloter' ? 'Romb. Regu' : 'Regu'}</th>${cols.map(c => `<th>${esc(c.label).replace(/\s*\((.+)\)$/, '<span class="thn">($1)</span>')}</th>`).join('')}<th>Keterangan</th></tr></thead><tbody>${rows}</tbody></table>` + (notes.length ? `<div class="bn"><b>Keterangan Badal Jumroh</b><ol>${notes.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>` : '');
      return { html, used, hasB: ks.some(k => R[k].badal), hasNA: ks.some(k => R[k].d13), umrah: m === 'umrah' };
    };
    let body = '';
    if (shd.kind === 'khusus' || shd.kind === 'badal') {
      const nw = P.scope === 'kloter', rw = nw ? 12 : 10, gH = (js, f) => { const out = []; let last = null; js.forEach(j => { const key = f(j); if (key !== last) { out.push({ h: key, j: null }); last = key; } out.push({ h: null, j }); }); return out; };
      if (shd.kind === 'khusus') {
        const l = list.filter(j => this.isKh(j)).sort((a, b) => a.r - b.r || a.g - b.g), cnt = { r: l.filter(j => j.risti).length, la: l.filter(j => this.khOf(j.id).lansia).length, k: l.filter(j => this.khOf(j.id).kroda).length, t: l.filter(j => !this.pendKey(j.id)).length };
        let no = 0; const rows = gH(l, j => 'Rombongan ' + j.r + ' · Regu ' + j.g + ' · Ketua regu: ' + this.ketuaG(j.r, j.g).name).map(x => { if (x.h) return `<tr><th class="gr" colspan="7">${esc(x.h)}</th></tr>`; const j = x.j, k = this.khOf(j.id), pk = this.pendKey(j.id); no++;
          const tags = (j.risti ? '<span class="kt2 k-r">Risti</span>' : '') + (k.lansia ? '<span class="kt2 k-l">Lansia</span>' : '') + (k.kroda ? '<span class="kt2 k-k">Kursi roda</span>' : '');
          return `<tr><td class="c nw">${no}</td><td class="nm">${esc(j.name)}${j.role ? ' <small>(' + esc(j.role) + ')</small>' : ''}</td><td class="nw">${esc(j.porsi)}</td><td class="c nw">${nw ? 'R' + j.r + '·' + j.g : j.g}</td><td>${tags}</td>${pk ? `<td class="nm">${esc(this.pendDesc(j.id))}</td>` : '<td class="wr">Belum ada pendamping</td>'}<td class="kt">${esc(S.notes[j.id] || '')}</td></tr>`; }).join('');
        body = `<section>${head(shd.title, meta(l.length, 'Risti, lansia, kursi roda'))}<table><colgroup><col style="width:8mm"><col style="width:44mm"><col style="width:21mm"><col style="width:${rw}mm"><col style="width:31mm"><col style="width:40mm"><col></colgroup><thead><tr><th>No</th><th>Nama jamaah</th><th>No. porsi</th><th>${nw ? 'Romb. Regu' : 'Regu'}</th><th>Kondisi</th><th>Pendamping (jamaah)</th><th>Catatan</th></tr></thead><tbody>${rows || '<tr><td colspan="7" class="c">Tidak ada jamaah khusus di cakupan ini.</td></tr>'}</tbody></table><div class="lg"><b>Ringkasan:</b><span>${cnt.r} risti</span><span>${cnt.la} lansia</span><span>${cnt.k} kursi roda</span><span style="color:#b42318;font-weight:600">${cnt.t} belum ada pendamping</span></div><div class="lg">Pendamping dipilih dari jamaah; satu pendamping boleh mendampingi beberapa jamaah.</div>${sigs}</section>`;
      } else {
        const Dh = S.done.haji, BR = this.badalRites(), l = list.filter(j => this.needBadal(j) || BR.some(b => Dh[b.k][j.id])), key = j => this.pelOfB(j) || '_';
        const order = [...new Set(l.map(key))].sort((a, b) => (a === '_') - (b === '_') || l.filter(j => key(j) === b).length - l.filter(j => key(j) === a).length);
        const sorted = order.flatMap(p => l.filter(j => key(j) === p).sort((a, b) => a.r - b.r || a.g - b.g));
        let no = 0; const rows = gH(sorted, key).map(x => { if (x.h) { const p = x.h, n = sorted.filter(j => key(j) === p).length; return `<tr><th class="gr" colspan="${5 + BR.length}">${p === '_' ? 'Belum ada pelaksana · ' + n + ' jamaah' : 'Pelaksana: ' + esc(this.pelName(p)) + ' · ' + esc(this.pelRole(p)) + (p[0] === 'j' ? ' · melontar untuk diri sendiri + ' : ' · membadali ') + n + ' jamaah'}</th></tr>`; }
          const j = x.j, k0 = key(j); no++; const ket = [S.udz[j.id] ? 'Udzur' : 'Ditambahkan', S.notes[j.id] || ''];
          const cells = BR.map(b => { if (this.naLock('haji', b.k, j, Dh)) { ket.push('Nafar Awwal'); return '<td class="c na">NA</td>'; } if (Dh[b.k][j.id]) { const pk = ((S.badal.haji || {})[b.k] || {})[j.id]; if (pk && pk !== k0) ket.push(b.d + ' Dzh oleh ' + this.pelName(pk)); return '<td class="c ok">✓</td>'; } return '<td class="c"><span class="bx"></span></td>'; }).join('');
          return `<tr><td class="c nw">${no}</td><td class="nm">${esc(j.name)}</td><td class="nw">${esc(j.porsi)}</td><td class="c nw">R${j.r}·${j.g}</td>${cells}<td class="kt">${esc([...new Set(ket.filter(Boolean))].join('; '))}</td></tr>`; }).join('');
        const nP = order.filter(p => p !== '_').length;
        body = `<section>${head(shd.title, meta(l.length, '10–13 Dzulhijjah · ' + nP + ' pelaksana'))}<table><colgroup><col style="width:8mm"><col style="width:50mm"><col style="width:21mm"><col style="width:12mm">${BR.map(() => '<col style="width:15mm">').join('')}<col></colgroup><thead><tr><th>No</th><th>Jamaah yang dibadalkan</th><th>No. porsi</th><th>Romb. Regu</th>${BR.map(b => `<th>${b.d} Dzh<span class="thn">${b.d === 10 ? 'Aqobah' : '3 jumroh'}</span></th>`).join('')}<th>Keterangan</th></tr></thead><tbody>${rows || `<tr><td colspan="${5 + BR.length}" class="c">Belum ada jamaah yang dibadalkan di cakupan ini.</td></tr>`}</tbody></table><div class="lg"><b>Simbol:</b><span><i style="color:#27326e;font-size:10pt">✓</i> sudah dibadalkan</span><span><span class="bx"></span> belum</span><span><i>NA</i> Nafar Awwal · hari 13 tidak wajib</span></div><div class="lg">Pelaksana boleh jamaah mana pun dan melontar untuk dirinya serta jamaah yang dibadalkan pada waktu yang sama.</div>${sigs}</section>`;
      }
    } else if (shd.kind === 'harian') {
      const X = this.data[S.mode], D = S.done[S.mode], today = X.rites.map((r, k) => k).filter(k => X.rites[k].day === X.rites[X.cur].day && !X.rites[k].badal);
      const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const l = this.mem(r); return `<tr><td class="c">R${r}</td><td>${esc(this.ketuaR(r).name)}</td><td class="c">${l.length}</td>${today.map(k => `<td class="c">${l.filter(j => D[k][j.id]).length}</td>`).join('')}<td class="c">${l.filter(j => S.udz[j.id]).length}</td></tr>`; }).join('');
      body = `<section>${head('Rekap Harian · ' + X.rites[X.cur].day, esc('Seluruh kloter · ' + this.jm.length + ' jamaah · Dicetak ' + was))}<table><thead><tr><th>Romb.</th><th>Ketua Rombongan</th><th>Jamaah</th>${today.map(k => `<th>${esc(X.rites[k].p)}</th>`).join('')}<th>Udzur</th></tr></thead><tbody>${rows}</tbody></table><div class="sig">${sig('Ketua Rombongan', '')}${sig('PPIH Bimbingan Ibadah Kloter', ppih)}${sig('Mengetahui,<br>Ketua Kloter', '')}</div></section>`;
    } else if (shd.kind === 'raudhoh') {
      const sl = P.slot != null && this.jadwal[P.slot] ? [this.jadwal[P.slot]] : this.jadwal;
      body = sl.map(s => { const l = list.filter(j => this.inSlot(j, s)); if (!l.length) return '';
        const rows = l.map((j, i) => `<tr><td class="c nw">${i + 1}</td><td class="nm">${esc(j.name)}${j.risti ? ' <b class="rs">Risti</b>' : ''}${S.udz[j.id] ? ' <small>(udzur)</small>' : ''}</td><td class="nw">${esc(j.porsi)}</td><td class="c nw">R${j.r}·${j.g}</td>${cellH(this.cellOf('madinah', this.sheetCols('madinah', [0])[0], j))}<td class="kt">${esc(this.ketOf('madinah', this.sheetCols('madinah', [0]), j))}</td></tr>`).join('');
        return `<section>${head(shd.title, meta(l.length, this.slotLabel(s) + (s.ket ? ' · ' + s.ket : '')))}<table><colgroup><col style="width:8mm"><col style="width:70mm"><col style="width:23mm"><col style="width:17mm"><col style="width:16mm"><col></colgroup><thead><tr><th>No</th><th>Nama jamaah</th><th>No. porsi</th><th>Romb·Regu</th><th>Hadir</th><th>Keterangan</th></tr></thead><tbody>${rows}</tbody></table>${legend}${sigs}</section>`; }).join('') || `<section>${head(shd.title, meta(0, ''))}<p>Belum ada jadwal Raudhoh.</p></section>`;
    } else body = shd.secs.map(sec => { const t = tbl(shd.mode, sec.ks, list); return `<section>${head(shd.title + (shd.secs.length > 1 ? ' · ' + sec.label : ''), meta(list.length))}${t.html}${legendFor(t)}${sigs}</section>`; }).join('');
    const phRe = /(<div class="hd">[\s\S]*?<\/div><\/div><\/div>)<table>((?:<colgroup>[\s\S]*?<\/colgroup>)?)<thead>/g;
    body = body.replace(phRe, (m, hd, cg, off, str) => { const th = str.slice(off, str.indexOf('</thead>', off)), trs = th.split('<tr'), last = trs[trs.length - 1]; let n = 0; (last.match(/<th[^>]*>/g) || []).forEach(t => { const c = /colspan="(\d+)"/.exec(t); n += c ? +c[1] : 1; }); return '<table class="pt">' + cg + '<thead><tr class="phr"><th class="ph" colspan="' + n + '">' + hd + '</th></tr>'; });
    body = body.replace(/(<table class="pt">[\s\S]*?<\/thead><tbody>)([\s\S]*?)<\/tbody><\/table>((?:(?!<\/table>|<section>)[\s\S])*?)<\/section>/g, (m, pre, rows, rest) => {
      const rr = rows.match(/<tr[\s\S]*?<\/tr>/g) || [], keep = Math.min(3, rr.length), th = pre.slice(pre.indexOf('<thead>'), pre.indexOf('</thead>')), trs = th.split('<tr'), last = trs[trs.length - 1]; let n = 0;
      (last.match(/<th[^>]*>/g) || []).forEach(t => { const c = /colspan="(\d+)"/.exec(t); n += c ? +c[1] : 1; });
      return pre + rr.slice(0, rr.length - keep).join('') + '</tbody><tbody class="end">' + rr.slice(rr.length - keep).join('') + '<tr class="sigr"><td colspan="' + n + '" class="sigc">' + rest + '</td></tr></tbody></table></section>'; });
    return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(shd.title)}</title><style>${PRINT_FONTS}${css}</style></head><body>${body}</body></html>`;
  }

  _logo = 'emblem-256.png';
  logoBox = React.createRef();
  missedFn() {
    const S = this.state, m = S.mode, X = this.data[m], D = S.done[m], ci = X.cur, M = this.meta(m);
    const gs = M.req.filter(g => M.firstK[g] < ci && !M.slots[g].includes(ci));
    const miss = j => S.udz[j.id] ? null : gs.find(g => !this.skip(m, M.slots[g][0], j, D) && this.satBy(m, g, j, D) < 0);
    const f = j => !!miss(j); f.firstK = j => { const g = miss(j); return g ? M.firstK[g] : ci; }; return f;
  }
  rekapStats() {
    const S = this.state, m = S.mode, X = this.data[m], D = S.done[m], ci = X.cur, R = X.rites[ci], M = this.meta(m), g = M.slotOf[ci];
    const ek = (k, j) => S.ex[m + '|' + k + '|' + j.id] || {}, tk = (k, j) => S.tg[m + '|' + k + '|' + j.id] || {};
    let tepat = 0, sus = 0, badal = 0, belum = 0, udzB = 0, ulangP = 0; const pil = {}, T = [];
    this.jm.forEach(j => { if (this.skip(m, ci, j, D)) return; if (R.opt && !S.udz[j.id] && !D[ci][j.id]) return; T.push(j);
      const k = R.opt ? (D[ci][j.id] ? ci : -1) : this.satBy(m, g, j, D);
      if (k < 0) { if ((M.slots[g] || [ci]).some(x => ek(x, j).stUlang === 'Perlu ulang')) ulangP++; else if (S.udz[j.id]) udzB++; else belum++; return; }
      const rr = X.rites[k]; pil[rr.p] = (pil[rr.p] || 0) + 1;
      if (rr.badal) badal++; else if (tk(k, j).s) sus++; else tepat++; });
    const done = tepat + sus + badal, tot = T.length;
    const rombs = [...new Set(this.jm.map(j => j.r))].sort((a, b) => a - b).map(r => { const l = this.jm.filter(j => j.r === r && this.tgt(m, ci, j, D)), d = l.filter(j => this.sat(m, ci, j, D)).length;
      return { r, d, n: l.length, pct: l.length ? Math.round(d / l.length * 100) : 100, ketua: this.ketuaR(r).name.split(' ')[0] }; }).sort((a, b) => a.pct - b.pct || a.r - b.r);
    const miss = this.missedFn(), att = [], pu = [];
    this.jm.forEach(j => { const k = X.rites.findIndex((_, k) => !D[k][j.id] && ek(k, j).stUlang === 'Perlu ulang'); if (k >= 0) pu.push({ j, k, t: 'Perlu ulang' }); });
    att.push(...pu);
    this.jm.forEach(j => { if (miss(j) && !pu.some(x => x.j === j)) att.push({ j, k: miss.firstK(j), t: 'Tertinggal' }); });
    const sj = this.jm.map(j => ({ j, k: X.rites.findIndex((_, k) => D[k][j.id] && tk(k, j).s) })).filter(x => x.k >= 0);
    sj.forEach(x => att.push({ j: x.j, k: x.k, t: 'Susulan' }));
    const pel = this.jm.filter(j => S.udz[j.id] && X.rites.some((r, k) => r.badal && D[k][j.id])).length;
    const bl = []; X.rites.forEach((r, k) => { if (r.badal) this.jm.forEach(j => { if (D[k][j.id]) bl.push({ j, k, key: ((S.badal[m] || {})[k] || {})[j.id] }); }); });
    let umr = null; if (m === 'umrah') { const uk = X.rites.map((r, k) => r.ulang ? k : -1).filter(k => k >= 0); umr = { semp: 0, diul: 0, perlu: 0 };
      this.jm.forEach(j => { if (uk.some(k => !D[k][j.id] && ek(k, j).stUlang === 'Perlu ulang')) umr.perlu++; else if (uk.every(k => D[k][j.id])) { if (uk.some(k => ek(k, j).ulangKe >= 2)) umr.diul++; else umr.semp++; } }); }
    return { tepat, sus, badal, belum, udzB, ulangP, done, tot, pct: tot ? Math.round(done / tot * 100) : 0, complete: tot > 0 && done === tot, rombs, att, tertN: att.filter(a => a.t === 'Tertinggal').length, susN: sj.length, puN: pu.length, pel,
      pil, multi: (M.slots[g] || []).length > 1, bl, blWarn: bl.filter(x => !x.key).length, umr };
  }
  dl(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  async shareCard() {
    const S = this.state, X = this.data[S.mode], ci = X.cur, R = X.rites[ci], RS = this.rekapStats();
    const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    try { await Promise.all([document.fonts.load('600 60px IBM Plex Sans'), document.fonts.load('400 30px IBM Plex Sans'), document.fonts.load('300 60px IBM Plex Sans')]); } catch (e) {}
    const F = '"IBM Plex Sans", system-ui, sans-serif', G1 = '#2B3F92', G2 = '#1B2A6B', GR = '#27326E', TX = '#1F1F1F', MU = '#5C5C5C', RD = '#D92D20';
    const rr = (x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };
    const txt = (t, x, y, font, col, al) => { g.font = font; g.fillStyle = col; g.textAlign = al || 'left'; g.textBaseline = 'alphabetic'; g.fillText(t, x, y); };
    const card = (x, y, w, h) => { g.save(); g.shadowColor = 'rgba(16,40,30,0.10)'; g.shadowBlur = 30; g.shadowOffsetY = 10; g.fillStyle = '#fff'; rr(x, y, w, h, 36); g.fill(); g.restore(); };
    let bgG = g.createLinearGradient(0, 0, W, H); bgG.addColorStop(0, '#E6E8F4'); bgG.addColorStop(1, '#F6F6F6'); g.fillStyle = bgG; g.fillRect(0, 0, W, H);
    const logo = await new Promise(res => { const im = new Image(), srcs = [this._logo || 'emblem-256.png', 'icon-192.png', 'app/icon-192.png']; let i = 0; im.onload = () => res(im); im.onerror = () => { i++; if (i < srcs.length) im.src = srcs[i]; else res(null); }; im.src = srcs[0]; });
    g.save(); g.shadowColor = 'rgba(16,40,30,0.15)'; g.shadowBlur = 18; g.fillStyle = '#fff'; g.beginPath(); g.arc(124, 112, 52, 0, Math.PI * 2); g.fill(); g.restore();
    if (logo) g.drawImage(logo, 90, 78, 68, 68);
    txt('Rekap ' + this.klLabel(), 196, 108, '600 50px ' + F, TX);
    txt(new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + this.tz('Asia/Riyadh') + ' WAS', 196, 150, '600 28px ' + F, MU);
    // hero
    g.save(); g.shadowColor = 'rgba(14,92,64,0.35)'; g.shadowBlur = 40; g.shadowOffsetY = 18; const hg = g.createLinearGradient(72, 210, 1008, 560); hg.addColorStop(0, G1); hg.addColorStop(1, G2); g.fillStyle = hg; rr(72, 210, 936, 340, 44); g.fill(); g.restore();
    g.save(); rr(72, 210, 936, 340, 44); g.clip(); g.fillStyle = 'rgba(255,255,255,0.08)'; g.beginPath(); g.arc(940, 200, 200, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.05)'; g.beginPath(); g.arc(820, 600, 150, 0, Math.PI * 2); g.fill(); g.restore();
    txt((RS.complete ? 'Selesai · ' : 'Sedang berlangsung · ') + R.day, 116, 272, '600 28px ' + F, 'rgba(255,255,255,0.88)');
    txt(R.n, 116, 334, '600 52px ' + F, '#fff');
    if (RS.complete) {
      txt('Alhamdulillah, tuntas', 116, 428, '600 64px ' + F, '#fff');
      txt('Seluruh ' + RS.tot + ' jamaah sudah tercatat', 116, 478, '600 30px ' + F, 'rgba(255,255,255,0.9)');
      g.fillStyle = '#fff'; g.beginPath(); g.arc(900, 420, 70, 0, Math.PI * 2); g.fill();
      g.strokeStyle = GR; g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(866, 422); g.lineTo(892, 448); g.lineTo(938, 396); g.stroke();
    } else {
      txt(String(RS.done), 116, 448, '600 112px ' + F, '#fff'); g.font = '600 112px ' + F; const w0 = g.measureText(String(RS.done)).width;
      txt('/ ' + RS.tot + ' jamaah · ' + RS.pct + '%', 116 + w0 + 18, 444, '600 38px ' + F, 'rgba(255,255,255,0.9)');
      g.fillStyle = 'rgba(255,255,255,0.22)'; rr(116, 486, 848, 16, 8); g.fill(); g.fillStyle = '#fff'; rr(116, 486, Math.max(16, 848 * RS.pct / 100), 16, 8); g.fill();
    }
    // bars per rombongan
    card(72, 588, 936, 452);
    txt('Per rombongan', 116, 650, '600 34px ' + F, TX); txt('merah bila di bawah 70%', 964, 650, '600 24px ' + F, MU, 'right');
    const bars = [...RS.rombs].sort((a, b) => a.r - b.r), n = bars.length || 1, x0 = 116, span = 848, bw = Math.min(64, span / n - 22), base = 980, mh = 250;
    bars.forEach((o, i) => { const cx = x0 + span / n * (i + .5), h = Math.max(10, mh * o.pct / 100), low = o.pct < 70;
      g.fillStyle = '#EDEDED'; rr(cx - bw / 2, base - mh, bw, mh, 16); g.fill();
      g.fillStyle = low ? RD : GR; rr(cx - bw / 2, base - h, bw, h, 16); g.fill();
      txt(o.pct + '%', cx, base - h - 12, '600 24px ' + F, low ? RD : TX, 'center');
      txt('R' + o.r, cx, base + 38, '600 26px ' + F, MU, 'center'); });
    // donut + legend
    card(72, 1072, 936, 186);
    const parts = [['Tepat waktu', RS.tepat, GR], ['Susulan', RS.sus, '#4A57A6'], ['Dibadalkan', RS.badal, '#7C87C4'], ['Belum', RS.belum + RS.udzB + RS.ulangP, '#DADADA']];
    let a0 = -Math.PI / 2; const dc = { x: 186, y: 1165 }, tot = Math.max(1, RS.tot);
    g.lineWidth = 26; g.lineCap = 'butt'; g.strokeStyle = '#EDEDED'; g.beginPath(); g.arc(dc.x, dc.y, 58, 0, Math.PI * 2); g.stroke();
    parts.forEach(([, v, c]) => { if (!v) return; const a1 = a0 + Math.PI * 2 * v / tot; g.strokeStyle = c; g.beginPath(); g.arc(dc.x, dc.y, 58, a0, a1); g.stroke(); a0 = a1; });
    txt(RS.pct + '%', dc.x, dc.y + 10, '600 28px ' + F, TX, 'center');
    parts.forEach(([l, v, c], i) => { const cx = 300 + (i % 2) * 360, cy = 1138 + Math.floor(i / 2) * 64;
      g.fillStyle = c; g.beginPath(); g.arc(cx, cy - 9, 10, 0, Math.PI * 2); g.fill(); txt(l, cx + 22, cy, '600 28px ' + F, MU); txt(String(v), cx + 320, cy, '600 30px ' + F, TX, 'right'); });
    txt('PPIH Bimbingan Ibadah Kloter · ' + this.ppih(), W / 2, 1310, '600 26px ' + F, G2, 'center');
    const blob = await new Promise(res => cv.toBlob(res, 'image/png')); if (!blob) { this.flash('Gagal membuat kartu'); return; }
    const name = 'rekap-' + this.klLabel().replace(/\s+/g, '-') + '-' + this.todayKey() + '.png', file = new File([blob], name, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: 'Rekap ' + this.klLabel(), text: 'Rekap ' + this.klLabel() + ' · ' + R.n + ' · ' + RS.pct + '%' }); } catch (e) { if (e && e.name !== 'AbortError') { this.dl(blob, name); this.flash('Kartu rekap diunduh'); } } }
    else { this.dl(blob, name); this.flash('Kartu rekap diunduh (PNG)'); }
  }
  confirmSus() { const d = this.state.susDlg; if (!d || !d.ids.length) return; const S = this.state, m = S.mode, R = this.data[m].rites[d.rite], today = this.todayKey(); let tgl = d.tgl || today; if (tgl > today) tgl = today;
    if (R.pend && !d.pend) return;
    this._ket = [d.jam ? 'Jam ' + d.jam : '', (d.ket || '').trim()].filter(Boolean).join(' · ');
    const x = { ...(d.x || {}), ...(d.pend ? { pend: d.pend } : {}), ...(d.ulang ? { ulangKe: d.ulang, stUlang: 'Selesai diulang' } : {}) };
    if (R.tarw && !x.pil) x.pil = 'Tarwiyah ' + (S.ck.tarwD || 8) + ' Dzh';
    this.commit(d.ids, true, d.rite, tgl, !d.ulang, x); this._ket = ''; this.setState({ susDlg: null, confirm: null });
    const lbl = d.ulang ? 'Ulang ke-' + d.ulang + ' · ' + this.fmtTgl(tgl) : this.autoSus(R, tgl, true, x) ? 'Susulan · ' + this.fmtH(tgl) : 'tepat waktu · ' + this.fmtTgl(tgl);
    this.flash(d.ids.length + ' jamaah dicatat ' + lbl, { mode: m, rite: d.rite, ids: d.ids, prev: d.ids.map(() => false) }); }

  renderVals() {
    const K = this.kloter(), full = window.innerWidth < 900 || (window.matchMedia && matchMedia('(pointer:coarse)').matches), off = !navigator.onLine;
    const S = this.state, X = this.data[S.mode], D = S.done[S.mode], ci = X.cur, ck = S.ck, P = S.pr, J = S.jl;
    const nR = X.rites.length, udzN = S.udz.filter(Boolean).length, lockOn = ((this.cfg && this.cfg.lockUntil) || 0) > Date.now();
    const go = (tab, extra) => () => this.setState({ tab, fokusCari: false, kirimLayar: null, ...(tab === 'checklist' ? { ckPilih: false, ckDariPilih: false } : {}), ...(extra || {}) });
    const pill = a => ({ a, bg: a ? 'var(--color-accent)' : 'transparent', fg: a ? 'var(--on-isi)' : 'var(--color-text)' });
    const chip = a => ({ a, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--on-accent)' : 'var(--color-text)' });
    const doneCnt = k => D[k].filter(Boolean).length;
    const days = [...new Set(X.rites.map(r => r.day))], missed = this.missedFn(), M0 = this.meta(S.mode), sat = (k, j) => this.sat(S.mode, k, j, D);
    // beranda
    const modes = [['haji', 'Haji'], ['umrah', 'Umrah'], ['madinah', 'Madinah']].map(([k, l]) => ({ l, ...pill(S.mode === k),
      on: () => { const c = this.data[k].cur; this.saveCfg({ mode: k }); this.setState(s => ({ mode: k, ck: { ...s.ck, rite: c }, pr: { ...s.pr, rites: [c] } })); } }));
    const cd = doneCnt(ci), verb = X.rites[ci].verb || 'selesai';
    const belum = this.jm.filter(j => this.tgt(S.mode, ci, j, D) && !sat(ci, j)).length, tert = this.jm.filter(missed).length;
    const rites = X.rites.map((r, i) => { const st = i < ci ? 'done' : i === ci ? 'now' : 'next', n = doneCnt(i), sn = this.susN(S.mode, i, D);
      return { ...r, hasSus: sn > 0, sus: sn + ' susulan', cnt: n === 0 && st === 'next' ? '-' : (M0.slots[M0.slotOf[i]] || []).length > 1 || r.opt ? n + ' jamaah' : `${n}/${this.jm.filter(j => this.tgt(S.mode, i, j, D)).length}`, mark: st === 'done' ? '✓' : st === 'now' ? String(i + 1) : '', st,
        dotBg: st === 'done' ? 'var(--color-accent-2)' : st === 'now' ? 'var(--color-accent)' : 'var(--color-neutral-200)', locked: st === 'next', isNow: st === 'now', nameFg: st === 'next' ? 'var(--color-neutral-700)' : 'var(--color-text)',
        ring: st === 'done' ? 'var(--color-accent-2)' : st === 'now' ? 'var(--color-accent)' : 'var(--color-neutral-400)',
        tagBg: r.k === 'Rukun' ? 'var(--color-accent-100)' : r.k === 'Wajib' ? 'var(--color-accent-2-100)' : 'var(--color-neutral-200)', tagFg: r.k === 'Rukun' ? 'var(--color-accent-800)' : r.k === 'Wajib' ? 'var(--color-accent-2-800)' : 'var(--color-neutral-800)',
        cntFg: st === 'now' ? 'var(--color-accent-700)' : st === 'done' ? 'var(--color-accent-2-700)' : 'var(--color-neutral-700)',
        on: go('checklist', { ck: { ...ck, rite: i, scope: 'kloter' } }) }; });
    const tglDay = day => (X.rites.find(r => r.day === day && r.tgl) || {}).tgl || '', today0 = this.todayKey();
    const riteGroups = this.group(rites).map(g => { const t = tglDay(g.day), now = t ? t === today0 : g.day === X.rites[ci].day;
      return { ...g, day: g.day + (t ? ' · ' + this.fmtHari(t) : ''), note: now ? 'Hari ini' : t ? '' : 'tanggal belum diatur', fg: now ? 'var(--color-accent-700)' : 'var(--color-neutral-700)' }; });
    const tglJadwal = S.tglOpen ? {
      title: 'Tanggal kegiatan · ' + X.label,
      groups: this.group(X.rites.map(r => ({ ...r }))).map(g => { const names = X.rites.filter(r => r.day === g.day).map(r => r.n), t = tglDay(g.day);
        // Draf label disimpan per kegiatan pertama (bukan per label) agar kolom tidak hilang fokus saat diketik
        const key = S.mode + '|' + names[0], draf = (S.hariDraft || {})[key], val = draf ?? g.day, ubah = draf != null && draf.trim() && draf.trim() !== g.day;
        return { day: g.day, names: names.join(' · '), tgl: t, hari: t ? this.fmtHari(t) : 'Belum diatur',
          hijri: val, onHijri: e => this.setState(s => ({ hariDraft: { ...(s.hariDraft || {}), [key]: e.target.value.slice(0, 40) } })), ubahHijri: !!ubah,
          simpanHijri: () => { this.setHariJadwal(S.mode, names, val); this.setState(s => { const d = { ...(s.hariDraft || {}) }; delete d[key]; return { hariDraft: d }; }); },
          jam: (X.rites.find(r => r.day === g.day) || {}).jam || '', onJam: e => this.setJamJadwal(S.mode, names, e.target.value),
          onTgl: e => this.setTglJadwal(S.mode, names, e.target.value), hapus: () => this.setTglJadwal(S.mode, names, ''), adaTgl: !!t }; }),
      tutup: () => this.setState({ tglOpen: false }) } : null;
    const tgJ = S.tgJ ? (() => { const j = this.jm[S.tgJ.id], r = X.rites[S.tgJ.k], t = S.tgJ.tgl, sus = this.autoSus(r, t, false, {});
      return { title: r.p + ' · ' + j.name, jadwal: r.tgl ? 'Jadwal kloter: ' + this.fmtHari(r.tgl) : 'Tanggal jadwal belum diatur · Susulan tidak dihitung otomatis', tgl: t, max: today0,
        hasil: !r.tgl || !t ? '' : sus ? 'Akan tercatat SUSULAN (setelah tanggal jadwal)' : 'Tercatat tepat waktu', hasilFg: sus ? 'var(--color-accent-2-800)' : 'var(--color-accent-800)', hasilBg: sus ? 'var(--color-accent-2-100)' : 'var(--color-accent-100)',
        onTgl: e => this.patch('tgJ', { tgl: e.target.value }), simpan: () => this.ubahTglJamaah(S.tgJ.id, S.tgJ.k, t), batal: () => this.setState({ tgJ: null }) }; })() : null;
    const RS = this.rekapStats();
    const stats = [
      { v: belum, l: 'Belum', icon: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', bg: 'var(--color-accent-100)', fg: 'var(--color-accent)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'belum', r: 0 } }) },
      { v: udzN, l: 'Udzur', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v5M12 16.5v.01', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'udzur', r: 0 } }) },
      { v: tert, l: 'Tertinggal', icon: 'M5 21V4M5 4h11l-2 4 2 4H5', bg: 'var(--red-100)', fg: 'var(--red-700)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'tert', r: 0 } }) },
      { v: RS.susN, l: 'Susulan', icon: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l3 2', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'sus', r: 0 } }) }
    ];
    // jamaah
    const q = J.q.trim().toLowerCase();
    const F = { risti: j => j.risti, semua: () => true, belum: j => this.tgt(S.mode, ci, j, D) && !sat(ci, j), udzur: j => S.udz[j.id], tert: missed, sus: j => X.rites.some((_, k) => D[k][j.id] && (S.tg[S.mode + '|' + k + '|' + j.id] || {}).s) };
    const base = this.jm.filter(j => (!J.r || j.r === J.r) && (!J.r || !J.g || j.g === J.g) && (!q || j.name.toLowerCase().includes(q) || j.porsi.includes(q)));
    const fl = base.filter(F[J.f]);
    const jl = { q: J.q, count: fl.length, scope: J.r ? 'Rombongan ' + J.r + (J.g ? ' · Regu ' + J.g : '') : 'seluruh kloter', showG: !!J.r,
      gs: [0, 1, 2, 3, 4].map(g => ({ l: g ? 'Regu ' + g : 'Semua', ...chip((J.g || 0) === g), on: () => this.patch('jl', { g }) })), empty: fl.length === 0, trunc: fl.length > 40,
      filters: [['semua', 'Semua'], ['belum', 'Belum ' + X.rites[ci].p], ['udzur', 'Udzur'], ['risti', 'Risti'], ['tert', 'Tertinggal'], ['sus', 'Susulan']].map(([k, l]) => ({ l, n: base.filter(F[k]).length, ...pill(J.f === k), on: () => this.patch('jl', { f: k }) })),
      rs: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const a = J.r === r; return { l: r ? 'R' + r : 'Semua', a, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--on-accent)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--m-tepi)', on: () => this.patch('jl', { r: a ? 0 : r, g: 0 }) }; }),
      rows: fl.slice(0, 40).map(j => { const u = S.udz[j.id], d = sat(ci, j), m = missed(j), pu = X.rites.some((_, k) => !D[k][j.id] && (S.ex[S.mode + '|' + k + '|' + j.id] || {}).stUlang === 'Perlu ulang'), sa = X.rites.some((_, k) => D[k][j.id] && (S.tg[S.mode + '|' + k + '|' + j.id] || {}).s);
        return { name: j.name, ini: j.ini, sub: (j.role ? j.role + ' · ' : '') + (j.sex ? j.sex + ' · ' : '') + `R${j.r} · Regu ${j.g} · ${j.porsi}`, on: () => this.setState({ sel: j.id }),
          risti: j.risti, note: S.notes[j.id] || '', hasNote: !!S.notes[j.id],
          tag: u ? 'Udzur' : pu ? 'Perlu ulang' : m ? 'Tertinggal' : sa ? 'Susulan' : d ? 'Sudah' : 'Belum', tagK: u || m ? 'merah' : pu || sa ? 'netral' : d ? 'ok' : 'netral',
          tagBg: u ? 'var(--red-600)' : pu ? 'var(--color-accent-200)' : m ? 'var(--red-100)' : sa ? 'var(--color-accent-200)' : d ? 'var(--color-accent-100)' : 'var(--color-neutral-100)',
          tagFg: u ? 'var(--on-isi)' : pu ? 'var(--color-accent)' : m ? 'var(--red-700)' : sa ? 'var(--color-accent)' : d ? 'var(--color-accent)' : 'var(--color-text)' }; }) };
    // detail
    let sel = {};
    if (S.sel != null) { const j = this.jm[S.sel], u = S.udz[j.id];
      sel = { name: j.name, ini: j.ini, sub: (j.role ? j.role + ' · ' : '') + `Rombongan ${j.r} · Regu ${j.g} · Porsi ${j.porsi}`,
        udzBg: u ? 'var(--red-100)' : 'var(--color-accent-100)', risti: j.risti, avBg: u || j.risti ? 'var(--red-100)' : 'var(--color-accent-100)', avFg: u || j.risti ? 'var(--red-700)' : 'var(--color-accent)', hp: j.hp, tel: 'tel:' + j.hp, note: S.notes[j.id] || '', hasNote: !!S.notes[j.id],
        noteChips: ['Kursi roda', 'Ikut murur', 'Dirawat di KKHI', 'Pendamping keluarga'].map(t => ({ l: t, on: () => this.setNote(j.id, t) })),
        baris: [j.role, `Rombongan ${j.r} · Regu ${j.g}`].filter(Boolean).join(' · '), porsi: 'Porsi ' + j.porsi,
        lencana: (() => { const k = this.khOf(j.id); return [k.lansia && 'Lansia', k.kroda && 'Kursi roda', !u && k.pb && 'Perlu badal'].filter(Boolean); })(),
        wa: j.hp ? 'https://wa.me/' + String(j.hp).replace(/\D/g, '').replace(/^0/, '62') : '',
        catatKejadian: () => this.setState({ sel: null, tab: 'kejadian', kejForm: this.kejBaru([j.porsi]) }),
        kej: (this.live() && !this.pakaiAkun() ? [] : this.daftarKejadian()).filter(k => (k.porsi || []).includes(j.porsi)).slice(0, 5)
          .map(k => ({ l: labelKejadian(k.kategori), w: this.fmtWaktu(k.waktuKejadian), st: k.status === 'selesai' ? 'Selesai' : 'Terbuka', buka: k.status !== 'selesai' })),
        udzTitle: u ? 'UDZUR · dibadalkan' : 'Kondisi baik', udz: !!u,
        mqTxt: S.mode === 'umrah' ? 'Miqat: ' + ((S.mq || {})[j.id] || ((this.miqatKloter() || 'belum ditentukan') + ' (ikut kloter)')) : '',
        openMq: () => this.setState({ mqDlg: { scope: 'jamaah', id: j.id, val: (S.mq || {})[j.id] || '' } }),
        udzSub: (() => { const r = this.riwayatUdzur(j.porsi)[0]; const base = u ? 'Tidak ikut dicentang massal' : 'Ikut checklist massal';
          return r && r.udzur === !!u ? base + ' · sejak ' + this.fmtWaktu(r.waktu) + (r.alasan ? ' · ' + r.alasan : '') : base; })(),
        udzCta: u ? 'Hapus status udzur' : 'Tandai udzur',
        udzForm: S.udzForm && S.udzForm.id === j.id ? (() => { const f = S.udzForm;
          return { title: f.udzur ? 'Tandai ' + j.name + ' udzur' : 'Hapus status udzur ' + j.name, alasan: f.alasan,
            chips: (f.udzur ? ['Sakit', 'Dirawat di KKHI', 'Dirawat di RSAS', 'Lansia / risti berat', 'Kursi roda'] : ['Sudah sehat', 'Keluar dari RS', 'Salah tandai']).map(t => ({ l: t, on: () => this.patch('udzForm', { alasan: t }), a: f.alasan === t, bg: f.alasan === t ? 'var(--color-accent)' : 'var(--color-surface)', fg: f.alasan === t ? 'var(--on-isi)' : 'var(--color-text)' })),
            onAlasan: e => this.patch('udzForm', { alasan: e.target.value.slice(0, 120) }),
            ok: () => this.simpanUdzur(j, f.udzur, f.alasan), okLabel: f.udzur ? 'Simpan · tandai udzur' : 'Simpan · hapus udzur',
            batal: () => this.setState({ udzForm: null }) }; })() : null,
        riwayatUdz: this.riwayatUdzur(j.porsi).slice(0, 6).map(r => ({ teks: this.fmtWaktu(r.waktu) + ' · ' + (r.udzur ? 'Ditandai udzur' : 'Udzur dihapus') + (r.alasan ? ' · ' + r.alasan : ''),
          oleh: (r.petugas ? 'oleh ' + r.petugas : '') + (r.antre ? (r.petugas ? ' · ' : '') + 'belum terkirim' : '') })),
        pelNote: (() => { const key = 'j' + j.id, out = []; Object.entries(S.badal[S.mode]).forEach(([k, m]) => Object.entries(m).forEach(([id, v]) => { if (v === key) out.push(this.jm[+id].name + ' (' + X.rites[k].p + ')'); })); return out.length ? 'Membadalkan: ' + out.join(', ') : ''; })(),
        toggleUdz: () => this.setState({ udzForm: { id: j.id, udzur: !u, alasan: '' } }),
        canUlang: S.mode === 'umrah' && X.rites.some((r, k) => r.ulang && D[k][j.id]), openUlang: () => this.setState({ sel: null, ulDlg: { id: j.id, tahap: 'Thawaf', why: '', cat: '', rencana: '' } }),
        rites: X.rites.map((r, k) => { const d = D[k][j.id], tgE = S.tg[S.mode + '|' + k + '|' + j.id] || {}, ee = S.ex[S.mode + '|' + k + '|' + j.id] || {}, na = this.naLock(S.mode, k, j, D), alt = !d && !r.opt ? this.satBy(S.mode, M0.slotOf[k], j, D) : -1, bkey = r.badal ? (S.badal[S.mode][k] || {})[j.id] : null;
          const st = na ? 'Nafar Awwal · tidak wajib' : d ? (r.badal ? 'Badal · oleh ' + (bkey ? this.pelName(bkey) : '-') : ee.ulangKe >= 2 ? 'Ulang ke-' + ee.ulangKe + (tgE.t ? ' · ' + this.fmtTgl(tgE.t) : '') : tgE.s ? 'Susulan · ' + this.fmtH(tgE.t) + (ee.pend ? ' · didampingi ' + this.pelName(ee.pend) : '') : r.safari ? 'Safari' + (ee.alasan ? ' · ' + ee.alasan : '') : (ee.pil && ee.pil !== r.p && ee.pil !== r.pil ? ee.pil : 'Selesai'))
            : ee.stUlang === 'Perlu ulang' ? '↺ Perlu ulang' : alt >= 0 ? 'Dipilih: ' + X.rites[alt].p : r.opt ? '-' : k < ci ? 'Tertinggal' : k === ci ? 'Berlangsung' : '-';
          return { n: r.n, day: r.day, d: !!d, st: st.replace('↺ ', ''), telat: st === 'Tertinggal',
            tglTxt: d && tgE.t ? this.fmtHari(tgE.t) : '', ubahTgl: d ? () => this.setState({ tgJ: { id: j.id, k, tgl: tgE.t || this.defTgl(r) } }) : null,
            on: na ? () => {} : () => { if (d) this.setDone([j.id], false, k); else { this.setState({ sel: null }); this.setDone([j.id], true, k); } } }; }) }; }
    // checklist
    const isMad = S.mode === 'madinah', slot = isMad && ck.slot != null ? this.jadwal[ck.slot] : null;
    this._slotF = slot ? (j => this.inSlot(j, slot)) : null;
    const MD = (S.done.madinah || [[]])[0] || [];
    const sexSplit = isMad ? ['L', 'P'].map(x => { const l = this.jm.filter(j => j.sex === x && !S.udz[j.id]); return x + ' ' + l.filter(j => MD[j.id]).length + '/' + l.length; }).join('  ·  ') : '';
    const CD = D[ck.rite], R0 = X.rites[ck.rite], cnt = l => l.filter(j => R0.opt ? CD[j.id] : sat(ck.rite, j)).length;
    const scopes = (cur, key) => [['kloter', 'Kloter'], ['rombongan', 'Rombongan'], ['regu', 'Regu']].map(([k, l]) => ({ l, on: () => this.patch(key, { scope: k }), ...pill(cur.scope === k) }));
    const rs = (cur, key) => Array.from({ length: 9 }, (_, i) => ({ l: 'R' + (i + 1), on: () => this.patch(key, { r: i + 1 }), ...chip(cur.r === i + 1) }));
    const gs = (cur, key) => [1, 2, 3, 4].map(g => ({ l: 'Regu ' + g, on: () => this.patch(key, { g }), ...chip(cur.g === g) }));
    const box = (d, n) => d === n && n > 0 ? { mark: '✓', bg: 'var(--color-accent)', fg: 'var(--on-accent)', ring: 'var(--color-accent)' }
      : d === 0 ? { mark: '', bg: 'var(--color-surface)', fg: 'var(--color-text)', ring: 'var(--m-tepi)' }
      : { mark: '–', bg: 'var(--color-surface)', fg: 'var(--color-text)', ring: 'var(--m-tepi)' };
    const rk0 = ck.rite, isBad = !!X.rites[rk0].badal, bmap = S.badal[S.mode][rk0] || {};
    const tgOf = j => S.tg[S.mode + '|' + rk0 + '|' + j.id];
    const pelOf = j => { const mm = S.badal[S.mode] || {}; let key = bmap[j.id]; if (!key) for (const kk in mm) if (mm[kk][j.id]) { key = mm[kk][j.id]; break; } return key ? this.pelName(key).split(' ').slice(0, 2).join(' ') : ''; };
    const dotOf = j => { const d = CD[j.id], e = tgOf(j), sf = d && e && e.s, na = this.naLock(S.mode, rk0, j, D), alt = !d && !R0.opt && sat(rk0, j);
      return { ini: j.ini, bg: na ? 'var(--color-neutral-200)' : sf || alt ? 'var(--color-accent-200)' : d ? 'var(--color-accent)' : 'var(--color-surface)', fg: sf || alt ? 'var(--color-accent)' : d ? 'var(--on-accent)' : 'var(--color-text)', bd: sf ? '1px solid var(--color-accent)' : d || alt || na ? '1px solid transparent' : '1px solid var(--m-tepi)' }; };
    const missF = this.missedFn(), ckPeople = [];
    const person = (j, onCheck) => { const m0 = S.mode, d = !!CD[j.id], e = tgOf(j) || {}, ee = S.ex[m0 + '|' + rk0 + '|' + j.id] || {}, sf = d && e.s, note = S.notes[j.id], tags = [], na = this.naLock(m0, rk0, j, D), altK = !d && !R0.opt ? this.satBy(m0, M0.slotOf[rk0], j, D) : -1, alt = altK >= 0 ? X.rites[altK] : null;
      if (j.risti) tags.push({ t: note ? 'Risti · ' + note : 'Risti', bg: 'var(--red-100)', fg: 'var(--red-700)' }); else if (note) tags.push({ t: note, bg: 'var(--color-neutral-100)', fg: 'var(--color-text)' });
      if (na) tags.push({ t: 'Nafar Awwal · tidak wajib', bg: 'var(--color-neutral-200)', fg: 'var(--color-text)' });
      const bk = isBad && d ? bmap[j.id] : alt && alt.badal ? ((S.badal[m0] || {})[altK] || {})[j.id] : null;
      if ((isBad && d) || (alt && alt.badal)) tags.push({ t: 'Badal · oleh ' + (bk ? this.pelName(bk) : 'pelaksana belum dicatat'), bg: bk ? 'var(--color-accent-200)' : 'var(--red-100)', fg: bk ? 'var(--color-accent)' : 'var(--red-700)' });
      else if (S.udz[j.id]) { const p = pelOf(j); tags.push({ t: 'Udzur · ' + (p ? 'dibadalkan ' + p : 'belum dibadalkan'), bg: 'var(--red-600)', fg: 'var(--on-isi)' }); }
      if (alt && !alt.badal) tags.push({ t: 'Dipilih: ' + alt.p, bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' });
      if (d && R0.safari) tags.push({ t: 'Safari · ' + (ee.alasan || 'alasan belum diisi'), bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' });
      if (d && /^Tarwiyah \d/.test(ee.pil || '')) tags.push({ t: ee.pil, bg: 'var(--color-accent-100)', fg: 'var(--color-accent)' });
      if (sf) tags.push({ t: 'Susulan · ' + this.fmtH(e.t) + (ee.pend ? ' · didampingi ' + this.pelName(ee.pend) : ''), bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' });
      if (d && ee.ulangKe >= 2) tags.push({ t: '↺ Ulang ke-' + ee.ulangKe + (e.t ? ' · ' + this.fmtTgl(e.t) : '') + (ee.pend && !sf ? ' · didampingi ' + this.pelName(ee.pend) : ''), bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' });
      if (!d && ee.stUlang === 'Perlu ulang') tags.push({ t: '↺ Perlu ulang' + (ee.alasan ? ' · ' + ee.alasan : ''), bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' });
      else if (!d && !alt && !na && !isBad && missF(j)) tags.push({ t: 'Tertinggal', bg: 'var(--red-100)', fg: 'var(--red-700)' });
      const c = na ? { bg: 'var(--color-neutral-200)', ring: 'var(--color-neutral-200)', fg: 'var(--color-text)', mk: '-' } : sf ? { bg: 'var(--color-accent-200)', ring: 'var(--color-accent)', fg: 'var(--color-accent)', mk: isBad ? 'B' : '✓' }
        : d ? { bg: 'var(--color-accent)', ring: 'var(--color-accent)', fg: 'var(--on-accent)', mk: isBad ? 'B' : '✓' }
        : alt ? { bg: 'var(--color-accent-200)', ring: 'var(--color-accent-200)', fg: 'var(--color-accent)', mk: alt.ab && alt.ab !== '✓' ? alt.ab : '•' } : { bg: 'var(--color-surface)', ring: 'var(--m-tepi)', fg: 'transparent', mk: '' };
      const red = S.udz[j.id] || j.risti, canUl = m0 === 'umrah' && X.rites.some((r, k) => r.ulang && D[k][j.id]);
      return { name: j.name, ini: j.ini, sub: (j.role ? j.role + ' · ' : '') + 'R' + j.r + ' · Regu ' + j.g, tags, hasTags: tags.length > 0, cb: c.bg, cr: c.ring, cf: c.fg, mark: c.mk, mfs: c.mk.length > 1 ? '15px' : '22px',
        avBg: red ? 'var(--red-100)' : 'var(--color-accent-100)', avFg: red ? 'var(--red-700)' : 'var(--color-accent)', onCheck: na ? () => this.flash('Nafar Awwal · hari 13 tidak wajib') : onCheck, onOpen: () => this.setState({ sel: j.id }),
        canUl, onMore: () => this.setState({ ulDlg: { id: j.id, tahap: R0.ulang || 'Thawaf', why: '', cat: '', rencana: '' } }) }; };
    const grp = (title, sub, l, label, open, dots) => { const lt = l.filter(j => this.tgt(S.mode, rk0, j, D)), d = cnt(lt), p = lt.length ? Math.round(d / lt.length * 100) : 0;
      return { title, sub, cnt: d + ' / ' + lt.length, pct: p + '%', col: p < 70 ? 'var(--red-600)' : 'var(--color-accent)', hasDots: dots, noDots: !dots, dots: dots ? l.map(dotOf) : [], ...box(d, lt.length), onCheck: () => this.askMass(l, label), onOpen: open }; };
    let ckRows = [];
    if (isBad) this.scopeList(ck).filter(j => !this.naLock(S.mode, rk0, j, D) && (S.udz[j.id] || CD[j.id] || (ck.scope === 'regu' && this.badalCand(rk0, [j]).length))).forEach(j => ckPeople.push(person(j, CD[j.id] && bmap[j.id] ? () => this.commit([j.id], false, rk0) : () => this.openPicker(rk0, [j.id], this.badalCand(rk0).map(x => x.id).concat(CD[j.id] ? [j.id] : [])))));
    else if (ck.scope === 'kloter') ckRows = Array.from({ length: 9 }, (_, i) => i).filter(i => !slot || this.mem(i + 1).length).map(i => grp('Rombongan ' + (i + 1), 'Ketua: ' + this.ketuaR(i + 1).name, this.mem(i + 1), 'Rombongan ' + (i + 1), () => this.patch('ck', { scope: 'rombongan', r: i + 1 }), false));
    else if (ck.scope === 'rombongan') ckRows = [1, 2, 3, 4].filter(g => !slot || this.mem(ck.r, g).length).map(g => grp('Regu ' + g, 'Ketua regu: ' + this.ketuaG(ck.r, g).name, this.mem(ck.r, g), `Rombongan ${ck.r} · Regu ${g}`, () => this.patch('ck', { scope: 'regu', g }), true));
    else this.mem(ck.r, ck.g).forEach(j => ckPeople.push(person(j, () => this.setDone([j.id], !CD[j.id]))));
    { const cq = String(ck.q || '').trim().toLowerCase(); if (cq && !isBad) { ckRows = []; ckPeople.length = 0; this.scopeList({ ...ck, scope: 'kloter' }).filter(j => j.name.toLowerCase().includes(cq) || j.porsi.includes(cq)).slice(0, 40).forEach(j => ckPeople.push(person(j, () => this.setDone([j.id], !CD[j.id])))); } }
    const rombPills = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const l = this.jm.filter(j => j.r === r && this.tgt(S.mode, rk0, j, D)), d = cnt(l), p = l.length ? Math.round(d / l.length * 100) : 100, a = ck.r === r, low = p < 70;
      return { r, p, a, low, l: 'R' + r, pct: p + '%', col: low ? 'var(--red-600)' : 'var(--color-accent)', fg: low ? 'var(--red-700)' : 'var(--color-text)', bg: a ? 'var(--color-accent-100)' : 'var(--color-surface)', ring: a ? 'var(--color-accent)' : low ? 'var(--red-200)' : 'var(--color-divider)', on: () => this.patch('ck', { r, g: ck.g || 1 }) }; }).sort((a, b) => a.p - b.p || a.r - b.r);
    const ckBadal = !!R0.badal, tl = this.scopeList(ck), tt = tl.filter(j => this.tgt(S.mode, rk0, j, D)), td = cnt(tt), elig = tl.filter(j => this.eligible(j, rk0)), todoN = elig.filter(j => !sat(rk0, j)).length, allE = elig.length > 0 && todoN === 0, un = tl.filter(j => S.udz[j.id]).length;
    let ckSum = { label: this.scopeLabel(ck), done: td, total: tt.length, rite: X.rites[ck.rite].n, pct: (tt.length ? Math.round(td / tt.length * 100) : 0) + '%',
      action: allE ? 'Batalkan centang semua' : 'Centang ' + todoN + ' jamaah tersisa di ' + (ck.scope === 'regu' ? 'Regu ' + ck.g : ck.scope === 'rombongan' ? 'Rombongan ' + ck.r : 'seluruh kloter'), onAll: () => this.askMass(tl, this.scopeLabel(ck)),
      hasNote: un > 0 && (!ckBadal || elig.length > 0), note: ckBadal ? `Kegiatan badal: hanya ${elig.length} jamaah udzur yang dicentang massal.` : `${un} jamaah udzur tidak ikut dicentang massal. Tandai satu per satu bila sudah dibadalkan.` };
    if (R0.pend && rk0 < ci && !allE) ckSum = { ...ckSum, action: 'Catat susulan berkelompok · ' + todoN + ' jamaah', onAll: () => { const cand = elig.filter(j => !sat(rk0, j)).map(j => j.id); this.setState({ susDlg: { ids: [], cand, rite: rk0, tgl: this.todayKey(), pend: '', pq: '', group: true } }); } };
    let pelGroups = [];
    if (ckBadal) { const cand = this.badalCand(rk0, tl), dn = tl.filter(j => CD[j.id]), k = rk0, tot2 = dn.length + cand.length;
      ckSum = { ...ckSum, done: dn.length, total: tot2, pct: (tot2 ? Math.round(dn.length / tot2 * 100) : 0) + '%',
        action: cand.length ? 'Catat badal berkelompok · ' + cand.length + ' jamaah' : 'Tidak ada jamaah yang perlu dibadalkan', onAll: () => { if (cand.length) this.openPicker(k, cand.filter(j => S.udz[j.id]).map(j => j.id), cand.map(j => j.id)); },
        hasNote: true, note: 'Pelaksana badal wajib diisi. Satu pelaksana boleh membadali beberapa jamaah sekaligus; pelaksana yang juga jamaah boleh mencentang lontarnya sendiri.' };
      const g = {}; dn.forEach(j => { const key = bmap[j.id] || '-'; (g[key] = g[key] || []).push(j); });
      pelGroups = Object.entries(g).map(([key, js]) => ({ name: key === '-' ? 'Belum ada pelaksana' : this.pelName(key), role: key === '-' ? 'Data lama · ketuk nama untuk melengkapi' : this.pelRole(key), count: js.length, names: js.map(j => j.name.split(' ')[0]).join(', ') })); }
    this._slotF = null;
    // picker
    let pk = {};
    if (S.picker) { const P2 = S.picker, k = P2.k, own = this.ownRite(k), map = S.badal[S.mode][k] || {}, q2 = P2.q.trim().toLowerCase();
      const r0 = P2.sel.length ? this.jm[P2.sel[0]].r : 0, load = key => Object.values(map).filter(v => v === key).length;
      const src = P2.src || 'jamaah', ownOk = j => own < 0 || D[own][j.id];
      const pjAll = this.jm.filter(j => !S.udz[j.id] && (!q2 || j.name.toLowerCase().includes(q2) || j.porsi.includes(q2)));
      const pj = pjAll.slice().sort((a, b) => ((b.r === r0) - (a.r === r0))).slice(0, 30);
      const petF = this.petugas.filter(p => !q2 || p.name.toLowerCase().includes(q2));
      const ownN = own >= 0 ? X.rites[own].p : 'melontar';
      const opts = (src === 'petugas' ? petF.map(p => ({ key: p.key, name: p.name, sub: p.role }))
        : pj.map(j => ({ key: 'j' + j.id, name: j.name, sub: `R${j.r} · Regu ${j.g}` })))
        .map(o => { const a = P2.pel === o.key, l = load(o.key);
          return { ...o, hasLoad: l > 0, load: 'membadalkan ' + l, on: () => this.patch('picker', { pel: o.key }),
            dot: a ? 'var(--color-accent)' : 'transparent', ring: a ? 'var(--color-accent)' : 'var(--color-neutral-400)', bg: a ? 'var(--color-accent-100)' : 'transparent' }; });
      if (q2 && !opts.some(o => o.name.toLowerCase() === q2)) { const key = 'x:' + P2.q.trim(), a = P2.pel === key; opts.unshift({ key, name: P2.q.trim(), sub: 'Nama lain · ketik manual', hasLoad: false, load: '', on: () => this.patch('picker', { pel: key }), dot: a ? 'var(--color-accent)' : 'transparent', ring: a ? 'var(--color-accent)' : 'var(--color-neutral-400)', bg: a ? 'var(--color-accent-100)' : 'transparent' }); }
      pk = { get hasWarn() { return !!this.warn; }, rite: X.rites[k].n, own: ownN, selCount: P2.sel.length, opts, empty: opts.length === 0,
        srcs: [['jamaah', 'Sesama jamaah', pjAll.length], ['petugas', 'Petugas', petF.length]].map(([key, l, n]) => { const a = src === key; return { l, n, on: () => this.patch('picker', { src: key, pel: null }), bg: a ? 'var(--color-accent)' : 'transparent', fg: a ? 'var(--on-accent)' : 'var(--color-text)' }; }),
        warn: '', q: P2.q, onQ: e => this.patch('picker', { q: e.target.value }),
        jam: (P2.cand ? P2.cand.map(id => this.jm[id]) : this.jm.filter(j => S.udz[j.id])).map(j => { const a = P2.sel.includes(j.id), cur = map[j.id];
          return { name: j.name, sub: `R${j.r} · Regu ${j.g} · ` + (S.udz[j.id] ? 'Udzur · ' : '') + (cur ? 'Pelaksana: ' + this.pelName(cur) : 'Belum ada pelaksana'),
            mark: a ? '✓' : '', bg: a ? 'var(--color-accent)' : 'transparent', ring: a ? 'var(--color-accent)' : 'var(--color-neutral-400)',
            on: () => this.patch('picker', { sel: a ? P2.sel.filter(x => x !== j.id) : [...P2.sel, j.id] }) }; }),
        disabled: !(P2.sel.length && P2.pel), cta: !P2.sel.length ? 'Pilih jamaah' : !P2.pel ? 'Pilih pelaksana dulu' : `Simpan badal · ${P2.sel.length} jamaah` }; }
    // cetak
    if (isMad && P.slot != null && this.jadwal[P.slot]) { const sp = this.jadwal[P.slot]; this._slotF = j => this.inSlot(j, sp); }
    const pl = this.scopeList(P); this._slotF = null; const ks = P.rites.filter(k => k < nR).sort((a, b) => a - b), shown = ks.slice(0, 4), rek = P.fmt === 'rekap';
    const shd = this.sheetDef(P.sheet || 'armuzna'), PPN = this.ppih();
    const SY = { pu: { v: 'PU', fg: 'var(--red-700)', bg: 'var(--red-100)', bd: 'var(--red-500)' }, ok: { v: '✓', fg: 'var(--color-accent)', bg: 'transparent', bd: 'transparent' }, s: { v: 'S', fg: 'var(--color-accent)', bg: 'var(--color-accent-200)', bd: 'var(--color-accent)' }, b: { v: 'B', fg: 'var(--color-accent)', bg: 'var(--color-accent-200)', bd: 'var(--color-accent)' }, box: { v: '', fg: 'inherit', bg: 'var(--color-surface)', bd: 'var(--teks-3)' }, na: { v: '–', fg: 'var(--teks-3)', bg: 'transparent', bd: 'transparent' } };
    let pr;
    if (shd.kind === 'khusus' || shd.kind === 'badal') { const isK = shd.kind === 'khusus', pl3 = this.scopeList(P).filter(j => isK ? this.isKh(j) : this.needBadal(j)), BR = this.badalRites(), Dh = S.done.haji;
      const cellB = (j, b) => this.naLock('haji', b.k, j, Dh) ? SY.na : Dh[b.k][j.id] ? SY.ok : SY.box;
      pr = { title: shd.title, sub: this.scopeLabel(P) + ' · ' + pl3.length + ' jamaah', orientL: 'Potret', pages: Math.max(1, Math.ceil(pl3.length / 26)), cols: isK ? '16px minmax(0,1fr) 110px' : '16px minmax(0,1fr) ' + BR.map(() => '30px').join(' '), groups: [{ label: isK ? 'Pendamping' : '10–13 Dzh', col: 'span ' + (isK ? 1 : BR.length) }], heads: isK ? ['Pendamping'] : BR.map(b => String(b.d)),
        rows: pl3.slice(0, 8).map((j, i) => ({ no: i + 1, name: j.name, cells: isK ? [{ v: this.pendKey(j.id) ? this.pelName(this.pendKey(j.id)).split(' ').slice(0, 2).join(' ') : 'Belum ada', fg: this.pendKey(j.id) ? 'var(--color-text)' : 'var(--red-700)', bg: 'transparent', bd: 'transparent' }] : BR.map(b => cellB(j, b)) })), hasMore: pl3.length > 8, more: pl3.length - 8 };
    } else if (shd.kind === 'harian') { const today = X.rites.map((r, k) => k).filter(k => X.rites[k].day === X.rites[ci].day && !X.rites[k].badal).slice(0, 4);
      pr = { title: 'Rekap harian · ' + X.rites[ci].day, sub: 'Per rombongan · ' + this.jm.length + ' jamaah', orientL: 'Potret', pages: 1, cols: '16px minmax(0,1fr) ' + today.map(() => '34px').join(' '), groups: [{ label: X.rites[ci].day, col: 'span ' + Math.max(1, today.length) }], heads: today.map(k => X.rites[k].p),
        rows: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const l = this.mem(r); return { no: r, name: 'R' + r + ' · ' + this.ketuaR(r).name.split(' ')[0] + ' (' + l.length + ')',
          cells: today.map(k => { const n = l.filter(j => D[k][j.id]).length; return { v: String(n), fg: n === l.length ? 'var(--color-accent)' : 'var(--red-700)', bg: 'transparent', bd: 'transparent' }; }) }; }) };
    } else if (shd.kind === 'raudhoh') { const sp = P.slot != null && this.jadwal[P.slot] ? this.jadwal[P.slot] : this.jadwal[0], l = sp ? this.scopeList(P).filter(j => this.inSlot(j, sp)) : [];
      pr = { title: shd.title, sub: (sp ? this.slotLabel(sp) : 'Belum ada jadwal') + ' · ' + l.length + ' jamaah', orientL: 'Potret', pages: Math.max(1, Math.ceil(l.length / 28)) * Math.max(1, P.slot != null ? 1 : this.jadwal.length), cols: '16px minmax(0,1fr) 36px', groups: [{ label: 'Raudhoh', col: 'span 1' }], heads: ['Hadir'],
        rows: l.slice(0, 8).map((j, i) => ({ no: i + 1, name: j.name, cells: [SY[this.cellOf('madinah', this.sheetCols('madinah', [0])[0], j).t]] })), hasMore: l.length > 8, more: l.length - 8 };
    } else { const cols2 = this.sheetCols(shd.mode, shd.secs[0].ks), c5 = cols2.slice(0, 5), pl2 = this.scopeList(P);
      const cv = c => { const s0 = SY[c.t] || SY.box; return { ...s0, v: c.vt || c.v, bg: c.sus ? 'var(--color-accent-200)' : s0.bg }; };
      pr = { title: shd.title, sub: this.scopeLabel(P) + ' · ' + pl2.length + ' jamaah', orientL: shd.land ? 'Lanskap' : 'Potret', pages: Math.max(1, Math.ceil(pl2.length / (shd.land ? 18 : 28))) * shd.secs.length, cols: '16px minmax(0,1fr) ' + c5.map(() => '36px').join(' '), groups: this.grpHdr(shd.mode, c5), heads: c5.map(c => c.short),
        rows: pl2.slice(0, 8).map((j, i) => ({ no: i + 1, name: j.name, cells: c5.map(c => cv(this.cellOf(shd.mode, c, j))) })), hasMore: pl2.length > 8, more: pl2.length - 8, hasExtra: cols2.length > 5, extra: cols2.length - 5 }; }
    pr = { hasMore: false, more: 0, hasExtra: false, extra: 0, ...pr, ppih: PPN };
    const cirDash = (p, c) => (Math.min(100, p) * c / 100).toFixed(1) + ' ' + c;
    const remain = this.jm.filter(j => this.tgt(S.mode, ci, j, D) && !sat(ci, j)).length;
    const toCk = (rite, scope, r, g) => () => this.setState(s => ({ tab: 'checklist', ckPilih: false, ck: { ...s.ck, rite, scope, r: r || s.ck.r, g: g || s.ck.g } }));
    const rgCol = p => p < 70 ? 'var(--red-600)' : 'var(--color-accent)', rgFg = p => p < 70 ? 'var(--red-700)' : 'var(--color-accent)';
    const rg = RS.rombs.map(o => ({ l: 'R' + o.r, name: 'Rombongan ' + o.r, sub: 'Ketua ' + o.ketua, dn: o.d + '/' + o.n, soft: o.pct < 70 ? 'var(--red-100)' : 'var(--color-accent-100)', pct: o.pct + '%', col: rgCol(o.pct), fg: rgFg(o.pct), dash: cirDash(o.pct, 144.5), aria: 'Rombongan ' + o.r + ' ' + o.pct + ' persen', on: toCk(ci, 'rombongan', o.r) }));
    const jrSt = (() => { if (S.mode === 'madinah') return null; const idx = re => X.rites.map((r, k) => re.test(r.n) ? k : -1).filter(k => k >= 0), span = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);
      let st; if (S.mode === 'haji') { const f = n => X.rites.findIndex(r => r.n === n), w = f('Wukuf di Arafah'), mu = f('Murur Mabit'), a = f('Jumroh Aqobah'), t = f('Thawaf Ifadzoh');
        st = [['Mina 8', span(0, w)], ['Arafah 9', span(w, mu)], ['Muzdalifah', span(mu, a)], ['Mina 10–13', span(a, t)], ['Makkah', span(t, nR)]]; }
      else st = [['Miqat', idx(/^(Niat|Ihram) Umrah$|^Miqat$/)], ['Thawaf', idx(/^Thawaf/)], ["Sa'i", idx(/^Sa'i/)], ['Tahallul', idx(/^Tahallul/)]];
      return st.filter(s => s[1].length); })();
    const jr = (() => { if (!jrSt) return {}; const n = jrSt.length, pts = jrSt.map(([l, ks], i) => { const x = n > 1 ? 12 + i * 76 / (n - 1) : 50, y = i % 2 ? 76 : 22, done = ks.every(k => k < ci), cur = ks.some(k => k === ci) || (!done && ks[0] < ci);
        return { x, y, l, done, cur: cur && !done, left: x + '%', top: y + 'px', bg: done ? 'var(--color-accent)' : cur ? 'var(--color-accent-500)' : 'var(--color-neutral-200)', ring: done ? 'none' : cur ? '0 0 0 5px var(--color-accent-200)' : 'inset 0 0 0 2px var(--color-neutral-400)', fw: cur ? 800 : 600, fg: done ? 'var(--color-accent)' : cur ? 'var(--color-text)' : 'var(--teks-3)' }; });
      let d = 'M' + pts[0].x + ' ' + (pts[0].y + 14); for (let i = 1; i < n; i++) { const a = pts[i - 1], b = pts[i], mx = (a.x + b.x) / 2; d += ' C' + mx + ' ' + (a.y + 14) + ' ' + mx + ' ' + (b.y + 14) + ' ' + b.x + ' ' + (b.y + 14); }
      const now = pts.find(p => p.cur); return { title: S.mode === 'haji' ? 'Perjalanan haji' : 'Perjalanan umrah', d, stops: pts, now: now ? 'Sekarang · ' + now.l : '' }; })();
    const khCnt = (() => { const base = this.jm.filter(j => this.isKh(j)); return { base, semua: base.length, risti: base.filter(j => j.risti).length, lansia: base.filter(j => this.khOf(j.id).lansia).length, kroda: base.filter(j => this.khOf(j.id).kroda).length, tanpa: base.filter(j => !this.pendKey(j.id)).length }; })();
    const khSum = { txt: khCnt.risti + ' risti · ' + khCnt.lansia + ' lansia · ' + khCnt.kroda + ' kursi roda', tanpa: khCnt.tanpa ? khCnt.tanpa + ' jamaah belum punya pendamping' : 'Semua sudah punya pendamping', tanpaFg: khCnt.tanpa ? 'var(--red-700)' : 'var(--color-accent)', n: khCnt.semua, on: go('jamaah', { jl: { ...S.jl, v: 'kh', kf: 'semua' } }) };
    const jkV = (() => { const J = S.jl, q = (J.q || '').trim().toLowerCase(), f = J.kf || 'semua';
      const F = { semua: () => true, risti: j => j.risti, lansia: j => this.khOf(j.id).lansia, kroda: j => this.khOf(j.id).kroda, tanpa: j => !this.pendKey(j.id) };
      const l = khCnt.base.filter(F[f] || F.semua).filter(j => !q || j.name.toLowerCase().includes(q) || j.porsi.includes(q) || this.pendDesc(j.id).toLowerCase().includes(q));
      const gm = {}; l.forEach(j => { const key = j.r + '|' + j.g; (gm[key] = gm[key] || []).push(j); });
      const groups = Object.keys(gm).sort((a, b) => { const [ar, ag] = a.split('|').map(Number), [br, bg] = b.split('|').map(Number); return ar - br || ag - bg; }).map(key => { const [r, g] = key.split('|').map(Number), js = gm[key];
        return { title: 'Rombongan ' + r + ' · Regu ' + g, sub: 'Ketua regu: ' + this.ketuaG(r, g).name, n: js.length + ' jamaah', rows: js.map(j => { const k = this.khOf(j.id), pk = this.pendKey(j.id);
          const tags = [j.risti ? { t: 'Risti', bg: 'var(--red-100)', fg: 'var(--red-700)' } : null, k.lansia ? { t: 'Lansia', bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' } : null, k.kroda ? { t: 'Kursi roda', bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' } : null].filter(Boolean);
          return { name: j.name, ini: j.ini, avBg: j.risti ? 'var(--red-100)' : 'var(--color-accent-200)', avFg: j.risti ? 'var(--red-700)' : 'var(--color-accent)', tags, pend: pk ? 'Pendamping: ' + this.pendDesc(j.id) : 'Belum ada pendamping · ketuk untuk memilih', adaPend: !!pk, pendFg: pk ? 'var(--color-text)' : 'var(--red-700)', pendIni: pk ? (this.pelName(pk).split(/\s+/).slice(0, 2).map(w => w[0] || '').join('')) : '!', pendBg: pk ? 'var(--color-accent-100)' : 'var(--red-100)', pendIc: pk ? 'var(--color-accent)' : 'var(--red-700)', on: () => this.setState({ sel: j.id }) }; }) }; });
      return { isAll: J.v !== 'kh', isKh: J.v === 'kh', groups, empty: !l.length, segs: [['semua', 'Semua jamaah'], ['kh', 'Jamaah khusus · ' + khCnt.semua]].map(([v, lb]) => ({ l: lb, on: () => this.patch('jl', { v }), ...pill((J.v || 'semua') === v) })),
        chips: [['semua', 'Semua'], ['risti', 'Risti'], ['lansia', 'Lansia'], ['kroda', 'Kursi roda'], ['tanpa', 'Tanpa pendamping']].map(([k, lb]) => { const a = f === k; return { l: lb, n: khCnt[k], on: () => this.patch('jl', { kf: k }), a, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--on-accent)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--m-tepi)' }; }) }; })();
    const skV = (() => { if (S.sel == null || !this.jm[S.sel]) return {}; const j = this.jm[S.sel], k = this.khOf(j.id), pk = this.pendKey(j.id), bk = this.pelbKey(j.id);
      const tg = (l, a, on) => ({ l, on, a, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--on-isi)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--m-tepi)' });
      return { chips: [tg('Lansia', k.lansia, () => this.setKh(j.id, { lansia: !k.lansia })), tg('Kursi roda', k.kroda, () => this.setKh(j.id, { kroda: !k.kroda })), tg(S.udz[j.id] ? 'Perlu badal (udzur)' : 'Perlu badal', S.udz[j.id] || k.pb, () => { if (S.udz[j.id]) this.flash('Jamaah udzur otomatis masuk daftar badal'); else this.setKh(j.id, { pb: !k.pb }); })],
        pend: pk ? this.pendDesc(j.id) : 'Belum ada pendamping', pendFg: pk ? 'var(--color-text)' : 'var(--red-700)', pendCta: pk ? 'Ganti' : 'Pilih', onPend: () => this.setState({ pp: { kind: 'pend', id: j.id, q: '', sel: pk, src: 'jamaah' } }),
        showPelb: this.needBadal(j), pelb: bk ? this.pelText(bk) : 'Belum ada pelaksana tetap', pelbFg: bk ? 'var(--color-text)' : 'var(--red-700)', pelbCta: bk ? 'Ganti' : 'Pilih', onPelb: () => this.setState({ pp: { kind: 'pelb', id: j.id, q: '', sel: bk, src: 'jamaah' } }) }; })();
    const ppV = (() => { const P = S.pp; if (!P) return {}; const tj = P.id != null ? this.jm[P.id] : null, q = (P.q || '').trim().toLowerCase(), src = P.src || 'jamaah';
      let js = this.jm.filter(j => (!tj || j.id !== tj.id) && (!q || j.name.toLowerCase().includes(q) || j.porsi.includes(q)));
      if (P.kind === 'addb') js = js.filter(j => !this.needBadal(j)); if (P.kind === 'pend') js = js.filter(j => !S.udz[j.id]);
      if (tj) js.sort((a, b) => (((b.r === tj.r && b.g === tj.g) ? 1 : 0) - ((a.r === tj.r && a.g === tj.g) ? 1 : 0)) || ((b.r === tj.r ? 1 : 0) - (a.r === tj.r ? 1 : 0)));
      const load = key => P.kind === 'pend' ? this.jm.filter(x => this.pendKey(x.id) === key).length : P.kind === 'pelb' ? this.jm.filter(x => this.pelbKey(x.id) === key).length : 0;
      let opts = src === 'petugas' && P.kind === 'pelb' ? this.petugas.filter(p => !q || p.name.toLowerCase().includes(q)).map(p => ({ key: p.key, name: p.name, sub: p.role })) : js.slice(0, 40).map(j => ({ key: 'j' + j.id, name: j.name, sub: `R${j.r} · Regu ${j.g}` + (tj && j.r === tj.r && j.g === tj.g ? ' · satu regu' : '') + (j.risti ? ' · Risti' : '') }));
      if (P.kind === 'pelb' && q && !opts.some(o => o.name.toLowerCase() === q)) opts.unshift({ key: 'x:' + P.q.trim(), name: P.q.trim(), sub: 'Nama lain · ketik manual' });
      opts = opts.map(o => { const a = P.sel === o.key, l = load(o.key); return { ...o, sub: o.sub + (l ? ' · ' + (P.kind === 'pend' ? 'mendampingi ' : 'membadali ') + l : ''), on: () => this.patch('pp', { sel: o.key }), bg: a ? 'var(--color-accent-100)' : 'transparent', mark: a ? '✓' : '', mbg: a ? 'var(--color-accent)' : 'transparent', mring: a ? 'var(--color-accent)' : 'var(--color-neutral-400)' }; });
      const title = P.kind === 'pend' ? 'Pendamping untuk ' + tj.name : P.kind === 'pelb' ? 'Pelaksana badal untuk ' + tj.name : 'Tambah jamaah yang dibadalkan';
      const sub = tj ? `R${tj.r} · Regu ${tj.g}` + (P.kind === 'pelb' ? ' · berlaku 10–13 Dzh · pelaksana boleh melontar untuk dirinya sekaligus' : ' · dipilih dari jamaah · satu regu di atas') : 'Pilih jamaah non-udzur yang perlu dibadalkan';
      const has = tj ? (P.kind === 'pend' ? !!this.pendKey(tj.id) : P.kind === 'pelb' ? !!this.pelbKey(tj.id) : false) : false;
      return { title, sub, q: P.q, onQ: e => this.patch('pp', { q: e.target.value }), opts, empty: !opts.length, hasSrc: P.kind === 'pelb', srcs: [['jamaah', 'Jamaah'], ['petugas', 'Petugas']].map(([k, l]) => ({ l, on: () => this.patch('pp', { src: k, sel: null }), ...pill(src === k) })), canDel: has, cta: P.kind === 'addb' ? 'Tambahkan' : 'Simpan', ctaBg: P.sel ? 'var(--color-accent)' : 'var(--color-neutral-300)' }; })();
    const bdV = (() => { const H = this.data.haji, Dh = S.done.haji, BR = this.badalRites(), st = S.bd || { v: 'jamaah', q: '', day: 0 };
      if (!BR.length) return { notHaji: true, isJ: false, isP: false };
      const cdm = +((/(\d+)/.exec(String(H.rites[H.cur].day)) || [])[1] || 10), curB = BR.find(b => b.d === cdm) || BR.filter(b => b.k <= H.cur).pop() || BR[0];
      const day = st.day || curB.d, B = BR.find(b => b.d === day) || BR[0], bk = B.k, q = (st.q || '').trim().toLowerCase();
      const all = this.jm.filter(j => this.needBadal(j)), match = j => { if (!q) return true; const p = this.pelOfB(j); return j.name.toLowerCase().includes(q) || j.porsi.includes(q) || (p && this.pelName(p).toLowerCase().includes(q)); };
      const list = all.filter(match), act = all.filter(j => !this.naLock('haji', bk, j, Dh)), doneN = act.filter(j => Dh[bk][j.id]).length, todo = act.filter(j => !Dh[bk][j.id]), ready = todo.filter(j => this.pelOfB(j, bk));
      const dayCell = (j, b) => { const na = this.naLock('haji', b.k, j, Dh), d = Dh[b.k][j.id], cur = b.d === day; return { l: b.d + (na ? ' NA' : d ? ' ✓' : cur ? ' •' : ''), bg: na ? 'var(--color-neutral-100)' : d ? 'var(--color-accent)' : cur ? 'var(--color-accent-200)' : 'var(--color-neutral-100)', fg: na ? 'var(--color-neutral-600)' : d ? 'var(--on-accent)' : cur ? 'var(--color-accent)' : 'var(--color-neutral-600)', on: () => this.badalToggle(j, b.k) }; };
      const rows = list.map(j => { const pk = this.pelOfB(j, bk); return { ini: j.ini, name: j.name, tag: S.udz[j.id] ? 'Udzur' : 'Ditambahkan', tagBg: S.udz[j.id] ? 'var(--red-100)' : 'var(--color-accent-200)', tagFg: S.udz[j.id] ? 'var(--red-700)' : 'var(--color-accent)',
        sub: `R${j.r}·${j.g} · ` + (pk ? 'oleh ' + this.pelText(pk) : 'Belum ada pelaksana · ketuk untuk memilih'), subFg: pk ? 'var(--teks-3)' : 'var(--red-700)', days: BR.map(b => dayCell(j, b)), on: () => this.setState({ pp: { kind: 'pelb', id: j.id, q: '', sel: this.pelbKey(j.id), src: 'jamaah' } }) }; });
      const gm = {}; list.forEach(j => { const p = this.pelOfB(j, bk) || '_'; (gm[p] = gm[p] || []).push(j); });
      const groups = Object.keys(gm).sort((a, b) => (a === '_') - (b === '_') || gm[b].length - gm[a].length).map(p => ({ name: p === '_' ? 'Belum ada pelaksana' : this.pelName(p), role: p === '_' ? 'Tentukan pelaksana untuk jamaah berikut' : (this.pelRole(p) + (p[0] === 'j' ? ' · melontar untuk diri sendiri + ' + gm[p].length + ' jamaah' : ' · membadali ' + gm[p].length + ' jamaah')), n: gm[p].length, ini: p === '_' ? '!' : this.pelName(p).split(/\s+/).slice(0, 2).map(w => w[0] || '').join(''), icBg: p === '_' ? 'var(--red-100)' : 'var(--color-accent-100)', icFg: p === '_' ? 'var(--red-700)' : 'var(--color-accent)',
        items: gm[p].map(j => { const na = this.naLock('haji', bk, j, Dh), d = Dh[bk][j.id]; return { name: j.name, sub: `R${j.r}·${j.g}`, st: na ? 'NA' : d ? day + ' ✓' : day + ' belum', stFg: na ? 'var(--color-neutral-600)' : d ? 'var(--color-accent)' : 'var(--color-text)', on: () => this.badalToggle(j, bk) }; }) }));
      return { notHaji: S.mode !== 'haji', isJ: S.mode === 'haji' && st.v !== 'pel', isP: S.mode === 'haji' && st.v === 'pel', q: st.q || '', onQ: e => this.patch('bd', { q: e.target.value }),
        segs: [['jamaah', 'Per jamaah'], ['pel', 'Per pelaksana']].map(([v, l]) => ({ l, on: () => this.patch('bd', { v }), ...pill((st.v || 'jamaah') === v) })),
        days: BR.map(b => ({ l: b.d + ' Dzh', on: () => this.patch('bd', { day: b.d }), ...pill(b.d === day) })), dayLbl: day + ' Dzulhijjah' + (b => b && b.k === bk ? '' : '')(curB), isNow: day === curB.d,
        done: doneN, tot: act.length, pct: (act.length ? Math.round(doneN / act.length * 100) : 100) + '%', n: all.length, rows, empty: !rows.length, groups,
        fab: ready.length ? `Centang badal ${day} Dzh · ${ready.length} jamaah` : todo.length ? `${todo.length} jamaah belum punya pelaksana` : `Badal ${day} Dzh sudah lengkap`, fabBg: ready.length ? 'var(--emas-isi)' : 'var(--color-neutral-300)',
        onFab: () => { if (!ready.length) { if (todo.length) this.flash('Pilih pelaksana dulu untuk ' + todo.length + ' jamaah'); return; } const n = this.badalCommit(bk, ready); this.flash(n + ' jamaah dibadalkan · ' + day + ' Dzh'); },
        onAdd: () => this.setState({ pp: { kind: 'addb', q: '', sel: null, src: 'jamaah' } }), toHaji: () => { const c = this.data.haji.cur; this.saveCfg({ mode: 'haji' }); this.setState(s => ({ mode: 'haji', ck: { ...s.ck, rite: c }, pr: { ...s.pr, rites: [c] } })); } }; })();
    const pelFirst = j => { const mm = S.badal[S.mode] || {}; for (const kk in mm) if (mm[kk][j.id]) return this.pelName(mm[kk][j.id]); return ''; };
    const rkp = { n: X.rites[ci].n, sub: X.rites[ci].day + ' · ' + this.klLabel(), done: RS.done, tot: RS.tot, pct: RS.pct + '%', complete: RS.complete,
      segs: [[RS.tepat, 'var(--color-accent)'], [RS.sus, 'var(--color-accent-500)'], [RS.badal, 'var(--color-accent)'], [RS.ulangP, 'var(--color-accent-400)'], [RS.belum, 'var(--color-neutral-300)'], [RS.udzB, 'var(--red-600)']].filter(x => x[0] > 0).map(([n, c]) => ({ w: (n / RS.tot * 100) + '%', c })),
      legend: [['Tepat waktu', RS.tepat, 'var(--color-accent)'], ['Susulan', RS.sus, 'var(--color-accent-500)'], ['Dibadalkan', RS.badal, 'var(--color-accent)'], ['Perlu ulang', RS.ulangP, 'var(--color-accent-400)'], ['Udzur belum dibadalkan', RS.udzB, '#C2372B'], ['Belum', RS.belum, 'var(--color-neutral-300)']].filter(x => x[0] === 'Belum' || x[1] > 0).map(([l, n, c]) => ({ l, n, c })),
      bars: [...RS.rombs].sort((a, b) => a.r - b.r).map(o => ({ l: 'R' + o.r, t: o.pct + '%', h: Math.max(3, Math.round(o.pct * 1.2)) + 'px', c: o.pct < 70 ? '#C2372B' : 'var(--color-accent)', fg: o.pct < 70 ? 'var(--red-700)' : 'var(--color-accent)', aria: 'Rombongan ' + o.r + ' ' + o.pct + ' persen', on: toCk(ci, 'rombongan', o.r) })),
      cg: (() => { const parts = [[RS.tepat, 'var(--color-accent)'], [RS.sus, 'var(--color-accent-500)'], [RS.badal, 'var(--color-accent)'], [RS.ulangP, 'var(--color-accent-400)'], [RS.udzB, '#C2372B'], [RS.belum, 'var(--color-neutral-300)']].filter(x => x[0] > 0); let a = 0; const tot = Math.max(1, RS.tot); return parts.length ? parts.map(([n, c]) => { const s = a; a += n / tot * 100; return c + ' ' + s.toFixed(2) + '% ' + a.toFixed(2) + '%'; }).join(', ') : '#DCE3DF 0% 100%'; })(),
      rombs: RS.rombs.map(o => ({ l: 'Rombongan ' + o.r, ketua: o.ketua, txt: o.d + '/' + o.n + ' · ' + o.pct + '%', pct: o.pct + '%', col: rgCol(o.pct), fg: rgFg(o.pct), on: toCk(ci, 'rombongan', o.r) })),
      att: RS.att.slice(0, 8).map(a => { const sus = a.t !== 'Tertinggal'; return { name: a.j.name, ini: a.j.ini, sub: `R${a.j.r} · Regu ${a.j.g} · ` + X.rites[a.k].p, tag: a.t, tagBg: sus ? 'var(--color-accent-200)' : 'var(--red-100)', tagFg: sus ? 'var(--color-accent)' : 'var(--red-700)', on: toCk(a.k, 'regu', a.j.r, a.j.g) }; }),
      attEmpty: RS.att.length === 0, attMore: RS.att.length > 8, attMoreTxt: '+' + (RS.att.length - 8) + ' lainnya · lihat di tab Jamaah', attSub: (RS.puN ? RS.puN + ' perlu ulang · ' : '') + RS.tertN + ' tertinggal · ' + RS.susN + ' susulan',
      hasPil: RS.multi, pilTxt: Object.entries(RS.pil).map(([p, n]) => p + ' ' + n).join(' · ') + (RS.multi ? ' · dipilih salah satu per jamaah' : ''),
      hasUmr: !!RS.umr, umr: RS.umr ? [['Sempurna', RS.umr.semp, 'var(--color-accent-100)', 'var(--color-accent)'], ['Diulang (selesai)', RS.umr.diul, 'var(--color-accent-200)', 'var(--color-accent)'], ['Perlu ulang', RS.umr.perlu, 'var(--red-100)', 'var(--red-700)']].map(([l, n, bg, fg]) => ({ l, n, bg, fg })) : [],
      hasBl: RS.bl.length > 0 || RS.blWarn > 0, blSub: RS.bl.length + ' jamaah dibadalkan · jamaah → pelaksana', hasBlWarn: RS.blWarn > 0, blWarn: RS.blWarn + ' data badal belum memiliki pelaksana. Buka checklist badal dan ketuk nama jamaah untuk melengkapi.',
      bl: RS.bl.slice(0, 12).map(x => ({ name: x.j.name, pel: x.key ? this.pelText(x.key) : 'pelaksana belum dicatat', sub: X.rites[x.k].n + ' · R' + x.j.r + '/Regu ' + x.j.g, fg: x.key ? 'var(--teks-3)' : 'var(--red-700)', on: toCk(x.k, 'regu', x.j.r, x.j.g) })),
      blMore: RS.bl.length > 12, blMoreTxt: '+' + (RS.bl.length - 12) + ' lainnya · lihat lembar cetak' };
    const susSheet = (() => { const d = S.susDlg; if (!d) return {}; const R = X.rites[d.rite], today = this.todayKey();
      const addD = (iso, n) => { const t = new Date(iso + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
      const a = parseInt(X.rites[ci].day), b = parseInt(R.day), off = isNaN(a) || isNaN(b) ? 0 : Math.max(0, a - b), base = R.tgl && R.tgl <= today ? R.tgl : addD(today, -off);
      const cand = [[base, 'Hari jadwal'], [addD(base, 1), '+1 hari'], [addD(base, 2), '+2 hari']].filter(([t], i, arr) => t <= today && arr.findIndex(x => x[0] === t) === i);
      if (!cand.some(x => x[0] === today)) cand.push([today, 'Hari ini']);
      const opts = cand.map(([t, l]) => { const on = d.tgl === t && !d.other; return { l: l + ' · ' + this.fmtTgl(t), bg: on ? 'var(--color-accent-200)' : 'var(--color-surface)', fg: on ? 'var(--color-accent)' : 'var(--color-text)', ring: on ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.setState(st => ({ susDlg: { ...st.susDlg, tgl: t, other: false } })) }; });
      opts.push({ l: 'Pilih lainnya', bg: d.other ? 'var(--color-accent-200)' : 'var(--color-surface)', fg: d.other ? 'var(--color-accent)' : 'var(--color-text)', ring: d.other ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.setState(st => ({ susDlg: { ...st.susDlg, other: true } })) });
      const n = d.ids.length, j0 = n ? this.jm[d.ids[0]] : null, pq = (d.pq || '').trim().toLowerCase(), pick = key => () => this.setState(st => ({ susDlg: { ...st.susDlg, pend: key, pq: '' } }));
      const pOpts = !R.pend || d.pend ? [] : (pq ? this.petugas.filter(p => p.name.toLowerCase().includes(pq)).map(p => ({ key: p.key, name: p.name, sub: p.role + ' · Petugas' })).concat(this.jm.filter(j => j.name.toLowerCase().includes(pq) || j.porsi.includes(pq)).slice(0, 8).map(j => ({ key: 'j' + j.id, name: j.name, sub: 'Jamaah R' + j.r + ' · Regu ' + j.g }))).concat([{ key: 'x:' + d.pq.trim(), name: d.pq.trim(), sub: 'Nama lain · ketik manual' }])
        : this.petugas.map(p => ({ key: p.key, name: p.name, sub: p.role + ' · Petugas' }))).map(o => ({ ...o, on: pick(o.key) }));
      const candL = (d.cand || []).map(id => { const j = this.jm[id], a = d.ids.includes(id); return { name: j.name, sub: `R${j.r} · Regu ${j.g}`, mark: a ? '✓' : '', bg: a ? 'var(--color-accent)' : 'transparent', ring: a ? 'var(--color-accent)' : 'var(--color-neutral-400)', on: () => this.setState(st => ({ susDlg: { ...st.susDlg, ids: a ? st.susDlg.ids.filter(x => x !== id) : [...st.susDlg.ids, id] } })) }; });
      const t1 = d.tgl || today, prev = d.ulang ? 'Ulang ke-' + d.ulang + ' · ' + this.fmtTgl(t1) : this.autoSus(R, t1, true, d.x) ? 'Susulan · ' + this.fmtH(t1) + ' (' + this.fmtTgl(t1) + ')' : 'tepat waktu · ' + this.fmtTgl(t1) + ' (sesuai jadwal)';
      return { n, rite: R.n, title: (d.ulang ? 'Catat ulang ' : d.group ? 'Catat susulan berkelompok · ' : 'Catat susulan ') + R.n, hasCand: !!d.cand, cand: candL, candN: n + ' dari ' + (d.cand || []).length + ' dipilih', hasWho: !d.cand,
        who: n === 1 ? j0.name : n + ' jamaah', whoSub: n === 1 ? `R${j0.r} · Regu ${j0.g} · Porsi ${j0.porsi}` : this.scopeLabel(S.ck), hari: R.day + (R.place ? ' · ' + R.place : ''), opts, other: !!d.other, tgl: t1, max: today, jam: d.jam || '', ket: d.ket || '',
        prev: prev + (d.pend ? ' · didampingi ' + this.pelName(d.pend) : ''), needPend: !!R.pend, hasPend: !!d.pend, noPend: !d.pend, pendName: d.pend ? this.pelName(d.pend) + ' · ' + this.pelRole(d.pend) : '', pq: d.pq || '', pOpts,
        clearPend: () => this.setState(st => ({ susDlg: { ...st.susDlg, pend: '' } })), noSave: !n || (R.pend && !d.pend), cta: d.ulang ? 'Simpan ulang' : (this.autoSus(R, t1, true, d.x) ? 'Simpan susulan' : 'Simpan') + (n > 1 ? ' · ' + n + ' jamaah' : '') }; })();
    const amb = a => ({ bg: a ? 'var(--color-accent-200)' : 'var(--color-surface)', fg: a ? 'var(--color-accent)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)' });
    const sfd = S.safDlg, sf = sfd ? (() => { const n = sfd.ids.length, j0 = this.jm[sfd.ids[0]]; return { who: n === 1 ? j0.name : n + ' jamaah', cat: sfd.cat, catReq: sfd.why === 'Lainnya' ? 'Catatan (wajib)' : 'Catatan (opsional)', noSave: !sfd.why || (sfd.why === 'Lainnya' && !sfd.cat.trim()),
      whys: ['Dirawat di KKHI/RS', 'Lansia/Risti', 'Kursi roda', 'Lainnya'].map(l => { const a = sfd.why === l; return { l, bg: a ? 'var(--color-accent-200)' : 'var(--color-surface)', fg: a ? 'var(--color-accent)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('safDlg', { why: l }) }; }) }; })() : {};
    const uld = S.ulDlg, ul = uld ? (() => { const j = this.jm[uld.id]; return { who: j.name + ' · R' + j.r + ' · Regu ' + j.g, cat: uld.cat, rencana: uld.rencana, min: this.todayKey(), catReq: uld.why === 'Lainnya' ? 'Catatan (wajib)' : 'Catatan (opsional)', noSave: !uld.tahap || !uld.why || (uld.why === 'Lainnya' && !uld.cat.trim()),
      tahaps: ['Thawaf', "Sa'i", 'Tahallul', 'Seluruh rangkaian'].map(l => ({ l, ...amb(uld.tahap === l), on: () => this.patch('ulDlg', { tahap: l }) })),
      whys: ['Kurang putaran', 'Batal wudhu', 'Salah urutan', "Tidak di area Mas'a", 'Lainnya'].map(l => ({ l, ...amb(uld.why === l), on: () => this.patch('ulDlg', { why: l }) })) }; })() : {};
    const cs = isMad && ck.slot != null ? this.jadwal[ck.slot] : null, mdDaysL = [...new Set(this.jadwal.map(x => x.tgl))];
    const mdT = cs ? cs.tgl : mdDaysL.includes(ck.mdTgl) ? ck.mdTgl : mdDaysL[0], mdS = cs && cs.sex ? cs.sex : (ck.mdSex || 'L');
    const mdDays = mdDaysL.map(t => { const a = t === mdT; return { l: t, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--on-isi)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('ck', { mdTgl: t, slot: null }) }; });
    const mdSexBtns = [['L', 'Laki-laki'], ['P', 'Perempuan']].map(([k, l]) => ({ l, ...pill(mdS === k), on: () => this.patch('ck', { mdSex: k, slot: null }) }));
    const mdJams = isMad ? this.jadwal.map((x, i) => ({ x, i })).filter(o => o.x.tgl === mdT && (!o.x.sex || o.x.sex === mdS)).map(({ x, i }) => { const l = this.jm.filter(j => this.inSlot(j, x) && !S.udz[j.id]), d = l.filter(j => MD[j.id]).length, a = ck.slot === i;
      return { l: x.jam, sub: x.romb.length ? 'R' + x.romb.join(', R') : 'Semua rombongan', cnt: d + '/' + l.length, rw: a ? '2.5px' : '1.5px', bg: a ? 'var(--color-accent-100)' : 'var(--color-surface)', fg: 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('ck', { slot: a ? null : i, scope: 'kloter', mdTgl: x.tgl, mdSex: x.sex || mdS }) }; }) : [];
    const sdl = S.slotDlg, updSd = p => this.setState(st => ({ slotDlg: { ...st.slotDlg, ...p } }));
    const sd = sdl ? { tgl: sdl.tgl, a: sdl.a, b: sdl.b, ket: sdl.ket, noSave: !(sdl.tgl && sdl.a && sdl.b && sdl.romb.length),
      sexBtns: [['L', 'Laki-laki'], ['P', 'Perempuan']].map(([k, l]) => ({ l, ...pill(sdl.sex === k), on: () => updSd({ sex: k }) })),
      rs: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const a = sdl.romb.includes(r); return { l: 'R' + r, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--on-isi)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => updSd({ romb: a ? sdl.romb.filter(x => x !== r) : [...sdl.romb, r].sort((x, y) => x - y) }) }; }),
      prev: 'Akan tersimpan: ' + (this.fmtTgl(sdl.tgl) || '-') + ' · ' + (sdl.a && sdl.b ? sdl.a.replace(':', '.') + '–' + sdl.b.replace(':', '.') : 'jam belum diisi') + ' · ' + (sdl.sex === 'P' ? 'Perempuan' : 'Laki-laki') + ' · ' + (sdl.romb.length ? 'R' + sdl.romb.join(', R') : 'pilih rombongan') } : {};
    const LOGO = this;
    const allSel = ks.length === nR;
    return {
      isBeranda: S.tab === 'beranda', isJamaah: S.tab === 'jamaah', isChecklist: S.tab === 'checklist', isCetak: S.tab === 'cetak',
      scrollRef: this.scrollRef, kloterLabel: this.klLabel(), d: { ...X, day: X.rites[ci].day, kicker: X.kicker.replace('Kloter {K}', this.klLabel())  },
      outerPad: full ? '0' : '32px 24px', fW: full ? '100%' : '390px', fH: full ? '100dvh' : '844px', fR: full ? '0' : '48px', fB: full ? '0' : '8px solid #0d2b25', fS: full ? 'none' : 'var(--shadow-lg)',
      rk: (() => { const due = this.rekapDue(), hr = this.remindHour();
        return { due, bg: due ? 'var(--red-100)' : 'var(--color-surface)', ring: due ? '2px var(--red-500)' : '0 transparent',
          sub: (this.cfg && this.cfg.lastRekap === this.todayKey()) ? 'Sudah dikirim hari ini · ' + X.rites[ci].n : 'Kegiatan: ' + X.rites[ci].day + ' · pengingat ' + hr + '.00 WAS',
          hours: [19, 20, 21, 22].map(x => ({ l: x + '.00', bg: hr === x ? 'var(--color-accent)' : 'var(--color-neutral-100)', fg: hr === x ? 'var(--on-isi)' : 'var(--color-text)', on: () => { this.saveCfg({ remindHour: x }); this.forceUpdate(); } })),
          canNotif: typeof Notification !== 'undefined' && Notification.permission === 'default' }; })(),
      askNotif: () => { try { Notification.requestPermission().then(() => this.forceUpdate()); } catch (e) {} },
      hasWa: !!S.wa, openWa: () => this.setState({ wa: true }), closeWa: () => this.setState({ wa: false }),
      waText: S.wa ? this.waText() : '', waLink: S.wa ? 'https://wa.me/?text=' + encodeURIComponent(this.waText()) : '#',
      copyWa: () => this.copyWa(), copyLabel: S.copied ? 'Tersalin ✓' : 'Salin teks', markRekap: () => { this.saveCfg({ lastRekap: this.todayKey() }); this.forceUpdate(); },
      goRekapPdf: () => this.setState(s => ({ tab: 'cetak', pr: { ...s.pr, sheet: 'harian' }, pdf: true })),
      clockWas: this.tz('Asia/Riyadh'), clockWib: this.tz('Asia/Jakarta'),
      isMad, mdDays, mdSexBtns, mdJams, mdNone: isMad && this.jadwal.length > 0 && mdJams.length === 0, mdSexName: mdS === 'P' ? 'perempuan' : 'laki-laki', noSlots: isMad && !this.jadwal.length, openAddSlot: () => this.openAddSlot(), sexSplit,
      hasSlotDlg: !!S.slotDlg, sd, closeSlotDlg: () => this.setState({ slotDlg: null }), saveSlot: () => this.saveSlot(), sdTgl: e => updSd({ tgl: e.target.value }), sdA: e => updSd({ a: e.target.value }), sdB: e => updSd({ b: e.target.value }), sdKet: e => updSd({ ket: e.target.value }), suPpih: e => this.patch('su', { ppih: e.target.value }), slotActive: !!slot, clearSlot: () => this.patch('ck', { slot: null }),
      prIsRaud: (P.sheet || 'armuzna') === 'raudhoh', prSheets: [['umrah', 'Umrah wajib', 'Potret'], ['armuzna', 'Haji · Armuzna', '7–10 Dzh · lanskap'], ['tasyrik', 'Haji · Hari Tasyrik', '11–13 Dzh · lanskap'], ['makkah', "Haji · Ifadzoh–Wada'", "Thawaf, Sa'i, Tahallul Tsani · potret"], ['raudhoh', 'Raudhoh per jadwal', 'Potret'], ['harian', 'Rekap harian', 'Per rombongan'], ['khusus', 'Jamaah khusus', 'Risti · lansia · kursi roda · pendamping'], ['badal', 'Badal per pelaksana', '10–13 Dzh · potret']].map(([k, l, sub]) => { const a = (P.sheet || 'armuzna') === k; return { l, sub, bg: a ? 'var(--color-accent-100)' : 'var(--color-surface)', fg: 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('pr', { sheet: k }) }; }),
      prSlots: (P.sheet || 'armuzna') === 'raudhoh' ? [{ l: 'Semua', a: P.slot == null, i: null }].concat(this.jadwal.map((s, i) => ({ l: s.tgl + ' ' + s.jam + ' ' + (s.sex || ''), a: P.slot === i, i }))).map(o => ({ l: o.l, ...chip(o.a), on: () => this.patch('pr', { slot: o.i }) })) : [],
      ckNotCur: !isMad && ck.rite !== ci, ckSetCur: () => this.setCur(ck.rite), modes, rites, riteGroups, stats,
      cur: { ...X.rites[ci], susTxt: (n => n ? ' · ' + n + ' susulan' : '')(this.susN(S.mode, ci, D)), done: RS.done, tot: RS.tot, pct: RS.pct + '%', dash: cirDash(RS.pct, 339.3), btn: remain ? 'Buka checklist · ' + remain + ' jamaah lagi' : 'Buka checklist · semua selesai' }, total: this.jm.length, rg, jr, hasJr: !!jrSt, rkp, ss: susSheet, jk: jkV, khSum, sk: skV, pp: ppV, hasPp: !!S.pp, closePp: () => this.setState({ pp: null }), savePp: () => this.savePp(), delPp: () => this.delPp(), bd: bdV, isBadal: S.tab === 'badal', ckQ: S.ck.q || '', onCkQ: e => this.patch('ck', { q: e.target.value }), isRekap: S.tab === 'rekap', shareCard: () => this.shareCard(),
      logoBox: this.logoBox,
      hasSaf: !!S.safDlg, sf, closeSaf: () => this.setState({ safDlg: null }), saveSaf: () => this.saveSaf(), safCat: e => this.patch('safDlg', { cat: e.target.value }),
      hasUl: !!S.ulDlg, ul, closeUl: () => this.setState({ ulDlg: null }), saveUl: () => this.saveUlang(), ulCat: e => this.patch('ulDlg', { cat: e.target.value }), ulRencana: e => this.patch('ulDlg', { rencana: e.target.value }),
      susPq: e => { const v = e.target.value; this.setState(st => ({ susDlg: st.susDlg && { ...st.susDlg, pq: v } })); },
      ckTarw: !!R0.tarw, tarwBtns: [7, 8].map(d => ({ l: d + ' Dzulhijjah', ...pill((ck.tarwD || 8) === d), on: () => this.patch('ck', { tarwD: d }) })),
      susJam: e => { const v = e.target.value; this.setState(st => ({ susDlg: st.susDlg && { ...st.susDlg, jam: v } })); }, susKet: e => { const v = e.target.value; this.setState(st => ({ susDlg: st.susDlg && { ...st.susDlg, ket: v } })); },
      toastBottom: S.tab === 'checklist' || S.tab === 'rekap' ? '150px' : '92px',
      openCurChecklist: go('checklist', { ck: { ...ck, rite: ci } }),
      jl, onQuery: e => this.patch('jl', { q: e.target.value }),
      home: S.tab === 'beranda' ? this.homeVals() : null,
      kirim: S.tab === 'kirim' ? { jenis: (S.kirimLayar || {}).jenis || '', ubahTemplat: !!(S.kirimLayar || {}).ubah,
        buka: jenis => this.setState({ kirimLayar: { jenis } }), ubah: on => this.setState(s => ({ kirimLayar: { ...s.kirimLayar, ubah: on } })),
        tutup: () => this.setState(s => ({ kirimLayar: s.kirimLayar && s.kirimLayar.ubah ? { ...s.kirimLayar, ubah: false } : null })),
        jamaah: this.jm.map(j => ({ porsi: j.porsi, name: j.name, r: j.r, g: j.g, role: j.role })), kloter: String(this.klLabel()).replace(/^Kloter\s*/i, ''), petugas: this.ppih(), rombongan: [...new Set(this.jm.map(j => j.r))].filter(Boolean).sort((a, b) => a - b).map(r => ({ r })),
        kegiatan: Object.keys(this.data).flatMap(m => this.data[m].rites.map(r => ({ mode: this.modeLabel(m), n: r.n, p: r.p, tgl: r.tgl || '', jam: r.jam || '', place: r.place || '' }))) } : null, bisaKembali: S.tab !== 'beranda', kembali: () => this.kembali(),
      selData: S.sel != null && this.jm[S.sel] ? (() => { const j = this.jm[S.sel], raw = (this.raw || {})[j.porsi] || {}, u = this.umur(raw['Tanggal Lahir']);
        return { porsi: j.porsi, kunci: j.porsi + '|' + Object.values(dariKolom(raw)).join('|'), nilai: dariKolom(raw), umur: u, lansia: u >= 65, berangkat: this._berangkat,
          simpan: nilai => this.simpanDataJamaah(j.porsi, nilai) }; })() : null,
      tglBerangkat: this._berangkat || (this.aturKloter()['Tanggal Berangkat'] || ''), setTglBerangkat: v => this.setTglBerangkat(v),
      excel: { jamaah: () => this.jm.map(j => ({ ...j, raw: (this.raw || {})[j.porsi] || {}, umur: this.umur(((this.raw || {})[j.porsi] || {})['Tanggal Lahir']) })),
        status: () => this.statusExcel(), kloter: this.klLabel(), bisaUnggah: this.pakaiAkun() || this.coba(), coba: this.coba(), porsiAda: () => new Set(this.jm.map(j => j.porsi)),
        sesudahUnggah: () => this.syncNow() },
      hasSel: S.sel != null, sel, onNote: e => { const v = e.target.value, id = S.sel; this.setState(s => ({ notes: { ...s.notes, [id]: v } })); this.push([{ jenis: 'jamaah', porsi: this.jm[id].porsi, catatan: v }]); }, hasPelNote: !!sel.pelNote, closeSel: () => this.setState({ sel: null }), stop: e => e.stopPropagation(),
      ckDays: days.map((day, di) => { const sel = X.rites[ck.rite].day === day, td = day === X.rites[ci].day, fut = di > days.indexOf(X.rites[ci].day); return { l: day.replace(' Dzulhijjah', ' Dzh').replace(' Dzulqa’dah', ' Dzq'), today: td ? 'y' : '', sel, td, dot: 'none', dotBg: 'transparent', rw: sel ? '3px' : '1.5px', bg: td ? 'var(--color-accent)' : fut ? 'var(--color-neutral-100)' : 'var(--color-surface)', fg: td ? 'var(--on-isi)' : fut ? 'var(--teks-3)' : 'var(--color-text)', ring: sel ? (td ? 'var(--color-accent)' : 'var(--color-accent)') : fut ? 'var(--color-neutral-300)' : 'var(--color-divider)', on: () => this.patch('ck', { rite: X.rites.findIndex(r => r.day === day) }) }; }),
      ckPills: X.rites.map((r, i) => ({ r, i })).filter(o => o.r.day === X.rites[ck.rite].day).map(({ r, i }) => { const a = ck.rite === i;
        const lk = i > ci; return { l: r.p, a, locked: lk, now: i === ci, done: i < ci, on: () => this.patch('ck', { rite: i }), bg: a ? 'var(--color-accent)' : lk ? 'var(--color-neutral-100)' : 'transparent', fg: a ? 'var(--on-isi)' : lk ? 'var(--teks-3)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : lk ? 'var(--color-neutral-300)' : 'var(--color-divider)' }; }),
      ckScopes: scopes(ck, 'ck'), ckRs: rombPills, ckGs: gs(ck, 'ck'), ckShowR: ck.scope !== 'kloter', ckShowG: ck.scope === 'regu', ckRows, ckSum,
      ckEmpty: ckRows.length + ckPeople.length === 0, ckHasRows: ckRows.length > 0, ckPeople, ckHasPeople: ckPeople.length > 0, hasPel: pelGroups.length > 0, pelGroups,
      hasPicker: !!S.picker, pk, closePicker: () => this.setState({ picker: null }), applyPicker: () => this.applyPicker(),
      hasSus: !!S.susDlg, susDate: e => { const v = e.target.value; this.setState(st => ({ susDlg: st.susDlg && { ...st.susDlg, tgl: v } })); }, closeSus: () => this.setState({ susDlg: null }), confirmSus: () => this.confirmSus(),
      hasConfirm: !!S.confirm, confirm: S.confirm || {}, closeConfirm: () => this.setState({ confirm: null }), applyConfirm: () => this.apply(S.confirm),
      prScopes: scopes(P, 'pr'), prRs: rs(P, 'pr'), prGs: gs(P, 'pr'), prShowR: P.scope !== 'kloter', prShowG: P.scope === 'regu',
      prGroups: this.group(X.rites.map((r, k) => { const a = ks.includes(k), l = r.p;
        return { l, day: r.day, bg: a ? 'var(--color-accent-200)' : 'transparent', fg: a ? 'var(--color-accent)' : 'var(--teks-3)', ring: a ? 'var(--color-accent-300)' : 'var(--color-divider)',
          on: () => { if (a && ks.length === 1) return; this.patch('pr', { rites: a ? ks.filter(x => x !== k) : [...ks, k] }); } }; })),
      prSelCount: ks.length, prAllLabel: allSel ? 'Hanya hari ini' : 'Pilih semua',
      prAll: () => this.patch('pr', { rites: allSel ? [ci] : X.rites.map((_, k) => k) }),
      prFmts: [['hadir', 'Daftar jamaah'], ['rekap', 'Rekap progres'], ['harian', 'Rekap harian']].map(([k, l]) => ({ l, on: () => this.patch('pr', { fmt: k }), ...pill(P.fmt === k) })),
      prOrients: [['auto', 'Otomatis'], ['portrait', 'Potret'], ['landscape', 'Lanskap']].map(([k, l]) => ({ l, on: () => this.patch('pr', { orient: k }), ...pill((P.orient || 'auto') === k) })),
      prOrientNote: (P.orient || 'auto') === 'auto' ? (P.fmt !== 'harian' && ks.length > 8 ? 'Otomatis: lanskap, karena lebih dari 8 kolom kegiatan' : 'Otomatis: potret') : 'Pilih orientasi yang sama di jendela cetak',
      pr,
      doPrint: () => this.setState({ pdf: true }),
      hasPdf: !!S.pdf, pdfRef: this.pdfRef, pdfHtml: S.pdf ? this.printHtml(true) : '', closePdf: () => this.setState({ pdf: false }),
      savePdf: () => { const w = this.pdfRef.current && this.pdfRef.current.contentWindow; try { w.focus(); w.print(); } catch (e) {} },
      hs: (() => { const n = S.sync.pending;
        if (!this.live()) return { text: 'Data contoh', dot: 'var(--teks-3)', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)' };
        if (S.sync.err) return { text: 'Gagal sinkron' + (n ? ' · ' + n + ' menunggu sinkron' : ''), dot: 'var(--red-600)', bg: 'var(--red-100)', fg: 'var(--red-800)' };
        if (n) return { text: n + ' menunggu sinkron' + (off ? ' · offline' : ''), dot: 'var(--color-accent)', bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' };
        if (off) return { text: 'Offline · tersimpan di perangkat', dot: 'var(--color-accent)', bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' };
        return { text: 'Tersinkron · ' + S.sync.last, dot: 'var(--color-accent)', bg: 'var(--color-accent-100)', fg: 'var(--color-accent)' }; })(),
      net: (() => { const n = S.sync.pending; if (!this.live()) return null;
        if (S.sync.err && !off) return { title: 'Gagal mengirim · ' + n + ' perubahan aman di HP', text: 'Akan dicoba lagi otomatis. Ketuk untuk detail atau kirim sekarang.', dot: 'var(--red-600)', bg: 'var(--red-100)', fg: 'var(--red-800)' };
        if (off) return { title: 'Tanpa internet · aplikasi tetap bisa dipakai', text: n ? n + ' perubahan tersimpan di HP ini dan terkirim otomatis saat ada sinyal.' : 'Centang tetap tersimpan di HP ini dan terkirim otomatis saat ada sinyal.', dot: 'var(--color-accent)', bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' };
        if (S.fotoErr && !n) return { title: 'Foto belum terunggah', text: S.fotoErr + ' · Foto aman di HP dan dicoba lagi saat sinkron.', dot: 'var(--color-accent)', bg: 'var(--color-accent-200)', fg: 'var(--color-accent)' };
        if (n) return { title: 'Mengirim ' + n + ' perubahan…', text: 'Jangan tutup aplikasi sampai angka antre menjadi 0.', dot: 'var(--color-accent-300)', bg: 'var(--color-accent-100)', fg: 'var(--color-accent)' };
        return null; })(),
      tglJadwal, tgJ, openTgl: () => this.setState({ tglOpen: true }),
      fotoInput: this.fotoInput, onFotoFile: e => this.pilihFoto(e), ambilFoto: () => this.fotoInput.current && this.fotoInput.current.click(),
      fotoCard: (() => { const n = this.fotoList.length, a = this.fotoList.filter(f => f.status === 'antre').length;
        return { judul: n ? n + ' foto di HP ini' : 'Belum ada foto', sub: a ? a + ' menunggu diunggah ke ' + this.tempatFoto() + (off ? ' · saat ada internet' : this._fotoBusy ? ' · mengunggah…' : '') : n ? (this.live() ? 'Semua sudah di ' + this.tempatFoto() : 'Mode contoh · tidak diunggah') : 'Foto tersimpan di HP dulu, lalu otomatis ke ' + this.tempatFoto(),
          err: S.fotoErr || '', adaFoto: n > 0 }; })(),
      bukaGaleri: () => this.setState({ galeri: true }),
      galeri: S.galeri ? { tutup: () => this.setState({ galeri: false }), kosong: !this.fotoList.length, unggah: () => this.unggahAntre(), adaAntre: this.fotoList.some(f => f.status === 'antre'),
        items: this.fotoList.slice(0, 80).map(f => ({ src: this._thumbs[f.id] || '', judul: f.kegiatan + ' · ' + this.fmtHari(f.tanggal), sub: [f.cakupan, f.keterangan].filter(Boolean).join(' · '),
          st: f.status === 'terkirim' ? 'Di ' + this.tempatFoto() : f.status === 'lokal' ? 'Hanya di HP (mode contoh)' : 'Menunggu diunggah', stFg: f.status === 'terkirim' ? 'var(--color-accent)' : 'var(--color-text)',
          link: f.link || '', buka: e => this.bukaFoto(e, f.link), hapus: () => this.buangFoto(f) })) } : null,
      fotoDlg: S.fotoDlg ? (() => { const d = S.fotoDlg, upd = p => this.patch('fotoDlg', p), romb = [...new Set(this.jm.map(j => j.r))].sort((a, b) => a - b), regu = [...new Set(this.jm.filter(j => j.r === d.r).map(j => j.g))].sort((a, b) => a - b);
        return { prev: d.prev, kb: d.kb + ' KB setelah diperkecil',
          rites: X.rites.map((r, k) => ({ l: r.miqat ? r.p : r.n, ...pill(d.rite === k), on: () => upd({ rite: k }) })),
          scopes: [['kloter', 'Kloter'], ['rombongan', 'Rombongan'], ['regu', 'Regu']].map(([k, l]) => ({ l, ...pill(d.scope === k), on: () => upd({ scope: k }) })),
          showR: d.scope !== 'kloter', showG: d.scope === 'regu',
          rs: romb.map(r => ({ l: 'R' + r, ...pill(d.r === r), on: () => upd({ r, g: (this.jm.find(j => j.r === r) || {}).g || 1 }) })),
          gs: regu.map(g => ({ l: 'Regu ' + g, ...pill(d.g === g), on: () => upd({ g }) })),
          ket: d.ket, onKet: e => upd({ ket: e.target.value.slice(0, 200) }),
          simpan: () => this.simpanFotoDlg(), batal: () => { URL.revokeObjectURL(d.prev); this.setState({ fotoDlg: null }); } }; })() : null,
      isUmrah: S.mode === 'umrah', openMiqat: () => this.setState({ mqDlg: { scope: 'kloter', r: 1, g: 1, val: this.miqatKloter() } }),
      mqDlg: S.mqDlg ? (() => { const d = S.mqDlg, upd = p => this.patch('mqDlg', p), jj = d.scope === 'jamaah' ? this.jm[d.id] : null, kl = this.miqatKloter();
        const hitung = {}; this.jm.forEach(j => { const m = this.miqatOf(j) || 'Belum ditentukan'; hitung[m] = (hitung[m] || 0) + 1; });
        const romb = [...new Set(this.jm.map(j => j.r))].sort((a, b) => a - b), regu = [...new Set(this.jm.filter(j => j.r === d.r).map(j => j.g))].sort((a, b) => a - b);
        const target = jj ? 1 : d.scope === 'kloter' ? this.jm.length : this.mem(d.r, d.scope === 'regu' ? d.g : undefined).length;
        return { title: jj ? 'Miqat · ' + jj.name : 'Atur miqat umrah', isJ: !!jj,
          kloterInfo: 'Miqat kloter: ' + (kl || 'belum ditentukan') + (this.data.umrah.rites.find(r => r.miqat).placeAuto && kl ? ' (otomatis dari Gelombang ' + this.cfg.gelombang + ')' : ''),
          ringkas: Object.entries(hitung).sort((a, b) => b[1] - a[1]).map(([m, n]) => m + ' ' + n).join(' · '),
          scopes: jj ? [] : [['kloter', 'Seluruh kloter'], ['rombongan', 'Rombongan'], ['regu', 'Regu']].map(([k, l]) => ({ l, ...pill(d.scope === k), on: () => upd({ scope: k }) })),
          showR: !jj && d.scope !== 'kloter', showG: !jj && d.scope === 'regu',
          rs: romb.map(r => ({ l: 'R' + r, ...pill(d.r === r), on: () => upd({ r, g: (this.jm.find(j => j.r === r) || {}).g || 1 }) })),
          gs: regu.map(g => ({ l: 'Regu ' + g, ...pill(d.g === g), on: () => upd({ g }) })),
          opts: (jj ? ['Ikut miqat kloter'] : []).concat(MIQAT).map(m => { const v = m === 'Ikut miqat kloter' ? '' : m, on = jj ? (d.val || '') === v : d.val === v;
            return { l: m, bg: on ? 'var(--color-accent)' : 'var(--color-surface)', fg: on ? 'var(--on-isi)' : 'var(--color-text)', on: () => upd({ val: v }) }; }),
          val: d.val || '', onVal: e => upd({ val: e.target.value.slice(0, 60) }),
          note: d.scope === 'kloter' ? 'Semua jamaah memakai miqat ini; pengecualian per jamaah dihapus.' : jj ? '' : 'Berlaku untuk ' + target + ' jamaah di cakupan ini. Jamaah lain tetap.',
          simpan: () => this.setMiqat(d.scope, d.val, d), cta: 'Simpan miqat' + (jj ? '' : ' · ' + target + ' jamaah'), batal: () => this.setState({ mqDlg: null }) }; })() : null,
      canInstall: !!this._installEvt,
      doInstall: () => { const e = this._installEvt; if (!e) return; e.prompt(); (e.userChoice || Promise.resolve()).finally(() => { this._installEvt = null; this.forceUpdate(); }); },
      installHint: (() => { const sa = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone; if (sa) return '';
        return /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'Di iPhone: buka di Safari, ketuk Bagikan lalu “Tambah ke Layar Utama” agar data tidak terhapus otomatis.' : 'Pasang aplikasi ke layar utama HP agar bisa dibuka tanpa internet dan datanya lebih aman.'; })(),
      daysRef: this.daysRef, exportCsv: () => this.exportCsv(), bakSave: () => this.backupSave(), bakLoad: () => this.backupLoad(), exportWa: () => this.setState({ syncOpen: false, wa: true }),
      suHasOk: !!S.su.okMsg,
      syncLabel: !this.live() ? 'Mode contoh · belum terhubung' : S.sync.err ? 'Gagal sinkron · ketuk untuk detail' : S.sync.pending ? (off ? `${S.sync.pending} perubahan di perangkat · menunggu sinyal` : 'Mengirim ke ' + this.namaServer() + '…') : off ? 'Offline · data tersimpan di perangkat' : 'Tersinkron · ' + S.sync.last,
      syncDot: !this.live() ? 'var(--color-neutral-400)' : S.sync.err ? 'var(--red-600)' : S.sync.pending ? (off ? '#e0a100' : 'var(--color-accent-300)') : 'var(--color-accent)',
      openSync: () => this.setState({ syncOpen: true }), closeSync: () => this.setState({ syncOpen: false }), hasSync: !!S.syncOpen,
      syncNow: () => this.syncNow(), syncPending: S.sync.pending, syncLast: S.sync.last, syncOffline: off, hasSyncErr: !!S.sync.err, syncErr: S.sync.err || '',
      syncTag: this.live() ? 'Terhubung' : 'Mode contoh', ppihName: this.ppih(), logoSrc: this._logo || 'icon-192.png',
      identitas: {
        nama: (this.cfg && this.cfg.ppih) || this.ppih() || '-',
        embarkasi: (this.cfg && this.cfg.embarkasi) || '-',
        kloter: (this.cfg && this.cfg.kloter) || String(this.klLabel()).replace(/^Kloter\s*/i, '') || '-',
        gelombang: (this.cfg && this.cfg.gelombang) ? String(this.cfg.gelombang) : '-',
        ubah: () => this.setState(s => ({ setup: true, syncOpen: false, su: { ...s.su, err: '' } }))
      },
      pf: { title: !this.live() ? 'Mode contoh' : S.sync.err ? 'Gagal sinkron' : S.sync.pending ? (off ? 'Menunggu sinyal' : 'Mengirim…') : 'Tersinkron ✓', deg: (this.live() && !S.sync.pending && !S.sync.err ? 360 : Math.max(18, 360 - Math.min(342, S.sync.pending * 6))) + 'deg' }, syncTagCls: this.live() ? 'tag-accent-2' : 'tag-neutral',
      syncSource: this.live() ? 'Akun · kloter ' + this.klLabel() + ' · ' + (this.cfg.device || 'Perangkat') + ' · ' + this.petugas.length + ' petugas' : 'Data contoh · masuk dengan akun kloter untuk memakai data asli',
      openSetup: () => this.setState(s => ({ setup: true, syncOpen: false, su: { ...s.su, err: '' } })), hasSetup: !!S.setup || (!!this.cfg && !S.locked && !this.idLengkap()), su: S.su,
      suKloter: e => this.patch('su', { kloter: e.target.value }),
      suPin: e => this.patch('su', { pin: e.target.value.replace(/\D/g, '').slice(0, 4) }), suHasErr: !!S.su.err, suCta: S.su.busy ? 'Menghubungkan…' : this.pakaiAkun() ? 'Simpan' : 'Mulai',
      idLine: [TUSI, this.klLabel(), this.cfg && this.cfg.embarkasi, this.cfg && this.cfg.gelombang ? 'Gelombang ' + this.cfg.gelombang : ''].filter(Boolean).join(' · '),
      suDevices: ['HP', 'Tablet'].map(l => ({ l, ...pill(S.su.device === l), on: () => this.patch('su', { device: l }) })),
      suConnect: () => this.connect(), suCanClose: this.idLengkap(), suClose: () => this.setState({ setup: false }),
      suDemo: () => { const k = kurangIdentitas(S.su); if (k.length) { this.patch('su', { err: pesanKurang(k) }); return; }
        this.mulaiCoba({ ...this.identitas(S.su), device: S.su.device, pin: /^\d{4}$/.test(S.su.pin) ? S.su.pin : ((this.cfg && this.cfg.pin) || '1234') }); },
      suEmbarkasi: e => this.patch('su', { embarkasi: e.target.value, err: '' }), embarkasiList: EMBARKASI,
      suAkun: !!this.akunSb(), pakaiAkun: this.pakaiAkun(),
      suGelombang: ['1', '2'].map(g => ({ l: 'Gelombang ' + g, ...pill(String(S.su.gelombang) === g), on: () => this.patch('su', { gelombang: g, err: '' }) })),
      suGelombangNote: CATATAN_GELOMBANG[S.su.gelombang] || 'Dipakai untuk usulan miqat umrah.',
      syncCounts: [{ l: 'Jamaah', v: this.jm.length }, { l: 'Rombongan', v: new Set(this.jm.map(j => j.r)).size }, { l: 'Regu', v: new Set(this.jm.map(j => j.r + '-' + j.g)).size }],
      hasUndo: !!S.undo, doUndo: () => this.doUndo(), locked: S.locked,
      lockNow: () => { this.saveCfg({ terbuka: false }); this.setState({ locked: true, syncOpen: false, pin: '' }); },
      pinDots: [0, 1, 2, 3].map(n => ({ bg: n < S.pin.length ? '#fff' : 'transparent' })),
      pinMsg: (() => { const left = ((this.cfg && this.cfg.lockUntil) || 0) - Date.now(); if (left > 0) { const t = Math.ceil(left / 1000); return 'Terkunci karena 5 kali salah. Coba lagi dalam ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); } if (S.pinErr) return 'PIN salah · sisa ' + (5 - ((this.cfg && this.cfg.pinFails) || 0)) + ' percobaan'; return this.live() ? '' : 'Mode contoh · PIN ' + ((this.cfg && this.cfg.pin) || '1234'); })(), pinMsgFg: S.pinErr || lockOn ? 'var(--red-200)' : 'var(--color-accent-200)',
      pinKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(l => ({ l, vis: l ? 'visible' : 'hidden', bg: l === '⌫' ? 'transparent' : 'var(--color-accent-600)', op: lockOn ? 0.4 : 1, on: () => l && this.pressPin(l === '⌫' ? 'del' : l) })),
      hasToast: !!S.toast, toastMsg: S.toast || '',
      // Bilah bawah: Home · Kirim · Kejadian · Jamaah + tombol Massal. Doa, Kultum, Badal, Rekap, Cetak dibuka dari ubin di Home; Profil dari kepala.
      tabs: [['beranda', 'Home', 'M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z', ['beranda']],
        ['kirim', 'Kirim', 'M21 3L10 14M21 3l-7 18-4-7-7-4z', ['kirim']],
        ['kejadian', 'Kejadian', 'M9 3h6v3H9zM7 5H5v16h14V5h-2M12 10v4M12 17h.01', ['kejadian']],
        ['jamaah', 'Jamaah', 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-3.5 3-6 7-6s7 2.5 7 6', ['jamaah']],
        ['checklist', 'Massal', 'M3 12l3 3 6-6M10 17l2 2 9-9', ['checklist'], true]].map(([k, l, d, grup, fab]) => { const a = grup.includes(S.tab);
        return { l, d, on: k === 'checklist' ? go(k, { ckPilih: true }) : go(k), fab: !!fab, aktif: a }; }),
      menuHome: [['doa', 'Doa', 'M11 20H8a4 4 0 0 1-4-4V9.5a1.5 1.5 0 0 1 3 0V13l3.2 2.2a2 2 0 0 1 .8 1.6zM13 20h3a4 4 0 0 0 4-4V9.5a1.5 1.5 0 0 0-3 0V13l-3.2 2.2a2 2 0 0 0-.8 1.6zM12 3v3M8.5 4.5l1 2M15.5 4.5l-1 2'],
        ['kultum', 'Kultum', 'M12 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 11h12l-1.5 10h-9zM9 15h6'],
        ['badal', 'Badal', 'M7 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM2 20c0-3 2.2-5 5-5s5 2 5 5M17.5 9a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM14 20c0-2.4 1.5-4 3.5-4s3.5 1.6 3.5 4M12 5h6M16 3l2 2-2 2'],
        ['rekap', 'Rekap', 'M4 20V10M10 20V4M16 20v-7M22 20H2'],
        ['cetak', 'Cetak', 'M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7z']].map(([k, l, d]) => ({ l, d, on: go(k) })),
      keProfil: go('profil'), cariJamaah: () => this.setState({ tab: 'jamaah', fokusCari: true }), fokusCari: !!S.fokusCari,
      judulLayar: S.tab === 'checklist' && !S.ckPilih ? 'Checklist ' + this.modeLabel(S.mode) : S.kejForm && S.tab === 'kejadian' ? (S.kejForm.baru ? 'Catat kejadian' : 'Ubah catatan')
        : S.kirimLayar && S.tab === 'kirim' ? (S.kirimLayar.ubah ? 'Ubah templat' : ({ katering: 'Jadwal katering', pengingat: 'Pengingat ibadah', karom: 'Undangan karom', pengajian: 'Undangan pengajian', kesehatan: 'Cek kesehatan' })[S.kirimLayar.jenis] || 'Kirim') : ({ jamaah: 'Jamaah', checklist: 'Massal', badal: 'Badal', rekap: 'Rekap', cetak: 'Cetak', kirim: 'Kirim', profil: 'Profil', kejadian: 'Kejadian', doa: 'Doa', kultum: 'Kultum', menu: 'Menu' })[S.tab] || '',
      ckPilih: S.tab === 'checklist' && !!S.ckPilih, pilihIbadah: S.tab === 'checklist' && S.ckPilih ? this.pilihIbadah() : [],
      kePilihIbadah: () => this.setState({ ckPilih: true, ckDariPilih: false }, () => { if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; }), labelIbadah: this.modeLabel(S.mode),
      judulKegiatan: S.mode === 'madinah' ? 'Kegiatan sunnah Madinah' : 'Rukun & wajib ' + this.modeLabel(S.mode),
      isKirim: S.tab === 'kirim', isProfil: S.tab === 'profil', isKejadian: S.tab === 'kejadian',
      isDoa: S.tab === 'doa', isKultum: S.tab === 'kultum',
      kultum: S.tab === 'kultum' ? { ...this.aturKultum(), coba: !this.live(), setTiba: v => this.setAturKultum('Tanggal Tiba', v), setGelombang: g => this.setAturKultum('Gelombang', g) } : null,
      kloterKosong: this.live() && !this.jm.length, modeCoba: this.coba(),
      mulaiCoba: () => this.mulaiCoba(), selesaiCoba: () => this.selesaiCoba(), keUnggah: () => this.setState({ tab: 'profil' }),
      kejadian: S.tab === 'kejadian' ? this.kejadianVals() : null,
      menuItems: [['jamaah', 'Jamaah', 'Rombongan, regu, detail', 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-3.5 3-6 7-6s7 2.5 7 6'],
        ['checklist', 'Ibadah', 'Haji, Umrah, Madinah', 'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10M4 10.5l8 4 8-4'],
        ['badal', 'Badal', 'Lempar jumrah & badal', 'M4 17.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM14 17.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM9 8.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0z'],
        ['rekap', 'Rekap', 'Progres ibadah kloter', 'M5 20V11M12 20V4M19 20v-6'],
        ['cetak', 'Cetak', 'Simpan laporan PDF', 'M7 9V3h10v6M7 17H4v-6h16v6h-3M7 14h10v7H7z'],
        ['kejadian', 'Catatan Kejadian', 'Sakit, terpisah, dll', 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z']].map(([k, l, s, d]) => ({ l, s, d, on: k === 'checklist' ? go(k, { ckPilih: true }) : go(k) })),

      goTab: k => this.setState({ tab: k })
    };
  }
}
