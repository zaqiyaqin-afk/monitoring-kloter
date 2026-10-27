// Penyimpanan di perangkat. Antrean perubahan disimpan dua kali
// (localStorage + IndexedDB) agar tetap ada walau salah satunya dibersihkan browser.

const K = { cfg: 'mk.cfg', queue: 'mk.queue', snap: 'mk.snap' };

function baca(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function tulis(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

export const bacaCfg = () => baca(K.cfg);
export const simpanCfg = cfg => tulis(K.cfg, cfg);
export const bacaSnap = () => baca(K.snap);
export const simpanSnap = snap => tulis(K.snap, snap);
export const bacaAntrean = () => baca(K.queue) || [];

export function simpanAntrean(queue) {
  tulis(K.queue, queue);
  idb('put', queue);
}

export function bacaAntreanCadangan(cb) { idb('get', null, cb); }

function idb(op, val, cb) {
  try {
    const r = indexedDB.open('kloter', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => {
      const db = r.result;
      if (op === 'put') {
        const tx = db.transaction('kv', 'readwrite');
        tx.objectStore('kv').put(JSON.parse(JSON.stringify(val)), 'queue');
        tx.oncomplete = tx.onerror = () => db.close();
      } else {
        const q = db.transaction('kv').objectStore('kv').get('queue');
        q.onsuccess = () => { db.close(); cb(q.result || []); };
        q.onerror = () => { db.close(); cb([]); };
      }
    };
    r.onerror = () => cb && cb([]);
  } catch (e) { if (cb) cb([]); }
}

// Minta browser agar data aplikasi tidak dihapus otomatis (penting di iPhone).
export function mintaPenyimpananTetap() {
  try {
    if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(() => {});
  } catch (e) {}
}
