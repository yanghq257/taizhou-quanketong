import { ClipboardList, MessageCircle, Pill, Search, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

interface NavItem {
  path: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/', label: '查症状', icon: Search },
  { path: '/consult', label: '问诊单', icon: ClipboardList },
  { path: '/medications', label: '配药房', icon: Pill },
  { path: '/scripts', label: '话术库', icon: MessageCircle },
  { path: '/settings', label: '设置', icon: Settings },
]

function isActive(path: string, pathname: string): boolean {
  if (path === '/') return pathname === '/' || pathname.startsWith('/symptom/')
  if (path === '/settings') return pathname === '/settings' || pathname === '/checklist'
  return pathname === path
}

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-white/95 shadow-[0_-8px_30px_rgba(18,59,53,0.07)] backdrop-blur-xl md:bottom-4 md:left-1/2 md:right-auto md:w-[560px] md:-translate-x-1/2 md:rounded-2xl md:border md:border-slate-200/80 md:shadow-float"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 px-1.5 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 md:pb-1.5">
        {navItems.map((item) => {
          const active = isActive(item.path, pathname)
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500',
                active ? 'text-jade-800' : 'text-slate-500 hover:text-ink',
              )}
            >
              <span
                className={cn(
                  'grid h-7 w-11 place-items-center rounded-full transition duration-200',
                  active ? 'bg-jade-100 text-jade-800' : 'bg-transparent text-slate-500',
                )}
              >
                <Icon
                  className={cn('h-[19px] w-[19px]', active && 'stroke-[2.2]')}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
              </span>
              <span className={cn('truncate', active && 'font-semibold')}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
