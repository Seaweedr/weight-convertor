import { useState } from 'react'
import { glass, inputStyle, sub, chipStyle, cellStyle, toggleStyle } from '../styles'

const PLATES_LB = [45, 25, 10, 5, 2.5]
const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25]
const BAR_LB = 45
const BAR_KG = 20

const PLATE_STYLE_LB: Record<number, { h: number; color: string; label: string }> = {
  45:  { h: 100, color: '#3b82f6', label: '45' },
  25:  { h: 82, color: '#22c55e', label: '25' },
  10:  { h: 64, color: '#eab308', label: '10' },
  5:   { h: 50, color: '#f97316', label: '5' },
  2.5: { h: 38, color: '#a855f7', label: '2.5' },
}
const PLATE_STYLE_KG: Record<number, { h: number; color: string; label: string }> = {
  25:   { h: 100, color: '#ef4444', label: '25' },
  20:   { h: 92, color: '#3b82f6', label: '20' },
  15:   { h: 78, color: '#eab308', label: '15' },
  10:   { h: 64, color: '#22c55e', label: '10' },
  5:    { h: 52, color: '#f97316', label: '5' },
  2.5:  { h: 42, color: '#a855f7', label: '2.5' },
  1.25: { h: 34, color: '#6b7280', label: '1.25' },
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
  const expanded: number[] = []
  for (const r of result) {
    for (let i = 0; i < r.count; i++) expanded.push(r.plate)
  }
  return expanded
}

function BarbellDiagram({ plates, unit, darkMode }: { plates: number[]; unit: 'lb' | 'kg'; darkMode: boolean }) {
  const styles = unit === 'lb' ? PLATE_STYLE_LB : PLATE_STYLE_KG
  const plateWidth = 22
  const gap = 4
  const barHeight = 14
  const maxH = 120
  const centerX = 200
  const centerY = maxH / 2 + 10

  const sidePlates = plates.map((p, i) => {
    const style = styles[p] || { h: 30, color: '#6b7280', label: String(p) }
    const x = gap + i * (plateWidth + gap)
    return { ...style, x, plate: p, key: i }
  })

  const sideWidth = sidePlates.length > 0
    ? sidePlates[sidePlates.length - 1].x + plateWidth + gap
    : 10

  const totalW = centerX + sideWidth + 20
  const barEndLeft = centerX - sideWidth - 30
  const barEndRight = centerX + sideWidth + 30
  const barColor = darkMode ? '#52525b' : '#a1a1aa'
  const collarColor = darkMode ? '#71717a' : '#d4d4d8'

  return (
    <svg viewBox={`0 0 ${Math.max(totalW + 40, 400)} ${maxH + 20}`} className="w-full">
      <rect x={barEndLeft} y={centerY - barHeight / 2} width={barEndRight - barEndLeft} height={barHeight} rx={3} fill={barColor} />
      <rect x={centerX - sideWidth - 10} y={centerY - 18} width={10} height={36} rx={3} fill={collarColor} />
      <rect x={centerX + sideWidth} y={centerY - 18} width={10} height={36} rx={3} fill={collarColor} />

      {sidePlates.map(p => {
        const px = centerX - p.x - plateWidth
        return (
          <g key={`l-${p.key}`}>
            <rect x={px} y={centerY - p.h / 2} width={plateWidth} height={p.h} rx={4} fill={p.color} opacity={0.8} />
            <text x={px + plateWidth / 2} y={centerY} textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize={p.plate < 5 ? 9 : 11} fontWeight="bold">{p.label}</text>
          </g>
        )
      })}

      {sidePlates.map(p => {
        const px = centerX + p.x
        return (
          <g key={`r-${p.key}`}>
            <rect x={px} y={centerY - p.h / 2} width={plateWidth} height={p.h} rx={4} fill={p.color} opacity={0.8} />
            <text x={px + plateWidth / 2} y={centerY} textAnchor="middle" dominantBaseline="central"
              fill="white" fontSize={p.plate < 5 ? 9 : 11} fontWeight="bold">{p.label}</text>
          </g>
        )
      })}

      <rect x={barEndLeft} y={centerY - 8} width={8} height={16} rx={3} fill={collarColor} />
      <rect x={barEndRight - 8} y={centerY - 8} width={8} height={16} rx={3} fill={collarColor} />
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

      <div className={`w-full max-w-sm rounded-3xl p-5 ${glass(darkMode)}`}>
        {/* Unit Toggle */}
        <div className="flex justify-center gap-1.5 mb-4">
          {(['lb', 'kg'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold uppercase transition-all cursor-pointer ${toggleStyle(darkMode, unit === u)}`}>
              {u}
            </button>
          ))}
        </div>

        <div className="relative mb-4">
          <input type="number" inputMode="decimal" value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`目標重量（含槓 ${barWeight}${unit}）`}
            className={`w-full text-2xl font-semibold text-center rounded-2xl py-3 px-4 outline-none transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inputStyle(darkMode)}`}
          />
        </div>

        {/* Barbell Diagram */}
        {result && result.length > 0 && (
          <div className={`rounded-2xl p-3 mb-3 ${cellStyle(darkMode)}`}>
            <BarbellDiagram plates={expanded} unit={unit} darkMode={darkMode} />
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {result.map(r => {
                const style = (unit === 'lb' ? PLATE_STYLE_LB : PLATE_STYLE_KG)[r.plate]
                return (
                  <div key={r.plate} className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: style?.color ?? '#6b7280' }} />
                    <span className={`text-xs font-medium ${s}`}>{r.plate}{unit} x{r.count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Result List */}
        <div className={`rounded-2xl p-4 ${cellStyle(darkMode)}`}>
          {!hasValue && <p className={`text-center text-sm ${s}`}>請輸入目標重量</p>}
          {hasValue && numValue < barWeight && <p className="text-center text-sm text-red-400">必須 ≥ 槓重 ({barWeight} {unit})</p>}
          {hasValue && numValue >= barWeight && result === null && <p className="text-center text-sm text-red-400">無法用現有槓片精確組合</p>}
          {result && result.length === 0 && <p className={`text-center text-sm ${s}`}>只需要空槓</p>}
          {result && result.length > 0 && (
            <div className="space-y-2">
              <p className={`text-xs text-center ${s} mb-3`}>每邊：</p>
              {result.map(r => (
                <div key={r.plate} className={`flex items-center justify-between ${cellStyle(darkMode)} rounded-2xl px-4 py-2.5`}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: (unit === 'lb' ? PLATE_STYLE_LB : PLATE_STYLE_KG)[r.plate]?.color ?? '#6b7280' }} />
                    <span className="text-lg font-semibold">{r.plate} {unit}</span>
                  </div>
                  <span className={`text-lg font-semibold ${s}`}>x {r.count}</span>
                </div>
              ))}
              <p className={`text-xs text-center ${s} mt-3`}>
                槓：{barWeight} {unit} + 槓片：{numValue - barWeight} {unit} = {numValue} {unit}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
