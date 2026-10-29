import { Check, User } from 'lucide-react'
import { Badge, Btn, Card, Header, ProductImage, Screen } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { cn, rp } from '../lib'
import { go } from '../router'
import { CONFIG } from '../config'

export default function Confirm() {
  const { cart, lines, total, units, confirmOrder, notify, orders } = useStore()
  if (!lines.length) {
    return (
      <Screen>
        <Header title="Konfirmasi Pesanan" back="/order" />
        <p className="p-8 text-center text-muted">Belum ada barang di pesanan ini. <button className="text-soft underline" onClick={() => go('/catalog')}>Pilih barang</button></p>
      </Screen>
    )
  }
  const d = new Date()
  const preview = `ODR-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}${String(orders.length + 1).padStart(2, '0')}`
  const row = 'flex justify-between text-sm text-muted'

  const submit = () => {
    const o = confirmOrder()
    notify(`Pesanan ${o.id} berhasil dikonfirmasi.`)
    go('/home')
  }

  return (
    <Screen>
      <Header title="Konfirmasi Pesanan" back="/order" />
      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <Card className="flex items-center gap-4 p-4">
            <span className="grid size-16 place-items-center rounded-xl bg-chip"><User className="size-8" /></span>
            <div><p className="text-xl">{cart.name}</p><p className="text-sm text-muted">{cart.phone ? `+62 ${cart.phone}` : 'Tanpa nomor telepon'}</p></div>
          </Card>
          <section aria-labelledby="items">
            <div className="mb-2 flex items-center gap-3 px-1">
              <h2 id="items" className="text-lg font-semibold">Item Pesanan</h2>
              <Badge tone="muted">{lines.length} Produk</Badge><Badge tone="muted">{units} Unit</Badge>
            </div>
            <ul className="flex flex-col gap-3">
              {lines.map((l) => (
                <li key={l.pid + l.vid} className={cn('flex items-center gap-3 rounded-2xl bg-card p-3 border border-transparent', CONFIG.ux?.cardHoverEffect)}>
                  <ProductImage id={l.pid} alt={l.product.name} className="size-[72px] rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{l.product.name}</p>
                    <p className="text-xs text-muted">{l.variant.name}</p>
                    <p className="mt-1 text-xs text-muted">{rp(l.variant.price)} / Unit</p>
                    <p className="text-[10px] text-price">Kode : {l.variant.code}</p>
                  </div>
                  <div className="text-right"><p className="text-xl font-bold">{rp(l.subtotal)}</p><p className="text-sm text-muted">{l.qty} Unit</p></div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <Card className="flex flex-col gap-3 p-5 lg:self-start">
          <div className="flex items-baseline justify-between"><h2 className="text-lg font-semibold">Rincian Pembayaran</h2><span className="text-[11px] text-muted">#{preview}</span></div>
          <div className={row}><span>Subtotal Produk</span><span>{rp(total)}</span></div>
          <div className={row}><span>Diskon Promo</span><span>0%</span></div>
          <div className={row}><span>Pajak (PPN 11%)</span><span>Rp0</span></div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div><p className="text-sm">Total Tagihan <span className="text-xs text-muted">{units} Unit</span></p><p className="text-3xl font-bold text-price">{rp(total)}</p></div>
            <Btn className="h-14 w-44 gap-2" onClick={submit}><Check className="size-5" />Konfirmasi</Btn>
          </div>
        </Card>
      </div>
    </Screen>
  )
}
