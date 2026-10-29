import { useState } from 'react'
import { CalendarDays, ChevronRight, History as Clock } from 'lucide-react'
import { Badge, Card, Chip, Empty, Header, Screen } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { dayKey, fmtDate, fmtTime, rp } from '../lib'

export default function History() {
  const { orders } = useStore()
  const [today, setToday] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [open, setOpen] = useState(null)
  const tk = dayKey(new Date().toISOString())

  const list = orders.filter((o) => {
    const k = dayKey(o.at)
    return (!today || k === tk) && (!from || k >= from) && (!to || k <= to)
  })
  const groups = list.reduce((m, o) => ((m[dayKey(o.at)] ||= []).push(o), m), {})
  const days = Object.keys(groups).sort().reverse()
  const date = 'h-10 rounded-lg border border-line2 bg-sub px-2 text-sm text-fg'

  return (
    <Screen>
      <Header title="Riwayat" />
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-14 place-items-center rounded-xl bg-card"><Clock className="size-8" strokeWidth={1.5} /></span>
        <h2 className="mr-auto text-lg font-semibold">Riwayat Pesanan</h2>
        <Chip active={today} onClick={() => setToday(!today)} className={today ? '' : 'bg-chip'}>Hari Ini</Chip>
        <div className="flex items-center gap-2 rounded-xl bg-warn px-3 py-1.5 text-ink">
          <CalendarDays className="size-5" aria-hidden="true" />
          <input aria-label="Dari tanggal" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={date} />
          <span>–</span>
          <input aria-label="Sampai tanggal" type="date" value={to} onChange={(e) => setTo(e.target.value)} className={date} />
        </div>
      </div>
      {days.length === 0 && <Empty>Tidak ada pesanan pada rentang ini. Ubah tanggal atau matikan filter Hari Ini.</Empty>}
      {days.map((k) => (
        <section key={k} aria-label={`Pesanan ${fmtDate(k)}`} className="flex flex-col gap-3">
          <h3 className="px-1 pt-2 text-muted">{fmtDate(k)}</h3>
          <ul className="grid gap-3 lg:grid-cols-2">
            {groups[k].map((o) => (
              <li key={o.id}>
                <Card className="relative overflow-hidden">
                  <Badge tone={o.status === 'sukses' ? 'success' : 'danger'} className="absolute right-0 top-0 rounded-none rounded-bl-lg px-4">{o.status === 'sukses' ? 'Sukses' : 'gagal'}</Badge>
                  <button className="flex w-full items-center justify-between gap-3 p-5 pt-7 text-left" aria-expanded={open === o.id} onClick={() => setOpen(open === o.id ? null : o.id)}>
                    <div>
                      <p className="text-lg">{o.customer}</p>
                      <p className="text-sm text-muted">{o.phone}</p>
                      <p className="mt-2 text-xs text-muted">{fmtTime(o.at)}, {fmtDate(o.at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-xl text-price">{rp(o.total)}</p>
                      <Badge tone="muted" className="px-4">{o.units} Unit</Badge>
                    </div>
                    <ChevronRight className={`size-5 transition-transform ${open === o.id ? 'rotate-90' : ''}`} />
                  </button>
                  {open === o.id && (
                    <ul className="bg-sub px-5 py-3 text-sm text-muted">
                      <li className="mb-1 text-xs">#{o.id}</li>
                      {o.items.map((i) => <li key={i.vid} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{rp(i.price * i.qty)}</span></li>)}
                    </ul>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Screen>
  )
}
