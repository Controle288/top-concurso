import { describe, it, expect } from 'vitest'
import { urlBase64ToUint8Array } from '../notifications'

describe('urlBase64ToUint8Array', () => {
  it('converts a valid base64 string to Uint8Array', () => {
    const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    const result = urlBase64ToUint8Array(input)
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(0)
  })

  it('handles padding correctly', () => {
    const input = 'aGVsbG8='
    const result = urlBase64ToUint8Array(input)
    const decoded = new TextDecoder().decode(result)
    expect(decoded).toBe('hello')
  })

  it('handles URL-safe characters', () => {
    const input = 'dGVzdC11cmwtc2FmZQ=='
    const result = urlBase64ToUint8Array(input)
    const decoded = new TextDecoder().decode(result)
    expect(decoded).toBe('test-url-safe')
  })
})
