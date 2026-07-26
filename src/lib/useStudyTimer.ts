import { useEffect, useRef, useCallback } from 'react'
import { supabase } from './supabase'

export function useStudyTimer(userId: string | undefined) {
  const startRef = useRef<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)

  const startTimer = useCallback(() => {
    if (!userId) return
    startRef.current = new Date()
    elapsedRef.current = 0
  }, [userId])

  const stopTimer = useCallback(async () => {
    if (!userId || !startRef.current) return
    const elapsed = Math.round((Date.now() - startRef.current.getTime()) / 60000)
    if (elapsed < 1) return

    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
      .from('study_sessions')
      .select('id, minutos')
      .eq('user_id', userId)
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
        .insert({ user_id: userId, data: today, minutos: elapsed })
    }

    startRef.current = null
  }, [userId])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { startTimer, stopTimer }
}
