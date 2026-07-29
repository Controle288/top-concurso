import { describe, it, expect } from 'vitest'

function isBusinessDay(date: Date): boolean {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    if (isBusinessDay(result)) added++
  }
  return result
}

describe('businessDays', () => {
  it('identifies Monday as business day', () => {
    const monday = new Date(2026, 6, 27)
    expect(monday.getDay()).toBe(1)
    expect(isBusinessDay(monday)).toBe(true)
  })

  it('identifies Saturday as non-business day', () => {
    const saturday = new Date(2026, 7, 1)
    expect(saturday.getDay()).toBe(6)
    expect(isBusinessDay(saturday)).toBe(false)
  })

  it('identifies Sunday as non-business day', () => {
    const sunday = new Date(2026, 7, 2)
    expect(sunday.getDay()).toBe(0)
    expect(isBusinessDay(sunday)).toBe(false)
  })

  it('adds business days skipping weekends', () => {
    const friday = new Date(2026, 6, 31)
    expect(friday.getDay()).toBe(5)
    const nextWednesday = addBusinessDays(friday, 3)
    expect(nextWednesday.getDay()).toBe(3)
    expect(nextWednesday.getDate()).toBe(5)
  })
})
