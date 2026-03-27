import type { CSSProperties } from 'react'

// iOS 26 Liquid Glass Design System
// Material: ultra-thin translucent glass, frosted blur, subtle refraction
// Lighting: top-left directional, specular highlights, inner glow
// Depth: multi-layered, floating cards, soft shadows

export function glassCard(dark: boolean): CSSProperties {
  return {
    background: dark
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(40px) saturate(1.6)',
    WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
    border: dark
      ? '0.5px solid rgba(255,255,255,0.08)'
      : '0.5px solid rgba(255,255,255,0.65)',
    borderRadius: 24,
    boxShadow: dark
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.06), inset 0 -0.5px 0 rgba(255,255,255,0.02), 0 12px 40px -12px rgba(0,0,0,0.5)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.9), inset 0 -0.5px 0 rgba(0,0,0,0.02), 0 12px 40px -12px rgba(0,0,0,0.08)',
  }
}

export function glassInput(dark: boolean): CSSProperties {
  return {
    background: dark
      ? 'rgba(255,255,255,0.035)'
      : 'rgba(255,255,255,0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: dark
      ? '0.5px solid rgba(255,255,255,0.06)'
      : '0.5px solid rgba(255,255,255,0.5)',
    borderRadius: 16,
    boxShadow: dark
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.04)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.7)',
  }
}

export function glassCell(dark: boolean): CSSProperties {
  return {
    background: dark
      ? 'rgba(255,255,255,0.025)'
      : 'rgba(255,255,255,0.25)',
    border: dark
      ? '0.5px solid rgba(255,255,255,0.04)'
      : '0.5px solid rgba(255,255,255,0.4)',
    borderRadius: 14,
    boxShadow: dark
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.03)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.5)',
  }
}

export function glassChip(dark: boolean, active: boolean): CSSProperties {
  if (active) return {
    background: dark
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(255,255,255,0.65)',
    border: dark
      ? '0.5px solid rgba(255,255,255,0.18)'
      : '0.5px solid rgba(255,255,255,0.8)',
    borderRadius: 14,
    color: dark ? '#fff' : '#1c1c1e',
    boxShadow: dark
      ? 'inset 0 0.5px 0 rgba(255,255,255,0.12), 0 4px 12px -4px rgba(0,0,0,0.3)'
      : 'inset 0 0.5px 0 rgba(255,255,255,0.9), 0 4px 12px -4px rgba(0,0,0,0.06)',
  }
  return {
    background: dark
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(255,255,255,0.2)',
    border: dark
      ? '0.5px solid rgba(255,255,255,0.05)'
      : '0.5px solid rgba(255,255,255,0.35)',
    borderRadius: 14,
    color: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)',
  }
}

export function accentBtn(): CSSProperties {
  return {
    background: 'linear-gradient(135deg, rgba(90,140,255,0.85) 0%, rgba(60,110,245,0.9) 100%)',
    color: '#fff',
    borderRadius: 20,
    border: '0.5px solid rgba(120,160,255,0.4)',
    boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.2), 0 6px 20px -6px rgba(60,110,245,0.45)',
  }
}

export function toggleBtn(dark: boolean, active: boolean): CSSProperties {
  if (active) return {
    background: 'linear-gradient(135deg, rgba(90,140,255,0.85) 0%, rgba(60,110,245,0.9) 100%)',
    color: '#fff',
    borderRadius: 20,
    border: '0.5px solid rgba(120,160,255,0.35)',
    boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.15), 0 4px 12px -4px rgba(60,110,245,0.35)',
  }
  return glassChip(dark, false)
}

export function sub(dark: boolean) {
  return dark ? 'text-white/35' : 'text-black/35'
}
