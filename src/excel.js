// Unduh dan unggah Excel data jamaah. Kolom file unduhan sama dengan templat unggah,
// jadi petugas bisa mengunduh, melengkapi di Excel, lalu mengunggahnya kembali.
import writeXlsxFile from 'write-excel-file/browser';
import readXlsxFile from 'read-excel-file/browser';

// [judul kolom, kunci unggah (null = hanya dibaca), ambil nilai dari jamaah]
const KOLOM = [
  ['Nomor Porsi', 'porsi', j => j.porsi],
  ['Nama', 'nama', j => j.name],
  ['Rombongan', 'rombongan', j => j.r || ''],
  ['Regu', 'regu', j => j.g || ''],
  ['Peran', 'peran', j => j.role || 'Jamaah'],
  ['Jenis Kelamin', 'jk', j => j.raw['Jenis Kelamin'] || ''],
  ['Tanggal Lahir', 'tglLahir', j => tglId(j.raw['Tanggal Lahir'])],
  ['Umur', null, j => (j.umur >= 0 ? j.umur : '')],
  ['Lansia', null, j => (j.umur >= 65 || j.raw['Lansia'] === 'Ya' ? 'Ya' : '')],
  ['Nomor HP', 'hp', j => j.raw['Nomor HP'] || ''],
  ['Risti', 'risti', j => (j.raw['Risti'] === 'Ya' ? 'Ya' : '')],
  ['Kursi Roda', 'kursiRoda', j => (j.raw['Kursi Roda'] === 'Ya' ? 'Ya' : '')],
  ['Pendamping', null, j => j.raw['Pendamping'] || ''],
  ['Udzur', null, j => (j.raw['Udzur'] === 'Ya' ? 'Ya' : '')],
  ['Miqat', null, j => j.raw['Miqat'] || ''],
  ['Hotel Makkah', 'hotelMakkah', j => j.raw['Hotel Makkah'] || ''],
  ['Lantai Makkah', 'lantaiMakkah', j => j.raw['Lantai Makkah'] || ''],
  ['Kamar Makkah', 'kamarMakkah', j => j.raw['Kamar Makkah'] || ''],
  ['Tenda Arafah', 'tendaArafah', j => j.raw['Tenda Arafah'] || ''],
  ['Tenda Mina', 'tendaMina', j => j.raw['Tenda Mina'] || ''],
  ['Hotel Madinah', 'hotelMadinah', j => j.raw['Hotel Madinah'] || ''],
  ['Lantai Madinah', 'lantaiMadinah', j => j.raw['Lantai Madinah'] || ''],
  ['Kamar Madinah', 'kamarMadinah', j => j.raw['Kamar Madinah'] || ''],
  ['Catatan', 'catatan', j => j.raw['Catatan'] || '']
];

function tglId(v) { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || '')); return m ? `${m[3]}/${m[2]}/${m[1]}` : ''; }
const kepala = t => ({ value: t, fontWeight: 'bold', backgroundColor: '#E3F1E9', wrap: true, alignVertical: 'center' });
const sel = v => ({ value: v === '' || v == null ? '' : String(v), type: String });

export async function unduhExcel({ jamaah, status, kloter }) {
  const jm = jamaah();
  const lembarJamaah = {
    sheet: 'Data jamaah', stickyRowsCount: 1,
    columns: KOLOM.map(([t]) => ({ width: t === 'Nama' ? 34 : t === 'Catatan' || t === 'Pendamping' ? 28 : Math.max(10, t.length + 2) })),
    data: [KOLOM.map(([t]) => kepala(t)), ...jm.map(j => KOLOM.map(([, , f]) => sel(f(j))))]
  };
  const lembarStatus = status().map(s => ({
    sheet: 'Status ' + s.mode, stickyRowsCount: 1, stickyColumnsCount: 2,
    columns: [{ width: 14 }, { width: 34 }, { width: 8 }, { width: 6 }, ...s.kegiatan.map(k => ({ width: Math.max(12, Math.min(22, k.length + 2)) }))],
    data: [[kepala('Nomor Porsi'), kepala('Nama'), kepala('Romb.'), kepala('Regu'), ...s.kegiatan.map(kepala)],
      ...s.baris.map(b => [sel(b.j.porsi), sel(b.j.name), sel(b.j.r), sel(b.j.g), ...b.sel.map(v => sel(v ? (/^\d{4}-/.test(v) ? tglId(v) + v.slice(10) : v) : ''))])]
  }));
  const hari = new Date().toISOString().slice(0, 10);
  await writeXlsxFile([lembarJamaah, ...lembarStatus], { fontFamily: 'Arial', fontSize: 10 })
    .toFile(`Monitoring ${String(kloter || 'kloter').replace(/[\\/:*?"<>|]+/g, ' ')} ${hari}.xlsx`);
}

// Baca lembar pertama yang punya kolom "Nomor Porsi"; kembalikan baris siap kirim + ringkasan.
export async function bacaExcel(file, porsiAda) {
  const lembar = await readXlsxFile(file);
  for (const { sheet, data } of lembar) {
    const iKepala = data.findIndex(r => r.some(v => String(v ?? '').trim().toLowerCase() === 'nomor porsi'));
    if (iKepala < 0) continue;
    const kepalaBaris = data[iKepala].map(v => String(v ?? '').trim().toLowerCase());
    const pos = KOLOM.filter(([, k]) => k).map(([t, k]) => [k, kepalaBaris.indexOf(t.toLowerCase())]).filter(([, i]) => i >= 0);
    const rows = [], galat = [];
    data.slice(iKepala + 1).forEach((r, n) => {
      const o = {};
      pos.forEach(([k, i]) => { let v = r[i]; if (v instanceof Date) v = v.toISOString().slice(0, 10); o[k] = v == null ? '' : String(v).trim(); });
      if (!Object.values(o).some(Boolean)) return;
      if (!o.porsi) { galat.push(`Baris ${iKepala + n + 2}: Nomor Porsi kosong`); return; }
      if (!porsiAda.has(o.porsi) && !o.nama) { galat.push(`Baris ${iKepala + n + 2}: porsi baru ${o.porsi} tanpa nama`); return; }
      rows.push(o);
    });
    return { sheet, kolom: pos.map(([k]) => KOLOM.find(x => x[1] === k)[0]), rows, galat,
      baru: rows.filter(r => !porsiAda.has(r.porsi)).length, ubah: rows.filter(r => porsiAda.has(r.porsi)).length };
  }
  throw new Error('Tidak ada lembar dengan kolom "Nomor Porsi". Pakai file hasil Unduh Excel sebagai templat.');
}
