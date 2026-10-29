import { useState } from 'react'
import { CirclePlus, Pencil, Trash2 } from 'lucide-react'
import { Btn, Card, Empty, Header, Screen, SearchField } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { cn, fmtDate } from '../lib'
import { CONFIG } from '../config'

export default function Notebook() {
  const { notes, upsertNote, deleteNote } = useStore()
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState(null)
  const list = notes.filter((n) => (n.title + n.body).toLowerCase().includes(q.toLowerCase()))
  const inp = cn(
    'w-full rounded-xl border border-line2 bg-sub px-4 py-3 text-fg outline-none',
    CONFIG.ux?.inputFocusStyle || 'focus:border-accent focus:ring-1 focus:ring-accent/30',
  )

  const save = (e) => {
    e.preventDefault()
    if (!edit.title.trim()) return
    upsertNote(edit)
    setEdit(null)
  }

  return (
    <Screen>
      <Header title="Notebook" />
      <Card className="p-4 lg:max-w-md"><SearchField label="Telusuri Notebook" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul atau isi catatan kasir..." /></Card>
      {list.length === 0 && <Empty>{q ? `Tidak ada catatan dengan “${q}”.` : 'Belum ada catatan. Tekan tombol + untuk membuat yang pertama.'}</Empty>}
      <ul className="flex flex-col gap-3">
        {list.map((n) => (
          <li key={n.id}>
            <Card className={cn('flex items-stretch overflow-hidden border border-transparent', CONFIG.ux?.cardHoverEffect)}>
              <div className="flex-1 p-4"><p className="text-xl font-medium">{n.title}</p><p className="text-sm text-muted">{n.body}</p><p className="mt-3 text-[11px] text-hint">{fmtDate(n.at)}</p></div>
              <div className="flex w-20 flex-col items-center justify-center gap-3 bg-chip/60 border-l border-line2/40">
                <button aria-label={`Ubah ${n.title}`} onClick={() => setEdit(n)} className="rounded-lg p-2 hover:bg-line2/50 active:scale-90 transition-all"><Pencil className="size-5" /></button>
                <button aria-label={`Hapus ${n.title}`} onClick={() => deleteNote(n.id)} className="rounded-lg p-2 text-danger hover:bg-danger/10 active:scale-90 transition-all"><Trash2 className="size-6" /></button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <button
        aria-label="Catatan baru"
        onClick={() => setEdit({ title: '', body: '' })}
        className="fixed bottom-6 right-6 grid size-[78px] place-items-center rounded-full bg-accent text-ink shadow-2xl ring-4 ring-accent/30 select-none transition-transform hover:scale-105 active:scale-90 duration-150"
      >
        <CirclePlus className="size-10" strokeWidth={1.5} />
      </button>
      {edit && (
        <div className={cn('fixed inset-0 z-20 grid place-items-center p-4', CONFIG.ux?.modalBackdrop || 'bg-black/60 backdrop-blur-sm')} role="dialog" aria-modal="true" aria-label="Editor catatan">
          <form onSubmit={save} className="flex w-full max-w-lg flex-col gap-3 rounded-2xl bg-card p-5 border border-line shadow-2xl animate-fade-in-up">
            <input autoFocus className={inp} placeholder="Judul" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            <textarea className={inp} rows={6} placeholder="Isi catatan" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} />
            <div className="flex justify-end gap-3"><Btn type="button" variant="secondary" onClick={() => setEdit(null)}>Batal</Btn><Btn type="submit">Simpan catatan</Btn></div>
          </form>
        </div>
      )}
    </Screen>
  )
}
