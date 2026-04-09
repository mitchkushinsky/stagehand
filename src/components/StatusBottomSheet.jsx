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

  const openSpotify = () => {
    const query = encodeURIComponent(set.artist)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location = `spotify:search:${set.artist}`
      setTimeout(() => {
        window.open(`https://open.spotify.com/search/${query}/artists`, '_blank')
      }, 1000)
    } else {
      window.open(`https://open.spotify.com/search/${query}/artists`, '_blank')
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

        {/* Spotify link */}
        <div style={{ padding: '0 20px 14px' }}>
          <a
            href="#"
            onClick={e => { e.preventDefault(); openSpotify() }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#1DB954',
              fontSize: 13,
              textDecoration: 'none',
              opacity: 0.85,
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#1DB954"/>
              <path d="M17.25 16.5a.75.75 0 01-.41-.12C14.23 14.72 10.9 14.4 6.97 15.27a.75.75 0 01-.34-1.46c4.3-.99 7.97-.63 10.93 1.31a.75.75 0 01-.41 1.38zm1.25-2.88a.94.94 0 01-.51-.15C15.12 11.6 11.2 11.1 7.42 12.12a.94.94 0 01-.44-1.83c4.26-1.13 8.63-.57 11.98 1.65a.94.94 0 01-.51 1.68zm.12-3a1.13 1.13 0 01-.58-.16C15.08 8.47 9.67 8.27 6.2 9.3a1.13 1.13 0 01-.6-2.17c4.03-1.13 10.04-.9 13.55 1.3a1.13 1.13 0 01-.58 2.09z" fill="white"/>
            </svg>
            Listen on Spotify
          </a>
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
