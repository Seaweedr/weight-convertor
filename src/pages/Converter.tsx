import { useState, useRef } from 'react'
import { glassCard, glassInput, sub, glassChip, accentBtn } from '../styles'

const LB_TO_KG = 0.45359237
const KG_TO_LB = 1 / LB_TO_KG
const QUICK_VALUES = [10, 20, 30, 45, 70, 90, 115, 135, 180, 225, 270, 315]

function fmt(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(2).replace(/\.?0+$/, '')
}

export default function Converter({ darkMode }: { darkMode: boolean }) {
  const [val, setVal] = useState('')
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')
  const [history, setHistory] = useState<{ v: string; u: 'lb' | 'kg' }[]>(() => {
    try { return JSON.parse(localStorage.getItem('wc-hist') || '[]') } catch { return [] }
  })
  const ref = useRef<HTMLInputElement>(null)

  function addHist(v: string, u: 'lb' | 'kg') {
    if (!v || isNaN(parseFloat(v))) return
    setHistory(prev => {
      const next = [{ v, u }, ...prev.filter(h => !(h.v === v && h.u === u))].slice(0, 10)
      localStorage.setItem('wc-hist', JSON.stringify(next))
      return next
    })
  }

  const num = parseFloat(val)
  const ok = val !== '' && !isNaN(num)
  const converted = ok ? (unit === 'lb' ? num * LB_TO_KG : num * KG_TO_LB) : null
  const outUnit = unit === 'lb' ? 'kg' : 'lb'
  const s = sub(darkMode)
  const tc = darkMode ? 'text-white placeholder:text-white/15' : 'text-zinc-900 placeholder:text-zinc-300'

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-lg font-normal tracking-tight mb-0.5" style={{ opacity: 0.85 }}>重量換算</h1>
      <p className={`text-[11px] ${s} mb-5`}>磅 ⇄ 公斤</p>

      <div className="w-full max-w-sm p-5 space-y-3" style={glassCard(darkMode)}>
        <div className="relative" style={glassInput(darkMode)}>
          <input ref={ref} type="number" inputMode="decimal" value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={() => addHist(val, unit)}
            onKeyDown={e => { if (e.key === 'Enter') addHist(val, unit) }}
            placeholder="0"
            className={`w-full text-[34px] font-extralight text-center py-5 px-14 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${tc}`}
          />
          <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wider ${s}`}>{unit}</span>
        </div>

        <div className="flex justify-center">
          <button onClick={() => { if (converted !== null) setVal(fmt(converted)); setUnit(p => p === 'lb' ? 'kg' : 'lb') }}
            className="w-1/2 flex items-center justify-center gap-2 py-3 cursor-pointer font-medium text-sm transition-all duration-200 active:scale-[0.97]"
            style={accentBtn()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
            切換
          </button>
        </div>

        <div className="relative" style={glassInput(darkMode)}>
          <div className="py-5 px-14 text-center">
            <div className={`text-[34px] font-extralight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {converted !== null ? fmt(converted) : '—'}
            </div>
          </div>
          <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-xs font-medium uppercase tracking-wider ${s}`}>{outUnit}</span>
        </div>
      </div>

      <div className="w-full max-w-sm mt-5">
        <p className={`text-[11px] ${s} mb-2 text-center`}>快速選擇</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_VALUES.map(v => (
            <button key={v} onClick={() => { setVal(v.toString()); addHist(v.toString(), unit) }}
              className="py-2.5 text-[13px] font-normal cursor-pointer transition-all duration-200 active:scale-[0.97]"
              style={glassChip(darkMode, val === v.toString())}>
              {v} {unit}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-sm mt-5 pt-5" style={{ borderTop: darkMode ? '0.5px solid rgba(255,255,255,0.05)' : '0.5px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-[11px] ${s}`}>歷史紀錄</p>
            <button onClick={() => setHistory([])} className={`text-[11px] ${s} cursor-pointer`}>清除</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {history.map((h, i) => (
              <button key={`${h.v}-${h.u}-${i}`} onClick={() => { setVal(h.v); setUnit(h.u) }}
                className="py-2.5 text-[13px] font-normal cursor-pointer transition-all duration-200 active:scale-[0.97]"
                style={glassChip(darkMode, val === h.v && unit === h.u)}>
                {h.v} {h.u}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
