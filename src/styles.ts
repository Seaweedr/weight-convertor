// iOS 26 Liquid Glass Design System

export function glass(darkMode: boolean) {
  return darkMode
    ? 'backdrop-blur-2xl border border-white/[0.1]'
    : 'backdrop-blur-2xl border border-white/70'
}

export function glassStyle(darkMode: boolean) {
  return {
    background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(40px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
    border: darkMode ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid rgba(255,255,255,0.7)',
    boxShadow: darkMode
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.08), 0 8px 32px -8px rgba(0,0,0,0.4)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 8px 32px -8px rgba(0,0,0,0.08)',
  } as React.CSSProperties
}

export function inputGlass(darkMode: boolean) {
  return {
    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: darkMode ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(0,0,0,0.06)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  } as React.CSSProperties
}

export function sub(darkMode: boolean) {
  return darkMode ? 'text-white/40' : 'text-zinc-400'
}

export function chipStyle(darkMode: boolean, active: boolean) {
  if (active) return {
    background: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
    color: darkMode ? '#fff' : '#1c1c1e',
    border: darkMode ? '0.5px solid rgba(255,255,255,0.2)' : '0.5px solid rgba(255,255,255,0.8)',
    boxShadow: darkMode
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.2)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,0,0,0.06)',
  } as React.CSSProperties
  return {
    background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
    border: darkMode ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
  } as React.CSSProperties
}

export function accentBtn(_darkMode: boolean) {
  return {
    background: 'rgba(0,122,255,0.85)',
    color: '#fff',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '0.5px solid rgba(0,122,255,0.5)',
    boxShadow: '0 4px 16px -4px rgba(0,122,255,0.4)',
  } as React.CSSProperties
}

export function toggleStyle(darkMode: boolean, active: boolean) {
  if (active) return {
    background: 'rgba(0,122,255,0.85)',
    color: '#fff',
    border: '0.5px solid rgba(0,122,255,0.5)',
    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
  } as React.CSSProperties
  return chipStyle(darkMode, false)
}

export function cellStyle(darkMode: boolean) {
  return {
    background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    border: darkMode ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(0,0,0,0.04)',
  } as React.CSSProperties
}
