// Hanya untuk pengembangan (npm run dev): meniru Web App Apps Script di memori,
// aktif bila localStorage 'mk.mock' = '1'. Tidak ikut ke hasil build.
// Di konsol: __mock.offline(true/false), __mock.gagal(true/false), __mock.log
export function pasangMock() {
  const asli = window.fetch.bind(window);
  const st = { offline: false, gagal: false, log: [], diterima: [], kunci: '1234',
    pengaturan: JSON.parse(localStorage.getItem('mk.mockAtur') || 'null') || { 'Nama PPIH': '', 'Kloter': '', 'Embarkasi': '', 'Gelombang': '', 'Jam Pengingat': '21' } };
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => !st.offline });
  window.__mock = {
    offline(v) { st.offline = v; window.dispatchEvent(new Event(v ? 'offline' : 'online')); },
    gagal(v) { st.gagal = v; },
    get log() { return st.log; },
    get diterima() { return st.diterima; },
    get pengaturan() { return st.pengaturan; },
    get kunci() { return st.kunci; }
  };
  window.fetch = async (input, init = {}) => {
    const url = String(input && input.url || input);
    if (!url.startsWith('https://script.google.com/')) return asli(input, init);
    st.log.push((init.method || 'GET') + ' ' + url.split('?')[0]);
    await new Promise(r => setTimeout(r, 300));
    if (st.offline) throw new TypeError('Failed to fetch');
    if (st.gagal) return new Response(JSON.stringify({ ok: false, error: 'Server sibuk (tiruan)' }));
    const salah = new Response(JSON.stringify({ ok: false, error: 'KODE_SALAH' }));
    if ((init.method || 'GET') === 'POST') {
      const body = JSON.parse(init.body);
      if (body.key !== st.kunci) return salah;
      if (body.aksi === 'gantiKunci') { st.kunci = body.baru; return new Response(JSON.stringify({ ok: true })); }
      st.diterima.push(...body.items);
      body.items.filter(i => i.jenis === 'pengaturan').forEach(i => Object.assign(st.pengaturan, i.nilai));
      localStorage.setItem('mk.mockAtur', JSON.stringify(st.pengaturan));
      const ms = JSON.parse(localStorage.getItem('mk.mockSnap') || '{}'), riw = ms.riwayatUdzur = ms.riwayatUdzur || [];
      body.items.filter(i => i.jenis === 'udzur' && !riw.some(r => r['ID Kirim'] === i.id)).forEach(i => {
        riw.push({ 'Waktu': i.waktu, 'Nomor Porsi': i.porsi, 'Nama': i.nama, 'Status': i.udzur ? 'Udzur' : 'Tidak udzur', 'Alasan': i.alasan, 'Petugas': i.petugas, 'Perangkat': i.perangkat, 'ID Kirim': i.id });
        const j = (ms.jamaah || []).find(x => x['Nomor Porsi'] === i.porsi); if (j) j['Udzur'] = i.udzur ? 'Ya' : 'Tidak';
      });
      localStorage.setItem('mk.mockSnap', JSON.stringify(ms));
      return new Response(JSON.stringify({ ok: true, diterima: body.items.length, diabaikan: 0, dobel: 0 }));
    }
    if (new URL(url).searchParams.get('key') !== st.kunci) return salah;
    const snap = JSON.parse(localStorage.getItem('mk.mockSnap') || localStorage.getItem('mk.snap') || '{}');
    return new Response(JSON.stringify({ ...snap, ok: true, waktu: new Date().toISOString(), pengaturan: { ...st.pengaturan } }));
  };
}
