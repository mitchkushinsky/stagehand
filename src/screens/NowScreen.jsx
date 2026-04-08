import { useState, useMemo } from 'react'
import { schedule, DAYS, isSetActive, isSetUpcoming, getTodayKey } from '../data/schedule'
import UserDot from '../components/UserDot'
import StatusBottomSheet from '../components/StatusBottomSheet'

export default function NowScreen({ myPresence, presenceMap, profiles, onSetStatus, onSetBreak, onClear, currentUserId }) {
  const [sheet, setSheet] = useState(null)
  const todayKey = getTodayKey()

  // Helper: get rows for a set filtered by slot ('here' or 'going')
  function getSlotRows(stage, artist, day, slot) {
    return Object.values(presenceMap)
      .map(u => u[slot])
      .filter(r => r && r.stage === stage && r.artist === artist && r.day === day)
  }

  const { activeSets, upcomingSets } = useMemo(() => {
    const active = []
    const upcoming = []

    Object.keys(DAYS).forEach(day => {
      const daySchedule = schedule[day] || []
      daySchedule.forEach(stageObj => {
        stageObj.sets.forEach(set => {
          const setWithMeta = { ...set, stage: stageObj.stage, day }
          if (isSetActive(set, day)) active.push(setWithMeta)
          else if (isSetUpcoming(set, day)) upcoming.push(setWithMeta)
        })
      })
    })

    // Sort active by number of friends with 'here' status
    const hereCountFor = (s) => Object.values(presenceMap)
      .filter(u => u.here && u.here.stage === s.stage && u.here.artist === s.artist && u.here.day === s.day)
      .length

    active.sort((a, b) => hereCountFor(b) - hereCountFor(a))
    upcoming.sort((a, b) => a.start.localeCompare(b.start))

    return { activeSets: active, upcomingSets: upcoming }
  }, [presenceMap])

  // My status pills — can show both here and going simultaneously
  const myStatusPills = useMemo(() => {
    const pills = []
    const { here, going } = myPresence

    if (here?.status === 'break') {
      pills.push(
        <div key="break" style={pillStyle('#78350f20', '#f59e0b')}>
          <span>☕</span>
          <span>On break{here.break_note ? ` · ${here.break_note}` : ''}</span>
        </div>
      )
    } else if (here?.status === 'here') {
      pills.push(
        <div key="here" style={pillStyle('#14532d20', '#22c55e')}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>At: <strong>{here.artist}</strong></span>
        </div>
      )
    }

    if (going) {
      pills.push(
        <div key="going" style={pillStyle('#1e3a8a20', '#60a5fa')}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Going to: <strong>{going.artist}</strong></span>
        </div>
      )
    }

    return pills
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

      {myStatusPills.length > 0 && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {myStatusPills}
        </div>
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
              attendees={getSlotRows(set.stage, set.artist, set.day, 'here')}
              profiles={profiles}
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
              attendees={getSlotRows(set.stage, set.artist, set.day, 'going')}
              profiles={profiles}
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

function SetCard({ set, day, attendees, profiles, onTap, variant }) {
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
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {attendees.map((row, idx) => (
            <div key={row.user_id} style={{ marginLeft: idx > 0 ? -6 : 0 }}>
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
  }
}
