export default function HelpScreen({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#1a1a2e',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: '#0d1b38',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: '#eaeaea' }}>How to use StageHand</span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8892a4',
            fontSize: 20,
            cursor: 'pointer',
            lineHeight: 1,
            padding: '4px 8px',
          }}
        >✕</button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 18px 48px', maxWidth: 600, width: '100%', margin: '0 auto' }}>

        <Section title="Getting Started">
          <P>Open <strong>stagehand-eta.vercel.app</strong> in your phone's browser. Sign in with your Google account. You'll be asked to pick a display name — this is how your friends will see you in the app.</P>
          <Tip>Add StageHand to your home screen for quick access. In Safari (iPhone): tap Share → Add to Home Screen. In Chrome (Android): tap the three dots → Add to Home Screen.</Tip>
        </Section>

        <Section title="The Three Tabs">
          <SubSection title="Now Tab">
            <P>Your home base during the festival. Shows everything happening right now and what's coming up in the next 4 hours.</P>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Now Playing</strong> — all active sets across every stage, sorted by how many friends are there</li>
              <li style={liStyle}><strong>Coming Up · Next 4 Hours</strong> — sets starting soon so you can plan your next move</li>
              <li style={liStyle}><strong>On Break</strong> section — appears above Now Playing when any crew members are on a break</li>
            </ul>
            <Tip>Pull down on the Now screen to refresh and get the latest from everyone.</Tip>
          </SubSection>

          <SubSection title="Schedule Tab">
            <P>Browse the full 4-day festival schedule. Use the day tabs at the top to switch between Thursday, Friday, Saturday, and Sunday.</P>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>By Stage / By Time</strong> toggle — switch between sets grouped by stage or a flat chronological list</li>
              <li style={liStyle}>Past sets are dimmed and can't be tapped</li>
              <li style={liStyle}>Active sets have a green left border</li>
              <li style={liStyle}>Upcoming sets (within 4 hours) have a blue left border</li>
              <li style={liStyle}>Tap 📍 next to any stage name to get directions in Google Maps</li>
            </ul>
          </SubSection>

          <SubSection title="Crew Tab">
            <P>See exactly what everyone in your group is doing right now, updated in real time.</P>
            <ul style={ulStyle}>
              <li style={liStyle}>🟢 <strong>Here</strong> — at a show right now</li>
              <li style={liStyle}>🔵 <strong>Going to</strong> — planning to go to an upcoming show</li>
              <li style={liStyle}>☕ <strong>On break</strong> — taking a break, may include a note</li>
              <li style={liStyle}><strong>No status</strong> — hasn't set a status yet</li>
            </ul>
            <Tip>If someone has added a reaction or location note, you'll see it below their show name on their Crew card.</Tip>
          </SubSection>
        </Section>

        <Section title="Setting Your Status">
          <SubSection title="Marking yourself at a show">
            <P>Tap any set in the Schedule or Now tab to open the status sheet:</P>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>I'm Here</strong> — available for currently active sets</li>
              <li style={liStyle}><strong>Going when it starts</strong> — available for future sets not yet started</li>
            </ul>
          </SubSection>

          <SubSection title="Your status pills">
            <P>At the top of the Now screen, your own status appears as tappable pills:</P>
            <ul style={ulStyle}>
              <li style={liStyle}>Tap your <strong>At: [show]</strong> pill to add a reaction, location note, or go on break</li>
              <li style={liStyle}>Tap your <strong>Going to: [show]</strong> pill to clear that status</li>
              <li style={liStyle}>Tap your <strong>On break</strong> pill to edit your note or clear your break</li>
            </ul>
          </SubSection>

          <SubSection title="Adding a reaction or note">
            <P>Tap your "At: [show]" pill or tap your own dot on any show card. A sheet opens with:</P>
            <ul style={ulStyle}>
              <li style={liStyle}><strong>Reaction picker</strong> — choose up to 2: 💃 Dancing &nbsp;😎 Vibing &nbsp;❤️ Love it &nbsp;😐 Meh</li>
              <li style={liStyle}><strong>Location note</strong> — type where you're standing (e.g. "left side near the tree")</li>
              <li style={liStyle}>Tap <strong>Save</strong> to share with the crew. Reactions and notes appear on your Crew card.</li>
            </ul>
          </SubSection>

          <SubSection title="Going on break">
            <P>Tap your "At: [show]" pill and select "Go on break". Add an optional note like "grabbing food, back at 3". Your break clears automatically when you tap "I'm Here" or "Going when it starts" on any set.</P>
          </SubSection>

          <SubSection title="Clearing your status">
            <P>Tap any set you're marked at and tap "Clear my status" at the bottom of the sheet. Or tap your status pill and use the Clear option.</P>
          </SubSection>
        </Section>

        <Section title="Discovering Artists on Spotify">
          <P>Every status sheet has a Spotify link to help you preview any band before walking over.</P>
          <ul style={ulStyle}>
            <li style={liStyle}>Tap any set in the Schedule or Now tab to open the status sheet</li>
            <li style={liStyle}>Tap <strong>Listen on Spotify</strong> — opens Spotify's artist search for that band</li>
            <li style={liStyle}>On Android, the Spotify app opens directly if installed</li>
            <li style={liStyle}>If an artist isn't on Spotify, the search may return no results or similar artists — that's a Spotify data limitation</li>
            <li style={liStyle}>If you see multiple results for the same artist, pick the one with more followers or content</li>
          </ul>
          <Tip>Tap the Artists tab in Spotify search results to filter out songs, playlists and albums.</Tip>
        </Section>

        <Section title="Tips & Notes">
          <ul style={ulStyle}>
            <li style={liStyle}>You can be Here at one show and Going to another at the same time — useful for planning your next move while still at the current show</li>
            <li style={liStyle}>"Going" statuses automatically disappear when a show starts — if you're actually there, tap "I'm Here"</li>
            <li style={liStyle}>The Now tab sorts shows by how many friends are there — great for finding the crowd</li>
            <li style={liStyle}>Stage directions open Google Maps or Apple Maps depending on your phone</li>
            <li style={liStyle}>Your dot color stays consistent throughout the festival — your friends will learn to recognize your color</li>
          </ul>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 15,
        fontWeight: 700,
        color: '#38bdf8',
        letterSpacing: 0.2,
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '1px solid rgba(56,189,248,0.2)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function SubSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function P({ children }) {
  return (
    <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 8px' }}>
      {children}
    </p>
  )
}

function Tip({ children }) {
  return (
    <div style={{
      borderLeft: '3px solid #0ea5e9',
      paddingLeft: 12,
      marginTop: 10,
      marginBottom: 10,
      fontStyle: 'italic',
      fontSize: 13,
      color: '#7dd3fc',
      lineHeight: 1.5,
    }}>
      💡 {children}
    </div>
  )
}

const ulStyle = {
  margin: '0 0 8px',
  paddingLeft: 18,
}

const liStyle = {
  fontSize: 14,
  color: '#cbd5e1',
  lineHeight: 1.6,
  marginBottom: 4,
}
