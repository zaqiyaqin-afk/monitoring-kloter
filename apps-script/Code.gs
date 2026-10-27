/**
 * Monitoring Ibadah Kloter — penghubung Google Sheet
 * Tempel seluruh isi file ini di Extensions > Apps Script > Code.gs
 * Kode rahasia diatur lewat menu "Monitoring Kloter > Atur kode rahasia" (tidak perlu mengubah file ini).
 * Nama PPIH, kloter, embarkasi, gelombang, dan jam pengingat ada di tab "Pengaturan" dan bisa diubah dari aplikasi.
 */
// Cadangan untuk pemasangan lama: dipakai hanya bila kode rahasia belum diatur lewat menu.
const KUNCI = '';
const PPIH_NAMA = 'PPIH Bimbingan Ibadah Kloter';
const JAM_PENGINGAT = 21; // jam pengingat email harian (waktu Arab Saudi)

function kunciAktif() { return PropertiesService.getScriptProperties().getProperty('KUNCI') || String(KUNCI || ''); }

function kunciSah(k) {
  const aktif = kunciAktif();
  if (!/^\d{4,}$/.test(aktif)) return { ok: false, error: 'Kode rahasia belum diatur. Buka Sheet, menu Monitoring Kloter > Atur kode rahasia.' };
  if (typeof k !== 'string' || k !== aktif) { Utilities.sleep(800); return { ok: false, error: 'KODE_SALAH' }; }
  return { ok: true };
}

function aturKunci() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('Atur kode rahasia', 'Isi angka saja, minimal 4 angka. Kode yang sama diisi di aplikasi.', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const k = r.getResponseText().trim();
  if (!/^\d{4,}$/.test(k)) { ui.alert('Kode harus angka saja, minimal 4 angka.'); return; }
  PropertiesService.getScriptProperties().setProperty('KUNCI', k);
  ui.alert('Kode rahasia tersimpan. Di aplikasi, isi kode yang sama lalu tekan Hubungkan.');
}

/* ---------- Tab Pengaturan (baris: Nama | Nilai) ---------- */

const PENGATURAN_BAWAAN = [['Nama PPIH', ''], ['Kloter', ''], ['Embarkasi', ''], ['Gelombang', ''], ['Jam Pengingat', String(JAM_PENGINGAT)]];

function pengaturan() {
  const o = {};
  baca('Pengaturan').forEach(r => { const n = String(r['Nama'] || '').trim(); if (n) o[n] = r['Nilai'] === '' || r['Nilai'] == null ? '' : String(r['Nilai']); });
  return o;
}

function tulisPengaturan(nilai) {
  const sh = SpreadsheetApp.getActive().getSheetByName('Pengaturan'); if (!sh) return [];
  const data = sh.getDataRange().getValues(), ubah = [];
  Object.keys(nilai || {}).forEach(n => {
    if (!PENGATURAN_BAWAAN.some(b => b[0] === n)) return; // hanya baris yang dikenal
    const v = String(nilai[n] == null ? '' : nilai[n]).slice(0, 200);
    const i = data.findIndex((r, k) => k > 0 && String(r[0]).trim() === n);
    if (i > 0) { if (String(data[i][1]) !== v) { sh.getRange(i + 1, 2).setNumberFormat('@').setValue(v); ubah.push(n); } }
    else { sh.appendRow([n, v]); data.push([n, v]); ubah.push(n); }
  });
  return ubah;
}

function siapkanPengaturan(ss) {
  const sh = ss.getSheetByName('Pengaturan') || ss.insertSheet('Pengaturan');
  if (sh.getLastRow() === 0) sh.appendRow(KOLOM.Pengaturan);
  sh.setFrozenRows(1); sh.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#e2f0e9');
  sh.getRange('B2:B').setNumberFormat('@');
  const ada = pengaturan();
  PENGATURAN_BAWAAN.forEach(([n, v]) => { if (!(n in ada)) sh.appendRow([n, v]); });
  sh.setColumnWidth(1, 160); sh.setColumnWidth(2, 260);
}

function namaPpih() { return pengaturan()['Nama PPIH'] || PPIH_NAMA; }
function jamPengingat() { const j = parseInt(pengaturan()['Jam Pengingat'], 10); return j >= 0 && j <= 23 ? j : JAM_PENGINGAT; }

const KOLOM = {
  Jamaah: ['Nomor Porsi', 'Nama', 'Rombongan', 'Regu', 'Peran', 'Nomor HP', 'Risti', 'Udzur', 'Catatan', 'Jenis Kelamin', 'Lansia', 'Kursi Roda', 'Pendamping', 'Perlu Badal', 'Pelaksana Badal', 'Miqat'],
  'Jadwal Raudhoh': ['Tanggal', 'Jam', 'Jenis Kelamin', 'Rombongan', 'Keterangan'],
  Petugas: ['Nama', 'Jabatan'],
  Log: ['Waktu', 'Perangkat', 'Nomor Porsi', 'Nama', 'Kegiatan', 'Status', 'Pelaksana Badal', 'Keterangan', 'Tanggal Pelaksanaan', 'Susulan', 'Pendamping', 'Pilihan', 'Alasan', 'Ulang Ke', 'Status Ulang', 'ID Kirim', 'Petugas'],
  'Jadwal Kegiatan': ['Mode', 'Kegiatan', 'Hari', 'Tempat', 'Tanggal'],
  Pengaturan: ['Nama', 'Nilai'],
  'Riwayat Udzur': ['Waktu', 'Nomor Porsi', 'Nama', 'Status', 'Alasan', 'Petugas', 'Perangkat', 'ID Kirim']
};

// Nama kegiatan = kunci Log. Hari & Tempat boleh diubah di tab "Jadwal Kegiatan"; Mode & Kegiatan jangan.
function jadwalBawaan() {
  const J = [], add = (m, k, h, t) => J.push([m, k, h, t]), H = 'Haji', A = '7/8 Dzulhijjah';
  add(H, 'Tarwiyah', A, 'Mina'); add(H, 'Non Tarwiyah', A, 'Langsung ke Arafah'); add(H, 'Niat Haji', A, 'Makkah'); add(H, 'Ihram Haji', A, 'Makkah');
  add(H, 'Wukuf di Arafah', '9 Dzulhijjah', 'Arafah'); add(H, 'Safari Wukuf', '9 Dzulhijjah', 'Arafah');
  add(H, 'Murur Mabit', 'Malam 10 Dzulhijjah', 'Muzdalifah'); add(H, 'Murur', 'Malam 10 Dzulhijjah', 'Muzdalifah');
  add(H, 'Jumroh Aqobah', '10 Dzulhijjah', 'Jamarat, Mina'); add(H, 'Badal Jumroh Aqobah', '10 Dzulhijjah', 'Jamarat, Mina'); add(H, 'Tahallul Awwal Haji', '10 Dzulhijjah', 'Mina');
  [11, 12, 13].forEach(d => { const M = 'Malam ' + d + ' Dzulhijjah', D = d + ' Dzulhijjah';
    add(H, 'Mabit di Mina Malam ' + d, M, 'Mina'); add(H, 'Tanazul Mina Malam ' + d, M, 'Hotel Makkah');
    ['Ula', 'Wustho', 'Aqobah'].forEach(a => add(H, 'Jumroh ' + a + ' ' + d + ' Dzh', D, 'Jamarat, Mina')); add(H, 'Badal Jumroh ' + d + ' Dzh', D, 'Jamarat, Mina');
    if (d === 12) { add(H, 'Nafar Awwal', D, 'Mina → Makkah'); add(H, 'Lanjut Nafar Tsani', D, 'Tetap di Mina'); }
    if (d === 13) add(H, 'Nafar Tsani', D, 'Mina → Makkah'); });
  add(H, 'Thawaf Ifadzoh', "Ifadzoh & Sa'i", 'Masjidil Haram'); add(H, "Sa'i Haji", "Ifadzoh & Sa'i", 'Mas’a'); add(H, 'Tahallul Tsani Haji', 'Tahallul Tsani', 'Makkah'); add(H, "Thawaf Wada'", "Wada'", 'Masjidil Haram');
  // Miqat: kolom Tempat = miqat kloter (diatur dari aplikasi). Kosong = usulan dari Gelombang; miqat per jamaah di kolom Miqat tab Jamaah.
  add('Umrah', 'Niat Umrah', '1 Dzulqa’dah', 'Miqat'); add('Umrah', 'Ihram Umrah', '1 Dzulqa’dah', ''); add('Umrah', 'Miqat', '1 Dzulqa’dah', '');
  add('Umrah', 'Thawaf Umrah', '2 Dzulqa’dah', 'Masjidil Haram'); add('Umrah', "Sa'i Umrah", '2 Dzulqa’dah', 'Mas’a'); add('Umrah', 'Tahallul Umrah', '2 Dzulqa’dah', 'Makkah');
  add('Madinah', 'Raudhoh', 'Madinah', 'Masjid Nabawi');
  return J;
}

// Nama kegiatan versi lama (v5 ke bawah) dipetakan ke nama baru agar riwayat Log tetap terbaca.
function namaBaru(n) {
  n = String(n || '').trim();
  const L = { 'Ihram umrah': 'Ihram Umrah', 'Ihram di miqat': 'Ihram Umrah', 'Tawaf': 'Thawaf Umrah', "Sa'i": "Sa'i Umrah", 'Tahallul': 'Tahallul Umrah', 'Ihram': 'Ihram Haji',
    'Muzdalifah Murur': 'Murur', 'Muzdalifah Murur Mabit': 'Murur Mabit', 'Jumrah Aqabah': 'Jumroh Aqobah', 'Badal Jumrah Aqabah': 'Badal Jumroh Aqobah', 'Tahallul Awwal': 'Tahallul Awwal Haji', 'Ifadzoh': 'Thawaf Ifadzoh', "Wada'": "Thawaf Wada'" };
  if (L[n]) return L[n]; let m;
  if ((m = /^Mabit Mina (\d+) Dzulhijjah$/.exec(n))) return 'Mabit di Mina Malam ' + m[1];
  if ((m = /^Badal Jumrah Tanggal (\d+)$/.exec(n))) return 'Badal Jumroh ' + m[1] + ' Dzh';
  if (/^Jumrah /.test(n)) return n.replace('Jumrah', 'Jumroh').replace('Aqabah', 'Aqobah');
  return n;
}

// Aturan "dipilih salah satu": kegiatan dengan g sama saling menggantikan. opt = tidak wajib sendiri; covers = menggantikan kelompok lain.
function aturan(n) {
  let m;
  if (n === 'Tarwiyah' || n === 'Non Tarwiyah') return { g: 'tarw' };
  if (n === 'Wukuf di Arafah' || n === 'Safari Wukuf') return { g: 'wukuf' };
  if (n === 'Murur Mabit' || n === 'Murur') return { g: 'muzd' };
  if (n === 'Jumroh Aqobah' || n === 'Badal Jumroh Aqobah') return { g: 'j10' };
  if ((m = /^(Mabit di Mina|Tanazul Mina) Malam (\d+)$/.exec(n))) return { g: 'mb' + m[2], d13: m[2] === '13' };
  if ((m = /^Jumroh (Ula|Wustho|Aqobah) (\d+) Dzh$/.exec(n))) return { g: 'j' + m[2] + m[1][0].toLowerCase(), d13: m[2] === '13' };
  if ((m = /^Badal Jumroh (\d+) Dzh$/.exec(n))) return { g: 'b' + m[1], opt: true, covers: ['u', 'w', 'a'].map(x => 'j' + m[1] + x), d13: m[1] === '13' };
  if (n === 'Nafar Awwal' || n === 'Lanjut Nafar Tsani') return { g: 'nafar' };
  if (n === 'Nafar Tsani') return { g: n, d13: true };
  if (n === 'Miqat') return { g: n, miqat: true };
  return { g: n };
}

function daftarKegiatan() { return [...new Set(jadwalBawaan().map(r => r[1]))]; }

function isiJadwalKegiatan(ss) {
  const sh = ss.getSheetByName('Jadwal Kegiatan');
  pastikanKolom(sh, 'Jadwal Kegiatan');
  sh.getRange(1, 1, sh.getMaxRows(), 5).setNumberFormat('@');
  const ada = {}; baca('Jadwal Kegiatan').forEach(r => { ada[r['Mode'] + '|' + r['Kegiatan']] = true; });
  const baru = jadwalBawaan().filter(r => !ada[r[0] + '|' + r[1]]);
  if (baru.length) sh.getRange(sh.getLastRow() + 1, 1, baru.length, 4).setValues(baru);
  sh.getRange('A2:A').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Haji', 'Umrah', 'Madinah']).build());
  sh.setColumnWidth(1, 80); sh.setColumnWidth(2, 220); sh.setColumnWidth(3, 130); sh.setColumnWidth(4, 190); sh.setColumnWidth(5, 110);
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => p.remove());
  sh.getRange('A2:B').protect().setWarningOnly(true).setDescription('Jangan ubah Mode dan Kegiatan: dipakai sebagai kunci Log. Ubah Hari dan Tempat saja.');
}

function pastikanKolom(sh, nama) {
  const ada = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(String);
  KOLOM[nama].filter(k => !ada.includes(k)).forEach(k => sh.getRange(1, sh.getLastColumn() + 1).setValue(k).setFontWeight('bold').setBackground('#e2f0e9'));
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Monitoring Kloter')
    .addItem('Atur kode rahasia', 'aturKunci')
    .addSeparator()
    .addItem('1. Siapkan sheet', 'siapkan')
    .addItem('2. Perbarui rekap + grafik', 'perbaruiRekap')
    .addItem('3. Periksa data jamaah', 'periksaJamaah')
    .addSeparator()
    .addItem('4. Buat PDF laporan', 'buatPdfLaporan')
    .addItem('5. Aktifkan rekap & pengingat otomatis', 'aktifkanOtomatis')
    .addItem('6. Matikan otomatis', 'matikanOtomatis')
    .addToUi();
}

/* ---------- Menu ---------- */

function siapkan() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(KOLOM).forEach(nama => {
    const sh = ss.getSheetByName(nama) || ss.insertSheet(nama);
    if (sh.getLastRow() === 0) sh.appendRow(KOLOM[nama]);
    else { const ada = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(String);
      KOLOM[nama].filter(k => !ada.includes(k)).forEach(k => sh.getRange(1, sh.getLastColumn() + 1).setValue(k)); }
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, KOLOM[nama].length).setFontWeight('bold').setBackground('#e2f0e9');
  });
  const j = ss.getSheetByName('Jamaah'), V = SpreadsheetApp.newDataValidation;
  j.getRange('A2:A').setNumberFormat('@');
  j.getRange('F2:F').setNumberFormat('@');
  j.getRange('C2:C').setDataValidation(V().requireNumberBetween(1, 9).setHelpText('Rombongan 1–9').build());
  j.getRange('D2:D').setDataValidation(V().requireNumberBetween(1, 4).setHelpText('Regu 1–4').build());
  j.getRange('E2:E').setDataValidation(V().requireValueInList(['Jamaah', 'Ketua Rombongan', 'Ketua Regu']).build());
  j.getRange('G2:H').setDataValidation(V().requireValueInList(['Ya', 'Tidak']).build());
  { const hj = j.getRange(1, 1, 1, j.getLastColumn()).getValues()[0].map(String); ['Lansia', 'Kursi Roda', 'Perlu Badal'].forEach(n => { const c = hj.indexOf(n) + 1; if (c > 0) j.getRange(2, c, Math.max(1, j.getMaxRows() - 1), 1).setDataValidation(V().requireValueInList(['Ya', 'Tidak']).setAllowInvalid(true).build()); }); }
  const hj = j.getRange(1, 1, 1, j.getLastColumn()).getValues()[0], cJK = hj.indexOf('Jenis Kelamin') + 1;
  if (cJK > 0) j.getRange(2, cJK, Math.max(1, j.getMaxRows() - 1), 1).setDataValidation(V().requireValueInList(['L', 'P']).setHelpText('L = laki-laki, P = perempuan').build());
  const jr = ss.getSheetByName('Jadwal Raudhoh');
  jr.getRange('A2:A').setNumberFormat('dd/mm/yyyy');
  jr.getRange('B2:B').setNumberFormat('@');
  jr.getRange('D2:D').setNumberFormat('@');
  jr.getRange('C2:C').setDataValidation(V().requireValueInList(['Laki-laki', 'Perempuan']).build());
  if (jr.getLastRow() < 2) jr.getRange(2, 1, 1, 5).setValues([['', '02.00–04.00', 'Perempuan', '1,2,3', 'Contoh: hapus atau ganti']]);
  const lg = ss.getSheetByName('Log'), hl = lg.getRange(1, 1, 1, lg.getLastColumn()).getValues()[0].map(String), cT = hl.indexOf('Tanggal Pelaksanaan') + 1;
  if (cT > 0) lg.getRange(2, cT, Math.max(1, lg.getMaxRows() - 1), 1).setNumberFormat('@');
  isiJadwalKegiatan(ss);
  siapkanPengaturan(ss);
  if (!/^\d{4,}$/.test(kunciAktif())) aturKunci();
  SpreadsheetApp.getUi().alert('Sheet siap. Isi sheet "Jamaah" lalu jalankan menu "Periksa data jamaah". Label hari/tempat kegiatan bisa disesuaikan di tab "Jadwal Kegiatan" (kolom Hari dan Tempat saja).');
}

function periksaJamaah() {
  const rows = baca('Jamaah'), masalah = [], porsi = {};
  const perRomb = {}, ketuaR = {}, ketuaG = {};
  rows.forEach((r, i) => {
    const n = i + 2;
    if (!r['Nomor Porsi']) masalah.push(`Baris ${n}: Nomor Porsi kosong`);
    if (porsi[r['Nomor Porsi']]) masalah.push(`Baris ${n}: Nomor Porsi ganda (${r['Nomor Porsi']})`);
    porsi[r['Nomor Porsi']] = true;
    if (!r['Nama']) masalah.push(`Baris ${n}: Nama kosong`);
    if (!/^[LP]$/.test(String(r['Jenis Kelamin'] || ''))) masalah.push(`Baris ${n}: Jenis Kelamin belum diisi (L/P)`);
    const R = r['Rombongan'], G = r['Regu'];
    perRomb[R] = (perRomb[R] || 0) + 1;
    if (r['Peran'] === 'Ketua Rombongan') ketuaR[R] = (ketuaR[R] || 0) + 1;
    if (r['Peran'] === 'Ketua Regu') ketuaG[R + '-' + G] = (ketuaG[R + '-' + G] || 0) + 1;
  });
  for (let R = 1; R <= 9; R++) {
    if (ketuaR[R] !== 1) masalah.push(`Rombongan ${R}: harus ada tepat 1 Ketua Rombongan (sekarang ${ketuaR[R] || 0})`);
  }
  const ui = SpreadsheetApp.getUi();
  const ringkas = `Total ${rows.length} jamaah. Per rombongan: ` + Object.keys(perRomb).sort().map(k => `R${k}=${perRomb[k]}`).join(', ');
  ui.alert(masalah.length ? ringkas + '\n\nPerlu diperbaiki:\n' + masalah.slice(0, 25).join('\n') : ringkas + '\n\nData jamaah lengkap ✓');
}

function hitungRekap() {
  const jam = baca('Jamaah'), st = statusTerakhir(), J = jadwalBawaan(), tempat = {};
  baca('Jadwal Kegiatan').forEach(r => { tempat[r['Mode'] + '|' + namaBaru(r['Kegiatan'])] = String(r['Tempat'] || '').trim(); });
  const udz = jam.filter(j => j['Udzur'] === 'Ya'), risti = jam.filter(j => j['Risti'] === 'Ya');
  const romb = [...new Set(jam.map(j => Number(j['Rombongan'])).filter(Boolean))].sort((a, b) => a - b);
  const e = (j, n) => st[String(j['Nomor Porsi']) + '|' + n], ok = (j, n) => (e(j, n) || {}).status === 'Selesai';
  const slots = [], byG = {}, cov = {};
  J.forEach(([m, n]) => { const a = aturan(n);
    if (a.covers) a.covers.forEach(g => (cov[g] = cov[g] || []).push(n));
    if (a.opt) return; let s = byG[m + '|' + a.g]; if (!s) { s = byG[m + '|' + a.g] = { m, g: a.g, rites: [], d13: !!a.d13, miqat: !!a.miqat }; slots.push(s); } s.rites.push(n); });
  const adaK = new Set(Object.values(st).map(v => v.kegiatan));
  const satBy = (s, j) => s.rites.find(n => ok(j, n)) || (cov[s.g] || []).find(n => ok(j, n)) || '';
  const target = (list, s) => list.filter(j => !(s.d13 && ok(j, 'Nafar Awwal')) && (j['Udzur'] !== 'Ya' || satBy(s, j)));
  const hitung = (list, s) => { const t = target(list, s), pil = {}; let sel = 0, sus = 0, pu = 0;
    t.forEach(j => { const n = satBy(s, j); if (n) { sel++; pil[n] = (pil[n] || 0) + 1; if ((e(j, n) || {}).susulan) sus++; } else if (s.rites.some(x => (e(j, x) || {}).statusUlang === 'Perlu ulang')) pu++; });
    return { t: t.length, s: sel, sus, pil, pu }; };
  const pendek = n => n.replace(/ Malam \d+$/, '').replace(/ \d+ Dzh$/, '');
  const perRomb = romb.map(r => { const l = jam.filter(j => Number(j['Rombongan']) === r);
    return { r, l, ketua: (l.find(j => j['Peran'] === 'Ketua Rombongan') || {})['Nama'] || '', n: l.length,
      udz: l.filter(j => j['Udzur'] === 'Ya').length, risti: l.filter(j => j['Risti'] === 'Ya').length }; });
  const ada = slots.filter(s => !(s.miqat && !miqatKloter(tempat)) && s.rites.concat(cov[s.g] || []).some(n => adaK.has(n)));
  const keg = ada.map(s => { const h = hitung(jam, s), multi = s.rites.length > 1 || Object.keys(h.pil).some(n => !s.rites.includes(n));
    const nafar = s.d13 ? jam.filter(j => ok(j, 'Nafar Awwal')).length : 0;
    const rinci = [multi ? Object.entries(h.pil).map(([n, v]) => pendek(n) + ' ' + v).join(' · ') : '', h.pu ? 'Perlu ulang ' + h.pu : '', nafar ? 'Nafar Awwal ' + nafar + ' (tidak wajib)' : ''].filter(Boolean).join(' · ');
    return { k: s.rites.join(' / '), badal: false, s: h.s, sus: h.sus, t: h.t, p: h.t ? h.s / h.t : 0, rinci, slot: s, pr: perRomb.map(p => { const x = hitung(p.l, s); return x.t ? x.s / x.t : ''; }) }; });
  const normal = keg, akhir = keg.length ? keg[keg.length - 1] : null;
  perRomb.forEach(p => { if (akhir) { const x = hitung(p.l, akhir.slot); p.akhirS = x.s; p.akhirT = x.t; } else { p.akhirS = 0; p.akhirT = 0; } });
  return { jam, udz, risti, keg, normal, akhir: akhir ? akhir.k : '', perRomb };
}

function perbaruiRekap() {
  const ss = SpreadsheetApp.getActive(), R = hitungRekap();
  const G = '#1e6b52', G2 = '#e2f0e9', RED = '#c0392b', LINE = '#c9d0cc', SOLID = SpreadsheetApp.BorderStyle.SOLID;
  const nR = R.perRomb.length, lastCol = 6 + nR;
  // Data grafik (sheet terpisah agar Rekap rapi)
  let dg = ss.getSheetByName('Data Grafik'); if (dg) dg.clear(); else dg = ss.insertSheet('Data Grafik');
  const d1 = [['Kegiatan', 'Progres (%)']].concat(R.normal.slice(-12).map(x => [x.k, Math.round(x.p * 100)]));
  dg.getRange(1, 1, d1.length, 2).setValues(d1);
  const d2 = [['Rombongan', 'Sudah', 'Belum']].concat(R.perRomb.map(p => ['R' + p.r, p.akhirS, Math.max(0, p.akhirT - p.akhirS)]));
  dg.getRange(1, 4, d2.length, 3).setValues(d2);
  const ristiSaja = R.risti.filter(j => j['Udzur'] !== 'Ya').length;
  const d3 = [['Komposisi', 'Jumlah'], ['Sehat', R.jam.length - R.udz.length - ristiSaja], ['Risti', ristiSaja], ['Udzur', R.udz.length]];
  dg.getRange(1, 8, d3.length, 2).setValues(d3);
  // Sheet Rekap
  let sh = ss.getSheetByName('Rekap');
  if (sh) { sh.getCharts().forEach(ch => sh.removeChart(ch)); sh.clear(); sh.setConditionalFormatRules([]); sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart(); }
  else sh = ss.insertSheet('Rekap');
  ss.setActiveSheet(sh); ss.moveActiveSheet(1);
  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 190); sh.setColumnWidth(3, 70); sh.setColumnWidth(4, 70); sh.setColumnWidth(5, 72);
  for (let c = 6; c <= lastCol; c++) sh.setColumnWidth(c, 58);
  sh.getRange(1, 1).setValue('REKAP MONITORING IBADAH').setFontSize(18).setFontWeight('bold').setFontColor(G);
  sh.getRange(2, 1).setValue(ss.getName() + '  ·  diperbarui ' + Utilities.formatDate(new Date(), 'Asia/Riyadh', 'dd MMM yyyy, HH:mm') + ' WAS').setFontColor('#4d5752');
  // Kartu ringkas: 5 kartu sama lebar di kolom A..lastCol
  const rata = R.normal.length ? R.normal.reduce((s, x) => s + x.p, 0) / R.normal.length : 0;
  const kpi = [['Jamaah', R.jam.length, G, '0'], ['Udzur', R.udz.length, RED, '0'], ['Risti', R.risti.length, RED, '0'], ['Kegiatan tercatat', R.normal.length, G, '0'], ['Progres rata-rata', rata, G, '0%']];
  const spans = [[1, 1], [2, 3], [5, 3], [8, 3], [11, Math.max(1, lastCol - 10)]];
  sh.setRowHeight(4, 22); sh.setRowHeight(5, 40);
  kpi.forEach(([l, v, col, fmt], i) => { const [c, w] = spans[i];
    sh.getRange(4, c, 1, w).merge().setValue(l).setFontSize(9).setFontColor('#4d5752').setBackground(G2).setHorizontalAlignment('center').setVerticalAlignment('bottom');
    sh.getRange(5, c, 1, w).merge().setValue(v).setNumberFormat(fmt).setFontSize(20).setFontWeight('bold').setFontColor(col).setBackground(G2).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sh.getRange(4, c, 2, w).setBorder(true, true, true, true, null, null, '#ffffff', SpreadsheetApp.BorderStyle.SOLID_THICK); });
  // Area grafik: baris 7..
  const h1 = 260, rows1 = Math.ceil(h1 / 21) + 1;
  const W = 230 + 190 + 70 + 70 + 72 + 58 * (nR + 1);
  if (R.normal.length) sh.insertChart(sh.newChart().asBarChart().addRange(dg.getRange(1, 1, d1.length, 2)).setNumHeaders(1)
    .setColors([G]).setOption('title', 'Progres per kegiatan').setOption('legend', { position: 'none' })
    .setOption('hAxis', { minValue: 0, maxValue: 100, viewWindow: { min: 0, max: 100 } })
    .setOption('titleTextStyle', { color: G, fontSize: 14, bold: true }).setOption('width', Math.round(W * 0.6)).setOption('height', h1).setPosition(7, 1, 0, 0).build());
  sh.insertChart(sh.newChart().asPieChart().addRange(dg.getRange(1, 8, d3.length, 2)).setNumHeaders(1)
    .setColors([G, '#e0a100', RED]).setOption('pieHole', 0.55).setOption('title', 'Komposisi jamaah').setOption('pieSliceText', 'value')
    .setOption('titleTextStyle', { color: G, fontSize: 14, bold: true }).setOption('legend', { position: 'right' })
    .setOption('width', Math.round(W * 0.38)).setOption('height', h1).setPosition(7, 1, Math.round(W * 0.62), 0).build());
  let row = 7 + rows1;
  if (R.akhir) { sh.insertChart(sh.newChart().asColumnChart().addRange(dg.getRange(1, 4, d2.length, 3)).setNumHeaders(1).setStacked()
      .setColors([G, '#f4c1ba']).setOption('title', 'Sudah / belum per rombongan · ' + R.akhir).setOption('legend', { position: 'top' })
      .setOption('titleTextStyle', { color: G, fontSize: 14, bold: true }).setOption('width', W).setOption('height', 280).setPosition(row, 1, 0, 0).build());
    row += Math.ceil(280 / 21) + 1; }
  // Tabel kegiatan x rombongan
  row += 1;
  sh.getRange(row, 1).setValue('Progres per kegiatan & rombongan').setFontWeight('bold').setFontSize(12).setFontColor(G); row++;
  const head = ['Kegiatan', 'Rincian pilihan', 'Selesai', 'Target', 'Susulan', 'Total'].concat(R.perRomb.map(p => 'R' + p.r));
  const t1 = [head].concat(R.keg.map(x => [x.k, x.rinci || '—', x.s, x.t, x.sus, x.p].concat(x.pr)));
  sh.getRange(row, 1, t1.length, head.length).setValues(t1).setBorder(true, true, true, true, true, true, LINE, SOLID).setVerticalAlignment('middle');
  sh.getRange(row, 1, 1, head.length).setFontWeight('bold').setBackground(G).setFontColor('#ffffff').setHorizontalAlignment('center');
  if (t1.length > 1) {
    sh.getRange(row + 1, 2, t1.length - 1, head.length - 1).setHorizontalAlignment('center');
    sh.getRange(row + 1, 5, t1.length - 1, 1).setFontColor('#7a5200').setFontWeight('bold');
    const rg = sh.getRange(row + 1, 6, t1.length - 1, nR + 1); rg.setNumberFormat('0%');
    sh.setConditionalFormatRules([SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#f4c1ba', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#fff3c4', SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue('#92c6ab', SpreadsheetApp.InterpolationType.NUMBER, '1').setRanges([rg]).build()]);
  }
  row += t1.length + 2;
  // Tabel rombongan
  sh.getRange(row, 1).setValue('Data rombongan').setFontWeight('bold').setFontSize(12).setFontColor(G); row++;
  const t2 = [['Ketua Rombongan', 'Romb.', 'Jamaah', 'Udzur', 'Risti']].concat(R.perRomb.map(p => [p.ketua, 'R' + p.r, p.n, p.udz, p.risti]));
  t2.push(['Total', '', R.jam.length, R.udz.length, R.risti.length]);
  sh.getRange(row, 1, t2.length, 5).setValues(t2).setBorder(true, true, true, true, true, true, LINE, SOLID);
  sh.getRange(row, 1, 1, 5).setFontWeight('bold').setBackground(G).setFontColor('#ffffff').setHorizontalAlignment('center');
  sh.getRange(row + 1, 2, t2.length - 1, 4).setHorizontalAlignment('center');
  sh.getRange(row + t2.length - 1, 1, 1, 5).setFontWeight('bold').setBackground(G2);
  return sh;
}

function warnaPersen(p) {
  if (p === '' || p == null) return '#ffffff';
  const stops = [[0, [244, 193, 186]], [0.6, [255, 243, 196]], [1, [146, 198, 171]]];
  let i = 0; while (i < stops.length - 2 && p > stops[i + 1][0]) i++;
  const [p0, c0] = stops[i], [p1, c1] = stops[i + 1], t = Math.max(0, Math.min(1, (p - p0) / (p1 - p0)));
  return 'rgb(' + c0.map((v, k) => Math.round(v + (c1[k] - v) * t)).join(',') + ')';
}

function hex(rgb) { const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(rgb); return m ? '#' + [1, 2, 3].map(i => ('0' + Number(m[i]).toString(16)).slice(-2)).join('') : rgb; }

function laporanSheet() {
  const ss = SpreadsheetApp.getActive(), R = hitungRekap();
  const G = '#1e6b52', G2 = '#e2f0e9', RED = '#c0392b', AMB = '#e0a100', GR = '#e1e6e3', MU = '#5b6560', NC = 12;
  let sh = ss.getSheetByName('Laporan');
  if (sh) { sh.clear(); sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart(); } else sh = ss.insertSheet('Laporan');
  if (sh.getMaxColumns() < NC) sh.insertColumnsAfter(sh.getMaxColumns(), NC - sh.getMaxColumns());
  if (sh.getMaxColumns() > NC) sh.deleteColumns(NC + 1, sh.getMaxColumns() - NC);
  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 210); for (let c = 2; c <= NC; c++) sh.setColumnWidth(c, 52);
  sh.setColumnWidth(NC, 62);
  const all = sh.getRange(1, 1, sh.getMaxRows(), NC); all.setFontFamily('Arial').setFontSize(9).setVerticalAlignment('middle').setFontColor('#17201c');
  const put = (r, c, w, v) => { const rg = sh.getRange(r, c, 1, w); if (w > 1) rg.merge(); if (v !== undefined) rg.setValue(v); return rg; };
  const line = r => sh.getRange(r, 1, 1, NC).setBorder(null, null, true, null, null, null, GR, SpreadsheetApp.BorderStyle.SOLID);
  const bar = (r, p, c1, c2) => { const NB = 36, n = Math.round(Math.max(0, Math.min(1, p || 0)) * NB);
    const st = c => SpreadsheetApp.newTextStyle().setForegroundColor(c).setFontSize(9).build();
    let b = SpreadsheetApp.newRichTextValue().setText('█'.repeat(NB));
    if (n > 0) b = b.setTextStyle(0, n, st(c1)); if (n < NB) b = b.setTextStyle(n, NB, st(c2));
    return put(r, 2, 8).setRichTextValue(b.build()).setWrap(false).setHorizontalAlignment('left'); };
  const sec = (r, t) => { put(r, 1, NC, t).setFontSize(12).setFontWeight('bold').setFontColor(G); sh.setRowHeight(r, 28); };
  const now = new Date();
  // Kepala
  sh.getRange(1, 1, 3, NC).setBackground(G);
  put(1, 1, NC, 'LAPORAN MONITORING IBADAH').setFontColor('#c2e0d0').setFontSize(8).setFontWeight('bold');
  put(2, 1, NC, ss.getName()).setFontColor('#ffffff').setFontSize(17).setFontWeight('bold');
  put(3, 1, NC, Utilities.formatDate(now, 'Asia/Riyadh', 'dd MMMM yyyy, HH:mm') + ' WAS  ·  ' + Utilities.formatDate(now, 'Asia/Jakarta', 'HH:mm') + ' WIB').setFontColor('#e2f0e9');
  sh.setRowHeight(1, 22); sh.setRowHeight(2, 32); sh.setRowHeight(3, 22);
  // Kartu
  const rata = R.normal.length ? R.normal.reduce((s, x) => s + x.p, 0) / R.normal.length : 0;
  const kpi = [['Jamaah', R.jam.length, G, '0'], ['Udzur', R.udz.length, RED, '0'], ['Risti', R.risti.length, AMB, '0'], ['Kegiatan', R.normal.length, G, '0'], ['Rata-rata', rata, G, '0%']];
  const spans = [[1, 1], [2, 3], [5, 3], [8, 3], [11, 2]];
  kpi.forEach(([l, v, col, f], i) => { const [c, w] = spans[i];
    put(5, c, w, v).setNumberFormat(f).setFontSize(20).setFontWeight('bold').setFontColor(col).setHorizontalAlignment('center').setBackground(G2);
    put(6, c, w, l).setFontColor(MU).setFontSize(8).setHorizontalAlignment('center').setBackground(G2);
    sh.getRange(5, c, 2, w).setBorder(true, true, true, true, null, null, '#ffffff', SpreadsheetApp.BorderStyle.SOLID_THICK); });
  sh.setRowHeight(5, 36); sh.setRowHeight(6, 18);
  let r = 8;
  // Komposisi
  const ristiSaja = R.risti.filter(j => j['Udzur'] !== 'Ya').length, sehat = R.jam.length - R.udz.length - ristiSaja, N = Math.max(1, R.jam.length);
  sec(r, 'Komposisi jamaah'); r++;
  sh.getRange(r, 1).setValue('Sehat ' + sehat + '  ·  Risti ' + ristiSaja + '  ·  Udzur ' + R.udz.length).setFontWeight('bold');
  bar(r, sehat / N, G, RED); put(r, 10, 3, sehat / N).setNumberFormat('0%" sehat"').setHorizontalAlignment('right').setFontWeight('bold');
  sh.setRowHeight(r, 22); r += 2;
  // Progres per kegiatan
  sec(r, 'Progres per kegiatan'); r++;
  if (!R.keg.length) { sh.getRange(r, 1).setValue('Belum ada kegiatan yang dicentang.').setFontColor(MU); r++; }
  R.keg.forEach(x => {
    sh.getRange(r, 1).setValue(x.k + (x.rinci ? '  (' + x.rinci + ')' : ''));
    bar(r, x.p, x.p >= 1 ? G : x.p >= .6 ? '#5ea683' : AMB, GR);
    put(r, 10, 2, x.p).setNumberFormat('0%').setFontWeight('bold').setHorizontalAlignment('right');
    sh.getRange(r, 12).setValue(x.s + '/' + x.t).setFontColor(MU).setHorizontalAlignment('right');
    line(r); sh.setRowHeight(r, 20); r++; });
  r++;
  // Per rombongan
  if (R.akhir) {
    sec(r, 'Per rombongan · ' + R.akhir); r++;
    R.perRomb.forEach(p => { const f = p.akhirT ? p.akhirS / p.akhirT : 0;
      sh.getRange(r, 1).setValue('R' + p.r + '  ' + p.ketua);
      bar(r, f, f >= 1 ? G : '#5ea683', '#f4c1ba');
      put(r, 10, 2, f).setNumberFormat('0%').setFontWeight('bold').setHorizontalAlignment('right');
      sh.getRange(r, 12).setValue(p.akhirS + '/' + p.akhirT).setFontColor(MU).setHorizontalAlignment('right');
      line(r); sh.setRowHeight(r, 20); r++; });
    r++;
  }
  // Matriks
  if (R.keg.length) {
    sec(r, 'Matriks kegiatan × rombongan'); r++;
    const head = ['Kegiatan', 'Total'].concat(R.perRomb.map(p => 'R' + p.r)).slice(0, NC - 1);
    while (head.length < NC - 1) head.push(''); head.push('Susulan');
    sh.getRange(r, 1, 1, NC).setValues([head]).setBackground(G).setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center'); r++;
    const vals = R.keg.map(x => { const row = [x.k, x.p].concat(x.pr).slice(0, NC - 1); while (row.length < NC - 1) row.push(''); row.push(x.sus); return row; });
    const bgs = R.keg.map(x => { const row = ['#f6f8f7', hex(warnaPersen(x.p))].concat(x.pr.map(v => hex(warnaPersen(v)))).slice(0, NC - 1); while (row.length < NC - 1) row.push('#ffffff'); row.push('#fdf0c4'); return row; });
    const rg = sh.getRange(r, 1, vals.length, NC);
    rg.setValues(vals).setBackgrounds(bgs).setBorder(true, true, true, true, true, true, '#ffffff', SpreadsheetApp.BorderStyle.SOLID);
    sh.getRange(r, 2, vals.length, NC - 1).setNumberFormat('0%').setHorizontalAlignment('center');
    sh.getRange(r, NC, vals.length, 1).setNumberFormat('0').setFontColor('#5a3f00').setFontWeight('bold');
    sh.getRange(r, 2, vals.length, 1).setFontWeight('bold');
    r += vals.length + 1;
  }
  // Data rombongan
  sec(r, 'Data rombongan'); r++;
  const hd = sh.getRange(r, 1, 1, NC); hd.setBackground(G).setFontColor('#ffffff').setFontWeight('bold');
  sh.getRange(r, 1).setValue('Rombongan · Ketua'); put(r, 2, 2, 'Jamaah').setHorizontalAlignment('center'); put(r, 4, 2, 'Udzur').setHorizontalAlignment('center'); put(r, 6, 2, 'Risti').setHorizontalAlignment('center'); r++;
  R.perRomb.forEach((p, i) => {
    if (i % 2) sh.getRange(r, 1, 1, NC).setBackground('#f6f8f7');
    sh.getRange(r, 1).setValue('R' + p.r + '  ' + p.ketua);
    put(r, 2, 2, p.n).setHorizontalAlignment('center'); put(r, 4, 2, p.udz).setHorizontalAlignment('center').setFontColor(p.udz ? RED : '#17201c'); put(r, 6, 2, p.risti).setHorizontalAlignment('center').setFontColor(p.risti ? AMB : '#17201c');
    sh.setRowHeight(r, 19); r++; });
  sh.getRange(r, 1, 1, NC).setBackground(G2).setFontWeight('bold');
  sh.getRange(r, 1).setValue('Total'); put(r, 2, 2, R.jam.length).setHorizontalAlignment('center'); put(r, 4, 2, R.udz.length).setHorizontalAlignment('center'); put(r, 6, 2, R.risti.length).setHorizontalAlignment('center');
  r += 2;
  put(r, 1, NC, 'PPIH Bimbingan Ibadah Kloter').setHorizontalAlignment('right').setFontWeight('bold'); r++;
  sh.setRowHeight(r, 38); r++;
  put(r, 1, NC, namaPpih()).setHorizontalAlignment('right').setFontWeight('bold'); r += 2;
  put(r, 1, NC, 'Dibuat otomatis dari Google Sheet “' + ss.getName() + '” · aplikasi Monitoring Ibadah Kloter').setFontSize(7).setFontColor(MU);
  if (sh.getMaxRows() > r + 1) sh.deleteRows(r + 2, sh.getMaxRows() - r - 1);
  return { sh, rows: r };
}

function buatPdfLaporan(diam) {
  const ss = SpreadsheetApp.getActive();
  perbaruiRekap();
  const L = laporanSheet();
  SpreadsheetApp.flush(); Utilities.sleep(1500);
  const scale = L.rows > 95 ? 2 : 4; // 4 = muat 1 halaman, 2 = sesuai lebar
  const url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=pdf&gid=' + L.sh.getSheetId() +
    '&size=A4&portrait=true&scale=' + scale + '&gridlines=false&printtitle=false&sheetnames=false&pagenum=UNDEFINED&fzr=false&horizontal_alignment=CENTER' +
    '&top_margin=0.4&bottom_margin=0.4&left_margin=0.4&right_margin=0.4';
  const blob = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob()
    .setName('Laporan ' + ss.getName() + ' ' + Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HHmm') + '.pdf');
  const it = DriveApp.getFoldersByName('Laporan Kloter'), folder = it.hasNext() ? it.next() : DriveApp.createFolder('Laporan Kloter');
  const file = folder.createFile(blob);
  if (diam !== true) SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput('<p style="font-family:sans-serif">PDF tersimpan di Google Drive, folder <b>Laporan Kloter</b>.</p><p><a href="' + file.getUrl() + '" target="_blank" style="font-family:sans-serif;font-weight:bold;color:#1e6b52">Buka PDF laporan</a></p>').setWidth(360).setHeight(140), 'Laporan siap');
  return file;
}

function teksRingkas() {
  const R = hitungRekap(), L = [];
  L.push('REKAP HARIAN · ' + SpreadsheetApp.getActive().getName());
  L.push(Utilities.formatDate(new Date(), 'Asia/Riyadh', 'dd MMM yyyy, HH:mm') + ' WAS');
  L.push('');
  L.push('Jamaah ' + R.jam.length + ' · Udzur ' + R.udz.length + ' · Risti ' + R.risti.length);
  L.push('');
  R.keg.forEach(x => L.push((x.s >= x.t && x.t ? '[selesai] ' : '[proses] ') + x.k + ': ' + x.s + '/' + x.t + ' (' + Math.round(x.p * 100) + '%)' + (x.sus ? ' · ' + x.sus + ' susulan' : '') + (x.rinci ? ' · ' + x.rinci : '')));
  if (R.akhir) { L.push(''); L.push('Per rombongan · ' + R.akhir); R.perRomb.forEach(p => L.push('R' + p.r + ' (' + p.ketua + '): ' + p.akhirS + '/' + p.akhirT)); }
  L.push(''); L.push('PPIH Bimbingan Ibadah Kloter: ' + namaPpih());
  return L.join('\n');
}

function kirimPengingat() {
  const ss = SpreadsheetApp.getActive(), file = buatPdfLaporan(true);
  MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), subject: 'Pengingat rekap harian · ' + ss.getName(),
    body: 'Assalamu\'alaikum. Saatnya merekap kegiatan hari ini.\n\n' + teksRingkas() + '\n\nBuka sheet: ' + ss.getUrl() + '\nPDF laporan terlampir.',
    attachments: [file.getAs(MimeType.PDF)] });
}

function pasangPemicu() {
  matikanOtomatis(true);
  ScriptApp.newTrigger('perbaruiRekap').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('kirimPengingat').timeBased().atHour(jamPengingat()).everyDays(1).inTimezone('Asia/Riyadh').create();
}

function otomatisAktif() { return ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'kirimPengingat'); }

function aktifkanOtomatis() {
  pasangPemicu();
  SpreadsheetApp.getUi().alert('Aktif: rekap + grafik diperbarui tiap jam, dan email pengingat (dengan PDF laporan) dikirim setiap hari sekitar pukul ' + jamPengingat() + '.00 WAS ke ' + Session.getEffectiveUser().getEmail() + '. Jam pengingat bisa diubah dari aplikasi.');
}

function matikanOtomatis(diam) {
  ScriptApp.getProjectTriggers().filter(t => ['perbaruiRekap', 'kirimPengingat'].includes(t.getHandlerFunction())).forEach(t => ScriptApp.deleteTrigger(t));
  if (diam !== true) SpreadsheetApp.getUi().alert('Rekap & pengingat otomatis dimatikan.');
}

/* ---------- API untuk aplikasi ---------- */

function doGet(e) {
  const p = e.parameter || {}, cek = kunciSah(p.key);
  if (!cek.ok) return json(cek);
  if (p.aksi === 'ping') return json({ ok: true, pong: true, waktu: new Date().toISOString() });
  return json({ ok: true, waktu: new Date().toISOString(), jamaah: baca('Jamaah'), petugas: baca('Petugas'), jadwal: bacaTampil('Jadwal Raudhoh'), status: statusTerakhir(), jadwalKegiatan: bacaJadwalKegiatan(),
    pengaturan: pengaturan(), otomatis: otomatisAktif(), riwayatUdzur: baca('Riwayat Udzur') });
}

function doPost(e) {
  let body; try { body = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { return json({ ok: false, error: 'Data tidak valid' }); }
  const cek = kunciSah(body.key);
  if (!cek.ok) return json(cek);
  if (body.aksi === 'gantiKunci') {
    if (!/^\d{4,}$/.test(String(body.baru || ''))) return json({ ok: false, error: 'Kode baru harus angka saja, minimal 4 angka' });
    PropertiesService.getScriptProperties().setProperty('KUNCI', String(body.baru));
    return json({ ok: true });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActive(), now = Date.now();
    // Pengaturan dari aplikasi (urut waktu, yang terakhir menang)
    const atur = (body.items || []).filter(i => i.jenis === 'pengaturan').sort((a, b) => Date.parse(a.waktu) - Date.parse(b.waktu));
    if (atur.length) {
      if (!ss.getSheetByName('Pengaturan')) siapkanPengaturan(ss);
      const ubah = [].concat(...atur.map(i => tulisPengaturan(i.nilai)));
      if (ubah.includes('Jam Pengingat') && otomatisAktif()) pasangPemicu();
    }
    const udz = (body.items || []).filter(i => i.jenis === 'udzur' && i.porsi);
    if (udz.length) catatUdzur(ss, udz, now);
    const jdw = (body.items || []).filter(i => (i.jenis === 'tanggal' || i.jenis === 'tempat') && i.kegiatan).sort((a, b) => Date.parse(a.waktu) - Date.parse(b.waktu));
    if (jdw.length) tulisJadwalKegiatan(ss, jdw);
    // Aturan konflik: CENTANG TERAKHIR MENANG (berdasarkan cap waktu per centang di perangkat)
    const items = (body.items || []).map(i => { let t = Date.parse(i.waktu); if (isNaN(t) || t > now + 300000) t = now; return Object.assign({}, i, { waktu: new Date(t).toISOString() }, i.jenis === 'centang' ? { kegiatan: namaBaru(i.kegiatan) } : {}); })
      .sort((a, b) => Date.parse(a.waktu) - Date.parse(b.waktu));
    const terakhir = statusTerakhir(); let diabaikan = 0, dobel = 0;
    // Anti dobel: kiriman ulang (ID Kirim sama) dilewati
    const lgId = ss.getSheetByName('Log'); pastikanKolom(lgId, 'Log');
    const hId = lgId.getRange(1, 1, 1, lgId.getLastColumn()).getValues()[0].map(String), cId = hId.indexOf('ID Kirim') + 1, sudah = {};
    if (cId > 0 && lgId.getLastRow() > 1) lgId.getRange(2, cId, lgId.getLastRow() - 1, 1).getValues().forEach(r => { if (r[0]) sudah[String(r[0])] = true; });
    const baru = items.filter(i => { if (i.jenis !== 'centang') return true;
      if (i.id && sudah[String(i.id)]) { dobel++; return false; } if (i.id) sudah[String(i.id)] = true; const k = String(i.porsi) + '|' + i.kegiatan, ada = terakhir[k];
      if (ada && Date.parse(ada.waktu) > Date.parse(i.waktu)) { diabaikan++; return false; }
      terakhir[k] = { waktu: i.waktu }; return true; });
    const centang = baru.filter(i => i.jenis === 'centang');
    if (centang.length) {
      const log = ss.getSheetByName('Log'); pastikanKolom(log, 'Log');
      const h = log.getRange(1, 1, 1, log.getLastColumn()).getValues()[0].map(String);
      const hariWas = t => Utilities.formatDate(new Date(t), 'Asia/Riyadh', 'yyyy-MM-dd');
      const rows = centang.map(i => { const ok = i.status === 'Selesai';
        const o = { 'Waktu': new Date(i.waktu), 'Perangkat': i.perangkat || '', 'Nomor Porsi': String(i.porsi), 'Nama': i.nama || '', 'Kegiatan': i.kegiatan, 'Status': i.status,
          'Pelaksana Badal': i.pelaksana || '', 'Keterangan': i.keterangan || '',
          'Tanggal Pelaksanaan': ok ? (/^\d{4}-\d{2}-\d{2}$/.test(i.tanggal || '') ? i.tanggal : hariWas(i.waktu)) : '', 'Susulan': ok && i.susulan === 'Ya' ? 'Ya' : 'Tidak',
          'Pendamping': i.pendamping || '', 'Pilihan': i.pilihan || '', 'Alasan': i.alasan || '', 'Ulang Ke': i.ulangKe || '', 'Status Ulang': i.statusUlang || '', 'ID Kirim': i.id ? String(i.id) : '', 'Petugas': String(i.petugas || '').slice(0, 100) };
        return h.map(k => o[k] === undefined ? '' : o[k]); });
      const r0 = log.getLastRow() + 1;
      ['Nomor Porsi', 'Tanggal Pelaksanaan', 'ID Kirim'].forEach(k => { const ci = h.indexOf(k); if (ci >= 0) log.getRange(r0, ci + 1, rows.length, 1).setNumberFormat('@'); });
      log.getRange(r0, 1, rows.length, h.length).setValues(rows);
    }
    const jd = baru.filter(i => i.jenis === 'jadwal');
    if (jd.length) {
      const sh = ss.getSheetByName('Jadwal Raudhoh'); pastikanKolom(sh, 'Jadwal Raudhoh');
      const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
      const kunci = (t, j, k, r) => [t, j, String(k || '').toUpperCase().slice(0, 1), String(r || '').replace(/\s/g, '')].join('|');
      const ada = {}; bacaTampil('Jadwal Raudhoh').forEach(r => { ada[kunci(r['Tanggal'], r['Jam'], r['Jenis Kelamin'], r['Rombongan'])] = true; });
      jd.forEach(i => {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(i.tanggal || ''); if (!m || !i.jam) return;
        const k = kunci(m[3] + '/' + m[2] + '/' + m[1], i.jam, i.jk, i.rombongan); if (ada[k]) return; ada[k] = true;
        const o = { 'Tanggal': new Date(+m[1], +m[2] - 1, +m[3]), 'Jam': String(i.jam), 'Jenis Kelamin': String(i.jk || '').toUpperCase().slice(0, 1), 'Rombongan': String(i.rombongan || ''), 'Keterangan': String(i.keterangan || '') };
        const r = sh.getLastRow() + 1;
        ['Jam', 'Rombongan'].forEach(n => { const ci = h.indexOf(n); if (ci >= 0) sh.getRange(r, ci + 1).setNumberFormat('@'); });
        const ct = h.indexOf('Tanggal'); if (ct >= 0) sh.getRange(r, ct + 1).setNumberFormat('dd/mm/yyyy');
        sh.getRange(r, 1, 1, h.length).setValues([h.map(n => o[n] === undefined ? '' : o[n])]);
      });
    }
    const ubah = baru.filter(i => i.jenis === 'jamaah');
    if (ubah.length) {
      const sh = ss.getSheetByName('Jamaah'); pastikanKolom(sh, 'Jamaah');
      const data = sh.getDataRange().getValues(), h = data[0].map(String);
      const cP = h.indexOf('Nomor Porsi'), col = n => h.indexOf(n) + 1;
      const yt = v => v ? 'Ya' : 'Tidak';
      ubah.forEach(i => {
        const r = data.findIndex((row, n) => n > 0 && String(row[cP]) === String(i.porsi));
        if (r < 1) return;
        const set = (n, v) => { const c = col(n); if (c > 0) sh.getRange(r + 1, c).setValue(v); };
        if (i.udzur !== undefined) set('Udzur', yt(i.udzur));
        if (i.catatan !== undefined) set('Catatan', i.catatan);
        if (i.lansia !== undefined) set('Lansia', yt(i.lansia));
        if (i.kursiRoda !== undefined) set('Kursi Roda', yt(i.kursiRoda));
        if (i.pendamping !== undefined) set('Pendamping', String(i.pendamping || ''));
        if (i.perluBadal !== undefined) set('Perlu Badal', yt(i.perluBadal));
        if (i.pelaksanaBadal !== undefined) set('Pelaksana Badal', String(i.pelaksanaBadal || ''));
        if (i.miqat !== undefined) set('Miqat', String(i.miqat || '').slice(0, 60)); // kosong = ikut miqat kloter
      });
    }
    return json({ ok: true, diterima: items.length, diabaikan, dobel });
  } finally {
    lock.releaseLock();
  }
}

// Udzur dari aplikasi: setiap perubahan dicatat di "Riwayat Udzur" (kiriman ulang dilewati lewat ID Kirim),
// lalu kolom Udzur di tab Jamaah diisi dengan perubahan TERBARU per jamaah.
function catatUdzur(ss, items, now) {
  const sh = ss.getSheetByName('Riwayat Udzur') || ss.insertSheet('Riwayat Udzur');
  if (sh.getLastRow() === 0) { sh.appendRow(KOLOM['Riwayat Udzur']); sh.setFrozenRows(1); sh.getRange(1, 1, 1, KOLOM['Riwayat Udzur'].length).setFontWeight('bold').setBackground('#e2f0e9'); }
  pastikanKolom(sh, 'Riwayat Udzur');
  const ada = baca('Riwayat Udzur'), sudah = {}, terakhir = {};
  ada.forEach(r => { if (r['ID Kirim']) sudah[String(r['ID Kirim'])] = true; const p = String(r['Nomor Porsi']), t = Date.parse(r['Waktu']); if (!(terakhir[p] >= t)) terakhir[p] = t; });
  const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String), ubahJamaah = {};
  const rows = [];
  items.map(i => { let t = Date.parse(i.waktu); if (isNaN(t) || t > now + 300000) t = now; return Object.assign({}, i, { t }); })
    .sort((a, b) => a.t - b.t)
    .forEach(i => {
      if (i.id && sudah[String(i.id)]) return; if (i.id) sudah[String(i.id)] = true;
      const p = String(i.porsi), o = { 'Waktu': new Date(i.t), 'Nomor Porsi': p, 'Nama': String(i.nama || ''), 'Status': i.udzur ? 'Udzur' : 'Tidak udzur',
        'Alasan': String(i.alasan || '').slice(0, 200), 'Petugas': String(i.petugas || '').slice(0, 100), 'Perangkat': String(i.perangkat || ''), 'ID Kirim': i.id ? String(i.id) : '' };
      rows.push(h.map(k => o[k] === undefined ? '' : o[k]));
      if (!(terakhir[p] > i.t)) { terakhir[p] = i.t; ubahJamaah[p] = !!i.udzur; }
    });
  if (rows.length) {
    const r0 = sh.getLastRow() + 1;
    ['Nomor Porsi', 'ID Kirim'].forEach(k => { const c = h.indexOf(k); if (c >= 0) sh.getRange(r0, c + 1, rows.length, 1).setNumberFormat('@'); });
    sh.getRange(r0, 1, rows.length, h.length).setValues(rows);
  }
  const porsi = Object.keys(ubahJamaah); if (!porsi.length) return;
  const jm = ss.getSheetByName('Jamaah'), data = jm.getDataRange().getValues(), hj = data[0].map(String), cP = hj.indexOf('Nomor Porsi'), cU = hj.indexOf('Udzur') + 1;
  if (cU < 1) return;
  porsi.forEach(p => { const r = data.findIndex((row, n) => n > 0 && String(row[cP]) === p); if (r > 0) jm.getRange(r + 1, cU).setValue(ubahJamaah[p] ? 'Ya' : 'Tidak'); });
}

// Dari aplikasi ke tab Jadwal Kegiatan: 'tanggal' -> kolom Tanggal (yyyy-MM-dd), 'tempat' -> kolom Tempat (mis. miqat kloter).
function tulisJadwalKegiatan(ss, items) {
  const sh = ss.getSheetByName('Jadwal Kegiatan'); if (!sh) return;
  pastikanKolom(sh, 'Jadwal Kegiatan');
  const data = sh.getDataRange().getValues(), h = data[0].map(String), cM = h.indexOf('Mode'), cK = h.indexOf('Kegiatan');
  items.forEach(i => {
    const kolom = i.jenis === 'tempat' ? 'Tempat' : 'Tanggal', c = h.indexOf(kolom) + 1;
    const v = i.jenis === 'tempat' ? String(i.tempat || '').slice(0, 60) : (/^\d{4}-\d{2}-\d{2}$/.test(String(i.tanggal || '')) ? String(i.tanggal) : '');
    const r = data.findIndex((row, n) => n > 0 && String(row[cM]) === String(i.mode) && namaBaru(row[cK]) === namaBaru(i.kegiatan));
    if (r > 0 && c > 0) { sh.getRange(r + 1, c).setNumberFormat('@').setValue(v); data[r][c - 1] = v; }
  });
}

// Miqat kloter untuk rekap: kolom Tempat baris Umrah|Miqat, bila kosong diusulkan dari Gelombang (sama dengan aplikasi).
function miqatKloter(tempat) {
  const t = tempat['Umrah|Miqat']; if (t) return t;
  const g = String(pengaturan()['Gelombang'] || '');
  return g === '1' ? 'Bir Ali' : g === '2' ? 'Yalamlam' : '';
}

// Seperti baca(), tetapi tanggal yang diketik manual di Sheet (jadi objek Date) diubah ke yyyy-MM-dd menurut zona waktu Sheet.
function bacaJadwalKegiatan() {
  const sh = SpreadsheetApp.getActive().getSheetByName('Jadwal Kegiatan');
  if (!sh || sh.getLastRow() < 2) return [];
  const tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone(), [h, ...rows] = sh.getDataRange().getValues();
  return rows.filter(r => r.some(v => v !== '')).map(r => Object.fromEntries(h.map((k, i) => [k, r[i] instanceof Date ? Utilities.formatDate(r[i], tz, 'yyyy-MM-dd') : r[i]])));
}

/* ---------- Bantuan ---------- */

function baca(nama) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nama);
  if (!sh || sh.getLastRow() < 2) return [];
  const [h, ...rows] = sh.getDataRange().getValues();
  return rows.filter(r => r.some(v => v !== '')).map(r => Object.fromEntries(h.map((k, i) => [k, r[i] instanceof Date ? r[i].toISOString() : r[i]])));
}

function bacaTampil(nama) {
  const sh = SpreadsheetApp.getActive().getSheetByName(nama);
  if (!sh || sh.getLastRow() < 2) return [];
  const [h, ...rows] = sh.getDataRange().getDisplayValues();
  return rows.filter(r => r.some(v => v !== '')).map(r => Object.fromEntries(h.map((k, i) => [k, r[i]])));
}

function statusTerakhir() {
  const out = {};
  baca('Log').forEach(r => {
    const n = namaBaru(r['Kegiatan']), k = r['Nomor Porsi'] + '|' + n;
    if (!out[k] || Date.parse(r['Waktu']) >= Date.parse(out[k].waktu)) out[k] = { waktu: r['Waktu'], kegiatan: n, status: r['Status'], pelaksana: r['Pelaksana Badal'],
      tanggal: String(r['Tanggal Pelaksanaan'] || '').slice(0, 10) || (r['Waktu'] ? Utilities.formatDate(new Date(r['Waktu']), 'Asia/Riyadh', 'yyyy-MM-dd') : ''), susulan: r['Susulan'] === 'Ya',
      pendamping: r['Pendamping'] || '', pilihan: r['Pilihan'] || '', alasan: r['Alasan'] || '', ulangKe: Number(r['Ulang Ke']) || 0, statusUlang: r['Status Ulang'] || '' };
  });
  return out;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
