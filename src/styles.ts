// Shared iOS 26 Liquid Glass style helpers

export function glass(darkMode: boolean) {
  return darkMode
    ? 'bg-white/[0.07] backdrop-blur-2xl border border-white/[0.12] shadow-lg shadow-black/20'
    : 'bg-white/60 backdrop-blur-2xl border border-white/80 shadow-lg shadow-black/5'
}

export function inputStyle(darkMode: boolean) {
  return darkMode
    ? 'bg-white/[0.06] text-white placeholder:text-white/25 focus:ring-2 focus:ring-white/20'
    : 'bg-black/[0.04] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-black/10'
}

export function sub(darkMode: boolean) {
  return darkMode ? 'text-white/40' : 'text-zinc-400'
}

export function chipStyle(darkMode: boolean, active: boolean) {
  if (active) return 'bg-white text-zinc-900 shadow-md shadow-black/10'
  return darkMode
    ? 'bg-white/[0.08] text-white/60 hover:bg-white/[0.14]'
    : 'bg-black/[0.05] text-zinc-500 hover:bg-black/[0.08]'
}

export function cellStyle(darkMode: boolean) {
  return darkMode
    ? 'bg-white/[0.05]'
    : 'bg-black/[0.03]'
}
