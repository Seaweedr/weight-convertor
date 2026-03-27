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

  // Principle 1: Content First — icons are the content, glass floats above
  // Principle 2: Depth Through Light — lensing (brightness) creates hierarchy
  // Principle 3: Adaptive Tinting — pill tints based on dark/light
  // regularMaterial equivalent: moderate blur + tint + brightness
  const pillBackdrop = dragging
    ? `blur(2px) brightness(${darkMode ? 2.5 : 1.3}) saturate(2)`
    : `blur(1px) brightness(${darkMode ? 2 : 1.15}) saturate(1.8)`

  const pillBg = darkMode
    ? `rgba(255,255,255,${dragging ? 0.1 : 0.06})`
    : `rgba(255,255,255,${dragging ? 0.35 : 0.25})`

  // Glass edge: continuous rounded shape, inset highlight top, shadow bottom
  const pillShadow = darkMode
    ? (dragging
      ? `inset 0 1px 0 rgba(255,255,255,0.2),
         inset 0 -0.5px 0 rgba(0,0,0,0.15),
         0 0 0 0.5px rgba(255,255,255,0.1),
         0 4px 16px -4px rgba(0,0,0,0.4)`
      : `inset 0 0.5px 0 rgba(255,255,255,0.15),
         inset 0 -0.5px 0 rgba(0,0,0,0.1),
         0 0 0 0.5px rgba(255,255,255,0.06),
         0 2px 8px -2px rgba(0,0,0,0.25)`)
    : (dragging
      ? `inset 0 1px 0 rgba(255,255,255,0.9),
         inset 0 -0.5px 0 rgba(0,0,0,0.03),
         0 0 0 0.5px rgba(0,0,0,0.04),
         0 4px 16px -4px rgba(0,0,0,0.08)`
      : `inset 0 0.5px 0 rgba(255,255,255,0.8),
         inset 0 -0.5px 0 rgba(0,0,0,0.02),
         0 0 0 0.5px rgba(0,0,0,0.03),
         0 2px 8px -2px rgba(0,0,0,0.05)`)

  // Pill expand on press
  const pillScale = dragging ? 'scaleX(1.1)' : 'scaleX(1)'

  return (
    <div className={`h-svh ${bg}`}>
      <div className="h-full overflow-y-auto pt-[env(safe-area-inset-top)] pb-16">
        {tab === 'converter' && <Converter darkMode={darkMode} />}
        {tab === 'plates' && <PlateCalc darkMode={darkMode} />}
        {tab === '1rm' && <OneRepMax darkMode={darkMode} />}
        {tab === 'timer' && <Timer darkMode={darkMode} />}
        {tab === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      {/* Tab bar — regularMaterial equivalent */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-3 pb-1">
          <div
            ref={containerRef}
            className="relative rounded-full select-none touch-none"
            style={{
              background: darkMode ? 'rgba(28,28,30,0.65)' : 'rgba(242,242,247,0.55)',
              backdropFilter: 'blur(40px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
              boxShadow: darkMode
                ? 'inset 0 0.5px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.04), 0 8px 32px -8px rgba(0,0,0,0.5)'
                : 'inset 0 0.5px 0 rgba(255,255,255,0.8), 0 0 0 0.5px rgba(0,0,0,0.03), 0 8px 32px -8px rgba(0,0,0,0.06)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Icons — content layer, always visible */}
            <div className="relative flex">
              {TABS.map((t) => {
                const isActive = tab === t.id
                return (
                  <button key={t.id}
                    onClick={() => { if (!dragging) setTab(t.id) }}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 cursor-pointer relative select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                    style={{
                      color: darkMode
                        ? (isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)')
                        : (isActive ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)'),
                    }}>
                    <span className="flex">{isActive ? t.filled : t.outlined}</span>
                    <span style={{ fontSize: 10, fontWeight: isActive ? 500 : 400, letterSpacing: '0.02em' }}>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Glass pill — floats above content, lensing creates hierarchy */}
            <div
              className="absolute left-0 pointer-events-none z-20"
              style={{
                width: `${pillWidthPct}%`,
                top: dragging ? -3 : 3,
                bottom: dragging ? -3 : 3,
                transform: `translateX(${translateX}%) ${pillScale}`,
                transition: dragging
                  ? 'top 250ms cubic-bezier(0.34, 1.56, 0.64, 1), bottom 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), top 250ms, bottom 250ms',
              }}
            >
              {/* Glass body */}
              <div className="absolute inset-x-[3px] inset-y-0 overflow-hidden"
                style={{
                  borderRadius: 9999,
                  background: pillBg,
                  backdropFilter: pillBackdrop,
                  WebkitBackdropFilter: pillBackdrop,
                  boxShadow: pillShadow,
                  transition: dragging
                    ? 'background 200ms, box-shadow 200ms'
                    : 'all 600ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                {/* Top specular — light source reflection */}
                <div className="absolute inset-x-[15%] top-0 h-[1.5px]" style={{
                  background: darkMode
                    ? `linear-gradient(90deg, transparent, rgba(255,255,255,${dragging ? 0.3 : 0.18}) 50%, transparent)`
                    : `linear-gradient(90deg, transparent, rgba(255,255,255,${dragging ? 0.95 : 0.75}) 50%, transparent)`,
                }} />
                {/* Top crescent glow */}
                <div className="absolute inset-x-[10%] top-0" style={{
                  height: '35%',
                  background: darkMode
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                  borderRadius: '9999px 9999px 50% 50%',
                }} />
              </div>

              {/* Subtle conic shimmer at edge */}
              <div className="absolute inset-x-[2px] inset-y-[-1px]" style={{
                borderRadius: 9999,
                background: `conic-gradient(from 210deg,
                  rgba(140,200,255,${dragging ? 0.12 : 0.04}) 0deg,
                  rgba(170,130,255,${dragging ? 0.1 : 0.03}) 60deg,
                  transparent 120deg,
                  transparent 200deg,
                  rgba(255,170,120,${dragging ? 0.1 : 0.03}) 250deg,
                  rgba(255,120,160,${dragging ? 0.12 : 0.04}) 310deg,
                  transparent 360deg)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: dragging ? 2 : 1,
                filter: `blur(${dragging ? 1 : 0.5}px)`,
                transition: dragging ? 'none' : 'all 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App
