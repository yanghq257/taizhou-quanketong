import { Siren, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Brand } from './Brand'
import { EmergencySheet } from './EmergencySheet'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

export function AppShell() {
  const { pathname } = useLocation()
  const online = useOnlineStatus()
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-xl bg-jade-800 px-4 py-2 text-sm font-medium text-white shadow-lg transition focus:translate-y-0"
      >
        跳到主要内容
      </a>

      <header className="sticky top-0 z-40 border-b border-white/60 bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-app items-center justify-between gap-3 px-4 md:px-6">
          <Brand compact />
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="hidden rounded-full border border-amber-100 bg-sand px-2.5 py-1 text-[10px] font-medium text-amber-700 sm:inline-flex">
              教学演示
            </span>
            <span
              className="hidden items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium text-slate-500 md:flex"
              aria-live="polite"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-jade-500' : 'bg-amber-600'}`}
              />
              {online ? '在线' : '离线可查'}
            </span>
            <button
              type="button"
              onClick={() => setEmergencyOpen(true)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-danger-100 bg-danger-50 px-2.5 py-1.5 text-xs font-semibold text-danger-700 transition hover:border-danger-200 hover:bg-danger-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-600 focus-visible:ring-offset-2"
              aria-label="打开红旗急症速查"
            >
              <Siren className="h-4 w-4" aria-hidden="true" />
              <span className="min-[420px]:hidden">红旗</span>
              <span className="hidden min-[420px]:inline">红旗速查</span>
            </button>
          </div>
        </div>
      </header>

      {!online ? (
        <div
          role="status"
          className="border-b border-amber-100 bg-sand px-4 py-2 text-center text-[11px] font-medium text-amber-700"
        >
          <WifiOff className="mr-1.5 inline h-3 w-3" aria-hidden="true" />
          当前离线，已缓存的学习内容仍可查阅；数据不会上传。
        </div>
      ) : null}

      <main id="main-content" className="mx-auto w-full max-w-app px-4 pb-28 pt-1 md:px-6 md:pb-32 md:pt-2">
        <Outlet />
      </main>

      <BottomNav />
      <EmergencySheet open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  )
}
