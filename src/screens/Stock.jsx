import { useState } from 'react'
import { Search } from 'lucide-react'
import { Badge, Card, Chip, Empty, Header, ProductImage, Screen, SearchField } from '../ui.jsx'
import { PRODUCTS, startPrice } from '../data'
import { cn, rp } from '../lib'
import { CONFIG } from '../config'

const FILTERS = {
  Semua: () => true,
  Tersedia: (p) => p.branchStock > 5,
  Tinggi: (p) => p.branchStock > 20,
  Rendah: (p) => p.branchStock > 0 && p.branchStock <= 5,
  Habis: (p) => p.branchStock === 0,
}

export default function Stock() {
  const [q, setQ] = useState('')
  const [f, setF] = useState('Semua')
  const [open, setOpen] = useState(null)
  const filterTabs = CONFIG.stock?.filterTabs || ['Semua', 'Tersedia', 'Rendah', 'Habis']
  const filterFn = FILTERS[f] || FILTERS.Semua
  const list = PRODUCTS.filter((p) => filterFn(p) && p.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <Screen>
      <Header title="Stok" />
      <Card className="p-4"><SearchField label="Nama Barang" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama barang (cth: Meja Belajar)..." /></Card>
      <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Filter stok">
        {filterTabs.map((k) => <Chip key={k} active={f === k} onClick={() => setF(k)}>{k}</Chip>)}
      </div>
      {list.length === 0 && <Empty>Tidak ada barang yang cocok dengan filter {f}{q && ` dan “${q}”`}.</Empty>}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => {
          const low = p.variants.filter((v) => v.stock > 0 && v.stock <= 3).length
          const out = p.variants.filter((v) => v.stock === 0).length
          const tone = p.branchStock === 0 ? 'danger' : p.branchStock <= 5 ? 'warn' : 'muted'
          return (
            <li key={p.id}>
              <Card className={cn('flex h-full flex-col gap-2 p-2.5 border border-transparent', CONFIG.ux?.cardHoverEffect)}>
                <ProductImage id={p.id} alt={p.name} className="aspect-square w-full rounded-xl" />
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span>{p.variants.length} Tipe</span><Badge tone={tone}>Stok {p.branchStock}</Badge>
                </div>
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-semibold leading-tight">{p.name}</h3>
                  <span className="flex flex-col gap-1">
                    {low > 0 && <Badge tone="warn" className="justify-center" aria-label={`${low} tipe stok rendah`}>{low}</Badge>}
                    {out > 0 && <Badge tone="danger" className="justify-center" aria-label={`${out} tipe habis`}>{out}</Badge>}
                  </span>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="text-[11px] text-muted">Mulai Dari<p className="text-sm font-semibold text-price">{rp(startPrice(p))}</p></div>
                  <button aria-label={`Lihat tipe ${p.name}`} aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)} className={cn('grid size-10 place-items-center rounded-lg border border-line2 bg-chip transition-all active:scale-90', open === p.id ? 'bg-accent text-ink shadow-sm' : 'hover:bg-line2')}><Search className="size-5" /></button>
                </div>
                {open === p.id && (
                  <ul className="rounded-lg bg-sub p-2.5 text-xs text-muted border border-line2/50 mt-1 animate-fade-in-up">
                    {p.variants.map((v) => <li key={v.id} className="flex justify-between py-0.5"><span>{v.name.replace(p.name + ' ', '')}</span><span className={v.stock === 0 ? 'text-danger font-medium' : ''}>{v.stock}</span></li>)}
                  </ul>
                )}
              </Card>
            </li>
          )
        })}
      </ul>
    </Screen>
  )
}
