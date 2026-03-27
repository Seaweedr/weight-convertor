import { useState, useEffect, useRef, type ReactNode } from 'react'
import { MdSwapHoriz, MdFitnessCenter, MdTrendingUp, MdTimer, MdMoreHoriz } from 'react-icons/md'
import Converter from './pages/Converter'
import PlateCalc from './pages/PlateCalc'
import OneRepMax from './pages/OneRepMax'
import Timer from './pages/Timer'
import Settings from './pages/Settings'

type Tab = 'converter' | 'plates' | '1rm' | 'timer' | 'settings'

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'converter', label: '換算', icon: <MdSwapHoriz size={22} /> },
  { id: 'plates', label: '槓片', icon: <MdFitnessCenter size={22} /> },
  { id: '1rm', label: '1RM', icon: <MdTrendingUp size={22} /> },
  { id: 'timer', label: '計時', icon: <MdTimer size={22} /> },
  { id: 'settings', label: '更多', icon: <MdMoreHoriz size={22} /> },
]

const TAB_COUNT = TABS.length

// Calculate how much a tab is "under" the glass pill (0 = not covered, 1 = fully covered)
function getGlassOverlap(tabIndex: number, pillPos: number): number {
  const dist = Math.abs(tabIndex - pillPos)
  if (dist >= 1) return 0
  return 1 - dist
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
  const dragStartRef = useRef({ x: 0, startIdx: 0 })

  useEffect(() => {
    localStorage.setItem('wc-dark-mode', String(darkMode))
  }, [darkMode])

  const tabIdx = TABS.findIndex(t => t.id === tab)
  const pillPos = dragging && dragProgress !== null ? dragProgress : tabIdx
  const nearestTab = Math.round(pillPos)
  const distFromCenter = Math.abs(pillPos - nearestTab)
  const stretchScale = dragging ? 1 + distFromCenter * 0.4 : 1
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
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    setDragging(true)
    const progress = clientXToProgress(e.clientX)
    setDragProgress(progress)
    dragStartRef.current = { x: e.clientX, startIdx: tabIdx }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return
    setDragProgress(clientXToProgress(e.clientX))
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return
    setDragging(false)
    const progress = clientXToProgress(e.clientX)
    const targetIdx = Math.max(0, Math.min(TAB_COUNT - 1, Math.round(progress)))
    setTab(TABS[targetIdx].id)
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

      {/* SVG filter for glass refraction distortion */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glass-refract">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1.1 0 0 0 0.05  0 1.1 0 0 0.05  0 0 1.1 0 0.05  0 0 0 1 0"
              result="bright" />
          </filter>
        </defs>
      </svg>

      {/* Liquid Glass Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-2 pb-0.5">
          <div
            ref={containerRef}
            className={`relative rounded-xl overflow-hidden select-none touch-none ${
              darkMode
                ? 'bg-white/[0.04] border border-white/[0.06]'
                : 'bg-white/40 border border-white/60 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]'
            }`}
            style={{ backdropFilter: 'blur(40px) saturate(1.5)' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Liquid glass sliding pill */}
            <div
              className="absolute top-[3px] bottom-[3px] left-0 pointer-events-none"
              style={{
                width: `${100 / TAB_COUNT}%`,
                transform: `translateX(${translateX}%) scaleX(${stretchScale})`,
                transition: dragging ? 'none' : 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              <div
                className="absolute inset-x-1 inset-y-0 rounded-[10px] overflow-hidden"
                style={{
                  background: darkMode
                    ? `rgba(255,255,255,${dragging ? 0.14 : 0.1})`
                    : `rgba(255,255,255,${dragging ? 0.85 : 0.7})`,
                  boxShadow: darkMode
                    ? `inset 0 0.5px 0 0 rgba(255,255,255,${dragging ? 0.3 : 0.2}), inset 0 -0.5px 0 0 rgba(255,255,255,0.05), 0 0 ${dragging ? 16 : 6}px rgba(255,255,255,${dragging ? 0.06 : 0.03})`
                    : `inset 0 0.5px 0 0 rgba(255,255,255,0.95), 0 1px ${dragging ? 8 : 4}px rgba(0,0,0,${dragging ? 0.12 : 0.06})`,
                  border: darkMode
                    ? `0.5px solid rgba(255,255,255,${dragging ? 0.2 : 0.12})`
                    : '0.5px solid rgba(255,255,255,0.85)',
                  backdropFilter: `blur(${dragging ? 40 : 30}px) saturate(${dragging ? 2 : 1.6}) brightness(${darkMode ? (dragging ? 1.3 : 1.15) : 1})`,
                  transition: dragging ? 'background 60ms, backdrop-filter 60ms' : 'all 500ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              >
                {/* Top specular highlight — rim lighting */}
                <div className="absolute inset-x-0 top-0 h-[45%] pointer-events-none"
                  style={{
                    background: darkMode
                      ? `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.15 : 0.08}) 0%, transparent 100%)`
                      : `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.7 : 0.5}) 0%, transparent 100%)`,
                    borderRadius: '10px 10px 50% 50%',
                  }}
                />
                {/* Prismatic refraction on drag */}
                {dragging && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(${110 + distFromCenter * 50}deg,
                        rgba(140,210,255,${darkMode ? 0.1 : 0.06}) 0%,
                        rgba(190,140,255,${darkMode ? 0.08 : 0.04}) 33%,
                        rgba(255,190,140,${darkMode ? 0.08 : 0.04}) 66%,
                        rgba(140,255,210,${darkMode ? 0.06 : 0.03}) 100%)`,
                    }}
                  />
                )}
                {/* Light caustic streak */}
                {dragging && (
                  <div className="absolute inset-y-0 pointer-events-none"
                    style={{
                      width: '35%',
                      left: `${30 + distFromCenter * 80}%`,
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,${darkMode ? 0.12 : 0.2}) 50%, transparent)`,
                      filter: 'blur(6px)',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Tab buttons — icons/text brightness changes based on glass overlap */}
            <div className="relative flex">
              {TABS.map((t, i) => {
                const overlap = getGlassOverlap(i, pillPos)
                // iOS 26 style: items under glass become bright white, others stay dim
                const brightness = darkMode
                  ? overlap * 0.8 + 0.25  // 0.25 (dim) → 1.05 (bright white)
                  : overlap * 0.5 + 0.35  // 0.35 (dim) → 0.85 (dark)

                const iconScale = 1 + overlap * 0.12
                const fontWeight = overlap > 0.5 ? 600 : 500

                return (
                  <button
                    key={t.id}
                    onClick={() => { if (!dragging) setTab(t.id) }}
                    className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[10px] tracking-wide cursor-pointer relative z-10 select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                    style={{
                      color: darkMode
                        ? `rgba(255,255,255,${brightness})`
                        : `rgba(0,0,0,${brightness})`,
                      fontWeight,
                      transition: dragging ? 'color 60ms' : 'color 300ms, font-weight 300ms',
                    }}
                  >
                    <span style={{
                      transform: `scale(${iconScale})`,
                      filter: overlap > 0.3 ? `drop-shadow(0 0 ${overlap * 3}px rgba(255,255,255,${overlap * 0.15}))` : 'none',
                      transition: dragging ? 'transform 60ms, filter 60ms' : 'transform 300ms, filter 300ms',
                      display: 'flex',
                    }}>
                      {t.icon}
                    </span>
                    <span>{t.label}</span>
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
