const v = (id, name, price, stock, code) => ({ id, name, price, stock, code })

// Gambar: letakkan file di public/images/<id>.jpg. Bila tidak ada, tampil placeholder.
export const PRODUCTS = [
  {
    id: 'meja-belajar', name: 'Meja Belajar', category: 'Meja', branchStock: 42, storeStock: 12,
    variants: [
      v('lipat-hitam', 'Meja Belajar Lipat Hitam', 100000, 3, '2461427'),
      v('lipat-putih', 'Meja Belajar Lipat Putih', 100000, 6, '1234567'),
      v('hitam-pekat', 'Meja Belajar Hitam Pekat', 100000, 3, '1234568'),
    ],
  },
  {
    id: 'meja-dapur', name: 'Meja Dapur', category: 'Meja', branchStock: 5, storeStock: 2,
    variants: [
      v('pulau-s', 'Meja Dapur Pulau S', 500000, 1, '3300101'),
      v('pulau-m', 'Meja Dapur Pulau M', 750000, 2, '3300102'),
      v('lipat', 'Meja Dapur Lipat', 500000, 2, '3300103'),
      v('troli', 'Meja Dapur Troli', 500000, 0, '3300104'),
    ],
  },
  {
    id: 'meja-ruang-tamu', name: 'Meja Ruang Tamu', category: 'Meja', branchStock: 1, storeStock: 1,
    variants: [
      v('kopi-bulat', 'Meja Kopi Bulat', 500000, 1, '4400201'),
      v('kopi-kotak', 'Meja Kopi Kotak', 650000, 0, '4400202'),
      v('sudut', 'Meja Sudut', 500000, 0, '4400203'),
      v('set-dua', 'Meja Set Dua', 900000, 0, '4400204'),
    ],
  },
  {
    id: 'meja-pintar', name: 'Meja Pintar', category: 'Meja', branchStock: 0, storeStock: 0,
    variants: [
      v('standing', 'Meja Pintar Standing', 10000000, 0, '5500301'),
      v('gaming', 'Meja Pintar Gaming', 12500000, 0, '5500302'),
      v('studio', 'Meja Pintar Studio', 10000000, 0, '5500303'),
    ],
  },
  {
    id: 'lemari-pakaian', name: 'Lemari Pakaian', category: 'Lemari', branchStock: 18, storeStock: 6,
    variants: [
      v('dua-pintu', 'Lemari Dua Pintu', 1800000, 7, '6600401'),
      v('tiga-pintu', 'Lemari Tiga Pintu', 2600000, 11, '6600402'),
    ],
  },
  {
    id: 'kasur-busa', name: 'Kasur Busa', category: 'Kasur', branchStock: 30, storeStock: 9,
    variants: [
      v('single', 'Kasur Busa 90×200', 1200000, 14, '7700501'),
      v('queen', 'Kasur Busa 160×200', 2400000, 16, '7700502'),
    ],
  },
  {
    id: 'kursi-kantor', name: 'Kursi Kantor', category: 'Kursi', branchStock: 25, storeStock: 8,
    variants: [
      v('jaring', 'Kursi Kantor Jaring', 850000, 12, '8800601'),
      v('kulit', 'Kursi Kantor Kulit', 1450000, 13, '8800602'),
    ],
  },
]

export const startPrice = (p) => Math.min(...p.variants.map((x) => x.price))

const line = (pid, vid, qty, name, price) => ({ pid, vid, qty, name, price })

export const SEED_ORDERS = [
  { id: 'ODR-21111003', customer: 'Panjar Granowo', phone: '62+ 957-0633-6657', status: 'sukses', units: 5, total: 1500000, at: '2026-11-10T10:15:00',
    items: [line('meja-belajar', 'lipat-putih', 5, 'Meja Belajar Lipat Putih', 100000)] },
  { id: 'ODR-21111002', customer: 'Panjar Granowo', phone: '62+ 957-0633-6657', status: 'sukses', units: 5, total: 1500000, at: '2026-11-10T09:40:00',
    items: [line('meja-belajar', 'lipat-hitam', 5, 'Meja Belajar Lipat Hitam', 100000)] },
  { id: 'ODR-21111001', customer: 'Panjar Granowo', phone: '62+ 957-0633-6657', status: 'sukses', units: 5, total: 1500000, at: '2026-11-09T14:05:00',
    items: [line('meja-belajar', 'hitam-pekat', 5, 'Meja Belajar Hitam Pekat', 100000)] },
  { id: 'ODR-21110701', customer: 'Panjar Granowo', phone: '62+ 957-0633-6657', status: 'gagal', units: 5, total: 1500000, at: '2026-11-07T10:15:00',
    items: [line('meja-belajar', 'lipat-hitam', 5, 'Meja Belajar Lipat Hitam', 100000)] },
]

// Pendapatan sebelum pesanan seed di atas, supaya total awal 113jt seperti di desain.
export const BASE_REVENUE = 108500000
export const WEEKLY_TARGET = 10

export const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Panjar Granowo', phone: '62+ 957-0633-6657', total: 113000000, units: 200, count: 3, last: '2026-11-10T10:15:00' },
  { id: 'c2', name: 'Sari Lestari', phone: '62+ 812-3344-5566', total: 27500000, units: 41, count: 5, last: '2026-11-02T16:20:00' },
  { id: 'c3', name: 'Budi Hartono', phone: '62+ 878-9012-3456', total: 8200000, units: 12, count: 2, last: '2026-10-28T11:00:00' },
]

export const SEED_NOTES = [
  { id: 'n1', title: 'Untitled1', body: 'Paragraf', at: '2026-11-10T08:00:00' },
]
