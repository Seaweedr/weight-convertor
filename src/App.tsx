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

function App() {
  const [tab, setTab] = useState<Tab>('converter')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wc-dark-mode')
    return saved !== null ? saved === 'true' : true
  })

  // Drag state
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState<number | null>(null) // 0~4 continuous position
  const dragStartRef = useRef({ x: 0, startIdx: 0 })

  useEffect(() => {
    localStorage.setItem('wc-dark-mode', String(darkMode))
  }, [darkMode])

  const tabIdx = TABS.findIndex(t => t.id === tab)

  // Pill position: during drag use continuous dragProgress, otherwise snap to tab index
  const pillPos = dragging && dragProgress !== null ? dragProgress : tabIdx
  // Stretch effect: how far from nearest integer (tab center)
  const nearestTab = Math.round(pillPos)
  const distFromCenter = Math.abs(pillPos - nearestTab)
  const stretchScale = dragging ? 1 + distFromCenter * 0.4 : 1
  // translateX in % relative to pill's own width
  const translateX = pillPos * 100

  // Convert clientX to continuous tab index (0~4)
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
    const progress = clientXToProgress(e.clientX)
    setDragProgress(progress)
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return
    setDragging(false)
    // Snap to nearest tab
    const progress = clientXToProgress(e.clientX)
    const targetIdx = Math.round(progress)
    const clamped = Math.max(0, Math.min(TAB_COUNT - 1, targetIdx))
    setTab(TABS[clamped].id)
    setDragProgress(null)
  }

  const bg = darkMode
    ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white'
    : 'bg-gradient-to-b from-zinc-100 via-white to-zinc-100 text-zinc-900'

  return (
    <div className={`h-svh ${bg} transition-colors duration-500`}>
      {/* Page Content */}
      <div className="h-full overflow-y-auto pt-[env(safe-area-inset-top)] pb-16">
        {tab === 'converter' && <Converter darkMode={darkMode} />}
        {tab === 'plates' && <PlateCalc darkMode={darkMode} />}
        {tab === '1rm' && <OneRepMax darkMode={darkMode} />}
        {tab === 'timer' && <Timer darkMode={darkMode} />}
        {tab === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      {/* Liquid Glass Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-2 pb-0.5">
          <div
            ref={containerRef}
            className={`relative rounded-xl overflow-hidden select-none touch-none ${
              darkMode
                ? 'bg-white/[0.06] border border-white/[0.08]'
                : 'bg-white/50 border border-white/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]'
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Liquid glass sliding pill */}
            <div
              className="absolute top-[4px] bottom-[4px] left-0 pointer-events-none"
              style={{
                width: `${100 / TAB_COUNT}%`,
                transform: `translateX(${translateX}%) scaleX(${stretchScale})`,
                transition: dragging
                  ? 'none'
                  : 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              {/* Glass body */}
              <div
                className="absolute inset-x-1 inset-y-0 rounded-[11px] overflow-hidden"
                style={{
                  background: darkMode
                    ? `rgba(255,255,255,${dragging ? 0.18 : 0.12})`
                    : `rgba(255,255,255,${dragging ? 0.92 : 0.8})`,
                  boxShadow: darkMode
                    ? `inset 0 1px 0 0 rgba(255,255,255,${dragging ? 0.25 : 0.18}), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 0 ${dragging ? 20 : 8}px ${dragging ? 4 : 1}px rgba(255,255,255,${dragging ? 0.08 : 0.04})`
                    : `inset 0 1px 0 0 rgba(255,255,255,1), 0 2px ${dragging ? 12 : 6}px -2px rgba(0,0,0,${dragging ? 0.15 : 0.08})`,
                  border: `1px solid ${darkMode ? `rgba(255,255,255,${dragging ? 0.22 : 0.14})` : 'rgba(255,255,255,0.9)'}`,
                  backdropFilter: `blur(${dragging ? 32 : 24}px) saturate(${dragging ? 1.8 : 1.2})`,
                  transition: dragging ? 'background 80ms, box-shadow 80ms, border 80ms, backdrop-filter 80ms' : 'all 500ms cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              >
                {/* Top refraction highlight */}
                <div
                  className="absolute inset-x-0 top-0 h-[50%] pointer-events-none"
                  style={{
                    background: darkMode
                      ? `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.18 : 0.1}) 0%, transparent 100%)`
                      : `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.8 : 0.6}) 0%, transparent 100%)`,
                    borderRadius: '11px 11px 50% 50%',
                  }}
                />

                {/* Prismatic rainbow refraction — visible when dragging */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: dragging
                      ? `linear-gradient(${105 + distFromCenter * 60}deg, rgba(120,200,255,${darkMode ? 0.12 : 0.08}) 0%, rgba(200,130,255,${darkMode ? 0.1 : 0.06}) 35%, rgba(255,180,120,${darkMode ? 0.1 : 0.06}) 65%, rgba(120,255,200,${darkMode ? 0.08 : 0.05}) 100%)`
                      : 'none',
                    opacity: dragging ? 1 : 0,
                    transition: dragging ? 'none' : 'opacity 400ms',
                  }}
                />

                {/* Moving light streak on drag */}
                <div
                  className="absolute inset-y-0 pointer-events-none"
                  style={{
                    width: '40%',
                    left: dragging ? `${(distFromCenter * 120)}%` : '30%',
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,${dragging ? (darkMode ? 0.15 : 0.3) : 0}) 50%, transparent)`,
                    filter: dragging ? 'blur(8px)' : 'blur(4px)',
                    opacity: dragging ? 1 : 0,
                    transition: dragging ? 'left 60ms, opacity 60ms' : 'opacity 400ms',
                  }}
                />
              </div>

              {/* Outer glow when dragging */}
              {dragging && (
                <div
                  className="absolute inset-x-0 inset-y-[-2px] rounded-[13px] pointer-events-none"
                  style={{
                    boxShadow: darkMode
                      ? '0 0 24px 4px rgba(180,200,255,0.08), 0 0 8px 2px rgba(255,255,255,0.06)'
                      : '0 0 20px 4px rgba(0,0,0,0.06)',
                  }}
                />
              )}
            </div>

            {/* Tab buttons */}
            <div className="relative flex">
              {TABS.map((t) => {
                const isActive = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => { if (!dragging) setTab(t.id) }}
                    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-medium tracking-wide cursor-pointer relative z-10 transition-all duration-300 select-none [-webkit-touch-callout:none] [-webkit-user-select:none] ${
                      isActive
                        ? darkMode ? 'text-white' : 'text-zinc-800'
                        : darkMode ? 'text-white/25' : 'text-zinc-400'
                    }`}
                  >
                    <span className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'scale-100'}`}>
                      {t.icon}
                    </span>
                    <span className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
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
