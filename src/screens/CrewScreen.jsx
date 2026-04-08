import { useMemo, useState } from 'react'
import UserDot from '../components/UserDot'
import StatusBottomSheet from '../components/StatusBottomSheet'
import { schedule } from '../data/schedule'

const REACTIONS = [
  { emoji: '🕺', label: 'Dancing' },
  { emoji: '🎵', label: 'Vibing' },
  { emoji: '❤️', label: 'Loving it' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '📍', label: 'Up front' },
]

// Sort priority based on primary (here) slot
function primarySortKey(userPresence) {
  if (!userPresence) return 3
  const status = userPresence.here?.status
  if (status === 'here') return 0
  if (status === 'break') return 1
  if (userPresence.going) return 2
  return 3
}

export default function CrewScreen({ myPresence, presenceMap, profiles, onSetStatus, onClear, currentUserId }) {
  const [sheet, setSheet] = useState(null)

  const crewList = useMemo(() => {
    return Object.keys(profiles)
      .map(userId => ({
        userId,
        profile: profiles[userId],
        userPresence: presenceMap[userId] || null,
      }))
      .sort((a, b) => primarySortKey(a.userPresence) - primarySortKey(b.userPresence))
  }, [profiles, presenceMap])

  function handleCardTap(userId, userPresence) {
    if (userId !== currentUserId) return
    const hereRow = userPresence?.here
    if (!hereRow || hereRow.status === 'break' || !hereRow.artist) return

    const daySchedule = schedule[hereRow.day] || []
    for (const stageObj of daySchedule) {
      if (stageObj.stage !== hereRow.stage) continue
      for (const set of stageObj.sets) {
        if (set.artist === hereRow.artist) {
          setSheet({ set: { ...set, stage: stageObj.stage }, day: hereRow.day })
          return
        }
      }
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#eaeaea' }}>Crew</div>
        <div style={{ fontSize: 13, color: '#8892a4', marginTop: 2 }}>
          {Object.keys(profiles).length} people · real-time
        </div>
      </div>

      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {crewList.map(({ userId, profile, userPresence }) => (
          <CrewCard
            key={userId}
            userId={userId}
            profile={profile}
            userPresence={userPresence}
            isMe={userId === currentUserId}
            onTap={() => handleCardTap(userId, userPresence)}
          />
        ))}
      </div>

      {sheet && (
        <StatusBottomSheet
          set={sheet.set}
          day={sheet.day}
          myPresence={myPresence}
          onSetStatus={({ status }) => onSetStatus({ ...sheet.set, day: sheet.day, status })}
          onClear={onClear}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}

function CrewCard({ userId, profile, userPresence, isMe, onTap }) {
  const hereRow = userPresence?.here || null
  const goingRow = userPresence?.going || null
  const hasAny = hereRow || goingRow

  // Border color driven by the 'here' slot
  const borderColor = !hereRow ? (goingRow ? '#3b82f6' : '#374151')
    : hereRow.status === 'here' ? '#22c55e'
    : '#f59e0b' // break

  return (
    <div
      onClick={onTap}
      style={{
        background: '#16213e',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        opacity: hasAny ? 1 : 0.6,
        cursor: isMe && hereRow && hereRow.status !== 'break' ? 'pointer' : 'default',
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <UserDot userId={userId} displayName={profile?.display_name} size={36} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#eaeaea' }}>
            {profile?.display_name || 'Unknown'}
          </span>
          {isMe && (
            <span style={{ fontSize: 11, color: '#8892a4', background: '#ffffff10', padding: '1px 6px', borderRadius: 4 }}>
              you
            </span>
          )}
        </div>

        {/* Here / Break status */}
        {hereRow?.status === 'here' && (
          <div style={{ marginTop: 3 }}>
            <div style={{ fontSize: 13, color: '#d1d5db' }}>{hereRow.artist}</div>
            <div style={{ fontSize: 12, color: '#8892a4', marginTop: 1 }}>
              {hereRow.stage} · until {hereRow.end_time}
            </div>
            {(hereRow.here_reaction || hereRow.here_note) && (
              <div style={{ marginTop: 4 }}>
                {hereRow.here_reaction && (() => {
                  const r = REACTIONS.find(r => r.emoji === hereRow.here_reaction)
                  return (
                    <div style={{ fontSize: 12, color: '#d1d5db' }}>
                      {hereRow.here_reaction} {r?.label || ''}
                    </div>
                  )
                })()}
                {hereRow.here_note && (
                  <div style={{ fontSize: 12, color: '#8892a4', fontStyle: 'italic', marginTop: hereRow.here_reaction ? 2 : 0 }}>
                    {hereRow.here_note}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {hereRow?.status === 'break' && (
          <div style={{ fontSize: 13, color: '#f59e0b', marginTop: 3 }}>
            ☕ {hereRow.break_note ? `"${hereRow.break_note}"` : 'On break'}
          </div>
        )}

        {/* Going status — shown below here/break if both exist */}
        {goingRow && (
          <div style={{
            marginTop: hereRow ? 6 : 3,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: 12, color: '#60a5fa' }}>Going to </span>
              <span style={{ fontSize: 12, color: '#93c5fd', fontWeight: 600 }}>{goingRow.artist}</span>
              <span style={{ fontSize: 12, color: '#60a5fa' }}> · {goingRow.start_time}</span>
            </div>
          </div>
        )}

        {/* No status at all */}
        {!hereRow && !goingRow && (
          <div style={{ fontSize: 13, color: '#8892a4', marginTop: 3 }}>No status set</div>
        )}
      </div>

      {/* Status badge — only show the primary one */}
      {hasAny && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          {hereRow && (
            <StatusBadge
              color={hereRow.status === 'here' ? '#22c55e' : '#f59e0b'}
              label={hereRow.status === 'here' ? 'Here' : 'Break'}
            />
          )}
          {goingRow && !hereRow && (
            <StatusBadge color="#3b82f6" label="Going" />
          )}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ color, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color,
      fontWeight: 600,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
      {label}
    </div>
  )
}
