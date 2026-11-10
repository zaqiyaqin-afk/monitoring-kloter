// Kerangka 40 materi kultum ba'da Maghrib dan cara memilih materi untuk tiap malam.
// Kelompok: A umum, B Madinah, C Makkah sebelum Armuzna, D Armuzna (terkunci tanggal Hijriah), E setelah haji.
// Dalil hanya rujukan; teks lengkapnya dibacakan dari mushaf atau kitab. Isi wajib diperiksa pembimbing ibadah.

const m = (id, judul, dalil, poin, penutup, extra) => ({ id, kel: id[0], judul, dalil, poin, penutup, ...extra });

export const MATERI = [
  m('A1', 'Meluruskan niat sejak hari pertama', 'HR Bukhari dan Muslim ("Sesungguhnya amal itu tergantung niatnya"); QS Al-Bayyinah 98:5',
    ['Niat menentukan nilai seluruh perjalanan', 'Godaan pamer, misalnya foto untuk dipamerkan di media sosial', 'Memperbarui niat setiap memulai ibadah'], 'Mengajak hadirin memperbarui niat bersama.'),
  m('A2', 'Sabar, bekal utama di tanah suci', 'QS Al-Baqarah 2:153; QS Az-Zumar 39:10',
    ['Antrean, cuaca panas, makanan dan layanan yang berbeda dari rumah', 'Sabar adalah ibadah yang pahalanya tanpa batas', 'Reaksi pertama saat kecewa menentukan'], 'Doa memohon kesabaran.'),
  m('A3', 'Menjaga kesehatan adalah bagian dari ibadah', 'QS Al-Baqarah 2:195; HR Bukhari ("Dua nikmat yang banyak manusia tertipu: sehat dan waktu luang")',
    ['Minum cukup, payung, masker, istirahat', 'Jangan memaksakan ibadah sunnah sampai mengganggu yang wajib', 'Segera lapor petugas kesehatan bila sakit'], 'Puncak ibadah, wukuf di Arafah, masih di depan.'),
  m('A4', 'Ukhuwah dalam satu rombongan', 'QS Al-Hujurat 49:10; HR Bukhari dan Muslim ("Tidak beriman salah seorang di antara kalian sampai ia mencintai saudaranya...")',
    ['Sekamar dengan kebiasaan yang berbeda', 'Saling membantu, terutama jamaah lansia', 'Menghindari gunjingan di grup WhatsApp'], 'Saling memaafkan di antara hadirin.'),
  m('A5', 'Memuliakan jamaah lansia', 'HR Tirmidzi ("Bukan golongan kami orang yang tidak menyayangi yang muda dan tidak menghormati yang tua"); QS Al-Isra 17:23–24',
    ['Sebagian besar jamaah adalah lansia', 'Bantuan kecil: menuntun jalan, membantu wudhu, mengingatkan minum', 'Melayani mereka bernilai ibadah'], 'Doa untuk orang tua kita.'),
  m('A6', 'Menjaga shalat berjamaah tepat waktu', 'QS An-Nisa 4:103; HR Bukhari dan Muslim (shalat berjamaah 27 derajat)',
    ['Waktu shalat di Saudi berbeda dengan di tanah air', 'Bila masjid jauh atau badan lelah, berjamaah di hotel', 'Jangan sampai shalat terlewat karena belanja atau tidur'], 'Ajakan saling membangunkan untuk Subuh.'),

  m('B1', 'Madinah, kota yang dicintai Nabi', 'HR Bukhari dan Muslim (doa Nabi agar Madinah dicintai seperti Makkah atau lebih); HR Bukhari dan Muslim ("Iman akan kembali ke Madinah...")',
    ['Kota hijrah dan pusat dakwah pertama', 'Menjaga adab: suara pelan, kebersihan, tertib', 'Memanfaatkan waktu untuk shalat di Masjid Nabawi'], 'Doa agar diberi keberkahan selama di Madinah.'),
  m('B2', 'Shalat di Masjid Nabawi', 'HR Bukhari dan Muslim ("Shalat di masjidku ini lebih baik dari seribu shalat di masjid lain, kecuali Masjidil Haram")',
    ['Adab masuk masjid dan shalat tahiyatul masjid', 'Shalat arbain bukan rukun atau wajib haji, jadi jangan dipaksakan bila sakit', 'Berangkat lebih awal agar tidak berdesakan'], 'Ajakan menjaga shalat berjamaah selama di Madinah.'),
  m('B3', 'Adab ziarah ke makam Rasulullah', 'QS Al-Ahzab 33:56; HR Abu Dawud (salam kepada Nabi dijawab beliau)',
    ['Mengucapkan salam dengan tenang dan tidak berdesakan', 'Berdoa menghadap kiblat', 'Mengikuti arahan petugas masjid'], 'Membaca shalawat bersama.'),
  m('B4', 'Raudhah, taman di antara taman surga', 'HR Bukhari dan Muslim ("Antara rumahku dan mimbarku adalah taman dari taman-taman surga")',
    ['Masuk sesuai jadwal dan izin yang berlaku', 'Jangan saling dorong, terutama terhadap lansia', 'Berdoa secukupnya lalu memberi giliran kepada yang lain'], 'Menyiapkan daftar doa sebelum masuk.'),
  m('B5', 'Shalawat dan bukti cinta kepada Nabi', 'HR Muslim (bershalawat sekali, Allah bershalawat sepuluh kali); QS Ali Imran 3:31',
    ['Keutamaan shalawat', 'Cinta dibuktikan dengan mengikuti sunnah', 'Sunnah sederhana yang bisa dibawa pulang'], 'Memilih satu sunnah untuk diamalkan.'),
  m('B6', 'Masjid Quba, masjid pertama', 'QS At-Taubah 9:108; HR Tirmidzi dan Ibnu Majah (shalat di Quba seperti pahala umrah)',
    ['Sejarah masjid pertama yang dibangun Nabi', 'Bersuci dari penginapan sebelum berangkat', 'Nabi rutin mengunjunginya'], 'Niat yang ikhlas dalam setiap ziarah.'),
  m('B7', 'Pelajaran dari Uhud: taat kepada pemimpin', 'QS Ali Imran 3:152; HR Bukhari ("Uhud adalah gunung yang mencintai kami dan kami mencintainya")',
    ['Pasukan pemanah turun karena tergiur harta rampasan', 'Mengikuti aturan rombongan dan petugas menjaga keselamatan bersama', 'Teladan syuhada Uhud'], 'Doa untuk para syuhada.'),
  m('B8', 'Kaum Anshar dan semangat mendahulukan orang lain', 'QS Al-Hasyr 59:9',
    ['Anshar menyambut kaum Muhajirin dengan hartanya', 'Berbagi tempat, makanan, dan bantuan dengan teman sekamar', 'Mendahulukan yang lemah'], 'Ajakan berbuat satu kebaikan untuk teman sekamar.'),
  m('B9', 'Ziarah Baqi dan mengingat kematian', 'HR Muslim (izin ziarah kubur karena mengingatkan akhirat); HR Muslim (doa salam untuk ahli kubur)',
    ['Baqi tempat dimakamkannya banyak sahabat dan keluarga Nabi', 'Mengingat mati memperbaiki niat dan amal', 'Mendoakan keluarga yang telah wafat'], 'Membaca doa ziarah kubur bersama.'),

  m('C1', 'Tiba di tanah haram', 'QS Ali Imran 3:96–97; QS Al-Baqarah 2:125',
    ['Makkah sebagai tanah haram dan tempat yang aman', 'Larangan merusak dan berbuat zalim di dalamnya', 'Syukur karena telah sampai'], 'Doa syukur bersama.'),
  m('C2', 'Makna ihram: semua setara di hadapan Allah', 'QS Al-Hujurat 49:13',
    ['Dua helai kain putih mengingatkan pada kafan', 'Larangan ihram melatih kendali diri', 'Gelar dan jabatan ditanggalkan; rincian larangan merujuk buku manasik'], 'Ajakan menjaga diri selama berihram.'),
  m('C3', 'Menjaga lisan dan perilaku', 'QS Al-Baqarah 2:197; HR Bukhari dan Muslim (berhaji tanpa rafats dan fusuq kembali seperti hari dilahirkan)',
    ['Arti rafats, fusuq, dan jidal', 'Contoh nyata di antrean, bus, dan kamar', 'Bekal terbaik adalah takwa'], 'Saling mengingatkan dengan lembut.'),
  m('C4', "Thawaf dan adab di sekitar Ka'bah", 'QS Al-Hajj 22:29; HR Bukhari dan Muslim (perkataan Umar kepada Hajar Aswad)',
    ['Makna berputar mengelilingi Baitullah', 'Mencium Hajar Aswad tidak wajib, cukup berisyarat dari jauh', 'Jangan menyakiti orang lain demi ibadah sunnah'], 'Menjaga rombongan tetap bersama saat thawaf.'),
  m('C5', "Sa'i dan keteguhan Siti Hajar", 'QS Al-Baqarah 2:158; HR Bukhari (kisah Hajar dan Ismail, riwayat Ibnu Abbas)',
    ['Ikhtiar seorang ibu di lembah yang tandus', 'Ikhtiar dan tawakal berjalan bersama', 'Zamzam sebagai jawaban atas ikhtiar'], 'Doa untuk ibu kita.'),
  m('C6', 'Zamzam dan adab meminumnya', 'HR Ibnu Majah dan Ahmad ("Air zamzam sesuai niat peminumnya"); HR Muslim (zamzam penuh berkah)',
    ['Berdoa ketika meminumnya', 'Tidak berebut di tempat air', 'Mengikuti ketentuan petugas soal membawa zamzam pulang'], 'Menyiapkan niat dan doa sebelum minum.'),
  m('C7', 'Keutamaan shalat di Masjidil Haram', 'HR Ahmad dan Ibnu Majah (shalat di Masjidil Haram seratus ribu kali lipat); HR Bukhari dan Muslim (tiga masjid yang dituju)',
    ['Memanfaatkan waktu untuk shalat berjamaah', 'Tetap menjaga tenaga untuk Armuzna', 'Bila tidak sanggup ke masjid, tetap berjamaah di hotel'], 'Niat memperbanyak ibadah tanpa mengorbankan kesehatan.'),
  m('C8', 'Nabi Ibrahim dan keluarga yang taat', 'QS Al-Baqarah 2:127–128; QS Ibrahim 14:37',
    ["Ibrahim dan Ismail meninggikan fondasi Ka'bah", 'Doa Ibrahim untuk anak keturunannya', 'Mendoakan keluarga di tanah air'], 'Doa untuk keluarga dan anak cucu.'),
  m('C9', 'Berdoa di waktu dan tempat yang mustajab', 'QS Al-Baqarah 2:186; QS Ghafir 40:60; HR Muslim (dekatnya hamba saat sujud); HR Abu Dawud dan Tirmidzi (doa antara azan dan iqamah)',
    ['Adab berdoa', 'Waktu-waktu yang mustajab', 'Mencatat doa titipan keluarga dan tetangga'], 'Menuliskan daftar doa malam ini.'),
  m('C10', "Qana'ah: berbelanja secukupnya", 'HR Bukhari dan Muslim ("Kaya bukanlah banyaknya harta, tetapi kaya hati"); QS Al-Isra 17:26–27',
    ['Oleh-oleh tidak wajib', 'Memperhatikan batas berat bagasi', 'Waktu di tanah suci lebih berharga untuk ibadah'], 'Ajakan menahan diri dari belanja berlebihan.'),
  m('C11', 'Memperbanyak istighfar dan taubat', 'QS Az-Zumar 39:53; QS Nuh 71:10–12; HR Muslim (Nabi beristighfar seratus kali sehari)',
    ['Luasnya ampunan Allah', 'Buah istighfar dalam kehidupan', 'Taubat dengan memperbaiki diri'], 'Membaca istighfar bersama.'),
  m('C12', 'Bersedekah di tanah suci', 'QS Al-Baqarah 2:261; HR Tirmidzi (senyum kepada saudara adalah sedekah)',
    ['Sedekah tidak harus berupa uang', 'Membantu sesama jamaah termasuk sedekah', 'Berhati-hati dengan permintaan uang yang mencurigakan'], 'Ajakan satu sedekah kecil besok hari.'),

  m('D1', 'Bersiap menuju Armuzna', 'HR Muslim ("Ambillah dariku manasik kalian")',
    ['Urutan kegiatan 8–13 Dzulhijjah dan jadwal bus', 'Barang bawaan secukupnya, obat pribadi, dan kartu identitas', 'Menjaga kesehatan dan tidak berpisah dari rombongan'], 'Niat dan doa sebelum berangkat.', { dzh: 7 }),
  m('D2', 'Wukuf, inti ibadah haji', 'HR Tirmidzi, Abu Dawud, Nasa\'i, dan Ibnu Majah ("Haji adalah Arafah"); HR Muslim (hari Arafah, hari terbanyak hamba dibebaskan dari neraka); HR Tirmidzi (sebaik-baik doa adalah doa hari Arafah)',
    ['Waktu wukuf dan batas wilayah Arafah', 'Menyiapkan doa dan dzikir', 'Bagi lansia dan yang sakit, mengikuti skema yang ditetapkan petugas'], 'Menuliskan doa-doa untuk esok hari.', { dzh: 8 }),
  m('D3', 'Idul Adha dan teladan Nabi Ibrahim', 'QS Ash-Shaffat 37:102–107; QS Al-Hajj 22:37',
    ['Ketaatan Ibrahim dan Ismail', 'Yang sampai kepada Allah adalah takwa, bukan daging atau darahnya', "Dam bagi jamaah haji tamattu' merujuk buku manasik"], 'Takbir bersama.', { dzh: 10 }),
  m('D4', 'Hari tasyriq dan makna melontar jumrah', 'QS Al-Baqarah 2:203; HR Muslim (hari tasyriq adalah hari makan, minum, dan berdzikir)',
    ['Memperbanyak dzikir di Mina', 'Melontar sebagai simbol melawan godaan', 'Jadwal melontar mengikuti petugas, dan badal lontar bagi jamaah yang uzur'], 'Dzikir dan takbir bersama.', { dzh: 11 }),
  m('D5', 'Nafar dan menyempurnakan haji', 'QS Al-Baqarah 2:203 (keringanan bagi yang ingin segera meninggalkan Mina dalam dua hari)',
    ['Pilihan nafar awal atau nafar tsani mengikuti keputusan kloter', "Amalan yang masih harus diselesaikan, seperti thawaf ifadah dan sa'i", 'Syukur atas nikmat sampai di titik ini'], 'Doa agar haji diterima.', { dzh: 12 }),

  m('E1', 'Ciri-ciri haji mabrur', 'HR Bukhari dan Muslim ("Haji mabrur tidak ada balasan baginya kecuali surga"); HR Ahmad (kebaikan haji: memberi makan dan bertutur kata baik)',
    ['Mabrur tampak dari perubahan setelah pulang', 'Dermawan dan santun dalam berkata', 'Ibadah semakin terjaga'], 'Doa agar haji kita mabrur.'),
  m('E2', 'Syukur setelah menunaikan haji', 'QS Ibrahim 14:7; QS Al-Baqarah 2:200',
    ['Banyak orang yang ingin berhaji belum mendapat kesempatan', 'Syukur dengan lisan dan perbuatan', 'Memperbanyak dzikir setelah manasik selesai'], 'Sujud syukur atau doa syukur bersama.'),
  m('E3', 'Istiqamah setelah pulang', 'QS Fushshilat 41:30; HR Muslim ("Katakanlah aku beriman kepada Allah, lalu istiqamahlah")',
    ['Semangat ibadah biasanya menurun setelah pulang', 'Memilih satu atau dua amalan yang dijaga terus', 'Mencari lingkungan yang baik'], 'Menuliskan satu amalan yang akan dijaga.'),
  m('E4', 'Gelar haji dan rendah hati', 'QS Luqman 31:18; HR Muslim (tidak masuk surga orang yang di hatinya ada kesombongan sebesar zarah)',
    ['Gelar haji bukan tujuan', 'Bahaya merasa lebih baik dari orang lain', 'Rendah hati sebagai tanda haji yang diterima'], 'Doa agar dijauhkan dari sifat sombong.'),
  m('E5', 'Menahan amarah di hari-hari menunggu pulang', 'HR Bukhari ("Jangan marah"); QS Ali Imran 3:134',
    ['Badan lelah, antrean bagasi, jadwal yang berubah', 'Amarah bisa merusak pahala yang sudah dikumpulkan', 'Cara meredam amarah sesuai sunnah'], 'Saling memaafkan sebelum pulang.'),
  m('E6', 'Menjadi teladan di kampung halaman', 'QS Ali Imran 3:110; HR Thabrani (sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain)',
    ['Masyarakat memandang jamaah yang baru pulang', 'Berbagi pengalaman yang bermanfaat, bukan pamer', 'Aktif di masjid dan lingkungan'], 'Niat menjadi manfaat bagi sekitar.'),
  m('E7', 'Memanfaatkan waktu yang tersisa', "QS Al-'Ashr 103:1–3",
    ['Hari-hari terakhir mudah habis untuk belanja dan tidur', 'Thawaf sunnah, tilawah, dan shalat berjamaah', 'Menjaga kesehatan untuk perjalanan pulang'], 'Membuat target ibadah untuk sisa hari.'),
  m('E8', "Thawaf wada' dan pamit dari Baitullah", 'HR Muslim (jangan pulang sebelum akhir urusannya di Baitullah); HR Bukhari dan Muslim (keringanan bagi perempuan yang haid)',
    ["Jadwal thawaf wada' mengikuti petugas", 'Perempuan yang haid mendapat keringanan', 'Doa agar dapat kembali ke tanah suci'], 'Doa perpisahan dengan Baitullah.')
];

export const PER_ID = Object.fromEntries(MATERI.map(x => [x.id, x]));
export const NAMA_KEL = { A: 'Umum', B: 'Madinah', C: 'Makkah', D: 'Armuzna', E: 'Setelah haji' };
export const LAMA_HARI = 41;

const pad = n => String(n).padStart(2, '0');
export const isoTanggal = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const tambahHari = (iso, n) => { const [y, mo, d] = iso.split('-').map(Number); return isoTanggal(new Date(y, mo - 1, d + n)); };

// Tanggal Hijriah (Umm al-Qura) dari tanggal masehi; null bila browser tidak mendukung kalender Islam.
export function hijriah(iso) {
  try {
    const [y, mo, d] = iso.split('-').map(Number);
    const p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(Date.UTC(y, mo - 1, d, 12)));
    return { hari: +p.find(x => x.type === 'day').value, bulan: +p.find(x => x.type === 'month').value };
  } catch (e) { return null; }
}

// Jadwal kultum dari tanggal tiba. Gelombang 1: Madinah 9 hari pertama; gelombang 2: Madinah 9 hari terakhir.
// Malam 7, 8, 10, 11, 12 Dzulhijjah memakai materi D; malam 9 dan 13 Dzulhijjah tidak ada kultum.
export function jadwalKultum(tiba, gelombang) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tiba || '')) return [];
  const g2 = String(gelombang) === '2', hari = [];
  for (let i = 0; i < LAMA_HARI; i++) {
    const tanggal = tambahHari(tiba, i), h = hijriah(tanggal);
    const madinah = g2 ? i >= LAMA_HARI - 9 : i < 9;
    const dzh = h && h.bulan === 12 ? h.hari : 0;
    const sesudahHaji = h ? (h.bulan === 12 && h.hari > 13) || h.bulan === 1 || h.bulan === 2 : false;
    const sebelumHaji = !sesudahHaji;
    let kel = i < 2 ? 'A' : madinah ? 'B' : sebelumHaji ? 'C' : 'E';
    let kunci = null, libur = false;
    if (dzh === 9 || dzh === 13) libur = true;
    else if ([7, 8, 10, 11, 12].includes(dzh)) kunci = MATERI.find(x => x.dzh === dzh).id;
    hari.push({ ke: i + 1, tanggal, hijriah: h, lokasi: madinah ? 'Madinah' : 'Makkah', kel, kunci, libur });
  }
  // E8 (thawaf wada') dipasang pada malam terakhir di Makkah
  const terakhirMakkah = [...hari].reverse().find(x => x.lokasi === 'Makkah' && !x.kunci && !x.libur);
  if (terakhirMakkah) terakhirMakkah.kunci = 'E8';
  const terpakai = new Set(hari.map(x => x.kunci).filter(Boolean));
  const antre = k => MATERI.filter(x => x.kel === k && !x.dzh && !terpakai.has(x.id));
  hari.forEach(x => {
    if (x.kunci || x.libur) { x.materi = x.kunci; return; }
    // Materi Madinah tidak dipakai saat di Makkah, dan sebaliknya
    // Materi "setelah haji" tidak dipakai sebelum Armuzna; malam tanpa materi tersisa diisi petugas
    const cadangan = x.lokasi === 'Madinah' ? ['B', 'A'] : x.kel === 'C' ? ['A', 'C'] : ['A', 'E', 'C'];
    const pilih = [x.kel, ...cadangan].map(k => antre(k)[0]).find(Boolean);
    x.materi = pilih ? pilih.id : null;
    if (pilih) terpakai.add(pilih.id);
  });
  return hari;
}
