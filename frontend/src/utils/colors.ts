export function getAQIColor(aqi: number): string {
  const val = Math.round(aqi)
  if (val <= 50) return '#10b981' // Good (Green)
  if (val <= 100) return '#a3e635' // Satisfactory (Lime)
  if (val <= 200) return '#facc15' // Moderate (Yellow)
  if (val <= 300) return '#f97316' // Poor (Orange)
  if (val <= 400) return '#ef4444' // Very Poor (Red)
  return '#b91c1c' // Severe / Severe+ (Dark Red)
}

export function getContrastTextColor(hexColor?: string): string {
  if (!hexColor) return '#ffffff'
  const c = hexColor.toLowerCase().trim()
  if (
    c === '#ffff00' ||
    c === '#ffd60a' ||
    c === '#9cff00' ||
    c === '#facc15' ||
    c === '#a3e635' ||
    c.includes('ffff') ||
    c.includes('9cff')
  ) {
    return '#0b132b' // Dark text inside bright yellow/lime markers
  }
  return '#ffffff'
}

export function getDisplayTextColor(hexColor?: string): string {
  if (!hexColor) return '#f8fafc'
  const c = hexColor.toLowerCase().trim()
  if (c === '#ffff00' || c === '#ffd60a' || c.includes('ffff')) {
    return '#facc15'
  }
  return hexColor
}

export function getBadgeStyle(hexColor?: string) {
  if (!hexColor) return { backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }
  const c = hexColor.toLowerCase().trim()

  if (c === '#ffff00' || c === '#ffd60a' || c === '#facc15' || c.includes('ffff') || c.includes('moderate')) {
    return {
      backgroundColor: 'rgba(250, 204, 21, 0.15)',
      color: '#facc15',
      border: '1px solid rgba(250, 204, 21, 0.4)'
    }
  }
  if (c === '#9cff00' || c === '#a3e635' || c === '#10b981' || c.includes('good') || c.includes('satisfactory')) {
    return {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      color: '#34d399',
      border: '1px solid rgba(16, 185, 129, 0.4)'
    }
  }
  if (c === '#f97316' || c.includes('poor') && !c.includes('very')) {
    return {
      backgroundColor: 'rgba(249, 115, 22, 0.15)',
      color: '#fb923c',
      border: '1px solid rgba(249, 115, 22, 0.4)'
    }
  }
  if (c === '#ef4444' || c === '#b91c1c' || c.includes('severe') || c.includes('very poor')) {
    return {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.4)'
    }
  }

  return {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: getDisplayTextColor(hexColor),
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }
}
