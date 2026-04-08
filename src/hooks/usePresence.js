import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { schedule, parseSetTime } from '../data/schedule'

// Derive consistent color index from UUID
export function getUserColorIndex(userId) {
  if (!userId) return 0
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return hash % 6
}

export const USER_COLORS = [
  { bg: '#22c55e', text: '#fff' },  // green
  { bg: '#3b82f6', text: '#fff' },  // blue
  { bg: '#a855f7', text: '#fff' },  // purple
  { bg: '#f97316', text: '#fff' },  // orange
  { bg: '#ec4899', text: '#fff' },  // pink
  { bg: '#14b8a6', text: '#fff' },  // teal
]

// 'going' gets its own slot; 'here' and 'break' share the 'here' slot
function slotFor(status) {
  return status === 'going' ? 'going' : 'here'
}

function buildPresenceMap(rows) {
  const map = {}
  rows.forEach(row => {
    if (!map[row.user_id]) map[row.user_id] = { here: null, going: null }
    map[row.user_id][slotFor(row.status)] = row
  })
  return map
}

// presenceMap shape: { [userId]: { here: row|null, going: row|null } }
// 'here' slot holds status='here' OR status='break'
// 'going' slot holds status='going'

export function usePresence(currentUserId) {
  const [presenceMap, setPresenceMap] = useState({})
  const [profiles, setProfiles] = useState({})
  const channelRef = useRef(null)

  // Load all profiles once
  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(p => { map[p.id] = p })
        setProfiles(map)
      }
    })
  }, [])

  // Load all presence rows
  const loadPresence = useCallback(async () => {
    const { data } = await supabase.from('presence').select('*')
    if (data) setPresenceMap(buildPresenceMap(data))
  }, [])

  useEffect(() => {
    loadPresence()
  }, [loadPresence])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('presence-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presence' }, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload
        setPresenceMap(prev => {
          const next = { ...prev }
          if (eventType === 'DELETE') {
            const uid = oldRow.user_id
            const slot = slotFor(oldRow.status)
            if (next[uid]) {
              next[uid] = { ...next[uid], [slot]: null }
              if (!next[uid].here && !next[uid].going) delete next[uid]
            }
          } else {
            const uid = newRow.user_id
            const slot = slotFor(newRow.status)
            next[uid] = { ...(next[uid] || { here: null, going: null }), [slot]: newRow }
          }
          return next
        })
      })
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [])

  // Stale "going" cleanup — run on mount and every 60s
  const cleanupStaleGoing = useCallback(async () => {
    const now = new Date()
    const staleUserIds = []

    Object.entries(presenceMap).forEach(([userId, userPresence]) => {
      const row = userPresence.going
      if (!row) return
      const daySchedule = schedule[row.day]
      if (!daySchedule) return
      for (const stageObj of daySchedule) {
        for (const set of stageObj.sets) {
          if (set.artist === row.artist && stageObj.stage === row.stage) {
            const start = parseSetTime(set.start, row.day)
            if (now >= start) staleUserIds.push(userId)
          }
        }
      }
    })

    if (staleUserIds.length === 0) return

    await supabase.from('presence')
      .delete()
      .in('user_id', staleUserIds)
      .eq('status', 'going')

    setPresenceMap(prev => {
      const next = { ...prev }
      staleUserIds.forEach(uid => {
        if (next[uid]) {
          next[uid] = { ...next[uid], going: null }
          if (!next[uid].here && !next[uid].going) delete next[uid]
        }
      })
      return next
    })
  }, [presenceMap])

  useEffect(() => {
    cleanupStaleGoing()
    const interval = setInterval(cleanupStaleGoing, 60_000)
    return () => clearInterval(interval)
  }, [cleanupStaleGoing])

  // Upsert a here or going status for a specific set
  const setStatus = useCallback(async ({ day, stage, artist, start_time, end_time, status }) => {
    if (!currentUserId) return
    const row = {
      user_id: currentUserId,
      day, stage, artist, start_time, end_time,
      status,
      break_note: null,
      updated_at: new Date().toISOString(),
    }
    const slot = slotFor(status)
    // Optimistic update
    setPresenceMap(prev => ({
      ...prev,
      [currentUserId]: { ...(prev[currentUserId] || { here: null, going: null }), [slot]: row },
    }))
    await supabase.from('presence').upsert(row, { onConflict: 'user_id,status' })
  }, [currentUserId])

  // Delete a single status row for the current user
  const clearStatus = useCallback(async (status) => {
    if (!currentUserId) return
    const slot = slotFor(status)
    // Optimistic update
    setPresenceMap(prev => {
      const updated = { ...(prev[currentUserId] || { here: null, going: null }), [slot]: null }
      const next = { ...prev }
      if (!updated.here && !updated.going) {
        delete next[currentUserId]
      } else {
        next[currentUserId] = updated
      }
      return next
    })
    await supabase.from('presence')
      .delete()
      .eq('user_id', currentUserId)
      .eq('status', status)
  }, [currentUserId])

  // Set break — replaces the here slot, leaves going untouched
  const setBreak = useCallback(async (breakNote = '') => {
    if (!currentUserId) return
    const row = {
      user_id: currentUserId,
      day: null, stage: null, artist: null,
      start_time: null, end_time: null,
      status: 'break',
      break_note: breakNote || null,
      updated_at: new Date().toISOString(),
    }
    // Optimistic: replace here slot with break row
    setPresenceMap(prev => ({
      ...prev,
      [currentUserId]: { ...(prev[currentUserId] || { here: null, going: null }), here: row },
    }))
    // Delete any existing 'here' row first, then upsert 'break'
    await supabase.from('presence').delete().eq('user_id', currentUserId).eq('status', 'here')
    await supabase.from('presence').upsert(row, { onConflict: 'user_id,status' })
  }, [currentUserId])

  const myPresence = presenceMap[currentUserId] || { here: null, going: null }

  // Get all presence rows for a specific set, optionally filtered by status slot
  // statusFilter: 'here' | 'going' | undefined (both)
  const getSetPresence = useCallback((stage, artist, day, statusFilter) => {
    const results = []
    Object.entries(presenceMap).forEach(([userId, userPresence]) => {
      const slots = statusFilter ? [statusFilter] : ['here', 'going']
      slots.forEach(slot => {
        const row = userPresence[slot]
        if (row && row.stage === stage && row.artist === artist && row.day === day) {
          results.push(row)
        }
      })
    })
    return results
  }, [presenceMap])

  return {
    presenceMap,
    profiles,
    myPresence,
    setStatus,
    clearStatus,
    setBreak,
    getSetPresence,
    getUserColor: (userId) => USER_COLORS[getUserColorIndex(userId)],
  }
}
