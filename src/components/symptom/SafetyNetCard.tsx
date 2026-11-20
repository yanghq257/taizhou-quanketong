import { ShieldCheck } from 'lucide-react'
import type { SafetyNet } from '../../types'
import { buildSafetyNetText } from '../../lib/soap'
import { cn } from '../../lib/utils'
import { CopyButton } from '../CopyButton'

export function SafetyNetCard({
  safetyNet,
  className,
}: {
  safetyNet: SafetyNet
  className?: string
}) {
  return (
    <section
      aria-label="离院安全网"
      className={cn(
        'rounded-2xl border border-amber-200/80 bg-[linear-gradient(135deg,#FFFBF0_0%,#FFFDF8_65%,#FFFFFF_100%)] p-4',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Safety netting
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-ink">安全网 · 离院前必须交代</h3>
          </div>
        </div>
        <span className="rounded-full border border-amber-200 bg-white/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
          必讲
        </span>
      </div>

      <div className="mt-3 rounded-xl border border-amber-100/80 bg-white/80 px-3.5 py-3">
        <p className="text-[11px] font-semibold leading-5 text-amber-900">
          如果出现以下任一情况，请立刻复诊/去急诊：
        </p>
        <ul className="mt-2 space-y-1.5">
          {safetyNet.triggers.map((trigger, index) => (
            <li
              key={trigger}
              className="flex items-start gap-2 text-[11px] leading-5 text-slate-600"
            >
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-800">
                {index + 1}
              </span>
              {trigger}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2.5 text-[11px] font-medium leading-5 text-amber-900/85">
        {safetyNet.action}
      </p>
      <p className="mt-1 text-[10px] leading-5 text-slate-500">
        <span className="font-semibold text-slate-600">随访要求：</span>
        {safetyNet.followUp}
      </p>

      <div className="mt-3 flex justify-end">
        <CopyButton
          text={buildSafetyNetText(safetyNet)}
          label="复制安全网话术"
          copiedLabel="安全网已复制"
        />
      </div>
    </section>
  )
}
