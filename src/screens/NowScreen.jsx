import { useState, useMemo, useRef, useEffect } from 'react'
import { schedule, DAYS, isSetActive, isSetUpcoming, getTodayKey } from '../data/schedule'
import UserDot from '../components/UserDot'
import StatusBottomSheet from '../components/StatusBottomSheet'

export default function NowScreen({ myPresence, presenceMap, profiles, onSetStatus, onSetBreak, onClear, currentUserId }) {
  const [sheet, setSheet] = useState(null)
  const [pillSheet, setPillSheet] = useState(null) // 'here' | 'going' | 'break'
  const todayKey = getTodayKey()

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

  const onBreak = useMemo(() =>
    Object.entries(presenceMap)
      .filter(([, u]) => u.here?.status === 'break')
      .map(([userId, u]) => ({ userId, row: u.here })),
    [presenceMap]
  )

  const { here, going } = myPresence

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

      {/* Interactive status pills */}
      {(here || going) && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {here?.status === 'break' && (
            <button onClick={() => setPillSheet('break')} style={pillBtnStyle('#78350f20', '#f59e0b')}>
              <span>☕</span>
              <span style={pillTextStyle}>On break{here.break_note ? ` · ${here.break_note}` : ''}</span>
              <ChevronIcon />
            </button>
          )}
          {here?.status === 'here' && (
            <button onClick={() => setPillSheet('here')} style={pillBtnStyle('#14532d20', '#22c55e')}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
              <span style={pillTextStyle}>At: <strong>{here.artist}</strong></span>
              <ChevronIcon />
            </button>
          )}
          {going && (
            <button onClick={() => setPillSheet('going')} style={pillBtnStyle('#1e3a8a20', '#60a5fa')}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', flexShrink: 0 }} />
              <span style={pillTextStyle}>Going to: <strong>{going.artist}</strong></span>
              <ChevronIcon />
            </button>
          )}
        </div>
      )}

      {/* On Break section */}
      {onBreak.length > 0 && (
        <section style={{ padding: '0 16px 4px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
            color: '#8892a4', textTransform: 'uppercase', marginBottom: 8,
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
          onClear={onClear}
          onClose={() => setSheet(null)}
        />
      )}

      {pillSheet && (
        <PillSheet
          type={pillSheet}
          hereRow={here}
          goingRow={going}
          onSetBreak={onSetBreak}
          onClear={onClear}
          onClose={() => setPillSheet(null)}
        />
      )}
    </div>
  )
}

// Slide-up sheet opened by tapping a status pill
function PillSheet({ type, hereRow, goingRow, onSetBreak, onClear, onClose }) {
  const [breakNote, setBreakNote] = useState(type === 'break' ? (hereRow?.break_note || '') : '')
  const [showBreakExpanded, setShowBreakExpanded] = useState(false)
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

  async function handleGoOnBreak() {
    await onSetBreak(breakNote)
    handleClose()
  }

  async function handleUpdateBreak() {
    await onSetBreak(breakNote)
    handleClose()
  }

  async function handleClearHere() {
    await onClear('here')
    handleClose()
  }

  async function handleClearGoing() {
    await onClear('going')
    handleClose()
  }

  async function handleClearBreak() {
    await onClear('break')
    handleClose()
  }

  const row = type === 'going' ? goingRow : hereRow

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%', maxWidth: 480, background: '#16213e',
          borderRadius: '20px 20px 0 0',
          padding: '0 0 env(safe-area-inset-bottom, 16px)',
          transform: 'translateY(100%)',
          transition: 'transform 0.22s ease-out',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#ffffff30' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '12px 20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#eaeaea', lineHeight: 1.2 }}>
            {type === 'break' ? 'On break' : row?.artist}
          </div>
          {type !== 'break' && row?.stage && (
            <div style={{ fontSize: 14, color: '#8892a4', marginTop: 4 }}>
              {row.stage}
            </div>
          )}
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* HERE pill sheet */}
          {type === 'here' && !showBreakExpanded && (
            <button
              onClick={() => setShowBreakExpanded(true)}
              style={{ ...actionBtnStyle, background: '#78350f20', border: '1.5px solid #f59e0b60', color: '#fbbf24' }}
            >
              <span style={{ fontSize: 18 }}>☕</span>
              Go on break
            </button>
          )}
          {type === 'here' && showBreakExpanded && (
            <div style={{ border: '1.5px solid #f59e0b60', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ ...actionBtnStyle, background: '#92400e20', color: '#fbbf24', borderRadius: 0, cursor: 'default' }}>
                <span style={{ fontSize: 18 }}>☕</span>
                Go on break
              </div>
              <div style={{ padding: '8px 12px 12px', background: '#0f1f3d' }}>
                <input
                  autoFocus
                  value={breakNote}
                  onChange={e => setBreakNote(e.target.value)}
                  placeholder="Optional note (e.g. grabbing food, back at 3)"
                  maxLength={80}
                  style={noteInputStyle}
                  onKeyDown={e => { if (e.key === 'Enter') handleGoOnBreak() }}
                />
                <button onClick={handleGoOnBreak} style={confirmBtnStyle('#92400e', '#fbbf24')}>
                  Set Break Status
                </button>
              </div>
            </div>
          )}
          {type === 'here' && (
            <button onClick={handleClearHere} style={clearBtnStyle}>
              Clear status
            </button>
          )}

          {/* GOING pill sheet */}
          {type === 'going' && (
            <button onClick={handleClearGoing} style={clearBtnStyle}>
              Clear status
            </button>
          )}

          {/* BREAK pill sheet */}
          {type === 'break' && (
            <>
              <input
                value={breakNote}
                onChange={e => setBreakNote(e.target.value)}
                placeholder="Optional note (e.g. grabbing food, back at 3)"
                maxLength={80}
                style={noteInputStyle}
                onKeyDown={e => { if (e.key === 'Enter') handleUpdateBreak() }}
              />
              <button onClick={handleUpdateBreak} style={confirmBtnStyle('#92400e', '#fbbf24')}>
                Update note
              </button>
              <button onClick={handleClearBreak} style={clearBtnStyle}>
                Clear break
              </button>
            </>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

function SectionHeader({ label }) {
  return (
    <div style={{
      padding: '12px 16px 6px', fontSize: 11, fontWeight: 700,
      letterSpacing: 1.2, color: '#8892a4', textTransform: 'uppercase',
    }}>
      {label}
    </div>
  )
}

function SetCard({ set, attendees, profiles, onTap, variant }) {
  const borderColor = variant === 'active' ? '#22c55e' : '#3b82f6'
  return (
    <div
      onClick={onTap}
      style={{
        margin: '0 12px 8px', background: '#16213e', borderRadius: 12,
        padding: '14px 16px', borderLeft: `3px solid ${borderColor}`,
        cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12,
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
              <UserDot userId={row.user_id} displayName={profiles[row.user_id]?.display_name || '?'} size={26} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function pillBtnStyle(bg, color) {
  return {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px 8px 14px',
    background: bg, border: `1px solid ${color}40`,
    borderRadius: 20, fontSize: 13, color,
    cursor: 'pointer', width: '100%', textAlign: 'left',
  }
}

const pillTextStyle = {
  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
}

const actionBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 12,
  width: '100%', padding: '14px 16px', borderRadius: 12,
  fontSize: 16, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
}

const clearBtnStyle = {
  background: 'transparent', border: 'none',
  color: '#8892a4', fontSize: 13, padding: '6px 0',
  cursor: 'pointer', textDecoration: 'underline',
  textAlign: 'center', width: '100%',
}

const noteInputStyle = {
  width: '100%', background: '#16213e',
  border: '1px solid #ffffff20', borderRadius: 8,
  padding: '10px 12px', color: '#eaeaea', fontSize: 14, outline: 'none',
  marginBottom: 8, display: 'block',
}

function confirmBtnStyle(bg, color) {
  return {
    width: '100%', padding: '11px', background: bg,
    border: 'none', borderRadius: 8, color,
    fontWeight: 600, fontSize: 14, cursor: 'pointer',
  }
}
