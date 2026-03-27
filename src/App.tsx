import { useState, useEffect, type ReactNode } from 'react'
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
const TAB_WIDTH_PCT = 100 / TAB_COUNT

function App() {
  const [tab, setTab] = useState<Tab>('converter')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('wc-dark-mode')
    return saved !== null ? saved === 'true' : true
  })

  useEffect(() => {
    localStorage.setItem('wc-dark-mode', String(darkMode))
  }, [darkMode])

  const tabIdx = TABS.findIndex(t => t.id === tab)
  // translateX is relative to the pill's own width, so 100% = 1 tab width
  const pillTranslateX = tabIdx * 100

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

      {/* Liquid Glass Tab Bar — fixed to bottom */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="px-2 pb-0.5">
          <div
            className={`relative rounded-xl overflow-hidden ${
              darkMode
                ? 'bg-white/[0.06] border border-white/[0.08]'
                : 'bg-white/50 border border-white/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]'
            }`}
          >
            {/* Liquid glass sliding pill — uses transform for reliable animation */}
            <div
              className="absolute top-[5px] bottom-[5px] left-0 pointer-events-none"
              style={{
                width: `${TAB_WIDTH_PCT}%`,
                transform: `translateX(${pillTranslateX}%)`,
                transition: 'transform 500ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            >
              <div
                className="absolute inset-x-1 inset-y-0 rounded-[13px]"
                style={{
                  background: darkMode
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.8)',
                  boxShadow: darkMode
                    ? 'inset 0 1px 0 0 rgba(255,255,255,0.15), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 0 10px 2px rgba(255,255,255,0.04)'
                    : 'inset 0 1px 0 0 rgba(255,255,255,1), 0 2px 6px -2px rgba(0,0,0,0.08)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                }}
              />
              {/* Refraction highlight */}
              <div
                className="absolute inset-x-1 top-0 h-[45%] rounded-t-[13px]"
                style={{
                  background: darkMode
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
                  borderRadius: '13px 13px 50% 50%',
                }}
              />
            </div>

            {/* Tab buttons */}
            <div className="relative flex">
              {TABS.map((t) => {
                const isActive = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
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
