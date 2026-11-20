import { useCallback, useEffect, useRef, useState } from 'react'
import type { HospitalSettings } from '../types'
import { readJson, writeJson } from '../lib/utils'

export const SETTINGS_KEY = 'tkt:hospital-settings:v1'
export const CHECKLIST_KEY = 'tkt:checklist:v1'
export const SETTINGS_UPDATED_EVENT = 'tkt:settings-updated'

const defaultSettings: HospitalSettings = {
  department: '全科医学科',
  emergencyPhone: '',
  showLargeText: false,
}

function normalizeSettings(value: Partial<HospitalSettings> | null): HospitalSettings {
  return {
    ...defaultSettings,
    ...(value ?? {}),
  }
}

export function useHospitalSettings() {
  const [settings, setSettings] = useState<HospitalSettings>(() =>
    normalizeSettings(readJson<Partial<HospitalSettings> | null>(SETTINGS_KEY, null)),
  )
  const settingsRef = useRef(settings)

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const saveSettings = useCallback((patch: Partial<HospitalSettings>) => {
    // 在事件处理器中完成持久化和广播，避免在 state updater 内产生副作用。
    const next = normalizeSettings({ ...settingsRef.current, ...patch })
    settingsRef.current = next
    setSettings(next)
    writeJson(SETTINGS_KEY, next)
    window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT))
  }, [])

  useEffect(() => {
    const sync = () => {
      setSettings(normalizeSettings(readJson<Partial<HospitalSettings> | null>(SETTINGS_KEY, null)))
    }
    const syncStorage = (event: StorageEvent) => {
      if (event.key === SETTINGS_KEY) sync()
    }

    window.addEventListener(SETTINGS_UPDATED_EVENT, sync)
    window.addEventListener('storage', syncStorage)
    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, sync)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', settings.showLargeText)
  }, [settings.showLargeText])

  return { settings, saveSettings }
}
