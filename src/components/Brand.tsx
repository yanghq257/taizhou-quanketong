import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-jade-800 text-white shadow-sm',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
        <path
          d="M8 23c0-8 6-14 16-15-1 9-6 14-15 16"
          fill="#9FE2CF"
          fillOpacity="0.28"
        />
        <path
          d="M28 8c-1.2 6.3-4.7 10.2-10.6 12.1"
          stroke="#D8F7EC"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M20 12.5v15M12.5 20h15"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M8.5 9.5h7M8.5 14.5h4.5"
          stroke="#B8EEDD"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </span>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
      aria-label="台州全科通首页"
    >
      <LogoMark className={compact ? 'h-8 w-8 rounded-xl' : undefined} />
      <span className="min-w-0">
        <span className={cn('block font-semibold tracking-tight text-ink', compact ? 'text-sm' : 'text-[15px]')}>
          台州全科通
        </span>
        <span className={cn('block truncate text-slate-500', compact ? 'text-[10px]' : 'text-[11px]')}>
          台州市中医院 · 首诊学习
        </span>
      </span>
    </Link>
  )
}
