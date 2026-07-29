import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    })),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useConcursos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty array when no concursos', async () => {
    const { useConcursos } = await import('@/lib/queries/useConcursos')
    const { result } = renderHook(() => useConcursos(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})

describe('useAulasConcluidasList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch when userId is undefined', async () => {
    const { useAulasConcluidasList } = await import('@/lib/queries/useAulas')
    const { result } = renderHook(() => useAulasConcluidasList(undefined), { wrapper: createWrapper() })
    expect(result.current.data).toBeUndefined()
  })
})

describe('useCursoAula', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch when aulaId is empty', async () => {
    const { useCursoAula } = await import('@/lib/queries/useCursos')
    const { result } = renderHook(() => useCursoAula(''), { wrapper: createWrapper() })
    expect(result.current.isPending).toBe(true)
  })
})
