import { useMemo, useState } from 'react'
import UserDot from '../components/UserDot'
import StatusBottomSheet from '../components/StatusBottomSheet'
import { schedule, isSetActive, isSetUpcoming } from '../data/schedule'

const STATUS_ORDER = { here: 0, going: 1, break: 2, none: 3 }

export default function CrewScreen({ myPresence, presenceMap, profiles, onSetStatus, onSetBreak, onClear, currentUserId }) {
  const [sheet, setSheet] = useState(null)

  const crewList = useMemo(() => {
    const allUsers = Object.keys(profiles)
    return allUsers
      .map(userId => {
        const presence = presenceMap[userId] || null
        const profile = profiles[userId]
        const statusKey = presence ? presence.status : 'none'
        return { userId, profile, presence, statusKey }
      })
      .sort((a, b) => (STATUS_ORDER[a.statusKey] ?? 3) - (STATUS_ORDER[b.statusKey] ?? 3))
  }, [profiles, presenceMap])

  function handleCardTap(userId, presence) {
    if (userId !== currentUserId) return
    if (!presence || presence.status === 'break' || !presence.artist) return

    // Find the set in schedule
    const daySchedule = schedule[presence.day] || []
    for (const stageObj of daySchedule) {
      if (stageObj.stage !== presence.stage) continue
      for (const set of stageObj.sets) {
        if (set.artist === presence.artist) {
          setSheet({ set: { ...set, stage: stageObj.stage }, day: presence.day })
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
        {crewList.map(({ userId, profile, presence, statusKey }) => (
          <CrewCard
            key={userId}
            userId={userId}
            profile={profile}
            presence={presence}
            statusKey={statusKey}
            isMe={userId === currentUserId}
            onTap={() => handleCardTap(userId, presence)}
          />
        ))}
      </div>

      {sheet && (
        <StatusBottomSheet
          set={sheet.set}
          day={sheet.day}
          myPresence={myPresence}
          onSetStatus={({ status }) => onSetStatus({ ...sheet.set, day: sheet.day, status })}
          onSetBreak={onSetBreak}
          onClear={onClear}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}

function CrewCard({ userId, profile, presence, statusKey, isMe, onTap }) {
  const noStatus = statusKey === 'none'
  const isBreak = statusKey === 'break'

  const statusDot = {
    here: { color: '#22c55e', label: 'Here' },
    going: { color: '#3b82f6', label: 'Going' },
    break: { color: '#f59e0b', label: 'Break' },
    none: { color: '#374151', label: '' },
  }[statusKey]

  return (
    <div
      onClick={onTap}
      style={{
        background: '#16213e',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: noStatus ? 0.6 : 1,
        cursor: isMe && presence ? 'pointer' : 'default',
        borderLeft: `3px solid ${statusDot.color}`,
      }}
    >
      <UserDot userId={userId} displayName={profile?.display_name} size={36} />

      <div style={{ flex: 1, minWidth: 0 }}>
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

        {statusKey === 'here' && presence && (
          <div>
            <div style={{ fontSize: 13, color: '#d1d5db', marginTop: 1 }}>{presence.artist}</div>
            <div style={{ fontSize: 12, color: '#8892a4', marginTop: 1 }}>
              {presence.stage} · until {presence.end_time}
            </div>
          </div>
        )}

        {statusKey === 'going' && presence && (
          <div>
            <div style={{ fontSize: 13, color: '#d1d5db', marginTop: 1 }}>{presence.artist}</div>
            <div style={{ fontSize: 12, color: '#8892a4', marginTop: 1 }}>
              {presence.stage} · starts {presence.start_time}
            </div>
          </div>
        )}

        {statusKey === 'break' && (
          <div style={{ fontSize: 13, color: '#f59e0b', marginTop: 1 }}>
            {presence?.break_note ? `"${presence.break_note}"` : 'On break'}
          </div>
        )}

        {statusKey === 'none' && (
          <div style={{ fontSize: 13, color: '#8892a4', marginTop: 1 }}>No status set</div>
        )}
      </div>

      {statusDot.label && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          color: statusDot.color,
          fontWeight: 600,
          flexShrink: 0,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusDot.color }} />
          {statusDot.label}
        </div>
      )}
    </div>
  )
}
