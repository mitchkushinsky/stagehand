import { useState, useEffect, useRef } from 'react'
import { isSetActive, isSetPast } from '../data/schedule'

// myPresence shape: { here: row|null, going: row|null }
export default function StatusBottomSheet({ set, day, myPresence, onSetStatus, onClear, onClose }) {
  // 'confirming' tracks which button is in the two-tap confirm state: 'here' | 'going' | null
  const [confirming, setConfirming] = useState(null)
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  const active = isSetActive(set, day)
  const past = isSetPast(set, day)
  // For button visibility: active → Here only, future → Going only, past → neither
  const showHere = active
  const showGoing = !active && !past

  const hereRow = myPresence?.here
  const goingRow = myPresence?.going

  const isMyHereSet = hereRow?.status === 'here' &&
    hereRow.artist === set.artist &&
    hereRow.stage === set.stage &&
    hereRow.day === day

  const isMyGoingSet = goingRow &&
    goingRow.artist === set.artist &&
    goingRow.stage === set.stage &&
    goingRow.day === day

  // Would tapping "Here" replace an existing here row at a different set?
  const hereWouldReplace = hereRow?.status === 'here' && !isMyHereSet
  // Would tapping "Going" replace an existing going row at a different set?
  const goingWouldReplace = goingRow && !isMyGoingSet

  // Any status connected to this set (for the bottom Clear link)
  const hasHereForSet = isMyHereSet
  const hasGoingForSet = isMyGoingSet

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

  function handleHereTap() {
    if (isMyHereSet) {
      // Already set here — tapping again is a no-op (clear link handles removal)
      return
    }
    if (hereWouldReplace && confirming !== 'here') {
      setConfirming('here')
      return
    }
    commitHere()
  }

  async function commitHere() {
    setConfirming(null)
    await onSetStatus({ status: 'here' })
    handleClose()
  }

  function handleGoingTap() {
    if (isMyGoingSet) {
      return
    }
    if (goingWouldReplace && confirming !== 'going') {
      setConfirming('going')
      return
    }
    commitGoing()
  }

  async function commitGoing() {
    setConfirming(null)
    await onSetStatus({ status: 'going' })
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

  // Tapping outside a confirming button cancels the confirm state
  function handleSheetClick(e) {
    if (confirming && !e.target.closest('[data-confirm-btn]')) {
      setConfirming(null)
    }
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
        onClick={handleSheetClick}
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
        </div>

        {/* Buttons */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* I'm Here — active sets only */}
          {showHere && (
            <button
              data-confirm-btn="here"
              onClick={handleHereTap}
              style={{
                ...btnStyle,
                background: isMyHereSet ? '#16a34a'
                  : confirming === 'here' ? '#14532d'
                  : '#15803d20',
                border: confirming === 'here' ? '1.5px solid #22c55e' : '1.5px solid #22c55e60',
                color: '#22c55e',
                outline: isMyHereSet ? '2px solid #22c55e' : 'none',
                cursor: isMyHereSet ? 'default' : 'pointer',
              }}
            >
              <span style={{ fontSize: 18 }}>🟢</span>
              <span>
                {isMyHereSet
                  ? "Here now ✓"
                  : confirming === 'here'
                  ? `Confirm — replaces ${hereRow.artist}`
                  : "I'm Here"}
              </span>
            </button>
          )}

          {/* Going when it starts — future sets only */}
          {showGoing && (
            <button
              data-confirm-btn="going"
              onClick={handleGoingTap}
              style={{
                ...btnStyle,
                background: isMyGoingSet ? '#1d4ed820'
                  : confirming === 'going' ? '#1e3a8a'
                  : '#1e40af20',
                border: confirming === 'going' ? '1.5px solid #3b82f6' : '1.5px solid #3b82f660',
                color: '#60a5fa',
                outline: isMyGoingSet ? '2px solid #3b82f6' : 'none',
                cursor: isMyGoingSet ? 'default' : 'pointer',
              }}
            >
              <span style={{ fontSize: 18 }}>🔵</span>
              <span>
                {isMyGoingSet
                  ? "Going ✓"
                  : confirming === 'going'
                  ? `Confirm — replaces ${goingRow.artist}`
                  : "Going when it starts"}
              </span>
            </button>
          )}


          {/* Clear link — shown if user has any status for this specific set */}
          {(hasHereForSet || hasGoingForSet) && (
            <button
              onClick={hasHereForSet ? handleClearHere : handleClearGoing}
              style={clearLinkStyle}
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
  transition: 'background 0.15s, border-color 0.15s',
}

const clearLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: '#8892a4',
  fontSize: 13,
  padding: '4px 0 0',
  cursor: 'pointer',
  textDecoration: 'underline',
  textAlign: 'center',
  width: '100%',
  display: 'block',
}
