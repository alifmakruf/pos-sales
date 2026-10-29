# POS Sales · Hexa Furnitur

Port desain Figma **POS-sales** ke web: React 18 + Vite 6 + Tailwind CSS 4.

## Menjalankan
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil di dist/
```

## Struktur
- `src/index.css` – token warna dark (pondasi) & light, dipetakan ke utilitas Tailwind (`bg-card`, `text-muted`, `bg-accent`, …).
- `src/store.jsx` – state aplikasi (pesanan, draft, riwayat, customer, notebook, tema), disimpan di `localStorage`.
- `src/data.js` – data contoh produk, pesanan, customer.
- `src/ui.jsx` – komponen bersama (Header, Card, Chip, Badge, Stepper, Summary, Logo).
- `src/screens/*` – Login, Home, NewOrder, Catalog (+Varian & Stok), Confirm, History, Stock, Customers, Notebook, Settings.

## Responsif
- Di bawah 1024px: layout **portrait** (iPad mini 744px).
- 1024px ke atas: layout **landscape** (1133px), kolom ganda seperti frame Light • Landscape.
- Tema dark/light diganti dari Pengaturan → Tema (default dark).

## Gambar
Foto produk dibaca dari `public/images/<id-produk>.jpg`
(`meja-belajar`, `meja-dapur`, `meja-ruang-tamu`, `meja-pintar`, `lemari-pakaian`, `kasur-busa`, `kursi-kantor`).
Jika file belum ada, tampil placeholder. Logo HEXA dibuat ulang sebagai SVG di `src/ui.jsx` (`Logo`);
ganti dengan logo asli dari Figma bila perlu.

## Alur
Login (apa saja diterima) → Beranda → Buat Pesanan Baru → isi customer → Tambah Barang → pilih tipe & jumlah → Lanjut Ke Pembayaran → Konfirmasi.
Pesanan terkonfirmasi masuk ke Riwayat, memperbarui statistik Beranda dan daftar Customers.
