import { useState } from 'react'
import { User } from 'lucide-react'
import { Card, Chip, Empty, Header, Screen, SearchField } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { cn, phoneDigits, rpShort } from '../lib'
import { CONFIG } from '../config'

const SORTS = {
  Tertinggi: (a, b) => b.total - a.total,
  Baru: (a, b) => new Date(b.last) - new Date(a.last),
  'Paling Sering': (a, b) => b.count - a.count,
}

export default function Customers() {
  const { customers } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sort, setSort] = useState('Paling Sering')
  const list = customers
    .filter((c) => c.name.toLowerCase().includes(name.toLowerCase()) && phoneDigits(c.phone).includes(phoneDigits(phone)))
    .sort(SORTS[sort])

  return (
    <Screen>
      <Header title="Customers" />
      <div className="flex items-center gap-3 px-1">
        <span className="grid size-14 place-items-center rounded-xl bg-card"><User className="size-7" /></span>
        <h2 className="text-lg font-semibold">List Customer</h2>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-3xl">
          <SearchField label="Nama customer" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cari nama pelanggan..." />
          <SearchField label="No. Telepon/Wa" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Cari no. HP (cth: 0812)..." inputMode="tel" />
        </div>
        <div className="flex gap-2 overflow-x-auto lg:ml-auto lg:pb-1" role="group" aria-label="Urutkan">
          {Object.keys(SORTS).map((s) => <Chip key={s} active={sort === s} onClick={() => setSort(s)} className="h-9 px-3 text-xs">{s}</Chip>)}
        </div>
      </div>
      {list.length === 0 && <Empty>Tidak ada customer yang cocok. Hapus filter untuk melihat semua.</Empty>}
      <ul className="flex flex-col gap-3">
        {list.map((c) => (
          <li key={c.id}>
            <Card className={cn('flex items-stretch overflow-hidden border border-transparent', CONFIG.ux?.cardHoverEffect)}>
              <div className="flex flex-1 items-center justify-between gap-3 p-4">
                <div><p className="text-xl font-medium">{c.name}</p><p className="text-sm text-muted">{c.phone}</p></div>
                <div className="text-right"><p className="text-xl font-bold text-price">{rpShort(c.total)}</p><p className="text-[11px] text-muted">{c.units} unit</p></div>
              </div>
              <div className="grid w-20 place-items-center bg-chip/50 border-l border-line2/40"><span className="rounded-lg bg-soft/20 text-soft font-bold px-2.5 py-1 text-sm border border-soft/30">{c.count}x</span></div>
            </Card>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
