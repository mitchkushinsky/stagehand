import UserDot from './UserDot'

// Shows up to `max` dots. If attendees.length > max, shows first (max-1) dots + a "+N" pill.
// Pass onDotTap + currentUserId to make the current user's dot tappable (without triggering card click).
export default function DotRow({ attendees, profiles, size = 26, max = 4, currentUserId, onDotTap }) {
  if (!attendees.length) return null

  const overflow = attendees.length > max
  const visible = overflow ? attendees.slice(0, max - 1) : attendees
  const extra = overflow ? attendees.length - (max - 1) : 0
  const overlap = Math.round(size * 0.25)

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {visible.map((row, idx) => {
        const isOwn = currentUserId && onDotTap && row.user_id === currentUserId
        return (
        <div
          key={row.user_id}
          style={{ marginLeft: idx > 0 ? -overlap : 0, lineHeight: 0 }}
          onClick={isOwn ? (e) => { e.stopPropagation(); onDotTap(row) } : undefined}
        >
          <UserDot
            userId={row.user_id}
            displayName={profiles[row.user_id]?.display_name}
            size={size}
          />
        </div>
        )
      })}
      {extra > 0 && (
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#1e2a40',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.round(size * 0.37),
          fontWeight: 700,
          color: '#8892a4',
          marginLeft: -overlap,
          flexShrink: 0,
        }}>
          +{extra}
        </div>
      )}
    </div>
  )
}
