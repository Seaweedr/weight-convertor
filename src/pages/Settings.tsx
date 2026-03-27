import { glassCard, sub, glassCell } from '../styles'

export default function Settings({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const s = sub(darkMode)

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-lg font-normal tracking-tight mb-5" style={{ opacity: 0.85 }}>設定</h1>

      <div className="w-full max-w-sm p-5 space-y-3" style={glassCard(darkMode)}>
        <div className="flex items-center justify-between px-4 py-3.5" style={glassCell(darkMode)}>
          <span className="text-[14px] font-normal">深色模式</span>
          <button onClick={() => setDarkMode(!darkMode)}
            className="relative w-[51px] h-[31px] rounded-full cursor-pointer transition-colors duration-300"
            style={{ background: darkMode ? 'rgba(90,140,255,0.85)' : 'rgba(120,120,128,0.28)' }}>
            <span className="absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white transition-transform duration-300"
              style={{
                transform: darkMode ? 'translateX(20px)' : 'translateX(0)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }} />
          </button>
        </div>

        <div className="px-4 py-4" style={glassCell(darkMode)}>
          <p className="text-[14px] font-normal mb-3">功能一覽</p>
          <div className={`text-[13px] ${s} space-y-3`}>
            {['重量單位換算（磅 ⇄ 公斤）', '槓片計算（每邊配重）', '1RM 最大重量估算', 'RPE / 百分比對照表', '組間休息計時器'].map(t => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-current" /> {t}
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload() }}
          className="w-full py-3.5 text-[14px] font-normal text-red-400/70 hover:text-red-400 cursor-pointer transition-colors" style={{ borderRadius: 14 }}>
          清除所有資料
        </button>
      </div>

      <p className={`mt-6 text-[11px] ${s}`}>重訓換算工具 v1.0</p>
    </div>
  )
}
