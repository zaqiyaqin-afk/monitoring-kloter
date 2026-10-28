// Logika aplikasi (state, sinkron, perhitungan). Tampilan ada di View.jsx.
import React from 'react';
import { DCLogic } from './dc/runtime.js';
import { ambilSemua, kirimPerubahan, gantiKunci, unggahFoto, tautanFoto, SB_URL } from './data/server.js';
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
      locked: !!(this.cfg && this.cfg.pin) && !this.perluPindahAkun(), pin: '', pinErr: false, setup: !this.cfg || this.perluPindahAkun(),
      su: { url: (this.cfg && this.cfg.url) || '', key: (this.cfg && this.cfg.key) || '', kloter: (this.cfg && this.cfg.kloter) || '', device: (this.cfg && this.cfg.device) || 'HP', pin: (this.cfg && this.cfg.pin) || '', ppih: (this.cfg && this.cfg.ppih) || '', embarkasi: (this.cfg && this.cfg.embarkasi) || '', gelombang: (this.cfg && this.cfg.gelombang) || '', err: '', busy: false, ...this.suDariAkun() },
      sync: { pending: this.queue.length, last: '—', err: '' }, syncOpen: false,
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
  perluPindahAkun() { return !!this.akunSb() && !this.pakaiAkun(); }
  suDariAkun() { const p = this.akunSb(); if (!p) return {};
    return { url: SB_URL, key: 'akun', ppih: p.nama || '', kloter: p.kloter.kode, embarkasi: p.kloter.embarkasi || p.embarkasi || '', gelombang: String(p.kloter.gelombang || p.gelombang || '') }; }
  namaServer() { return this.pakaiAkun() ? 'server' : 'Google Sheet'; }
  tempatFoto() { return this.pakaiAkun() ? 'penyimpanan kloter' : 'Google Drive'; }
  // Foto di Supabase dibuka lewat tautan sementara; foto lama di Drive langsung dibuka
  async bukaFoto(e, link) { if (!String(link).startsWith('supabase:')) return; e.preventDefault();
    try { window.open(await tautanFoto(link.slice(9)), '_blank', 'noopener'); } catch (er) { this.flash(er.message || 'Foto tidak bisa dibuka'); } }
  kloter() { return (this.cfg && this.cfg.kloter) || ''; }
  klLabel() { const K = this.kloter(); return !K ? 'Kloter' : /^kloter/i.test(K) ? K : 'Kloter ' + K; }
  tz(zone) { try { return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zone }).format(new Date()).replace(':', '.'); } catch (e) { return this.hhmm(new Date()); } }
  hhmm(d) { return String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0'); }
  readSnap() { return bacaSnap(); }
  componentDidMount() {
    { const tryL = i => { const c = ['emblem-256.png', 'icon-192.png', 'app/icon-192.png'], im = new Image(); im.onload = () => { this._logo = c[i]; const b = this.logoBox.current; if (b) { im.alt = ''; im.style.cssText = 'width:30px;height:30px;display:block'; b.textContent = ''; b.appendChild(im); } }; im.onerror = () => { if (i + 1 < c.length) tryL(i + 1); }; im.src = c[i]; }; tryL(0); }
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
    // Tanggal yang diubah di HP ini tetapi belum terkirim (atau mode contoh) menimpa data Sheet
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
  /* ---------- Foto kegiatan ---------- */
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
      baru: () => this.setState({ kejForm: { kid: uuid(), kategori: 'sakit', tgl: this.todayKey(), jam: String(was.getHours()).padStart(2, '0') + ':' + String(was.getMinutes()).padStart(2, '0'),
        lokasi: '', kronologi: '', tindakLanjut: '', status: 'terbuka', porsi: [], foto: [], berkas: [], baru: true } }),
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
    if (scope === 'kloter') this.applyJadwal((this.readSnap() || {}).jadwalKegiatan);
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
    if (!this.live()) { if (!quiet) this.flash('Mode contoh · belum terhubung ke Google Sheet'); this.setState(s => ({ sync: { ...s.sync, pending: 0, last: this.hhmm(new Date()) } })); return; }
    if (this._busy || this.perluPindahAkun()) return;
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
    const su = this.state.su, url = su.url.trim(), key = su.key.trim();
    const akun = url === SB_URL, err = akun ? (!/^\d{4}$/.test(su.pin) ? 'PIN harus 4 angka' : '') : !/^https:\/\/script\.google\.com\/.+\/exec/.test(url) ? 'URL harus diawali https://script.google.com/ dan berakhiran /exec' : !key ? 'Kode rahasia belum diisi' : !/^\d{4,}$/.test(key) ? 'Kode rahasia minimal 4 angka' : !/^\d{4}$/.test(su.pin) ? 'PIN harus 4 angka' : '';
    if (err) { this.patch('su', { err }); return; }
    // Sheet sama, hanya identitas/PIN berubah: simpan langsung, tidak perlu internet
    if (this.live() && url === this.cfg.url && key === this.cfg.key) {
      const kurang = kurangIdentitas(su); if (kurang.length) { this.patch('su', { err: pesanKurang(kurang) }); return; }
      const id = this.identitas(su), lama = this.cfg;
      this.saveCfg({ device: su.device, pin: su.pin, ...id }); this.applyJadwal((this.readSnap() || {}).jadwalKegiatan);
      if (Object.keys(id).some(k => String(id[k]) !== String(lama[k] || ''))) this.pushPengaturan(kePengaturan(id));
      this.setState(s => ({ setup: false, su: { ...s.su, ...id, err: '', okMsg: '' } })); this.flash('Pengaturan disimpan'); return;
    }
    this.patch('su', { busy: true, err: '' });
    try {
      const old = this.cfg && !this.cfg.demo && this.cfg.url, changed = !!old && old !== url;
      // Ganti sheet: antrean milik sheet lama wajib terkirim dulu, jangan pernah dibuang.
      if (changed && this.queue.length && !akun) {
        try { await this.flushQueue(old, this.cfg.key); }
        catch (e) { throw new Error(`Masih ada ${this.queue.length} perubahan yang belum terkirim ke sheet lama (${e.message || e}). Sambungkan internet dan sinkronkan dulu, atau pilih "Simpan cadangan" sebelum mengganti sheet.`); }
      }
      const data = await this.fetchAll(url, key);
      if (!(data.jamaah || []).length) throw new Error(akun ? 'Data jamaah kloter ini masih kosong. Hubungi admin.' : 'Sheet "Jamaah" masih kosong');
      // HP baru: kolom identitas yang kosong diisi dari tab Pengaturan di Sheet
      const dariSheet = dariPengaturan(data.pengaturan), isi = { ...su };
      Object.keys(dariSheet).forEach(k => { if (!String(isi[k] || '').trim() && dariSheet[k]) isi[k] = dariSheet[k]; });
      const kurang = kurangIdentitas(isi);
      if (kurang.length) { this.patch('su', { ...isi, busy: false, err: pesanKurang(kurang) }); return; }
      const id = this.identitas(isi);
      this.saveCfg({ url, key, device: su.device, pin: su.pin, demo: false, ...id });
      if (Object.keys(id).some(k => String(id[k]) !== String(dariSheet[k] || ''))) this.pushPengaturan(kePengaturan(id));
      simpanSnap(data); this.build(data);
      this.setState(s => ({ setup: false, locked: false, su: { ...s.su, ...id, busy: false }, sync: { pending: this.queue.length, last: this.hhmm(new Date()), err: '' }, tab: 'beranda' }));
      this.flash(this.jm.length + ' jamaah dibaca dari ' + (akun ? 'akun kloter' : 'Google Sheet'));
      if (akun && this.queue.length) this.syncNow(true);
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
    if (S.tab === 'checklist' && !S.ckPilih && S.ckDariPilih) { this.setState({ ckPilih: true, ckDariPilih: false }, () => { if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; }); return true; }
    const r = this._riwayat || [];
    if (r.length) { this._dariKembali = true; const t = r[r.length - 1]; this._riwayat = r.slice(0, -1); this.setState({ tab: t }); return true; }
    if (S.tab !== 'beranda') { this._dariKembali = true; this.setState({ tab: 'beranda' }); return true; }
    return false;
  }
  centerToday() { const c = this.daysRef.current; if (!c) return; const t = c.querySelector('[data-today="y"]'); if (t) c.scrollLeft = t.offsetLeft - (c.clientWidth - t.offsetWidth) / 2; }
  exportCsv() {
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"', S = this.state, L = [['Waktu ekspor', 'Mode', 'Nomor Porsi', 'Nama', 'Rombongan', 'Regu', 'Udzur', 'Catatan', 'Kegiatan', 'Status', 'Pelaksana Badal', 'Tanggal Pelaksanaan', 'Susulan', 'Belum terkirim ke sheet'].map(esc).join(',')], now = new Date().toISOString();
    const pend = new Set(this.queue.filter(q => q.jenis === 'centang').map(q => q.porsi + '|' + q.kegiatan));
    Object.keys(this.data).forEach(m => this.data[m].rites.forEach((r, k) => this.jm.forEach(j => { const key = r.badal ? ((S.badal[m] || {})[k] || {})[j.id] : null;
      L.push([now, m, "'" + j.porsi, j.name, j.r, j.g, S.udz[j.id] ? 'Ya' : 'Tidak', S.notes[j.id] || '', r.n, S.done[m][k][j.id] ? 'Selesai' : 'Belum', key ? this.pelText(key) : '', ((S.done[m][k][j.id] && (S.tg[m + '|' + k + '|' + j.id] || {}).t) || ''), (S.done[m][k][j.id] && (S.tg[m + '|' + k + '|' + j.id] || {}).s ? 'Ya' : 'Tidak'), pend.has(j.porsi + '|' + r.n) ? 'Ya' : ''].map(esc).join(',')); })));
    const blob = new Blob(['\ufeff' + L.join('\r\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'cadangan-' + this.klLabel().replace(/\s+/g, '-') + '-' + now.slice(0, 16).replace(/[:T]/g, '') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    this.flash('CSV cadangan diunduh · ' + (L.length - 1) + ' baris');
  }
  async testConn() {
    const su = this.state.su, url = su.url.trim(), key = su.key.trim();
    const err = !/^https:\/\/script\.google\.com\/.+\/exec/.test(url) ? 'URL salah: harus diawali https://script.google.com/ dan berakhiran /exec' : !key ? 'Kode rahasia belum diisi' : !/^\d{4,}$/.test(key) ? 'Kode rahasia minimal 4 angka' : '';
    if (err) { this.patch('su', { err, okMsg: '' }); return; }
    this.patch('su', { testing: true, err: '', okMsg: '' });
    try { await this.fetchAll(url, key, true); this.patch('su', { testing: false, okMsg: 'Koneksi berhasil · URL benar dan kode rahasia cocok.' }); }
    catch (e) { this.patch('su', { testing: false, err: e.message || String(e) }); }
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
  ketuaR(r) { return this.jm.find(j => j.r === r && j.role === 'Ketua Rombongan') || { name: '—' }; }
  ketuaG(r, g) { return this.jm.find(j => j.r === r && j.g === g && j.role === 'Ketua Regu') || { name: '—' }; }
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
    if (p === (c.pin || '1234')) { this.saveCfg({ pinFails: 0, lockUntil: 0 }); this.setState({ pin: '', locked: false, pinErr: false }); return; }
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
  pelName(key) { if (!key) return ''; if (key.slice(0, 2) === 'x:') return key.slice(2); if (key[0] === 'p') return (this.petugas.find(p => p.key === key) || { name: '—' }).name; return (this.jm[+key.slice(1)] || { name: '—' }).name; }
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
      const rows = list.filter(j => S.udz[j.id]).map(j => `<tr><td>${esc(j.name)}</td><td>R${j.r}·${j.g}</td><td>${esc(this.pelName(map[j.id]) || '—')}</td><td class="c">${D[k][j.id] ? '✓' : ''}</td></tr>`).join('');
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
    const snap = this.readSnap(); if (snap) { this.mergeSnap(snap, [it]); simpanSnap(snap); }
    this.push([it]);
    if (snap) this.build(snap); else this.forceUpdate();
    this.flash('Data jamaah disimpan' + (navigator.onLine ? '' : ' · terkirim saat ada internet'));
  }
  setTglBerangkat(v) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return;
    this.pushPengaturan({ 'Tanggal Berangkat': v });
    const snap = this.readSnap(); if (snap) { snap.pengaturan = { ...(snap.pengaturan || {}), 'Tanggal Berangkat': v }; simpanSnap(snap); this.build(snap); }
    this.flash('Tanggal berangkat disimpan · lansia dihitung ulang');
  }
  // Data bagian atas Home: ringkasan jamaah, kegiatan terlewat yang belum dicentang, dan kegiatan berikutnya
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
      X.rites.forEach((r, k) => { if (!r.tgl || r.tgl < hari || r.tgl > tglBesok || r.opt) return;
        const jam = r.jam || '', lewat = r.tgl === hari && jam && jam.replace('.', ':') < this.hhmmWas();
        if (lewat) return;
        pengingat.push({ key: m + k, label: r.p, sub: this.modeLabel(m) + ' · ' + (r.place || ''), kapan: (r.tgl === hari ? 'Hari ini' : 'Besok') + (jam ? ' ' + jam.replace(':', '.') : ''), urut: r.tgl + (jam || '99'), on: keCk(m, k) }); }); });
    peringatan.sort((a, b) => b.tgl.localeCompare(a.tgl)); pengingat.sort((a, b) => a.urut.localeCompare(b.urut));
    const khBase = jm.filter(j => this.isKh(j)), kejTerbuka = this.pakaiAkun() || !this.live() ? this.daftarKejadian().filter(k => k.status !== 'selesai').length : 0;
    const X = this.data[S.mode], ci = X.cur, R = X.rites[ci], RS = this.rekapStats();
    return { total: jm.length, ringkas, peringatan: peringatan.slice(0, 5), pengingat: pengingat.slice(0, 4), tanpaTanggal: !adaTgl,
      khusus: { n: khBase.length, tanpa: khBase.filter(j => !this.pendKey(j.id)).length, on: keJamaah({ v: 'kh', kf: 'semua' }) },
      kejadian: { n: kejTerbuka, on: () => this.setState({ tab: 'kejadian' }) },
      cur: { mode: this.modeLabel(S.mode), n: R.n, day: R.day || '', place: R.place || '', k: S.mode === 'madinah' ? 'Sunnah' : (R.k || ''), done: RS.done, tot: RS.tot, pct: RS.pct,
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
  aturSheet() { const p = { ...(((this.readSnap() || {}).pengaturan) || {}) }; this.queue.forEach(q => { if (q.jenis === 'pengaturan') Object.assign(p, q.nilai); }); return p; }
  simpanJam() { const j = parseInt(this.state.su.jam ?? this.aturSheet()['Jam Pengingat'] ?? '21', 10);
    if (!(j >= 0 && j <= 23)) { this.patch('su', { err: 'Jam pengingat harus 0–23 (waktu Arab Saudi)', okMsg: '' }); return; }
    this.pushPengaturan({ 'Jam Pengingat': String(j) }); this.patch('su', { err: '', okMsg: 'Jam pengingat email diubah ke ' + j + '.00 WAS · terkirim saat ada internet.' }); }
  async gantiKode() { const su = this.state.su, baru = String(su.kodeBaru || '').trim();
    if (!/^\d{4,}$/.test(baru)) { this.patch('su', { err: 'Kode baru harus angka saja, minimal 4 angka', okMsg: '' }); return; }
    this.patch('su', { gantiBusy: true, err: '', okMsg: '' });
    try { await this.flushQueue(this.cfg.url, this.cfg.key); await gantiKunci(this.cfg.url, this.cfg.key, baru);
      this.saveCfg({ key: baru }); this.patch('su', { key: baru, kodeBaru: '', gantiBusy: false, okMsg: 'Kode rahasia diganti. HP lain yang memakai Sheet ini perlu diisi kode baru.' }); }
    catch (e) { this.patch('su', { gantiBusy: false, err: e.message || String(e) }); } }
  // Udzur dikirim sebagai catatan tersendiri (tidak digabung) agar riwayat lengkap walau diubah berkali-kali saat offline.
  simpanUdzur(j, udzur, alasan) {
    const it = { jenis: 'udzur', porsi: j.porsi, nama: j.name, udzur, alasan: String(alasan || '').trim(), perangkat: (this.cfg && this.cfg.device) || '', waktu: new Date().toISOString() };
    if (this.live()) this.push([it]); else { it.petugas = this.ppih(); this._riwDemo = [it].concat(this._riwDemo || []); }
    this.setState(s => { const a = s.udz.slice(); a[j.id] = udzur; return { udz: a, udzForm: null }; });
    this.flash(udzur ? 'Ditandai udzur · masuk daftar badal' : 'Status udzur dihapus');
  }
  // Riwayat udzur satu jamaah, terbaru dulu: data Sheet + yang masih di antrean.
  riwayatUdzur(porsi) {
    const P = String(porsi), snap = this.readSnap() || {};
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
    if (this.naLock(m, col.k0, j, D)) return { t: 'na', v: '—' };
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
    const PRINT_FONTS = '@font-face{font-family:Fraunces;font-weight:600;font-display:block;src:url(data:font/woff2;base64,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)}@font-face{font-family:Fraunces;font-weight:700;font-display:block;src:url(data:font/woff2;base64,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)}@font-face{font-family:Figtree;font-weight:400;font-display:block;src:url(data:font/woff2;base64,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)}@font-face{font-family:Figtree;font-weight:600;font-display:block;src:url(data:font/woff2;base64,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)}@font-face{font-family:Figtree;font-weight:700;font-display:block;src:url(data:font/woff2;base64,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)}';
    const S = this.state, P = S.pr, shd = this.sheetDef(P.sheet || 'armuzna'), land = shd.land, esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    this._slotF = null; const list = this.scopeList(P), ppih = this.ppih();
    const was = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Riyadh' }).format(new Date()).replace(/(\d{2}):(\d{2})/, '$1.$2') + ' WAS';
    let logo = ''; try { logo = new URL(this._logo || 'icon-192.png', location.href).href; } catch (e) {}
    const kr = P.scope !== 'kloter' ? this.ketuaR(P.r).name : '';
    const css = `@page{size:A4 ${land ? 'landscape' : 'portrait'};margin:11mm 12mm 14mm;@bottom-right{content:"Halaman " counter(page) " dari " counter(pages);font:8pt Figtree,system-ui,sans-serif;color:#4d5752}}*{box-sizing:border-box}body{font-family:Figtree,system-ui,sans-serif;color:#201e1d;font-size:8.5pt;margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}.hd{display:flex;gap:10pt;align-items:center;padding-bottom:6pt;margin-bottom:7pt;border-bottom:1.4pt solid #16232B}.hd img{width:34pt;height:34pt;border-radius:8pt;background:#16232B;flex:none}.k{font-size:8.5pt;font-weight:700;color:#165040}h1{font-family:Fraunces,Georgia,serif;font-weight:700;font-size:16pt;line-height:1.15;margin:1pt 0}.m{font-size:8.5pt;color:#363e3a;line-height:1.4}table{width:calc(100% - 2px);margin:0 1px;border-collapse:collapse;table-layout:fixed}th,td{border:1px solid #7d8883;padding:2pt 2.4pt;vertical-align:middle}th{background:#e2f0e9;font-size:7pt;line-height:1.15;text-align:center;font-weight:700;word-break:normal;overflow-wrap:break-word;hyphens:manual}th .thn{display:block;font-size:5.6pt;letter-spacing:-.1pt;font-weight:600;color:#3b4540}th.ph{background:#fff;border:0 none #fff !important;padding:0 0 6pt;text-align:left;font-weight:400;font-size:8.5pt;line-height:1.3;word-break:normal;color:#201e1d}th.ph .hd{margin-bottom:0}tbody.end{break-inside:avoid;page-break-inside:avoid}tr.sigr td.sigc{border:0 none #fff !important;background:#fff !important;padding:0;text-align:left;vertical-align:top;overflow:visible;font-size:8.5pt}.tail{break-inside:avoid;break-before:avoid;page-break-inside:avoid;page-break-before:avoid}.tail>.lg:first-child,.tail>.bn:first-child{margin-top:5pt}.lg,.bn,.sig{break-before:avoid}th.g{background:#16232B;color:#fff;font-size:6.8pt}td.ok.pf{font-size:6.4pt;font-weight:700;color:#1e6b52;line-height:1.15;overflow-wrap:break-word}tr.rg td:not(.su):not(.b):not(.s):not(.pu){background:rgba(30,107,82,.10)}tr.rt td{border-top:2px solid #1e6b52}thead{display:table-header-group}tr{break-inside:avoid}td{overflow-wrap:anywhere}td.c{text-align:center}th.gr{background:#E6F4EC;color:#0E5C40;text-align:left;font-size:7.5pt;padding:3pt 5pt}td.wr{color:#a12e22;font-weight:700}.kt2{display:inline-block;font-size:6.6pt;font-weight:700;padding:0 4pt;border-radius:6pt;margin:0 2pt 1pt 0}.k-r{background:#fbe4e1;color:#a12e22}.k-l{background:#fff1db;color:#8a5200}.k-k{background:#e3edf9;color:#1c426e}td.nw{white-space:nowrap;overflow-wrap:normal;word-break:keep-all;font-size:8pt;font-variant-numeric:tabular-nums}td.nm{font-size:8pt;line-height:1.2;overflow-wrap:break-word}td.ok{color:#1e6b52;font-weight:800;font-size:10pt}td.s{background:#fdf0c4;color:#5a3f00;font-weight:800}td.b{background:#e3eaf3;color:#2f5f9e;font-weight:800}td.na{color:#4d5752}td.su{background:#fdf0c4}td.pu{background:#fde2d3;color:#8a3b12;font-weight:800}sup{font-size:6pt}.bn{margin-top:6pt;font-size:8pt;line-height:1.45;break-inside:avoid}.bn ol{margin:3pt 0 0 14pt;padding:0}.bx{display:inline-block;width:3.4mm;height:3.4mm;border:.7pt solid #363e3a;border-radius:.7mm;vertical-align:middle}td.kt{font-size:7.5pt;line-height:1.25}small{color:#4d5752}.rs{color:#a12e22}.lg{margin-top:5pt;font-size:8pt;color:#363e3a;display:flex;gap:10pt;flex-wrap:wrap;align-items:center}.lg i{font-style:normal;font-weight:800;padding:0 3pt;border-radius:2pt}.sig{display:grid;grid-template-columns:repeat(3,1fr);column-gap:14mm;margin-top:9mm;break-inside:avoid;font-size:9pt;text-align:center}.s1{display:flex;flex-direction:column;align-items:center}.t{height:2.7em;line-height:1.3;display:flex;align-items:flex-end;justify-content:center;font-weight:600}.n{margin-top:15mm;width:85%;border-bottom:.6pt solid #201e1d;padding-bottom:2pt;font-weight:700;height:2.7em;line-height:1.25;display:flex;align-items:flex-end;justify-content:center;text-align:center;overflow:hidden}section+section{break-before:page}${preview ? `@media screen{html{background:transparent}body{zoom:${land ? .3 : .43};width:${land ? 297 : 210}mm;margin:6mm auto;padding:0;background:transparent}section{background:#fff;padding:12mm;margin:0 0 10mm;box-shadow:0 4px 18px rgba(0,0,0,.18)}}` : ''}`;
    const head = (title, sub) => `<div class="hd">${logo ? `<img src="${logo}" alt="">` : ''}<div><div class="k">${esc(this.klLabel())}</div><h1>${esc(title)}</h1><div class="m">${sub}</div></div></div>`;
    const meta = (n, x) => [x ? esc(x) : '', esc(this.scopeLabel(P)), kr ? 'Ketua Rombongan: ' + esc(kr) : '', n + ' jamaah', 'Dicetak ' + esc(was)].filter(Boolean).join(' · ');
    const sig = (t, n) => `<div class="s1"><div class="t">${t}</div><div class="n">${n ? esc(n) : '&nbsp;'}</div></div>`;
    const sigs = `<div class="sig">${sig('Ketua Rombongan', kr)}${sig('PPIH Bimbingan Ibadah Kloter', ppih)}${sig('Mengetahui,<br>Ketua Kloter', '')}</div>`;
    const legend = `<div class="lg"><b>Simbol:</b><span><i style="color:#1e6b52;font-size:10pt">✓</i> hadir/selesai</span><span><i style="background:#fdf0c4;color:#5a3f00">&nbsp;&nbsp;</i> latar amber = susulan</span><span><span class="bx"></span> belum (centang manual)</span></div>`;
    const AB = { Tr: 'Tarwiyah', NT: 'Non Tarwiyah', S: 'Safari Wukuf', MM: 'Murur Mabit', Mr: 'Murur', M: 'Mabit', T: 'Tanazul', NA: 'Nafar Awwal', L: 'Lanjut Nafar Tsani' };
    const legendFor = t => `<div class="lg"><b>Simbol:</b><span><i style="color:#1e6b52;font-size:10pt">✓</i> selesai</span><span><i style="background:#fdf0c4;color:#5a3f00">&nbsp;&nbsp;</i> latar amber = susulan</span>${[...t.used].map(a => `<span><i>${a}</i> ${AB[a] || a}</span>`).join('')}${t.hasB ? '<span><i style="background:#e3eaf3;color:#2f5f9e">B</i> Badal (nomor = keterangan di bawah)</span>' : ''}${t.hasNA ? '<span><i>NA</i> Nafar Awwal · <i>—</i> hari 13 tidak wajib</span>' : ''}${t.umrah ? '<span><i>U2</i> ulang ke-2</span><span><i style="background:#fde2d3;color:#8a3b12">PU</i> perlu ulang</span>' : ''}<span><span class="bx"></span> belum (centang manual)</span></div>`;
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
        body = `<section>${head(shd.title, meta(l.length, 'Risti, lansia, kursi roda'))}<table><colgroup><col style="width:8mm"><col style="width:44mm"><col style="width:21mm"><col style="width:${rw}mm"><col style="width:31mm"><col style="width:40mm"><col></colgroup><thead><tr><th>No</th><th>Nama jamaah</th><th>No. porsi</th><th>${nw ? 'Romb. Regu' : 'Regu'}</th><th>Kondisi</th><th>Pendamping (jamaah)</th><th>Catatan</th></tr></thead><tbody>${rows || '<tr><td colspan="7" class="c">Tidak ada jamaah khusus di cakupan ini.</td></tr>'}</tbody></table><div class="lg"><b>Ringkasan:</b><span>${cnt.r} risti</span><span>${cnt.la} lansia</span><span>${cnt.k} kursi roda</span><span style="color:#a12e22;font-weight:700">${cnt.t} belum ada pendamping</span></div><div class="lg">Pendamping dipilih dari jamaah; satu pendamping boleh mendampingi beberapa jamaah.</div>${sigs}</section>`;
      } else {
        const Dh = S.done.haji, BR = this.badalRites(), l = list.filter(j => this.needBadal(j) || BR.some(b => Dh[b.k][j.id])), key = j => this.pelOfB(j) || '_';
        const order = [...new Set(l.map(key))].sort((a, b) => (a === '_') - (b === '_') || l.filter(j => key(j) === b).length - l.filter(j => key(j) === a).length);
        const sorted = order.flatMap(p => l.filter(j => key(j) === p).sort((a, b) => a.r - b.r || a.g - b.g));
        let no = 0; const rows = gH(sorted, key).map(x => { if (x.h) { const p = x.h, n = sorted.filter(j => key(j) === p).length; return `<tr><th class="gr" colspan="${5 + BR.length}">${p === '_' ? 'Belum ada pelaksana · ' + n + ' jamaah' : 'Pelaksana: ' + esc(this.pelName(p)) + ' · ' + esc(this.pelRole(p)) + (p[0] === 'j' ? ' · melontar untuk diri sendiri + ' : ' · membadali ') + n + ' jamaah'}</th></tr>`; }
          const j = x.j, k0 = key(j); no++; const ket = [S.udz[j.id] ? 'Udzur' : 'Ditambahkan', S.notes[j.id] || ''];
          const cells = BR.map(b => { if (this.naLock('haji', b.k, j, Dh)) { ket.push('Nafar Awwal'); return '<td class="c na">NA</td>'; } if (Dh[b.k][j.id]) { const pk = ((S.badal.haji || {})[b.k] || {})[j.id]; if (pk && pk !== k0) ket.push(b.d + ' Dzh oleh ' + this.pelName(pk)); return '<td class="c ok">✓</td>'; } return '<td class="c"><span class="bx"></span></td>'; }).join('');
          return `<tr><td class="c nw">${no}</td><td class="nm">${esc(j.name)}</td><td class="nw">${esc(j.porsi)}</td><td class="c nw">R${j.r}·${j.g}</td>${cells}<td class="kt">${esc([...new Set(ket.filter(Boolean))].join('; '))}</td></tr>`; }).join('');
        const nP = order.filter(p => p !== '_').length;
        body = `<section>${head(shd.title, meta(l.length, '10–13 Dzulhijjah · ' + nP + ' pelaksana'))}<table><colgroup><col style="width:8mm"><col style="width:50mm"><col style="width:21mm"><col style="width:12mm">${BR.map(() => '<col style="width:15mm">').join('')}<col></colgroup><thead><tr><th>No</th><th>Jamaah yang dibadalkan</th><th>No. porsi</th><th>Romb. Regu</th>${BR.map(b => `<th>${b.d} Dzh<span class="thn">${b.d === 10 ? 'Aqobah' : '3 jumroh'}</span></th>`).join('')}<th>Keterangan</th></tr></thead><tbody>${rows || `<tr><td colspan="${5 + BR.length}" class="c">Belum ada jamaah yang dibadalkan di cakupan ini.</td></tr>`}</tbody></table><div class="lg"><b>Simbol:</b><span><i style="color:#1e6b52;font-size:10pt">✓</i> sudah dibadalkan</span><span><span class="bx"></span> belum</span><span><i>NA</i> Nafar Awwal · hari 13 tidak wajib</span></div><div class="lg">Pelaksana boleh jamaah mana pun dan melontar untuk dirinya serta jamaah yang dibadalkan pada waktu yang sama.</div>${sigs}</section>`;
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
    try { await Promise.all([document.fonts.load('800 60px Figtree'), document.fonts.load('600 30px Figtree')]); } catch (e) {}
    const F = 'Figtree, system-ui, sans-serif', G1 = '#1C8F64', G2 = '#0E5C40', GR = '#137A55', TX = '#14201B', MU = '#5F6B65', RD = '#C2372B';
    const rr = (x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };
    const txt = (t, x, y, font, col, al) => { g.font = font; g.fillStyle = col; g.textAlign = al || 'left'; g.textBaseline = 'alphabetic'; g.fillText(t, x, y); };
    const card = (x, y, w, h) => { g.save(); g.shadowColor = 'rgba(16,40,30,0.10)'; g.shadowBlur = 30; g.shadowOffsetY = 10; g.fillStyle = '#fff'; rr(x, y, w, h, 36); g.fill(); g.restore(); };
    let bgG = g.createLinearGradient(0, 0, W, H); bgG.addColorStop(0, '#E4F2EA'); bgG.addColorStop(1, '#F4F8F6'); g.fillStyle = bgG; g.fillRect(0, 0, W, H);
    const logo = await new Promise(res => { const im = new Image(), srcs = [this._logo || 'emblem-256.png', 'icon-192.png', 'app/icon-192.png']; let i = 0; im.onload = () => res(im); im.onerror = () => { i++; if (i < srcs.length) im.src = srcs[i]; else res(null); }; im.src = srcs[0]; });
    g.save(); g.shadowColor = 'rgba(16,40,30,0.15)'; g.shadowBlur = 18; g.fillStyle = '#fff'; g.beginPath(); g.arc(124, 112, 52, 0, Math.PI * 2); g.fill(); g.restore();
    if (logo) g.drawImage(logo, 90, 78, 68, 68);
    txt('Rekap ' + this.klLabel(), 196, 108, '800 50px ' + F, TX);
    txt(new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + this.tz('Asia/Riyadh') + ' WAS', 196, 150, '600 28px ' + F, MU);
    // hero
    g.save(); g.shadowColor = 'rgba(14,92,64,0.35)'; g.shadowBlur = 40; g.shadowOffsetY = 18; const hg = g.createLinearGradient(72, 210, 1008, 560); hg.addColorStop(0, G1); hg.addColorStop(1, G2); g.fillStyle = hg; rr(72, 210, 936, 340, 44); g.fill(); g.restore();
    g.save(); rr(72, 210, 936, 340, 44); g.clip(); g.fillStyle = 'rgba(255,255,255,0.08)'; g.beginPath(); g.arc(940, 200, 200, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.05)'; g.beginPath(); g.arc(820, 600, 150, 0, Math.PI * 2); g.fill(); g.restore();
    txt((RS.complete ? 'Selesai · ' : 'Sedang berlangsung · ') + R.day, 116, 272, '700 28px ' + F, 'rgba(255,255,255,0.88)');
    txt(R.n, 116, 334, '800 52px ' + F, '#fff');
    if (RS.complete) {
      txt('Alhamdulillah, tuntas', 116, 428, '800 64px ' + F, '#fff');
      txt('Seluruh ' + RS.tot + ' jamaah sudah tercatat', 116, 478, '600 30px ' + F, 'rgba(255,255,255,0.9)');
      g.fillStyle = '#fff'; g.beginPath(); g.arc(900, 420, 70, 0, Math.PI * 2); g.fill();
      g.strokeStyle = GR; g.lineWidth = 16; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(866, 422); g.lineTo(892, 448); g.lineTo(938, 396); g.stroke();
    } else {
      txt(String(RS.done), 116, 448, '800 112px ' + F, '#fff'); g.font = '800 112px ' + F; const w0 = g.measureText(String(RS.done)).width;
      txt('/ ' + RS.tot + ' jamaah · ' + RS.pct + '%', 116 + w0 + 18, 444, '700 38px ' + F, 'rgba(255,255,255,0.9)');
      g.fillStyle = 'rgba(255,255,255,0.22)'; rr(116, 486, 848, 16, 8); g.fill(); g.fillStyle = '#fff'; rr(116, 486, Math.max(16, 848 * RS.pct / 100), 16, 8); g.fill();
    }
    // bars per rombongan
    card(72, 588, 936, 452);
    txt('Per rombongan', 116, 650, '800 34px ' + F, TX); txt('merah bila di bawah 70%', 964, 650, '600 24px ' + F, MU, 'right');
    const bars = [...RS.rombs].sort((a, b) => a.r - b.r), n = bars.length || 1, x0 = 116, span = 848, bw = Math.min(64, span / n - 22), base = 980, mh = 250;
    bars.forEach((o, i) => { const cx = x0 + span / n * (i + .5), h = Math.max(10, mh * o.pct / 100), low = o.pct < 70;
      g.fillStyle = '#EEF2F0'; rr(cx - bw / 2, base - mh, bw, mh, 16); g.fill();
      g.fillStyle = low ? RD : GR; rr(cx - bw / 2, base - h, bw, h, 16); g.fill();
      txt(o.pct + '%', cx, base - h - 12, '800 24px ' + F, low ? RD : TX, 'center');
      txt('R' + o.r, cx, base + 38, '700 26px ' + F, MU, 'center'); });
    // donut + legend
    card(72, 1072, 936, 186);
    const parts = [['Tepat waktu', RS.tepat, GR], ['Susulan', RS.sus, '#C77700'], ['Dibadalkan', RS.badal, '#2C66A8'], ['Belum', RS.belum + RS.udzB + RS.ulangP, '#DCE3DF']];
    let a0 = -Math.PI / 2; const dc = { x: 186, y: 1165 }, tot = Math.max(1, RS.tot);
    g.lineWidth = 26; g.lineCap = 'butt'; g.strokeStyle = '#EEF2F0'; g.beginPath(); g.arc(dc.x, dc.y, 58, 0, Math.PI * 2); g.stroke();
    parts.forEach(([, v, c]) => { if (!v) return; const a1 = a0 + Math.PI * 2 * v / tot; g.strokeStyle = c; g.beginPath(); g.arc(dc.x, dc.y, 58, a0, a1); g.stroke(); a0 = a1; });
    txt(RS.pct + '%', dc.x, dc.y + 10, '800 28px ' + F, TX, 'center');
    parts.forEach(([l, v, c], i) => { const cx = 300 + (i % 2) * 360, cy = 1138 + Math.floor(i / 2) * 64;
      g.fillStyle = c; g.beginPath(); g.arc(cx, cy - 9, 10, 0, Math.PI * 2); g.fill(); txt(l, cx + 22, cy, '600 28px ' + F, MU); txt(String(v), cx + 320, cy, '800 30px ' + F, TX, 'right'); });
    txt('PPIH Bimbingan Ibadah Kloter · ' + this.ppih(), W / 2, 1310, '700 26px ' + F, G2, 'center');
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
    const go = (tab, extra) => () => this.setState({ tab, ...(tab === 'checklist' ? { ckPilih: false, ckDariPilih: false } : {}), ...(extra || {}) });
    const pill = a => ({ bg: a ? 'var(--color-accent)' : 'transparent', fg: a ? '#fff' : 'var(--color-neutral-800)' });
    const chip = a => ({ bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? 'var(--color-bg)' : 'var(--color-text)' });
    const doneCnt = k => D[k].filter(Boolean).length;
    const days = [...new Set(X.rites.map(r => r.day))], missed = this.missedFn(), M0 = this.meta(S.mode), sat = (k, j) => this.sat(S.mode, k, j, D);
    // beranda
    const modes = [['haji', 'Haji'], ['umrah', 'Umrah'], ['madinah', 'Madinah']].map(([k, l]) => ({ l, ...pill(S.mode === k),
      on: () => { const c = this.data[k].cur; this.saveCfg({ mode: k }); this.setState(s => ({ mode: k, ck: { ...s.ck, rite: c }, pr: { ...s.pr, rites: [c] } })); } }));
    const cd = doneCnt(ci), verb = X.rites[ci].verb || 'selesai';
    const belum = this.jm.filter(j => this.tgt(S.mode, ci, j, D) && !sat(ci, j)).length, tert = this.jm.filter(missed).length;
    const rites = X.rites.map((r, i) => { const st = i < ci ? 'done' : i === ci ? 'now' : 'next', n = doneCnt(i), sn = this.susN(S.mode, i, D);
      return { ...r, hasSus: sn > 0, sus: sn + ' susulan', cnt: n === 0 && st === 'next' ? '—' : (M0.slots[M0.slotOf[i]] || []).length > 1 || r.opt ? n + ' jamaah' : `${n}/${this.jm.filter(j => this.tgt(S.mode, i, j, D)).length}`, mark: st === 'done' ? '✓' : st === 'now' ? String(i + 1) : '',
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
        hasil: !r.tgl || !t ? '' : sus ? 'Akan tercatat SUSULAN (setelah tanggal jadwal)' : 'Tercatat tepat waktu', hasilFg: sus ? '#7a5200' : 'var(--color-accent-800)', hasilBg: sus ? '#fdf0c4' : 'var(--color-accent-100)',
        onTgl: e => this.patch('tgJ', { tgl: e.target.value }), simpan: () => this.ubahTglJamaah(S.tgJ.id, S.tgJ.k, t), batal: () => this.setState({ tgJ: null }) }; })() : null;
    const RS = this.rekapStats();
    const stats = [
      { v: belum, l: 'Belum', icon: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', bg: 'var(--color-accent-100)', fg: 'var(--color-accent)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'belum', r: 0 } }) },
      { v: udzN, l: 'Udzur', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v5M12 16.5v.01', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'udzur', r: 0 } }) },
      { v: tert, l: 'Tertinggal', icon: 'M5 21V4M5 4h11l-2 4 2 4H5', bg: 'var(--red-100)', fg: 'var(--red-700)', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'tert', r: 0 } }) },
      { v: RS.susN, l: 'Susulan', icon: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 8v4l3 2', bg: '#FFF1DB', fg: '#C77700', ring: 'transparent', on: go('jamaah', { jl: { ...J, f: 'sus', r: 0 } }) }
    ];
    // jamaah
    const q = J.q.trim().toLowerCase();
    const F = { risti: j => j.risti, semua: () => true, belum: j => this.tgt(S.mode, ci, j, D) && !sat(ci, j), udzur: j => S.udz[j.id], tert: missed, sus: j => X.rites.some((_, k) => D[k][j.id] && (S.tg[S.mode + '|' + k + '|' + j.id] || {}).s) };
    const base = this.jm.filter(j => (!J.r || j.r === J.r) && (!J.r || !J.g || j.g === J.g) && (!q || j.name.toLowerCase().includes(q) || j.porsi.includes(q)));
    const fl = base.filter(F[J.f]);
    const jl = { q: J.q, count: fl.length, scope: J.r ? 'Rombongan ' + J.r + (J.g ? ' · Regu ' + J.g : '') : 'seluruh kloter', showG: !!J.r,
      gs: [0, 1, 2, 3, 4].map(g => ({ l: g ? 'Regu ' + g : 'Semua', ...chip((J.g || 0) === g), on: () => this.patch('jl', { g }) })), empty: fl.length === 0, trunc: fl.length > 40,
      filters: [['semua', 'Semua'], ['belum', 'Belum ' + X.rites[ci].p], ['udzur', 'Udzur'], ['risti', 'Risti'], ['tert', 'Tertinggal'], ['sus', 'Susulan']].map(([k, l]) => ({ l, n: base.filter(F[k]).length, ...pill(J.f === k), on: () => this.patch('jl', { f: k }) })),
      rs: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const a = J.r === r; return { l: r ? 'R' + r : 'Semua', bg: a ? 'var(--color-accent)' : 'transparent', fg: a ? 'var(--color-bg)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('jl', { r: a ? 0 : r, g: 0 }) }; }),
      rows: fl.slice(0, 40).map(j => { const u = S.udz[j.id], d = sat(ci, j), m = missed(j), pu = X.rites.some((_, k) => !D[k][j.id] && (S.ex[S.mode + '|' + k + '|' + j.id] || {}).stUlang === 'Perlu ulang'), sa = X.rites.some((_, k) => D[k][j.id] && (S.tg[S.mode + '|' + k + '|' + j.id] || {}).s);
        return { name: j.name, ini: j.ini, sub: (j.role ? j.role + ' · ' : '') + (j.sex ? j.sex + ' · ' : '') + `R${j.r} · Regu ${j.g} · ${j.porsi}`, on: () => this.setState({ sel: j.id }),
          avBg: u || j.risti ? 'var(--red-100)' : 'var(--color-accent-100)', avFg: u || j.risti ? 'var(--red-700)' : 'var(--color-accent-800)', risti: j.risti, note: S.notes[j.id] || '', hasNote: !!S.notes[j.id],
          tag: u ? 'Udzur' : pu ? '↺ Perlu ulang' : m ? 'Tertinggal' : sa ? 'Susulan' : d ? 'Sudah' : 'Belum',
          tagBg: u ? 'var(--red-600)' : pu ? '#fdf0c4' : m ? 'var(--red-100)' : sa ? '#fdf0c4' : d ? 'var(--color-accent-100)' : 'var(--color-neutral-100)',
          tagFg: u ? '#fff' : pu ? '#5a3f00' : m ? 'var(--red-700)' : sa ? '#5a3f00' : d ? 'var(--color-accent-800)' : 'var(--color-neutral-800)' }; }) };
    // detail
    let sel = {};
    if (S.sel != null) { const j = this.jm[S.sel], u = S.udz[j.id];
      sel = { name: j.name, ini: j.ini, sub: (j.role ? j.role + ' · ' : '') + `Rombongan ${j.r} · Regu ${j.g} · Porsi ${j.porsi}`,
        udzBg: u ? 'var(--red-100)' : 'var(--color-accent-100)', risti: j.risti, avBg: u || j.risti ? 'var(--red-100)' : 'var(--color-accent-100)', avFg: u || j.risti ? 'var(--red-700)' : 'var(--color-accent-800)', hp: j.hp, tel: 'tel:' + j.hp, note: S.notes[j.id] || '', hasNote: !!S.notes[j.id],
        noteChips: ['Kursi roda', 'Ikut murur', 'Dirawat di KKHI', 'Pendamping keluarga'].map(t => ({ l: t, on: () => this.setNote(j.id, t) })),
        udzTitle: u ? 'UDZUR · dibadalkan' : 'Kondisi baik', udz: !!u,
        mqTxt: S.mode === 'umrah' ? 'Miqat: ' + ((S.mq || {})[j.id] || ((this.miqatKloter() || 'belum ditentukan') + ' (ikut kloter)')) : '',
        openMq: () => this.setState({ mqDlg: { scope: 'jamaah', id: j.id, val: (S.mq || {})[j.id] || '' } }),
        udzSub: (() => { const r = this.riwayatUdzur(j.porsi)[0]; const base = u ? 'Tidak ikut dicentang massal' : 'Ikut checklist massal';
          return r && r.udzur === !!u ? base + ' · sejak ' + this.fmtWaktu(r.waktu) + (r.alasan ? ' · ' + r.alasan : '') : base; })(),
        udzCta: u ? 'Hapus status udzur' : 'Tandai udzur',
        udzBtnCls: u ? 'btn btn-secondary' : 'btn btn-primary', udzBtnStyle: u ? 'height:46px;width:100%' : 'height:46px;width:100%;background:var(--red-600);border-color:var(--red-600)',
        udzForm: S.udzForm && S.udzForm.id === j.id ? (() => { const f = S.udzForm;
          return { title: f.udzur ? 'Tandai ' + j.name + ' udzur' : 'Hapus status udzur ' + j.name, alasan: f.alasan,
            chips: (f.udzur ? ['Sakit', 'Dirawat di KKHI', 'Dirawat di RSAS', 'Lansia / risti berat', 'Kursi roda'] : ['Sudah sehat', 'Keluar dari RS', 'Salah tandai']).map(t => ({ l: t, on: () => this.patch('udzForm', { alasan: t }), bg: f.alasan === t ? 'var(--color-accent)' : 'var(--color-surface)', fg: f.alasan === t ? '#fff' : 'var(--color-neutral-800)' })),
            onAlasan: e => this.patch('udzForm', { alasan: e.target.value.slice(0, 120) }),
            ok: () => this.simpanUdzur(j, f.udzur, f.alasan), okLabel: f.udzur ? 'Simpan · tandai udzur' : 'Simpan · hapus udzur', okStyle: f.udzur ? 'background:var(--red-600);border-color:var(--red-600)' : '',
            batal: () => this.setState({ udzForm: null }) }; })() : null,
        riwayatUdz: this.riwayatUdzur(j.porsi).slice(0, 6).map(r => ({ teks: this.fmtWaktu(r.waktu) + ' · ' + (r.udzur ? 'Ditandai udzur' : 'Udzur dihapus') + (r.alasan ? ' · ' + r.alasan : ''),
          oleh: (r.petugas ? 'oleh ' + r.petugas : '') + (r.antre ? (r.petugas ? ' · ' : '') + 'belum terkirim' : ''), dot: r.udzur ? 'var(--red-600)' : 'var(--color-accent)' })),
        pelNote: (() => { const key = 'j' + j.id, out = []; Object.entries(S.badal[S.mode]).forEach(([k, m]) => Object.entries(m).forEach(([id, v]) => { if (v === key) out.push(this.jm[+id].name + ' (' + X.rites[k].p + ')'); })); return out.length ? 'Membadalkan: ' + out.join(', ') : ''; })(),
        toggleUdz: () => this.setState({ udzForm: { id: j.id, udzur: !u, alasan: '' } }),
        canUlang: S.mode === 'umrah' && X.rites.some((r, k) => r.ulang && D[k][j.id]), openUlang: () => this.setState({ sel: null, ulDlg: { id: j.id, tahap: 'Thawaf', why: '', cat: '', rencana: '' } }),
        rites: X.rites.map((r, k) => { const d = D[k][j.id], tgE = S.tg[S.mode + '|' + k + '|' + j.id] || {}, ee = S.ex[S.mode + '|' + k + '|' + j.id] || {}, na = this.naLock(S.mode, k, j, D), alt = !d && !r.opt ? this.satBy(S.mode, M0.slotOf[k], j, D) : -1, bkey = r.badal ? (S.badal[S.mode][k] || {})[j.id] : null;
          const st = na ? 'Nafar Awwal · tidak wajib' : d ? (r.badal ? 'Badal · oleh ' + (bkey ? this.pelName(bkey) : '—') : ee.ulangKe >= 2 ? 'Ulang ke-' + ee.ulangKe + (tgE.t ? ' · ' + this.fmtTgl(tgE.t) : '') : tgE.s ? 'Susulan · ' + this.fmtH(tgE.t) + (ee.pend ? ' · didampingi ' + this.pelName(ee.pend) : '') : r.safari ? 'Safari' + (ee.alasan ? ' · ' + ee.alasan : '') : (ee.pil && ee.pil !== r.p && ee.pil !== r.pil ? ee.pil : 'Selesai'))
            : ee.stUlang === 'Perlu ulang' ? '↺ Perlu ulang' : alt >= 0 ? 'Dipilih: ' + X.rites[alt].p : r.opt ? '—' : k < ci ? 'Tertinggal' : k === ci ? 'Berlangsung' : '—';
          return { n: r.n, day: r.day, mark: d ? '✓' : '', bg: d ? (r.badal ? 'var(--color-accent-2)' : tgE.s ? '#c98a00' : 'var(--color-accent)') : na ? 'var(--color-neutral-200)' : 'transparent', ring: d ? 'transparent' : 'var(--color-neutral-400)', st,
            fg: na || alt >= 0 ? 'var(--color-neutral-700)' : tgE.s || ee.stUlang === 'Perlu ulang' ? '#7a5200' : d ? 'var(--color-accent-2-700)' : k <= ci ? 'var(--color-accent-700)' : 'var(--color-neutral-700)',
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
    const box = (d, n) => d === n && n > 0 ? { mark: '✓', bg: 'var(--color-accent)', fg: '#fff', ring: 'var(--color-accent)', cntFg: 'var(--color-accent-700)' }
      : d === 0 ? { mark: '', bg: 'transparent', fg: 'var(--color-text)', ring: 'var(--color-neutral-400)', cntFg: 'var(--color-neutral-700)' }
      : { mark: '–', bg: 'var(--color-accent-2-200)', fg: 'var(--color-accent-2-800)', ring: 'var(--color-accent-2-400)', cntFg: 'var(--color-accent-700)' };
    const rk0 = ck.rite, isBad = !!X.rites[rk0].badal, bmap = S.badal[S.mode][rk0] || {};
    const tgOf = j => S.tg[S.mode + '|' + rk0 + '|' + j.id];
    const pelOf = j => { const mm = S.badal[S.mode] || {}; let key = bmap[j.id]; if (!key) for (const kk in mm) if (mm[kk][j.id]) { key = mm[kk][j.id]; break; } return key ? this.pelName(key).split(' ').slice(0, 2).join(' ') : ''; };
    const dotOf = j => { const d = CD[j.id], e = tgOf(j), sf = d && e && e.s, na = this.naLock(S.mode, rk0, j, D), alt = !d && !R0.opt && sat(rk0, j);
      return { ini: j.ini, bg: na ? 'var(--color-neutral-200)' : sf ? '#fdf0c4' : d ? (S.udz[j.id] || isBad ? 'var(--color-accent-2)' : 'var(--color-accent)') : alt ? 'var(--color-accent-2-200)' : 'transparent', fg: na ? 'var(--color-neutral-700)' : sf ? '#5a3f00' : d ? '#fff' : alt ? 'var(--color-accent-2-900)' : 'var(--color-neutral-700)', bd: sf ? '2px solid #c98a00' : d || alt || na ? '2px solid transparent' : '2px dashed var(--color-neutral-500)' }; };
    const missF = this.missedFn(), ckPeople = [];
    const person = (j, onCheck) => { const m0 = S.mode, d = !!CD[j.id], e = tgOf(j) || {}, ee = S.ex[m0 + '|' + rk0 + '|' + j.id] || {}, sf = d && e.s, note = S.notes[j.id], tags = [], na = this.naLock(m0, rk0, j, D), altK = !d && !R0.opt ? this.satBy(m0, M0.slotOf[rk0], j, D) : -1, alt = altK >= 0 ? X.rites[altK] : null;
      if (j.risti) tags.push({ t: note ? 'Risti · ' + note : 'Risti', bg: 'var(--red-100)', fg: 'var(--red-700)' }); else if (note) tags.push({ t: note, bg: 'var(--color-neutral-100)', fg: 'var(--color-neutral-800)' });
      if (na) tags.push({ t: 'Nafar Awwal · tidak wajib', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-800)' });
      const bk = isBad && d ? bmap[j.id] : alt && alt.badal ? ((S.badal[m0] || {})[altK] || {})[j.id] : null;
      if ((isBad && d) || (alt && alt.badal)) tags.push({ t: 'Badal · oleh ' + (bk ? this.pelName(bk) : 'pelaksana belum dicatat'), bg: bk ? 'var(--color-accent-2-100)' : 'var(--red-100)', fg: bk ? 'var(--color-accent-2-700)' : 'var(--red-700)' });
      else if (S.udz[j.id]) { const p = pelOf(j); tags.push({ t: 'Udzur · ' + (p ? 'dibadalkan ' + p : 'belum dibadalkan'), bg: 'var(--red-600)', fg: '#fff' }); }
      if (alt && !alt.badal) tags.push({ t: 'Dipilih: ' + alt.p, bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-800)' });
      if (d && R0.safari) tags.push({ t: 'Safari · ' + (ee.alasan || 'alasan belum diisi'), bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)' });
      if (d && /^Tarwiyah \d/.test(ee.pil || '')) tags.push({ t: ee.pil, bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)' });
      if (sf) tags.push({ t: 'Susulan · ' + this.fmtH(e.t) + (ee.pend ? ' · didampingi ' + this.pelName(ee.pend) : ''), bg: '#fdf0c4', fg: '#5a3f00' });
      if (d && ee.ulangKe >= 2) tags.push({ t: '↺ Ulang ke-' + ee.ulangKe + (e.t ? ' · ' + this.fmtTgl(e.t) : '') + (ee.pend && !sf ? ' · didampingi ' + this.pelName(ee.pend) : ''), bg: '#fdf0c4', fg: '#5a3f00' });
      if (!d && ee.stUlang === 'Perlu ulang') tags.push({ t: '↺ Perlu ulang' + (ee.alasan ? ' · ' + ee.alasan : ''), bg: '#fdf0c4', fg: '#5a3f00' });
      else if (!d && !alt && !na && !isBad && missF(j)) tags.push({ t: 'Tertinggal', bg: 'var(--red-100)', fg: 'var(--red-700)' });
      const c = na ? { bg: 'var(--color-neutral-100)', ring: 'var(--color-neutral-300)', fg: 'var(--color-neutral-700)', mk: '—' } : sf ? { bg: '#fdf0c4', ring: '#c98a00', fg: '#5a3f00', mk: isBad ? 'B' : '✓' }
        : d ? (isBad || S.udz[j.id] ? { bg: 'var(--color-accent-2)', ring: 'var(--color-accent-2)', fg: '#fff', mk: isBad ? 'B' : '✓' } : { bg: 'var(--color-accent)', ring: 'var(--color-accent)', fg: '#fff', mk: '✓' })
        : alt ? { bg: alt.badal ? 'var(--color-accent-2-100)' : 'var(--color-accent-2-100)', ring: alt.badal ? 'var(--color-accent-2)' : 'var(--color-accent-2-400)', fg: alt.badal ? 'var(--color-accent-2-700)' : 'var(--color-accent-2-900)', mk: alt.ab && alt.ab !== '✓' ? alt.ab : '•' } : { bg: 'var(--color-surface)', ring: 'var(--color-neutral-500)', fg: 'transparent', mk: '✓' };
      const red = S.udz[j.id] || j.risti, canUl = m0 === 'umrah' && X.rites.some((r, k) => r.ulang && D[k][j.id]);
      return { name: j.name, ini: j.ini, sub: (j.role ? j.role + ' · ' : '') + 'R' + j.r + ' · Regu ' + j.g, tags, hasTags: tags.length > 0, cb: c.bg, cr: c.ring, cf: c.fg, mark: c.mk, mfs: c.mk.length > 1 ? '15px' : '22px',
        avBg: red ? 'var(--red-100)' : 'var(--color-accent-100)', avFg: red ? 'var(--red-700)' : 'var(--color-accent-800)', onCheck: na ? () => this.flash('Nafar Awwal · hari 13 tidak wajib') : onCheck, onOpen: () => this.setState({ sel: j.id }),
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
      return { r, p, l: 'R' + r, pct: p + '%', col: low ? 'var(--red-600)' : 'var(--color-accent)', fg: low ? 'var(--red-700)' : 'var(--color-text)', bg: a ? 'var(--color-accent-100)' : 'var(--color-surface)', ring: a ? 'var(--color-accent)' : low ? 'var(--red-200)' : 'var(--color-divider)', on: () => this.patch('ck', { r, g: ck.g || 1 }) }; }).sort((a, b) => a.p - b.p || a.r - b.r);
    const ckBadal = !!R0.badal, tl = this.scopeList(ck), tt = tl.filter(j => this.tgt(S.mode, rk0, j, D)), td = cnt(tt), elig = tl.filter(j => this.eligible(j, rk0)), todoN = elig.filter(j => !sat(rk0, j)).length, allE = elig.length > 0 && todoN === 0, un = tl.filter(j => S.udz[j.id]).length;
    let ckSum = { label: this.scopeLabel(ck), done: td, total: tt.length, rite: X.rites[ck.rite].n, pct: (tt.length ? Math.round(td / tt.length * 100) : 0) + '%',
      action: allE ? 'Batalkan centang semua' : 'Centang ' + todoN + ' jamaah tersisa di ' + (ck.scope === 'regu' ? 'Regu ' + ck.g : ck.scope === 'rombongan' ? 'Rombongan ' + ck.r : 'seluruh kloter'), onAll: () => this.askMass(tl, this.scopeLabel(ck)),
      hasNote: un > 0 && (!ckBadal || elig.length > 0), note: ckBadal ? `Kegiatan badal: hanya ${elig.length} jamaah udzur yang dicentang massal.` : `${un} jamaah udzur tidak ikut dicentang massal — tandai satu per satu bila sudah dibadalkan.` };
    if (R0.pend && rk0 < ci && !allE) ckSum = { ...ckSum, action: 'Catat susulan berkelompok · ' + todoN + ' jamaah', onAll: () => { const cand = elig.filter(j => !sat(rk0, j)).map(j => j.id); this.setState({ susDlg: { ids: [], cand, rite: rk0, tgl: this.todayKey(), pend: '', pq: '', group: true } }); } };
    let pelGroups = [];
    if (ckBadal) { const cand = this.badalCand(rk0, tl), dn = tl.filter(j => CD[j.id]), k = rk0, tot2 = dn.length + cand.length;
      ckSum = { ...ckSum, done: dn.length, total: tot2, pct: (tot2 ? Math.round(dn.length / tot2 * 100) : 0) + '%',
        action: cand.length ? 'Catat badal berkelompok · ' + cand.length + ' jamaah' : 'Tidak ada jamaah yang perlu dibadalkan', onAll: () => { if (cand.length) this.openPicker(k, cand.filter(j => S.udz[j.id]).map(j => j.id), cand.map(j => j.id)); },
        hasNote: true, note: 'Pelaksana badal wajib diisi. Satu pelaksana boleh membadali beberapa jamaah sekaligus; pelaksana yang juga jamaah boleh mencentang lontarnya sendiri.' };
      const g = {}; dn.forEach(j => { const key = bmap[j.id] || '—'; (g[key] = g[key] || []).push(j); });
      pelGroups = Object.entries(g).map(([key, js]) => ({ name: key === '—' ? 'Belum ada pelaksana' : this.pelName(key), role: key === '—' ? 'Data lama · ketuk nama untuk melengkapi' : this.pelRole(key), count: js.length, names: js.map(j => j.name.split(' ')[0]).join(', ') })); }
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
        srcs: [['jamaah', 'Sesama jamaah', pjAll.length], ['petugas', 'Petugas', petF.length]].map(([key, l, n]) => { const a = src === key; return { l, n, on: () => this.patch('picker', { src: key, pel: null }), bg: a ? 'var(--color-text)' : 'transparent', fg: a ? 'var(--color-bg)' : 'var(--color-text)' }; }),
        warn: '', q: P2.q, onQ: e => this.patch('picker', { q: e.target.value }),
        jam: (P2.cand ? P2.cand.map(id => this.jm[id]) : this.jm.filter(j => S.udz[j.id])).map(j => { const a = P2.sel.includes(j.id), cur = map[j.id];
          return { name: j.name, sub: `R${j.r} · Regu ${j.g} · ` + (S.udz[j.id] ? 'Udzur · ' : '') + (cur ? 'Pelaksana: ' + this.pelName(cur) : 'Belum ada pelaksana'),
            mark: a ? '✓' : '', bg: a ? 'var(--color-accent-2)' : 'transparent', ring: a ? 'var(--color-accent-2)' : 'var(--color-neutral-400)',
            on: () => this.patch('picker', { sel: a ? P2.sel.filter(x => x !== j.id) : [...P2.sel, j.id] }) }; }),
        disabled: !(P2.sel.length && P2.pel), cta: !P2.sel.length ? 'Pilih jamaah' : !P2.pel ? 'Pilih pelaksana dulu' : `Simpan badal · ${P2.sel.length} jamaah` }; }
    // cetak
    if (isMad && P.slot != null && this.jadwal[P.slot]) { const sp = this.jadwal[P.slot]; this._slotF = j => this.inSlot(j, sp); }
    const pl = this.scopeList(P); this._slotF = null; const ks = P.rites.filter(k => k < nR).sort((a, b) => a - b), shown = ks.slice(0, 4), rek = P.fmt === 'rekap';
    const shd = this.sheetDef(P.sheet || 'armuzna'), PPN = this.ppih();
    const SY = { pu: { v: 'PU', fg: '#8a3b12', bg: '#fde2d3', bd: '#e07b39' }, ok: { v: '✓', fg: '#1e6b52', bg: 'transparent', bd: 'transparent' }, s: { v: 'S', fg: '#5a3f00', bg: '#fdf0c4', bd: '#c98a00' }, b: { v: 'B', fg: 'var(--color-accent-2-700)', bg: 'var(--color-accent-2-100)', bd: 'var(--color-accent-2-700)' }, box: { v: '', fg: 'inherit', bg: 'var(--color-surface)', bd: 'var(--color-neutral-700)' }, na: { v: '–', fg: 'var(--color-neutral-700)', bg: 'transparent', bd: 'transparent' } };
    let pr;
    if (shd.kind === 'khusus' || shd.kind === 'badal') { const isK = shd.kind === 'khusus', pl3 = this.scopeList(P).filter(j => isK ? this.isKh(j) : this.needBadal(j)), BR = this.badalRites(), Dh = S.done.haji;
      const cellB = (j, b) => this.naLock('haji', b.k, j, Dh) ? SY.na : Dh[b.k][j.id] ? SY.ok : SY.box;
      pr = { title: shd.title, sub: this.scopeLabel(P) + ' · ' + pl3.length + ' jamaah', orientL: 'Potret', pages: Math.max(1, Math.ceil(pl3.length / 26)), cols: isK ? '16px minmax(0,1fr) 110px' : '16px minmax(0,1fr) ' + BR.map(() => '30px').join(' '), groups: [{ label: isK ? 'Pendamping' : '10–13 Dzh', col: 'span ' + (isK ? 1 : BR.length) }], heads: isK ? ['Pendamping'] : BR.map(b => String(b.d)),
        rows: pl3.slice(0, 8).map((j, i) => ({ no: i + 1, name: j.name, cells: isK ? [{ v: this.pendKey(j.id) ? this.pelName(this.pendKey(j.id)).split(' ').slice(0, 2).join(' ') : 'Belum ada', fg: this.pendKey(j.id) ? 'var(--color-text)' : 'var(--red-700)', bg: 'transparent', bd: 'transparent' }] : BR.map(b => cellB(j, b)) })), hasMore: pl3.length > 8, more: pl3.length - 8 };
    } else if (shd.kind === 'harian') { const today = X.rites.map((r, k) => k).filter(k => X.rites[k].day === X.rites[ci].day && !X.rites[k].badal).slice(0, 4);
      pr = { title: 'Rekap harian · ' + X.rites[ci].day, sub: 'Per rombongan · ' + this.jm.length + ' jamaah', orientL: 'Potret', pages: 1, cols: '16px minmax(0,1fr) ' + today.map(() => '34px').join(' '), groups: [{ label: X.rites[ci].day, col: 'span ' + Math.max(1, today.length) }], heads: today.map(k => X.rites[k].p),
        rows: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const l = this.mem(r); return { no: r, name: 'R' + r + ' · ' + this.ketuaR(r).name.split(' ')[0] + ' (' + l.length + ')',
          cells: today.map(k => { const n = l.filter(j => D[k][j.id]).length; return { v: String(n), fg: n === l.length ? 'var(--color-accent-700)' : 'var(--red-700)', bg: 'transparent', bd: 'transparent' }; }) }; }) };
    } else if (shd.kind === 'raudhoh') { const sp = P.slot != null && this.jadwal[P.slot] ? this.jadwal[P.slot] : this.jadwal[0], l = sp ? this.scopeList(P).filter(j => this.inSlot(j, sp)) : [];
      pr = { title: shd.title, sub: (sp ? this.slotLabel(sp) : 'Belum ada jadwal') + ' · ' + l.length + ' jamaah', orientL: 'Potret', pages: Math.max(1, Math.ceil(l.length / 28)) * Math.max(1, P.slot != null ? 1 : this.jadwal.length), cols: '16px minmax(0,1fr) 36px', groups: [{ label: 'Raudhoh', col: 'span 1' }], heads: ['Hadir'],
        rows: l.slice(0, 8).map((j, i) => ({ no: i + 1, name: j.name, cells: [SY[this.cellOf('madinah', this.sheetCols('madinah', [0])[0], j).t]] })), hasMore: l.length > 8, more: l.length - 8 };
    } else { const cols2 = this.sheetCols(shd.mode, shd.secs[0].ks), c5 = cols2.slice(0, 5), pl2 = this.scopeList(P);
      const cv = c => { const s0 = SY[c.t] || SY.box; return { ...s0, v: c.vt || c.v, bg: c.sus ? '#fdf0c4' : s0.bg }; };
      pr = { title: shd.title, sub: this.scopeLabel(P) + ' · ' + pl2.length + ' jamaah', orientL: shd.land ? 'Lanskap' : 'Potret', pages: Math.max(1, Math.ceil(pl2.length / (shd.land ? 18 : 28))) * shd.secs.length, cols: '16px minmax(0,1fr) ' + c5.map(() => '36px').join(' '), groups: this.grpHdr(shd.mode, c5), heads: c5.map(c => c.short),
        rows: pl2.slice(0, 8).map((j, i) => ({ no: i + 1, name: j.name, cells: c5.map(c => cv(this.cellOf(shd.mode, c, j))) })), hasMore: pl2.length > 8, more: pl2.length - 8, hasExtra: cols2.length > 5, extra: cols2.length - 5 }; }
    pr = { hasMore: false, more: 0, hasExtra: false, extra: 0, ...pr, ppih: PPN };
    const cirDash = (p, c) => (Math.min(100, p) * c / 100).toFixed(1) + ' ' + c;
    const remain = this.jm.filter(j => this.tgt(S.mode, ci, j, D) && !sat(ci, j)).length;
    const toCk = (rite, scope, r, g) => () => this.setState(s => ({ tab: 'checklist', ckPilih: false, ck: { ...s.ck, rite, scope, r: r || s.ck.r, g: g || s.ck.g } }));
    const rgCol = p => p < 70 ? 'var(--red-600)' : 'var(--color-accent)', rgFg = p => p < 70 ? 'var(--red-700)' : 'var(--color-accent-800)';
    const rg = RS.rombs.map(o => ({ l: 'R' + o.r, name: 'Rombongan ' + o.r, sub: 'Ketua ' + o.ketua, dn: o.d + '/' + o.n, soft: o.pct < 70 ? 'var(--red-100)' : 'var(--color-accent-100)', pct: o.pct + '%', col: rgCol(o.pct), fg: rgFg(o.pct), dash: cirDash(o.pct, 144.5), aria: 'Rombongan ' + o.r + ' ' + o.pct + ' persen', on: toCk(ci, 'rombongan', o.r) }));
    const jrSt = (() => { if (S.mode === 'madinah') return null; const idx = re => X.rites.map((r, k) => re.test(r.n) ? k : -1).filter(k => k >= 0), span = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, i) => a + i);
      let st; if (S.mode === 'haji') { const f = n => X.rites.findIndex(r => r.n === n), w = f('Wukuf di Arafah'), mu = f('Murur Mabit'), a = f('Jumroh Aqobah'), t = f('Thawaf Ifadzoh');
        st = [['Mina 8', span(0, w)], ['Arafah 9', span(w, mu)], ['Muzdalifah', span(mu, a)], ['Mina 10–13', span(a, t)], ['Makkah', span(t, nR)]]; }
      else st = [['Miqat', idx(/^(Niat|Ihram) Umrah$|^Miqat$/)], ['Thawaf', idx(/^Thawaf/)], ["Sa'i", idx(/^Sa'i/)], ['Tahallul', idx(/^Tahallul/)]];
      return st.filter(s => s[1].length); })();
    const jr = (() => { if (!jrSt) return {}; const n = jrSt.length, pts = jrSt.map(([l, ks], i) => { const x = n > 1 ? 12 + i * 76 / (n - 1) : 50, y = i % 2 ? 76 : 22, done = ks.every(k => k < ci), cur = ks.some(k => k === ci) || (!done && ks[0] < ci);
        return { x, y, l, done, cur: cur && !done, left: x + '%', top: y + 'px', bg: done ? 'var(--color-accent)' : cur ? '#E3A21A' : 'var(--color-neutral-200)', ring: done ? 'none' : cur ? '0 0 0 5px #f6dfa6' : 'inset 0 0 0 2px var(--color-neutral-400)', fw: cur ? 800 : 600, fg: done ? 'var(--color-accent-800)' : cur ? 'var(--color-text)' : 'var(--color-neutral-700)' }; });
      let d = 'M' + pts[0].x + ' ' + (pts[0].y + 14); for (let i = 1; i < n; i++) { const a = pts[i - 1], b = pts[i], mx = (a.x + b.x) / 2; d += ' C' + mx + ' ' + (a.y + 14) + ' ' + mx + ' ' + (b.y + 14) + ' ' + b.x + ' ' + (b.y + 14); }
      const now = pts.find(p => p.cur); return { title: S.mode === 'haji' ? 'Perjalanan haji' : 'Perjalanan umrah', d, stops: pts, now: now ? 'Sekarang · ' + now.l : '' }; })();
    const khCnt = (() => { const base = this.jm.filter(j => this.isKh(j)); return { base, semua: base.length, risti: base.filter(j => j.risti).length, lansia: base.filter(j => this.khOf(j.id).lansia).length, kroda: base.filter(j => this.khOf(j.id).kroda).length, tanpa: base.filter(j => !this.pendKey(j.id)).length }; })();
    const khSum = { txt: khCnt.risti + ' risti · ' + khCnt.lansia + ' lansia · ' + khCnt.kroda + ' kursi roda', tanpa: khCnt.tanpa ? khCnt.tanpa + ' jamaah belum punya pendamping' : 'Semua sudah punya pendamping', tanpaFg: khCnt.tanpa ? 'var(--red-700)' : 'var(--color-accent-700)', n: khCnt.semua, on: go('jamaah', { jl: { ...S.jl, v: 'kh', kf: 'semua' } }) };
    const jkV = (() => { const J = S.jl, q = (J.q || '').trim().toLowerCase(), f = J.kf || 'semua';
      const F = { semua: () => true, risti: j => j.risti, lansia: j => this.khOf(j.id).lansia, kroda: j => this.khOf(j.id).kroda, tanpa: j => !this.pendKey(j.id) };
      const l = khCnt.base.filter(F[f] || F.semua).filter(j => !q || j.name.toLowerCase().includes(q) || j.porsi.includes(q) || this.pendDesc(j.id).toLowerCase().includes(q));
      const gm = {}; l.forEach(j => { const key = j.r + '|' + j.g; (gm[key] = gm[key] || []).push(j); });
      const groups = Object.keys(gm).sort((a, b) => { const [ar, ag] = a.split('|').map(Number), [br, bg] = b.split('|').map(Number); return ar - br || ag - bg; }).map(key => { const [r, g] = key.split('|').map(Number), js = gm[key];
        return { title: 'Rombongan ' + r + ' · Regu ' + g, sub: 'Ketua regu: ' + this.ketuaG(r, g).name, n: js.length + ' jamaah', rows: js.map(j => { const k = this.khOf(j.id), pk = this.pendKey(j.id);
          const tags = [j.risti ? { t: 'Risti', bg: 'var(--red-100)', fg: 'var(--red-700)' } : null, k.lansia ? { t: 'Lansia', bg: '#FFF1DB', fg: '#8a5200' } : null, k.kroda ? { t: 'Kursi roda', bg: 'var(--color-accent-2-100)', fg: 'var(--color-accent-2-700)' } : null].filter(Boolean);
          return { name: j.name, ini: j.ini, avBg: j.risti ? 'var(--red-100)' : k.kroda ? 'var(--color-accent-2-100)' : '#FFF1DB', avFg: j.risti ? 'var(--red-700)' : k.kroda ? 'var(--color-accent-2-700)' : '#C77700', tags, pend: pk ? 'Pendamping: ' + this.pendDesc(j.id) : 'Belum ada pendamping · ketuk untuk memilih', pendFg: pk ? 'var(--color-neutral-800)' : 'var(--red-700)', pendIni: pk ? (this.pelName(pk).split(/\s+/).slice(0, 2).map(w => w[0] || '').join('')) : '!', pendBg: pk ? 'var(--color-accent-100)' : 'var(--red-100)', pendIc: pk ? 'var(--color-accent)' : 'var(--red-700)', on: () => this.setState({ sel: j.id }) }; }) }; });
      return { isAll: J.v !== 'kh', isKh: J.v === 'kh', groups, empty: !l.length, segs: [['semua', 'Semua jamaah'], ['kh', 'Jamaah khusus · ' + khCnt.semua]].map(([v, lb]) => ({ l: lb, on: () => this.patch('jl', { v }), ...pill((J.v || 'semua') === v) })),
        chips: [['semua', 'Semua'], ['risti', 'Risti'], ['lansia', 'Lansia'], ['kroda', 'Kursi roda'], ['tanpa', 'Tanpa pendamping']].map(([k, lb]) => { const a = f === k; return { l: lb, n: khCnt[k], on: () => this.patch('jl', { kf: k }), bg: a ? 'var(--color-accent-100)' : 'var(--color-surface)', fg: a ? 'var(--color-accent-800)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)' }; }) }; })();
    const skV = (() => { if (S.sel == null || !this.jm[S.sel]) return {}; const j = this.jm[S.sel], k = this.khOf(j.id), pk = this.pendKey(j.id), bk = this.pelbKey(j.id);
      const tg = (l, a, on) => ({ l, on, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? '#fff' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', mark: a ? '✓ ' : '' });
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
      const dayCell = (j, b) => { const na = this.naLock('haji', b.k, j, Dh), d = Dh[b.k][j.id], cur = b.d === day; return { l: b.d + (na ? ' NA' : d ? ' ✓' : cur ? ' •' : ''), bg: na ? 'var(--color-neutral-100)' : d ? 'var(--color-accent)' : cur ? '#FFF1DB' : 'var(--color-neutral-100)', fg: na ? 'var(--color-neutral-600)' : d ? '#fff' : cur ? '#C77700' : 'var(--color-neutral-600)', on: () => this.badalToggle(j, b.k) }; };
      const rows = list.map(j => { const pk = this.pelOfB(j, bk); return { ini: j.ini, name: j.name, tag: S.udz[j.id] ? 'Udzur' : 'Ditambahkan', tagBg: S.udz[j.id] ? 'var(--red-100)' : 'var(--color-accent-2-100)', tagFg: S.udz[j.id] ? 'var(--red-700)' : 'var(--color-accent-2-700)',
        sub: `R${j.r}·${j.g} · ` + (pk ? 'oleh ' + this.pelText(pk) : 'Belum ada pelaksana · ketuk untuk memilih'), subFg: pk ? 'var(--color-neutral-700)' : 'var(--red-700)', days: BR.map(b => dayCell(j, b)), on: () => this.setState({ pp: { kind: 'pelb', id: j.id, q: '', sel: this.pelbKey(j.id), src: 'jamaah' } }) }; });
      const gm = {}; list.forEach(j => { const p = this.pelOfB(j, bk) || '_'; (gm[p] = gm[p] || []).push(j); });
      const groups = Object.keys(gm).sort((a, b) => (a === '_') - (b === '_') || gm[b].length - gm[a].length).map(p => ({ name: p === '_' ? 'Belum ada pelaksana' : this.pelName(p), role: p === '_' ? 'Tentukan pelaksana untuk jamaah berikut' : (this.pelRole(p) + (p[0] === 'j' ? ' · melontar untuk diri sendiri + ' + gm[p].length + ' jamaah' : ' · membadali ' + gm[p].length + ' jamaah')), n: gm[p].length, ini: p === '_' ? '!' : this.pelName(p).split(/\s+/).slice(0, 2).map(w => w[0] || '').join(''), icBg: p === '_' ? 'var(--red-100)' : 'var(--color-accent-100)', icFg: p === '_' ? 'var(--red-700)' : 'var(--color-accent)',
        items: gm[p].map(j => { const na = this.naLock('haji', bk, j, Dh), d = Dh[bk][j.id]; return { name: j.name, sub: `R${j.r}·${j.g}`, st: na ? 'NA' : d ? day + ' ✓' : day + ' belum', stFg: na ? 'var(--color-neutral-600)' : d ? 'var(--color-accent)' : '#C77700', on: () => this.badalToggle(j, bk) }; }) }));
      return { notHaji: S.mode !== 'haji', isJ: S.mode === 'haji' && st.v !== 'pel', isP: S.mode === 'haji' && st.v === 'pel', q: st.q || '', onQ: e => this.patch('bd', { q: e.target.value }),
        segs: [['jamaah', 'Per jamaah'], ['pel', 'Per pelaksana']].map(([v, l]) => ({ l, on: () => this.patch('bd', { v }), ...pill((st.v || 'jamaah') === v) })),
        days: BR.map(b => ({ l: b.d + ' Dzh', on: () => this.patch('bd', { day: b.d }), ...pill(b.d === day) })), dayLbl: day + ' Dzulhijjah' + (b => b && b.k === bk ? '' : '')(curB), isNow: day === curB.d,
        done: doneN, tot: act.length, pct: (act.length ? Math.round(doneN / act.length * 100) : 100) + '%', n: all.length, rows, empty: !rows.length, groups,
        fab: ready.length ? `Centang badal ${day} Dzh · ${ready.length} jamaah` : todo.length ? `${todo.length} jamaah belum punya pelaksana` : `Badal ${day} Dzh sudah lengkap`, fabBg: ready.length ? 'var(--color-accent-2-700)' : 'var(--color-neutral-300)',
        onFab: () => { if (!ready.length) { if (todo.length) this.flash('Pilih pelaksana dulu untuk ' + todo.length + ' jamaah'); return; } const n = this.badalCommit(bk, ready); this.flash(n + ' jamaah dibadalkan · ' + day + ' Dzh'); },
        onAdd: () => this.setState({ pp: { kind: 'addb', q: '', sel: null, src: 'jamaah' } }), toHaji: () => { const c = this.data.haji.cur; this.saveCfg({ mode: 'haji' }); this.setState(s => ({ mode: 'haji', ck: { ...s.ck, rite: c }, pr: { ...s.pr, rites: [c] } })); } }; })();
    const pelFirst = j => { const mm = S.badal[S.mode] || {}; for (const kk in mm) if (mm[kk][j.id]) return this.pelName(mm[kk][j.id]); return ''; };
    const rkp = { n: X.rites[ci].n, sub: X.rites[ci].day + ' · ' + this.klLabel(), done: RS.done, tot: RS.tot, pct: RS.pct + '%', complete: RS.complete,
      segs: [[RS.tepat, '#1e6b52'], [RS.sus, '#c98a00'], [RS.badal, 'var(--color-accent-2-700)'], [RS.ulangP, '#d9822b'], [RS.belum, 'var(--color-neutral-300)'], [RS.udzB, '#c0392b']].filter(x => x[0] > 0).map(([n, c]) => ({ w: (n / RS.tot * 100) + '%', c })),
      legend: [['Tepat waktu', RS.tepat, 'var(--color-accent)'], ['Susulan', RS.sus, '#C77700'], ['Dibadalkan', RS.badal, 'var(--color-accent-2-700)'], ['Perlu ulang', RS.ulangP, '#E07B2E'], ['Udzur belum dibadalkan', RS.udzB, '#C2372B'], ['Belum', RS.belum, 'var(--color-neutral-300)']].filter(x => x[0] === 'Belum' || x[1] > 0).map(([l, n, c]) => ({ l, n, c })),
      bars: [...RS.rombs].sort((a, b) => a.r - b.r).map(o => ({ l: 'R' + o.r, t: o.pct + '%', h: Math.max(3, Math.round(o.pct * 1.2)) + 'px', c: o.pct < 70 ? '#C2372B' : 'var(--color-accent)', fg: o.pct < 70 ? 'var(--red-700)' : 'var(--color-accent-800)', aria: 'Rombongan ' + o.r + ' ' + o.pct + ' persen', on: toCk(ci, 'rombongan', o.r) })),
      cg: (() => { const parts = [[RS.tepat, 'var(--color-accent)'], [RS.sus, '#C77700'], [RS.badal, 'var(--color-accent-2-700)'], [RS.ulangP, '#E07B2E'], [RS.udzB, '#C2372B'], [RS.belum, 'var(--color-neutral-300)']].filter(x => x[0] > 0); let a = 0; const tot = Math.max(1, RS.tot); return parts.length ? parts.map(([n, c]) => { const s = a; a += n / tot * 100; return c + ' ' + s.toFixed(2) + '% ' + a.toFixed(2) + '%'; }).join(', ') : '#DCE3DF 0% 100%'; })(),
      rombs: RS.rombs.map(o => ({ l: 'Rombongan ' + o.r, ketua: o.ketua, txt: o.d + '/' + o.n + ' · ' + o.pct + '%', pct: o.pct + '%', col: rgCol(o.pct), fg: rgFg(o.pct), on: toCk(ci, 'rombongan', o.r) })),
      att: RS.att.slice(0, 8).map(a => { const sus = a.t !== 'Tertinggal'; return { name: a.j.name, ini: a.j.ini, sub: `R${a.j.r} · Regu ${a.j.g} · ` + X.rites[a.k].p, tag: a.t, tagBg: sus ? '#fdf0c4' : 'var(--red-100)', tagFg: sus ? '#5a3f00' : 'var(--red-700)', on: toCk(a.k, 'regu', a.j.r, a.j.g) }; }),
      attEmpty: RS.att.length === 0, attMore: RS.att.length > 8, attMoreTxt: '+' + (RS.att.length - 8) + ' lainnya · lihat di tab Jamaah', attSub: (RS.puN ? RS.puN + ' perlu ulang · ' : '') + RS.tertN + ' tertinggal · ' + RS.susN + ' susulan',
      hasPil: RS.multi, pilTxt: Object.entries(RS.pil).map(([p, n]) => p + ' ' + n).join(' · ') + (RS.multi ? ' · dipilih salah satu per jamaah' : ''),
      hasUmr: !!RS.umr, umr: RS.umr ? [['Sempurna', RS.umr.semp, 'var(--color-accent-100)', 'var(--color-accent-800)'], ['Diulang (selesai)', RS.umr.diul, '#fdf0c4', '#5a3f00'], ['Perlu ulang', RS.umr.perlu, '#fde2d3', '#8a3b12']].map(([l, n, bg, fg]) => ({ l, n, bg, fg })) : [],
      hasBl: RS.bl.length > 0 || RS.blWarn > 0, blSub: RS.bl.length + ' jamaah dibadalkan · jamaah → pelaksana', hasBlWarn: RS.blWarn > 0, blWarn: RS.blWarn + ' data badal belum memiliki pelaksana. Buka checklist badal dan ketuk nama jamaah untuk melengkapi.',
      bl: RS.bl.slice(0, 12).map(x => ({ name: x.j.name, pel: x.key ? this.pelText(x.key) : 'pelaksana belum dicatat', sub: X.rites[x.k].n + ' · R' + x.j.r + '/Regu ' + x.j.g, fg: x.key ? 'var(--color-neutral-700)' : 'var(--red-700)', on: toCk(x.k, 'regu', x.j.r, x.j.g) })),
      blMore: RS.bl.length > 12, blMoreTxt: '+' + (RS.bl.length - 12) + ' lainnya · lihat lembar cetak' };
    const susSheet = (() => { const d = S.susDlg; if (!d) return {}; const R = X.rites[d.rite], today = this.todayKey();
      const addD = (iso, n) => { const t = new Date(iso + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
      const a = parseInt(X.rites[ci].day), b = parseInt(R.day), off = isNaN(a) || isNaN(b) ? 0 : Math.max(0, a - b), base = R.tgl && R.tgl <= today ? R.tgl : addD(today, -off);
      const cand = [[base, 'Hari jadwal'], [addD(base, 1), '+1 hari'], [addD(base, 2), '+2 hari']].filter(([t], i, arr) => t <= today && arr.findIndex(x => x[0] === t) === i);
      if (!cand.some(x => x[0] === today)) cand.push([today, 'Hari ini']);
      const opts = cand.map(([t, l]) => { const on = d.tgl === t && !d.other; return { l: l + ' · ' + this.fmtTgl(t), bg: on ? '#fdf0c4' : 'var(--color-surface)', fg: on ? '#5a3f00' : 'var(--color-text)', ring: on ? '#c98a00' : 'var(--color-divider)', on: () => this.setState(st => ({ susDlg: { ...st.susDlg, tgl: t, other: false } })) }; });
      opts.push({ l: 'Pilih lainnya', bg: d.other ? '#fdf0c4' : 'var(--color-surface)', fg: d.other ? '#5a3f00' : 'var(--color-text)', ring: d.other ? '#c98a00' : 'var(--color-divider)', on: () => this.setState(st => ({ susDlg: { ...st.susDlg, other: true } })) });
      const n = d.ids.length, j0 = n ? this.jm[d.ids[0]] : null, pq = (d.pq || '').trim().toLowerCase(), pick = key => () => this.setState(st => ({ susDlg: { ...st.susDlg, pend: key, pq: '' } }));
      const pOpts = !R.pend || d.pend ? [] : (pq ? this.petugas.filter(p => p.name.toLowerCase().includes(pq)).map(p => ({ key: p.key, name: p.name, sub: p.role + ' · Petugas' })).concat(this.jm.filter(j => j.name.toLowerCase().includes(pq) || j.porsi.includes(pq)).slice(0, 8).map(j => ({ key: 'j' + j.id, name: j.name, sub: 'Jamaah R' + j.r + ' · Regu ' + j.g }))).concat([{ key: 'x:' + d.pq.trim(), name: d.pq.trim(), sub: 'Nama lain · ketik manual' }])
        : this.petugas.map(p => ({ key: p.key, name: p.name, sub: p.role + ' · Petugas' }))).map(o => ({ ...o, on: pick(o.key) }));
      const candL = (d.cand || []).map(id => { const j = this.jm[id], a = d.ids.includes(id); return { name: j.name, sub: `R${j.r} · Regu ${j.g}`, mark: a ? '✓' : '', bg: a ? '#c98a00' : 'transparent', ring: a ? '#c98a00' : 'var(--color-neutral-400)', on: () => this.setState(st => ({ susDlg: { ...st.susDlg, ids: a ? st.susDlg.ids.filter(x => x !== id) : [...st.susDlg.ids, id] } })) }; });
      const t1 = d.tgl || today, prev = d.ulang ? 'Ulang ke-' + d.ulang + ' · ' + this.fmtTgl(t1) : this.autoSus(R, t1, true, d.x) ? 'Susulan · ' + this.fmtH(t1) + ' (' + this.fmtTgl(t1) + ')' : 'tepat waktu · ' + this.fmtTgl(t1) + ' (sesuai jadwal)';
      return { n, rite: R.n, title: (d.ulang ? 'Catat ulang ' : d.group ? 'Catat susulan berkelompok · ' : 'Catat susulan ') + R.n, hasCand: !!d.cand, cand: candL, candN: n + ' dari ' + (d.cand || []).length + ' dipilih', hasWho: !d.cand,
        who: n === 1 ? j0.name : n + ' jamaah', whoSub: n === 1 ? `R${j0.r} · Regu ${j0.g} · Porsi ${j0.porsi}` : this.scopeLabel(S.ck), hari: R.day + (R.place ? ' · ' + R.place : ''), opts, other: !!d.other, tgl: t1, max: today, jam: d.jam || '', ket: d.ket || '',
        prev: prev + (d.pend ? ' · didampingi ' + this.pelName(d.pend) : ''), needPend: !!R.pend, hasPend: !!d.pend, noPend: !d.pend, pendName: d.pend ? this.pelName(d.pend) + ' · ' + this.pelRole(d.pend) : '', pq: d.pq || '', pOpts,
        clearPend: () => this.setState(st => ({ susDlg: { ...st.susDlg, pend: '' } })), noSave: !n || (R.pend && !d.pend), cta: d.ulang ? 'Simpan ulang' : (this.autoSus(R, t1, true, d.x) ? 'Simpan susulan' : 'Simpan') + (n > 1 ? ' · ' + n + ' jamaah' : '') }; })();
    const amb = a => ({ bg: a ? '#fdf0c4' : 'var(--color-surface)', fg: a ? '#5a3f00' : 'var(--color-text)', ring: a ? '#c98a00' : 'var(--color-divider)' });
    const sfd = S.safDlg, sf = sfd ? (() => { const n = sfd.ids.length, j0 = this.jm[sfd.ids[0]]; return { who: n === 1 ? j0.name : n + ' jamaah', cat: sfd.cat, catReq: sfd.why === 'Lainnya' ? 'Catatan (wajib)' : 'Catatan (opsional)', noSave: !sfd.why || (sfd.why === 'Lainnya' && !sfd.cat.trim()),
      whys: ['Dirawat di KKHI/RS', 'Lansia/Risti', 'Kursi roda', 'Lainnya'].map(l => { const a = sfd.why === l; return { l, bg: a ? 'var(--color-accent-2-100)' : 'var(--color-surface)', fg: a ? 'var(--color-accent-2-700)' : 'var(--color-text)', ring: a ? 'var(--color-accent-2)' : 'var(--color-divider)', on: () => this.patch('safDlg', { why: l }) }; }) }; })() : {};
    const uld = S.ulDlg, ul = uld ? (() => { const j = this.jm[uld.id]; return { who: j.name + ' · R' + j.r + ' · Regu ' + j.g, cat: uld.cat, rencana: uld.rencana, min: this.todayKey(), catReq: uld.why === 'Lainnya' ? 'Catatan (wajib)' : 'Catatan (opsional)', noSave: !uld.tahap || !uld.why || (uld.why === 'Lainnya' && !uld.cat.trim()),
      tahaps: ['Thawaf', "Sa'i", 'Tahallul', 'Seluruh rangkaian'].map(l => ({ l, ...amb(uld.tahap === l), on: () => this.patch('ulDlg', { tahap: l }) })),
      whys: ['Kurang putaran', 'Batal wudhu', 'Salah urutan', "Tidak di area Mas'a", 'Lainnya'].map(l => ({ l, ...amb(uld.why === l), on: () => this.patch('ulDlg', { why: l }) })) }; })() : {};
    const cs = isMad && ck.slot != null ? this.jadwal[ck.slot] : null, mdDaysL = [...new Set(this.jadwal.map(x => x.tgl))];
    const mdT = cs ? cs.tgl : mdDaysL.includes(ck.mdTgl) ? ck.mdTgl : mdDaysL[0], mdS = cs && cs.sex ? cs.sex : (ck.mdSex || 'L');
    const mdDays = mdDaysL.map(t => { const a = t === mdT; return { l: t, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? '#fff' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('ck', { mdTgl: t, slot: null }) }; });
    const mdSexBtns = [['L', 'Laki-laki'], ['P', 'Perempuan']].map(([k, l]) => ({ l, ...pill(mdS === k), on: () => this.patch('ck', { mdSex: k, slot: null }) }));
    const mdJams = isMad ? this.jadwal.map((x, i) => ({ x, i })).filter(o => o.x.tgl === mdT && (!o.x.sex || o.x.sex === mdS)).map(({ x, i }) => { const l = this.jm.filter(j => this.inSlot(j, x) && !S.udz[j.id]), d = l.filter(j => MD[j.id]).length, a = ck.slot === i;
      return { l: x.jam, sub: x.romb.length ? 'R' + x.romb.join(', R') : 'Semua rombongan', cnt: d + '/' + l.length, rw: a ? '2.5px' : '1.5px', bg: a ? 'var(--color-accent-100)' : 'var(--color-surface)', fg: 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => this.patch('ck', { slot: a ? null : i, scope: 'kloter', mdTgl: x.tgl, mdSex: x.sex || mdS }) }; }) : [];
    const sdl = S.slotDlg, updSd = p => this.setState(st => ({ slotDlg: { ...st.slotDlg, ...p } }));
    const sd = sdl ? { tgl: sdl.tgl, a: sdl.a, b: sdl.b, ket: sdl.ket, noSave: !(sdl.tgl && sdl.a && sdl.b && sdl.romb.length),
      sexBtns: [['L', 'Laki-laki'], ['P', 'Perempuan']].map(([k, l]) => ({ l, ...pill(sdl.sex === k), on: () => updSd({ sex: k }) })),
      rs: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(r => { const a = sdl.romb.includes(r); return { l: 'R' + r, bg: a ? 'var(--color-accent)' : 'var(--color-surface)', fg: a ? '#fff' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : 'var(--color-divider)', on: () => updSd({ romb: a ? sdl.romb.filter(x => x !== r) : [...sdl.romb, r].sort((x, y) => x - y) }) }; }),
      prev: 'Akan tersimpan: ' + (this.fmtTgl(sdl.tgl) || '—') + ' · ' + (sdl.a && sdl.b ? sdl.a.replace(':', '.') + '–' + sdl.b.replace(':', '.') : 'jam belum diisi') + ' · ' + (sdl.sex === 'P' ? 'Perempuan' : 'Laki-laki') + ' · ' + (sdl.romb.length ? 'R' + sdl.romb.join(', R') : 'pilih rombongan') } : {};
    const LOGO = this;
    const allSel = ks.length === nR;
    return {
      isBeranda: S.tab === 'beranda', isJamaah: S.tab === 'jamaah', isChecklist: S.tab === 'checklist', isCetak: S.tab === 'cetak',
      scrollRef: this.scrollRef, kloterLabel: this.klLabel(), d: { ...X, day: X.rites[ci].day, kicker: X.kicker.replace('Kloter {K}', this.klLabel())  },
      outerPad: full ? '0' : '32px 24px', fW: full ? '100%' : '390px', fH: full ? '100dvh' : '844px', fR: full ? '0' : '48px', fB: full ? '0' : '8px solid #2e2b25', fS: full ? 'none' : 'var(--shadow-lg)',
      rk: (() => { const due = this.rekapDue(), hr = this.remindHour();
        return { due, bg: due ? 'var(--red-100)' : 'var(--color-surface)', ring: due ? '2px var(--red-500)' : '0 transparent',
          sub: (this.cfg && this.cfg.lastRekap === this.todayKey()) ? 'Sudah dikirim hari ini · ' + X.rites[ci].n : 'Kegiatan: ' + X.rites[ci].day + ' · pengingat ' + hr + '.00 WAS',
          hours: [19, 20, 21, 22].map(x => ({ l: x + '.00', bg: hr === x ? 'var(--color-accent)' : 'var(--color-neutral-100)', fg: hr === x ? '#fff' : 'var(--color-text)', on: () => { this.saveCfg({ remindHour: x }); this.forceUpdate(); } })),
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
      kirim: S.tab === 'kirim' ? { kloter: String(this.klLabel()).replace(/^Kloter\s*/i, ''), petugas: this.ppih(), rombongan: [...new Set(this.jm.map(j => j.r))].filter(Boolean).sort((a, b) => a - b).map(r => ({ r })),
        kegiatan: Object.keys(this.data).flatMap(m => this.data[m].rites.map(r => ({ mode: this.modeLabel(m), n: r.n, p: r.p, tgl: r.tgl || '', jam: r.jam || '', place: r.place || '' }))) } : null, bisaKembali: S.tab !== 'beranda', kembali: () => this.kembali(),
      selData: S.sel != null && this.jm[S.sel] ? (() => { const j = this.jm[S.sel], raw = (this.raw || {})[j.porsi] || {}, u = this.umur(raw['Tanggal Lahir']);
        return { porsi: j.porsi, kunci: j.porsi + '|' + Object.values(dariKolom(raw)).join('|'), nilai: dariKolom(raw), umur: u, lansia: u >= 65, berangkat: this._berangkat,
          simpan: nilai => this.simpanDataJamaah(j.porsi, nilai) }; })() : null,
      tglBerangkat: this._berangkat || (this.aturSheet()['Tanggal Berangkat'] || ''), setTglBerangkat: v => this.setTglBerangkat(v),
      excel: { jamaah: () => this.jm.map(j => ({ ...j, raw: (this.raw || {})[j.porsi] || {}, umur: this.umur(((this.raw || {})[j.porsi] || {})['Tanggal Lahir']) })),
        status: () => this.statusExcel(), kloter: this.klLabel(), bisaUnggah: this.pakaiAkun(), porsiAda: () => new Set(this.jm.map(j => j.porsi)),
        sesudahUnggah: () => this.syncNow() },
      hasSel: S.sel != null, sel, onNote: e => { const v = e.target.value, id = S.sel; this.setState(s => ({ notes: { ...s.notes, [id]: v } })); this.push([{ jenis: 'jamaah', porsi: this.jm[id].porsi, catatan: v }]); }, hasPelNote: !!sel.pelNote, closeSel: () => this.setState({ sel: null }), stop: e => e.stopPropagation(),
      ckDays: days.map((day, di) => { const sel = X.rites[ck.rite].day === day, td = day === X.rites[ci].day, fut = di > days.indexOf(X.rites[ci].day); return { l: day.replace(' Dzulhijjah', ' Dzh').replace(' Dzulqa’dah', ' Dzq'), today: td ? 'y' : '', dot: 'none', dotBg: 'transparent', rw: sel ? '3px' : '1.5px', bg: td ? 'var(--color-accent)' : fut ? 'var(--color-neutral-100)' : 'var(--color-surface)', fg: td ? '#fff' : fut ? 'var(--color-neutral-700)' : 'var(--color-text)', ring: sel ? (td ? 'var(--color-accent-800)' : 'var(--color-accent-2)') : fut ? 'var(--color-neutral-300)' : 'var(--color-divider)', on: () => this.patch('ck', { rite: X.rites.findIndex(r => r.day === day) }) }; }),
      ckPills: X.rites.map((r, i) => ({ r, i })).filter(o => o.r.day === X.rites[ck.rite].day).map(({ r, i }) => { const a = ck.rite === i;
        const lk = i > ci; return { l: r.p, locked: lk, now: i === ci, done: i < ci, on: () => this.patch('ck', { rite: i }), bg: a ? 'var(--color-accent)' : lk ? 'var(--color-neutral-100)' : 'transparent', fg: a ? '#fff' : lk ? 'var(--color-neutral-700)' : 'var(--color-text)', ring: a ? 'var(--color-accent)' : lk ? 'var(--color-neutral-300)' : 'var(--color-divider)' }; }),
      ckScopes: scopes(ck, 'ck'), ckRs: rombPills, ckGs: gs(ck, 'ck'), ckShowR: ck.scope !== 'kloter', ckShowG: ck.scope === 'regu', ckRows, ckSum,
      ckEmpty: ckRows.length + ckPeople.length === 0, ckHasRows: ckRows.length > 0, ckPeople, ckHasPeople: ckPeople.length > 0, hasPel: pelGroups.length > 0, pelGroups,
      hasPicker: !!S.picker, pk, closePicker: () => this.setState({ picker: null }), applyPicker: () => this.applyPicker(),
      hasSus: !!S.susDlg, susDate: e => { const v = e.target.value; this.setState(st => ({ susDlg: st.susDlg && { ...st.susDlg, tgl: v } })); }, closeSus: () => this.setState({ susDlg: null }), confirmSus: () => this.confirmSus(),
      hasConfirm: !!S.confirm, confirm: S.confirm || {}, closeConfirm: () => this.setState({ confirm: null }), applyConfirm: () => this.apply(S.confirm),
      prScopes: scopes(P, 'pr'), prRs: rs(P, 'pr'), prGs: gs(P, 'pr'), prShowR: P.scope !== 'kloter', prShowG: P.scope === 'regu',
      prGroups: this.group(X.rites.map((r, k) => { const a = ks.includes(k), l = r.p;
        return { l, day: r.day, bg: a ? 'var(--color-accent-2-100)' : 'transparent', fg: a ? 'var(--color-accent-2-800)' : 'var(--color-neutral-700)', ring: a ? 'var(--color-accent-2-400)' : 'var(--color-divider)',
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
        if (!this.live()) return { text: 'Data contoh', dot: 'var(--color-neutral-700)', bg: 'var(--color-neutral-200)', fg: 'var(--color-neutral-900)' };
        if (S.sync.err) return { text: 'Gagal sinkron' + (n ? ' · ' + n + ' menunggu sinkron' : ''), dot: 'var(--red-600)', bg: 'var(--red-100)', fg: 'var(--red-800)' };
        if (n) return { text: n + ' menunggu sinkron' + (off ? ' · offline' : ''), dot: '#c98a00', bg: '#fdf0c4', fg: '#5a3f00' };
        if (off) return { text: 'Offline · tersimpan di perangkat', dot: '#c98a00', bg: '#fdf0c4', fg: '#5a3f00' };
        return { text: 'Tersinkron · ' + S.sync.last, dot: 'var(--color-accent)', bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)' }; })(),
      net: (() => { const n = S.sync.pending; if (!this.live()) return null;
        if (S.sync.err && !off) return { title: 'Gagal mengirim · ' + n + ' perubahan aman di HP', text: 'Akan dicoba lagi otomatis. Ketuk untuk detail atau kirim sekarang.', dot: 'var(--red-600)', bg: 'var(--red-100)', fg: 'var(--red-800)' };
        if (off) return { title: 'Tanpa internet · aplikasi tetap bisa dipakai', text: n ? n + ' perubahan tersimpan di HP ini dan terkirim otomatis saat ada sinyal.' : 'Centang tetap tersimpan di HP ini dan terkirim otomatis saat ada sinyal.', dot: '#c98a00', bg: '#fdf0c4', fg: '#5a3f00' };
        if (S.fotoErr && !n) return { title: 'Foto belum terunggah', text: S.fotoErr + ' · Foto aman di HP dan dicoba lagi saat sinkron.', dot: '#c98a00', bg: '#fdf0c4', fg: '#5a3f00' };
        if (n) return { title: 'Mengirim ' + n + ' perubahan…', text: 'Jangan tutup aplikasi sampai angka antre menjadi 0.', dot: 'var(--color-accent-300)', bg: 'var(--color-accent-100)', fg: 'var(--color-accent-800)' };
        return null; })(),
      tglJadwal, tgJ, openTgl: () => this.setState({ tglOpen: true }),
      fotoInput: this.fotoInput, onFotoFile: e => this.pilihFoto(e), ambilFoto: () => this.fotoInput.current && this.fotoInput.current.click(),
      fotoCard: (() => { const n = this.fotoList.length, a = this.fotoList.filter(f => f.status === 'antre').length;
        return { judul: n ? n + ' foto di HP ini' : 'Belum ada foto', sub: a ? a + ' menunggu diunggah ke ' + this.tempatFoto() + (off ? ' · saat ada internet' : this._fotoBusy ? ' · mengunggah…' : '') : n ? (this.live() ? 'Semua sudah di ' + this.tempatFoto() : 'Mode contoh · tidak diunggah') : 'Foto tersimpan di HP dulu, lalu otomatis ke ' + this.tempatFoto(),
          err: S.fotoErr || '', adaFoto: n > 0 }; })(),
      bukaGaleri: () => this.setState({ galeri: true }),
      galeri: S.galeri ? { tutup: () => this.setState({ galeri: false }), kosong: !this.fotoList.length, unggah: () => this.unggahAntre(), adaAntre: this.fotoList.some(f => f.status === 'antre'),
        items: this.fotoList.slice(0, 80).map(f => ({ src: this._thumbs[f.id] || '', judul: f.kegiatan + ' · ' + this.fmtHari(f.tanggal), sub: [f.cakupan, f.keterangan].filter(Boolean).join(' · '),
          st: f.status === 'terkirim' ? 'Di ' + this.tempatFoto() : f.status === 'lokal' ? 'Hanya di HP (mode contoh)' : 'Menunggu diunggah', stFg: f.status === 'terkirim' ? 'var(--color-accent-800)' : '#7a5200',
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
            return { l: m, bg: on ? 'var(--color-accent)' : 'var(--color-surface)', fg: on ? '#fff' : 'var(--color-neutral-800)', on: () => upd({ val: v }) }; }),
          val: d.val || '', onVal: e => upd({ val: e.target.value.slice(0, 60) }),
          note: d.scope === 'kloter' ? 'Semua jamaah memakai miqat ini; pengecualian per jamaah dihapus.' : jj ? '' : 'Berlaku untuk ' + target + ' jamaah di cakupan ini. Jamaah lain tetap.',
          simpan: () => this.setMiqat(d.scope, d.val, d), cta: 'Simpan miqat' + (jj ? '' : ' · ' + target + ' jamaah'), batal: () => this.setState({ mqDlg: null }) }; })() : null,
      canInstall: !!this._installEvt,
      doInstall: () => { const e = this._installEvt; if (!e) return; e.prompt(); (e.userChoice || Promise.resolve()).finally(() => { this._installEvt = null; this.forceUpdate(); }); },
      installHint: (() => { const sa = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone; if (sa) return '';
        return /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'Di iPhone: buka di Safari, ketuk Bagikan lalu “Tambah ke Layar Utama” agar data tidak terhapus otomatis.' : 'Pasang aplikasi ke layar utama HP agar bisa dibuka tanpa internet dan datanya lebih aman.'; })(),
      daysRef: this.daysRef, exportCsv: () => this.exportCsv(), bakSave: () => this.backupSave(), bakLoad: () => this.backupLoad(), exportWa: () => this.setState({ syncOpen: false, wa: true }),
      suTest: () => this.testConn(), suTestCta: S.su.testing ? 'Menguji…' : 'Tes koneksi', suHasOk: !!S.su.okMsg,
      syncLabel: !this.live() ? 'Mode contoh · belum terhubung' : S.sync.err ? 'Gagal sinkron · ketuk untuk detail' : S.sync.pending ? (off ? `${S.sync.pending} perubahan di perangkat · menunggu sinyal` : 'Mengirim ke ' + this.namaServer() + '…') : off ? 'Offline · data tersimpan di perangkat' : 'Tersinkron ke Google Sheet · ' + S.sync.last,
      syncDot: !this.live() ? 'var(--color-neutral-400)' : S.sync.err ? 'var(--red-600)' : S.sync.pending ? (off ? '#e0a100' : 'var(--color-accent-300)') : 'var(--color-accent)',
      openSync: () => this.setState({ syncOpen: true }), closeSync: () => this.setState({ syncOpen: false }), hasSync: !!S.syncOpen,
      syncNow: () => this.syncNow(), syncPending: S.sync.pending, syncLast: S.sync.last, syncOffline: off, hasSyncErr: !!S.sync.err, syncErr: S.sync.err || '',
      syncTag: this.live() ? 'Terhubung' : 'Mode contoh', ppihName: this.ppih(), logoSrc: this._logo || 'icon-192.png',
      pf: { title: !this.live() ? 'Mode contoh' : S.sync.err ? 'Gagal sinkron' : S.sync.pending ? (off ? 'Menunggu sinyal' : 'Mengirim…') : 'Tersinkron ✓', deg: (this.live() && !S.sync.pending && !S.sync.err ? 360 : Math.max(18, 360 - Math.min(342, S.sync.pending * 6))) + 'deg' }, syncTagCls: this.live() ? 'tag-accent-2' : 'tag-neutral',
      syncSource: this.live() ? (this.pakaiAkun() ? 'Akun · kloter ' + this.klLabel() + ' · ' : 'Sheet “Jamaah” · ') + (this.cfg.device || 'Perangkat') + ' · ' + this.petugas.length + ' petugas' : 'Data contoh · buka Pengaturan untuk menghubungkan Google Sheet',
      openSetup: () => this.setState(s => ({ setup: true, syncOpen: false, su: { ...s.su, err: '' } })), hasSetup: !!S.setup || (!!this.cfg && !S.locked && !this.idLengkap()), su: S.su,
      suUrl: e => this.patch('su', { url: e.target.value, err: '', okMsg: '' }), suKey: e => this.patch('su', { key: e.target.value, err: '', okMsg: '' }), suKloter: e => this.patch('su', { kloter: e.target.value }),
      suPin: e => this.patch('su', { pin: e.target.value.replace(/\D/g, '').slice(0, 4) }), suHasErr: !!S.su.err, suCta: S.su.busy ? 'Menghubungkan…' : this.live() && S.su.url.trim() === this.cfg.url && S.su.key.trim() === this.cfg.key ? 'Simpan' : S.su.url === SB_URL ? 'Mulai' : 'Hubungkan ke Google Sheet',
      idLine: [TUSI, this.klLabel(), this.cfg && this.cfg.embarkasi, this.cfg && this.cfg.gelombang ? 'Gelombang ' + this.cfg.gelombang : ''].filter(Boolean).join(' · '),
      suDevices: ['HP', 'Tablet'].map(l => ({ l, ...pill(S.su.device === l), on: () => this.patch('su', { device: l }) })),
      suConnect: () => this.connect(), suCanClose: this.idLengkap(), suClose: () => this.setState({ setup: false }),
      suDemo: () => { const k = kurangIdentitas(S.su); if (k.length) { this.patch('su', { err: pesanKurang(k) }); return; }
        this.saveCfg({ demo: true, ...this.identitas(S.su), device: S.su.device, pin: /^\d{4}$/.test(S.su.pin) ? S.su.pin : '1234' }); this.applyJadwal([]); this.setState({ setup: false, locked: false }); this.flash('Mode contoh · PIN ' + this.cfg.pin); },
      suEmbarkasi: e => this.patch('su', { embarkasi: e.target.value, err: '' }), embarkasiList: EMBARKASI,
      suLive: this.live(), suSb: S.su.url === SB_URL, suSheet: S.su.url !== SB_URL, pakaiAkun: this.pakaiAkun(), bukanAkun: !this.pakaiAkun(), suJam: S.su.jam ?? (this.live() ? (this.aturSheet()['Jam Pengingat'] || '21') : ''), suJamIn: e => this.patch('su', { jam: e.target.value.replace(/\D/g, '').slice(0, 2), okMsg: '' }), suJamSave: () => this.simpanJam(),
      suKodeBaru: S.su.kodeBaru || '', suKodeIn: e => this.patch('su', { kodeBaru: e.target.value.replace(/\D/g, '').slice(0, 12), okMsg: '' }), suKodeSave: () => this.gantiKode(), suKodeCta: S.su.gantiBusy ? 'Mengganti…' : 'Ganti kode',
      suGelombang: ['1', '2'].map(g => ({ l: 'Gelombang ' + g, ...pill(String(S.su.gelombang) === g), on: () => this.patch('su', { gelombang: g, err: '' }) })),
      suGelombangNote: CATATAN_GELOMBANG[S.su.gelombang] || 'Dipakai untuk usulan miqat umrah.',
      syncCounts: [{ l: 'Jamaah', v: this.jm.length }, { l: 'Rombongan', v: new Set(this.jm.map(j => j.r)).size }, { l: 'Regu', v: new Set(this.jm.map(j => j.r + '-' + j.g)).size }],
      hasUndo: !!S.undo, doUndo: () => this.doUndo(), locked: S.locked,
      lockNow: () => this.setState({ locked: true, syncOpen: false, pin: '' }),
      pinDots: [0, 1, 2, 3].map(n => ({ bg: n < S.pin.length ? '#fff' : 'transparent' })),
      pinMsg: (() => { const left = ((this.cfg && this.cfg.lockUntil) || 0) - Date.now(); if (left > 0) { const t = Math.ceil(left / 1000); return 'Terkunci karena 5 kali salah. Coba lagi dalam ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); } if (S.pinErr) return 'PIN salah · sisa ' + (5 - ((this.cfg && this.cfg.pinFails) || 0)) + ' percobaan'; return this.live() ? '' : 'Mode contoh · PIN ' + ((this.cfg && this.cfg.pin) || '1234'); })(), pinMsgFg: S.pinErr || lockOn ? 'var(--red-200)' : 'var(--color-accent-200)',
      pinKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(l => ({ l, vis: l ? 'visible' : 'hidden', bg: l === '⌫' ? 'transparent' : 'var(--color-accent-600)', op: lockOn ? 0.4 : 1, on: () => l && this.pressPin(l === '⌫' ? 'del' : l) })),
      hasToast: !!S.toast, toastMsg: S.toast || '',
      // Bilah bawah: Home · Menu · [Massal] · Kirim · Profil. Layar lama (Jamaah, Badal, Rekap, Cetak) dibuka dari Menu.
      tabs: [['beranda', 'Home', 'M12 2v2M8.5 7.5A4 4 0 0 1 12 4a4 4 0 0 1 3.5 3.5M5 21v-8a7 7 0 0 1 14 0v8M3 21h18M10 21v-4a2 2 0 0 1 4 0v4', ['beranda']],
        ['menu', 'Menu', 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', ['menu', 'jamaah', 'badal', 'rekap', 'cetak', 'kejadian']],
        ['checklist', 'Massal', 'M3 12l3 3 6-6M10 17l2 2 9-9', ['checklist'], true],
        ['kirim', 'Kirim', 'M21 3L10 14M21 3l-7 18-4-7-7-4z', ['kirim']],
        ['profil', 'Profil', 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-3.5 3-6 7-6s7 2.5 7 6', ['profil']]].map(([k, l, d, grup, fab]) => { const a = grup.includes(S.tab);
        return { l, d, on: k === 'checklist' ? go(k, { ckPilih: true }) : go(k), fab: !!fab, fg: fab ? '#0b2a1f' : a ? 'var(--color-accent)' : 'var(--nav-fg)', bg: a && !fab ? 'var(--color-accent-100)' : 'transparent', ring: a ? 'var(--color-accent)' : 'transparent' }; }),
      ckPilih: S.tab === 'checklist' && !!S.ckPilih, pilihIbadah: S.tab === 'checklist' && S.ckPilih ? this.pilihIbadah() : [],
      kePilihIbadah: () => this.setState({ ckPilih: true, ckDariPilih: false }, () => { if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; }), labelIbadah: this.modeLabel(S.mode),
      judulKegiatan: S.mode === 'madinah' ? 'Kegiatan sunnah Madinah' : 'Rukun & wajib ' + this.modeLabel(S.mode),
      isMenu: S.tab === 'menu', isKirim: S.tab === 'kirim', isProfil: S.tab === 'profil', isKejadian: S.tab === 'kejadian',
      kejadian: S.tab === 'kejadian' ? this.kejadianVals() : null,
      menuItems: [['jamaah', 'Jamaah', 'Rombongan, regu, detail', 'M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20c0-3.5 3-6 7-6s7 2.5 7 6'],
        ['checklist', 'Ibadah', 'Haji, Umrah, Madinah', 'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10M4 10.5l8 4 8-4'],
        ['badal', 'Badal', 'Lempar jumrah', 'M4 17.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM14 17.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM9 8.5a3 3 0 1 0 6 0 3 3 0 1 0-6 0z'],
        ['rekap', 'Rekap', 'Progres ibadah', 'M5 20V11M12 20V4M19 20v-6'],
        ['cetak', 'Cetak', 'Simpan PDF', 'M7 9V3h10v6M7 17H4v-6h16v6h-3M7 14h10v7H7z'],
        ['kejadian', 'Catatan Kejadian', 'Sakit, terpisah, dll', 'M12 8v5M12 16h.01M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z']].map(([k, l, s, d]) => ({ l, s, d, on: k === 'checklist' ? go(k, { ckPilih: true }) : go(k) })),
      goTab: k => this.setState({ tab: k })
    };
  }
}
