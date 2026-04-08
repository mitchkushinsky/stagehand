import { useState, useEffect, useRef } from 'react'
import { isSetActive, isSetPast } from '../data/schedule'

// myPresence shape: { here: row|null, going: row|null }
export default function StatusBottomSheet({ set, day, myPresence, onSetStatus, onSetBreak, onClear, onClose }) {
  const [breakNote, setBreakNote] = useState('')
  const [showBreakInput, setShowBreakInput] = useState(false)
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  const active = isSetActive(set, day)
  const past = isSetPast(set, day)
  const canGo = !active && !past

  const hereRow = myPresence?.here
  const goingRow = myPresence?.going

  const isMyHereSet = hereRow &&
    hereRow.artist === set.artist &&
    hereRow.stage === set.stage &&
    hereRow.day === day &&
    hereRow.status === 'here'

  const isMyGoingSet = goingRow &&
    goingRow.artist === set.artist &&
    goingRow.stage === set.stage &&
    goingRow.day === day

  const replacingHere = hereRow && !isMyHereSet && hereRow.status === 'here'
  const replacingGoing = goingRow && !isMyGoingSet

  // Slide in animation
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

  async function handleHere() {
    await onSetStatus({ status: 'here' })
    handleClose()
  }

  async function handleGoing() {
    await onSetStatus({ status: 'going' })
    handleClose()
  }

  async function handleBreakSubmit() {
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
            {set.artist}
          </div>
          <div style={{ fontSize: 14, color: '#8892a4', marginTop: 4 }}>
            {set.stage} · {set.start}–{set.end}
          </div>

          {/* Replacement warnings */}
          {(replacingHere || replacingGoing) && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {replacingHere && (
                <div style={warningStyle}>
                  Replaces your Here at <strong>{hereRow.artist}</strong>
                </div>
              )}
              {replacingGoing && (
                <div style={warningStyle}>
                  Replaces your Going for <strong>{goingRow.artist}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* I'm Here */}
          <div>
            <button
              onClick={handleHere}
              style={{
                ...btnStyle,
                background: isMyHereSet ? '#16a34a' : '#15803d20',
                border: '1.5px solid #22c55e60',
                color: '#22c55e',
                outline: isMyHereSet ? '2px solid #22c55e' : 'none',
              }}
            >
              <span style={{ fontSize: 18 }}>🟢</span>
              {isMyHereSet ? "Here now ✓" : "I'm Here"}
            </button>
            {isMyHereSet && (
              <button onClick={handleClearHere} style={clearLinkStyle}>
                Clear
              </button>
            )}
          </div>

          {/* Going when it starts */}
          {canGo && (
            <div>
              <button
                onClick={handleGoing}
                style={{
                  ...btnStyle,
                  background: isMyGoingSet ? '#1d4ed820' : '#1e40af20',
                  border: '1.5px solid #3b82f660',
                  color: '#60a5fa',
                  outline: isMyGoingSet ? '2px solid #3b82f6' : 'none',
                }}
              >
                <span style={{ fontSize: 18 }}>🔵</span>
                {isMyGoingSet ? 'Going ✓' : 'Going when it starts'}
              </button>
              {isMyGoingSet && (
                <button onClick={handleClearGoing} style={clearLinkStyle}>
                  Clear
                </button>
              )}
            </div>
          )}

          {/* On Break */}
          {!showBreakInput ? (
            <button
              onClick={() => setShowBreakInput(true)}
              style={{
                ...btnStyle,
                background: '#78350f20',
                border: '1.5px solid #f59e0b60',
                color: '#fbbf24',
              }}
            >
              <span style={{ fontSize: 18 }}>☕</span>
              On Break
            </button>
          ) : (
            <div style={{ border: '1.5px solid #f59e0b60', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{
                ...btnStyle,
                background: '#92400e20',
                color: '#fbbf24',
                borderRadius: 0,
                cursor: 'default',
              }}>
                <span style={{ fontSize: 18 }}>☕</span>
                On Break
              </div>
              <div style={{ padding: '8px 12px 12px', background: '#0f1f3d' }}>
                <input
                  autoFocus
                  value={breakNote}
                  onChange={e => setBreakNote(e.target.value)}
                  placeholder="Optional note (e.g. grabbing food, back at 3)"
                  maxLength={80}
                  style={{
                    width: '100%',
                    background: '#16213e',
                    border: '1px solid #ffffff20',
                    borderRadius: 8,
                    padding: '10px 12px',
                    color: '#eaeaea',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleBreakSubmit() }}
                />
                <button
                  onClick={handleBreakSubmit}
                  style={{
                    marginTop: 8,
                    width: '100%',
                    background: '#92400e',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fbbf24',
                    fontWeight: 600,
                    fontSize: 14,
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Set Break Status
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

const btnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'opacity 0.1s',
}

const clearLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: '#8892a4',
  fontSize: 12,
  padding: '4px 4px 0',
  cursor: 'pointer',
  textDecoration: 'underline',
  display: 'block',
}

const warningStyle = {
  padding: '7px 11px',
  background: '#f9731618',
  border: '1px solid #f9731640',
  borderRadius: 8,
  fontSize: 13,
  color: '#f97316',
}
