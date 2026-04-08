import { useState, useMemo } from 'react'
import { schedule, DAYS, STAGE_NAMES, STAGE_LOCATIONS, isSetActive, isSetUpcoming, isSetPast, getTodayKey, parseSetTime } from '../data/schedule'
import UserDot from '../components/UserDot'
import DotRow from '../components/DotRow'
import StatusBottomSheet from '../components/StatusBottomSheet'
import PillSheet from '../components/PillSheet'

export default function ScheduleScreen({ myPresence, presenceMap, profiles, onSetStatus, onClear, onSetBreak, onSaveHereAnnotation, currentUserId }) {
  const todayKey = getTodayKey()
  const [selectedDay, setSelectedDay] = useState(todayKey)
  const [sortBy, setSortBy] = useState('stage') // 'stage' | 'time'
  const [sheet, setSheet] = useState(null)
  const [pillSheet, setPillSheet] = useState(null)

  function handleOwnDotTap(row) {
    const type = row.status === 'break' ? 'break' : row.status === 'here' ? 'here' : 'going'
    setPillSheet(type)
  }

  const daySchedule = useMemo(() => schedule[selectedDay] || [], [selectedDay])

  // Flat time-sorted list for "By Time" view
  const flatSets = useMemo(() => {
    if (sortBy !== 'time') return []
    const all = []
    daySchedule.forEach(stageObj => {
      stageObj.sets.forEach(set => {
        all.push({ ...set, stage: stageObj.stage })
      })
    })
    all.sort((a, b) => {
      const tA = parseSetTime(a.start, selectedDay).getTime()
      const tB = parseSetTime(b.start, selectedDay).getTime()
      if (tA !== tB) return tA - tB
      return a.stage.localeCompare(b.stage)
    })
    return all
  }, [daySchedule, sortBy, selectedDay])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Day tabs */}
      <div style={{
        display: 'flex',
        background: '#0d1b38',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        {Object.entries(DAYS).map(([key, { label, date }]) => {
          const active = key === selectedDay
          return (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              style={{
                flex: 1,
                padding: '12px 4px',
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid #e94560' : '2px solid transparent',
                color: active ? '#e94560' : '#8892a4',
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
                lineHeight: 1.2,
                transition: 'color 0.15s',
              }}
            >
              <div>{label}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{date.split(' ')[1]}</div>
            </button>
          )
        })}
      </div>

      {/* Sort toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 16px',
        background: '#0d1b38',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'inline-flex',
          background: '#0a1428',
          borderRadius: 20,
          padding: 3,
          gap: 2,
        }}>
          {[['stage', 'By Stage'], ['time', 'By Time']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              style={{
                padding: '5px 16px',
                borderRadius: 16,
                border: 'none',
                fontSize: 13,
                fontWeight: sortBy === val ? 700 : 400,
                background: sortBy === val ? '#1d4ed8' : 'transparent',
                color: sortBy === val ? '#fff' : '#8892a4',
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {sortBy === 'stage' ? (
          daySchedule.map(stageObj => (
            <StageSection
              key={stageObj.stage}
              stageObj={stageObj}
              day={selectedDay}
              presenceMap={presenceMap}
              profiles={profiles}
              currentUserId={currentUserId}
              onTap={(set) => setSheet({ set: { ...set, stage: stageObj.stage }, day: selectedDay })}
              onOwnDotTap={handleOwnDotTap}
            />
          ))
        ) : (
          flatSets.map((set, i) => (
            <FlatSetRow
              key={i}
              set={set}
              day={selectedDay}
              presenceMap={presenceMap}
              profiles={profiles}
              currentUserId={currentUserId}
              onTap={() => setSheet({ set, day: selectedDay })}
              onOwnDotTap={handleOwnDotTap}
            />
          ))
        )}
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

      {pillSheet && (
        <PillSheet
          type={pillSheet}
          hereRow={myPresence.here}
          goingRow={myPresence.going}
          onSetBreak={onSetBreak}
          onClear={onClear}
          onSaveHereAnnotation={onSaveHereAnnotation}
          onClose={() => setPillSheet(null)}
        />
      )}
    </div>
  )
}

function StageSection({ stageObj, day, presenceMap, profiles, currentUserId, onTap, onOwnDotTap }) {
  const loc = STAGE_LOCATIONS[stageObj.stage]

  function openMaps(e) {
    e.stopPropagation()
    if (loc) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank', 'noopener')
    }
  }

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        padding: '12px 16px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: '#1a1a2e',
        zIndex: 10,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          color: '#8892a4',
          textTransform: 'uppercase',
        }}>
          {stageObj.stage}
        </span>
        {loc && (
          <button
            onClick={openMaps}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '2px 4px',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
              opacity: 0.7,
            }}
            aria-label={`Directions to ${stageObj.stage}`}
          >
            📍
          </button>
        )}
      </div>
      {stageObj.sets.map((set, i) => (
        <SetRow
          key={i}
          set={set}
          stage={stageObj.stage}
          day={day}
          presenceMap={presenceMap}
          profiles={profiles}
          currentUserId={currentUserId}
          onTap={() => onTap(set)}
          onOwnDotTap={onOwnDotTap}
        />
      ))}
    </div>
  )
}

function SetRow({ set, stage, day, presenceMap, profiles, currentUserId, onTap, onOwnDotTap }) {
  const past = isSetPast(set, day)
  const active = isSetActive(set, day)
  const upcoming = isSetUpcoming(set, day)

  const attendees = Object.values(presenceMap).flatMap(u =>
    [u.here, u.going].filter(r => r && r.stage === stage && r.artist === set.artist && r.day === day)
  )

  let leftBorderColor = 'transparent'
  if (active) leftBorderColor = '#22c55e'
  else if (upcoming) leftBorderColor = '#3b82f6'

  return (
    <div
      onClick={past ? undefined : onTap}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px 10px 14px',
        borderLeft: `3px solid ${leftBorderColor}`,
        opacity: past ? 0.4 : 1,
        cursor: past ? 'default' : 'pointer',
        gap: 12,
        transition: 'background 0.1s',
      }}
    >
      <div style={{
        fontSize: 12,
        color: '#8892a4',
        width: 62,
        flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {set.start}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? '#eaeaea' : past ? '#eaeaea' : '#d1d5db',
          lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {set.artist}
        </div>
        {active && (
          <div style={{ fontSize: 11, color: '#22c55e', marginTop: 1 }}>Live now · ends {set.end}</div>
        )}
      </div>
      <DotRow attendees={attendees} profiles={profiles} size={24} max={4} currentUserId={currentUserId} onDotTap={onOwnDotTap} />
    </div>
  )
}

function FlatSetRow({ set, day, presenceMap, profiles, currentUserId, onTap, onOwnDotTap }) {
  const past = isSetPast(set, day)
  const active = isSetActive(set, day)
  const upcoming = isSetUpcoming(set, day)

  const attendees = Object.values(presenceMap).flatMap(u =>
    [u.here, u.going].filter(r => r && r.stage === set.stage && r.artist === set.artist && r.day === day)
  )

  let leftBorderColor = 'transparent'
  if (active) leftBorderColor = '#22c55e'
  else if (upcoming) leftBorderColor = '#3b82f6'

  return (
    <div
      onClick={past ? undefined : onTap}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px 10px 14px',
        borderLeft: `3px solid ${leftBorderColor}`,
        opacity: past ? 0.4 : 1,
        cursor: past ? 'default' : 'pointer',
        gap: 12,
        transition: 'background 0.1s',
      }}
    >
      <div style={{
        fontSize: 12,
        color: '#8892a4',
        width: 62,
        flexShrink: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {set.start}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? '#eaeaea' : past ? '#eaeaea' : '#d1d5db',
          lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {set.artist}
        </div>
        <div style={{
          fontSize: 11,
          color: active ? '#22c55e' : '#8892a4',
          marginTop: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {active ? `Live now · ${set.stage} · ends ${set.end}` : set.stage}
        </div>
      </div>
      <DotRow attendees={attendees} profiles={profiles} size={24} max={4} currentUserId={currentUserId} onDotTap={onOwnDotTap} />
    </div>
  )
}
