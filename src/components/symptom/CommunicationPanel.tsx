import { AlertCircle, MessageSquareQuote, Route } from 'lucide-react'
import type { SymptomCommunication } from '../../types'
import { CopyButton } from '../CopyButton'

export function CommunicationPanel({
  symptomName,
  communication,
}: {
  symptomName: string
  communication: SymptomCommunication
}) {
  const copyText = [
    `台州全科通 · ${symptomName}沟通提纲`,
    '',
    '【向患者通俗解释】',
    ...communication.plainLanguage.map((line, index) => `${index + 1}. ${line}`),
    '',
    '【转诊 / 升级沟通】',
    ...communication.referral.map((line, index) => `${index + 1}. ${line}`),
    '',
    '【需要避免】',
    ...communication.pitfalls.map((line) => `- ${line}`),
    '',
    '提示：教学模板，请按患者理解能力和实际情况调整。',
  ].join('\n')

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-[linear-gradient(135deg,#FAFCFB_0%,#FFFDF8_80%)] p-4 md:p-5">
        <div>
          <p className="eyebrow">Symptom explainer</p>
          <h3 className="mt-1 text-base font-semibold text-ink">把风险讲清楚，不靠吓唬</h3>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            顺序：先回应担忧 → 说明要排除什么 → 给出下一步 → 请患者复述回诊红线。
          </p>
        </div>
        <CopyButton text={copyText} label="复制沟通提纲" copiedLabel="提纲已复制" />
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-2 md:p-5">
        <div className="rounded-2xl border border-jade-100 bg-jade-50/40 p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-jade-700 shadow-sm">
              <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-jade-600">
                Plain language
              </p>
              <h4 className="text-xs font-semibold text-ink">跟老年患者这样解释</h4>
            </div>
          </div>
          <ol className="mt-3 space-y-2.5">
            {communication.plainLanguage.map((line, index) => (
              <li key={line} className="flex gap-2.5 text-[11px] leading-5 text-jade-950/75">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-jade-700">
                  {index + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/45 p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-amber-700 shadow-sm">
              <Route className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-600">
                Referral script
              </p>
              <h4 className="text-xs font-semibold text-ink">转诊 / 劝退话术</h4>
            </div>
          </div>
          <ol className="mt-3 space-y-2.5">
            {communication.referral.map((line, index) => (
              <li key={line} className="flex gap-2.5 text-[11px] leading-5 text-amber-950/75">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-amber-700">
                  {index + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-4 mb-4 rounded-2xl border border-slate-200/80 bg-[#FCFDFC] px-4 py-3 md:mx-5 md:mb-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
          <AlertCircle className="h-3.5 w-3.5 text-danger-600" aria-hidden="true" />
          避坑提示
        </p>
        <ul className="mt-2 grid gap-1.5 md:grid-cols-2">
          {communication.pitfalls.map((pitfall) => (
            <li key={pitfall} className="flex items-start gap-1.5 text-[10px] leading-5 text-slate-500">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-danger-400" aria-hidden="true" />
              {pitfall}
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-slate-100 bg-sand/40 px-4 py-3 text-[10px] leading-5 text-amber-800/70 md:px-5">
        方言提醒：台州各县（市、区）口音差异大，不建议自创方言谐音。优先用普通话慢速、短句交流；需要时请家属协助转述，但关键知情与复述仍应让患者参与。
      </p>
    </div>
  )
}
