// Uji Code.gs tanpa Google: meniru SpreadsheetApp, DriveApp, PropertiesService, dsb. di memori.
// Jalankan: npm run uji:gs
import fs from 'node:fs';
import assert from 'node:assert/strict';

const kode = fs.readFileSync(new URL('./Code.gs', import.meta.url), 'utf8');

// Objek berantai: semua method yang tidak ditiru (format, lebar kolom, validasi) mengembalikan dirinya sendiri.
const rantai = (dasar = {}) => new Proxy(dasar, { get: (t, k) => (k in t ? t[k] : () => rantai(dasar)) });

function buatSheet(nama) {
  const data = [];
  const lebar = () => Math.max(0, ...data.map(r => r.length));
  const baris = () => { for (let i = data.length - 1; i >= 0; i--) if (data[i].some(v => v !== '' && v != null)) return i + 1; return 0; };
  const sel = (r, c) => { while (data.length < r) data.push([]); const row = data[r - 1]; while (row.length < c) row.push(''); return row; };
  const range = (r, c, nr = 1, nc = 1) => rantai({
    getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => ((data[r - 1 + i] || [])[c - 1 + j] ?? ''))),
    getDisplayValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => String((data[r - 1 + i] || [])[c - 1 + j] ?? ''))),
    setValues: v => { v.forEach((row, i) => row.forEach((x, j) => { sel(r + i, c + j)[c - 1 + j] = x; })); return range(r, c, nr, nc); },
    setValue: x => { for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) sel(r + i, c + j)[c - 1 + j] = x; return range(r, c, nr, nc); }
  });
  return rantai({
    nama, data,
    getName: () => nama, getSheetId: () => 1,
    getLastRow: baris, getLastColumn: lebar, getMaxRows: () => 1000, getMaxColumns: () => 26,
    getRange: (r, c, nr, nc) => (typeof r === 'string' ? rantai() : range(r, c, nr, nc)),
    getDataRange: () => range(1, 1, Math.max(1, baris()), Math.max(1, lebar())),
    appendRow: row => { const r = baris() + 1; row.forEach((x, j) => { sel(r, j + 1)[j] = x; }); },
    getProtections: () => [], getCharts: () => []
  });
}

function buatGoogle() {
  const sheets = {}, props = {}, drive = { folder: {}, file: [] };
  const ss = rantai({
    getSheetByName: n => sheets[n] || null,
    insertSheet: n => (sheets[n] = buatSheet(n)),
    getName: () => 'Kloter Uji', getId: () => 'ss1', getUrl: () => 'https://sheet', getSpreadsheetTimeZone: () => 'Asia/Jakarta'
  });
  let fid = 0;
  const folder = (nama, induk) => { const id = 'f' + (++fid), f = { id, nama, induk, anak: {} };
    drive.folder[id] = f;
    return rantai({ getId: () => id, isTrashed: () => false,
      getFoldersByName: n => { const a = f.anak[n]; let pakai = false; return { hasNext: () => !!a && !pakai, next: () => { pakai = true; return a; } }; },
      createFolder: n => (f.anak[n] = folder(n, f)),
      createFile: blob => { const file = { folder: f, nama: blob.nama, ukuran: blob.bytes.length, url: 'https://drive/' + (drive.file.length + 1) }; drive.file.push(file);
        return rantai({ getUrl: () => file.url, setDescription: d => { file.ket = d; } }); } }); };
  const pad = n => String(n).padStart(2, '0');
  const g = {
    SpreadsheetApp: rantai({ getActive: () => ss, getUi: () => rantai({ alert: () => {} }), newDataValidation: () => rantai(), BorderStyle: {}, ProtectionType: {}, InterpolationType: {}, flush: () => {} }),
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] ?? null, setProperty: (k, v) => { props[k] = String(v); } }) },
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    ScriptApp: rantai({ getProjectTriggers: () => [] }),
    Utilities: {
      sleep: () => {},
      formatDate: (d, tz, f) => { const x = new Date(d.getTime() + (tz === 'Asia/Riyadh' ? 3 : 7) * 3600e3);
        return f.replace('yyyy', x.getUTCFullYear()).replace('MM', pad(x.getUTCMonth() + 1)).replace('dd', pad(x.getUTCDate())).replace('HH', pad(x.getUTCHours())).replace('mm', pad(x.getUTCMinutes())); },
      base64Decode: s => [...Buffer.from(s, 'base64')],
      newBlob: (bytes, mime, nama) => ({ bytes, mime, nama })
    },
    DriveApp: { createFolder: n => folder(n, null), getFolderById: id => { if (!drive.folder[id]) throw new Error('tidak ada'); return folderObj(id); }, getFoldersByName: () => ({ hasNext: () => false }) },
    ContentService: { createTextOutput: s => ({ setMimeType: () => ({ isi: JSON.parse(s) }) }), MimeType: { JSON: 'json' } },
    MimeType: { PDF: 'pdf' }, Session: { getEffectiveUser: () => ({ getEmail: () => 'uji@contoh' }) }, HtmlService: rantai(), UrlFetchApp: rantai(), MailApp: rantai()
  };
  // getFolderById harus mengembalikan objek yang sama dengan createFolder; simpan peta objek
  const objek = {};
  const folderAsli = folder;
  const folderObj = id => objek[id];
  g.DriveApp.createFolder = n => { const o = folderAsli(n, null); objek[o.getId()] = o; return o; };
  const fn = new Function(...Object.keys(g), kode + '\n;return { doGet, doPost, KOLOM, jadwalBawaan, hitungRekap, PENGATURAN_BAWAAN };');
  return { api: fn(...Object.values(g)), sheets, props, drive, ss };
}

/* ---------- Skenario ---------- */
const { api, sheets, props, drive, ss } = buatGoogle();
const get = q => api.doGet({ parameter: q }).isi;
const post = b => api.doPost({ postData: { contents: JSON.stringify(b) } }).isi;
const tab = n => { const [h, ...rows] = sheets[n].data; return rows.filter(r => r.some(v => v !== '')).map(r => Object.fromEntries(h.map((k, i) => [k, r[i] ?? '']))); };
let lulus = 0; const uji = (nama, f) => { f(); lulus++; console.log('  ✓ ' + nama); };

// Sheet seperti setelah "Siapkan sheet"
Object.entries(api.KOLOM).forEach(([n, k]) => ss.insertSheet(n).appendRow(k));
api.jadwalBawaan().forEach(r => sheets['Jadwal Kegiatan'].appendRow(r));
api.PENGATURAN_BAWAAN.forEach(r => sheets['Pengaturan'].appendRow(r));
['A', 'B', 'C', 'D'].forEach((x, i) => sheets.Jamaah.appendRow([String(9000 + i), 'JAMAAH ' + x, i < 2 ? 1 : 2, 1, i % 2 ? 'Jamaah' : 'Ketua Rombongan', '', 'Tidak', 'Tidak', '', i % 2 ? 'P' : 'L']));

console.log('Uji Code.gs');
uji('kode rahasia belum diatur ditolak', () => assert.match(get({ key: '1234' }).error, /belum diatur/));
props.KUNCI = '1234';
uji('kode salah ditolak', () => assert.equal(get({ key: '9999' }).error, 'KODE_SALAH'));
uji('doGet mengirim pengaturan, riwayat udzur, jadwal', () => { const d = get({ key: '1234' }); assert.equal(d.ok, true); assert.equal(d.jamaah.length, 4); assert.ok('Jam Pengingat' in d.pengaturan); assert.deepEqual(d.riwayatUdzur, []); assert.ok(d.jadwalKegiatan.length > 30); });

const t = m => new Date(Date.UTC(2026, 9, 27, 3, m)).toISOString();
const hasil = post({ key: '1234', items: [
  { jenis: 'centang', id: 'c1', waktu: t(1), porsi: '9000', nama: 'JAMAAH A', kegiatan: 'Jumroh Aqobah', status: 'Selesai', tanggal: '2026-10-27', susulan: 'Ya', petugas: 'Petugas Uji', perangkat: 'HP' },
  { jenis: 'pengaturan', id: 'p1', waktu: t(2), nilai: { 'Nama PPIH': 'Petugas Uji', 'Kloter': 'SOC-27', 'Embarkasi': 'SOC', 'Gelombang': '2', 'Rahasia': 'x' } },
  { jenis: 'udzur', id: 'u2', waktu: t(5), porsi: '9001', nama: 'JAMAAH B', udzur: false, alasan: 'Sudah sehat', petugas: 'Petugas Uji' },
  { jenis: 'udzur', id: 'u1', waktu: t(3), porsi: '9001', nama: 'JAMAAH B', udzur: true, alasan: 'Dirawat di KKHI', petugas: 'Petugas Uji' },
  { jenis: 'udzur', id: 'u1', waktu: t(3), porsi: '9001', nama: 'JAMAAH B', udzur: true, alasan: 'Dirawat di KKHI', petugas: 'Petugas Uji' },
  { jenis: 'tanggal', id: 't1', waktu: t(6), mode: 'Haji', kegiatan: 'Jumroh Aqobah', tanggal: '2026-10-26' },
  { jenis: 'tempat', id: 'm1', waktu: t(7), mode: 'Umrah', kegiatan: 'Miqat', tempat: 'Bandara KAIA Jeddah' },
  { jenis: 'jamaah', id: 'j1', waktu: t(8), porsi: '9002', miqat: 'Bir Ali' }
] });
uji('doPost diterima', () => assert.equal(hasil.ok, true));
uji('Log mencatat Petugas', () => { const l = tab('Log'); assert.equal(l.length, 1); assert.equal(l[0]['Petugas'], 'Petugas Uji'); assert.equal(l[0]['Susulan'], 'Ya'); });
uji('Pengaturan tersimpan, baris tak dikenal diabaikan', () => { const p = Object.fromEntries(tab('Pengaturan').map(r => [r.Nama, r.Nilai])); assert.equal(p['Embarkasi'], 'SOC'); assert.equal(p['Gelombang'], '2'); assert.ok(!('Rahasia' in p)); });
uji('Riwayat Udzur: 2 baris urut waktu, kiriman ganda dilewati', () => { const r = tab('Riwayat Udzur'); assert.deepEqual(r.map(x => x.Status + '/' + x.Alasan), ['Udzur/Dirawat di KKHI', 'Tidak udzur/Sudah sehat']); });
uji('Kolom Udzur jamaah = perubahan terbaru', () => assert.equal(tab('Jamaah').find(j => j['Nomor Porsi'] === '9001')['Udzur'], 'Tidak'));
uji('Udzur lama yang datang terlambat tidak menimpa', () => {
  post({ key: '1234', items: [{ jenis: 'udzur', id: 'u0', waktu: t(4), porsi: '9001', nama: 'JAMAAH B', udzur: true, alasan: 'telat terkirim' }] });
  assert.equal(tab('Riwayat Udzur').length, 3); assert.equal(tab('Jamaah').find(j => j['Nomor Porsi'] === '9001')['Udzur'], 'Tidak'); });
uji('Tanggal jadwal dan miqat kloter tertulis', () => { const jk = tab('Jadwal Kegiatan'); assert.equal(jk.find(r => r.Kegiatan === 'Jumroh Aqobah').Tanggal, '2026-10-26'); assert.equal(jk.find(r => r.Kegiatan === 'Miqat').Tempat, 'Bandara KAIA Jeddah'); });
uji('Label hari Hijriyah tertulis, label kosong diabaikan', () => {
  post({ key: '1234', items: [
    { jenis: 'hari', id: 'h1', waktu: t(10), mode: 'Umrah', kegiatan: 'Thawaf Umrah', hari: "5 Dzulqa'dah" },
    { jenis: 'hari', id: 'h2', waktu: t(11), mode: 'Umrah', kegiatan: "Sa'i Umrah", hari: '  ' }
  ] });
  const jk = tab('Jadwal Kegiatan');
  assert.equal(jk.find(r => r.Mode === 'Umrah' && r.Kegiatan === 'Thawaf Umrah').Hari, "5 Dzulqa'dah");
  assert.equal(jk.find(r => r.Mode === 'Umrah' && r.Kegiatan === "Sa'i Umrah").Hari, '2 Dzulqa’dah'); });
uji('Miqat per jamaah tertulis', () => assert.equal(tab('Jamaah').find(j => j['Nomor Porsi'] === '9002')['Miqat'], 'Bir Ali'));
uji('doGet mengirim balik riwayat udzur', () => assert.equal(get({ key: '1234' }).riwayatUdzur.length, 3));
uji('Rekap berjalan', () => { const R = api.hitungRekap(); assert.equal(R.jam.length, 4); assert.ok(R.keg.some(k => /Jumroh Aqobah/.test(k.k))); });

const data = Buffer.from('foto-jpeg-tiruan').toString('base64');
uji('Foto tersimpan di Drive dan tab Foto', () => {
  const o = post({ key: '1234', aksi: 'foto', foto: { id: 'f1', waktu: t(9), tanggal: '2026-10-27', mode: 'Haji', kegiatan: 'Jumroh Aqobah', cakupan: 'Rombongan 2', keterangan: 'uji', petugas: 'Petugas Uji' }, data });
  assert.equal(o.ok, true); assert.equal(drive.file.length, 1);
  const f = drive.file[0]; assert.equal(f.folder.nama, '2026-10-27'); assert.equal(f.folder.induk.nama, 'Jumroh Aqobah'); assert.match(f.folder.induk.induk.nama, /^Foto Kegiatan · /);
  assert.equal(tab('Foto')[0]['Link'], o.url); });
uji('Foto dikirim ulang tidak dobel', () => { const o = post({ key: '1234', aksi: 'foto', foto: { id: 'f1', kegiatan: 'Jumroh Aqobah' }, data }); assert.equal(o.dobel, true); assert.equal(drive.file.length, 1); });
uji('Foto kedua memakai folder yang sama', () => { post({ key: '1234', aksi: 'foto', foto: { id: 'f2', tanggal: '2026-10-27', kegiatan: 'Jumroh Aqobah' }, data }); assert.equal(drive.file[1].folder, drive.file[0].folder); });
uji('Ganti kode rahasia', () => { assert.equal(post({ key: '1234', aksi: 'gantiKunci', baru: '5678' }).ok, true); assert.equal(get({ key: '1234' }).error, 'KODE_SALAH'); assert.equal(get({ key: '5678' }).ok, true); });

console.log(`\n${lulus} uji lulus`);
