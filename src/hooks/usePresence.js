import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { schedule, parseSetTime, isSetActive, isSetUpcoming } from '../data/schedule'

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

export function usePresence(currentUserId) {
  const [presenceMap, setPresenceMap] = useState({}) // userId -> presence row
  const [profiles, setProfiles] = useState({})        // userId -> profile row
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
    if (data) {
      const map = {}
      data.forEach(row => { map[row.user_id] = row })
      setPresenceMap(map)
    }
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
            delete next[oldRow.user_id]
          } else {
            next[newRow.user_id] = newRow
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
    const staleIds = []

    Object.values(presenceMap).forEach(row => {
      if (row.status !== 'going') return
      const daySchedule = schedule[row.day]
      if (!daySchedule) return
      for (const stageObj of daySchedule) {
        for (const set of stageObj.sets) {
          if (set.artist === row.artist && stageObj.stage === row.stage) {
            const start = parseSetTime(set.start, row.day)
            if (now >= start) staleIds.push(row.user_id)
          }
        }
      }
    })

    if (staleIds.length === 0) return

    await supabase.from('presence').delete().in('user_id', staleIds)
    setPresenceMap(prev => {
      const next = { ...prev }
      staleIds.forEach(id => delete next[id])
      return next
    })
  }, [presenceMap])

  useEffect(() => {
    cleanupStaleGoing()
    const interval = setInterval(cleanupStaleGoing, 60_000)
    return () => clearInterval(interval)
  }, [cleanupStaleGoing])

  // Upsert own presence
  const setStatus = useCallback(async ({ day, stage, artist, start_time, end_time, status, break_note = null }) => {
    if (!currentUserId) return

    const row = { user_id: currentUserId, day, stage, artist, start_time, end_time, status, break_note, updated_at: new Date().toISOString() }

    // Optimistic update
    setPresenceMap(prev => ({ ...prev, [currentUserId]: row }))

    await supabase.from('presence').upsert(row, { onConflict: 'user_id' })
  }, [currentUserId])

  // Clear own presence
  const clearStatus = useCallback(async () => {
    if (!currentUserId) return

    // Optimistic update
    setPresenceMap(prev => {
      const next = { ...prev }
      delete next[currentUserId]
      return next
    })

    await supabase.from('presence').delete().eq('user_id', currentUserId)
  }, [currentUserId])

  // Set break status
  const setBreak = useCallback(async (breakNote = '') => {
    if (!currentUserId) return
    const row = {
      user_id: currentUserId,
      day: null,
      stage: null,
      artist: null,
      start_time: null,
      end_time: null,
      status: 'break',
      break_note: breakNote || null,
      updated_at: new Date().toISOString(),
    }
    setPresenceMap(prev => ({ ...prev, [currentUserId]: row }))
    await supabase.from('presence').upsert(row, { onConflict: 'user_id' })
  }, [currentUserId])

  const myPresence = presenceMap[currentUserId] || null

  // Get presence users for a specific set
  const getSetPresence = useCallback((stage, artist, day) => {
    return Object.values(presenceMap).filter(row =>
      row.stage === stage && row.artist === artist && row.day === day
    )
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
