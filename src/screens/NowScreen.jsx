import { useState, useMemo, useRef } from 'react'
import { schedule, DAYS, isSetActive, isSetUpcoming, getTodayKey } from '../data/schedule'
import UserDot from '../components/UserDot'
import DotRow from '../components/DotRow'
import StatusBottomSheet from '../components/StatusBottomSheet'
import PillSheet from '../components/PillSheet'

export default function NowScreen({ myPresence, presenceMap, profiles, onSetStatus, onSetBreak, onClear, onSaveHereAnnotation, currentUserId, onRefresh }) {
  const [sheet, setSheet] = useState(null)
  const [pillSheet, setPillSheet] = useState(null) // 'here' | 'going' | 'break'
  const [breakExpanded, setBreakExpanded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const scrollRef = useRef(null)
  const touchStartY = useRef(null)
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

  // Pull-to-refresh handlers
  function handleTouchStart(e) {
    if (scrollRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY
    } else {
      touchStartY.current = null
    }
  }

  function handleTouchMove(e) {
    if (touchStartY.current === null || refreshing) return
    const dist = e.touches[0].clientY - touchStartY.current
    if (dist > 0) {
      setPullDistance(Math.min(dist, 80))
    } else {
      setPullDistance(0)
      touchStartY.current = null
    }
  }

  async function handleTouchEnd() {
    if (pullDistance >= 60 && !refreshing && onRefresh) {
      setPullDistance(0)
      setRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
      }
    } else {
      setPullDistance(0)
    }
    touchStartY.current = null
  }

  function handleOwnDotTap(row) {
    const type = row.status === 'break' ? 'break' : row.status === 'here' ? 'here' : 'going'
    setPillSheet(type)
  }

  const showPullIndicator = refreshing || pullDistance > 20

  return (
    <div
      ref={scrollRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ flex: 1, overflowY: 'auto', paddingBottom: 80, overscrollBehaviorY: 'contain' }}
    >
      {/* Pull-to-refresh indicator */}
      {showPullIndicator && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: refreshing ? 44 : Math.min(pullDistance * 0.55, 44),
          overflow: 'hidden',
          color: '#8892a4', fontSize: 12, gap: 6,
          transition: refreshing ? 'none' : 'height 0.05s',
        }}>
          {refreshing
            ? <><SpinnerIcon /> Refreshing…</>
            : pullDistance >= 60
              ? '↑ Release to refresh'
              : '↓ Pull to refresh'
          }
        </div>
      )}

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
        <section style={{ padding: '0 16px 8px' }}>
          {onBreak.length < 3 ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: '#8892a4', textTransform: 'uppercase', marginBottom: 8 }}>
                On Break
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {onBreak.map(({ userId, row }) => (
                  <div key={userId} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserDot userId={userId} displayName={profiles[userId]?.display_name} size={26} />
                    {row.break_note && <span style={{ fontSize: 12, color: '#8892a4', fontStyle: 'italic' }}>"{row.break_note}"</span>}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setBreakExpanded(e => !e)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', background: 'transparent', border: 'none',
                  padding: '0 0 8px', cursor: 'pointer', color: '#8892a4',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  ☕ On break · {onBreak.length} people
                </span>
                <ChevronIcon rotated={breakExpanded} />
              </button>
              {breakExpanded && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {onBreak.map(({ userId, row }) => (
                    <div key={userId} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <UserDot userId={userId} displayName={profiles[userId]?.display_name} size={26} />
                      {row.break_note && <span style={{ fontSize: 12, color: '#8892a4', fontStyle: 'italic' }}>"{row.break_note}"</span>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
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
              currentUserId={currentUserId}
              onOwnDotTap={handleOwnDotTap}
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
              currentUserId={currentUserId}
              onOwnDotTap={handleOwnDotTap}
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
          onSaveHereAnnotation={onSaveHereAnnotation}
          onClose={() => setPillSheet(null)}
        />
      )}
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

function SetCard({ set, attendees, profiles, onTap, variant, currentUserId, onOwnDotTap }) {
  const borderColor = variant === 'active' ? '#22c55e' : '#3b82f6'
  return (
    <div
      onClick={onTap}
      style={{
        margin: '0 12px 8px', background: '#16213e', borderRadius: 12,
        padding: '14px 16px', borderLeft: `3px solid ${borderColor}`,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#eaeaea', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {set.artist}
        </div>
        <div style={{ fontSize: 13, color: '#8892a4', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {set.stage} · {variant === 'active' ? `until ${set.end}` : `starts ${set.start}`}
        </div>
      </div>
      <DotRow attendees={attendees} profiles={profiles} size={26} max={4} currentUserId={currentUserId} onDotTap={onOwnDotTap} />
    </div>
  )
}

function ChevronIcon({ rotated = false }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, opacity: 0.6, transition: 'transform 0.2s', transform: rotated ? 'rotate(180deg)' : 'none' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
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
