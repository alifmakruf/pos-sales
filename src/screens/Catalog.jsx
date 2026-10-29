import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Barcode, ImageUp, Pencil, Plus, ScanBarcode, Search, Store, Warehouse, X, Zap } from 'lucide-react'
import { Badge, Btn, Card, Chip, Empty, Header, ProductImage, Screen, SearchField, Stepper, Summary } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { PRODUCTS, startPrice } from '../data'
import { cn, rp } from '../lib'
import { CONFIG } from '../config'
import { useProceed } from './NewOrder.jsx'

const CATS = ['Semua', 'Meja', 'Lemari', 'Kasur', 'Kursi']

// Modal Pemindai Barcode Real-Time Menggunakan Lazy Loaded Engine Html5-Qrcode
function BarcodeScannerModal({ open, onClose, onScan }) {
  const [manualCode, setManualCode] = useState('')
  const [cameraError, setCameraError] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [torchOn, setTorchOn] = useState(false)      // Status senter (flashlight) kamera
  const [torchSupported, setTorchSupported] = useState(false) // Apakah perangkat mendukung senter
  const scannerRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoTrackRef = useRef(null)                 // Referensi video track untuk kontrol torch

  useEffect(() => {
    if (!open) return
    let active = true

    // Lazy load library html5-qrcode hanya saat modal dibuka (mencegah error 504 outdated optimize dep)
    import('html5-qrcode')
      .then(({ Html5Qrcode, Html5QrcodeSupportedFormats }) => {
        if (!active) return

        const formatsToSupport = [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.ITF,
        ]

        const scanner = new Html5Qrcode('barcode-scanner-view', {
          formatsToSupport,
          verbose: false,
        })
        scannerRef.current = scanner

        const config = {
          fps: CONFIG.animations.scannerFps || 10,
          qrbox: { width: 260, height: 140 }, // Rasio horizontal optimal untuk barcode garis 1D
          aspectRatio: 1.333333,
        }

        scanner
          .start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              if (!active) return
              scanner
                .stop()
                .catch(() => {})
                .finally(() => {
                  onScan(decodedText)
                })
            },
            () => {} // Abaikan per-frame decode error saat barcode belum di depan kamera
          )
          .then(() => {
            if (!active) return
            setIsScanning(true)
            // Ambil video track untuk kontrol torch/flashlight
            const video = document.querySelector('#barcode-scanner-view video')
            const track = video?.srcObject?.getVideoTracks?.()?.[0]
            if (track) {
              videoTrackRef.current = track
              const caps = track.getCapabilities?.()
              // Cek dukungan torch di perangkat
              if (caps?.torch) setTorchSupported(true)
            }
          })
          .catch(() => {
            if (active) setCameraError(true)
          })
      })
      .catch((err) => {
        console.error('Gagal memuat modul scanner:', err)
        if (active) setCameraError(true)
      })

    return () => {
      active = false
      videoTrackRef.current = null
      setTorchOn(false)
      setTorchSupported(false)
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current?.clear()
        })
      } else {
        scannerRef.current?.clear()
      }
    }
  }, [open, onScan])

  if (!open) return null

  // Toggle senter/flashlight kamera belakang
  const toggleTorch = () => {
    const track = videoTrackRef.current
    if (!track) return
    const next = !torchOn
    track.applyConstraints({ advanced: [{ torch: next }] })
      .then(() => setTorchOn(next))
      .catch(() => {}) // Abaikan jika perangkat tidak mendukung
  }

  // Pindai dari file gambar
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file || !scannerRef.current) return
    scannerRef.current
      .scanFile(file, true)
      .then((decodedText) => {
        onScan(decodedText)
      })
      .catch(() => {
        alert('Barcode tidak terbaca pada gambar ini. Pastikan gambar jelas dan terang.')
      })
  }

  const samples = [
    { code: '2461427', label: 'Meja Belajar (Lipat Hitam)' },
    { code: '1234567', label: 'Meja Belajar (Lipat Putih)' },
    { code: '3300101', label: 'Meja Dapur (Pulau S)' },
    { code: '6600401', label: 'Lemari Pakaian (Dua Pintu)' },
    { code: '8800601', label: 'Kursi Kantor (Jaring)' },
  ]

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    onScan(manualCode.trim())
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Scan Barcode">
      <div className="relative flex w-full max-w-md flex-col gap-4 rounded-2xl bg-card p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScanBarcode className="size-6 text-accent" />
            <div>
              <h3 className="text-xl font-bold leading-tight">Pindai Barcode</h3>
              <p className="text-[11px] text-muted">Arahkan kamera ke barcode produk</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Tombol senter — hanya tampil jika kamera aktif dan perangkat mendukung */}
            {torchSupported && (
              <button
                aria-label={torchOn ? 'Matikan senter' : 'Nyalakan senter'}
                onClick={toggleTorch}
                className={`rounded-lg p-2 transition-colors ${
                  torchOn ? 'bg-accent/20 text-accent' : 'text-muted hover:bg-chip hover:text-fg'
                }`}
              >
                <Zap className="size-5" fill={torchOn ? 'currentColor' : 'none'} />
              </button>
            )}
            <button aria-label="Tutup pemindai" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-chip hover:text-fg">
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder kamera real-time dengan Html5Qrcode engine */}
        <div className="relative h-56 w-full overflow-hidden rounded-xl bg-black">
          <div id="barcode-scanner-view" className="h-full w-full" />

          {/* Bingkai bidik scanner */}
          <div className="pointer-events-none absolute inset-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg border-2 border-dashed border-accent/40" />
            <div className="absolute left-0 top-0 size-5 border-l-4 border-t-4 border-accent" />
            <div className="absolute right-0 top-0 size-5 border-r-4 border-t-4 border-accent" />
            <div className="absolute bottom-0 left-0 size-5 border-b-4 border-l-4 border-accent" />
            <div className="absolute bottom-0 right-0 size-5 border-b-4 border-r-4 border-accent" />

            {/* Garis laser animasi merah */}
            {isScanning && (
              <div
                className="scan-laser-line absolute left-0 right-0 h-0.5 shadow-[0_0_8px_#ef4444]"
                style={{
                  backgroundColor: CONFIG.animations.laserColor || '#ef4444',
                  '--laser-speed': CONFIG.animations.laserSpeed || '2s',
                }}
              />
            )}
          </div>

          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 p-4 text-center">
              <ScanBarcode className="size-10 text-muted" />
              <p className="text-xs text-muted">Kamera tidak dapat diakses atau izin ditolak.</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-ink"
              >
                <ImageUp className="size-4" />
                Unggah Foto Barcode
              </button>
            </div>
          )}
        </div>

        {/* Baris opsi: Upload foto barcode & input manual */}
        <div className="flex items-center justify-between gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-lg bg-sub px-3 py-2 text-xs font-medium text-fg hover:bg-chip transition-colors"
          >
            <ImageUp className="size-4 text-accent" />
            Unggah Foto Barcode
          </button>
          <span className="text-[11px] text-muted">atau ketik di bawah</span>
        </div>

        {/* Form input barcode manual */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            className="h-11 flex-1 rounded-xl border border-line2 bg-sub px-3 text-sm text-fg outline-none placeholder:text-hint focus:border-accent"
            placeholder="Ketik angka barcode (cth: 2461427)"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />
          <Btn type="submit" className="h-11 px-4 text-sm">Pindai</Btn>
        </form>

        {/* Sampel barcode untuk pengujian instan */}
        <div className="flex flex-col gap-1.5 border-t border-line pt-2">
          <span className="text-[11px] text-muted">Uji cepat barcode:</span>
          <div className="flex flex-wrap gap-1.5">
            {samples.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => onScan(s.code)}
                className="flex items-center gap-1.5 rounded-lg bg-sub px-2.5 py-1 text-xs text-fg hover:bg-chip hover:text-accent transition-colors"
              >
                <Barcode className="size-3.5 text-muted" />
                <span className="font-mono font-semibold">{s.code}</span>
                <span className="text-[10px] text-muted">({s.label.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ p, onOpen }) {
  const { unitsOfProduct } = useStore()
  const n = unitsOfProduct(p.id)
  return (
    <Card className={cn('flex flex-col gap-2 p-2.5', CONFIG.sizes.catalogItemBg || 'bg-sub')}>
      <div className="relative">
        <ProductImage id={p.id} alt={p.name} className="aspect-square w-full rounded-xl" />
        {n > 0 && <Badge className="absolute right-0 top-0 rounded-none rounded-tr-xl">{n} Terpilih</Badge>}
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted">
        <span>{p.variants.length} Tipe</span>
        <Badge tone="muted">Stok {p.branchStock}</Badge>
      </div>
      <h3 className="font-semibold leading-tight">{p.name}</h3>
      <div className="mt-auto flex items-end justify-between">
        <div className="text-[11px] text-muted">Mulai Dari<p className="text-sm font-semibold text-price">{rp(startPrice(p))}</p></div>
        <button aria-label={n ? `Ubah ${p.name}` : `Tambah ${p.name}`} onClick={() => onOpen(p.id)} className={cn('grid size-10 place-items-center rounded-lg', n ? 'bg-accent text-ink' : 'border border-line2 bg-chip')}>
          {n ? <Pencil className="size-5" /> : <Plus className="size-5" />}
        </button>
      </div>
    </Card>
  )
}

function Detail({ p, onClose }) {
  const { unitsOfProduct } = useStore()
  const tile = 'flex flex-col gap-1 rounded-xl bg-sub p-3 text-xs text-muted'
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <ProductImage id={p.id} alt={p.name} className="size-24 rounded-lg" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{p.name}</h2>
          <p className="text-lg text-price">{rp(startPrice(p))}</p>
        </div>
        <button aria-label="Kembali ke katalog" onClick={onClose} className="rounded-lg p-2 hover:bg-chip"><ArrowLeft /></button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className={tile}>Stok di Seluruh Cabang<span className="flex items-center gap-1.5 text-sm text-fg"><Warehouse className="size-4" />{p.branchStock} Unit</span></div>
        <div className={tile}>Stok di Toko<span className="flex items-center gap-1.5 text-sm text-fg"><Store className="size-4 text-warn" />{p.storeStock} Unit</span></div>
        <div className={cn(tile, 'bg-accent text-ink')}>Terpilih<span className="text-sm font-medium">{unitsOfProduct(p.id)} Unit</span></div>
      </div>
    </Card>
  )
}

function Variants({ p }) {
  const { qtyOf, setQty } = useStore()
  return (
    <Card className="p-4">
      <ul className="flex flex-col gap-3">
        {p.variants.map((x) => (
          <li key={x.id} className="flex items-center justify-between gap-3 rounded-xl bg-sub p-4">
            <div>
              <p className="text-lg font-semibold">{x.name.replace(p.name + ' ', '')}</p>
              <p className="text-price">{rp(x.price)}</p>
              <p className="text-[10px] text-muted">{x.code}</p>
              <p className="mt-1 text-sm text-muted">{x.stock > 0 ? `Stok Tersedia ${x.stock}` : 'Stok habis'}</p>
            </div>
            <Stepper value={qtyOf(p.id, x.id)} max={x.stock} onChange={(q) => setQty(p.id, x.id, q)} />
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function Catalog() {
  const [q, setQ] = useState('')
  const [mode, setMode] = useState('nama') // 'nama' | 'barcode'
  const [showScanner, setShowScanner] = useState(false)
  const [cat, setCat] = useState('Semua')
  const [sel, setSel] = useState(null)
  const { notify } = useStore()
  const proceed = useProceed()

  const handleScanResult = (code) => {
    setShowScanner(false)
    setMode('barcode')
    setQ(code)
    const matched = PRODUCTS.find(
      (x) => x.id.toLowerCase() === code.toLowerCase() || x.variants.some((v) => v.code === code)
    )
    if (matched) {
      notify(`Barcode cocok: ${matched.name}`)
      setSel(matched.id)
    } else {
      notify(`Barcode ${code} tidak cocok`)
    }
  }

  const p = PRODUCTS.find((x) => x.id === sel)

  const list = PRODUCTS.filter((x) => {
    if (cat !== 'Semua' && x.category !== cat) return false
    if (!q.trim()) return true
    const term = q.trim().toLowerCase()
    if (mode === 'barcode') {
      return (
        x.id.toLowerCase().includes(term) ||
        x.variants.some((v) => v.code.toLowerCase().includes(term) || v.id.toLowerCase().includes(term))
      )
    }
    return (
      x.name.toLowerCase().includes(term) ||
      x.variants.some((v) => v.name.toLowerCase().includes(term))
    )
  })

  return (
    <Screen>
      <Header title="Pesanan Baru" back="/order" />
      <div className="grid flex-1 content-start gap-4 lg:grid-cols-[340px_1fr] lg:items-start">
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3 p-4">
            {/* Tab Segmented Control: Nama, Barcode, Scan (Responsif 3-Kolom) */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-sub p-1">
              <button
                type="button"
                onClick={() => setMode('nama')}
                className={cn(
                  'flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors',
                  mode === 'nama' ? 'bg-accent text-ink shadow-sm' : 'text-muted hover:text-fg hover:bg-chip',
                )}
              >
                <Search className="size-3.5 shrink-0" />
                <span className="truncate">Nama</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('barcode')}
                className={cn(
                  'flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors',
                  mode === 'barcode' ? 'bg-accent text-ink shadow-sm' : 'text-muted hover:text-fg hover:bg-chip',
                )}
              >
                <Barcode className="size-3.5 shrink-0" />
                <span className="truncate">Barcode</span>
              </button>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="flex items-center justify-center gap-1 rounded-lg border border-accent/40 bg-accent/15 py-1.5 text-xs font-medium text-accent hover:bg-accent hover:text-ink transition-colors"
              >
                <ScanBarcode className="size-3.5 shrink-0" />
                <span className="truncate">Scan</span>
              </button>
            </div>

            {/* Input pencarian sesuai mode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted">
                {mode === 'barcode' ? 'Kode / ID Barcode' : 'Nama Barang'}
              </label>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-muted">
                  {mode === 'barcode' ? <Barcode className="size-4" /> : <Search className="size-4" />}
                </span>
                <input
                  type="text"
                  className={cn(
                    CONFIG.sizes.inputHeight,
                    CONFIG.sizes.inputRadius,
                    'w-full border border-line2 bg-sub pl-10 text-sm text-fg outline-none placeholder:text-hint focus:border-accent',
                    mode === 'barcode' ? 'pr-12' : 'pr-4',
                  )}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={mode === 'barcode' ? 'Ketik angka barcode (cth: 2461427)...' : 'Cari Meja Belajar, Kasur...'}
                />
                {mode === 'barcode' && (
                  <button
                    type="button"
                    aria-label="Pindai barcode kamera"
                    onClick={() => setShowScanner(true)}
                    className="absolute right-1.5 grid size-9 place-items-center rounded-lg bg-chip text-muted hover:bg-accent hover:text-ink transition-colors"
                    title="Buka scanner barcode"
                  >
                    <ScanBarcode className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>

          {p ? <Detail p={p} onClose={() => setSel(null)} /> : (
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible" role="group" aria-label="Kategori">
              {CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
            </div>
          )}
        </div>

        {p ? <Variants p={p} /> : (
          <Card className="p-3 lg:p-4">
            {list.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{list.map((x) => <ProductCard key={x.id} p={x} onOpen={setSel} />)}</div>
            ) : (
              <Empty>
                {mode === 'barcode'
                  ? `Tidak ada barang dengan ID/Barcode “${q}”.`
                  : `Tidak ada barang bernama “${q}”. Coba kata kunci lain atau pilih kategori Semua.`}
              </Empty>
            )}
          </Card>
        )}
      </div>

      <Summary onNext={proceed} />

      {/* Modal Scanner Barcode */}
      <BarcodeScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanResult}
      />
    </Screen>
  )
}
