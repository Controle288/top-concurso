const BRAZILIAN_HOLIDAYS = [
  '01-01',
  '04-21',
  '05-01',
  '09-07',
  '10-12',
  '11-02',
  '11-15',
  '12-25',
]

export function isHoliday(date: Date): boolean {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return BRAZILIAN_HOLIDAYS.includes(mmdd)
}

export function isBusinessDay(date: Date): boolean {
  return date.getDay() !== 0 && date.getDay() !== 6 && !isHoliday(date)
}

export function nextBusinessDay(date: Date): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + 1)
  while (!isBusinessDay(next)) {
    next.setDate(next.getDate() + 1)
  }
  return next
}
