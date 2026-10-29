import { useState, useEffect } from 'react'
import { Armchair, BookUser, BrickWall, ChevronRight, CircleUserRound, Container, History, LogOut, NotebookPen, Settings, Warehouse } from 'lucide-react'
import { Badge, Btn, Card, Screen } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { WEEKLY_TARGET } from '../data'
import { cn, jt, rp } from '../lib'
import { go } from '../router'
import { CONFIG } from '../config'

// Hook ringan untuk animasi angka berhitung naik (60fps native rAF)
function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    let frameId
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3) // cubic ease-out
      setVal(Math.round(easeOut * target))
      if (progress < 1) {
        frameId = requestAnimationFrame(step)
      }
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])
  return val
}

// Kartu khusus Home yang mengikuti konfigurasi CONFIG.sizes.homeCardBorder
const HomeCard = (props) => <Card border={CONFIG.sizes.homeCardBorder} {...props} />

// Card transaksi sukses — efek mengkilap (shimmer) periodik
function SuccessStat({ label, value, of, className }) {
  const anim = CONFIG.animations
  const shimmerStyle = {
    '--shimmer-cycle': anim.shimmerCycle,
    '--shimmer-opacity': anim.shimmerOpacity,
    '--shimmer-angle': anim.shimmerAngle,
  }
  return (
    <HomeCard
      className={cn('card-shimmer flex justify-between gap-3 p-5 font-semibold text-head', className)}
      style={shimmerStyle}
    >
      <p className="text-xl leading-tight sm:text-2xl">{label}</p>
      <p className="self-end text-5xl font-bold leading-none sm:text-6xl">
        {value}
        {of && <span className="text-2xl font-semibold sm:text-3xl">/{of}</span>}
      </p>
    </HomeCard>
  )
}

// Card target mingguan — efek liquid fill sesuai progres (2 SVG wave)
function WeeklyStat({ label, value, of, className }) {
  const pct = of > 0 ? Math.min((value / of) * 100, 100) : 0
  const anim = CONFIG.animations
  const trackStyle = {
    '--liquid-pct': `${pct}%`,
    '--liquid-color': anim.liquidColor || undefined,
    '--liquid-duration': anim.liquidDuration,
    '--liquid-wave1-speed': anim.liquidWave1Speed || '5s',
    '--liquid-wave2-speed': anim.liquidWave2Speed || '3.5s',
    '--liquid-wave1-opacity': anim.liquidWave1Opacity ?? 0.45,
    '--liquid-wave2-opacity': anim.liquidWave2Opacity ?? 0.85,
  }
  return (
    <HomeCard className={cn('liquid-fill flex justify-between gap-3 p-5', className)}>
      {/* Lapisan liquid 2 SVG wave (panjang ke bawah agar tidak bolong saat naik) */}
      <div className="liquid-fill-track" style={trackStyle} aria-hidden="true">
        <svg className="liquid-svg liquid-wave-back" viewBox="0 0 1200 320" preserveAspectRatio="none">
          <path d="M 0,20 C 150,5 150,5 300,20 C 450,35 450,35 600,20 C 750,5 750,5 900,20 C 1050,35 1050,35 1200,20 V 320 H 0 Z" />
        </svg>
        <svg className="liquid-svg liquid-wave-front" viewBox="0 0 1200 320" preserveAspectRatio="none">
          <path d="M 0,20 C 150,35 150,35 300,20 C 450,5 450,5 600,20 C 750,35 750,35 900,20 C 1050,5 1050,5 1200,20 V 320 H 0 Z" />
        </svg>
      </div>
      {/* Konten di atas lapisan liquid */}
      <p className="relative z-10 text-xl leading-tight text-muted sm:text-2xl">{label}</p>
      <p className="relative z-10 self-end text-5xl font-bold leading-none sm:text-6xl">
        {value}
        {of && <span className="text-2xl font-semibold sm:text-3xl">/{of}</span>}
      </p>
    </HomeCard>
  )
}

export default function Home() {
  const { user, orders, draft, revenue, logout, startOrder, loadDraft, notify } = useStore()
  const ok = orders.filter((o) => o.status === 'sukses')
  const last = orders[0]
  const hours = last && new Date(last.at)
  const text = CONFIG.text.home
  const duration = CONFIG.animations?.countUpDuration || 1100

  // Animasi angka berhitung naik saat pertama kali masuk ke Home
  const countSuccess = useCountUp(ok.length, duration)
  const countWeekly = useCountUp(Math.min(ok.length, WEEKLY_TARGET), duration)
  const countRevenueJt = useCountUp(Math.round(revenue / 1e6), duration)
  const countLastTotal = useCountUp(last ? last.total : 0, duration)

  const NAV = [
    { to: '/history', label: text.nav.history, icon: History },
    { to: '/stock', label: text.nav.stock, icon: Warehouse },
    { to: '/customers', label: text.nav.customers, icon: BookUser },
    { to: '/notebook', label: text.nav.notebook, icon: NotebookPen },
    { to: '/settings', label: text.nav.settings, icon: Settings },
  ]

  return (
    <Screen className="animate-fade-in-up">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3 text-muted">
          <CircleUserRound className="size-9 text-fg" strokeWidth={1.5} />
          <span>{user.name}</span>
        </div>
        <button aria-label="Keluar" onClick={() => { logout(); go('/') }} className="rounded-lg p-2 text-danger hover:bg-chip">
          <LogOut className="size-6" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
            <SuccessStat label={<>{text.statSuccess.split(' ')[0]}<br />{text.statSuccess.split(' ').slice(1).join(' ')}</>} value={countSuccess} of={orders.length} className="col-span-2 bg-card lg:col-span-1 lg:min-h-60 lg:flex-col" />
            <WeeklyStat label={<>{text.statWeekly.split(' ')[0]}<br />{text.statWeekly.split(' ').slice(1).join(' ')}</>} value={countWeekly} of={WEEKLY_TARGET} className="bg-sub lg:min-h-60 lg:flex-col" />
            <HomeCard className="col-span-2 flex items-center justify-between bg-sub p-5">
              <p className="text-lg leading-tight text-muted">{text.statRevenue.split(' ')[0]}<br />{text.statRevenue.split(' ').slice(1).join(' ')}</p>
              <p className="text-5xl font-bold leading-none">{countRevenueJt}<span className="text-2xl font-semibold">jt</span></p>
            </HomeCard>
          </div>

          <section aria-labelledby="last-title">
            <h2 id="last-title" className="mb-2 px-1 text-lg font-semibold text-head">{text.lastTransactionTitle}</h2>
            {last ? (
              <HomeCard className="relative flex items-center justify-between gap-4 p-5 pt-7">
                <Badge tone={last.status === 'sukses' ? 'success' : 'danger'} className="absolute right-0 top-0 rounded-none rounded-bl-none rounded-tr-2xl px-4">{last.status === 'sukses' ? text.badgeSuccess : text.badgeFailed}</Badge>
                <div>
                  <p className="text-xl">{last.customer}</p>
                  <p className="text-sm text-muted">{last.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl text-price">{rp(countLastTotal)}</p>
                    <div className="mt-1 flex justify-end gap-3 text-hint" aria-hidden="true"><BrickWall className="size-5" /><Container className="size-5" /><Armchair className="size-5" /></div>
                  </div>
                  <button aria-label="Lihat riwayat" onClick={() => go('/history')} className="text-muted"><ChevronRight /></button>
                </div>
              </HomeCard>
            ) : (
              <p className="px-1 text-muted">{text.lastTransactionEmpty}</p>
            )}
            {last && <p className="sr-only">{hours.toLocaleDateString('id-ID')}</p>}
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <HomeCard className="grid grid-cols-5 gap-1 bg-sub p-2 lg:grid-cols-1 lg:p-4">
            {NAV.map(({ to, label, icon: Icon }) => (
              <button key={to} onClick={() => go(to)} className="flex flex-col items-center gap-1 rounded-xl p-2 text-sm text-muted hover:bg-chip lg:flex-row lg:gap-4 lg:px-3 lg:py-3 lg:text-base">
                <Icon className="size-8 text-fg" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </HomeCard>
          <div className="mt-2 flex flex-col items-stretch gap-3 px-4 text-center lg:mt-0 lg:px-0">
            <Btn className="h-16 text-lg" onClick={() => { startOrder(); go('/order') }}>{text.btnNewOrder}</Btn>
            <span className="text-sm text-muted">{text.btnDivider}</span>
            <Btn variant="secondary" className="h-12 self-center px-8 text-sm lg:self-stretch" onClick={() => (loadDraft() ? go('/order') : notify(text.noSavedOrderAlert))}>
              {text.btnResumeOrder}
            </Btn>
          </div>
        </div>
      </div>
    </Screen>
  )
}
