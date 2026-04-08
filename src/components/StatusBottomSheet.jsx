import { useState, useEffect, useRef } from 'react'
import { isSetActive, isSetUpcoming } from '../data/schedule'

export default function StatusBottomSheet({ set, day, myPresence, onSetStatus, onSetBreak, onClear, onClose }) {
  const [breakNote, setBreakNote] = useState('')
  const [showBreakInput, setShowBreakInput] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  const active = isSetActive(set, day)
  const upcoming = isSetUpcoming(set, day)

  const isMyCurrentSet = myPresence &&
    myPresence.artist === set.artist &&
    myPresence.stage === set.stage &&
    myPresence.day === day

  const hasOtherStatus = myPresence && !isMyCurrentSet && myPresence.status !== 'break'

  // Slide in animation
  useEffect(() => {
    requestAnimationFrame(() => {
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)'
      }
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

  async function handleClear() {
    await onClear()
    handleClose()
  }

  const currentStatusLabel = isMyCurrentSet
    ? myPresence.status === 'here' ? "I'm Here" : myPresence.status === 'going' ? 'Going' : 'On Break'
    : null

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

          {hasOtherStatus && (
            <div style={{
              marginTop: 10,
              padding: '8px 12px',
              background: '#f9731620',
              border: '1px solid #f9731640',
              borderRadius: 8,
              fontSize: 13,
              color: '#f97316',
            }}>
              This will replace your current status at {myPresence.artist}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {active && (
            <button
              onClick={handleHere}
              style={{
                ...btnStyle,
                background: isMyCurrentSet && myPresence.status === 'here' ? '#16a34a' : '#15803d20',
                border: '1.5px solid #22c55e60',
                color: '#22c55e',
                outline: isMyCurrentSet && myPresence.status === 'here' ? '2px solid #22c55e' : 'none',
              }}
            >
              <span style={{ fontSize: 18 }}>🟢</span>
              {isMyCurrentSet && myPresence.status === 'here' ? "Here now ✓" : "I'm Here"}
            </button>
          )}

          {upcoming && !active && (
            <button
              onClick={handleGoing}
              style={{
                ...btnStyle,
                background: isMyCurrentSet && myPresence.status === 'going' ? '#1d4ed820' : '#1e40af20',
                border: '1.5px solid #3b82f660',
                color: '#60a5fa',
                outline: isMyCurrentSet && myPresence.status === 'going' ? '2px solid #3b82f6' : 'none',
              }}
            >
              <span style={{ fontSize: 18 }}>🔵</span>
              {isMyCurrentSet && myPresence.status === 'going' ? 'Going ✓' : 'Going when it starts'}
            </button>
          )}

          {!showBreakInput ? (
            <button
              onClick={() => setShowBreakInput(true)}
              style={{
                ...btnStyle,
                background: isMyCurrentSet && myPresence.status === 'break' ? '#92400e20' : '#78350f20',
                border: '1.5px solid #f59e0b60',
                color: '#fbbf24',
                outline: isMyCurrentSet && myPresence.status === 'break' ? '2px solid #f59e0b' : 'none',
              }}
            >
              <span style={{ fontSize: 18 }}>☕</span>
              {isMyCurrentSet && myPresence.status === 'break' ? 'On Break ✓' : 'On Break'}
            </button>
          ) : (
            <div style={{
              border: '1.5px solid #f59e0b60',
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <button
                style={{
                  ...btnStyle,
                  background: '#92400e20',
                  border: 'none',
                  color: '#fbbf24',
                  borderRadius: 0,
                  width: '100%',
                }}
              >
                <span style={{ fontSize: 18 }}>☕</span>
                On Break
              </button>
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

          {isMyCurrentSet && (
            <button
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8892a4',
                fontSize: 14,
                padding: '8px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear my status
            </button>
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
