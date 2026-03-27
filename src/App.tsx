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
  }, [darkMode])

  const tabIdx = TABS.findIndex(t => t.id === tab)
  const pillPos = dragging && dragProgress !== null ? dragProgress : tabIdx
  const distFromCenter = Math.abs(pillPos - Math.round(pillPos))
  const stretchScale = dragging ? 1 + distFromCenter * 0.35 : 1
  const translateX = pillPos * 100

  // Pill pixel position for clip-path (percentage based)
  const pillLeftPct = (pillPos / TAB_COUNT) * 100
  const pillWidthPct = 100 / TAB_COUNT
  const clipLeft = pillLeftPct + 0.8  // inset for padding
  const clipRight = 100 - (pillLeftPct + pillWidthPct) + 0.8
  const clipInset = `3px ${clipRight}% 3px ${clipLeft}%`

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

  const bg = darkMode
    ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white'
    : 'bg-gradient-to-b from-zinc-100 via-white to-zinc-100 text-zinc-900'

  const dimColor = darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
  const brightColor = darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.85)'

  return (
    <div className={`h-svh ${bg} transition-colors duration-500`}>
      <div className="h-full overflow-y-auto pt-[env(safe-area-inset-top)] pb-16">
        {tab === 'converter' && <Converter darkMode={darkMode} />}
        {tab === 'plates' && <PlateCalc darkMode={darkMode} />}
        {tab === '1rm' && <OneRepMax darkMode={darkMode} />}
        {tab === 'timer' && <Timer darkMode={darkMode} />}
        {tab === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      {/* Liquid Glass Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-3 pb-1">
          <div
            ref={containerRef}
            className="relative rounded-2xl overflow-hidden select-none touch-none"
            style={{
              background: darkMode ? 'rgba(30,30,32,0.7)' : 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(50px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(50px) saturate(1.8)',
              border: darkMode ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(255,255,255,0.6)',
              boxShadow: darkMode
                ? 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 -2px 20px rgba(0,0,0,0.3)'
                : 'inset 0 0.5px 0 rgba(255,255,255,0.8), 0 -2px 20px rgba(0,0,0,0.06)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Glass pill */}
            <div
              className="absolute top-[3px] bottom-[3px] left-0 pointer-events-none"
              style={{
                width: `${100 / TAB_COUNT}%`,
                transform: `translateX(${translateX}%) scaleX(${stretchScale})`,
                transition: dragging ? 'none' : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <div
                className="absolute inset-x-[3px] inset-y-0 rounded-[12px] overflow-hidden"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
                  backdropFilter: `blur(20px) brightness(${darkMode ? 1.35 : 1.02}) saturate(2)`,
                  WebkitBackdropFilter: `blur(20px) brightness(${darkMode ? 1.35 : 1.02}) saturate(2)`,
                  boxShadow: darkMode
                    ? 'inset 0 0.5px 0 rgba(255,255,255,0.18), 0 0 0 0.5px rgba(255,255,255,0.08)'
                    : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(255,255,255,0.6)',
                }}
              >
                {/* Rim highlights */}
                <div className="absolute inset-x-0 top-0 h-[1px]" style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.25) 70%, transparent 92%)'
                    : 'linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 70%, transparent 92%)',
                }} />
                <div className="absolute inset-x-0 bottom-0 h-[1px]" style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.06) 50%, transparent 85%)'
                    : 'linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.3) 50%, transparent 85%)',
                }} />
                {/* Top gradient */}
                <div className="absolute inset-x-0 top-0 h-[35%]" style={{
                  background: darkMode
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
                }} />
                {/* Drag prismatic */}
                {dragging && (
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(${105 + distFromCenter * 45}deg, rgba(130,200,255,${darkMode ? 0.06 : 0.03}) 0%, rgba(180,140,255,${darkMode ? 0.05 : 0.02}) 50%, rgba(255,180,130,${darkMode ? 0.05 : 0.02}) 100%)`,
                  }} />
                )}
              </div>
            </div>

            {/* Layer 1: Base icons (dim, outlined) — always visible */}
            <div className="relative flex">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { if (!dragging) setTab(t.id) }}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-3 cursor-pointer relative z-10 select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                  style={{ color: dimColor }}
                >
                  <span className="flex">{t.outlined}</span>
                  <span style={{ fontSize: 10, fontWeight: 400, letterSpacing: '0.02em' }}>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Layer 2: Magnified bright icons — clipped to pill shape (the "lens" effect) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: `inset(${clipInset} round 12px)`,
                transition: dragging ? 'none' : 'clip-path 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <div className="flex h-full">
                {TABS.map((t) => (
                  <div
                    key={t.id}
                    className="flex-1 flex flex-col items-center justify-center gap-1"
                    style={{ color: brightColor }}
                  >
                    <span className="flex" style={{ transform: 'scale(1.12)' }}>{t.filled}</span>
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
