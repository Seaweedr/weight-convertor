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

  // Pill morphs: when pressing, pill gets taller and more opaque
  const pillScale = dragging ? 'scaleY(1.2) scaleX(1.05)' : 'scaleY(1) scaleX(1)'
  const pillBg = darkMode
    ? (dragging ? 'rgba(50,50,60,0.95)' : 'rgba(255,255,255,0.08)')
    : (dragging ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)')
  const pillBlur = dragging
    ? `blur(40px) brightness(${darkMode ? 1.8 : 1.1}) saturate(2.5)`
    : `blur(20px) brightness(${darkMode ? 1.3 : 1.02}) saturate(1.8)`
  const pillShadow = darkMode
    ? (dragging
      ? 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -0.5px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.15), 0 12px 32px -4px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.04)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.15), 0 0 0 0.5px rgba(255,255,255,0.08)')
    : (dragging
      ? 'inset 0 1px 0 rgba(255,255,255,1), 0 2px 8px rgba(0,0,0,0.12), 0 12px 32px -4px rgba(0,0,0,0.12)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(255,255,255,0.5)')
  const pillBorder = darkMode
    ? (dragging ? '1px solid rgba(255,255,255,0.22)' : '0.5px solid rgba(255,255,255,0.1)')
    : (dragging ? '1px solid rgba(255,255,255,0.95)' : '0.5px solid rgba(255,255,255,0.6)')

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
            onPointerCancel={() => { setDragging(false); setDragProgress(null) }}
          >
            {/* Glass pill — morphs when pressed */}
            <div
              className="absolute left-0 pointer-events-none"
              style={{
                width: `${pillWidthPct}%`,
                top: dragging ? -6 : 3,
                bottom: dragging ? -6 : 3,
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
                  border: pillBorder,
                  transition: dragging
                    ? 'background 150ms, border-radius 200ms, box-shadow 150ms, border 150ms'
                    : 'all 600ms cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                {/* Top rim specular */}
                <div className="absolute inset-x-0 top-0 h-[1px]" style={{
                  background: darkMode
                    ? `linear-gradient(90deg, transparent 8%, rgba(255,255,255,${dragging ? 0.35 : 0.25}) 50%, transparent 92%)`
                    : `linear-gradient(90deg, transparent 8%, rgba(255,255,255,${dragging ? 1 : 0.9}) 50%, transparent 92%)`,
                }} />
                {/* Top glow */}
                <div className="absolute inset-x-0 top-0" style={{
                  height: dragging ? '45%' : '35%',
                  background: darkMode
                    ? `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.08 : 0.04}) 0%, transparent 100%)`
                    : `linear-gradient(180deg, rgba(255,255,255,${dragging ? 0.35 : 0.2}) 0%, transparent 100%)`,
                }} />
              </div>
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
                    <span className="flex" style={{
                      transform: dragging ? 'scale(1.25)' : 'scale(1.1)',
                      filter: dragging ? (darkMode ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'drop-shadow(0 0 6px rgba(0,0,0,0.15))') : 'none',
                      transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 200ms',
                    }}>{t.filled}</span>
                    <span style={{
                      fontSize: dragging ? 11 : 10,
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      transition: 'font-size 200ms',
                    }}>{t.label}</span>
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
