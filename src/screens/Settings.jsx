import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Btn, Card, Empty, Header, Screen, SearchField } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { cn } from '../lib'
import { CONFIG } from '../config'

export default function Settings() {
  const { theme, setTheme, notify } = useStore()
  const [q, setQ] = useState('')
  const text = CONFIG.text.settings
  const show = 'tema tampilan dark light gelap terang'.includes(q.toLowerCase())
  const seg = (on) => cn('grid size-12 place-items-center rounded-lg', on ? 'bg-accent text-ink' : 'text-muted')

  return (
    <Screen>
      <Header title={text.headerTitle} />
      <div className="flex items-end justify-between gap-4">
        <Card className="flex-1 p-4 lg:max-w-md"><SearchField label={text.searchLabel} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Aji" /></Card>
        <Btn variant="secondary" className="h-12 px-4 text-xs" onClick={() => { setTheme('dark'); notify(text.resetToast) }}>{text.defaultBtn}</Btn>
      </div>
      {show ? (
        <section aria-labelledby="tampilan" className="flex flex-col gap-2">
          <h2 id="tampilan" className="px-1 text-lg">{text.sectionDisplay}</h2>
          <Card className="flex items-center justify-between p-3 pl-5">
            <span>{text.themeLabel}</span>
            <div role="radiogroup" aria-label={text.themeLabel} className="flex gap-1 rounded-xl border border-line2 bg-sub p-1">
              <button role="radio" aria-checked={theme === 'dark'} aria-label="Gelap" onClick={() => setTheme('dark')} className={seg(theme === 'dark')}><Moon /></button>
              <button role="radio" aria-checked={theme === 'light'} aria-label="Terang" onClick={() => setTheme('light')} className={seg(theme === 'light')}><Sun /></button>
            </div>
          </Card>
        </section>
      ) : <Empty>{text.emptyMessage(q)}</Empty>}
    </Screen>
  )
}

