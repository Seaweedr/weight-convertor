import { useState, useEffect, useRef, useCallback } from 'react'
import { sub, glassChip } from '../styles'

const PRESETS = [30, 60, 90, 120, 180, 300]
function fmt(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}` }

export default function Timer({ darkMode }: { darkMode: boolean }) {
  const [dur, setDur] = useState(90)
  const [rem, setRem] = useState(90)
  const [on, setOn] = useState(false)
  const iv = useRef<number | null>(null)
  const audio = useRef<AudioContext | null>(null)

  const beep = useCallback(() => {
    try { if (!audio.current) audio.current = new AudioContext(); const c = audio.current, o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.3; o.start(); o.stop(c.currentTime + 0.2) } catch { /* */ }
  }, [])

  useEffect(() => {
    if (on && rem > 0) iv.current = window.setInterval(() => setRem(p => { if (p <= 1) { setOn(false); beep(); return 0 } return p - 1 }), 1000)
    return () => { if (iv.current) clearInterval(iv.current) }
  }, [on, rem, beep])

  const pick = (s: number) => { setDur(s); setRem(s); setOn(false) }
  const toggle = () => { if (rem === 0) { setRem(dur); setOn(true) } else setOn(!on) }
  const reset = () => { setOn(false); setRem(dur) }

  const prog = dur > 0 ? rem / dur : 0
  const circ = 2 * Math.PI * 90, off = circ * (1 - prog)
  const done = rem === 0 && !on
  const s = sub(darkMode)

  const ringBg = darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const ringColor = done ? '#E85D5D' : on ? '#E08A3E' : '#4EAE6D'

  const startStyle = {
    background: on ? 'rgba(224,138,62,0.8)' : done ? 'rgba(232,93,93,0.8)' : 'rgba(78,174,109,0.8)',
    color: '#fff',
    border: `0.5px solid ${on ? 'rgba(224,138,62,0.5)' : done ? 'rgba(232,93,93,0.5)' : 'rgba(78,174,109,0.5)'}`,
    boxShadow: `inset 0 0.5px 0 rgba(255,255,255,0.15), 0 6px 20px -6px ${on ? 'rgba(224,138,62,0.4)' : done ? 'rgba(232,93,93,0.4)' : 'rgba(78,174,109,0.4)'}`,
    borderRadius: 20,
  }

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-lg font-normal tracking-tight mb-0.5" style={{ opacity: 0.85 }}>組間休息</h1>
      <p className={`text-[11px] ${s} mb-5`}>倒數計時器</p>

      <div className="relative w-52 h-52 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke={ringBg} strokeWidth="4" />
          <circle cx="100" cy="100" r="90" fill="none" stroke={ringColor} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} className="transition-all duration-1000 ease-linear" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-[48px] font-extralight tabular-nums tracking-tight ${done ? 'text-red-400/80' : ''}`}>{fmt(rem)}</span>
          {done && <span className="text-[11px] text-red-400/70 mt-1 font-medium">時間到！</span>}
        </div>
      </div>

      <div className="w-full max-w-sm flex gap-3 mb-10 px-5">
        <button onClick={toggle} className="flex-1 py-3.5 font-medium text-[15px] cursor-pointer transition-all duration-200 active:scale-[0.97]" style={startStyle}>
          {on ? '暫停' : done ? '重新開始' : '開始'}
        </button>
        <button onClick={reset} className="flex-1 py-3.5 font-medium text-[15px] cursor-pointer transition-all duration-200 active:scale-[0.97]"
          style={{ ...glassChip(darkMode, false), borderRadius: 20 }}>
          重置
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map(sec => (
          <button key={sec} onClick={() => { if (!on) pick(sec) }}
            className={`px-5 py-2 text-[13px] font-normal transition-all duration-200 ${on ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer active:scale-[0.97]'}`}
            style={glassChip(darkMode, dur === sec && !on)}>
            {fmt(sec)}
          </button>
        ))}
      </div>
    </div>
  )
}
