import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════ CATEGORIES ═══════════════════════ */
const CATEGORIES = [
  { id: "all", label: "Semua Prompt", icon: "◈", sub: "" },
  { id: "pra", label: "Pra-Penelitian", icon: "💡", sub: "A1", group: "A" },
  { id: "skripsi", label: "Bab I-V Skripsi", icon: "📘", sub: "A2a", group: "A" },
  { id: "tesis", label: "Bab I-V Tesis", icon: "📗", sub: "A2b", group: "A" },
  { id: "disertasi", label: "Bab I-V Disertasi", icon: "📕", sub: "A2c", group: "A" },
  { id: "jurnal", label: "Artikel Jurnal", icon: "📄", sub: "A3", group: "A" },
  { id: "pendukung", label: "Pendukung Riset", icon: "🔗", sub: "A4", group: "A" },
  { id: "buku-riset", label: "Buku Hasil Riset", icon: "📚", sub: "A5a", group: "A" },
  { id: "buku-ajar", label: "Buku Referensi/Ajar", icon: "📖", sub: "A5b", group: "A" },
  { id: "buku-populer", label: "Buku Populer/E-book", icon: "✍️", sub: "A5c", group: "A" },
  { id: "kuantitatif", label: "Analisis Kuantitatif", icon: "📊", sub: "B1", group: "B" },
  { id: "kualitatif", label: "Analisis Kualitatif", icon: "🗣️", sub: "B2", group: "B" },
  { id: "evaluasi", label: "Evaluasi & Kebijakan", icon: "📋", sub: "B3", group: "B" },
  { id: "perencanaan", label: "Perencanaan Pembelajaran", icon: "🎯", sub: "C1", group: "C" },
  { id: "asesmen", label: "Asesmen & Evaluasi", icon: "✅", sub: "C2", group: "C" },
  { id: "supervisi", label: "Supervisi & Bimbingan", icon: "👨‍🏫", sub: "C3", group: "C" },
  { id: "coding", label: "Coding & Data", icon: "💻", sub: "D1", group: "D" },
  { id: "komunikasi", label: "Komunikasi & Branding", icon: "📢", sub: "D2", group: "D" },
  { id: "produktivitas", label: "Produktivitas", icon: "⚡", sub: "D3", group: "D" },
];

const GROUP_LABELS = {
  A: "Riset & Penulisan",
  B: "Analisis Data",
  C: "Pengajaran",
  D: "Tools & Produktivitas",
};

const DIFF = {
  beginner: { label: "Dasar", color: "#10b981" },
  intermediate: { label: "Menengah", color: "#f59e0b" },
  advanced: { label: "Lanjutan", color: "#ef4444" },
};

/* ═══════════════════════ 87 PROMPTS ═══════════════════════ */
const PROMPTS = [
  // ─── A1. PRA-PENELITIAN ───
  { id:1, cat:"pra", title:"Eksplorasi & Brainstorming Ide Riset", desc:"Generate topik penelitian berdasarkan bidang, tren terkini, dan gap", difficulty:"beginner",
    tags:["ide riset","brainstorming","topik","tren"],
    prompt:`Anda adalah konsultan riset senior dengan pengalaman luas dalam [BIDANG ILMU]. Bantu saya mengeksplorasi dan menemukan ide penelitian yang potensial.

Informasi awal:
- Bidang keahlian saya: [BIDANG]
- Minat spesifik: [TOPIK YANG DIMINATI]
- Konteks: [PENDIDIKAN/MANAJEMEN/EKONOMI/dll.]
- Level: [SKRIPSI/TESIS/DISERTASI]

Lakukan langkah berikut:
1. **Identifikasi 5 Tren Riset Terkini** — berdasarkan bidang yang disebutkan, identifikasi tren penelitian 3-5 tahun terakhir yang masih relevan
2. **Pemetaan Isu** — petakan isu-isu kritis yang belum banyak diteliti di konteks Indonesia
3. **Generate 10 Ide Topik** — buat 10 topik penelitian potensial dengan format: Judul tentatif + variabel utama + alasan mengapa layak diteliti
4. **Evaluasi Kelayakan** — untuk setiap topik, beri skor (1-5) berdasarkan: novelty, feasibility, relevansi, ketersediaan data
5. **Rekomendasi Top 3** — rekomendasikan 3 topik terbaik beserta justifikasi mendalam

Output dalam format tabel yang terstruktur. Sertakan referensi pendukung jika memungkinkan.` },

  { id:2, cat:"pra", title:"Research Gap Finder", desc:"Identifikasi celah penelitian dari literatur yang ada", difficulty:"advanced",
    tags:["research gap","literatur","novelty","state of the art"],
    prompt:`Anda adalah analis riset yang sangat teliti. Berdasarkan kumpulan artikel/literatur yang saya berikan, identifikasi research gap dengan pendekatan berikut:

1. **Mapping Existing Research** — petakan topik, metode, populasi, dan temuan utama dari setiap artikel
2. **Trend Analysis** — identifikasi tren penelitian 5 tahun terakhir
3. **Methodological Gap** — metode apa yang belum digunakan?
4. **Contextual Gap** — konteks/lokasi/populasi mana yang belum diteliti?
5. **Theoretical Gap** — teori apa yang belum diaplikasikan?
6. **Temporal Gap** — apakah ada studi yang perlu direplikasi dengan data terbaru?
7. **Practical Gap** — rekomendasi praktis apa yang belum diuji secara empiris?

Output yang diharapkan:
- Tabel pemetaan literatur
- 3-5 research gap yang teridentifikasi beserta justifikasi
- Rekomendasi judul penelitian untuk setiap gap

Artikel/literatur: [LAMPIRKAN]` },

  { id:3, cat:"pra", title:"Perumusan Judul Penelitian", desc:"Generate dan evaluasi judul berdasarkan variabel dan konteks", difficulty:"beginner",
    tags:["judul","variabel","penelitian","formulasi"],
    prompt:`Anda adalah pembimbing akademik berpengalaman. Bantu saya merumuskan judul penelitian yang kuat dan layak teliti.

Informasi:
- Bidang: [BIDANG ILMU]
- Variabel yang diminati: [VARIABEL X, Y, Z]
- Konteks/lokasi: [SEKOLAH/UNIVERSITAS/PERUSAHAAN/DAERAH]
- Level: [SKRIPSI/TESIS/DISERTASI]
- Pendekatan: [KUANTITATIF/KUALITATIF/MIXED]

Lakukan:
1. **Generate 10 Variasi Judul** — dengan kombinasi variabel dan konteks yang berbeda
2. **Evaluasi Setiap Judul** berdasarkan:
   - Kejelasan (apakah variabel dan hubungannya jelas?)
   - Spesifisitas (apakah cukup fokus dan tidak terlalu luas?)
   - Kelayakan (apakah bisa diteliti dalam waktu dan sumber daya yang ada?)
   - Novelty (apakah memberikan kontribusi baru?)
3. **Rekomendasi 3 Judul Terbaik** dengan justifikasi
4. **Saran Perbaikan** untuk judul yang kurang kuat

Format: Tabel evaluasi + narasi rekomendasi.` },

  { id:4, cat:"pra", title:"Desain Penelitian", desc:"Pilih paradigma, pendekatan, dan desain yang tepat", difficulty:"advanced",
    tags:["desain","mixed-method","kuantitatif","kualitatif","paradigma"],
    prompt:`Anda adalah metodolog penelitian senior. Bantu saya mendesain penelitian untuk topik: [TOPIK].

Susun desain meliputi:
1. **Paradigma Penelitian** — Positivisme/Interpretivisme/Pragmatisme/Transformatif — jelaskan alasan pemilihan
2. **Pendekatan** — Kuantitatif/Kualitatif/Mixed-Method — jelaskan kesesuaian dengan research questions
3. **Tipe Desain Spesifik** — (misal: Explanatory Sequential, Exploratory Sequential, Convergent, Embedded, Eksperimen, Korelasional, Fenomenologi, Grounded Theory, dll.)
4. **Fase Kuantitatif** (jika ada) — populasi, teknik sampling, ukuran sampel, instrumen, teknik analisis
5. **Fase Kualitatif** (jika ada) — partisipan, teknik pengumpulan data, teknik analisis
6. **Integrasi Data** (jika mixed) — bagaimana data diintegrasikan
7. **Timeline Penelitian** — Gantt chart naratif
8. **Validitas & Reliabilitas** — strategi untuk masing-masing fase
9. **Etika Penelitian** — informed consent, anonimitas, ethical clearance

Referensikan Creswell & Creswell (2018), Creswell & Plano Clark (2018). Format APA 7th Edition.` },

  { id:5, cat:"pra", title:"Penyusunan Proposal Penelitian/Hibah", desc:"Proposal lengkap untuk BIMA, Kemendikbud, internal PT", difficulty:"advanced",
    tags:["proposal","hibah","BIMA","pendanaan","riset"],
    prompt:`Anda adalah konsultan penulisan proposal hibah berpengalaman. Bantu saya menyusun proposal hibah penelitian untuk skema: [BIMA / Penelitian Dasar / Terapan / PKM / Pengabdian].

Informasi:
- Judul: [...]
- Bidang: [...]
- Tim peneliti: [...]
- Anggaran: [RANGE]
- Durasi: [TAHUN]

Komponen proposal:
1. **Ringkasan** — 500 kata: urgensi, tujuan, metode, luaran target
2. **Pendahuluan** — state of the art, research gap, urgensi nasional/global, roadmap keilmuan
3. **Tinjauan Pustaka** — teori utama, studi terdahulu (>60% jurnal internasional 5 tahun terakhir)
4. **Metode Penelitian** — desain, populasi, teknik analisis, tahapan, lokasi
5. **Jadwal Pelaksanaan** — Gantt chart naratif per bulan
6. **Luaran & Target Capaian** — publikasi Q1-Q4, HKI, produk, TKT
7. **Rencana Anggaran Biaya** — rincian per pos (honor, bahan, perjalanan, publikasi)
8. **Daftar Pustaka** — APA 7th Edition
9. **Lampiran** — CV tim, surat pernyataan, biodata

Gunakan bahasa persuasif namun ilmiah. Pastikan alignment antara masalah → tujuan → metode → luaran.` },

  // ─── A2a. BAB I-V SKRIPSI ───
  { id:6, cat:"skripsi", title:"Bab I Skripsi — Pendahuluan", desc:"Latar belakang, rumusan masalah, tujuan, manfaat", difficulty:"beginner",
    tags:["bab 1","pendahuluan","latar belakang","skripsi"],
    prompt:`Anda adalah pembimbing skripsi S1 yang sabar dan detail. Bantu mahasiswa menyusun Bab I Pendahuluan skripsi dengan judul: [JUDUL SKRIPSI].

Informasi:
- Program Studi: [...]
- Variabel: [X dan Y]
- Lokasi penelitian: [...]

Susun komponen berikut:
1. **Latar Belakang Masalah** (±1500 kata)
   - Paragraf 1-2: Konteks umum (fenomena, regulasi, data makro)
   - Paragraf 3-4: Penyempitan ke masalah spesifik (data lokal, observasi awal)
   - Paragraf 5-6: Gap antara kondisi ideal dan realita
   - Paragraf 7: Mengapa penelitian ini penting dilakukan sekarang
   - Paragraf 8: Posisi penelitian ini dibanding penelitian sebelumnya
2. **Identifikasi Masalah** — 4-5 poin masalah yang teridentifikasi
3. **Batasan Masalah** — fokuskan pada variabel dan konteks yang diteliti
4. **Rumusan Masalah** — 2-4 pertanyaan penelitian yang spesifik dan terukur
5. **Tujuan Penelitian** — sesuai rumusan masalah (1:1)
6. **Manfaat Penelitian** — teoretis dan praktis (bagi peneliti, institusi, masyarakat)

Gunakan bahasa akademik formal Bahasa Indonesia. Sisipkan data/fakta pendukung di bagian [PERLU DATA] agar mahasiswa tahu bagian mana yang perlu dilengkapi.` },

  { id:7, cat:"skripsi", title:"Bab II Skripsi — Kajian Pustaka", desc:"Landasan teori, penelitian relevan, kerangka berpikir, hipotesis", difficulty:"beginner",
    tags:["bab 2","kajian pustaka","teori","skripsi"],
    prompt:`Anda adalah pembimbing skripsi S1. Bantu menyusun Bab II Kajian Pustaka untuk skripsi berjudul: [JUDUL].

Variabel penelitian: [X, Y, dan Z jika ada]

Susun komponen:
1. **Landasan Teori**
   - Untuk setiap variabel: definisi menurut 3-4 ahli, dimensi/indikator, teori pendukung
   - Hubungan antar variabel berdasarkan teori
2. **Penelitian yang Relevan** — minimal 10 penelitian terdahulu dalam format:
   - Nama peneliti (tahun), judul, metode, hasil, perbedaan dengan penelitian ini
   - Urutkan kronologis, prioritaskan 5 tahun terakhir
3. **Kerangka Berpikir** — narasi logis yang menghubungkan variabel X → Y (melalui Z jika ada mediasi/moderasi)
4. **Hipotesis Penelitian** — rumuskan Ha untuk setiap hubungan antar variabel

Catatan: Gunakan referensi dari jurnal bereputasi. Format APA 7th Edition. Di bagian yang membutuhkan sumber spesifik, tandai [PERLU REFERENSI].` },

  { id:8, cat:"skripsi", title:"Bab III Skripsi — Metode Penelitian", desc:"Lokasi, populasi-sampel, instrumen, teknik analisis", difficulty:"beginner",
    tags:["bab 3","metode","instrumen","skripsi"],
    prompt:`Anda adalah pembimbing skripsi S1 bidang [BIDANG]. Bantu menyusun Bab III Metode Penelitian untuk skripsi: [JUDUL].

Informasi:
- Pendekatan: [KUANTITATIF/KUALITATIF]
- Lokasi: [...]
- Populasi: [...]

Susun komponen:
1. **Lokasi dan Waktu Penelitian** — deskripsi singkat
2. **Populasi dan Sampel**
   - Populasi: siapa, berapa jumlahnya
   - Teknik sampling: (random/purposive/cluster/dll.) + justifikasi
   - Ukuran sampel: gunakan rumus (Slovin/Krejcie-Morgan/G*Power) + perhitungan
3. **Variabel dan Definisi Operasional** — tabel: variabel → definisi konseptual → definisi operasional → indikator → skala
4. **Instrumen Penelitian** — jenis (kuesioner/tes/observasi), skala Likert, jumlah item per indikator
5. **Uji Validitas dan Reliabilitas** — teknik dan kriteria
6. **Teknik Pengumpulan Data** — prosedur langkah demi langkah
7. **Teknik Analisis Data**
   - Uji prasyarat: normalitas, homogenitas, linearitas, multikolinearitas
   - Uji hipotesis: sesuai desain (regresi/korelasi/t-test/dll.)
   - Software yang digunakan (SPSS/SmartPLS)` },

  { id:9, cat:"skripsi", title:"Bab IV Skripsi — Hasil & Pembahasan", desc:"Deskripsi data, uji prasyarat, uji hipotesis, pembahasan", difficulty:"intermediate",
    tags:["bab 4","hasil","pembahasan","hipotesis","skripsi"],
    prompt:`Anda adalah pembimbing skripsi S1. Bantu menyusun Bab IV Hasil Penelitian dan Pembahasan berdasarkan data yang saya berikan.

Judul: [JUDUL]
Data/output yang saya lampirkan: [TABEL SPSS / SMARTPLS / DATA MENTAH]

Susun komponen:
1. **Deskripsi Data Penelitian**
   - Profil responden (tabel frekuensi)
   - Statistik deskriptif per variabel (mean, SD, min, max, kategori)
2. **Uji Prasyarat Analisis**
   - Normalitas (Kolmogorov-Smirnov/Shapiro-Wilk) → interpretasi
   - Homogenitas (Levene) → interpretasi
   - Linearitas → interpretasi
   - Multikolinearitas (VIF, Tolerance) → interpretasi
3. **Pengujian Hipotesis**
   - Untuk setiap hipotesis: tabel hasil → nilai statistik → keputusan (Ha diterima/ditolak)
   - Koefisien determinasi (R²)
4. **Pembahasan**
   - Interpretasi setiap temuan → hubungkan dengan teori di Bab II
   - Komparasi dengan penelitian terdahulu (mendukung/bertentangan)
   - Jelaskan mengapa hasilnya demikian

Format: Tabel yang jelas + narasi interpretatif. Bahasa Indonesia akademik.` },

  { id:10, cat:"skripsi", title:"Bab V Skripsi — Kesimpulan & Saran", desc:"Simpulan per rumusan masalah, saran praktis & akademis", difficulty:"beginner",
    tags:["bab 5","kesimpulan","saran","skripsi"],
    prompt:`Anda adalah pembimbing skripsi S1. Bantu menyusun Bab V Kesimpulan dan Saran berdasarkan hasil penelitian di Bab IV.

Judul: [JUDUL]
Rumusan masalah: [RM1, RM2, RM3]
Temuan utama: [RINGKASAN HASIL BAB IV]

Susun komponen:
1. **Kesimpulan**
   - Jawab setiap rumusan masalah secara spesifik dan ringkas
   - Gunakan data/angka konkret dari hasil penelitian
   - Jangan mengulang pembahasan, cukup simpulan inti
   - Format: satu paragraf per rumusan masalah
2. **Saran**
   - Saran praktis: untuk institusi/sekolah/perusahaan yang diteliti (spesifik dan actionable)
   - Saran akademis: untuk peneliti selanjutnya (variabel lain, metode lain, populasi lain, keterbatasan yang bisa diatasi)

Hindari saran yang terlalu umum/klise. Setiap saran harus berbasis temuan penelitian.` },

  // ─── A2b. BAB I-V TESIS ───
  { id:11, cat:"tesis", title:"Bab I Tesis — Pendahuluan", desc:"Latar belakang berbasis data empiris & gap, identifikasi masalah", difficulty:"intermediate",
    tags:["bab 1","pendahuluan","tesis","S2"],
    prompt:`Anda adalah promotor tesis S2 berpengalaman di bidang [BIDANG]. Bantu menyusun Bab I Pendahuluan tesis dengan judul: [JUDUL TESIS].

Perbedaan dengan level skripsi: Tesis S2 menuntut latar belakang yang lebih kuat secara empiris, didukung data primer/sekunder, dan menunjukkan pemahaman mendalam terhadap gap penelitian.

Susun komponen (±3000-4000 kata):
1. **Latar Belakang Masalah**
   - Konteks global → nasional → lokal (funnel approach dengan data empiris)
   - State of the art: apa yang sudah diketahui dari riset terkini?
   - Research gap: apa yang belum dijawab? (methodological, contextual, theoretical gap)
   - Urgensi: mengapa harus diteliti sekarang?
   - Positioning: bagaimana penelitian ini mengisi gap?
2. **Identifikasi Masalah** — 5-7 masalah teridentifikasi dari latar belakang
3. **Batasan Masalah** — justifikasi mengapa membatasi pada variabel/konteks tertentu
4. **Rumusan Masalah** — 3-5 pertanyaan penelitian (deskriptif + asosiatif/kausal)
5. **Tujuan Penelitian** — aligned 1:1 dengan rumusan masalah
6. **Manfaat Penelitian** — teoretis (kontribusi pada body of knowledge) dan praktis (implikasi manajerial/kebijakan)
7. **Orisinalitas/Novelty** — nyatakan secara eksplisit apa yang baru dari penelitian ini

Gunakan data dan referensi. Tandai [PERLU DATA] di bagian yang membutuhkan data spesifik.` },

  { id:12, cat:"tesis", title:"Bab II Tesis — Kajian Teoretis", desc:"Grand theory + middle range, state of the art, kerangka konseptual", difficulty:"intermediate",
    tags:["bab 2","teori","kerangka konseptual","tesis"],
    prompt:`Anda adalah pembimbing tesis S2 dengan keahlian di [BIDANG]. Bantu menyusun Bab II Kajian Teoretis untuk tesis: [JUDUL].

Variabel: [DAFTAR VARIABEL + HUBUNGANNYA]

Susun komponen:
1. **Grand Theory** — teori besar yang menaungi penelitian (misal: TAM, UTAUT, Social Cognitive Theory, dll.). Jelaskan secara mendalam: pencetus, asumsi dasar, perkembangan, kritik
2. **Middle Range Theory** — teori pendukung untuk setiap variabel. Jelaskan keterkaitan antar teori
3. **Kajian Variabel** — untuk setiap variabel:
   - Definisi menurut minimal 5 ahli (bandingkan dan sintesis)
   - Dimensi dan indikator
   - Faktor-faktor yang mempengaruhi
4. **Penelitian Terdahulu** — minimal 15 artikel (10 internasional, 5 nasional). Sajikan dalam tabel + sintesis naratif tematik
5. **Kerangka Konseptual** — model konseptual naratif: hubungan langsung, mediasi, moderasi (jika ada)
6. **Hipotesis Penelitian** — rumuskan dengan landasan teori yang kuat. Setiap hipotesis didukung reasoning + referensi

Referensi >70% dari jurnal Q1-Q4 Scopus, 5 tahun terakhir. APA 7th Edition.` },

  { id:13, cat:"tesis", title:"Bab III Tesis — Metodologi", desc:"Desain rigor, operasionalisasi, SEM/regresi", difficulty:"intermediate",
    tags:["bab 3","metodologi","SEM","tesis"],
    prompt:`Anda adalah metodolog penelitian berpengalaman. Bantu menyusun Bab III Metodologi Penelitian untuk tesis S2: [JUDUL].

Susun komponen:
1. **Pendekatan dan Desain Penelitian** — paradigma, pendekatan, jenis desain + justifikasi
2. **Populasi, Sampel, dan Teknik Sampling** — rumus perhitungan sampel (Hair et al. untuk SEM: 5-10x indikator), justifikasi teknik sampling
3. **Operasionalisasi Variabel** — tabel lengkap: variabel → dimensi → indikator → nomor item → skala → sumber referensi
4. **Instrumen Penelitian** — konstruksi kuesioner, adaptasi dari instrumen tervalidasi, proses expert judgment
5. **Uji Validitas dan Reliabilitas** — pilot test: convergent validity (loading >0.70, AVE >0.50), discriminant validity (HTMT <0.90), CR >0.70
6. **Teknik Pengumpulan Data** — prosedur, timeline, ethical clearance
7. **Teknik Analisis Data**
   - Analisis deskriptif
   - Evaluasi model pengukuran (outer model)
   - Evaluasi model struktural (inner model): path coefficient, t-value, R², f², Q²
   - Model fit: SRMR, NFI
   - Software: SmartPLS 4 / AMOS
8. **Prosedur Penelitian** — flowchart tahapan

Referensi metodologi: Hair et al. (2019), Chin (1998), Henseler et al. (2015). APA 7th.` },

  { id:14, cat:"tesis", title:"Bab IV Tesis — Hasil & Pembahasan", desc:"Analisis mendalam, komparasi lintas studi, implikasi teoretis", difficulty:"advanced",
    tags:["bab 4","hasil","pembahasan","tesis","SEM"],
    prompt:`Anda adalah pembimbing tesis S2 yang ahli analisis data. Bantu menyusun Bab IV berdasarkan output yang saya berikan.

Judul: [JUDUL]
Output: [LAMPIRKAN TABEL SMARTPLS/SPSS/AMOS]

Susun komponen:
1. **Gambaran Umum Objek Penelitian** — profil singkat lokasi/organisasi
2. **Karakteristik Responden** — tabel distribusi + analisis
3. **Analisis Deskriptif Variabel** — mean per dimensi, kategori (TCR/distribusi frekuensi)
4. **Evaluasi Model Pengukuran** — tabel loading factor, AVE, CR, Cronbach's Alpha, HTMT → interpretasi setiap indikator
5. **Evaluasi Model Struktural** — VIF, R², f², Q², path coefficient, p-value, t-value → tabel ringkasan hipotesis (diterima/ditolak)
6. **Pembahasan Setiap Hipotesis**
   - H1: Restate temuan → interpretasi berbasis teori → komparasi dengan 3-5 studi terdahulu → reasoning mengapa hasilnya demikian
   - H2, H3, dst.: format yang sama
7. **Pembahasan Umum** — temuan yang paling signifikan, pola yang muncul, implikasi teoretis
8. **Keterbatasan** — batasan metodologis yang ditemui selama penelitian

Gunakan narasi akademik yang kuat. Setiap interpretasi harus didukung teori dan referensi.` },

  { id:15, cat:"tesis", title:"Bab V Tesis — Kesimpulan, Implikasi & Rekomendasi", desc:"Kontribusi ilmiah, implikasi manajerial, agenda riset lanjutan", difficulty:"intermediate",
    tags:["bab 5","kesimpulan","implikasi","tesis"],
    prompt:`Anda adalah pembimbing tesis S2. Bantu menyusun Bab V berdasarkan temuan di Bab IV.

Judul: [JUDUL]
Temuan: [RINGKASAN HASIL]

Susun komponen:
1. **Kesimpulan** — jawab setiap rumusan masalah dengan singkat, padat, berbasis data
2. **Implikasi Penelitian**
   - Implikasi teoretis: kontribusi terhadap pengembangan teori [TEORI UTAMA], konfirmasi/modifikasi model
   - Implikasi praktis/manajerial: rekomendasi konkret untuk praktisi berdasarkan temuan
   - Implikasi kebijakan: jika relevan, rekomendasi untuk pembuat kebijakan
3. **Keterbatasan Penelitian** — jujur dan spesifik (bukan generik)
4. **Rekomendasi untuk Penelitian Selanjutnya**
   - Variabel moderasi/mediasi yang bisa ditambahkan
   - Konteks berbeda yang perlu diuji
   - Metode alternatif (longitudinal, eksperimen, dll.)
   - Populasi yang lebih luas

Nada: reflektif, jujur tentang keterbatasan, optimis tentang kontribusi.` },

  // ─── A2c. BAB I-V DISERTASI ───
  { id:16, cat:"disertasi", title:"Bab I Disertasi — Pendahuluan", desc:"Konteks makro-mikro, urgensi filosofis, novelty statement", difficulty:"advanced",
    tags:["bab 1","pendahuluan","disertasi","S3"],
    prompt:`Anda adalah promotor disertasi S3 berpengalaman di bidang [BIDANG]. Bantu menyusun Bab I Pendahuluan disertasi dengan judul: [JUDUL DISERTASI].

Perbedaan dengan tesis: Disertasi S3 menuntut kedalaman filosofis, orisinalitas tinggi, kontribusi signifikan terhadap body of knowledge, dan perspektif makro-mikro yang komprehensif.

Susun komponen (±5000-7000 kata):
1. **Latar Belakang Masalah**
   - Konteks filosofis/epistemologis: mengapa topik ini penting secara keilmuan?
   - Konteks global: tren internasional, kebijakan global, data komparatif
   - Konteks nasional: regulasi, data BPS/Kemendikbud, kondisi terkini
   - Konteks lokal: fenomena spesifik di lokasi penelitian
   - State of the art: critical review terhadap 5-10 penelitian terkini yang paling relevan
   - Gap identification: methodological + contextual + theoretical gap secara eksplisit
   - Novelty statement: apa yang benar-benar baru dari penelitian ini?
2. **Identifikasi Masalah** — 7-10 masalah yang saling terkait
3. **Batasan Masalah** — fokus dengan justifikasi teoretis
4. **Rumusan Masalah** — 4-6 pertanyaan (deskriptif, asosiatif, kausal, dan/atau eksploratif)
5. **Tujuan Penelitian** — aligned dengan rumusan masalah
6. **Manfaat Penelitian** — teoretis (pengembangan model baru, modifikasi teori) + praktis + kebijakan
7. **Orisinalitas/Kebaruan Penelitian** — statement eksplisit dan tabel perbandingan dengan penelitian terdahulu

Gunakan referensi seminal + terkini. Tandai [PERLU DATA] dan [PERLU REFERENSI].` },

  { id:17, cat:"disertasi", title:"Bab II Disertasi — Kajian Teoretis & State of the Art", desc:"Grand theory mendalam, critical review, model teoretis baru", difficulty:"advanced",
    tags:["bab 2","teori","state of the art","disertasi"],
    prompt:`Anda adalah promotor disertasi S3 dengan keahlian mendalam di [BIDANG]. Bantu menyusun Bab II untuk disertasi: [JUDUL].

Variabel dan hubungan: [MODEL PENELITIAN]

Susun komponen:
1. **Grand Theory** — analisis mendalam teori utama: sejarah, pencetus, asumsi filosofis, perkembangan, varian, kritik, dan relevansi kontemporer
2. **Teori Pendukung** — 3-5 teori yang memperkuat kerangka penelitian. Jelaskan interconnection antar teori
3. **Critical Review Variabel** — untuk setiap variabel:
   - Evolusi konsep dari waktu ke waktu
   - Definisi dari berbagai perspektif (minimal 7 ahli)
   - Dimensi, indikator, dan operasionalisasi dalam berbagai konteks
   - Debate/kontroversi akademik terkait variabel ini
4. **State of the Art** — meta-review terhadap 20+ penelitian terdahulu:
   - Tabel pemetaan + sintesis naratif tematik
   - Identifikasi konsensus dan inkonsistensi temuan
   - Posisi penelitian ini dalam peta riset yang ada
5. **Kerangka Konseptual** — model teoretis yang dikembangkan: hubungan langsung, mediasi, moderasi, dan/atau interaksi. Sertakan proposisi untuk setiap hubungan
6. **Hipotesis Penelitian** — setiap hipotesis didukung reasoning multi-layer (teori + empiris)

Target: referensi 80%+ jurnal Q1-Q2 Scopus. APA 7th Edition.` },

  { id:18, cat:"disertasi", title:"Bab III Disertasi — Metodologi", desc:"Paradigma filosofis, multi-method, justifikasi mendalam", difficulty:"advanced",
    tags:["bab 3","metodologi","disertasi","paradigma"],
    prompt:`Anda adalah ahli metodologi penelitian tingkat doktoral. Bantu menyusun Bab III Metodologi untuk disertasi: [JUDUL].

Susun komponen:
1. **Paradigma dan Filosofi Penelitian** — ontologi, epistemologi, aksiologi yang mendasari pilihan metodologis
2. **Pendekatan dan Desain** — justifikasi mendalam mengapa desain ini paling tepat menjawab research questions
3. **Populasi dan Sampling** — strategi sampling multi-tahap jika perlu, power analysis untuk menentukan ukuran sampel
4. **Operasionalisasi Variabel** — tabel komprehensif dengan referensi untuk setiap indikator
5. **Pengembangan Instrumen** — proses: literature review → draft → expert judgment (3+ ahli) → pilot test → revisi → final
6. **Validitas dan Reliabilitas** — convergent, discriminant, content, criterion validity; CR, Cronbach's Alpha
7. **Prosedur Pengumpulan Data** — tahapan detail termasuk ethical clearance, informed consent
8. **Teknik Analisis Data**
   - Tahap 1: Evaluasi model pengukuran reflektif/formatif
   - Tahap 2: Evaluasi model struktural (path analysis, mediasi Sobel/bootstrapping, moderasi)
   - Tahap 3: Model fit assessment
   - Tahap 4: Analisis tambahan (multi-group, importance-performance map)
9. **Keabsahan Penelitian** — trustworthiness (untuk kualitatif), rigor (untuk kuantitatif)
10. **Keterbatasan Metodologis** — antisipasi dan mitigasi

Referensi: Hair et al. (2019), Sekaran & Bougie (2016), Creswell & Creswell (2018).` },

  { id:19, cat:"disertasi", title:"Bab IV Disertasi — Temuan & Diskusi", desc:"Multi-layer analysis, model baru, kontribusi body of knowledge", difficulty:"advanced",
    tags:["bab 4","temuan","diskusi","disertasi"],
    prompt:`Anda adalah promotor disertasi S3 dengan keahlian analisis data mendalam. Bantu menyusun Bab IV berdasarkan output yang saya lampirkan.

Judul: [JUDUL]
Output: [LAMPIRKAN]

Susun komponen:
1. **Gambaran Umum** — konteks penelitian, proses pengumpulan data, response rate
2. **Profil Responden/Partisipan** — analisis demografis komprehensif + crosstab relevan
3. **Analisis Deskriptif** — per variabel, per dimensi, identifikasi pola
4. **Evaluasi Model Pengukuran** — semua indikator: loading, AVE, CR, HTMT, cross-loading. Bahas item yang problematik
5. **Evaluasi Model Struktural** — R², adjusted R², f², Q², VIF, path coefficients. Tabel ringkasan hipotesis
6. **Analisis Lanjutan** — mediasi (VAF, specific indirect effect), moderasi (interaction plot), multi-group analysis jika relevan
7. **Diskusi Per Hipotesis** — untuk setiap hipotesis:
   - Temuan → interpretasi teoretis mendalam → komparasi dengan 5+ studi → reasoning kausal
   - Jika ditolak: analisis mengapa, kemungkinan penyebab, implikasi
8. **Sintesis Temuan** — pola keseluruhan, temuan unexpected, kontribusi terhadap model teoretis
9. **Model Final** — sajikan model yang telah tervalidasi empiris, bandingkan dengan model awal
10. **Keterbatasan Empiris** — bias, limitasi data, generalizability` },

  { id:20, cat:"disertasi", title:"Bab V Disertasi — Kesimpulan, Kontribusi & Implikasi", desc:"Kontribusi orisinal, novelty, implikasi kebijakan", difficulty:"advanced",
    tags:["bab 5","kesimpulan","kontribusi","disertasi"],
    prompt:`Anda adalah promotor disertasi S3. Bantu menyusun Bab V berdasarkan keseluruhan disertasi.

Judul: [JUDUL]
Temuan utama: [RINGKASAN]

Susun komponen:
1. **Kesimpulan** — jawab setiap research question secara substantif, bukan repetisi Bab IV
2. **Kontribusi Penelitian**
   - Kontribusi teoretis: pengembangan/modifikasi/konfirmasi teori; model baru yang dihasilkan
   - Kontribusi metodologis: instrumen baru, pendekatan analisis baru
   - Kontribusi praktis: rekomendasi implementatif untuk praktisi
   - Kontribusi kebijakan: rekomendasi evidence-based untuk pembuat kebijakan
3. **Novelty/Kebaruan** — statement eksplisit tentang apa yang benar-benar baru dan belum pernah ditemukan
4. **Implikasi**
   - Implikasi bagi pengembangan ilmu pengetahuan
   - Implikasi bagi praktik profesional
   - Implikasi bagi kebijakan publik/pendidikan
5. **Keterbatasan** — jujur, spesifik, dan constructive
6. **Agenda Riset Masa Depan** — 5-7 arah penelitian lanjutan yang spesifik dan strategis

Nada: otoritatif, reflektif, visioner. Posisikan kontribusi dalam konteks keilmuan yang lebih luas.` },

  // ─── A3. ARTIKEL JURNAL ───
  { id:21, cat:"jurnal", title:"Abstrak Terstruktur (ID & EN)", desc:"Format IMRaD bilingual, keyword selection", difficulty:"intermediate",
    tags:["abstrak","abstract","IMRaD","jurnal"],
    prompt:`Anda adalah editor jurnal internasional bereputasi (Scopus Q1/Q2). Bantu menulis abstrak terstruktur dengan format IMRaD.

Informasi:
- Judul: [JUDUL ARTIKEL]
- Latar belakang: [...]
- Tujuan: [...]
- Metode: [...]
- Hasil utama: [...]
- Kesimpulan: [...]

Instruksi:
1. Tulis abstrak Bahasa Indonesia (150-250 kata) dengan struktur: Latar Belakang → Tujuan → Metode → Hasil → Kesimpulan
2. Terjemahkan ke Bahasa Inggris akademik yang natural dan publish-ready
3. Pastikan setiap kalimat informatif dan spesifik (tidak ada kalimat generik)
4. Sertakan 4-6 keywords: specific-to-broad, hindari kata yang sudah ada di judul
5. Gunakan past tense untuk methods/results, present tense untuk established facts
6. Hindari singkatan di abstrak kecuali yang sangat umum` },

  { id:22, cat:"jurnal", title:"Introduction — CARS Model", desc:"Create A Research Space (Swales): niche, gap, purpose", difficulty:"intermediate",
    tags:["introduction","CARS","Swales","jurnal"],
    prompt:`Anda adalah penulis akademik berpengalaman yang memahami CARS Model (Swales, 1990). Bantu menulis bagian Introduction untuk artikel jurnal.

Judul: [JUDUL]
Bidang: [BIDANG]
Gap: [RESEARCH GAP]

Susun Introduction mengikuti CARS Model:
**Move 1: Establishing a territory**
- Claim centrality: mengapa topik ini penting?
- Review literatur kunci (general → specific)
- Tunjukkan tren dan konsensus yang ada

**Move 2: Establishing a niche**
- Identifikasi gap secara eksplisit (counter-claiming, gap-indicating, question-raising)
- Tunjukkan inkonsistensi atau keterbatasan studi terdahulu

**Move 3: Occupying the niche**
- Nyatakan tujuan penelitian
- Jelaskan pendekatan/metode secara ringkas
- Outline struktur artikel

Target: 800-1200 kata. Tulis dalam Bahasa Indonesia dahulu, lalu terjemahkan ke Bahasa Inggris. Gunakan hedging language yang tepat.` },

  { id:23, cat:"jurnal", title:"Literature Review — Sintesis Tematik", desc:"Review tematik, bukan deskriptif per-artikel", difficulty:"intermediate",
    tags:["literature review","sintesis","tematik","jurnal"],
    prompt:`Anda adalah penulis akademik yang ahli menyusun literature review secara tematik (bukan deskriptif per-artikel). Bantu menulis bagian Literature Review.

Topik: [TOPIK]
Variabel: [DAFTAR VARIABEL]
Artikel yang sudah dikumpulkan: [LAMPIRKAN DAFTAR/RINGKASAN]

Instruksi:
1. **Identifikasi 3-5 Tema Utama** dari literatur yang ada
2. **Untuk setiap tema**, susun narasi yang:
   - Mensintesis temuan dari beberapa studi (bukan merangkum satu per satu)
   - Menunjukkan konsensus dan perbedaan
   - Menggunakan frasa penghubung: "Similarly,...", "In contrast,...", "Extending this finding,..."
3. **Bangun argumen** menuju gap yang akan diisi penelitian ini
4. **Tutup** dengan ringkasan dan transisi ke theoretical framework

Hindari: "Smith (2020) meneliti... lalu Jones (2021) meneliti..." → Gunakan: "Several studies have demonstrated that... (Smith, 2020; Jones, 2021), although..."

Tulis dalam Bahasa Indonesia dahulu, terjemahkan ke Bahasa Inggris akademik.` },

  { id:24, cat:"jurnal", title:"Methods Section", desc:"Reproducible, detail teknis, ethical clearance", difficulty:"intermediate",
    tags:["methods","metodologi","jurnal"],
    prompt:`Anda adalah penulis jurnal Q1 yang memahami standar reproducibility. Bantu menulis bagian Methods.

Informasi penelitian:
- Desain: [...]
- Populasi & sampel: [...]
- Instrumen: [...]
- Teknik analisis: [...]

Susun Methods dengan sub-bagian:
1. **Research Design** — paradigma, pendekatan, jenis desain (1 paragraf)
2. **Participants/Sample** — populasi, teknik sampling, ukuran sampel + justifikasi, demografi
3. **Instruments/Measures** — setiap variabel: nama instrumen, sumber/adaptasi, jumlah item, skala, contoh item, reliabilitas
4. **Data Collection Procedure** — langkah kronologis, durasi, ethical approval statement
5. **Data Analysis** — teknik analisis, software, threshold yang digunakan, prosedur step-by-step

Gunakan past tense. Bahasa Indonesia → Bahasa Inggris. Detail cukup agar studi bisa direplikasi.` },

  { id:25, cat:"jurnal", title:"Results Section", desc:"Narasi data, tabel, uji statistik", difficulty:"intermediate",
    tags:["results","hasil","statistik","jurnal"],
    prompt:`Anda adalah penulis akademik yang ahli menyajikan hasil penelitian. Bantu menulis bagian Results.

Data/output: [LAMPIRKAN TABEL/OUTPUT STATISTIK]

Instruksi:
1. **Sajikan hasil secara objektif** — tanpa interpretasi (interpretasi di Discussion)
2. **Struktur berdasarkan research questions atau hipotesis**
3. **Untuk setiap temuan**:
   - Narasi pendek yang mengarahkan pembaca ke tabel/gambar
   - Tabel yang jelas (judul, header, nilai, signifikansi)
   - Statistik in-text: "The results revealed a significant positive effect (β = 0.45, p < 0.01)"
4. **Gunakan APA style** untuk pelaporan statistik
5. **Tabel dan gambar** harus self-explanatory (bisa dipahami tanpa membaca teks)

Tulis dalam Bahasa Indonesia → Bahasa Inggris. Past tense untuk temuan spesifik.` },

  { id:26, cat:"jurnal", title:"Discussion Section", desc:"Interpretasi, komparasi, implikasi", difficulty:"advanced",
    tags:["discussion","pembahasan","interpretasi","jurnal"],
    prompt:`Anda adalah penulis akademik berpengalaman di jurnal Q1 Scopus. Bantu menulis bagian Discussion.

- Judul: [JUDUL]
- Temuan utama: [HASIL]
- Hipotesis: [H1, H2, dst.]
- Teori: [TEORI UTAMA]

Struktur Discussion:
1. **Restatement** — ringkas temuan utama (1 paragraf, tanpa mengulang angka)
2. **Interpretasi per temuan** — hubungkan setiap temuan dengan teori
3. **Komparasi** — bandingkan dengan 3-5 studi terdahulu (mendukung/bertentangan)
4. **Explanation** — reasoning mengapa hasilnya demikian
5. **Theoretical implications** — kontribusi terhadap teori
6. **Practical implications** — rekomendasi konkret untuk praktisi
7. **Limitations** — keterbatasan yang jujur dan spesifik
8. **Future research** — arah yang spesifik dan justified

Tulis dalam Bahasa Indonesia → Bahasa Inggris. Gunakan connectors kuat dan hedging language.` },

  { id:27, cat:"jurnal", title:"Conclusion & Cover Letter", desc:"Kesimpulan artikel + surat ke editor jurnal", difficulty:"intermediate",
    tags:["conclusion","cover letter","submission","jurnal"],
    prompt:`Anda adalah penulis dan editor jurnal berpengalaman. Bantu menulis 2 komponen:

**A. Conclusion** untuk artikel: [JUDUL]
Temuan: [RINGKASAN]

Susun Conclusion (200-350 kata):
1. Kalimat pembuka: tujuan utama studi
2. Temuan kunci (3-4 poin terpenting, tanpa angka statistik)
3. Kontribusi teoretis dan praktis (masing-masing 1-2 kalimat)
4. Keterbatasan utama (1 kalimat)
5. Kalimat penutup: implikasi terluas dan arah masa depan

**B. Cover Letter** ke editor jurnal: [NAMA JURNAL]

Susun Cover Letter:
1. Judul dan tipe artikel (original research/review/dll.)
2. Ringkasan penelitian (3-4 kalimat)
3. Mengapa artikel ini cocok untuk jurnal ini
4. Kontribusi utama (novelty statement)
5. Pernyataan: belum dipublikasikan/disubmit di tempat lain
6. Pernyataan: semua penulis menyetujui submission
7. Informasi corresponding author

Bahasa Inggris formal dan profesional.` },

  { id:28, cat:"jurnal", title:"Respons Reviewer (Revision Letter)", desc:"Point-by-point response to peer review", difficulty:"advanced",
    tags:["reviewer","revision","response letter","peer review"],
    prompt:`Anda adalah peneliti berpengalaman yang terbiasa merevisi artikel berdasarkan feedback reviewer. Bantu saya menyusun Revision Letter (Response to Reviewers).

Komentar reviewer: [TEMPEL KOMENTAR REVIEWER]
Judul artikel: [JUDUL]

Untuk setiap komentar reviewer, susun respons dengan format:

**Reviewer [1/2] — Comment [N]:**
[Kutip komentar reviewer]

**Response:**
- Ucapkan terima kasih atas masukan
- Jelaskan tindakan yang sudah dilakukan (atau alasan jika tidak setuju — dengan sopan dan berbasis bukti)
- Tunjukkan perubahan spesifik: "We have revised Section X, paragraph Y (page Z, lines AA-BB)"
- Jika menambahkan referensi baru, sebutkan

**Revised text:**
[Tampilkan teks yang sudah direvisi — highlight perubahan]

Nada: sopan, profesional, appreciative. Tidak defensif meskipun tidak setuju. Setiap respons harus substantif.` },

  // ─── A4. PENDUKUNG RISET ───
  { id:29, cat:"pendukung", title:"Systematic Literature Review (PRISMA)", desc:"Tinjauan pustaka sistematis dengan protokol PRISMA", difficulty:"advanced",
    tags:["SLR","PRISMA","literature review","scopus"],
    prompt:`Anda adalah asisten riset akademik senior. Bantu menyusun Systematic Literature Review (SLR) dengan protokol PRISMA untuk topik: [TOPIK].

Langkah:
1. **Research Questions** — 2-3 pertanyaan spesifik dan terukur
2. **Kriteria Inklusi & Eksklusi** — tahun, bahasa, jenis publikasi, relevansi
3. **Strategi Pencarian** — string pencarian untuk Scopus, WoS, Google Scholar
4. **Proses Seleksi** — screening: title/abstract → full-text → final inclusion
5. **Data Extraction Table** — template tabel ekstraksi
6. **Sintesis Temuan** — panduan thematic synthesis
7. **PRISMA Flow Diagram** — deskripsi naratif diagram alur

Format terstruktur. Referensi APA 7th Edition.` },

  { id:30, cat:"pendukung", title:"Literature Matrix Builder", desc:"Matriks pemetaan literatur secara sistematis", difficulty:"beginner",
    tags:["literature matrix","pemetaan","review","tabel"],
    prompt:`Anda adalah asisten riset yang terorganisir. Buat Literature Review Matrix dari artikel yang saya berikan.

Kolom: No | Author & Year | Title | Journal | Objective | Methodology | Key Findings | Limitations | Relevance | Gap

Instruksi:
- Isi ringkas (1-2 kalimat per kolom)
- Urutkan kronologis
- Tandai paling relevan dengan tanda bintang
- Di akhir: sintesis temuan, trend metodologi, research gap konsisten, rekomendasi

Artikel: [LAMPIRKAN]` },

  { id:31, cat:"pendukung", title:"Evaluasi Instrumen Penelitian", desc:"Validitas dan reliabilitas kuesioner", difficulty:"advanced",
    tags:["instrumen","validitas","reliabilitas","kuesioner"],
    prompt:`Anda adalah ahli metodologi kuantitatif. Evaluasi instrumen (kuesioner) berdasarkan:

1. **Content Validity** — item merepresentasikan konstruk?
2. **Construct Validity** — indikator sesuai teori?
3. **Face Validity** — bahasa jelas dan tidak ambigu?
4. **Reliabilitas** — rekomendasi uji (Cronbach's Alpha, CR)
5. **Skala** — Likert/semantik diferensial sudah tepat?

Per item: Status (✅/⚠️/❌) + Alasan + Rekomendasi revisi. Format tabel.` },

  { id:32, cat:"pendukung", title:"Parafrase Akademik Anti-Plagiarisme", desc:"Parafrase tanpa mengubah makna, target <15% similarity", difficulty:"beginner",
    tags:["parafrase","plagiarisme","turnitin","writing"],
    prompt:`Anda adalah editor akademik profesional. Parafrasekan teks berikut:

1. Ubah struktur kalimat total (bukan sekadar sinonim)
2. Pertahankan makna dan akurasi
3. Academic writing style formal
4. Variasikan active/passive voice
5. Pertahankan istilah teknis
6. Target similarity: <15% (Turnitin-safe)

Output: Teks asli → Hasil parafrase → Catatan perubahan

Teks: [TEMPEL]` },

  { id:33, cat:"pendukung", title:"Penyusunan Daftar Pustaka APA 7th", desc:"Format, konsistensi, cross-check sitasi", difficulty:"beginner",
    tags:["APA","referensi","daftar pustaka","sitasi"],
    prompt:`Anda adalah editor yang sangat teliti dalam format referensi APA 7th Edition. Bantu saya merapikan daftar pustaka.

Tugas:
1. **Format ulang** semua referensi sesuai APA 7th Edition
2. **Periksa konsistensi** — italic, kapitalisasi, tanda baca, DOI format
3. **Identifikasi kesalahan** — tandai referensi yang tidak lengkap
4. **Cross-check** — pastikan semua sitasi di teks ada di daftar pustaka dan sebaliknya
5. **Urutkan** secara alfabetis berdasarkan nama pertama penulis
6. **Berikan catatan** untuk referensi yang perlu dilengkapi informasi

Daftar pustaka yang perlu diperiksa: [TEMPEL]
Sitasi dalam teks (jika ada): [TEMPEL]` },

  { id:34, cat:"pendukung", title:"Pemilihan Jurnal Target", desc:"Match topik ke jurnal Q1-Q4, Sinta, predatory check", difficulty:"intermediate",
    tags:["jurnal target","Scopus","Sinta","predatory"],
    prompt:`Anda adalah konsultan publikasi akademik berpengalaman. Bantu saya memilih jurnal target untuk artikel berikut:

- Judul: [JUDUL]
- Bidang: [BIDANG]
- Metode: [KUANTITATIF/KUALITATIF/MIXED]
- Target: [Q1/Q2/Q3/Q4 Scopus / Sinta 1-6]

Lakukan:
1. **Rekomendasi 5-7 Jurnal** dengan informasi: nama jurnal, penerbit, quartile/Sinta, IF/SJR, scope, rata-rata review time, acceptance rate (jika diketahui), APC
2. **Analisis Kesesuaian** — seberapa cocok topik saya dengan scope jurnal
3. **Predatory Check** — periksa apakah jurnal termasuk daftar Beall's atau tidak terindeks resmi
4. **Strategi Submission** — urutan prioritas submission dan plan B
5. **Tips** — format khusus yang diminta jurnal, template, word count

Catatan: Jika informasi spesifik tidak tersedia, nyatakan "perlu verifikasi di website jurnal."` },

  // ─── A5a. BUKU HASIL RISET ───
  { id:35, cat:"buku-riset", title:"Kerangka & Outline Buku Hasil Riset", desc:"Transformasi disertasi/tesis ke buku monograf", difficulty:"advanced",
    tags:["buku","monograf","outline","riset"],
    prompt:`Anda adalah penulis buku akademik berpengalaman. Bantu saya mentransformasi hasil penelitian menjadi buku monograf/referensi.

Sumber: [DISERTASI/TESIS/KUMPULAN RISET]
Judul tentatif: [...]
Target penerbit: [NASIONAL/INTERNASIONAL]

Lakukan:
1. **Analisis Kelayakan** — apakah riset ini cukup substantif untuk menjadi buku?
2. **Restrukturisasi** — transformasi format disertasi (Bab I-V) menjadi format buku yang readable:
   - Bab disertasi ≠ bab buku (perlu reframing)
   - Tambahkan konteks, contoh, ilustrasi yang lebih luas
3. **Outline Buku** — susun 8-12 bab dengan:
   - Judul bab yang menarik (tidak harus formal seperti disertasi)
   - Ringkasan isi per bab (3-5 kalimat)
   - Estimasi jumlah halaman per bab
4. **Prakata/Kata Pengantar** — draft outline
5. **Target Pembaca** — siapa yang akan membaca buku ini?
6. **Unique Selling Point** — apa yang membedakan buku ini dari yang sudah ada?
7. **Timeline Penulisan** — jadwal realistis per bab` },

  { id:36, cat:"buku-riset", title:"Penulisan Bab Buku Akademik", desc:"Narasi ilmiah readable, integrasi data riset", difficulty:"advanced",
    tags:["buku","penulisan","bab","akademik"],
    prompt:`Anda adalah penulis buku akademik yang mampu menulis secara ilmiah namun tetap readable. Bantu menulis bab buku berikut:

Judul buku: [...]
Bab ke: [N]
Judul bab: [...]
Outline/poin utama bab ini: [...]
Data riset terkait: [LAMPIRKAN JIKA ADA]

Instruksi penulisan:
1. **Nada** — ilmiah namun engaging, tidak sekaku format disertasi
2. **Pembuka bab** — hook yang menarik (anekdot, pertanyaan, data mengejutkan)
3. **Struktur** — sub-bab yang mengalir logis, transisi smooth antar bagian
4. **Integrasi data** — sajikan data riset dalam narasi (bukan sekadar tabel)
5. **Contoh dan ilustrasi** — perkaya dengan contoh konkret, studi kasus
6. **Ringkasan bab** — poin-poin kunci di akhir
7. **Referensi** — APA 7th, in-text citation yang tepat
8. **Panjang** — ±3000-5000 kata per bab

Tulis dalam Bahasa Indonesia akademik yang accessible.` },

  { id:37, cat:"buku-riset", title:"Prakata, Kata Pengantar & Abstrak Buku", desc:"Nada formal, konteks penulisan, ucapan terima kasih", difficulty:"beginner",
    tags:["prakata","kata pengantar","buku"],
    prompt:`Anda adalah editor buku akademik berpengalaman. Bantu menulis bagian pembuka buku berikut:

Judul buku: [...]
Penulis: [...]
Tentang buku: [RINGKASAN SINGKAT]
Konteks penulisan: [MENGAPA BUKU INI DITULIS]

Susun 3 komponen:

**1. Prakata** (oleh pihak lain — misal promotor/rektor/pakar):
- Konteks keahlian yang menulis prakata
- Apresiasi terhadap karya
- Relevansi dan kontribusi buku
- Harapan ± 300-500 kata

**2. Kata Pengantar** (oleh penulis):
- Latar belakang mengapa menulis buku ini
- Perjalanan intelektual penulis terkait topik
- Kepada siapa buku ini ditujukan
- Ucapan terima kasih
- Harapan ± 500-800 kata

**3. Abstrak/Sinopsis Buku** (untuk halaman belakang cover):
- Ringkasan menarik 150-200 kata
- Highlight kontribusi utama
- Target pembaca` },

  // ─── A5b. BUKU REFERENSI/AJAR ───
  { id:38, cat:"buku-ajar", title:"Outline Buku Referensi / Buku Ajar", desc:"Struktur per bab dengan capaian pembelajaran", difficulty:"intermediate",
    tags:["buku ajar","buku referensi","outline","kurikulum"],
    prompt:`Anda adalah pengembang buku ajar berpengalaman di perguruan tinggi. Bantu menyusun outline buku ajar/referensi.

Mata kuliah: [...]
Program studi: [...]
Capaian Pembelajaran MK: [CPL/CPMK]
Jumlah bab yang diinginkan: [10-14]

Susun outline:
1. **Daftar Isi** — judul bab dan sub-bab yang terstruktur
2. **Untuk setiap bab:**
   - Capaian pembelajaran bab (students can...)
   - Peta konsep bab
   - Ringkasan isi (3-5 kalimat)
   - Kata kunci
   - Estimasi halaman
3. **Fitur pedagogis** per bab:
   - Pertanyaan pemantik di awal
   - Kotak info/highlight konsep penting
   - Contoh kasus/studi kasus
   - Rangkuman bab
   - Latihan soal (5-10 soal: PG + esai)
   - Daftar pustaka per bab
4. **Glosarium** — daftar istilah kunci
5. **Indeks** — panduan penyusunan

Format: Siap diajukan ke penerbit untuk proses review.` },

  { id:39, cat:"buku-ajar", title:"Penulisan Bab Buku Ajar", desc:"Eksplanasi bertahap, contoh kasus, soal latihan", difficulty:"intermediate",
    tags:["buku ajar","penulisan bab","pedagogis"],
    prompt:`Anda adalah penulis buku ajar yang mampu menjelaskan konsep kompleks secara bertahap. Bantu menulis bab buku ajar berikut:

Bab ke: [N]
Judul bab: [...]
Capaian pembelajaran: [...]
Level mahasiswa: [S1/S2]

Susun bab dengan struktur:
1. **Pertanyaan Pemantik** — 2-3 pertanyaan yang memicu curiosity
2. **Pendahuluan Bab** — mengapa topik ini penting, hubungan dengan bab sebelumnya
3. **Materi Inti** — sajikan bertahap dari sederhana ke kompleks:
   - Definisi dan konsep dasar
   - Penjelasan mendalam dengan analogi
   - Teori dan perspektif utama
   - Contoh konkret dari konteks Indonesia
4. **Kotak Highlight** — "Tahukah Anda?", "Penting!", "Refleksi"
5. **Studi Kasus** — 1-2 kasus nyata untuk dianalisis
6. **Rangkuman** — poin-poin kunci dalam format ringkas
7. **Latihan**:
   - 5 soal pilihan ganda (dengan kunci jawaban)
   - 3 soal esai (dengan rubrik penilaian singkat)
   - 1 tugas proyek/diskusi kelompok
8. **Daftar Pustaka Bab**

Panjang: ±4000-6000 kata. Bahasa Indonesia yang accessible namun tetap akademik.` },

  // ─── A5c. BUKU POPULER/E-BOOK ───
  { id:40, cat:"buku-populer", title:"Outline & Kerangka Buku Populer", desc:"Narasi storytelling, bahasa publik, struktur menarik", difficulty:"intermediate",
    tags:["buku populer","outline","storytelling","e-book"],
    prompt:`Anda adalah penulis buku populer/best-seller yang mampu mengemas pengetahuan akademik menjadi bacaan yang menarik untuk publik luas. Bantu menyusun outline buku populer.

Topik: [...]
Berdasarkan riset/pengalaman: [...]
Target pembaca: [GURU/ORANGTUA/PROFESIONAL/UMUM]

Susun:
1. **Judul & Subjudul** — 3 opsi judul yang catchy dan marketable
2. **Premis Buku** — 1 paragraf: apa masalah yang dipecahkan buku ini?
3. **Target Pembaca** — persona detail
4. **Outline 10-12 Bab** — setiap bab:
   - Judul yang menarik (gunakan metafora, pertanyaan, atau provocative statement)
   - Hook pembuka
   - Poin utama (3-4)
   - Takeaway/actionable insight
5. **Gaya Penulisan** — panduan tone and voice
6. **Unique Selling Point** — mengapa orang harus membeli buku ini?
7. **Kompetitor** — 3 buku sejenis + diferensiasi` },

  { id:41, cat:"buku-populer", title:"Penulisan Bab Buku Populer / E-book", desc:"Gaya naratif ringan, insight praktis, tips actionable", difficulty:"intermediate",
    tags:["buku populer","e-book","penulisan","naratif"],
    prompt:`Anda adalah penulis buku populer yang engaging. Bantu menulis bab berikut:

Bab ke: [N]
Judul bab: [...]
Poin utama: [...]
Target pembaca: [...]

Instruksi penulisan:
1. **Pembuka** — mulai dengan cerita/anekdot/pertanyaan yang relatable
2. **Gaya bahasa** — conversational namun berisi, seperti ngobrol dengan teman yang pintar
3. **Struktur** — short paragraphs, sub-heading yang engaging, white space
4. **Data & riset** — sisipkan secara natural (bukan seperti paper), "Penelitian menunjukkan bahwa..."
5. **Contoh nyata** — dari kehidupan sehari-hari, relatable
6. **Quotes** — 1-2 kutipan inspiratif yang relevan
7. **Actionable tips** — berikan langkah konkret yang bisa langsung dipraktikkan
8. **Penutup bab** — ringkasan + refleksi + transisi ke bab berikutnya
9. **Panjang** — ±2500-3500 kata

Bahasa Indonesia yang mengalir, hindari jargon berlebihan.` },

  { id:42, cat:"buku-populer", title:"Book Proposal untuk Penerbit", desc:"Sinopsis, target pembaca, keunikan, outline, contoh bab", difficulty:"intermediate",
    tags:["book proposal","penerbit","sinopsis"],
    prompt:`Anda adalah agen literasi yang berpengalaman membantu penulis mendapatkan kontrak penerbitan. Bantu menyusun book proposal.

Informasi:
- Judul: [...]
- Jenis: [AKADEMIK/POPULER/REFERENSI/AJAR]
- Target penerbit: [...]

Susun komponen proposal:
1. **Halaman Judul** — judul, subjudul, nama penulis, afiliasi, kontak
2. **Sinopsis** (300-500 kata) — tentang apa buku ini, mengapa penting, untuk siapa
3. **Profil Penulis** — kredensial, publikasi, keahlian di bidang ini
4. **Analisis Pasar** — siapa pembaca potensial, berapa besar pasarnya
5. **Analisis Kompetitor** — 3-5 buku sejenis + bagaimana buku ini berbeda
6. **Outline Bab** — judul + ringkasan 2-3 kalimat per bab
7. **Spesifikasi Teknis** — estimasi jumlah halaman, jumlah kata, tabel/gambar, lampiran
8. **Contoh Bab** — sertakan 1 bab sebagai sample
9. **Timeline** — jadwal penyelesaian manuskrip
10. **Kebutuhan Khusus** — izin gambar, peer review, dll.` },

  { id:43, cat:"buku-populer", title:"Review & Editing Naskah Buku", desc:"Konsistensi, koherensi antar bab, proofreading", difficulty:"intermediate",
    tags:["review","editing","naskah","proofreading"],
    prompt:`Anda adalah editor buku profesional dengan mata yang sangat detail. Review naskah buku yang saya lampirkan.

Judul: [...]
Jenis: [AKADEMIK/POPULER/AJAR]

Lakukan evaluasi menyeluruh:
1. **Substansi & Struktur**
   - Apakah alur antar bab logis dan koheren?
   - Apakah ada bab yang terlalu panjang/pendek?
   - Apakah ada pengulangan yang tidak perlu?
   - Apakah ada gap informasi?
2. **Konsistensi**
   - Terminologi: apakah istilah digunakan secara konsisten?
   - Gaya: apakah tone konsisten dari awal sampai akhir?
   - Format: heading, numbering, tabel, gambar
3. **Bahasa & Gaya**
   - Kejelasan kalimat
   - Grammar dan ejaan (EYD V)
   - Pilihan kata
4. **Referensi**
   - Kelengkapan dan format APA
   - Cross-check sitasi
5. **Rekomendasi Revisi** — prioritaskan: Major → Minor → Opsional

Format: Tabel evaluasi per bab + catatan umum + rekomendasi tindak lanjut.

Naskah: [LAMPIRKAN]` },

  // ─── B1. ANALISIS KUANTITATIF ───
  { id:44, cat:"kuantitatif", title:"Analisis PLS-SEM (SmartPLS)", desc:"Evaluasi model pengukuran, struktural, dan model fit", difficulty:"advanced",
    tags:["PLS-SEM","SmartPLS","SEM","struktural"],
    prompt:`Anda adalah ahli PLS-SEM. Bantu analisis data:

**Tahap 1: Model Pengukuran**
- Convergent Validity: loading >0.70, AVE >0.50
- Discriminant Validity: Fornell-Larcker, HTMT <0.90
- Internal Consistency: Alpha >0.70, CR >0.70

**Tahap 2: Model Struktural**
- VIF <5.0, Path Coefficients (p<0.05, t>1.96)
- R², f² (0.02/0.15/0.35), Q² >0

**Tahap 3: Model Fit**
- SRMR <0.08, NFI >0.90

Data: [LAMPIRKAN]
Berikan interpretasi setiap indikator dan rekomendasi perbaikan.` },

  { id:45, cat:"kuantitatif", title:"Analisis Regresi", desc:"Linear, logistik, berganda — interpretasi lengkap", difficulty:"intermediate",
    tags:["regresi","linear","logistik","berganda"],
    prompt:`Anda adalah ahli statistik. Bantu interpretasi analisis regresi.

Jenis: [LINEAR SEDERHANA / BERGANDA / LOGISTIK]
Output SPSS: [LAMPIRKAN]

Interpretasi yang harus diberikan:
1. **Model Summary** — R, R², Adjusted R², Std. Error
2. **ANOVA** — F-hitung, signifikansi, apakah model layak?
3. **Coefficients** — untuk setiap prediktor: B, Beta, t, Sig, interpretasi
4. **Uji Asumsi** — normalitas residual, heteroskedastisitas, multikolinearitas (VIF), autokorelasi (DW)
5. **Persamaan Regresi** — tulis persamaan dan interpretasi
6. **Kesimpulan** — variabel mana yang berpengaruh signifikan dan seberapa besar

Format: Tabel ringkasan + narasi interpretatif dalam Bahasa Indonesia akademik.` },

  { id:46, cat:"kuantitatif", title:"Uji Beda (t-test, ANOVA, Non-parametrik)", desc:"Pemilihan uji, interpretasi, dan pelaporan", difficulty:"intermediate",
    tags:["t-test","ANOVA","Mann-Whitney","uji beda"],
    prompt:`Anda adalah ahli statistik inferensial. Bantu saya memilih dan menginterpretasi uji beda yang tepat.

Informasi:
- Variabel dependen: [...]
- Variabel grouping: [... berapa kelompok?]
- Jumlah sampel: [N]
- Hasil uji normalitas: [NORMAL/TIDAK NORMAL]
- Output SPSS: [LAMPIRKAN]

Lakukan:
1. **Pemilihan Uji** — Independent t-test / Paired t-test / One-way ANOVA / Kruskal-Wallis / Mann-Whitney / Wilcoxon → berikan justifikasi
2. **Uji Prasyarat** — normalitas (Shapiro-Wilk/K-S) + homogenitas (Levene)
3. **Interpretasi Output** — statistik uji, df, p-value, effect size (Cohen's d / eta squared)
4. **Post-hoc** (jika ANOVA signifikan) — Tukey/Bonferroni/Games-Howell
5. **Kesimpulan** — apakah ada perbedaan signifikan? seberapa besar?
6. **Pelaporan APA** — format pelaporan yang benar, contoh: "t(58) = 2.45, p = .018, d = 0.64"` },

  { id:47, cat:"kuantitatif", title:"Analisis Faktor (EFA & CFA)", desc:"Eksplorasi dan konfirmasi struktur faktor", difficulty:"advanced",
    tags:["EFA","CFA","faktor analisis","konstruk"],
    prompt:`Anda adalah ahli psychometrics. Bantu analisis faktor.

Jenis: [EFA / CFA / KEDUANYA]
Output: [LAMPIRKAN]

**Untuk EFA:**
1. KMO & Bartlett's Test — interpretasi kelayakan
2. Total Variance Explained — berapa faktor yang diekstrak?
3. Rotated Component Matrix — item mana masuk faktor mana?
4. Item problematik — cross-loading >0.40 pada 2+ faktor, loading <0.40
5. Rekomendasi — item yang perlu dihapus/dipindahkan

**Untuk CFA:**
1. Model fit: Chi-square, RMSEA, CFI, TLI, SRMR → threshold dan interpretasi
2. Standardized loading — apakah semua item >0.50?
3. Modification indices — perlu kovarians error?
4. AVE dan CR — convergent validity
5. Discriminant validity — Fornell-Larcker / HTMT

Berikan rekomendasi perbaikan model jika fit belum tercapai.` },

  { id:48, cat:"kuantitatif", title:"Interpretasi Output SPSS/SmartPLS/AMOS", desc:"Panduan membaca dan menginterpretasi output statistik", difficulty:"intermediate",
    tags:["SPSS","SmartPLS","AMOS","output","interpretasi"],
    prompt:`Anda adalah tutor statistik yang sangat sabar dan detail. Bantu saya menginterpretasi output statistik berikut.

Software: [SPSS / SmartPLS / AMOS]
Jenis analisis: [SEBUTKAN]
Output: [LAMPIRKAN SCREENSHOT/TABEL]

Untuk setiap tabel/output, berikan:
1. **Nama tabel** dan fungsinya
2. **Kolom penting** — kolom mana yang harus diperhatikan?
3. **Nilai kunci** — angka mana yang menentukan keputusan?
4. **Threshold/kriteria** — berapa batasnya? (dengan referensi)
5. **Interpretasi** — apa artinya dalam bahasa sederhana?
6. **Keputusan** — H0 ditolak/diterima? Model fit/tidak?
7. **Pelaporan APA** — cara melaporkan hasil ini di paper

Jelaskan dengan bahasa yang mudah dipahami mahasiswa S1-S2. Gunakan analogi jika perlu.` },

  { id:49, cat:"kuantitatif", title:"Statistik Deskriptif & Uji Asumsi Klasik", desc:"Mean, SD, normalitas, homogenitas, linearitas", difficulty:"beginner",
    tags:["deskriptif","normalitas","homogenitas","asumsi klasik"],
    prompt:`Anda adalah ahli statistik deskriptif. Bantu analisis data berikut:

Data: [LAMPIRKAN]
Variabel: [DAFTAR VARIABEL]

Lakukan:
1. **Statistik Deskriptif** — tabel: N, Mean, Median, SD, Min, Max, Skewness, Kurtosis per variabel
2. **Distribusi Frekuensi** — kategorisasi (Sangat Tinggi/Tinggi/Sedang/Rendah/Sangat Rendah) berdasarkan mean + SD
3. **Uji Normalitas** — Kolmogorov-Smirnov (N>50) atau Shapiro-Wilk (N<50) → interpretasi + histogram/Q-Q plot
4. **Uji Homogenitas** — Levene's Test → interpretasi
5. **Uji Linearitas** — Deviation from Linearity → interpretasi
6. **Uji Multikolinearitas** — VIF dan Tolerance → interpretasi
7. **Ringkasan** — apakah data memenuhi asumsi untuk uji parametrik? Jika tidak, alternatif apa?

Sajikan dalam tabel yang rapi + narasi singkat.` },

  // ─── B2. ANALISIS KUALITATIF ───
  { id:50, cat:"kualitatif", title:"Analisis Tematik (Braun & Clarke)", desc:"6 fase analisis tematik dari transkrip", difficulty:"intermediate",
    tags:["tematik","Braun Clarke","kualitatif","coding"],
    prompt:`Anda adalah peneliti kualitatif berpengalaman. Lakukan analisis tematik (Braun & Clarke, 2006) terhadap transkrip berikut:

1. **Familiarisasi** — baca ulang, identifikasi pola awal
2. **Initial Coding** — kode pada setiap unit makna
3. **Kategorisasi** — kelompokkan kode ke kategori
4. **Identifikasi Tema** — tema utama dan sub-tema
5. **Review Tema** — pastikan koheren dan didukung data
6. **Penamaan** — nama deskriptif dan representatif
7. **Matriks** — Tema → Sub-tema → Kode → Kutipan Pendukung (Q)

Kode responden: R1, R2, dst. Pertanyaan: Q1, Q2, dst.
Transkrip: [TEMPEL]` },

  { id:51, cat:"kualitatif", title:"Open Coding, Axial & Selective Coding", desc:"Grounded theory coding approach", difficulty:"advanced",
    tags:["open coding","axial coding","selective","grounded theory"],
    prompt:`Anda adalah peneliti kualitatif dengan keahlian Grounded Theory (Strauss & Corbin). Lakukan coding bertahap terhadap data berikut:

**1. Open Coding**
- Pecah data menjadi unit-unit makna
- Beri label/kode pada setiap unit (in-vivo atau constructed)
- Sajikan: Kode → Data pendukung → Catatan memo

**2. Axial Coding**
- Kelompokkan kode ke dalam kategori
- Identifikasi hubungan antar kategori menggunakan paradigm model:
  Conditions → Phenomenon → Context → Strategies → Consequences

**3. Selective Coding**
- Identifikasi core category
- Hubungkan semua kategori ke core category
- Bangun storyline/teori substantif

Sajikan setiap tahap dalam tabel terpisah. Sertakan analytic memo untuk setiap keputusan coding.

Data: [TEMPEL TRANSKRIP]` },

  { id:52, cat:"kualitatif", title:"Analisis NVivo", desc:"Word cloud, tree map, matrix coding, cluster", difficulty:"advanced",
    tags:["NVivo","word cloud","tree map","matrix coding"],
    prompt:`Anda adalah ahli analisis kualitatif berbantuan software NVivo. Bantu saya menyiapkan dan menginterpretasi analisis NVivo.

Data: [TRANSKRIP WAWANCARA / DOKUMEN]
Jumlah partisipan: [N]

Panduan analisis:
1. **Persiapan Data** — cara import, coding structure, node hierarchy
2. **Word Frequency Query** — interpretasi 50 kata teratas, relevansi dengan tema
3. **Word Cloud** — panduan visualisasi dan interpretasi
4. **Tree Map** — interpretasi proporsi tema/sub-tema
5. **Coding Matrix** — tema × partisipan: siapa membahas apa?
6. **Cluster Analysis** — kesamaan pola antar tema/partisipan
7. **Framework Matrix** — ringkasan temuan per tema per partisipan
8. **Interpretasi Keseluruhan** — apa yang ditunjukkan oleh visualisasi ini?

Format: Panduan langkah demi langkah + template interpretasi.` },

  { id:53, cat:"kualitatif", title:"Triangulasi Data & Member Checking", desc:"Strategi validasi temuan kualitatif", difficulty:"intermediate",
    tags:["triangulasi","member checking","validitas","kualitatif"],
    prompt:`Anda adalah ahli metodologi kualitatif. Bantu saya merancang strategi triangulasi dan validasi temuan.

Metode pengumpulan data: [WAWANCARA/OBSERVASI/DOKUMEN/FGD]
Jumlah partisipan: [N]
Temuan sementara: [RINGKASAN TEMA UTAMA]

Rancang:
1. **Triangulasi Sumber** — bagaimana membandingkan data dari sumber berbeda?
2. **Triangulasi Metode** — bagaimana membandingkan data wawancara vs observasi vs dokumen?
3. **Triangulasi Peneliti** — peer debriefing, inter-coder reliability
4. **Member Checking** — prosedur: ringkasan temuan → kirim ke partisipan → kumpulkan feedback → revisi
5. **Audit Trail** — dokumentasi keputusan analisis
6. **Thick Description** — panduan menulis deskripsi yang kaya konteks
7. **Tabel Triangulasi** — template: Tema → Sumber 1 → Sumber 2 → Sumber 3 → Konsistensi (✓/✕)
8. **Pelaporan** — cara menulis bagian trustworthiness di paper` },

  // ─── B3. EVALUASI & KEBIJAKAN ───
  { id:54, cat:"evaluasi", title:"Analisis SWOT + TOWS", desc:"Analisis komprehensif dengan strategi tindak lanjut", difficulty:"intermediate",
    tags:["SWOT","TOWS","strategi","manajemen"],
    prompt:`Anda adalah konsultan strategis. Lakukan analisis SWOT untuk: [ORGANISASI/PROGRAM].

1. **Identifikasi S-W-O-T** — minimal 5 poin + justifikasi
2. **Matriks TOWS** — SO (agresif), WO (perbaikan), ST (diversifikasi), WT (defensif)
3. **Prioritasi** — ranking berdasarkan urgency & feasibility
4. **Action Plan** — 3 strategi prioritas utama

Format tabel dan narasi.` },

  { id:55, cat:"evaluasi", title:"Evaluasi Program CIPP (Stufflebeam)", desc:"Context, Input, Process, Product evaluation", difficulty:"advanced",
    tags:["CIPP","Stufflebeam","evaluasi","program"],
    prompt:`Anda adalah evaluator program pendidikan. Evaluasi program: [NAMA PROGRAM] dengan Model CIPP.

1. **Context** — kebutuhan, tujuan, lingkungan
2. **Input** — sumber daya, desain, alternatif
3. **Process** — implementasi, kendala, penyimpangan
4. **Product** — ketercapaian, dampak, keberlanjutan

Berikan rekomendasi evidence-based untuk setiap komponen.` },

  { id:56, cat:"evaluasi", title:"Analisis Kebijakan Pendidikan", desc:"Framework analitis untuk regulasi dan kebijakan", difficulty:"advanced",
    tags:["kebijakan","policy analysis","regulasi"],
    prompt:`Anda adalah analis kebijakan pendidikan. Analisis: [NAMA KEBIJAKAN].

1. Deskripsi kebijakan — latar, tujuan, sasaran
2. Landasan hukum — hierarki regulasi
3. Stakeholder analysis
4. Content analysis — mekanisme implementasi
5. Impact assessment — positif/negatif
6. Gap analysis — tujuan vs implementasi
7. Benchmarking — nasional/internasional
8. Rekomendasi berbasis evidence

Jangan mengarang pasal/regulasi. Nyatakan "perlu verifikasi" jika tidak yakin.` },

  { id:57, cat:"evaluasi", title:"Review Artikel Jurnal (Peer Review)", desc:"Framework review komprehensif untuk reviewer", difficulty:"advanced",
    tags:["peer review","review","jurnal","evaluasi"],
    prompt:`Anda adalah reviewer jurnal Scopus Q1/Q2. Review artikel berikut:

**Substansi:** Novelty, RQ, Literature Review, Methodology, Results, Discussion, Conclusion
**Teknis:** Struktur, bahasa, referensi, tabel/gambar
**Rekomendasi:** Accept / Minor / Major Revision / Reject + daftar revisi

Artikel: [LAMPIRKAN]` },

  { id:58, cat:"evaluasi", title:"Analisis Bibliometrik (VOSviewer)", desc:"Co-citation, co-authorship, keyword co-occurrence", difficulty:"advanced",
    tags:["bibliometrik","VOSviewer","co-citation","mapping"],
    prompt:`Anda adalah ahli bibliometrik. Bantu saya melakukan analisis bibliometrik untuk topik: [TOPIK].

1. **Persiapan Data** — cara export dari Scopus/WoS ke format yang kompatibel
2. **Analisis Co-authorship** — peta kolaborasi peneliti, negara/institusi produktif
3. **Analisis Co-citation** — kluster intellectual base, influential authors
4. **Keyword Co-occurrence** — peta keyword, emerging topics
5. **Bibliographic Coupling** — hubungan antar dokumen berdasarkan referensi bersama
6. **Trend Temporal** — evolusi topik dari waktu ke waktu
7. **Interpretasi Cluster** — identifikasi kluster tematik utama
8. **Visualisasi** — panduan membuat network map, overlay, density visualization di VOSviewer
9. **Pelaporan** — cara menulis hasil bibliometrik di paper

Berikan panduan step-by-step yang bisa diikuti.` },

  // ─── C1. PERENCANAAN PEMBELAJARAN ───
  { id:59, cat:"perencanaan", title:"Penyusunan RPS / Silabus", desc:"Rencana Pembelajaran Semester lengkap", difficulty:"intermediate",
    tags:["RPS","silabus","kurikulum","CPL"],
    prompt:`Anda adalah ahli kurikulum perguruan tinggi. Bantu menyusun RPS untuk:

- Mata kuliah: [...]
- SKS: [...]
- Program studi: [...]
- Semester: [...]
- CPL Prodi yang dibebankan: [...]

Susun komponen RPS:
1. **Identitas MK** — kode, nama, SKS, semester, prasyarat
2. **Deskripsi MK** — 1 paragraf
3. **CPMK** — 3-5 capaian pembelajaran MK
4. **Sub-CPMK** — breakdown per pertemuan
5. **Bahan Kajian** — daftar topik per pertemuan
6. **Metode Pembelajaran** — variasi per topik (ceramah, diskusi, PBL, PjBL, case study)
7. **Asesmen** — bobot: tugas (30%), UTS (30%), UAS (40%) — atau sesuaikan
8. **Jadwal Pertemuan** — tabel 16 pertemuan: minggu, sub-CPMK, topik, metode, asesmen, referensi
9. **Referensi** — utama (2-3 buku) + pendukung (5+ jurnal)
10. **Kontrak Perkuliahan** — draft aturan kelas` },

  { id:60, cat:"perencanaan", title:"Modul Ajar Kurikulum Merdeka", desc:"Modul sesuai struktur Kurikulum Merdeka Belajar", difficulty:"intermediate",
    tags:["modul ajar","Kurikulum Merdeka","CP","ATP"],
    prompt:`Anda adalah pengembang kurikulum yang memahami Kurikulum Merdeka. Susun modul ajar:

- Mata pelajaran/kuliah: [...]
- Fase/tingkat: [...]
- Topik: [...]
- Alokasi waktu: [... JP]

Komponen: Informasi Umum, CP, TP (ABCD), ATP, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran (dengan diferensiasi), Asesmen (diagnostik, formatif, sumatif + rubrik), Pengayaan & Remediasi, Refleksi, Lampiran (LKPD). Format siap cetak.` },

  { id:61, cat:"perencanaan", title:"Desain Pembelajaran PBL/PjBL", desc:"Skenario Problem/Project-Based Learning", difficulty:"intermediate",
    tags:["PBL","PjBL","desain","4C"],
    prompt:`Anda adalah ahli desain instruksional. Rancang skenario [PBL/PjBL]:

- Mata kuliah: [...]
- CPL: [...]
- Mahasiswa: [±N]
- Durasi: [MINGGU]

Komponen: Deskripsi masalah/proyek autentik, Driving Question, Tahapan per pertemuan, Scaffolding, Sumber belajar, Rubrik penilaian proses & produk, Refleksi. Akomodasi 4C.` },

  { id:62, cat:"perencanaan", title:"Kontrak Perkuliahan", desc:"Kesepakatan dosen-mahasiswa untuk satu semester", difficulty:"beginner",
    tags:["kontrak","perkuliahan","aturan","kesepakatan"],
    prompt:`Anda adalah dosen berpengalaman. Bantu menyusun kontrak perkuliahan untuk:

- Mata kuliah: [...]
- Semester: [...]
- Jumlah mahasiswa: [±N]
- Sistem blok: [YA/TIDAK, jika ya: berapa pertemuan/minggu]

Komponen:
1. **Identitas MK** dan dosen pengampu
2. **Deskripsi singkat** dan capaian pembelajaran
3. **Aturan kehadiran** — minimal %, konsekuensi absen
4. **Sistem penilaian** — komponen, bobot, KKM
5. **Jadwal & topik** — ringkasan per pertemuan
6. **Aturan tugas** — deadline, format, plagiarisme
7. **Etika perkuliahan** — penggunaan HP, keterlambatan, dresscode
8. **Komunikasi** — channel (WA group, LMS, email), waktu respons
9. **Konsekuensi pelanggaran**
10. **Tanda tangan** — dosen + perwakilan mahasiswa

Format: Siap cetak 1-2 halaman.` },

  { id:63, cat:"perencanaan", title:"Desain Pembelajaran Berbasis HOTS", desc:"Integrasi Bloom C4-C6 dalam skenario", difficulty:"intermediate",
    tags:["HOTS","Bloom","C4","C5","C6","higher order"],
    prompt:`Anda adalah ahli asesmen dan desain pembelajaran tingkat tinggi. Bantu merancang pembelajaran yang mengintegrasikan HOTS (Higher Order Thinking Skills).

Mata kuliah: [...]
Topik: [...]
Level Bloom target: [C4 Analisis / C5 Evaluasi / C6 Mencipta]

Rancang:
1. **Tujuan Pembelajaran** — menggunakan kata kerja operasional HOTS
2. **Stimulus/Trigger** — kasus/data/fenomena yang memicu berpikir tingkat tinggi
3. **Kegiatan Pembelajaran**
   - Aktivitas C4: analisis kasus, identifikasi pola, bandingkan-kontraskan
   - Aktivitas C5: evaluasi solusi, kritik artikel, debat berbasis bukti
   - Aktivitas C6: desain solusi, buat produk baru, kembangkan model
4. **Pertanyaan Pemandu** — minimal 5 pertanyaan HOTS dengan jawaban expected
5. **Asesmen** — rubrik penilaian HOTS (bukan hanya recall/pemahaman)
6. **Scaffolding** — bagaimana mendukung mahasiswa yang belum terbiasa berpikir HOTS` },

  // ─── C2. ASESMEN & EVALUASI ───
  { id:64, cat:"asesmen", title:"Rubrik Penilaian Komprehensif", desc:"Rubrik analitik untuk berbagai jenis tugas", difficulty:"intermediate",
    tags:["rubrik","penilaian","asesmen","evaluasi"],
    prompt:`Anda adalah asesor pendidikan. Buat rubrik analitik untuk: [JENIS TUGAS].

- Mata kuliah: [...]
- Level: [S1/S2/S3]
- Kriteria: 4-6
- Skala: 4 level (Sangat Baik/Baik/Cukup/Kurang)
- Bobot sesuai kompleksitas

Per sel: deskriptor kualitatif spesifik + rentang skor + contoh. Sertakan panduan penggunaan.` },

  { id:65, cat:"asesmen", title:"Generator Pertanyaan Diskusi Forum", desc:"Pertanyaan berantai berbasis artikel untuk e-learning", difficulty:"intermediate",
    tags:["diskusi","forum","e-learning","Bloom"],
    prompt:`Anda adalah fasilitator pembelajaran daring. Buat pertanyaan diskusi forum:

1. Pertanyaan utama — berbasis artikel, minimal C4 Bloom
2. Pertanyaan lanjutan — mendalami aspek tertentu
3. Pertanyaan lanjutan 2 — meminta solusi/rekomendasi
4. Kontekstualisasi lokal/nasional
5. Sertakan stimulus (kutipan/data)

Buat 3 set pertanyaan. Materi: [TEMPEL]` },

  { id:66, cat:"asesmen", title:"Generator Soal Ujian (PG & Esai)", desc:"Soal berbasis Bloom taxonomy dengan kunci jawaban", difficulty:"intermediate",
    tags:["soal","ujian","pilihan ganda","esai","Bloom"],
    prompt:`Anda adalah ahli asesmen yang memahami Taksonomi Bloom. Buat soal ujian:

Mata kuliah: [...]
Materi: [TOPIK/BAB]
Jumlah soal: [N PG + N ESAI]
Distribusi Bloom: C1 (10%), C2 (20%), C3 (25%), C4 (25%), C5 (15%), C6 (5%)

**Untuk Pilihan Ganda:**
- Stem yang jelas, 5 opsi (A-E)
- Distractor yang plausibel
- Kunci jawaban + pembahasan singkat
- Tandai level Bloom

**Untuk Esai:**
- Pertanyaan terstruktur, jelas batasan jawaban
- Rubrik penilaian mini (poin-poin yang dinilai + bobot)
- Kunci jawaban/contoh jawaban ideal

Sajikan dalam format yang siap cetak/upload ke LMS.` },

  { id:67, cat:"asesmen", title:"Evaluasi & Feedback Tugas Mahasiswa", desc:"CJR, CBR, mini riset, makalah, portofolio", difficulty:"intermediate",
    tags:["evaluasi","feedback","CJR","CBR","portofolio"],
    prompt:`Anda adalah dosen yang memberikan feedback konstruktif. Evaluasi tugas mahasiswa berikut:

Jenis tugas: [CJR / CBR / MINI RISET / MAKALAH / PORTOFOLIO / LAPORAN]
Mata kuliah: [...]
Tugas: [LAMPIRKAN]

Evaluasi berdasarkan:
1. **Substansi/Konten** — kedalaman analisis, akurasi, kelengkapan (bobot 40%)
2. **Struktur & Organisasi** — sistematika, koherensi antar bagian (bobot 20%)
3. **Argumentasi & Analisis Kritis** — tidak sekadar deskriptif (bobot 20%)
4. **Bahasa & Referensi** — tata bahasa, format APA, sitasi (bobot 10%)
5. **Keaslian & Kreativitas** — originalitas pemikiran (bobot 10%)

Output:
- Skor per kriteria (skala 1-100)
- Skor total
- Feedback naratif: kelebihan → kekurangan → saran perbaikan spesifik
- Catatan: natural, tidak menyebut nama mahasiswa` },

  { id:68, cat:"asesmen", title:"Desain E-Learning & Konten LMS", desc:"Struktur kursus daring, forum, quiz, assignment", difficulty:"intermediate",
    tags:["e-learning","LMS","Moodle","kursus daring"],
    prompt:`Anda adalah desainer e-learning berpengalaman. Bantu merancang kursus daring:

Mata kuliah: [...]
Platform: [MOODLE / GOOGLE CLASSROOM / LMS KAMPUS]
Durasi: [16 MINGGU]
Mahasiswa: [±N]

Rancang:
1. **Struktur Kursus** — organisasi per minggu/topik
2. **Untuk setiap pertemuan:**
   - Materi (video/PDF/artikel) + estimasi waktu belajar
   - Aktivitas (forum diskusi/quiz/assignment/peer review)
   - Deadline dan instruksi
3. **Forum Diskusi** — 5 topik diskusi terstruktur
4. **Quiz Online** — 3 quiz formatif (format, jumlah soal, timer, attempt)
5. **Tugas/Assignment** — 4 tugas dengan rubrik dan instruksi jelas
6. **Engagement Strategy** — bagaimana menjaga partisipasi mahasiswa
7. **Asesmen** — bobot: partisipasi (10%), quiz (20%), tugas (30%), UTS (20%), UAS (20%)` },

  // ─── C3. SUPERVISI & BIMBINGAN ───
  { id:69, cat:"supervisi", title:"Bimbingan Skripsi/Tesis/Disertasi", desc:"Feedback per bab, catatan pembimbing, checklist revisi", difficulty:"intermediate",
    tags:["bimbingan","skripsi","tesis","pembimbing"],
    prompt:`Anda adalah pembimbing akademik yang memberikan feedback detail dan konstruktif. Review draft bab berikut:

Level: [SKRIPSI/TESIS/DISERTASI]
Bab: [BAB KE-...]
Draft: [LAMPIRKAN]

Berikan feedback dalam format catatan pembimbing:
1. **Evaluasi Umum** — kesan keseluruhan (1 paragraf)
2. **Catatan Per Bagian** — untuk setiap sub-bab:
   - Apa yang sudah baik (apresiasi spesifik)
   - Apa yang perlu diperbaiki (dengan contoh/arahan konkret)
   - Pertanyaan kritis yang harus dijawab mahasiswa
3. **Checklist Revisi** — daftar numbered yang harus dikerjakan mahasiswa
4. **Prioritas** — tandai: [WAJIB] vs [DISARANKAN] vs [OPSIONAL]
5. **Deadline Revisi** — rekomendasi waktu untuk revisi berikutnya

Nada: supportive, tegas tapi tidak menghakimi, membimbing bukan mendikte.` },

  { id:70, cat:"supervisi", title:"Penilaian Ujian Sidang (Penguji)", desc:"Pertanyaan penguji, catatan, rubrik sidang", difficulty:"advanced",
    tags:["sidang","penguji","ujian","pertanyaan"],
    prompt:`Anda adalah penguji sidang [SKRIPSI/TESIS/DISERTASI] yang kritis namun fair. Berdasarkan naskah yang dilampirkan, siapkan:

Judul: [JUDUL]
Naskah: [LAMPIRKAN/RINGKASAN]

1. **Evaluasi Naskah** — ringkasan kekuatan dan kelemahan utama
2. **Pertanyaan Penguji** — 5-8 pertanyaan kritis yang menguji:
   - Pemahaman konseptual (mengapa memilih teori/metode ini?)
   - Kedalaman analisis (bagaimana jika...?)
   - Pertahanan metodologis (mengapa tidak menggunakan...?)
   - Implikasi dan kontribusi (apa signifikansinya?)
   - Keterbatasan (apakah anda menyadari bahwa...?)
3. **Anticipated Answers** — jawaban yang diharapkan
4. **Rubrik Penilaian Sidang** — 5 komponen: penguasaan materi, kemampuan argumentasi, kedalaman analisis, sikap ilmiah, kualitas naskah
5. **Catatan untuk berita acara** — template ringkas` },

  { id:71, cat:"supervisi", title:"Penilaian PPG (Portofolio, RPP, DDI)", desc:"Rubrik PPG prajabatan dan dalam jabatan", difficulty:"advanced",
    tags:["PPG","portofolio","RPP","DDI","penilaian"],
    prompt:`Anda adalah asesor PPG (Pendidikan Profesi Guru) berpengalaman. Evaluasi dokumen berikut:

Jenis: [PORTOFOLIO RPP / MODUL AJAR / STUDI KASUS / LAPORAN PPL / DDI]
Dokumen: [LAMPIRKAN]

Evaluasi menggunakan rubrik resmi PPG:
1. **Untuk Portofolio RPP/Modul Ajar:**
   - Kelengkapan komponen (identitas, CP, TP, kegiatan, asesmen)
   - Kesesuaian dengan Kurikulum Merdeka
   - Diferensiasi pembelajaran
   - Asesmen formatif dan sumatif
   - Skor: 1-4 per komponen

2. **Untuk DDI (Demonstrasi Diri Inovatif):**
   - 10 kompetensi DDI yang telah ditetapkan
   - Bukti penerapan inovasi
   - Refleksi profesional

3. **Output:**
   - Tabel skor per komponen
   - Catatan kualitatif ringkas
   - Rekomendasi: Lulus/Perlu Perbaikan/Tidak Lulus
   - Skor rentang 7-8 untuk yang memenuhi standar` },

  // ─── D1. CODING & DATA ───
  { id:72, cat:"coding", title:"Python Data Analysis Script", desc:"Script Python untuk analisis data penelitian", difficulty:"intermediate",
    tags:["Python","pandas","statistik","script"],
    prompt:`Anda adalah data scientist. Buatkan script Python:

Tujuan: [ANALISIS: deskriptif/korelasi/regresi/uji beda/faktor]
Data: Format [CSV/Excel], Variabel: [...], N=[...]

Script harus: import libraries, cleaning, deskriptif, uji asumsi, analisis utama, visualisasi publication-ready, interpretasi (komentar Bahasa Indonesia), export hasil. Clean dan well-commented.` },

  { id:73, cat:"coding", title:"Web Scraping Metadata Jurnal", desc:"Mengambil metadata artikel dari database jurnal", difficulty:"advanced",
    tags:["scraping","Scopus","metadata","Crossref"],
    prompt:`Anda adalah developer Python. Script untuk scraping metadata dari [Scopus/Google Scholar/Crossref/Semantic Scholar]:

Keyword: [...], N artikel: [...], Tahun: [...]
Ekstrak: judul, penulis, tahun, jurnal, DOI, abstract, citation count, keywords
Output: DataFrame → CSV + Excel + visualisasi tren. Gunakan API resmi jika ada. Error handling robust.` },

  { id:74, cat:"coding", title:"Dashboard Data Interaktif", desc:"Dashboard visualisasi data dengan React", difficulty:"advanced",
    tags:["dashboard","React","visualisasi","chart"],
    prompt:`Anda adalah frontend developer & data viz specialist. Dashboard interaktif:

Data: [DESKRIPSI]
Komponen: Summary cards, Line chart, Bar chart, Pie chart, Data table (sort+search), Filter panel
Spesifikasi: React + Tailwind + Recharts, responsive, dark/light mode, export CSV, animasi smooth. Kode lengkap siap jalan.` },

  { id:75, cat:"coding", title:"Visualisasi Data Publication-Ready", desc:"Grafik standar jurnal dengan Python/R", difficulty:"intermediate",
    tags:["visualisasi","matplotlib","seaborn","ggplot","grafik"],
    prompt:`Anda adalah ahli visualisasi data akademik. Buatkan grafik publication-ready:

Data: [LAMPIRKAN]
Jenis grafik yang dibutuhkan: [BAR/LINE/SCATTER/HEATMAP/BOX PLOT/VIOLIN]
Target jurnal: [NAMA JURNAL / UMUM]

Ketentuan:
1. **Style** — clean, minimalist, sesuai standar jurnal (font size 10-12pt, 300 DPI)
2. **Warna** — accessible, colorblind-friendly, grayscale-compatible
3. **Label** — axis labels jelas, legend informatif, title deskriptif
4. **Format output** — PNG (300 DPI) + SVG + PDF
5. **Kode** — Python (matplotlib/seaborn) ATAU R (ggplot2), well-commented
6. **Variasi** — berikan 2-3 alternatif visualisasi untuk data yang sama

Berikan kode lengkap siap dijalankan.` },

  { id:76, cat:"coding", title:"Google Sheets / Excel Formula Builder", desc:"Otomasi tabulasi, pivot, analisis data", difficulty:"beginner",
    tags:["Excel","Google Sheets","formula","pivot"],
    prompt:`Anda adalah ahli spreadsheet. Bantu saya membuat formula/template:

Platform: [GOOGLE SHEETS / EXCEL]
Kebutuhan: [JELASKAN APA YANG INGIN DIHITUNG/DIKELOLA]
Data: [DESKRIPSI STRUKTUR DATA]

Berikan:
1. **Struktur tabel** — header, format kolom, tipe data
2. **Formula** — untuk setiap perhitungan: formula lengkap + penjelasan
3. **Conditional formatting** — aturan warna/highlight
4. **Pivot table** — jika relevan, cara setup
5. **Chart** — jenis chart dan data range yang tepat
6. **Tips** — shortcut, best practices, error handling

Sajikan formula yang siap copy-paste. Jelaskan setiap bagian formula.` },

  // ─── D2. KOMUNIKASI & BRANDING ───
  { id:77, cat:"komunikasi", title:"Email Akademik Profesional", desc:"Email formal untuk submission, kolaborasi, korespondensi", difficulty:"beginner",
    tags:["email","submission","korespondensi","cover letter"],
    prompt:`Anda adalah komunikator akademik profesional. Tulis email untuk: [PILIH: submission/reviewer invitation/editor correspondence/collaboration request/cover letter].

Penerima: [...], Konteks: [...], Tujuan: [...]

Ketentuan: Bahasa Inggris formal, struktur Greeting→Context→Purpose→Action→Closing, sopan dan ringkas, subject line jelas. Berikan 2 versi: formal dan semi-formal.` },

  { id:78, cat:"komunikasi", title:"Konten LinkedIn Akademik", desc:"Personal branding akademik di LinkedIn", difficulty:"beginner",
    tags:["LinkedIn","branding","konten","sosial media"],
    prompt:`Anda adalah content strategist untuk personal branding akademik. Buat konten LinkedIn:

Peran: [DOSEN/PENELITI/MAHASISWA S3], Topik: [...], Tujuan: [brand awareness/thought leadership/networking]

3 variasi: Story-based (hook personal + narasi + lesson), Insight-based (data + analisis + perspektif), How-to (problem + steps + takeaway). 150-200 kata, emoji profesional, 3-5 hashtag.` },

  { id:79, cat:"komunikasi", title:"Storytelling untuk Presentasi", desc:"Narasi engaging untuk presentasi akademik", difficulty:"beginner",
    tags:["presentasi","storytelling","public speaking"],
    prompt:`Anda adalah communication coach akademik. Bangun narasi presentasi untuk: [TOPIK].

Audiens: [...], Durasi: [MENIT]

Struktur: Hook (30 detik) → Problem (2 menit) → Journey → Insight (klimaks) → Call to Action. Sertakan: 3 analogi, transisi smooth, tips delivery, antisipasi 5 pertanyaan + jawaban.` },

  { id:80, cat:"komunikasi", title:"Infografis Penelitian", desc:"Konsep infografis untuk diseminasi riset", difficulty:"intermediate",
    tags:["infografis","visualisasi","desain","diseminasi"],
    prompt:`Anda adalah information designer. Rancang konsep infografis untuk riset:

Judul: [...], Temuan: [3-5 POIN], Data kunci: [...], Audiens: [...]

Rancang: Layout, visual hierarchy, data visualization, color palette (hex), typography, iconography, copy/text per section, dimensi (poster/sosmed/slide). Deskripsi visual detail agar desainer bisa eksekusi.` },

  { id:81, cat:"komunikasi", title:"Skrip Video Edukasi / Konten Sosmed", desc:"YouTube, TikTok, Reels format 1-3 menit", difficulty:"beginner",
    tags:["video","YouTube","TikTok","skrip","edukasi"],
    prompt:`Anda adalah content creator edukasi. Buat skrip video:

Platform: [YOUTUBE / TIKTOK / REELS / KULIAH ONLINE]
Topik: [...]
Durasi: [1/2/3 MENIT]
Target: [MAHASISWA/GURU/UMUM]

Struktur skrip:
1. **Hook** (5 detik) — kalimat pembuka yang bikin berhenti scroll
2. **Problem** (15 detik) — masalah yang relatable
3. **Content** (isi utama) — 3 poin kunci, bahasa sederhana
4. **Visual notes** — [TAMPILKAN: ...], [TEKS DI LAYAR: ...]
5. **CTA** (5 detik) — ajakan like/follow/comment/share

Berikan juga: hashtag, caption, thumbnail idea, timing per scene.` },

  // ─── D3. PRODUKTIVITAS ───
  { id:82, cat:"produktivitas", title:"Manajemen Proyek Riset", desc:"WBS, timeline, risk register untuk penelitian", difficulty:"intermediate",
    tags:["manajemen","timeline","Gantt","WBS"],
    prompt:`Anda adalah project manager riset. Susun rencana untuk: [JUDUL].

Durasi: [...], Tim: [...], Anggaran: [...]

Komponen: WBS, Timeline/Gantt, Resource allocation, Risk register, Communication plan, QA, M&E. Format siap digunakan. Prioritaskan critical path.` },

  { id:83, cat:"produktivitas", title:"Business Model Canvas", desc:"BMC untuk produk/bisnis digital", difficulty:"intermediate",
    tags:["BMC","bisnis","startup","digital"],
    prompt:`Anda adalah konsultan bisnis digital. Susun BMC untuk: [PRODUK/BISNIS].

9 elemen: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure.

Per elemen: penjelasan detail + contoh konkret + rekomendasi. Tambahkan analisis kompetitor dan go-to-market strategy.` },

  { id:84, cat:"produktivitas", title:"Lyra 4-D Prompt Optimizer", desc:"Optimasi prompt dengan framework Lyra 4-D", difficulty:"intermediate",
    tags:["prompt engineering","Lyra","optimasi","AI"],
    prompt:`Anda adalah prompt engineer ahli (Lyra 4-D). Optimalkan prompt berikut:

Prompt asli: [TEMPEL]

1. **Deconstruct** — urai: tujuan, konteks, format, constraints
2. **Diagnose** — kelemahan: ambiguitas, missing context, format tidak jelas
3. **Develop** — versi optimal: role, context, instructions, output format, guardrails
4. **Deliver** — prompt final siap pakai

Output: Optimized Prompt + Key Improvements + Techniques Used + Pro Tip.` },

  { id:85, cat:"produktivitas", title:"Penyusunan Dokumen Akreditasi (LED/LKPS)", desc:"Narasi kriteria, data pendukung, evaluasi diri", difficulty:"advanced",
    tags:["akreditasi","LED","LKPS","LAMDIK","BAN-PT"],
    prompt:`Anda adalah konsultan akreditasi pergurgan tinggi berpengalaman. Bantu menyusun dokumen akreditasi:

Jenis: [LED / LKPS / Evaluasi Diri]
Kriteria: [NOMOR KRITERIA]
Program Studi: [...]
Lembaga akreditasi: [BAN-PT / LAMDIK / LAM lainnya]

Susun narasi mencakup:
1. **Deskripsi kondisi** — apa yang sudah dilakukan/dicapai
2. **Data pendukung** — tabel/grafik/bukti yang diperlukan (tandai [PERLU DATA])
3. **Analisis kecukupan** — apakah sudah memenuhi standar?
4. **Analisis ketercapaian** — sejauh mana target tercapai?
5. **Evaluasi diri** — kekuatan, kelemahan, peluang perbaikan
6. **Rencana tindak lanjut** — langkah perbaikan berkelanjutan
7. **Skor estimasi** — estimasi skor berdasarkan rubrik (1-4)

Nada: objektif, berbasis data, tidak berlebihan. Format sesuai template akreditasi terbaru.` },

  { id:86, cat:"produktivitas", title:"Logbook Kegiatan (PPK Ormawa, KKN, PPL)", desc:"Narasi kegiatan, kendala-solusi, dokumentasi", difficulty:"beginner",
    tags:["logbook","PPK","Ormawa","KKN","PPL"],
    prompt:`Anda adalah mahasiswa yang menulis logbook kegiatan secara profesional. Bantu menyusun logbook untuk:

Program: [PPK ORMAWA / KKN / PPL / MAGANG]
Kegiatan: [DESKRIPSI KEGIATAN HARI INI]
Tanggal: [...]
Lokasi: [...]

Susun logbook dengan gaya mahasiswa yang komunikatif:
1. **Deskripsi Kegiatan** — apa yang dilakukan, siapa terlibat, hasil
2. **Keterlibatan Stakeholder** — peran mitra/masyarakat/pembimbing
3. **Kesesuaian dengan Tujuan Program** — hubungkan dengan proposal
4. **Kendala & Solusi** — masalah yang dihadapi dan cara mengatasinya
5. **Refleksi** — apa yang dipelajari hari ini
6. **Lampiran** — daftar foto/dokumen pendukung

Gaya: ringkas, padat, komunikatif. Hindari narasi terlalu panjang atau terlalu singkat.` },

  { id:87, cat:"produktivitas", title:"Roadmap Penelitian & Pengabdian Dosen", desc:"Peta jalan riset 5 tahun, target luaran", difficulty:"advanced",
    tags:["roadmap","penelitian","pengabdian","dosen"],
    prompt:`Anda adalah konsultan pengembangan karir akademik. Bantu menyusun roadmap penelitian dan pengabdian:

Nama dosen: [...]
Bidang keahlian: [...]
Jabatan fungsional saat ini: [LEKTOR/LEKTOR KEPALA/GURU BESAR]
Target 5 tahun: [...]

Susun roadmap:
1. **Tema Payung Penelitian** — 1 tema besar yang menaungi seluruh riset
2. **Sub-Tema per Tahun** — breakdown tema ke sub-topik tahunan
3. **Target Luaran per Tahun:**
   - Publikasi (jurnal Q1/Q2/Sinta, prosiding)
   - HKI (hak cipta, paten)
   - Buku (monograf, referensi, ajar)
   - Produk/teknologi
4. **Sumber Pendanaan** — internal, BIMA, Kemendikbud, industri, internasional
5. **Tim dan Kolaborasi** — mahasiswa bimbingan, kolega, mitra internasional
6. **Pengabdian Masyarakat** — integrasi riset dengan pengabdian
7. **Target Kenaikan Jabatan** — timeline dan syarat AK yang dibutuhkan
8. **Milestone & KPI** — indikator keberhasilan per semester

Format: Tabel roadmap 5 tahun + narasi strategis. Realistis dan achievable.` },
];

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function App() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [activeDiff, setActiveDiff] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [favIds, setFavIds] = useState(() => {
    try { const s = localStorage.getItem("pp-favs"); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { try { localStorage.setItem("pp-favs", JSON.stringify([...favIds])); } catch {} }, [favIds]);

  const filtered = useMemo(() => PROMPTS.filter((p) => {
    if (activeCat !== "all" && p.cat !== activeCat) return false;
    if (activeDiff !== "all" && p.difficulty !== activeDiff) return false;
    if (showFavOnly && !favIds.has(p.id)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)) || p.prompt.toLowerCase().includes(q);
  }), [search, activeCat, activeDiff, showFavOnly, favIds]);

  const handleCopy = useCallback((id, text) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); });
  }, []);

  const toggleFav = useCallback((id) => {
    setFavIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const selectCat = (id) => { setActiveCat(id); setSidebarOpen(false); if (listRef.current) listRef.current.scrollTop = 0; };

  const catCounts = useMemo(() => {
    const c = {}; PROMPTS.forEach(p => { c[p.cat] = (c[p.cat] || 0) + 1; }); return c;
  }, []);

  const groupedCats = useMemo(() => {
    const groups = {};
    CATEGORIES.filter(c => c.group).forEach(c => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });
    return groups;
  }, []);

  const C = { bg: "#0a0b1a", bg2: "#111225", bg3: "#181937", accent: "#6c5ce7", accent2: "#a29bfe", border: "rgba(108,92,231,0.15)", text: "#e2e8f0", text2: "#94a3b8", text3: "#64748b" };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 50%, #0d1530 100%)`, color:C.text, fontFamily:"'Outfit','DM Sans',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${C.border}`, background:"rgba(10,11,26,0.8)", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width:36, height:36, borderRadius:10, background:C.bg3, border:`1px solid ${C.border}`, color:C.text2, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>☰</button>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:22, fontWeight:700, margin:0, background:"linear-gradient(135deg, #c7d2fe, #a5b4fc, #818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.02em" }}>Pustaka Prompt</h1>
              <p style={{ fontSize:11, color:C.text3, margin:0, letterSpacing:"0.06em", textTransform:"uppercase" }}>{PROMPTS.length} prompt akademik & profesional</p>
            </div>
            <button onClick={() => setShowFavOnly(v => !v)} style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${showFavOnly ? "#f87171" : C.border}`, background: showFavOnly ? "rgba(248,113,113,0.15)" : C.bg3, color: showFavOnly ? "#fca5a5" : C.text3, cursor:"pointer", fontSize:12, fontWeight:500 }}>
              {showFavOnly ? "♥" : "♡"} {favIds.size > 0 && favIds.size}
            </button>
          </div>
          {/* SEARCH */}
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.text3, fontSize:14, pointerEvents:"none" }}>🔍</span>
            <input ref={searchRef} type="text" placeholder="Cari prompt..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", padding:"11px 11px 11px 36px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:12, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" }}
              onFocus={e => { e.target.style.borderColor = "rgba(108,92,231,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(108,92,231,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} />
            {search && <button onClick={() => { setSearch(""); searchRef.current?.focus(); }} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"rgba(108,92,231,0.2)", border:"none", borderRadius:6, color:"#a5b4fc", cursor:"pointer", padding:"3px 8px", fontSize:11 }}>✕</button>}
          </div>
          {/* DIFFICULTY PILLS */}
          <div style={{ display:"flex", gap:6, marginTop:10 }}>
            {[{ id:"all", label:"Semua" }, ...Object.entries(DIFF).map(([k,v]) => ({ id:k, label:v.label }))].map(d => (
              <button key={d.id} onClick={() => setActiveDiff(d.id)} style={{ padding:"4px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:500, background: activeDiff === d.id ? "rgba(108,92,231,0.25)" : "rgba(30,30,60,0.5)", color: activeDiff === d.id ? "#a5b4fc" : C.text3 }}>{d.label}</button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, maxWidth:1100, margin:"0 auto", width:"100%", position:"relative" }}>
        {/* SIDEBAR OVERLAY */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:60 }} />}

        {/* SIDEBAR */}
        <nav style={{
          position:"fixed", left: sidebarOpen ? 0 : -300, top:0, bottom:0, width:280, background:C.bg2,
          borderRight:`1px solid ${C.border}`, zIndex:70, transition:"left 0.25s ease", overflowY:"auto", padding:"16px 0",
          WebkitOverflowScrolling:"touch",
        }}>
          <div style={{ padding:"12px 16px 16px", borderBottom:`1px solid ${C.border}`, marginBottom:8 }}>
            <p style={{ fontSize:13, fontWeight:600, color:C.text2, margin:0, letterSpacing:"0.04em", textTransform:"uppercase" }}>Kategori</p>
          </div>
          {/* All */}
          <button onClick={() => selectCat("all")} style={{ width:"100%", padding:"10px 16px", border:"none", cursor:"pointer", textAlign:"left", background: activeCat === "all" ? "rgba(108,92,231,0.15)" : "transparent", color: activeCat === "all" ? "#a5b4fc" : C.text2, fontSize:13, fontWeight: activeCat === "all" ? 600 : 400, borderLeft: activeCat === "all" ? "3px solid #6c5ce7" : "3px solid transparent", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>◈ Semua Prompt</span>
            <span style={{ fontSize:11, opacity:0.6, background:"rgba(108,92,231,0.15)", padding:"1px 7px", borderRadius:5 }}>{PROMPTS.length}</span>
          </button>

          {/* Grouped categories */}
          {Object.entries(groupedCats).map(([grp, cats]) => (
            <div key={grp}>
              <div style={{ padding:"12px 16px 4px", fontSize:11, fontWeight:600, color:C.text3, textTransform:"uppercase", letterSpacing:"0.06em" }}>{GROUP_LABELS[grp]}</div>
              {cats.map(cat => {
                const isActive = activeCat === cat.id;
                const count = catCounts[cat.id] || 0;
                return (
                  <button key={cat.id} onClick={() => selectCat(cat.id)} style={{ width:"100%", padding:"8px 16px 8px 20px", border:"none", cursor:"pointer", textAlign:"left", background: isActive ? "rgba(108,92,231,0.15)" : "transparent", color: isActive ? "#a5b4fc" : C.text2, fontSize:12, fontWeight: isActive ? 500 : 400, borderLeft: isActive ? "3px solid #6c5ce7" : "3px solid transparent", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.15s" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13 }}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span style={{ fontSize:10, opacity:0.5, background:"rgba(100,100,150,0.15)", padding:"1px 6px", borderRadius:4 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <main ref={listRef} style={{ flex:1, padding:"16px 16px 60px", width:"100%" }}>
          {/* Active category badge */}
          {activeCat !== "all" && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <span style={{ fontSize:14 }}>{CATEGORIES.find(c => c.id === activeCat)?.icon}</span>
              <span style={{ fontSize:14, fontWeight:600, color:"#a5b4fc" }}>{CATEGORIES.find(c => c.id === activeCat)?.label}</span>
              <button onClick={() => setActiveCat("all")} style={{ padding:"2px 8px", borderRadius:5, border:"none", background:"rgba(108,92,231,0.15)", color:"#a5b4fc", cursor:"pointer", fontSize:11 }}>✕ Reset</button>
            </div>
          )}

          {/* Results count */}
          <div style={{ fontSize:12, color:C.text3, marginBottom:12 }}>
            <span style={{ background:"rgba(108,92,231,0.15)", color:"#a5b4fc", padding:"2px 7px", borderRadius:5, fontWeight:600, fontSize:11 }}>{filtered.length}</span> prompt
            {search && <span> untuk "<strong style={{ color:"#a5b4fc" }}>{search}</strong>"</span>}
          </div>

          {/* CARDS */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px", background:"rgba(30,30,60,0.3)", borderRadius:14, border:`1px dashed ${C.border}` }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <p style={{ color:C.text2, fontSize:14 }}>Tidak ada prompt yang cocok.</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map(p => {
                const isOpen = expandedId === p.id;
                const diff = DIFF[p.difficulty];
                const catObj = CATEGORIES.find(c => c.id === p.cat);
                return (
                  <div key={p.id} style={{ background: isOpen ? "rgba(25,25,55,0.9)" : "rgba(20,20,45,0.6)", border:`1px solid ${isOpen ? "rgba(108,92,231,0.3)" : C.border}`, borderRadius:12, overflow:"hidden", transition:"all 0.2s" }}>
                    <div onClick={() => setExpandedId(isOpen ? null : p.id)} style={{ padding:"14px 14px 12px", cursor:"pointer", display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:34, height:34, borderRadius:8, flexShrink:0, background:`rgba(108,92,231,0.1)`, border:`1px solid rgba(108,92,231,0.15)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{catObj?.icon || "📄"}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
                          <h3 style={{ margin:0, fontSize:14, fontWeight:600, color:C.text, lineHeight:1.3 }}>{p.title}</h3>
                          <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, background:`${diff.color}20`, color:diff.color, fontWeight:500 }}>{diff.label}</span>
                        </div>
                        <p style={{ margin:0, fontSize:12, color:C.text2, lineHeight:1.4 }}>{p.desc}</p>
                        <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                          {p.tags.slice(0,3).map(t => (
                            <span key={t} onClick={e => { e.stopPropagation(); setSearch(t); }} style={{ fontSize:10, padding:"1px 6px", borderRadius:4, background:"rgba(108,92,231,0.08)", color:"#818cf8", cursor:"pointer" }}>#{t}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
                        <button onClick={e => { e.stopPropagation(); toggleFav(p.id); }} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, padding:0, color: favIds.has(p.id) ? "#f87171" : "#475569" }}>{favIds.has(p.id) ? "♥" : "♡"}</button>
                        <span style={{ fontSize:12, color:C.text3, transform:`rotate(${isOpen?180:0}deg)`, transition:"transform 0.2s" }}>▾</span>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ borderTop:`1px solid ${C.border}`, padding:14 }}>
                        <div style={{ background:"rgba(8,8,25,0.7)", borderRadius:10, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", borderBottom:`1px solid rgba(108,92,231,0.08)`, background:"rgba(108,92,231,0.04)" }}>
                            <span style={{ fontSize:10, color:"#818cf8", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Prompt template</span>
                            <button onClick={() => handleCopy(p.id, p.prompt)} style={{ padding:"4px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, background: copiedId === p.id ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#6c5ce7,#a29bfe)", color:"#fff" }}>
                              {copiedId === p.id ? "✓ Tersalin!" : "📋 Salin"}
                            </button>
                          </div>
                          <pre style={{ padding:14, margin:0, fontSize:12, lineHeight:1.65, color:"#cbd5e1", whiteSpace:"pre-wrap", wordBreak:"break-word", fontFamily:"'JetBrains Mono',monospace", maxHeight:350, overflowY:"auto" }}>{p.prompt}</pre>
                        </div>
                        <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(108,92,231,0.05)", borderRadius:8, display:"flex", alignItems:"center", gap:6, border:`1px solid rgba(108,92,231,0.08)` }}>
                          <span style={{ fontSize:12 }}>💡</span>
                          <span style={{ fontSize:11, color:C.text2 }}>Ganti <strong style={{ color:"#a5b4fc" }}>[KURUNG SIKU]</strong> dengan informasi spesifik anda.</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* FOOTER */}
          <div style={{ marginTop:36, textAlign:"center", padding:"16px 0", borderTop:`1px solid ${C.border}` }}>
            <p style={{ fontSize:11, color:C.text3, margin:0 }}>Pustaka Prompt — {PROMPTS.length} prompt akademik & profesional<br/>Built with ⚡ by frd77</p>
          </div>
        </main>
      </div>

      <style>{`
        input::placeholder { color: #4a5568; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(108,92,231,0.2); border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:rgba(108,92,231,0.4); }
        * { box-sizing:border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-3px)} to{opacity:1;transform:translateY(0)} }
        nav::-webkit-scrollbar { width:4px; }
      `}</style>
    </div>
  );
}
