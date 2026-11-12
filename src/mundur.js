// Tumpukan langkah kembali milik layar dalam (Doa, Kultum, dll.) supaya tombol back HP dan tombol back aplikasi menempuh jalur yang sama.
import { useEffect, useRef } from 'react';

const tumpuk = [];

// Penangan teratas dicoba lebih dulu; true = langkah kembali sudah ditangani.
export function jalankanMundur() {
  for (let i = tumpuk.length - 1; i >= 0; i--) if (tumpuk[i].current()) return true;
  return false;
}

export function useMundur(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => { tumpuk.push(ref); return () => { const i = tumpuk.indexOf(ref); if (i >= 0) tumpuk.splice(i, 1); }; }, []);
}
