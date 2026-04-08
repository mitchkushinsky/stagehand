import { useState, useRef, useEffect } from 'react'

const REACTIONS = [
  { emoji: '💃', label: 'Dancing' },
  { emoji: '😎', label: 'Vibing' },
  { emoji: '❤️', label: 'Love it' },
  { emoji: '😐', label: 'Meh' },
]

export default function PillSheet({ type, hereRow, goingRow, onSetBreak, onClear, onSaveHereAnnotation, onClose }) {
  const [breakNote, setBreakNote] = useState(type === 'break' ? (hereRow?.break_note || '') : '')
  const [showBreakExpanded, setShowBreakExpanded] = useState(false)
  const [reactions, setReactions] = useState(
    hereRow?.here_reaction ? hereRow.here_reaction.split(',').filter(Boolean) : []
  )
  const [hereNote, setHereNote] = useState(hereRow?.here_note || '')
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

  async function handleSaveAnnotation() {
    await onSaveHereAnnotation({ reaction: reactions.join(','), note: hereNote })
    handleClose()
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
        <div style={{ padding: '12px 20px 14px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#eaeaea', lineHeight: 1.2 }}>
            {type === 'break' ? 'On break' : row?.artist}
          </div>
          {type !== 'break' && row?.stage && (
            <div style={{ fontSize: 14, color: '#8892a4', marginTop: 4 }}>{row.stage}</div>
          )}
        </div>

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {type === 'here' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                {REACTIONS.map(r => {
                  const selected = reactions.includes(r.emoji)
                  return (
                    <button
                      key={r.emoji}
                      onClick={() => setReactions(prev => {
                        if (prev.includes(r.emoji)) return prev.filter(e => e !== r.emoji)
                        if (prev.length >= 2) return prev
                        return [...prev, r.emoji]
                      })}
                      style={{
                        flex: 1, padding: '10px 4px', fontSize: 22,
                        background: selected ? '#1e3a5f' : '#0d1b38',
                        border: selected ? '1.5px solid #3b82f6' : '1.5px solid rgba(255,255,255,0.08)',
                        borderRadius: 10, cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      {r.emoji}
                    </button>
                  )
                })}
              </div>

              <input
                value={hereNote}
                onChange={e => setHereNote(e.target.value)}
                placeholder="Where are you standing? (optional)"
                maxLength={80}
                style={noteInputStyle}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveAnnotation() }}
              />

              <button onClick={handleSaveAnnotation} style={confirmBtnStyle('#1d4ed8', '#93c5fd')}>
                Save
              </button>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '2px 0' }} />

              {!showBreakExpanded ? (
                <button
                  onClick={() => setShowBreakExpanded(true)}
                  style={{ ...actionBtnStyle, background: '#78350f20', border: '1.5px solid #f59e0b60', color: '#fbbf24' }}
                >
                  <span style={{ fontSize: 18 }}>☕</span>
                  Go on break
                </button>
              ) : (
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

              <button onClick={handleClearHere} style={clearBtnStyle}>Clear status</button>
            </>
          )}

          {type === 'going' && (
            <button onClick={handleClearGoing} style={clearBtnStyle}>Clear status</button>
          )}

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
              <button onClick={handleClearBreak} style={clearBtnStyle}>Clear break</button>
            </>
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
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
