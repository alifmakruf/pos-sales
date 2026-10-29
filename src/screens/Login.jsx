import { useState } from 'react'
import { Eye, EyeOff, Lock, UserRound } from 'lucide-react'
import { Btn, Card, Logo } from '../ui.jsx'
import { useStore } from '../store.jsx'
import { go } from '../router'
import { CONFIG } from '../config'
import { cn } from '../lib'

// Partikel bintang 4 sisi bercahaya
function Star({ x, y, delay, drift, size, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color || 'var(--soft)'}
      className="pointer-events-none absolute z-10"
      style={{
        left: x,
        bottom: y,
        width: size || 10,
        height: size || 10,
        filter: CONFIG.animations.particleGlow,
        '--sparkle-drift': drift,
        '--sparkle-rise': CONFIG.animations.particleRiseDistance,
        animation: `sparkle-rise ${CONFIG.animations.particleDuration} cubic-bezier(0.2, 0.8, 0.2, 1) ${delay} infinite`,
      }}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

function IconInput({ icon: Icon, right, onFocus, onBlur, ...p }) {
  const [isFocused, setIsFocused] = useState(false)

  // Posisi bintang kecil tersebar di luar border dengan delay bertahap agar terus muncul bergantian
  const particles = [
    { x: '12%', y: '-6px', delay: '0s', drift: '-6px', size: 10 },
    { x: '32%', y: '-9px', delay: '0.28s', drift: '4px', size: 12 },
    { x: '55%', y: '-7px', delay: '0.56s', drift: '-8px', size: 9 },
    { x: '78%', y: '-10px', delay: '0.84s', drift: '7px', size: 11 },
    { x: '94%', y: '-5px', delay: '1.12s', drift: '-4px', size: 8 },
  ]

  return (
    <span className="relative block">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
      <input
        className={cn(
          CONFIG.sizes.inputHeight,
          CONFIG.sizes.inputRadius,
          'w-full border border-line2 bg-sub pl-11 pr-11 text-fg placeholder:text-hint',
          'outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-accent transition-colors',
        )}
        onFocus={(e) => {
          setIsFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          onBlur?.(e)
        }}
        {...p}
      />
      {right}

      {/* Partikel bintang terus keluar dan mengulang selama input aktif / fokus */}
      {isFocused && (
        <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
          {particles.slice(0, CONFIG.animations.particleCount).map((pt, i) => (
            <Star
              key={i}
              x={pt.x}
              y={pt.y}
              delay={pt.delay}
              drift={pt.drift}
              size={pt.size}
              color={CONFIG.animations.particleColor}
            />
          ))}
        </span>
      )}
    </span>
  )
}

export default function Login() {
  const { login } = useStore()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [isSpotlightActive, setIsSpotlightActive] = useState(false)
  const text = CONFIG.text.login

  const submit = (e) => {
    e.preventDefault()
    if (!id.trim() || !pw) return setErr(text.errorEmpty)
    login(id.split('@')[0])
    go('/home')
  }

  return (
    <main className={cn('relative mx-auto grid min-h-dvh w-full content-center gap-8 p-4 lg:grid-cols-2 lg:gap-6 lg:p-16 animate-fade-in-up', CONFIG.sizes.screenMaxWidth)}>
      {/* Dimming overlay: meredupkan seluruh halaman di luar login card saat spotlight aktif */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500"
        style={{
          backgroundColor: '#000000',
          opacity: isSpotlightActive ? CONFIG.animations.spotlightDimOpacity : 0,
        }}
        aria-hidden="true"
      />

      {/* Container Logo Terapung & Backdrop Bercahaya */}
      <div className="relative grid place-items-center py-6 lg:py-0">
        <div
          className="relative grid place-items-center"
          style={{
            '--float-dist': CONFIG.animations.logoFloatDistance,
            animation: `logo-float ${CONFIG.animations.logoFloatDuration} ease-in-out infinite alternate`,
            willChange: 'transform',
          }}
        >
          {/* Backdrop pendar cahaya di belakang logo yang ikut bergerak naik-turun */}
          <div
            className="pointer-events-none absolute -inset-6 -z-10 rounded-full"
            style={{
              background: `radial-gradient(circle, var(--accent) 0%, var(--soft) 35%, transparent 72%)`,
              filter: `blur(${CONFIG.animations.logoGlowBlur})`,
              opacity: CONFIG.animations.logoGlowOpacity,
              transform: `scale(${CONFIG.animations.logoGlowSize})`,
            }}
          />
          <Logo className={CONFIG.brand.width} />
        </div>
      </div>

      {/* Card Login dengan Efek Spotlight (berada di atas overlay z-20) */}
      <div className={cn('relative z-20 flex w-full justify-center', CONFIG.sizes.loginCardAlign || 'lg:justify-center')}>
        <div className={cn('relative w-full', CONFIG.sizes.loginCardMaxWidth || 'max-w-[460px]')}>
          {/* Pendaran cahaya spotlight di belakang login card */}
          <div
            className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at center, var(--accent) 0%, transparent 72%)`,
              filter: `blur(${CONFIG.animations.spotlightBlur})`,
              opacity: isSpotlightActive ? CONFIG.animations.spotlightGlowOpacity : 0,
              transform: 'scale(1.06)',
            }}
            aria-hidden="true"
          />

          <Card
            border="border border-line"
            className={cn(
              'p-6 transition-all duration-500 sm:p-8',
              isSpotlightActive && (CONFIG.animations.spotlightCardBorder || 'border-accent/20'),
            )}
            style={{
              boxShadow: isSpotlightActive ? CONFIG.animations.spotlightCardShadow : undefined,
            }}
            onFocus={() => setIsSpotlightActive(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsSpotlightActive(false)
              }
            }}
          >
            <form onSubmit={submit} className="flex flex-col gap-3">
              <h1 className="mb-2 text-center text-3xl tracking-[0.12em] lg:text-left">{text.title}</h1>
              <label className="text-sm text-muted">{text.usernameLabel}</label>
              <IconInput icon={UserRound} value={id} onChange={(e) => setId(e.target.value)} placeholder={text.usernamePlaceholder} autoComplete="username" />
              <label className="text-sm text-muted">{text.passwordLabel}</label>
              <IconInput
                icon={Lock} type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)}
                placeholder={text.passwordPlaceholder} autoComplete="new-password"
                right={
                  <button type="button" aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                    {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                }
              />
              {err && <p role="alert" className="text-sm text-danger">{err}</p>}
              <Btn type="submit" className={cn('mt-1 text-lg', CONFIG.sizes.largeBtnHeight)}>{text.submitBtn}</Btn>
              <p className="text-center text-xs text-muted">{text.dividerText}</p>
              <Btn type="button" variant="secondary" className={cn('bg-card text-lg', CONFIG.sizes.largeBtnHeight)} onClick={() => { login(); go('/home') }}>{text.googleBtn}</Btn>
            </form>
          </Card>
        </div>
      </div>
    </main>
  )
}


