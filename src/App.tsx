import { useState, useEffect, useRef, type ReactNode } from 'react'
import {
  MdSwapHoriz, MdFitnessCenter, MdTrendingUp, MdTimer, MdMoreHoriz,
  MdOutlineSwapHoriz, MdOutlineFitnessCenter, MdOutlineTrendingUp, MdOutlineTimer, MdOutlineMoreHoriz
} from 'react-icons/md'
import Converter from './pages/Converter'
import PlateCalc from './pages/PlateCalc'
import OneRepMax from './pages/OneRepMax'
import Timer from './pages/Timer'
import Settings from './pages/Settings'

type Tab = 'converter' | 'plates' | '1rm' | 'timer' | 'settings'

const TABS: { id: Tab; label: string; filled: ReactNode; outlined: ReactNode }[] = [
  { id: 'converter', label: '換算', filled: <MdSwapHoriz size={24} />, outlined: <MdOutlineSwapHoriz size={24} /> },
  { id: 'plates', label: '槓片', filled: <MdFitnessCenter size={24} />, outlined: <MdOutlineFitnessCenter size={24} /> },
  { id: '1rm', label: '1RM', filled: <MdTrendingUp size={24} />, outlined: <MdOutlineTrendingUp size={24} /> },
  { id: 'timer', label: '計時', filled: <MdTimer size={24} />, outlined: <MdOutlineTimer size={24} /> },
  { id: 'settings', label: '更多', filled: <MdMoreHoriz size={24} />, outlined: <MdOutlineMoreHoriz size={24} /> },
]

const TAB_COUNT = TABS.length

function App() {
  const [tab, setTab] = useState<Tab>('converter')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wc-dark-mode')
    return saved !== null ? saved === 'true' : true
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem('wc-dark-mode', String(darkMode))
    document.documentElement.className = darkMode ? 'dark-bg' : 'light-bg'
  }, [darkMode])

  const tabIdx = TABS.findIndex(t => t.id === tab)
  const pillPos = dragging && dragProgress !== null ? dragProgress : tabIdx
  const translateX = pillPos * 100
  const pillWidthPct = 100 / TAB_COUNT

  // Clip for magnified layer — must account for px-2 (8px) padding
  const pillLeftPct = (pillPos / TAB_COUNT) * 100
  const clipLeft = pillLeftPct + 0.8
  const clipRight = 100 - (pillLeftPct + pillWidthPct) + 0.8

  function clientXToProgress(clientX: number): number {
    const el = containerRef.current
    if (!el) return tabIdx
    const rect = el.getBoundingClientRect()
    const relX = clientX - rect.left
    const progress = (relX / rect.width) * TAB_COUNT - 0.5
    return Math.max(0, Math.min(TAB_COUNT - 1, progress))
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
    setDragProgress(clientXToProgress(e.clientX))
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragging) setDragProgress(clientXToProgress(e.clientX))
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return
    setDragging(false)
    const idx = Math.max(0, Math.min(TAB_COUNT - 1, Math.round(clientXToProgress(e.clientX))))
    setTab(TABS[idx].id)
    setDragProgress(null)
  }

  const bg = darkMode ? 'text-white' : 'text-zinc-900'
  const dimColor = darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
  const brightColor = darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.85)'

  // Pill morphs: when pressing, pill expands horizontally (wider capsule)
  const pillScale = dragging ? 'scaleX(1.15)' : 'scaleX(1)'
  // Glass: high refraction (brightness/saturate), high depth (shadows), minimal frost (blur ~0)
  const pillBg = darkMode
    ? (dragging ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.03)')
    : (dragging ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)')
  const pillBlur = dragging
    ? `blur(0.5px) brightness(${darkMode ? 2.2 : 1.2}) saturate(2.5)`
    : `blur(0.5px) brightness(${darkMode ? 1.5 : 1.08}) saturate(2)`
  // Depth: strong layered shadows
  const pillShadow = darkMode
    ? (dragging
      ? `inset 0 0 0 1.5px rgba(255,255,255,0.15),
         inset 0 1px 0 rgba(255,255,255,0.25),
         inset 0 -1px 0 rgba(255,255,255,0.05),
         0 0 0 1px rgba(0,0,0,0.6),
         0 6px 20px rgba(0,0,0,0.6),
         0 16px 48px -8px rgba(0,0,0,0.5)`
      : `inset 0 0 0 1px rgba(255,255,255,0.1),
         inset 0 0.5px 0 rgba(255,255,255,0.15),
         0 0 0 0.5px rgba(0,0,0,0.4),
         0 4px 12px rgba(0,0,0,0.3),
         0 8px 24px -4px rgba(0,0,0,0.2)`)
    : (dragging
      ? `inset 0 0 0 1.5px rgba(255,255,255,0.6),
         inset 0 1px 0 rgba(255,255,255,0.9),
         0 0 0 1px rgba(0,0,0,0.08),
         0 6px 20px rgba(0,0,0,0.12),
         0 16px 48px -8px rgba(0,0,0,0.1)`
      : `inset 0 0 0 1px rgba(255,255,255,0.45),
         inset 0 0.5px 0 rgba(255,255,255,0.7),
         0 0 0 0.5px rgba(0,0,0,0.05),
         0 4px 12px rgba(0,0,0,0.06),
         0 8px 24px -4px rgba(0,0,0,0.04)`)

  return (
    <div className={`h-svh ${bg}`}>
      <div className="h-full overflow-y-auto pt-[env(safe-area-inset-top)] pb-16">
        {tab === 'converter' && <Converter darkMode={darkMode} />}
        {tab === 'plates' && <PlateCalc darkMode={darkMode} />}
        {tab === '1rm' && <OneRepMax darkMode={darkMode} />}
        {tab === 'timer' && <Timer darkMode={darkMode} />}
        {tab === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-3 pb-1">
          <div
            ref={containerRef}
            className="relative rounded-full select-none touch-none"
            style={{
              background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(40px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
              border: darkMode ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(255,255,255,0.65)',
              boxShadow: darkMode
                ? 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 8px 32px -8px rgba(0,0,0,0.5)'
                : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.08)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Outer container — subtle edge shimmer */}
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              background: `conic-gradient(from 150deg,
                transparent 0deg,
                rgba(140,200,255,0.04) 45deg,
                transparent 90deg,
                transparent 180deg,
                rgba(255,160,140,0.03) 225deg,
                transparent 270deg,
                transparent 360deg)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: 1,
            }} />
            {/* Glass pill — morphs when pressed */}
            <div
              className="absolute left-0 pointer-events-none"
              style={{
                width: `${pillWidthPct}%`,
                top: dragging ? -5 : 3,
                bottom: dragging ? -5 : 3,
                transform: `translateX(${translateX}%) ${pillScale}`,
                transition: dragging ? 'top 200ms, bottom 200ms' : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), top 200ms, bottom 200ms',
              }}
            >
              <div className="absolute inset-x-[3px] inset-y-0 overflow-hidden"
                style={{
                  borderRadius: 9999,
                  background: pillBg,
                  backdropFilter: pillBlur,
                  WebkitBackdropFilter: pillBlur,
                  boxShadow: pillShadow,
                  transition: dragging
                    ? 'background 150ms, box-shadow 150ms, backdrop-filter 150ms'
                    : 'all 600ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                {/* Specular highlight — top white shine */}
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none" style={{
                  background: darkMode
                    ? `linear-gradient(90deg, transparent 15%, rgba(255,255,255,${dragging ? 0.35 : 0.2}) 50%, transparent 85%)`
                    : `linear-gradient(90deg, transparent 15%, rgba(255,255,255,${dragging ? 0.9 : 0.7}) 50%, transparent 85%)`,
                }} />

                {/* Convex lens center brightening */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(ellipse 60% 70% at 50% 45%,
                    rgba(255,255,255,${darkMode ? (dragging ? 0.05 : 0.02) : (dragging ? 0.1 : 0.05)}) 0%,
                    transparent 100%)`,
                }} />
              </div>

              {/* Natural glass refraction — conic gradient border shimmer */}
              <div className="absolute inset-x-[2px] inset-y-[-1px] pointer-events-none" style={{
                borderRadius: 9999,
                background: `conic-gradient(from ${dragging ? 200 : 210}deg,
                  transparent 0deg,
                  rgba(140,200,255,${dragging ? 0.35 : 0.15}) 30deg,
                  rgba(170,140,255,${dragging ? 0.28 : 0.12}) 70deg,
                  transparent 110deg,
                  transparent 180deg,
                  rgba(255,170,120,${dragging ? 0.28 : 0.12}) 220deg,
                  rgba(255,120,160,${dragging ? 0.32 : 0.14}) 260deg,
                  transparent 300deg,
                  transparent 360deg)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: dragging ? 2 : 1.5,
                filter: `blur(${dragging ? 1 : 0.5}px)`,
                transition: dragging ? 'none' : 'all 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }} />
            </div>

            {/* Base icons (dim, outlined) */}
            <div className="relative flex">
              {TABS.map((t) => {
                const isActive = tab === t.id
                return (
                  <button key={t.id}
                    onClick={() => { if (!dragging) setTab(t.id) }}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 cursor-pointer relative z-10 select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                    style={{ color: isActive ? (darkMode ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)') : dimColor }}>
                    <span className="flex">{isActive ? t.filled : t.outlined}</span>
                    <span style={{ fontSize: 10, fontWeight: isActive ? 500 : 400, letterSpacing: '0.02em' }}>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Magnified layer — clipped to pill, icons bigger + brighter */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
              style={{
                clipPath: `inset(${dragging ? '0px' : '3px'} ${clipRight}% ${dragging ? '0px' : '3px'} ${clipLeft}% round 9999px)`,
                transition: dragging ? 'clip-path 150ms' : 'clip-path 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}>
              <div className="flex h-full">
                {TABS.map((t) => (
                  <div key={t.id} className="flex-1 flex flex-col items-center justify-center gap-1"
                    style={{ color: brightColor }}>
                    <span className="flex">{t.filled}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App
