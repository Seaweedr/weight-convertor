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

function getGlassOverlap(tabIndex: number, pillPos: number): number {
  const dist = Math.abs(tabIndex - pillPos)
  return dist >= 1 ? 0 : 1 - dist
}

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
  const nearestTab = Math.round(pillPos)
  const distFromCenter = Math.abs(pillPos - nearestTab)
  const stretchScale = dragging ? 1 + distFromCenter * 0.35 : 1
  const translateX = pillPos * 100

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
              background: darkMode
                ? 'rgba(38,38,40,0.65)'
                : 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(50px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(50px) saturate(1.8)',
              border: darkMode
                ? '0.5px solid rgba(255,255,255,0.08)'
                : '0.5px solid rgba(255,255,255,0.6)',
              boxShadow: darkMode
                ? 'inset 0 0.5px 0 rgba(255,255,255,0.06), 0 -2px 20px rgba(0,0,0,0.3)'
                : 'inset 0 0.5px 0 rgba(255,255,255,0.8), 0 -2px 20px rgba(0,0,0,0.06)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Glass pill indicator */}
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
                  background: darkMode
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.6)',
                  backdropFilter: `blur(20px) brightness(${darkMode ? 1.4 : 1.05}) saturate(2)`,
                  WebkitBackdropFilter: `blur(20px) brightness(${darkMode ? 1.4 : 1.05}) saturate(2)`,
                  boxShadow: darkMode
                    ? `inset 0 0.5px 0 rgba(255,255,255,0.2),
                       inset 0 -0.5px 0 rgba(255,255,255,0.05),
                       0 0 0 0.5px rgba(255,255,255,0.1)`
                    : `inset 0 0.5px 0 rgba(255,255,255,0.9),
                       inset 0 -0.5px 0 rgba(0,0,0,0.03),
                       0 1px 4px rgba(0,0,0,0.08),
                       0 0 0 0.5px rgba(255,255,255,0.7)`,
                  transition: dragging ? 'backdrop-filter 60ms' : 'all 600ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {/* Top rim specular highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.25) 70%, transparent 90%)'
                      : 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.8) 70%, transparent 90%)',
                  }}
                />
                {/* Bottom rim */}
                <div className="absolute inset-x-0 bottom-0 h-[1px] pointer-events-none"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.06) 50%, transparent 85%)'
                      : 'linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.4) 50%, transparent 85%)',
                  }}
                />
                {/* Left/Right rim highlights */}
                <div className="absolute inset-y-0 left-0 w-[1px] pointer-events-none"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.04) 80%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.2) 80%)',
                  }}
                />
                <div className="absolute inset-y-0 right-0 w-[1px] pointer-events-none"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.04) 80%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.2) 80%)',
                  }}
                />
                {/* Subtle top gradient glow */}
                <div className="absolute inset-x-0 top-0 h-[40%] pointer-events-none"
                  style={{
                    background: darkMode
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                  }}
                />
                {/* Prismatic refraction on drag */}
                {dragging && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(${105 + distFromCenter * 45}deg,
                        rgba(130,200,255,${darkMode ? 0.06 : 0.04}) 0%,
                        rgba(180,140,255,${darkMode ? 0.05 : 0.03}) 50%,
                        rgba(255,180,130,${darkMode ? 0.05 : 0.03}) 100%)`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Tab buttons */}
            <div className="relative flex">
              {TABS.map((t, i) => {
                const overlap = getGlassOverlap(i, pillPos)
                const isUnder = overlap > 0.5

                return (
                  <button
                    key={t.id}
                    onClick={() => { if (!dragging) setTab(t.id) }}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 cursor-pointer relative z-10 select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                    style={{
                      color: darkMode
                        ? `rgba(255,255,255,${0.3 + overlap * 0.7})`
                        : `rgba(0,0,0,${0.3 + overlap * 0.55})`,
                      transition: dragging ? 'color 40ms' : 'color 300ms',
                    }}
                  >
                    <span style={{
                      transform: `scale(${1 + overlap * 0.08})`,
                      transition: dragging ? 'transform 40ms' : 'transform 300ms',
                      display: 'flex',
                    }}>
                      {isUnder ? t.filled : t.outlined}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: isUnder ? 600 : 400,
                      letterSpacing: '0.02em',
                      transition: dragging ? 'none' : 'font-weight 300ms',
                    }}>
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App
