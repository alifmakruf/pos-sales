/**
 * ==============================================================================
 * FILE KONFIGURASI PUSAT (CENTRAL CONFIGURATION)
 * ==============================================================================
 * Ubah semua parameter di file ini untuk mengatur tampilan, warna, teks, headline,
 * ukuran tombol, logo, dan seluruh isi website POS Sales.
 *
 * Catatan Performa:
 * - Menggunakan native CSS custom properties, 0ms runtime overhead.
 * - Sangat ringan dan responsif tanpa library pihak ketiga.
 * ==============================================================================
 */

export const CONFIG = {
  // ----------------------------------------------------------------------------
  // 1. IDENTITAS BRAND & LOGO
  // ----------------------------------------------------------------------------
  brand: {
    name: 'HEXA',                    // Nama Brand / Headline utama logo
    subtitle: 'Furnitur',            // Subjudul brand di bawah logo
    type: 'image',                     // Tipe logo: 'svg' (vektor bawaan) | 'image' (file gambar) | 'text' (hanya teks)
    imageUrl: '/logo.png',    // Path gambar jika type: 'image' (letakkan file di folder public/)
    width: 'w-56 lg:w-72',           // Lebar logo pada halaman login (Tailwind classes)
    accentLineColor: '#f63b3b',      // Warna garis hiasan logo (hex)
    gradientStart: '#f63b3b',        // Gradien logo awal
    gradientEnd: '#fd9393',          // Gradien logo akhir
  },

  // ----------------------------------------------------------------------------
  // 2. TEMA WARNA (THEME COLORS)
  // Diaplikasikan langsung ke CSS variables (:root) secara instan.
  // ----------------------------------------------------------------------------
  theme: {
    // Mode Gelap (Dark Mode - Default)
    dark: {
      bg: '#120B0C',       // Background utama halaman
      card: '#211416',     // Background kartu & kontainer
      sub: '#190F11',      // Background elemen sekunder & input
      chip: '#382124',     // Background chip filter & tombol sekunder
      line: '#382023',     // Border tipis & garis pemisah
      line2: '#4D2A2F',    // Border input & kartu sekunder

      fg: '#FFFFFF',       // Warna teks utama
      muted: '#BDA9AB',    // Warna teks sekunder
      hint: '#927A7D',     // Warna placeholder & hint

      accent: '#E53945',   // Aksen utama: tombol primary
      soft: '#FF6B72',     // Aksen sekunder: badge & highlight
      ink: '#FFFFFF',      // Teks di atas tombol merah

      price: '#FF6B72',    // Warna nominal harga
      head: '#FFF0F0',     // Warna headline & judul penting

      warn: '#FACC15',     // Status peringatan
      danger: '#FF5252',   // Status error & gagal
      success: '#22c55e',  // Status transaksi sukses (warna hijau agar kontras dari tema merah)
      successInk: '#052e16', // Warna teks di atas badge sukses
    },
    // Mode Terang (Light Mode)
    light: {
      bg: '#FAF8F8',          // Background utama halaman
      card: '#FFFFFF',        // Background kartu & kontainer
      sub: '#f0e9e9',          // Background elemen sekunder & input
      chip: '#F5E9EA',         // Background chip filter & tombol sekunder
      line: '#EDE0E1',         // Border tipis & garis pemisah
      line2: '#DCC8CA',        // Border input & kartu sekunder

      fg: '#1F1718',           // Warna teks utama
      muted: '#766467',        // Warna teks sekunder
      hint: '#A18D90',         // Warna placeholder & hint

      accent: '#D92F3D',       // Aksen utama: tombol primary
      soft: '#F16A74',         // Aksen sekunder: badge & highlight
      ink: '#FFFFFF',          // Teks di atas tombol merah

      price: '#C62836',        // Warna nominal harga
      head: '#40191E',         // Warna headline & judul penting

      warn: '#D9A514',         // Status peringatan
      danger: '#DC3545',       // Status error & gagal

      success: '#16A34A',     // Status sukses
      successInk: '#FFFFFF',  // Teks pada status sukses
    },
  },

  // ----------------------------------------------------------------------------
  // 3. UKURAN & BENTUK (SIZES & SPACING)
  // ----------------------------------------------------------------------------
  sizes: {
    screenMaxWidth: 'max-w-[744px] lg:max-w-[1133px]', // Lebar maksimum layar tampilan
    cardRadius: 'rounded-2xl',                         // Kelengkungan sudut kartu (border-radius)
    cardBorder: '',                                    // Garis tepi kartu umum (kosong '' = tanpa border di semua halaman)
    homeCardBorder: '',                                // Garis tepi kartu khusus Home page (kosong '' = tanpa garis border)
    catalogItemBg: 'bg-sub',                           // Background card item di catalog agar kontras dari container bg-card
    buttonRadius: 'rounded-xl',                       // Kelengkungan sudut tombol
    inputRadius: 'rounded-xl',                        // Kelengkungan sudut input form
    inputHeight: 'h-[53px]',                          // Tinggi elemen input form
    primaryBtnHeight: 'h-12',                         // Tinggi tombol utama
    largeBtnHeight: 'h-14',                           // Tinggi tombol besar (checkout/submit)
    fabSize: 'size-[78px]',                           // Ukuran tombol melayang (FAB)
  },

  // ----------------------------------------------------------------------------
  // ANIMASI & EFEK VISUAL (ANIMATIONS & PARTICLES)
  // ----------------------------------------------------------------------------
  animations: {
    // Efek Logo Melayang (Floating Logo) & Backdrop Bercahaya
    logoFloatDuration: '3.6s',        // Kecepatan ayunan naik-turun logo
    logoFloatDistance: '6px',         // Jarak ayunan terapung
    logoGlowBlur: '100px',             // Ketebalan pendaran cahaya (blur) di belakang logo
    logoGlowOpacity: 0.45,            // Kepekatan pendaran cahaya (0.1 - 1.0)
    logoGlowSize: '120%',             // Ukuran pendaran dibanding ukuran logo

    // Efek Partikel Cahaya Bintang pada Input Login
    particleCount: 5,                 // Jumlah bintang kecil yang keluar saat input aktif
    particleColor: 'var(--soft)',     // Warna partikel bintang
    particleDuration: '1.4s',         // Durasi 1 putaran animasi (mengulang terus/loop selama input aktif)
    particleRiseDistance: '26px',     // Jarak bintang melayang ke atas sebelum memudar
    particleGlow: '0 0 6px var(--soft)', // Efek kilau lembut pada bintang

    // Efek Spotlight pada Login Card saat Input Aktif
    spotlightDimOpacity: 0.45,        // Kepekatan efek redup di area sekitar login card (0.1 - 0.9)
    spotlightCardShadow: '0 8px 30px -6px color-mix(in srgb, var(--accent) 20%, transparent)', // Drop shadow halus kartu login saat spotlight aktif (tipis & lembut)
    spotlightCardBorder: 'border-accent/20', // Warna garis tepi kartu login saat spotlight aktif
    spotlightGlowOpacity: 0,          // Kepekatan pendaran spotlight di belakang login card
    spotlightBlur: '14px',            // Kelembutan radius pendaran spotlight

    // Efek Masuk Fade In Up (Halaman Login & Home)
    fadeInUpDuration: '0.45s',        // Durasi animasi masuk fade in up halaman
    fadeInUpDistance: '22px',         // Jarak geser dari bawah ke atas
    fadeInUpEase: 'cubic-bezier(0.16, 1, 0.3, 1)', // Kurva kelembutan transisi

    // Efek Angka Berhitung Naik (Count Up) di Home Page
    countUpDuration: 1100,            // Durasi angka berhitung naik saat masuk Home (milidetik)

    // Efek Mengkilap (Shimmer) pada Card Transaksi Sukses
    // Siklus: 0.5s kilap + 5s jeda = 5.5s total
    // Rasio aktif (9.09%) hardcoded di @keyframes — sesuaikan jika ubah shimmerCycle
    shimmerCycle: '5.5s',             // Total siklus 1 putaran kilap (kilap + jeda idle)
    shimmerOpacity: 0.12,             // Kepekatan kilap solid tanpa blur (0.05–0.25)
    shimmerAngle: '-50deg',           // Kemiringan garis kilap (negatif = miring ke kanan)

    // Efek Liquid Fill pada Card Target Mingguan (2-Layer SVG Wave)
    liquidDuration: '1.1s',           // Durasi animasi pengisian awal naik (fill-up)
    liquidColor: '',                  // Override warna liquid (kosong '' = otomatis tema: putih di dark, hitam di light)
    liquidWave1Speed: '5s',           // Kecepatan ayunan wave layer 1 / belakang (lebih kecil = lebih cepat)
    liquidWave2Speed: '3.5s',         // Kecepatan ayunan wave layer 2 / depan (lebih kecil = lebih cepat)
    liquidWave1Opacity: 0.45,         // Transparansi wave layer 1 / belakang (0.1 - 1.0)
    liquidWave2Opacity: 0.85,         // Transparansi wave layer 2 / depan (0.1 - 1.0)

    // Efek Barcode Scanner pada Halaman Catalog
    laserColor: '#ef4444',            // Warna garis laser pemindai barcode
    laserSpeed: '2s',                 // Kecepatan ayunan naik-turun garis laser scanner
  },

  // ----------------------------------------------------------------------------
  // 4. KUSTOMISASI TOMBOL (BUTTONS STYLING)
  // ----------------------------------------------------------------------------
  buttons: {
    // Tombol Utama (Primary Button: Buat Pesanan, Login, Konfirmasi)
    primary: {
      bg: 'bg-accent',
      text: 'text-ink',
      shadow: 'shadow-[0_6px_18px_-6px_var(--accent)]',
      hover: 'hover:brightness-110',
      letterSpacing: 'tracking-wider',
      fontWeight: 'font-medium',
    },
    // Tombol Sekunder (Secondary Button: Draft, Google, Kembali)
    secondary: {
      bg: 'bg-chip',
      text: 'text-fg',
      border: 'border border-line2',
      hover: 'hover:brightness-110',
      letterSpacing: 'tracking-wider',
      fontWeight: 'font-medium',
    },
  },

  // ----------------------------------------------------------------------------
  // 5. ISI TEKS, HEADLINE & PARAGRAF (CONTENT & LABELS)
  // ----------------------------------------------------------------------------
  text: {
    // Halaman Login
    login: {
      title: 'Login',
      usernameLabel: 'Email atau Username',
      usernamePlaceholder: 'example@gmail.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'password',
      submitBtn: 'Login',
      dividerText: 'Atau',
      googleBtn: 'Google',
      errorEmpty: 'Isi email atau username dan password.',
    },

    // Halaman Beranda (Home)
    home: {
      statSuccess: 'Transaksi Sukses',
      statWeekly: 'Target Mingguan',
      statRevenue: 'Total Pendapatan',
      lastTransactionTitle: 'Transaksi Terakhir',
      lastTransactionEmpty: 'Belum ada transaksi hari ini.',
      badgeSuccess: 'Sukses',
      badgeFailed: 'Gagal',
      btnNewOrder: 'Buat Pesanan Baru',
      btnDivider: 'Atau',
      btnResumeOrder: 'Lanjutkan Pesanan sebelumnya',
      noSavedOrderAlert: 'Belum ada pesanan tersimpan.',
      nav: {
        history: 'Riwayat',
        stock: 'Stok',
        customers: 'Customers',
        notebook: 'Notebook',
        settings: 'Pengaturan',
      },
    },

    // Halaman Pesanan Baru (New Order)
    order: {
      headerTitle: 'Pesanan Baru',
      customerSectionTitle: 'Data Customer',
      customerNameLabel: 'Nama customer',
      customerNamePlaceholder: 'Panjar Granowo',
      customerPhoneLabel: 'No. Telepon/WA',
      customerPhonePlaceholder: '857-0633-6657',
      itemsSectionTitle: 'Daftar Barang',
      btnAddItem: 'Tambah Barang',
      emptyItems: 'Belum ada barang. Pilih dari katalog untuk memulai pesanan.',
      alertEmptyCart: 'Tambahkan minimal satu barang.',
      alertEmptyCustomer: 'Isi nama customer dulu.',
      badgeRegular: 'Langganan',
      badgeNew: 'Baru',
    },

    // Halaman Katalog Produk
    catalog: {
      headerTitle: 'Katalog',
      searchPlaceholder: 'Telusuri produk...',
      startingFrom: 'Mulai Dari',
      typesCount: 'Tipe',
      branchStockBadge: 'Stok',
      selectedBadge: 'Terpilih',
      branchStockFull: 'Stok di Seluruh Cabang',
      storeStockFull: 'Stok di Toko',
      selectedUnits: 'Terpilih',
    },

    // Halaman Konfirmasi Pesanan (Confirm)
    confirm: {
      headerTitle: 'Konfirmasi Pesanan',
      emptyMessage: 'Belum ada barang di pesanan ini.',
      emptyAction: 'Pilih barang',
      itemsTitle: 'Item Pesanan',
      paymentSummaryTitle: 'Rincian Pembayaran',
      btnSubmit: 'Konfirmasi Pesanan',
      successToast: (id) => `Pesanan ${id} berhasil dikonfirmasi.`,
    },

    // Halaman Riwayat Transaksi (History)
    history: {
      headerTitle: 'Riwayat',
      sectionTitle: 'Riwayat Pesanan',
      filterToday: 'Hari Ini',
      emptyMessage: 'Tidak ada pesanan pada rentang ini. Ubah tanggal atau matikan filter Hari Ini.',
    },

    // Halaman Stok (Stock)
    stock: {
      headerTitle: 'Stok',
      searchLabel: 'Nama Barang',
      searchPlaceholder: 'Meja Belajar',
      emptyMessage: (f, q) => `Tidak ada barang yang cocok dengan filter ${f}${q ? ` dan "${q}"` : ''}.`,
    },

    // Halaman Pelanggan (Customers)
    customers: {
      headerTitle: 'Customers',
      sectionTitle: 'List Customer',
      searchNameLabel: 'Nama customer',
      searchPhoneLabel: 'No. Telepon/Wa',
      emptyMessage: 'Tidak ada customer yang cocok. Hapus filter untuk melihat semua.',
    },

    // Halaman Catatan (Notebook)
    notebook: {
      headerTitle: 'Notebook',
      searchLabel: 'Telusuri Notebook',
      emptyMessage: (q) => (q ? `Tidak ada catatan dengan "${q}".` : 'Belum ada catatan. Tekan tombol + untuk membuat yang pertama.'),
      titlePlaceholder: 'Judul',
      bodyPlaceholder: 'Tulis catatan...',
      btnSave: 'Simpan',
      btnCancel: 'Batal',
    },

    // Halaman Pengaturan (Settings)
    settings: {
      headerTitle: 'Settings',
      searchLabel: 'Telusuri settings',
      defaultBtn: 'Default settings',
      resetToast: 'Pengaturan dikembalikan ke default.',
      sectionDisplay: 'Tampilan',
      themeLabel: 'Tema',
      emptyMessage: (q) => `Tidak ada pengaturan bernama "${q}".`,
    },

    // Komponen Ringkasan Bawah (Summary Bar)
    summary: {
      totalLabel: 'Total Pesanan',
      unitSuffix: 'Unit',
      btnDraft: 'Draft',
      btnNext: 'Lanjut Ke Pembayaran',
    },
  },
}

/**
 * Menerapkan variabel CSS warna tema secara native & instan ke dokumen (0 overhead).
 * @param {'dark'|'light'} [themeMode]
 */
export function applyTheme(themeMode) {
  if (typeof document === 'undefined') return
  const mode = themeMode || document.documentElement.getAttribute('data-theme') || 'dark'
  const palette = CONFIG.theme[mode] || CONFIG.theme.dark
  const root = document.documentElement
  for (const [key, val] of Object.entries(palette)) {
    const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${kebab}`, val)
    if (kebab !== key) root.style.setProperty(`--${key}`, val)
  }

  // Terapkan variabel CSS animasi halaman
  if (CONFIG.animations) {
    const a = CONFIG.animations
    if (a.fadeInUpDuration) root.style.setProperty('--fade-in-up-duration', a.fadeInUpDuration)
    if (a.fadeInUpDistance) root.style.setProperty('--fade-in-up-distance', a.fadeInUpDistance)
    if (a.fadeInUpEase) root.style.setProperty('--fade-in-up-ease', a.fadeInUpEase)
  }
}

// Inisialisasi otomatis saat script dimuat di browser
if (typeof window !== 'undefined') {
  applyTheme()
}
