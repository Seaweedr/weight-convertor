import { useState } from 'react'
import { glassStyle, inputGlass, sub, cellStyle, toggleStyle } from '../styles'

function calcEpley(w: number, r: number) { return r === 1 ? w : w * (1 + r / 30) }
function calcBrzycki(w: number, r: number) { return r === 1 ? w : w * (36 / (37 - r)) }

const PCTS = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50]
const RPE_TABLE = [
  { rpe: 10, r: { 1: 100, 2: 95.5, 3: 92.2, 4: 89.2, 5: 86.3, 6: 83.7, 8: 79.3, 10: 75.2 } },
  { rpe: 9.5, r: { 1: 97.8, 2: 93.9, 3: 90.7, 4: 87.8, 5: 85, 6: 82.4, 8: 78.1, 10: 74.1 } },
  { rpe: 9, r: { 1: 95.5, 2: 92.2, 3: 89.2, 4: 86.3, 5: 83.7, 6: 81.1, 8: 76.9, 10: 73 } },
  { rpe: 8.5, r: { 1: 93.9, 2: 90.7, 3: 87.8, 4: 85, 5: 82.4, 6: 79.9, 8: 75.8, 10: 72 } },
  { rpe: 8, r: { 1: 92.2, 2: 89.2, 3: 86.3, 4: 83.7, 5: 81.1, 6: 78.6, 8: 74.5, 10: 70.7 } },
  { rpe: 7.5, r: { 1: 90.7, 2: 87.8, 3: 85, 4: 82.4, 5: 79.9, 6: 77.4, 8: 73.3, 10: 69.4 } },
  { rpe: 7, r: { 1: 89.2, 2: 86.3, 3: 83.7, 4: 81.1, 5: 78.6, 6: 76.2, 8: 72.3, 10: 68.2 } },
] as const
const RPE_REPS = [1, 2, 3, 4, 5, 6, 8, 10] as const

export default function OneRepMax({ darkMode }: { darkMode: boolean }) {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')
  const [showRpe, setShowRpe] = useState(false)

  const w = parseFloat(weight), r = parseInt(reps)
  const ok = !isNaN(w) && !isNaN(r) && w > 0 && r >= 1 && r <= 36
  const epley = ok ? calcEpley(w, r) : null
  const brzycki = ok ? calcBrzycki(w, r) : null
  const avg = epley && brzycki ? (epley + brzycki) / 2 : null
  const s = sub(darkMode)
  const ic = darkMode ? 'text-white placeholder:text-white/20' : 'text-zinc-900 placeholder:text-zinc-300'

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-1">1RM 估算</h1>
      <p className={`text-xs ${s} mb-5`}>預估最大重量</p>

      <div className="w-full max-w-sm rounded-3xl p-5" style={glassStyle(darkMode)}>
        <div className="flex justify-center gap-1.5 mb-4">
          {(['lb', 'kg'] as const).map(u => (
            <button key={u} onClick={() => setUnit(u)}
              className="px-5 py-2 rounded-full text-sm font-semibold uppercase cursor-pointer transition-transform active:scale-95"
              style={toggleStyle(darkMode, unit === u)}>{u}</button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="col-span-3 rounded-2xl overflow-hidden" style={inputGlass(darkMode)}>
            <input type="number" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="重量" className={`w-full text-xl font-light text-center py-3 px-2 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${ic}`} />
          </div>
          <div className="col-span-2 rounded-2xl overflow-hidden" style={inputGlass(darkMode)}>
            <input type="number" inputMode="numeric" value={reps} onChange={e => setReps(e.target.value)}
              placeholder="次數" className={`w-full text-xl font-light text-center py-3 px-2 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${ic}`} />
          </div>
        </div>

        {avg && (
          <div className="rounded-2xl p-4 text-center mb-4" style={cellStyle(darkMode)}>
            <p className={`text-xs ${s} mb-1`}>預估 1RM</p>
            <p className="text-4xl font-light">{Math.round(avg)} <span className={`text-lg ${s}`}>{unit}</span></p>
            <p className={`text-xs ${s} mt-1`}>Epley: {Math.round(epley!)} {unit} ・ Brzycki: {Math.round(brzycki!)} {unit}</p>
          </div>
        )}

        <div className="flex justify-center gap-1.5 mb-3">
          <button onClick={() => setShowRpe(false)} className="px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-transform active:scale-95" style={toggleStyle(darkMode, !showRpe)}>百分比表</button>
          <button onClick={() => setShowRpe(true)} className="px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-transform active:scale-95" style={toggleStyle(darkMode, showRpe)}>RPE 對照</button>
        </div>

        {!showRpe && avg && (
          <div className="space-y-1.5">
            {PCTS.map(pct => (
              <div key={pct} className="flex justify-between items-center rounded-xl px-4 py-2" style={cellStyle(darkMode)}>
                <span className={`text-sm font-medium ${s}`}>{pct}%</span>
                <span className="text-lg font-medium">{Math.round(avg * pct / 100)} <span className={`text-xs font-normal ${s}`}>{unit}</span></span>
              </div>
            ))}
          </div>
        )}

        {!showRpe && !avg && <p className={`text-center text-sm py-4 ${s}`}>輸入重量和次數查看對照表</p>}

        {showRpe && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr>
                <th className={`py-1.5 px-1 text-left ${s}`}>RPE</th>
                {RPE_REPS.map(r => <th key={r} className={`py-1.5 px-1 text-center ${s}`}>{r}次</th>)}
              </tr></thead>
              <tbody>{RPE_TABLE.map(row => (
                <tr key={row.rpe}>
                  <td className="py-1.5 px-1 font-semibold">{row.rpe}</td>
                  {RPE_REPS.map(rep => (
                    <td key={rep} className={`py-1.5 px-1 text-center ${s}`}>
                      {avg ? Math.round(avg * ((row.r as Record<number, number>)[rep] ?? 0) / 100) : `${(row.r as Record<number, number>)[rep]}%`}
                    </td>
                  ))}
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
