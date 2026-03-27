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
  const [pressedIdx, setPressedIdx] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem('wc-dark-mode', String(darkMode))
    document.documentElement.className = darkMode ? 'dark-bg' : 'light-bg'
  }, [darkMode])

  const tabIdx = TABS.findIndex(t => t.id === tab)
  const pillPos = dragging && dragProgress !== null ? dragProgress : tabIdx
  const distFromCenter = Math.abs(pillPos - Math.round(pillPos))
  const stretchScale = dragging ? 1 + distFromCenter * 0.3 : 1
  const translateX = pillPos * 100

  // Clip-path for magnified layer
  const pillLeftPct = (pillPos / TAB_COUNT) * 100
  const pillWidthPct = 100 / TAB_COUNT
  const clipLeft = pillLeftPct + 0.8
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

  function getTabIdxFromX(clientX: number): number {
    const el = containerRef.current
    if (!el) return tabIdx
    const rect = el.getBoundingClientRect()
    const relX = clientX - rect.left
    return Math.max(0, Math.min(TAB_COUNT - 1, Math.floor((relX / rect.width) * TAB_COUNT)))
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
    setDragProgress(clientXToProgress(e.clientX))
    setPressedIdx(getTabIdxFromX(e.clientX))
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return
    setDragProgress(clientXToProgress(e.clientX))
    setPressedIdx(getTabIdxFromX(e.clientX))
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return
    setDragging(false)
    const idx = Math.max(0, Math.min(TAB_COUNT - 1, Math.round(clientXToProgress(e.clientX))))
    setTab(TABS[idx].id)
    setDragProgress(null)
    setPressedIdx(null)
  }
  function onPointerCancel() {
    setDragging(false)
    setDragProgress(null)
    setPressedIdx(null)
  }

  const bg = darkMode ? 'text-white' : 'text-zinc-900'
  const dimColor = darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
  const brightColor = darkMode ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.85)'

  return (
    <div className={`h-svh ${bg}`}>
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
            className="relative rounded-2xl select-none touch-none"
            style={{
              background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.45)',
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
            onPointerCancel={onPointerCancel}
          >
            {/* Sliding glass pill (selected state) */}
            <div
              className="absolute top-[3px] bottom-[3px] left-0 pointer-events-none"
              style={{
                width: `${pillWidthPct}%`,
                transform: `translateX(${translateX}%) scaleX(${stretchScale})`,
                transition: dragging ? 'none' : 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <div className="absolute inset-x-[3px] inset-y-0 rounded-[12px] overflow-hidden"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)',
                  backdropFilter: `blur(20px) brightness(${darkMode ? 1.3 : 1.02}) saturate(1.8)`,
                  WebkitBackdropFilter: `blur(20px) brightness(${darkMode ? 1.3 : 1.02}) saturate(1.8)`,
                  boxShadow: darkMode
                    ? 'inset 0 0.5px 0 rgba(255,255,255,0.15), 0 0 0 0.5px rgba(255,255,255,0.08)'
                    : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.5)',
                }}>
                {/* Top rim highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px]" style={{
                  background: darkMode
                    ? 'linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.3) 50%, transparent 92%)'
                    : 'linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.9) 50%, transparent 92%)',
                }} />
                <div className="absolute inset-x-0 top-0 h-[35%]" style={{
                  background: darkMode
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                }} />
              </div>
            </div>

            {/* Tab buttons */}
            <div className="relative flex">
              {TABS.map((t, i) => {
                const isActive = tab === t.id
                const isPressed = pressedIdx === i && dragging

                return (
                  <div key={t.id} className="flex-1 relative">
                    {/* Press magnifier glass bubble */}
                    {isPressed && (
                      <div className="absolute inset-x-[2px] -top-[52px] z-30 flex items-center justify-center pointer-events-none"
                        style={{
                          height: 48,
                          borderRadius: 16,
                          background: darkMode
                            ? 'rgba(20,20,24,0.85)'
                            : 'rgba(240,240,245,0.9)',
                          backdropFilter: 'blur(30px) saturate(1.8)',
                          WebkitBackdropFilter: 'blur(30px) saturate(1.8)',
                          border: darkMode
                            ? '0.5px solid rgba(255,255,255,0.12)'
                            : '0.5px solid rgba(255,255,255,0.7)',
                          boxShadow: darkMode
                            ? 'inset 0 0.5px 0 rgba(255,255,255,0.1), 0 8px 24px -4px rgba(0,0,0,0.6)'
                            : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 8px 24px -4px rgba(0,0,0,0.12)',
                          animation: 'popIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        <span style={{
                          color: darkMode ? '#fff' : '#1c1c1e',
                          transform: 'scale(1.3)',
                          display: 'flex',
                          filter: darkMode ? 'drop-shadow(0 0 4px rgba(255,255,255,0.15))' : 'none',
                        }}>
                          {t.filled}
                        </span>
                      </div>
                    )}

                    {/* Pointer triangle from bubble to tab */}
                    {isPressed && (
                      <div className="absolute left-1/2 -translate-x-1/2 -top-[6px] z-30 pointer-events-none">
                        <div style={{
                          width: 0, height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: darkMode ? '6px solid rgba(20,20,24,0.85)' : '6px solid rgba(240,240,245,0.9)',
                        }} />
                      </div>
                    )}

                    <button
                      onClick={() => { if (!dragging) setTab(t.id) }}
                      className="w-full flex flex-col items-center justify-center gap-1 py-3 cursor-pointer relative z-10 select-none [-webkit-touch-callout:none] [-webkit-user-select:none]"
                      style={{
                        color: isActive ? (darkMode ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.8)') : dimColor,
                        transition: dragging ? 'color 40ms' : 'color 300ms',
                      }}
                    >
                      <span style={{
                        transform: isPressed ? 'scale(1.15)' : isActive ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                        display: 'flex',
                      }}>
                        {isActive ? t.filled : t.outlined}
                      </span>
                      <span style={{
                        fontSize: 10,
                        fontWeight: isActive ? 500 : 400,
                        letterSpacing: '0.02em',
                        opacity: isPressed ? 0.5 : 1,
                        transition: 'opacity 150ms',
                      }}>
                        {t.label}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Magnified layer clipped to pill */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: `inset(${clipInset} round 12px)`,
                transition: dragging ? 'none' : 'clip-path 600ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <div className="flex h-full">
                {TABS.map((t) => (
                  <div key={t.id} className="flex-1 flex flex-col items-center justify-center gap-1"
                    style={{ color: brightColor }}>
                    <span className="flex" style={{ transform: 'scale(1.1)' }}>{t.filled}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Pop-in animation */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(8px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default App
