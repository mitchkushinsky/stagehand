import { useState, useMemo } from 'react'
import { schedule, DAYS, STAGE_NAMES, isSetActive, isSetUpcoming, isSetPast, getTodayKey } from '../data/schedule'
import UserDot from '../components/UserDot'
import DotRow from '../components/DotRow'
import StatusBottomSheet from '../components/StatusBottomSheet'

export default function ScheduleScreen({ myPresence, presenceMap, profiles, onSetStatus, onClear, currentUserId }) {
  const todayKey = getTodayKey()
  const [selectedDay, setSelectedDay] = useState(todayKey)
  const [sheet, setSheet] = useState(null)

  const daySchedule = useMemo(() => schedule[selectedDay] || [], [selectedDay])

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

      {/* Schedule list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {daySchedule.map(stageObj => (
          <StageSection
            key={stageObj.stage}
            stageObj={stageObj}
            day={selectedDay}
            presenceMap={presenceMap}
            profiles={profiles}
            currentUserId={currentUserId}
            onTap={(set) => setSheet({ set: { ...set, stage: stageObj.stage }, day: selectedDay })}
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

function StageSection({ stageObj, day, presenceMap, profiles, currentUserId, onTap }) {
  const fullName = STAGE_NAMES[stageObj.stage] || stageObj.stage
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        padding: '12px 16px 6px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1,
        color: '#8892a4',
        textTransform: 'uppercase',
        position: 'sticky',
        top: 0,
        background: '#1a1a2e',
        zIndex: 10,
      }}>
        {stageObj.stage}
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
        />
      ))}
    </div>
  )
}

function SetRow({ set, stage, day, presenceMap, profiles, currentUserId, onTap }) {
  const past = isSetPast(set, day)
  const active = isSetActive(set, day)
  const upcoming = isSetUpcoming(set, day)

  // Collect both 'here' and 'going' rows for this set
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
        marginLeft: 0,
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
      <DotRow attendees={attendees} profiles={profiles} size={24} max={4} />
    </div>
  )
}
