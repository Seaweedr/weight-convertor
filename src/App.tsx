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

  // (clip vars removed — single layer approach, no magnified layer)

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
  const dimColor = darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'

  // Pill morphs: when pressing, pill expands horizontally (wider capsule)
  const pillScale = dragging ? 'scaleX(1.15)' : 'scaleX(1)'
  // Glass: high refraction (brightness/saturate), high depth (shadows), minimal frost (blur ~0)
  const pillBg = darkMode
    ? (dragging ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.01)')
    : (dragging ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.02)')
  const pillBlur = dragging
    ? `brightness(${darkMode ? 8 : 3}) saturate(3) contrast(1.2)`
    : `brightness(${darkMode ? 6 : 2.5}) saturate(2.5) contrast(1.15)`
  // Depth: strong layered shadows
  const pillShadow = darkMode
    ? (dragging
      ? `inset 0 0 0 1.5px rgba(255,255,255,0.12),
         inset 0 0.5px 0 rgba(255,255,255,0.2),
         0 0 0 0.5px rgba(0,0,0,0.4)`
      : `inset 0 0 0 1px rgba(255,255,255,0.08),
         inset 0 0.5px 0 rgba(255,255,255,0.12),
         0 0 0 0.5px rgba(0,0,0,0.2)`)
    : (dragging
      ? `inset 0 0 0 1.5px rgba(255,255,255,0.5),
         inset 0 0.5px 0 rgba(255,255,255,0.8),
         0 0 0 0.5px rgba(0,0,0,0.05)`
      : `inset 0 0 0 1px rgba(255,255,255,0.35),
         inset 0 0.5px 0 rgba(255,255,255,0.6),
         0 0 0 0.5px rgba(0,0,0,0.03)`)

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
            {/* Icons layer (rendered first = below in z-order) */}
            <div className="relative flex">
              {TABS.map((t) => {
                const isActive = tab === t.id
                return (
                  <button key={t.id}
                    onClick={() => { if (!dragging) setTab(t.id) }}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 cursor-pointer relative select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                    style={{ color: dimColor }}>
                    <span className="flex">{isActive ? t.filled : t.outlined}</span>
                    <span style={{ fontSize: 10, fontWeight: 400, letterSpacing: '0.02em' }}>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Glass pill ON TOP of icons — backdrop-filter brightens icons underneath */}
            <div
              className="absolute left-0 pointer-events-none z-20"
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
                {/* Top specular shine — wide */}
                <div className="absolute inset-x-0 top-0 h-[2px]" style={{
                  background: darkMode
                    ? `linear-gradient(90deg, transparent 10%, rgba(255,255,255,${dragging ? 0.5 : 0.3}) 50%, transparent 90%)`
                    : `linear-gradient(90deg, transparent 10%, rgba(255,255,255,${dragging ? 1 : 0.85}) 50%, transparent 90%)`,
                }} />
                {/* Top crescent reflection */}
                <div className="absolute inset-x-[10%] top-0" style={{
                  height: dragging ? '45%' : '35%',
                  background: darkMode
                    ? `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.1 : 0.05}) 0%, transparent 100%)`
                    : `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.25 : 0.15}) 0%, transparent 100%)`,
                  borderRadius: '9999px 9999px 50% 50%',
                }} />
                {/* Bottom edge reflection */}
                <div className="absolute inset-x-[15%] bottom-0 h-[1px]" style={{
                  background: darkMode
                    ? `linear-gradient(90deg, transparent 10%, rgba(255,255,255,${dragging ? 0.12 : 0.06}) 50%, transparent 90%)`
                    : `linear-gradient(90deg, transparent 10%, rgba(255,255,255,${dragging ? 0.3 : 0.2}) 50%, transparent 90%)`,
                }} />
                {/* Off-center highlight spot — simulates light source reflection */}
                <div className="absolute" style={{
                  width: '30%',
                  height: '40%',
                  top: '10%',
                  left: '15%',
                  background: `radial-gradient(ellipse at 50% 50%,
                    rgba(255,255,255,${darkMode ? (dragging ? 0.08 : 0.04) : (dragging ? 0.15 : 0.08)}) 0%,
                    transparent 100%)`,
                  filter: 'blur(2px)',
                }} />
              </div>

              {/* Conic shimmer refraction edge */}
              <div className="absolute inset-x-[2px] inset-y-[-1px]" style={{
                borderRadius: 9999,
                background: `conic-gradient(from ${dragging ? 200 : 210}deg,
                  rgba(140,200,255,${dragging ? 0.15 : 0.04}) 0deg,
                  rgba(100,160,255,${dragging ? 0.2 : 0.06}) 40deg,
                  rgba(170,120,255,${dragging ? 0.18 : 0.05}) 80deg,
                  rgba(220,100,220,${dragging ? 0.12 : 0.03}) 120deg,
                  transparent 155deg,
                  transparent 185deg,
                  rgba(255,200,80,${dragging ? 0.12 : 0.03}) 210deg,
                  rgba(255,150,100,${dragging ? 0.18 : 0.05}) 250deg,
                  rgba(255,100,140,${dragging ? 0.2 : 0.06}) 290deg,
                  rgba(200,100,200,${dragging ? 0.15 : 0.04}) 330deg,
                  rgba(140,200,255,${dragging ? 0.15 : 0.04}) 360deg)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: dragging ? 2.5 : 1,
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
