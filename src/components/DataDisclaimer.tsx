import { ShieldAlert } from 'lucide-react'
import { cn } from '../lib/utils'

interface DataDisclaimerProps {
  compact?: boolean
  className?: string
}

export function DataDisclaimer({ compact = false, className }: DataDisclaimerProps) {
  if (compact) {
    return (
      <p className={cn('flex items-start gap-2 text-[11px] leading-5 text-slate-500', className)}>
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
        <span>教学演示数据，不替代诊疗规范与院内制度；处方前须由上级/药师核对。</span>
      </p>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-amber-100 bg-sand/80 px-4 py-3.5 text-xs leading-5 text-slate-600',
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong className="font-semibold text-ink">教学演示 · 非正式诊疗规范。</strong>{' '}
          本应用内容与药品规格均为待审核示例，不能替代医院制度、指南、上级医师判断或药师审核；不用于直接给患者下诊断或处方。
        </p>
      </div>
    </div>
  )
}
