import { getUserColorIndex, USER_COLORS } from '../hooks/usePresence'

export default function UserDot({ userId, displayName, size = 24 }) {
  const colorIndex = getUserColorIndex(userId)
  const color = USER_COLORS[colorIndex]
  const initial = (displayName || '?')[0].toUpperCase()

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color.bg,
        color: color.text,
        fontSize: size * 0.45,
        fontWeight: 700,
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {initial}
    </span>
  )
}
