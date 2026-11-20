import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { readJson, writeJson } from '../lib/utils'

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readJson<T>(key, initialValue))

  useEffect(() => {
    writeJson(key, value)
  }, [key, value])

  return [value, setValue]
}
