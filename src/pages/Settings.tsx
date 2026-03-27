import { glassStyle, sub, cellStyle } from '../styles'

export default function Settings({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const s = sub(darkMode)

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-5">設定</h1>

      <div className="w-full max-w-sm rounded-3xl p-5 space-y-3" style={glassStyle(darkMode)}>
        <div className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={cellStyle(darkMode)}>
          <span className="font-medium text-sm">深色模式</span>
          <button onClick={() => setDarkMode(!darkMode)}
            className="relative w-[51px] h-[31px] rounded-full cursor-pointer transition-colors"
            style={{ background: darkMode ? 'rgba(0,122,255,0.85)' : 'rgba(120,120,128,0.32)' }}>
            <span className="absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-md transition-transform"
              style={{ transform: darkMode ? 'translateX(20px)' : 'translateX(0)' }} />
          </button>
        </div>

        <div className="rounded-2xl px-4 py-4" style={cellStyle(darkMode)}>
          <p className="font-medium text-sm mb-3">功能一覽</p>
          <div className={`text-sm ${s} space-y-3`}>
            {['重量單位換算（磅 ⇄ 公斤）', '槓片計算（每邊配重）', '1RM 最大重量估算', 'RPE / 百分比對照表', '組間休息計時器'].map(t => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-current" /> {t}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload() }}
          className="w-full py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-400/10 cursor-pointer transition-colors">
          清除所有資料
        </button>
      </div>

      <p className={`mt-6 text-xs ${s}`}>重訓換算工具 v1.0</p>
    </div>
  )
}
