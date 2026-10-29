import { useState } from 'react'
import { ArrowLeft, Armchair, Minus, Plus, Search } from 'lucide-react'
import { cn, rp } from './lib'
import { go } from './router'
import { useStore } from './store.jsx'
import { CONFIG } from './config'

export const Card = ({ border = CONFIG.sizes.cardBorder, className, ...p }) => (
  <div className={cn(CONFIG.sizes.cardRadius, border, 'bg-card', className)} {...p} />
)

export const Screen = ({ children, className }) => (
  <main className={cn('mx-auto flex min-h-dvh w-full flex-col gap-4 p-4 lg:p-5', CONFIG.sizes.screenMaxWidth, className)}>
    {children}
  </main>
)

export function Header({ title, back = '/home' }) {
  return (
    <header className="flex h-16 items-center gap-3 rounded-2xl bg-card px-3 lg:h-[73px] lg:px-5">
      <button aria-label="Kembali" onClick={() => go(back)} className="grid size-10 place-items-center rounded-lg hover:bg-chip">
        <ArrowLeft className="size-6" />
      </button>
      <h1 className="text-xl font-semibold tracking-wider">{title}</h1>
    </header>
  )
}

const tones = {
  accent: 'bg-soft text-ink',
  success: 'bg-[var(--success,#22c55e)] text-[var(--success-ink,#052e16)]',
  warn: 'bg-warn text-ink',
  danger: 'bg-danger text-ink',
  muted: 'border border-line2 bg-chip text-muted',
}
export const Badge = ({ tone = 'accent', className, children }) => (
  <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium leading-4', tones[tone], className)}>
    {children}
  </span>
)

export const Chip = ({ active, className, ...p }) => (
  <button
    className={cn(
      'h-10 shrink-0 rounded-full border px-5 text-sm transition-colors',
      active ? 'border-accent bg-accent font-medium text-ink' : 'border-line2 bg-card text-muted hover:bg-chip',
      className,
    )}
    {...p}
  />
)

export const Btn = ({ variant = 'primary', className, ...p }) => {
  const isPrimary = variant === 'primary'
  const btnConfig = isPrimary ? CONFIG.buttons.primary : CONFIG.buttons.secondary
  return (
    <button
      className={cn(
        'flex items-center justify-center gap-2 px-5 transition-colors',
        CONFIG.sizes.primaryBtnHeight,
        CONFIG.sizes.buttonRadius,
        btnConfig.fontWeight,
        btnConfig.letterSpacing,
        isPrimary
          ? cn(btnConfig.bg, btnConfig.text, btnConfig.shadow, btnConfig.hover)
          : cn(btnConfig.bg, btnConfig.text, btnConfig.border, btnConfig.hover),
        className,
      )}
      {...p}
    />
  )
}

export const Field = ({ label, className, ...p }) => (
  <label className="flex flex-col gap-1.5 text-sm text-muted">
    {label && <span className="font-medium">{label}</span>}
    <input
      className={cn(
        CONFIG.sizes.inputHeight,
        CONFIG.sizes.inputRadius,
        'w-full border border-line2 bg-sub px-4 text-base text-fg outline-none placeholder:text-hint focus:border-accent',
        className,
      )}
      {...p}
    />
  </label>
)

export function SearchField({ label, className, ...p }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-lg font-semibold">{label}</span>}
      <span className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          className={cn(
            CONFIG.sizes.inputHeight,
            CONFIG.sizes.inputRadius,
            'w-full border border-line2 bg-sub pl-12 pr-4 text-fg outline-none placeholder:text-hint focus:border-accent',
            className,
          )}
          {...p}
        />
      </span>
    </label>
  )
}

export function Stepper({ value, onChange, max = Infinity }) {
  const btn = 'grid size-10 place-items-center rounded-lg'
  return (
    <div className="flex items-center gap-2">
      <button aria-label="Kurangi" disabled={value <= 0} onClick={() => onChange(value - 1)} className={cn(btn, 'border border-line2 bg-chip text-fg')}>
        <Minus className="size-5" />
      </button>
      <span className="grid h-10 min-w-12 place-items-center rounded-lg border border-line bg-sub px-2 text-lg tabular-nums">{value}</span>
      <button aria-label="Tambah" disabled={value >= max} onClick={() => onChange(value + 1)} className={cn(btn, 'bg-accent text-ink')}>
        <Plus className="size-5" />
      </button>
    </div>
  )
}

export function ProductImage({ id, alt, className }) {
  const [err, setErr] = useState(false)
  return err ? (
    <div className={cn('grid place-items-center bg-chip text-hint', className)} role="img" aria-label={alt}>
      <Armchair className="size-1/3" />
    </div>
  ) : (
    <img src={`/images/${id}.jpg`} alt={alt} onError={() => setErr(true)} className={cn('object-cover', className)} />
  )
}

export function Logo({ className }) {
  const { brand } = CONFIG

  if (brand.type === 'image') {
    return (
      <img
        src={brand.imageUrl}
        alt={`${brand.name} ${brand.subtitle}`}
        className={cn('h-auto object-contain', brand.width, className)}
      />
    )
  }

  if (brand.type === 'text') {
    return (
      <div className={cn('flex flex-col items-center justify-center text-center', className)}>
        <span className="text-4xl font-bold tracking-[0.2em] text-fg">{brand.name}</span>
        {brand.subtitle && (
          <span className="mt-1 text-xs uppercase tracking-[0.3em] text-muted">{brand.subtitle}</span>
        )}
      </div>
    )
  }

  return (
    <svg viewBox="0 0 220 150" className={cn('text-fg', className)} role="img" aria-label={`${brand.name} ${brand.subtitle}`}>
      <defs>
        <linearGradient id="hx" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={brand.gradientStart} />
          <stop offset="1" stopColor={brand.gradientEnd} />
        </linearGradient>
      </defs>
      <path d="M78 6h20v62l-20 12z" fill="currentColor" opacity=".85" />
      <path d="M122 6h20v74l-20-12z" fill="currentColor" opacity=".85" />
      <path d="M98 38l24-12v28L98 66z" fill="url(#hx)" />
      <text x="110" y="112" textAnchor="middle" fontSize="34" fontWeight="600" letterSpacing="7" fill="currentColor">{brand.name}</text>
      <line x1="30" y1="132" x2="76" y2="132" stroke={brand.accentLineColor} strokeWidth="1.5" />
      <line x1="144" y1="132" x2="190" y2="132" stroke={brand.accentLineColor} strokeWidth="1.5" />
      <text x="110" y="136" textAnchor="middle" fontSize="12" letterSpacing="3" fill="currentColor">{brand.subtitle}</text>
    </svg>
  )
}

export function Summary({ onNext, nextLabel, stacked }) {
  const { total, units, saveDraft } = useStore()
  const text = CONFIG.text.summary
  const labelNext = nextLabel || text.btnNext

  return (
    <Card className={cn('sticky bottom-3 z-10 flex items-center justify-between gap-3 p-4 shadow-lg', stacked && 'lg:static lg:flex-1 lg:flex-col lg:items-stretch lg:justify-between lg:shadow-none')}>
      <div>
        <p className="text-sm">{text.totalLabel} <span className="ml-1 text-xs text-muted">{units} {text.unitSuffix}</span></p>
        <p className="text-2xl font-bold tracking-wider text-price sm:text-3xl">{rp(total)}</p>
      </div>
      <div className="flex gap-3">
        <Btn variant="secondary" onClick={saveDraft} className={CONFIG.sizes.largeBtnHeight}>{text.btnDraft}</Btn>
        <Btn onClick={onNext} className={cn(CONFIG.sizes.largeBtnHeight, 'max-w-44 text-center text-sm leading-tight')}>{labelNext}</Btn>
      </div>
    </Card>
  )
}

export const Empty = ({ children }) => (
  <p className={cn(CONFIG.sizes.cardRadius, 'border border-dashed border-line2 p-8 text-center text-muted')}>{children}</p>
)

