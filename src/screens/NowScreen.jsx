import { useState, useMemo } from 'react'
import { schedule, DAYS, isSetActive, isSetUpcoming, getTodayKey } from '../data/schedule'
import UserDot from '../components/UserDot'
import StatusBottomSheet from '../components/StatusBottomSheet'

export default function NowScreen({ myPresence, presenceMap, profiles, onSetStatus, onSetBreak, onClear, currentUserId }) {
  const [sheet, setSheet] = useState(null) // { set, day }
  const todayKey = getTodayKey()

  // Collect all active and upcoming sets across all days
  const { activeSets, upcomingSets } = useMemo(() => {
    const active = []
    const upcoming = []
    const allDays = Object.keys(DAYS)

    allDays.forEach(day => {
      const daySchedule = schedule[day] || []
      daySchedule.forEach(stageObj => {
        stageObj.sets.forEach(set => {
          const setWithMeta = { ...set, stage: stageObj.stage, day }
          if (isSetActive(set, day)) active.push(setWithMeta)
          else if (isSetUpcoming(set, day)) upcoming.push(setWithMeta)
        })
      })
    })

    // Get presence counts for sorting
    const countFor = (s) => Object.values(presenceMap).filter(
      r => r.stage === s.stage && r.artist === s.artist && r.day === s.day
    ).length

    active.sort((a, b) => countFor(b) - countFor(a))
    upcoming.sort((a, b) => {
      const aTime = new Date(`2026-04-09T00:00:00`).getTime() // placeholder, sort by start string
      return a.start.localeCompare(b.start)
    })

    return { activeSets: active, upcomingSets: upcoming }
  }, [presenceMap])

  // My status pill
  const myStatusPill = useMemo(() => {
    if (!myPresence) return null
    if (myPresence.status === 'break') {
      return (
        <div style={pillStyle('#78350f20', '#f59e0b')}>
          <span>☕</span>
          <span>On break{myPresence.break_note ? ` · ${myPresence.break_note}` : ''}</span>
        </div>
      )
    }
    if (myPresence.status === 'here') {
      return (
        <div style={pillStyle('#14532d20', '#22c55e')}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span>At: <strong>{myPresence.artist}</strong></span>
        </div>
      )
    }
    if (myPresence.status === 'going') {
      return (
        <div style={pillStyle('#1e3a8a20', '#60a5fa')}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
          <span>Going to: <strong>{myPresence.artist}</strong></span>
        </div>
      )
    }
    return null
  }, [myPresence])

  const isEmpty = activeSets.length === 0 && upcomingSets.length === 0

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#eaeaea', letterSpacing: -0.5 }}>
          StageHand
        </div>
        <div style={{ fontSize: 13, color: '#8892a4' }}>
          {DAYS[todayKey]?.label} {DAYS[todayKey]?.date}
        </div>
      </div>

      {myStatusPill && (
        <div style={{ padding: '0 16px 12px' }}>{myStatusPill}</div>
      )}

      {isEmpty && (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#8892a4' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎷</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#eaeaea' }}>Nothing playing right now</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>Check the Schedule tab to plan ahead</div>
        </div>
      )}

      {activeSets.length > 0 && (
        <section>
          <SectionHeader label="Now Playing" />
          {activeSets.map((set, i) => (
            <SetCard
              key={`${set.day}-${set.stage}-${set.artist}-${i}`}
              set={set}
              day={set.day}
              presenceMap={presenceMap}
              profiles={profiles}
              currentUserId={currentUserId}
              onTap={() => setSheet({ set, day: set.day })}
              variant="active"
            />
          ))}
        </section>
      )}

      {upcomingSets.length > 0 && (
        <section>
          <SectionHeader label="Coming Up · next 4 hours" />
          {upcomingSets.map((set, i) => (
            <SetCard
              key={`${set.day}-${set.stage}-${set.artist}-${i}`}
              set={set}
              day={set.day}
              presenceMap={presenceMap}
              profiles={profiles}
              currentUserId={currentUserId}
              onTap={() => setSheet({ set, day: set.day })}
              variant="upcoming"
            />
          ))}
        </section>
      )}

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

function SectionHeader({ label }) {
  return (
    <div style={{
      padding: '12px 16px 6px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1.2,
      color: '#8892a4',
      textTransform: 'uppercase',
    }}>
      {label}
    </div>
  )
}

function SetCard({ set, day, presenceMap, profiles, currentUserId, onTap, variant }) {
  const attendees = Object.values(presenceMap).filter(
    r => r.stage === set.stage && r.artist === set.artist && r.day === day
  )

  const borderColor = variant === 'active' ? '#22c55e' : '#3b82f6'

  return (
    <div
      onClick={onTap}
      style={{
        margin: '0 12px 8px',
        background: '#16213e',
        borderRadius: 12,
        padding: '14px 16px',
        borderLeft: `3px solid ${borderColor}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        transition: 'background 0.1s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#eaeaea', lineHeight: 1.2, wordBreak: 'break-word' }}>
          {set.artist}
        </div>
        <div style={{ fontSize: 13, color: '#8892a4', marginTop: 3 }}>
          {set.stage} · {variant === 'active' ? `until ${set.end}` : `starts ${set.start}`}
        </div>
      </div>
      {attendees.length > 0 && (
        <div style={{ display: 'flex', gap: -4, flexShrink: 0 }}>
          {attendees.map(row => (
            <div key={row.user_id} style={{ marginLeft: attendees.indexOf(row) > 0 ? -6 : 0 }}>
              <UserDot
                userId={row.user_id}
                displayName={profiles[row.user_id]?.display_name || '?'}
                size={26}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function pillStyle(bg, color) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    background: bg,
    border: `1px solid ${color}40`,
    borderRadius: 20,
    fontSize: 13,
    color,
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }
}
