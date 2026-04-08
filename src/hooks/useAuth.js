import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)
  const [needsDisplayName, setNeedsDisplayName] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
        setNeedsDisplayName(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfile(data)
        setNeedsDisplayName(false)
        return
      }

      if (attempt < 2) await new Promise(r => setTimeout(r, 500))
    }
    setNeedsDisplayName(true)
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function saveDisplayName(displayName) {
    const userId = session.user.id
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, display_name: displayName })
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
      setNeedsDisplayName(false)
    }
    return { error }
  }

  return {
    session,
    profile,
    needsDisplayName,
    signInWithGoogle,
    signOut,
    saveDisplayName,
    loading: session === undefined,
  }
}
