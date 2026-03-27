import { useState } from 'react'
import { glassCard, glassInput, sub, glassCell, toggleBtn } from '../styles'

const PLATES_LB = [45, 25, 10, 5, 2.5]
const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25]
const BAR_LB = 45, BAR_KG = 20
const COLORS: Record<number, string> = { 45: '#5B8AF5', 25: '#E85D5D', 20: '#5B8AF5', 15: '#D4A843', 10: '#4EAE6D', 5: '#E08A3E', 2.5: '#9B6CC9', 1.25: '#7B7F87' }

function calc(target: number, bar: number, plates: number[]) {
  let rem = (target - bar) / 2
  if (rem < 0) return null
  const r: { p: number; c: number }[] = []
  for (const p of plates) { if (rem >= p) { const c = Math.floor(rem / p); r.push({ p, c }); rem -= c * p } }
  return rem > 0.01 ? null : r
}

function expand(r: { p: number; c: number }[]) { const o: number[] = []; for (const x of r) for (let i = 0; i < x.c; i++) o.push(x.p); return o }

function Barbell({ plates, darkMode }: { plates: number[]; darkMode: boolean }) {
  const pw = 22, gap = 4, bh = 14, mh = 120, cx = 200, cy = mh / 2 + 10
  const hs: Record<number, number> = { 45: 100, 25: 82, 20: 92, 15: 78, 10: 64, 5: 52, 2.5: 42, 1.25: 34 }
  const side = plates.map((p, i) => ({ p, x: gap + i * (pw + gap), h: hs[p] || 40, i }))
  const sw = side.length > 0 ? side[side.length - 1].x + pw + gap : 10
  const bl = cx - sw - 30, br = cx + sw + 30
  const bar = darkMode ? '#3a3a42' : '#b0b0b8', col = darkMode ? '#505058' : '#c8c8d0'
  return (
    <svg viewBox={`0 0 ${Math.max(br + 40, 400)} ${mh + 20}`} className="w-full">
      <rect x={bl} y={cy - bh / 2} width={br - bl} height={bh} rx={3} fill={bar} />
      <rect x={cx - sw - 10} y={cy - 18} width={10} height={36} rx={3} fill={col} />
      <rect x={cx + sw} y={cy - 18} width={10} height={36} rx={3} fill={col} />
      {side.map(s => [cx - s.x - pw, cx + s.x].map((px, j) => (
        <g key={`${j}-${s.i}`}>
          <rect x={px} y={cy - s.h / 2} width={pw} height={s.h} rx={5} fill={COLORS[s.p] || '#7B7F87'} opacity={0.75} />
          <text x={px + pw / 2} y={cy} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={s.p < 5 ? 9 : 11} fontWeight="600" opacity={0.9}>{s.p}</text>
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
  const bar = unit === 'lb' ? BAR_LB : BAR_KG
  const num = parseFloat(input)
  const ok = input !== '' && !isNaN(num)
  const result = ok ? calc(num, bar, plates) : null
  const exp = result ? expand(result) : []
  const s = sub(darkMode)

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-lg font-normal tracking-tight mb-0.5" style={{ opacity: 0.85 }}>槓片計算</h1>
      <p className={`text-[11px] ${s} mb-5`}>計算每邊需要的槓片</p>

      <div className="w-full max-w-sm p-5" style={glassCard(darkMode)}>
        <div className="flex justify-center gap-1.5 mb-4">
          {(['lb', 'kg'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className="px-5 py-2 text-[13px] font-medium uppercase cursor-pointer transition-all duration-200 active:scale-[0.97]"
              style={toggleBtn(darkMode, unit === u)}>{u}</button>
          ))}
        </div>

        <div className="mb-4" style={glassInput(darkMode)}>
          <input type="number" inputMode="decimal" value={input} onChange={e => setInput(e.target.value)}
            placeholder={`目標重量（含槓 ${bar}${unit}）`}
            className={`w-full text-xl font-extralight text-center py-3 px-4 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${darkMode ? 'text-white placeholder:text-white/15' : 'text-zinc-900 placeholder:text-zinc-300'}`} />
        </div>

        {result && result.length > 0 && (
          <div className="p-3 mb-3" style={glassCell(darkMode)}>
            <Barbell plates={exp} darkMode={darkMode} />
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {result.map(r => (
                <div key={r.p} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[r.p] || '#7B7F87' }} />
                  <span className={`text-[11px] font-medium ${s}`}>{r.p}{unit} x{r.c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4" style={glassCell(darkMode)}>
          {!ok && <p className={`text-center text-[13px] ${s}`}>請輸入目標重量</p>}
          {ok && num < bar && <p className="text-center text-[13px] text-red-400/80">必須 ≥ 槓重 ({bar} {unit})</p>}
          {ok && num >= bar && result === null && <p className="text-center text-[13px] text-red-400/80">無法用現有槓片精確組合</p>}
          {result && result.length === 0 && <p className={`text-center text-[13px] ${s}`}>只需要空槓</p>}
          {result && result.length > 0 && (
            <div className="space-y-2">
              <p className={`text-[11px] text-center ${s} mb-3`}>每邊：</p>
              {result.map(r => (
                <div key={r.p} className="flex items-center justify-between px-4 py-2.5" style={glassCell(darkMode)}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[r.p] || '#7B7F87' }} />
                    <span className="text-base font-normal">{r.p} {unit}</span>
                  </div>
                  <span className={`text-base font-normal ${s}`}>x {r.c}</span>
                </div>
              ))}
              <p className={`text-[11px] text-center ${s} mt-3`}>槓：{bar} {unit} + 槓片：{num - bar} {unit} = {num} {unit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
