import { ShoppingCart, Trash2, User } from 'lucide-react'
import { Badge, Btn, Card, Header, ProductImage, Screen, Stepper, Summary } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { rp } from '../lib'
import { go } from '../router'

export const useProceed = () => {
  const { cart, lines, notify } = useStore()
  return () => {
    if (!lines.length) return notify('Tambahkan minimal satu barang.')
    if (!cart.name.trim()) {
      notify('Isi nama customer dulu.')
      return go('/order')
    }
    go('/confirm')
  }
}

export default function NewOrder() {
  const { cart, lines, customers, setCustomer, setQty } = useStore()
  const proceed = useProceed()
  const known = customers.some((c) => c.name.toLowerCase() === cart.name.trim().toLowerCase())
  const inp = 'h-[53px] w-full rounded-xl border border-line2 bg-sub px-4 text-fg outline-none placeholder:text-hint focus:border-accent'

  return (
    <Screen>
      <Header title="Pesanan Baru" />
      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-chip"><User /></span>
              <h2 className="text-lg font-semibold">Data Customer</h2>
              <Badge tone={known ? 'accent' : 'warn'} className="ml-auto px-4">{known ? 'Langganan' : 'Baru'}</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm text-muted">Nama customer
                <input className={inp} value={cart.name} onChange={(e) => setCustomer({ name: e.target.value })} placeholder="Panjar Granowo" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-muted">No. Telepon/WA
                <span className="flex">
                  <span className="grid w-24 shrink-0 place-items-center rounded-l-xl bg-black text-sm text-white">ID <span className="ml-1 text-hint">+62</span></span>
                  <input className={inp + ' rounded-l-none'} inputMode="tel" value={cart.phone} onChange={(e) => setCustomer({ phone: e.target.value })} placeholder="857-0633-6657" />
                </span>
              </label>
            </div>
          </Card>

          <Card className="flex-1 p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-semibold">Daftar Barang</h2>
            <Btn className="mb-4 h-14 w-full" onClick={() => go('/catalog')}><ShoppingCart className="size-5" />Tambah Barang</Btn>
            {lines.length === 0 && <p className="py-6 text-center text-muted">Belum ada barang. Pilih dari katalog untuk memulai pesanan.</p>}
            <ul className="flex flex-col gap-3">
              {lines.map((l) => (
                <li key={l.pid + l.vid} className="flex flex-wrap items-center gap-3 rounded-xl bg-sub p-3">
                  <ProductImage id={l.pid} alt={l.product.name} className="size-[72px] rounded-lg" />
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="font-medium">{l.product.name}</p>
                    <p className="text-xs text-muted">{l.variant.name}</p>
                    <p className="mt-1 text-xs text-muted">{rp(l.variant.price)} / Unit</p>
                    <p className="text-[10px] text-price">Kode : {l.variant.code}</p>
                  </div>
                  <Stepper value={l.qty} max={l.variant.stock} onChange={(q) => setQty(l.pid, l.vid, q)} />
                  <div className="min-w-24 text-right">
                    <p className="font-bold">{rp(l.subtotal)}</p>
                    <p className="text-xs text-muted">{l.qty} Unit</p>
                  </div>
                  <button aria-label={`Hapus ${l.variant.name}`} onClick={() => setQty(l.pid, l.vid, 0)} className="rounded-lg p-2 text-danger hover:bg-chip"><Trash2 className="size-5" /></button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <aside className="flex flex-col"><Summary stacked onNext={proceed} /></aside>
      </div>
    </Screen>
  )
}
