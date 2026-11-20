import { AlertTriangle, CheckCircle2, Siren } from 'lucide-react'
import type { TriageInfo } from '../../types'
import { cn } from '../../lib/utils'

const urgencyStyles = {
  immediate: {
    wrapper: 'border-danger-100 bg-danger-50/75',
    iconWrap: 'bg-danger-100 text-danger-700',
    label: 'text-danger-700',
    title: 'text-danger-900',
    body: 'text-danger-900/75',
    bullet: 'bg-danger-600',
    Icon: Siren,
  },
  urgent: {
    wrapper: 'border-amber-100 bg-amber-50/80',
    iconWrap: 'bg-amber-100 text-amber-700',
    label: 'text-amber-700',
    title: 'text-ink',
    body: 'text-slate-600',
    bullet: 'bg-amber-600',
    Icon: AlertTriangle,
  },
  routine: {
    wrapper: 'border-jade-100 bg-jade-50/80',
    iconWrap: 'bg-jade-100 text-jade-700',
    label: 'text-jade-700',
    title: 'text-ink',
    body: 'text-slate-600',
    bullet: 'bg-jade-600',
    Icon: CheckCircle2,
  },
} as const

export function TriageBanner({ triage }: { triage: TriageInfo }) {
  const style = urgencyStyles[triage.urgency]
  const Icon = style.Icon

  return (
    <section
      className={cn('mt-4 rounded-2xl border p-4 md:p-5', style.wrapper)}
      aria-label="危险分层提示"
    >
      <div className="flex items-start gap-3">
        <span
          className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', style.iconWrap)}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className={cn('text-[10px] font-bold uppercase tracking-[0.16em]', style.label)}>
            危险分层 · {triage.label}
          </p>
          <p className={cn('mt-1 text-sm font-medium leading-6', style.title)}>{triage.message}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-black/[0.05] pt-3.5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          立即升级的触发条件
        </p>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {triage.criteria.map((criterion) => (
            <li
              key={criterion}
              className={cn('flex items-start gap-2 text-[11px] leading-5', style.body)}
            >
              <span className={cn('mt-2 h-1 w-1 shrink-0 rounded-full', style.bullet)} aria-hidden="true" />
              {criterion}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
