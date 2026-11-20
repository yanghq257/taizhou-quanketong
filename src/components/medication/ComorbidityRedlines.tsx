import { ClipboardCheck, HeartPulse, ShieldAlert } from 'lucide-react'
import { comorbidityRules } from '../../data/safety'

export function ComorbidityRedlines() {
  return (
    <section aria-labelledby="comorbidity-heading" className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-1.5 text-danger-700">
            <HeartPulse className="h-3 w-3" aria-hidden="true" />
            Multimorbidity guardrail
          </p>
          <h2 id="comorbidity-heading" className="mt-1 text-base font-semibold text-ink">
            多病共存用药红线
          </h2>
          <p className="mt-1 max-w-2xl text-[10px] leading-5 text-slate-500">
            同时有高血压、糖尿病、肾病、心衰、抗凝或前列腺增生时，不能只按单一疾病开药。先看疾病组合、器官功能和监测计划，再决定是否处方。
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-danger-100 bg-danger-50 px-2.5 py-1 text-[9px] font-semibold text-danger-700 sm:inline-flex">
          开方前先做综合评估
        </span>
      </div>

      <div className="mt-3 grid gap-2.5 xl:grid-cols-2">
        {comorbidityRules.map((rule) => (
          <article
            key={rule.id}
            className="min-w-0 rounded-2xl border border-danger-100 bg-[linear-gradient(135deg,#FFF9F8_0%,#FFFFFF_80%)] p-4 shadow-[0_4px_18px_rgba(214,57,57,0.035)]"
          >
            <div className="flex items-start gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-danger-50 text-danger-600"
                aria-hidden="true"
              >
                <ShieldAlert className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h3 className="break-words text-sm font-semibold leading-5 text-ink">{rule.title}</h3>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {rule.comorbidities.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-danger-100 bg-white px-1.5 py-0.5 text-[9px] font-medium text-danger-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-2.5 break-words rounded-lg bg-white/80 px-2.5 py-2 text-[10px] leading-5 text-slate-600">
              <strong className="text-slate-700">药物示例：</strong>
              {rule.medicationExamples.join('、')}
            </p>

            <div className="mt-2 rounded-xl border border-danger-100/70 bg-danger-50/50 px-3 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-danger-700">风险</p>
              <p className="mt-1 text-[10px] leading-5 text-slate-600">{rule.risk}</p>
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-white/80 px-3 py-2.5">
                <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-jade-700">
                  <ClipboardCheck className="h-3 w-3" aria-hidden="true" />
                  综合评估
                </p>
                <ul className="mt-1.5 space-y-1">
                  {rule.assessment.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-[10px] leading-5 text-slate-600">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-jade-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white/80 px-3 py-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-700">监测</p>
                <ul className="mt-1.5 space-y-1">
                  {rule.monitoring.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-[10px] leading-5 text-slate-600">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-3 text-[9px] leading-5 text-slate-400">
        本模块是教学提示，不是完整相互作用数据库，也不构成处方建议。具体以药品说明书、院内目录和药师审核为准；不提供剂量。
      </p>
    </section>
  )
}
