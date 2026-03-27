import { useState, useEffect, useRef, useCallback } from 'react'
import { sub, chipStyle } from '../styles'

const PRESETS = [30, 60, 90, 120, 180, 300]
function fmt(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}` }

export default function Timer({ darkMode }: { darkMode: boolean }) {
  const [duration, setDuration] = useState(90)
  const [remaining, setRemaining] = useState(90)
  const [running, setRunning] = useState(false)
  const ref = useRef<number | null>(null)
  const audioRef = useRef<AudioContext | null>(null)

  const beep = useCallback(() => {
    try {
      if (!audioRef.current) audioRef.current = new AudioContext()
      const ctx = audioRef.current, o = ctx.createOscillator(), g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.3
      o.start(); o.stop(ctx.currentTime + 0.2)
    } catch { /* */ }
  }, [])

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = window.setInterval(() => {
        setRemaining(p => { if (p <= 1) { setRunning(false); beep(); return 0 } return p - 1 })
      }, 1000)
    }
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running, remaining, beep])

  const pick = (s: number) => { setDuration(s); setRemaining(s); setRunning(false) }
  const toggle = () => { if (remaining === 0) { setRemaining(duration); setRunning(true) } else setRunning(!running) }
  const reset = () => { setRunning(false); setRemaining(duration) }

  const progress = duration > 0 ? remaining / duration : 0
  const circ = 2 * Math.PI * 90
  const offset = circ * (1 - progress)
  const done = remaining === 0 && !running
  const s = sub(darkMode)

  const ringBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const ringColor = done ? '#f87171' : running ? '#f97316' : '#34d399'

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-1">組間休息</h1>
      <p className={`text-xs ${s} mb-5`}>倒數計時器</p>

      <div className="relative w-52 h-52 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke={ringBg} strokeWidth="5" />
          <circle cx="100" cy="100" r="90" fill="none" stroke={ringColor} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000 ease-linear" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-extralight tabular-nums tracking-tight ${done ? 'text-red-400' : ''}`}>{fmt(remaining)}</span>
          {done && <span className="text-xs text-red-400 mt-1 font-medium">時間到！</span>}
        </div>
      </div>

      <div className="flex gap-3 mb-10">
        <button onClick={toggle}
          className="px-10 py-3.5 rounded-full font-semibold text-base cursor-pointer transition-transform active:scale-95"
          style={{
            background: running ? 'rgba(249,115,22,0.85)' : done ? 'rgba(239,68,68,0.85)' : 'rgba(52,211,153,0.85)',
            color: '#fff',
            boxShadow: `0 4px 16px -4px ${running ? 'rgba(249,115,22,0.4)' : done ? 'rgba(239,68,68,0.4)' : 'rgba(52,211,153,0.4)'}`,
          }}>
          {running ? '暫停' : done ? '重新開始' : '開始'}
        </button>
        <button onClick={reset}
          className="px-10 py-3.5 rounded-full font-semibold text-base cursor-pointer transition-transform active:scale-95"
          style={chipStyle(darkMode, false)}>
          重置
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map(sec => (
          <button key={sec} onClick={() => { if (!running) pick(sec) }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-transform ${running ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            style={chipStyle(darkMode, duration === sec && !running)}>
            {fmt(sec)}
          </button>
        ))}
      </div>
    </div>
  )
}
