import { AlertTriangle, Check, ClipboardCheck, RotateCcw, Siren } from 'lucide-react'
import { useState } from 'react'
import { renewalChecklistItems } from '../../data/renewal'
import { cn, percent } from '../../lib/utils'

export function RenewalChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const total = renewalChecklistItems.length
  const completed = renewalChecklistItems.filter((item) => checked[item.id]).length
  const criticalPending = renewalChecklistItems.filter(
    (item) => item.critical && !checked[item.id],
  ).length
  const progress = percent(completed, total)

  function toggle(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <section className="mt-4" aria-labelledby="renewal-heading">
      <div className="mb-3">
        <p className="eyebrow">Renewal safety checklist</p>
        <h2 id="renewal-heading" className="mt-0.5 text-base font-semibold text-ink">
          续药 / 复检安全核对
        </h2>
        <p className="mt-1 max-w-2xl text-[10px] leading-5 text-slate-500">
          续药不是“照上次再开一遍”。先核对随访周期、肝肾功能、新发症状和血压控制，再决定是否续方或转诊。
        </p>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-jade-100 bg-[linear-gradient(135deg,#F1FAF6_0%,#FFFFFF_70%,#FBF8F1_120%)] p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">
              已完成 <span className="text-jade-700">{completed}</span>
              <span className="text-xs font-normal text-slate-500"> / {total} 项</span>
            </p>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              {criticalPending > 0 ? (
                <span className="font-medium text-danger-700">仍有 {criticalPending} 项重点项未核对</span>
              ) : (
                <span className="font-medium text-jade-700">重点项已全部核对 ✓</span>
              )}
              <span className="mx-1.5 text-slate-300">·</span>
              本页不保存患者数据
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold tracking-tight text-jade-800">{progress}%</p>
            <button
              type="button"
              onClick={() => setChecked({})}
              disabled={completed === 0}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-500 transition hover:border-danger-100 hover:text-danger-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              重置
            </button>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-jade-100/60">
          <div
            className="h-full rounded-full bg-jade-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="续药与复检核对进度"
          />
        </div>

        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50/65 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger-600" aria-hidden="true" />
          <p className="text-[10px] leading-5 text-danger-900/80">
            <strong>单纯续降压药也要先测血压。</strong>
            如果患者只是来续降压药，必须核对本次血压是否达标，不能盲目续药。
          </p>
        </div>
      </div>

      <div className="surface-card mt-3 divide-y divide-slate-100 px-4 md:px-5">
        {renewalChecklistItems.map((item) => {
          const isChecked = Boolean(checked[item.id])
          return (
            <label
              key={item.id}
              className="group flex cursor-pointer items-start gap-3 py-3.5 focus-within:rounded-xl focus-within:bg-jade-50/40 focus-within:outline-none focus-within:ring-2 focus-within:ring-jade-400"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition',
                  isChecked
                    ? 'border-jade-700 bg-jade-700 text-white'
                    : 'border-slate-300 bg-white text-transparent group-hover:border-jade-400',
                )}
                aria-hidden="true"
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      'text-xs font-semibold leading-5',
                      isChecked ? 'text-slate-400 line-through decoration-slate-300' : 'text-ink',
                    )}
                  >
                    {item.title}
                  </span>
                  {item.critical ? (
                    <span className="inline-flex items-center gap-0.5 rounded bg-danger-50 px-1.5 py-0.5 text-[8px] font-semibold text-danger-700">
                      <Siren className="h-2.5 w-2.5" aria-hidden="true" />
                      重点
                    </span>
                  ) : null}
                  {item.institutionSpecific ? (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-medium text-slate-500">
                      本院核对
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-[10px] leading-5 text-slate-500">{item.detail}</span>
              </span>
            </label>
          )
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-sand/70 px-3.5 py-2.5">
        <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-[10px] leading-5 text-amber-800/80">
          本清单仅用于本次接诊的临时核对，不保存患者信息、不写入病历。续药前仍需核对院内目录、说明书、过敏史和药师意见。
        </p>
      </div>
    </section>
  )
}
