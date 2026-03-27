import { glass, sub, cellStyle } from '../styles'

export default function Settings({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (v: boolean) => void }) {
  const s = sub(darkMode)

  function clearAllData() {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center px-5 py-8">
      <h1 className="text-xl font-semibold tracking-tight mb-5">設定</h1>

      <div className={`w-full max-w-sm rounded-3xl p-5 space-y-3 ${glass(darkMode)}`}>
        {/* Dark Mode */}
        <div className={`flex items-center justify-between ${cellStyle(darkMode)} rounded-2xl px-4 py-3.5`}>
          <span className="font-medium text-sm">深色模式</span>
          <button onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
              darkMode ? 'bg-blue-500' : 'bg-zinc-300'
            }`}>
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow transition-transform ${
                darkMode ? 'bg-zinc-900' : 'bg-white'
              }`}
              style={{ transform: darkMode ? 'translateX(20px)' : 'translateX(0)' }}
            />
          </button>
        </div>

        {/* Info */}
        <div className={`${cellStyle(darkMode)} rounded-2xl px-4 py-4`}>
          <p className="font-medium text-sm mb-3">功能一覽</p>
          <ul className={`text-sm ${s} space-y-3`}>
            <li className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-current inline-block" /> 重量單位換算（磅 ⇄ 公斤）
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-current inline-block" /> 槓片計算（每邊配重）
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-current inline-block" /> 1RM 最大重量估算
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-current inline-block" /> RPE / 百分比對照表
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-current inline-block" /> 組間休息計時器
            </li>
          </ul>
        </div>

        {/* Clear Data */}
        <button onClick={clearAllData}
          className="w-full py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer">
          清除所有資料
        </button>
      </div>

      <p className={`mt-6 text-xs ${s}`}>重訓換算工具 v1.0</p>
    </div>
  )
}
