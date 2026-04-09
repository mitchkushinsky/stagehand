import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { usePresence } from './hooks/usePresence'
import SplashScreen from './components/SplashScreen'
import DisplayNameModal from './components/DisplayNameModal'
import BottomNav from './components/BottomNav'
import HelpScreen from './components/HelpScreen'
import NowScreen from './screens/NowScreen'
import ScheduleScreen from './screens/ScheduleScreen'
import CrewScreen from './screens/CrewScreen'

export default function App() {
  const { session, profile, needsDisplayName, signInWithGoogle, signOut, saveDisplayName, loading } = useAuth()
  const [tab, setTab] = useState('now')
  const [showHelp, setShowHelp] = useState(false)

  const currentUserId = session?.user?.id || null
  const { presenceMap, profiles, myPresence, setStatus, clearStatus, setBreak, saveHereAnnotation, refresh } = usePresence(currentUserId)

  if (loading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: '#1a1a2e',
      }}>
        <div style={{ fontSize: 32 }}>🎷</div>
      </div>
    )
  }

  if (!session) {
    return <SplashScreen onSignIn={signInWithGoogle} />
  }

  async function handleSetStatus({ stage, artist, start, end, day, status }) {
    await setStatus({
      day,
      stage,
      artist,
      start_time: start,
      end_time: end,
      status,
    })
  }

  const sharedProps = {
    myPresence,
    presenceMap,
    profiles,
    onSetStatus: handleSetStatus,
    onSetBreak: setBreak,
    onClear: clearStatus,
    onSaveHereAnnotation: saveHereAnnotation,
    currentUserId,
    onRefresh: refresh,
  }

  return (
    <>
      {showHelp && <HelpScreen onClose={() => setShowHelp(false)} />}

      {needsDisplayName && (
        <DisplayNameModal onSave={saveDisplayName} />
      )}

      {/* Header with sign out */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#0d1b38',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/icon-192.png" style={{ height: 28, width: 28, objectFit: 'contain', display: 'block' }} />
          <span style={{ fontSize: 17, fontWeight: 800, color: '#eaeaea', letterSpacing: -0.4 }}>
            StageHand
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setShowHelp(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%',
              color: '#8892a4',
              fontSize: 13,
              fontWeight: 700,
              width: 26,
              height: 26,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >?</button>
          {profile && (
            <span style={{ fontSize: 13, color: '#8892a4' }}>{profile.display_name}</span>
          )}
          <button
            onClick={signOut}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#8892a4',
              fontSize: 12,
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tab === 'now' && <NowScreen {...sharedProps} />}
        {tab === 'schedule' && <ScheduleScreen {...sharedProps} />}
        {tab === 'crew' && <CrewScreen {...sharedProps} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </>
  )
}
