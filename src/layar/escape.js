// Tombol Escape menutup lembar/dialog yang paling atas (urutan sama dengan urutan tampil di View).
import { useEffect, useRef } from 'react';

const URUTAN = v => [
  [v.hasWa, v.closeWa], [v.hasPp, v.closePp], [v.hasSync, v.closeSync],
  [v.tgJ, v.tgJ?.batal], [v.mqDlg, v.mqDlg?.batal], [v.galeri, v.galeri?.tutup], [v.fotoDlg, v.fotoDlg?.batal],
  [v.tglJadwal, v.tglJadwal?.tutup], [v.hasPdf, v.closePdf], [v.hasPicker, v.closePicker], [v.hasConfirm, v.closeConfirm],
  [v.hasSus, v.closeSus], [v.hasUl, v.closeUl], [v.hasSaf, v.closeSaf], [v.hasSlotDlg, v.closeSlotDlg], [v.hasSel, v.closeSel]
];

export function useTutupDenganEscape(v) {
  const ref = useRef(v);
  ref.current = v;
  useEffect(() => {
    const tekan = e => {
      if (e.key !== 'Escape') return;
      const atas = URUTAN(ref.current).find(([buka, tutup]) => buka && typeof tutup === 'function');
      if (atas) { e.preventDefault(); atas[1](); }
    };
    window.addEventListener('keydown', tekan);
    return () => window.removeEventListener('keydown', tekan);
  }, []);
}
