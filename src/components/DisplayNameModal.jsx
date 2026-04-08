import { useState } from 'react'

export default function DisplayNameModal({ onSave }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    const { error } = await onSave(trimmed)
    if (error) {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 200,
    }}>
      <div style={{
        background: '#16213e',
        borderRadius: 20,
        padding: '32px 28px',
        width: '100%',
        maxWidth: 380,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#eaeaea', marginBottom: 8 }}>
          Welcome! 👋
        </div>
        <div style={{ fontSize: 15, color: '#8892a4', marginBottom: 28, lineHeight: 1.5 }}>
          What should we call you in the app? Your crew will see this name.
        </div>

        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value.slice(0, 20))}
            placeholder="Your name"
            maxLength={20}
            style={{
              width: '100%',
              background: '#0d1b38',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              padding: '12px 16px',
              color: '#eaeaea',
              fontSize: 16,
              outline: 'none',
              marginBottom: 12,
            }}
          />
          {error && (
            <div style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={!name.trim() || loading}
            style={{
              width: '100%',
              padding: '13px',
              background: name.trim() ? '#e94560' : '#374151',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Saving...' : "Let's go →"}
          </button>
        </form>

        <div style={{ fontSize: 12, color: '#4b5563', marginTop: 16, textAlign: 'center' }}>
          Max 20 characters · you can't change this later
        </div>
      </div>
    </div>
  )
}
