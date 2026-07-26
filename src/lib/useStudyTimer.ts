import { useEffect, useRef, useCallback } from 'react'
import { supabase } from './supabase'

export function useStudyTimer(userId: string | undefined) {
  const startRef = useRef<Date | null>(null)
  const userIdRef = useRef(userId)
  userIdRef.current = userId

  const startTimer = useCallback(() => {
    if (!userIdRef.current) return
    startRef.current = new Date()
  }, [])

  const stopTimer = useCallback(async () => {
    const uid = userIdRef.current
    if (!uid || !startRef.current) return
    const elapsed = Math.round((Date.now() - startRef.current.getTime()) / 60000)
    if (elapsed < 1) return

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('study_sessions')
      .select('id, minutos')
      .eq('user_id', uid)
      .eq('data', today)
      .single()

    if (existing) {
      await supabase
        .from('study_sessions')
        .update({ minutos: existing.minutos + elapsed })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('study_sessions')
        .insert({ user_id: uid, data: today, minutos: elapsed })
    }

    startRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      stopTimer()
    }
  }, [stopTimer])

  return { startTimer, stopTimer }
}
