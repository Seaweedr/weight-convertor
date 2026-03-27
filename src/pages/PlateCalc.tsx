import { useState } from 'react'
import { glassStyle, inputGlass, sub, cellStyle, toggleStyle } from '../styles'

const PLATES_LB = [45, 25, 10, 5, 2.5]
const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25]
const BAR_LB = 45
const BAR_KG = 20

const PLATE_COLORS: Record<number, string> = {
  45: '#3b82f6', 25: '#ef4444', 20: '#3b82f6', 15: '#eab308',
  10: '#22c55e', 5: '#f97316', 2.5: '#a855f7', 1.25: '#6b7280',
}

function calcPlates(target: number, barWeight: number, plates: number[]): { plate: number; count: number }[] | null {
  let remaining = (target - barWeight) / 2
  if (remaining < 0) return null
  const result: { plate: number; count: number }[] = []
  for (const plate of plates) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate)
      result.push({ plate, count })
      remaining -= count * plate
    }
  }
  if (remaining > 0.01) return null
  return result
}

function expandPlates(result: { plate: number; count: number }[]): number[] {
  const out: number[] = []
  for (const r of result) for (let i = 0; i < r.count; i++) out.push(r.plate)
  return out
}

function BarbellDiagram({ plates, unit, darkMode }: { plates: number[]; unit: 'lb' | 'kg'; darkMode: boolean }) {
  const plateW = 22, gap = 4, barH = 14, maxH = 120, cx = 200, cy = maxH / 2 + 10
  const heights: Record<number, number> = { 45: 100, 25: unit === 'lb' ? 82 : 100, 20: 92, 15: 78, 10: 64, 5: 52, 2.5: 42, 1.25: 34 }
  const side = plates.map((p, i) => ({ p, x: gap + i * (plateW + gap), h: heights[p] || 40, key: i }))
  const sw = side.length > 0 ? side[side.length - 1].x + plateW + gap : 10
  const bl = cx - sw - 30, br = cx + sw + 30
  const bar = darkMode ? '#52525b' : '#a1a1aa'
  const col = darkMode ? '#71717a' : '#d4d4d8'

  return (
    <svg viewBox={`0 0 ${Math.max(br + 40, 400)} ${maxH + 20}`} className="w-full">
      <rect x={bl} y={cy - barH / 2} width={br - bl} height={barH} rx={3} fill={bar} />
      <rect x={cx - sw - 10} y={cy - 18} width={10} height={36} rx={3} fill={col} />
      <rect x={cx + sw} y={cy - 18} width={10} height={36} rx={3} fill={col} />
      {side.map(s => [cx - s.x - plateW, cx + s.x].map((px, j) => (
        <g key={`${j}-${s.key}`}>
          <rect x={px} y={cy - s.h / 2} width={plateW} height={s.h} rx={4} fill={PLATE_COLORS[s.p] || '#6b7280'} opacity={0.8} />
          <text x={px + plateW / 2} y={cy} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={s.p < 5 ? 9 : 11} fontWeight="bold">{s.p}</text>
        </g>
      )))}
      <rect x={bl} y={cy - 8} width={8} height={16} rx={3} fill={col} />
      <rect x={br - 8} y={cy - 8} width={8} height={16} rx={3} fill={col} />
    </svg>
  )
}

export default function PlateCalc({ darkMode }: { darkMode: boolean }) {
  const [input, setInput] = useState('')
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')
  const plates = unit === 'lb' ? PLATES_LB : PLATES_KG
  const barWeight = unit === 'lb' ? BAR_LB : BAR_KG
  const numValue = parseFloat(input)
  const hasValue = input !== '' && !isNaN(numValue)
  const result = hasValue ? calcPlates(numValue, barWeight, plates) : null
  const expanded = result ? expandPlates(result) : []
  const s = sub(darkMode)

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-1">槓片計算</h1>
      <p className={`text-xs ${s} mb-5`}>計算每邊需要的槓片</p>

      <div className="w-full max-w-sm rounded-3xl p-5" style={glassStyle(darkMode)}>
        <div className="flex justify-center gap-1.5 mb-4">
          {(['lb', 'kg'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className="px-5 py-2 rounded-full text-sm font-semibold uppercase cursor-pointer transition-transform active:scale-95"
              style={toggleStyle(darkMode, unit === u)}>{u}</button>
          ))}
        </div>

        <div className="relative mb-4 rounded-2xl overflow-hidden" style={inputGlass(darkMode)}>
          <input type="number" inputMode="decimal" value={input} onChange={e => setInput(e.target.value)}
            placeholder={`目標重量（含槓 ${barWeight}${unit}）`}
            className={`w-full text-2xl font-light text-center rounded-2xl py-3 px-4 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${darkMode ? 'text-white placeholder:text-white/20' : 'text-zinc-900 placeholder:text-zinc-300'}`} />
        </div>

        {result && result.length > 0 && (
          <div className="rounded-2xl p-3 mb-3" style={cellStyle(darkMode)}>
            <BarbellDiagram plates={expanded} unit={unit} darkMode={darkMode} />
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {result.map(r => (
                <div key={r.plate} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLATE_COLORS[r.plate] || '#6b7280' }} />
                  <span className={`text-xs font-medium ${s}`}>{r.plate}{unit} x{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl p-4" style={cellStyle(darkMode)}>
          {!hasValue && <p className={`text-center text-sm ${s}`}>請輸入目標重量</p>}
          {hasValue && numValue < barWeight && <p className="text-center text-sm text-red-400">必須 ≥ 槓重 ({barWeight} {unit})</p>}
          {hasValue && numValue >= barWeight && result === null && <p className="text-center text-sm text-red-400">無法用現有槓片精確組合</p>}
          {result && result.length === 0 && <p className={`text-center text-sm ${s}`}>只需要空槓</p>}
          {result && result.length > 0 && (
            <div className="space-y-2">
              <p className={`text-xs text-center ${s} mb-3`}>每邊：</p>
              {result.map(r => (
                <div key={r.plate} className="flex items-center justify-between rounded-xl px-4 py-2.5" style={cellStyle(darkMode)}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLATE_COLORS[r.plate] || '#6b7280' }} />
                    <span className="text-lg font-medium">{r.plate} {unit}</span>
                  </div>
                  <span className={`text-lg font-medium ${s}`}>x {r.count}</span>
                </div>
              ))}
              <p className={`text-xs text-center ${s} mt-3`}>槓：{barWeight} {unit} + 槓片：{numValue - barWeight} {unit} = {numValue} {unit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
