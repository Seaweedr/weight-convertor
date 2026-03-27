import { useState, useRef, useEffect } from 'react'
import { glass, sub, chipStyle, accentBtn } from '../styles'

const LB_TO_KG = 0.45359237
const KG_TO_LB = 1 / LB_TO_KG
const QUICK_VALUES = [10, 20, 30, 45, 70, 90, 115, 135, 180, 225, 270, 315]

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(2).replace(/\.?0+$/, '')
}

export default function Converter({ darkMode }: { darkMode: boolean }) {
  const [inputValue, setInputValue] = useState('')
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')
  const [history, setHistory] = useState<{ value: string; unit: 'lb' | 'kg' }[]>(() => {
    const saved = localStorage.getItem('weight-converter-history')
    return saved ? JSON.parse(saved) : []
  })
  const inputRef = useRef<HTMLInputElement>(null)

  // Don't auto-focus on mobile to avoid keyboard popup
  useEffect(() => { localStorage.setItem('weight-converter-history', JSON.stringify(history)) }, [history])

  function addToHistory(val: string, u: 'lb' | 'kg') {
    if (!val || isNaN(parseFloat(val))) return
    setHistory(prev => {
      const filtered = prev.filter(h => !(h.value === val && h.unit === u))
      return [{ value: val, unit: u }, ...filtered].slice(0, 10)
    })
  }

  const numValue = parseFloat(inputValue)
  const hasValue = inputValue !== '' && !isNaN(numValue)
  const converted = hasValue ? (unit === 'lb' ? numValue * LB_TO_KG : numValue * KG_TO_LB) : null
  const outputUnit = unit === 'lb' ? 'kg' : 'lb'

  function handleSwap() {
    if (converted !== null) setInputValue(formatNumber(converted))
    setUnit(prev => (prev === 'lb' ? 'kg' : 'lb'))
  }

  const s = sub(darkMode)

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-1">重量換算</h1>
      <p className={`text-xs ${s} mb-5`}>磅 ⇄ 公斤</p>

      <div className={`w-full max-w-sm rounded-3xl p-5 space-y-3 ${glass(darkMode)}`}>
        {/* Input */}
        <div className={`relative rounded-2xl ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`}>
          <input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={() => addToHistory(inputValue, unit)}
            onKeyDown={e => { if (e.key === 'Enter') addToHistory(inputValue, unit) }}
            placeholder="0"
            className={`w-full text-4xl font-semibold text-center rounded-2xl py-5 px-14 outline-none bg-transparent transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${darkMode ? 'text-white placeholder:text-white/25' : 'text-zinc-900 placeholder:text-zinc-400'}`}
          />
          <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-base font-semibold uppercase ${s}`}>{unit}</span>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button onClick={handleSwap}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 transition-all duration-200 cursor-pointer font-medium text-sm ${accentBtn(darkMode)}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
            切換
          </button>
        </div>

        {/* Output */}
        <div className={`relative rounded-2xl ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.04]'}`}>
          <div className="py-5 px-14 text-center">
            <div className={`text-4xl font-semibold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
              {converted !== null ? formatNumber(converted) : '—'}
            </div>
          </div>
          <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-base font-semibold uppercase ${s}`}>{outputUnit}</span>
        </div>
      </div>

      {/* Quick Select */}
      <div className="w-full max-w-sm mt-5">
        <p className={`text-xs ${s} mb-2 text-center`}>快速選擇</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_VALUES.map(val => (
            <button key={val} onClick={() => { setInputValue(val.toString()); addToHistory(val.toString(), unit) }}
              className={`py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${chipStyle(darkMode, inputValue === val.toString())}`}>
              {val} {unit}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-sm mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs ${s}`}>歷史紀錄</p>
            <button onClick={() => setHistory([])} className={`text-xs ${s} hover:text-white transition-colors cursor-pointer`}>清除</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {history.map((h, i) => (
              <button key={`${h.value}-${h.unit}-${i}`} onClick={() => { setInputValue(h.value); setUnit(h.unit) }}
                className={`py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${chipStyle(darkMode, inputValue === h.value && unit === h.unit)}`}>
                {h.value} {h.unit}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
