import { useState, useMemo, useRef, useEffect } from 'react'
import { schedule, DAYS, isSetActive, isSetUpcoming, getTodayKey } from '../data/schedule'
import UserDot from '../components/UserDot'
import StatusBottomSheet from '../components/StatusBottomSheet'

export default function NowScreen({ myPresence, presenceMap, profiles, onSetStatus, onSetBreak, onClear, currentUserId }) {
  const [sheet, setSheet] = useState(null)
  const [breakSheet, setBreakSheet] = useState(false)
  const todayKey = getTodayKey()

  // Helper: get rows for a set filtered by slot ('here' or 'going'), excluding break status
  function getSlotRows(stage, artist, day, slot) {
    return Object.values(presenceMap)
      .map(u => u[slot])
      .filter(r => r && r.stage === stage && r.artist === artist && r.day === day && r.status !== 'break')
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

    const hereCountFor = (s) => Object.values(presenceMap)
      .filter(u => u.here?.status === 'here' && u.here.stage === s.stage && u.here.artist === s.artist && u.here.day === s.day)
      .length

    active.sort((a, b) => hereCountFor(b) - hereCountFor(a))
    upcoming.sort((a, b) => a.start.localeCompare(b.start))

    return { activeSets: active, upcomingSets: upcoming }
  }, [presenceMap])

  // People on break
  const onBreak = useMemo(() =>
    Object.entries(presenceMap)
      .filter(([, u]) => u.here?.status === 'break')
      .map(([userId, u]) => ({ userId, row: u.here })),
    [presenceMap]
  )

  // My status pills
  const myStatusPills = useMemo(() => {
    const pills = []
    const { here, going } = myPresence

    if (here?.status === 'break') {
      pills.push(
        <div key="break" style={pillStyle('#78350f20', '#f59e0b')}>
          <span>☕</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            On break{here.break_note ? ` · ${here.break_note}` : ''}
          </span>
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

      {/* My status pills */}
      {myStatusPills.length > 0 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {myStatusPills}
        </div>
      )}

      {/* I'm on break button */}
      <div style={{ padding: '0 16px 12px' }}>
        <button
          onClick={() => setBreakSheet(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 16px',
            background: '#78350f18',
            border: '1px solid #f59e0b30',
            borderRadius: 20,
            color: '#f59e0b',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <span>☕</span>
          <span>I'm on break…</span>
        </button>
      </div>

      {/* On Break section */}
      {onBreak.length > 0 && (
        <section style={{ padding: '0 16px 4px' }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            color: '#8892a4',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            On Break
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {onBreak.map(({ userId, row }) => (
              <div key={userId} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserDot userId={userId} displayName={profiles[userId]?.display_name || '?'} size={26} />
                {row.break_note && (
                  <span style={{ fontSize: 12, color: '#8892a4', fontStyle: 'italic' }}>
                    "{row.break_note}"
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {isEmpty && (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: '#8892a4' }}>
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

      {breakSheet && (
        <BreakSheet
          onSetBreak={onSetBreak}
          onClose={() => setBreakSheet(false)}
        />
      )}
    </div>
  )
}

function BreakSheet({ onSetBreak, onClose }) {
  const [note, setNote] = useState('')
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (sheetRef.current) sheetRef.current.style.transform = 'translateY(0)'
    })
  }, [])

  function handleClose() {
    if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(100%)'
      setTimeout(onClose, 200)
    } else {
      onClose()
    }
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) handleClose()
  }

  async function handleSubmit() {
    await onSetBreak(note)
    handleClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#16213e',
          borderRadius: '20px 20px 0 0',
          padding: '0 16px env(safe-area-inset-bottom, 20px)',
          transform: 'translateY(100%)',
          transition: 'transform 0.22s ease-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#ffffff30' }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24', marginBottom: 16 }}>
          ☕ On Break
        </div>
        <input
          autoFocus
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Optional note (e.g. grabbing food, back at 3)"
          maxLength={80}
          style={{
            width: '100%',
            background: '#0d1b38',
            border: '1px solid #ffffff20',
            borderRadius: 10,
            padding: '12px 14px',
            color: '#eaeaea',
            fontSize: 15,
            outline: 'none',
            marginBottom: 12,
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
        />
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '13px',
            background: '#92400e',
            border: 'none',
            borderRadius: 10,
            color: '#fbbf24',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          Set Break Status
        </button>
      </div>
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
