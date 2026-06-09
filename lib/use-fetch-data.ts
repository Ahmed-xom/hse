import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseFetchDataOptions {
  table: string
  select?: string
  orderBy?: string
  ascending?: boolean
  eq?: { [key: string]: any }
}

export function useFetchData<T>(options: UseFetchDataOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        let query = supabase.from(options.table).select(options.select || '*')

        if (options.eq) {
          for (const [key, value] of Object.entries(options.eq)) {
            query = query.eq(key, value)
          }
        }

        if (options.orderBy) {
          query = query.order(options.orderBy, { ascending: options.ascending ?? true })
        }

        const { data: result, error: err } = await query

        if (err) throw err
        setData(result || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [options.table])

  return { data, loading, error }
}

export function useFetchSingleData<T>(table: string, id: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        const { data: result, error: err } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single()

        if (err) throw err
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, id])

  return { data, loading, error }
}
