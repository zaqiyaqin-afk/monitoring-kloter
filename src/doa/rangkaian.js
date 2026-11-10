// Susunan doa per kegiatan. Hanya id doa dan judul bagian; isi doa diambil dari Supabase (wajib login).
export const KEGIATAN = [
 {
  "id": "perjalanan",
  "nama": "Berangkat & perjalanan",
  "ket": "Keluar rumah, pesawat, tiba di Saudi",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Berangkat",
    "ket": null,
    "doa": [
     {
      "id": "perjalanan-01",
      "ket": null
     },
     {
      "id": "perjalanan-02",
      "ket": null
     },
     {
      "id": "perjalanan-03",
      "ket": null
     }
    ]
   },
   {
    "judul": "Tiba",
    "ket": null,
    "doa": [
     {
      "id": "perjalanan-04",
      "ket": null
     },
     {
      "id": "perjalanan-05",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M2 16l20-8-4 10-6-2-3 4v-5"
 },
 {
  "id": "ihram",
  "nama": "Ihram & niat",
  "ket": "Shalat ihram, niat, talbiyah",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Ihram",
    "ket": null,
    "doa": [
     {
      "id": "ihram-01",
      "ket": null
     },
     {
      "id": "ihram-02",
      "ket": null
     },
     {
      "id": "ihram-03",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M6 3h12l-2 18H8z"
 },
 {
  "id": "makkah",
  "nama": "Masuk Makkah",
  "ket": "Kota Makkah, Babussalam, melihat Ka'bah",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Masuk Makkah & Masjidil Haram",
    "ket": null,
    "doa": [
     {
      "id": "makkah-01",
      "ket": null
     },
     {
      "id": "makkah-02",
      "ket": null
     },
     {
      "id": "makkah-03",
      "ket": null
     },
     {
      "id": "makkah-04",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M4 7l8-3 8 3v11l-8 3-8-3zM4 7l8 3 8-3M12 10v11"
 },
 {
  "id": "thawaf",
  "nama": "Thawaf",
  "ket": "7 putaran, langkah demi langkah",
  "mode": "langkah",
  "bagian": [
   {
    "judul": "Sebelum mulai thawaf",
    "ket": "Pilih niat sesuai jenis thawaf yang dikerjakan.",
    "doa": [
     {
      "id": "thawaf-01",
      "ket": "Untuk thawaf qudum"
     },
     {
      "id": "thawaf-02",
      "ket": "Untuk thawaf sunnah"
     }
    ]
   },
   {
    "judul": "Putaran 1 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-03",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Putaran 2 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-05",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Putaran 3 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-06",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Putaran 4 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-07",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Putaran 5 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-08",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Putaran 6 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-09",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Putaran 7 dari 7",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-10",
      "ket": null
     },
     {
      "id": "thawaf-04",
      "ket": "Dibaca setiap sampai di antara Rukun Yamani dan Hajar Aswad"
     }
    ]
   },
   {
    "judul": "Setelah thawaf: Multazam",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-11",
      "ket": null
     }
    ]
   },
   {
    "judul": "Shalat sunnah thawaf di Maqam Ibrahim",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-12",
      "ket": null
     }
    ]
   },
   {
    "judul": "Di Hijr Ismail",
    "ket": null,
    "doa": [
     {
      "id": "thawaf-13",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M12 3a9 9 0 1 1-9 9M12 3l-3 3m3-3l3 3"
 },
 {
  "id": "sai",
  "nama": "Sa'i",
  "ket": "7 perjalanan Shafa–Marwah",
  "mode": "langkah",
  "bagian": [
   {
    "judul": "Minum air zamzam",
    "ket": "Dikerjakan sebelum memulai sa'i.",
    "doa": [
     {
      "id": "sai-01",
      "ket": null
     }
    ]
   },
   {
    "judul": "Menuju bukit Shafa",
    "ket": null,
    "doa": [
     {
      "id": "sai-02",
      "ket": null
     }
    ]
   },
   {
    "judul": "Di bukit Shafa",
    "ket": "Menghadap Ka'bah sebelum perjalanan pertama.",
    "doa": [
     {
      "id": "sai-03",
      "ket": null
     }
    ]
   },
   {
    "judul": "Perjalanan 1 dari 7 · Shafa → Marwah",
    "ket": null,
    "doa": [
     {
      "id": "sai-04",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-13",
      "ket": "Tiba di bukit Marwah"
     }
    ]
   },
   {
    "judul": "Perjalanan 2 dari 7 · Marwah → Shafa",
    "ket": null,
    "doa": [
     {
      "id": "sai-07",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-03",
      "ket": "Tiba di bukit Shafa"
     }
    ]
   },
   {
    "judul": "Perjalanan 3 dari 7 · Shafa → Marwah",
    "ket": null,
    "doa": [
     {
      "id": "sai-08",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-13",
      "ket": "Tiba di bukit Marwah"
     }
    ]
   },
   {
    "judul": "Perjalanan 4 dari 7 · Marwah → Shafa",
    "ket": null,
    "doa": [
     {
      "id": "sai-09",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-03",
      "ket": "Tiba di bukit Shafa"
     }
    ]
   },
   {
    "judul": "Perjalanan 5 dari 7 · Shafa → Marwah",
    "ket": null,
    "doa": [
     {
      "id": "sai-10",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-13",
      "ket": "Tiba di bukit Marwah"
     }
    ]
   },
   {
    "judul": "Perjalanan 6 dari 7 · Marwah → Shafa",
    "ket": null,
    "doa": [
     {
      "id": "sai-11",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-03",
      "ket": "Tiba di bukit Shafa"
     }
    ]
   },
   {
    "judul": "Perjalanan 7 dari 7 · Shafa → Marwah",
    "ket": "Sa'i selesai di bukit Marwah.",
    "doa": [
     {
      "id": "sai-12",
      "ket": null
     },
     {
      "id": "sai-05",
      "ket": "Di antara dua pilar hijau"
     },
     {
      "id": "sai-06",
      "ket": "Doa tambahan"
     },
     {
      "id": "sai-13",
      "ket": "Tiba di bukit Marwah"
     }
    ]
   }
  ],
  "ikon": "M4 18h4V8M20 18h-4V8M8 12h8"
 },
 {
  "id": "tahallul",
  "nama": "Tahallul",
  "ket": "Mencukur atau menggunting rambut",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Tahallul",
    "ket": null,
    "doa": [
     {
      "id": "tahallul-01",
      "ket": null
     },
     {
      "id": "tahallul-02",
      "ket": null
     },
     {
      "id": "tahallul-03",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M6 6l12 12M6 18L18 6"
 },
 {
  "id": "armuzna",
  "nama": "Arafah · Muzdalifah · Mina",
  "ket": "Wukuf, mabit, melontar jumrah",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Arafah",
    "ket": null,
    "doa": [
     {
      "id": "armuzna-01",
      "ket": null
     },
     {
      "id": "armuzna-02",
      "ket": null
     },
     {
      "id": "armuzna-03",
      "ket": null
     },
     {
      "id": "armuzna-04",
      "ket": null
     },
     {
      "id": "armuzna-05",
      "ket": null
     },
     {
      "id": "armuzna-06",
      "ket": null
     }
    ]
   },
   {
    "judul": "Muzdalifah",
    "ket": null,
    "doa": [
     {
      "id": "armuzna-07",
      "ket": null
     },
     {
      "id": "armuzna-08",
      "ket": null
     },
     {
      "id": "armuzna-09",
      "ket": null
     }
    ]
   },
   {
    "judul": "Mina & jumrah",
    "ket": null,
    "doa": [
     {
      "id": "armuzna-10",
      "ket": null
     },
     {
      "id": "armuzna-11",
      "ket": null
     },
     {
      "id": "armuzna-12",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M3 20l6-10 4 6 3-4 5 8z"
 },
 {
  "id": "wada",
  "nama": "Thawaf wada'",
  "ket": "Pamit dari Baitullah",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Thawaf wada'",
    "ket": null,
    "doa": [
     {
      "id": "wada-01",
      "ket": null
     },
     {
      "id": "wada-02",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M4 7l8-3 8 3v11l-8 3-8-3zM9 13l2 2 4-4"
 },
 {
  "id": "madinah",
  "nama": "Madinah & ziarah",
  "ket": "Masjid Nabawi, Raudhah, Baqi', Uhud",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Masjid Nabawi",
    "ket": null,
    "doa": [
     {
      "id": "madinah-01",
      "ket": null
     },
     {
      "id": "madinah-02",
      "ket": null
     },
     {
      "id": "madinah-03",
      "ket": null
     },
     {
      "id": "madinah-04",
      "ket": null
     },
     {
      "id": "madinah-05",
      "ket": null
     },
     {
      "id": "madinah-06",
      "ket": null
     }
    ]
   },
   {
    "judul": "Ziarah",
    "ket": null,
    "doa": [
     {
      "id": "madinah-07",
      "ket": null
     },
     {
      "id": "madinah-08",
      "ket": null
     },
     {
      "id": "madinah-09",
      "ket": null
     }
    ]
   },
   {
    "judul": "Masjid lain",
    "ket": null,
    "doa": [
     {
      "id": "madinah-10",
      "ket": null
     },
     {
      "id": "madinah-11",
      "ket": null
     }
    ]
   },
   {
    "judul": "Pamit dari Madinah",
    "ket": null,
    "doa": [
     {
      "id": "madinah-12",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M5 21V10l7-6 7 6v11M10 21v-6h4v6"
 },
 {
  "id": "pulang",
  "nama": "Pulang",
  "ket": "Tiba di rumah, menyambut tamu",
  "mode": "daftar",
  "bagian": [
   {
    "judul": "Sampai di rumah",
    "ket": null,
    "doa": [
     {
      "id": "pulang-02",
      "ket": null
     },
     {
      "id": "pulang-01",
      "ket": null
     }
    ]
   },
   {
    "judul": "Menyambut tamu",
    "ket": null,
    "doa": [
     {
      "id": "pulang-03",
      "ket": null
     },
     {
      "id": "pulang-05",
      "ket": null
     },
     {
      "id": "pulang-04",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M3 11l9-7 9 7v9H3zM9 20v-6h6v6"
 },
 {
  "id": "wirid",
  "nama": "Wirid & doa harian",
  "ket": "Ziarah, tahlil, wirid, shalat sunnah, sholawat",
  "mode": "pilih",
  "bagian": [
   {
    "judul": "Ziarah kubur",
    "ket": null,
    "doa": [
     {
      "id": "wirid-01",
      "ket": null
     },
     {
      "id": "wirid-02",
      "ket": null
     }
    ]
   },
   {
    "judul": "Tawassul & tahlil",
    "ket": null,
    "doa": [
     {
      "id": "wirid-03",
      "ket": null
     },
     {
      "id": "wirid-04",
      "ket": null
     },
     {
      "id": "wirid-05",
      "ket": null
     },
     {
      "id": "wirid-06",
      "ket": null
     }
    ]
   },
   {
    "judul": "Wirid & dzikir",
    "ket": null,
    "doa": [
     {
      "id": "wirid-07",
      "ket": null
     },
     {
      "id": "wirid-08",
      "ket": null
     },
     {
      "id": "wirid-09",
      "ket": null
     }
    ]
   },
   {
    "judul": "Shalat sunnah, qunut & Jumat",
    "ket": null,
    "doa": [
     {
      "id": "wirid-10",
      "ket": null
     },
     {
      "id": "wirid-11",
      "ket": null
     },
     {
      "id": "wirid-12",
      "ket": null
     },
     {
      "id": "wirid-13",
      "ket": null
     },
     {
      "id": "wirid-14",
      "ket": null
     },
     {
      "id": "wirid-15",
      "ket": null
     },
     {
      "id": "wirid-16",
      "ket": null
     }
    ]
   },
   {
    "judul": "Sholawat",
    "ket": null,
    "doa": [
     {
      "id": "wirid-17",
      "ket": null
     },
     {
      "id": "wirid-18",
      "ket": null
     },
     {
      "id": "wirid-19",
      "ket": null
     },
     {
      "id": "wirid-20",
      "ket": null
     },
     {
      "id": "wirid-21",
      "ket": null
     },
     {
      "id": "wirid-22",
      "ket": null
     },
     {
      "id": "wirid-23",
      "ket": null
     }
    ]
   },
   {
    "judul": "Pergantian tahun & Muharram",
    "ket": null,
    "doa": [
     {
      "id": "wirid-24",
      "ket": null
     },
     {
      "id": "wirid-25",
      "ket": null
     },
     {
      "id": "wirid-26",
      "ket": null
     },
     {
      "id": "wirid-27",
      "ket": null
     },
     {
      "id": "wirid-28",
      "ket": null
     }
    ]
   }
  ],
  "ikon": "M12 3v18M7 7h10M7 17h10"
 }
];
