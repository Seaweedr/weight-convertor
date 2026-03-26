import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
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

function App() {
  const [tab, setTab] = useState<Tab>('converter')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wc-dark-mode')
    return saved !== null ? saved === 'true' : true
  })

  // Liquid glass indicator state
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const [pillAnimating, setPillAnimating] = useState(false)
  const mountedRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [stretch, setStretch] = useState(0)
  const dragStartRef = useRef({ x: 0, tabIdx: 0 })

  useEffect(() => {
    localStorage.setItem('wc-dark-mode', String(darkMode))
  }, [darkMode])

  // Measure pill position for a given tab
  const measureTab = useCallback((tabId: Tab) => {
    const idx = TABS.findIndex(t => t.id === tabId)
    const el = tabRefs.current[idx]
    const parent = containerRef.current
    if (el && parent) {
      const pRect = parent.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      return { left: eRect.left - pRect.left, width: eRect.width }
    }
    return null
  }, [])

  // On mount: measure immediately, no animation
  useEffect(() => {
    const pos = measureTab(tab)
    if (pos) setPill(pos)
    // Enable animation after first paint
    requestAnimationFrame(() => {
      mountedRef.current = true
    })
    const onResize = () => {
      const pos = measureTab(tab)
      if (pos) setPill(pos)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On tab change: animate pill to new position
  useEffect(() => {
    if (!mountedRef.current) return
    setPillAnimating(true)
    // Measure after render so refs are up to date
    requestAnimationFrame(() => {
      const pos = measureTab(tab)
      if (pos) setPill(pos)
    })
  }, [tab, measureTab])

  // Get tab index from X position
  const getTabIdxFromX = useCallback((clientX: number) => {
    const parent = containerRef.current
    if (!parent) return 0
    const pRect = parent.getBoundingClientRect()
    const relX = clientX - pRect.left
    for (let i = 0; i < tabRefs.current.length; i++) {
      const el = tabRefs.current[i]
      if (el) {
        const eRect = el.getBoundingClientRect()
        const elLeft = eRect.left - pRect.left
        if (relX >= elLeft && relX < elLeft + eRect.width) return i
      }
    }
    return TABS.findIndex(t => t.id === tab)
  }, [tab])

  // Touch/mouse handlers for dragging
  const handleDragStart = useCallback((clientX: number) => {
    setDragging(true)
    const idx = TABS.findIndex(t => t.id === tab)
    dragStartRef.current = { x: clientX, tabIdx: idx }
  }, [tab])

  const handleDragMove = useCallback((clientX: number) => {
    if (!dragging) return
    const parent = containerRef.current
    if (!parent) return

    const pRect = parent.getBoundingClientRect()
    const relX = clientX - pRect.left
    const targetIdx = getTabIdxFromX(clientX)
    const targetEl = tabRefs.current[targetIdx]

    if (targetEl) {
      const eRect = targetEl.getBoundingClientRect()
      const targetLeft = eRect.left - pRect.left
      const targetWidth = eRect.width

      // Calculate how far we are from center of target tab
      const targetCenter = targetLeft + targetWidth / 2
      const dist = Math.abs(relX - targetCenter)
      const maxDist = targetWidth / 2

      // Stretch based on distance from center (clamped)
      const stretchAmount = Math.min(dist / maxDist, 1) * 16
      setStretch(stretchAmount)
      setDragX(targetLeft)
    }
  }, [dragging, getTabIdxFromX])

  const handleDragEnd = useCallback((clientX: number) => {
    if (!dragging) return
    setDragging(false)
    setStretch(0)

    const targetIdx = getTabIdxFromX(clientX)
    setTab(TABS[targetIdx].id)
  }, [dragging, getTabIdxFromX])

  // Pointer events
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
    handleDragStart(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => handleDragMove(e.clientX)
  const onPointerUp = (e: React.PointerEvent) => handleDragEnd(e.clientX)

  // Calculate pill transform
  const pillLeft = dragging ? dragX : pill.left
  const pillWidth = pill.width
  const scaleX = dragging ? 1 + stretch / pillWidth : 1
  const pillOpacity = dragging ? 0.18 : 0.12

  const bg = darkMode
    ? 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white'
    : 'bg-gradient-to-b from-zinc-100 via-white to-zinc-100 text-zinc-900'

  return (
    <div className={`h-svh flex flex-col ${bg} transition-colors duration-500`}>
      {/* Page Content */}
      <div className="flex-1 min-h-0 overflow-y-auto pt-[env(safe-area-inset-top)]">
        {tab === 'converter' && <Converter darkMode={darkMode} />}
        {tab === 'plates' && <PlateCalc darkMode={darkMode} />}
        {tab === '1rm' && <OneRepMax darkMode={darkMode} />}
        {tab === 'timer' && <Timer darkMode={darkMode} />}
        {tab === 'settings' && <Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>

      {/* Liquid Glass Tab Bar */}
      <nav className={`flex-shrink-0 ${darkMode ? 'bg-black' : 'bg-zinc-100'}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="px-2 py-1">
          <div
            ref={containerRef}
            className={`relative rounded-2xl overflow-hidden select-none touch-none ${
              darkMode
                ? 'bg-white/[0.06] border border-white/[0.08]'
                : 'bg-white/50 border border-white/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]'
            }`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            {/* Liquid glass sliding pill */}
            <div
              className={`absolute top-[5px] bottom-[5px] rounded-[15px] pointer-events-none ${
                !pillAnimating || dragging ? '' : 'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'
              }`}
              style={{
                left: pillLeft + 4,
                width: pillWidth - 8,
                transform: `scaleX(${scaleX})`,
                background: darkMode
                  ? `rgba(255,255,255,${pillOpacity})`
                  : `rgba(255,255,255,${dragging ? 0.9 : 0.8})`,
                boxShadow: darkMode
                  ? `inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 0 ${dragging ? 20 : 10}px ${dragging ? 4 : 2}px rgba(255,255,255,0.04)`
                  : `inset 0 1px 0 0 rgba(255,255,255,1), 0 2px ${dragging ? 12 : 6}px ${dragging ? -1 : -2}px rgba(0,0,0,${dragging ? 0.12 : 0.08})`,
                border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
              }}
            />

            {/* Subtle refraction highlight on pill */}
            <div
              className={`absolute pointer-events-none rounded-[15px] ${
                !pillAnimating || dragging ? '' : 'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'
              }`}
              style={{
                left: pillLeft + 4,
                width: pillWidth - 8,
                top: 5,
                height: '45%',
                transform: `scaleX(${scaleX})`,
                background: darkMode
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
                borderRadius: '15px 15px 50% 50%',
              }}
            />

            {/* Tab buttons */}
            <div className="relative flex">
              {TABS.map((t, i) => {
                const isActive = tab === t.id
                return (
                  <button
                    key={t.id}
                    ref={el => { tabRefs.current[i] = el }}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-[10px] font-medium tracking-wide cursor-pointer relative z-10 transition-all duration-300 ${
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
