import { useState, useEffect, useRef, useCallback } from 'react'
import { sub, chipStyle } from '../styles'

const PRESETS = [30, 60, 90, 120, 180, 300]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Timer({ darkMode }: { darkMode: boolean }) {
  const [duration, setDuration] = useState(90)
  const [remaining, setRemaining] = useState(90)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<AudioContext | null>(null)

  const playBeep = useCallback(() => {
    try {
      if (!audioRef.current) audioRef.current = new AudioContext()
      const ctx = audioRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.value = 0.3
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false)
            playBeep()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, remaining, playBeep])

  function selectPreset(sec: number) {
    setDuration(sec)
    setRemaining(sec)
    setRunning(false)
  }

  function toggleRun() {
    if (remaining === 0) {
      setRemaining(duration)
      setRunning(true)
    } else {
      setRunning(!running)
    }
  }

  function reset() {
    setRunning(false)
    setRemaining(duration)
  }

  const progress = duration > 0 ? remaining / duration : 0
  const circumference = 2 * Math.PI * 90
  const offset = circumference * (1 - progress)
  const isFinished = remaining === 0 && !running

  const s = sub(darkMode)
  const ringBg = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const ringColor = isFinished ? '#f87171' : running ? '#f97316' : '#22c55e'

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-1">組間休息</h1>
      <p className={`text-xs ${s} mb-5`}>倒數計時器</p>

      {/* Circle Timer */}
      <div className="relative w-52 h-52 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke={ringBg} strokeWidth="6" />
          <circle cx="100" cy="100" r="90" fill="none"
            stroke={ringColor}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-light tabular-nums tracking-tight ${isFinished ? 'text-red-400' : ''}`}>
            {formatTime(remaining)}
          </span>
          {isFinished && <span className="text-xs text-red-400 mt-1 font-medium">時間到！</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <button onClick={toggleRun}
          className={`px-8 py-2.5 rounded-full font-semibold text-base transition-all cursor-pointer ${
            running
              ? 'bg-orange-500/80 text-white shadow-lg shadow-orange-500/25'
              : isFinished
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                : 'bg-green-500 text-white shadow-lg shadow-green-500/25'
          }`}>
          {running ? '暫停' : remaining === 0 ? '重新開始' : '開始'}
        </button>
        <button onClick={reset}
          className={`px-8 py-2.5 rounded-full font-semibold text-base transition-all cursor-pointer ${
            darkMode ? 'bg-white/[0.08] text-white/50' : 'bg-black/[0.05] text-zinc-500'
          }`}>
          重置
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map(sec => (
          <button key={sec} onClick={() => selectPreset(sec)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${chipStyle(darkMode, duration === sec && !running)}`}>
            {formatTime(sec)}
          </button>
        ))}
      </div>
    </div>
  )
}
