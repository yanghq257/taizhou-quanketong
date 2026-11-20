import { ArrowRight, BookOpenCheck, Leaf, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Symptom } from '../../types'
import { TCM_TEN_QUESTIONS } from '../../data/tcm'
import { cn } from '../../lib/utils'

type ConsultMode = 'west' | 'tcm' | 'pattern'

const modes: Array<{ id: ConsultMode; label: string; icon: typeof Stethoscope }> = [
  { id: 'west', label: '西医 OPQRST', icon: Stethoscope },
  { id: 'tcm', label: '中医十问', icon: Leaf },
  { id: 'pattern', label: '舌脉证型', icon: BookOpenCheck },
]

export function DualConsultationPanel({ symptom }: { symptom: Symptom }) {
  const [mode, setMode] = useState<ConsultMode>('west')

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#F6FBF8_0%,#FFFFFF_70%)] p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Dual track inquiry</p>
            <h3 className="mt-1 text-base font-semibold text-ink">同一症状，两条问诊轨道</h3>
            <p className="mt-1 max-w-xl text-[11px] leading-5 text-slate-500">
              西医先完成危险分层与时间轴，中医再补寒热、汗、二便与舌脉。两边互不替代。
            </p>
          </div>
          <Link
            to={`/consult?symptom=${symptom.id}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-jade-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-jade-800 transition hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
          >
            打开问诊单
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div
          role="group"
          aria-label="问诊模式"
          className="mt-4 grid grid-cols-3 gap-1 rounded-xl border border-slate-200/80 bg-white p-1"
        >
          {modes.map((item) => {
            const active = mode === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(item.id)}
                className={cn(
                  'flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500',
                  active
                    ? 'bg-jade-800 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-jade-50 hover:text-jade-800',
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4 md:p-5">
        {mode === 'west' ? <WesternInquiry symptom={symptom} /> : null}
        {mode === 'tcm' ? <TcmInquiry symptom={symptom} /> : null}
        {mode === 'pattern' ? <PatternInquiry symptom={symptom} /> : null}
      </div>
    </div>
  )
}

function WesternInquiry({ symptom }: { symptom: Symptom }) {
  return (
    <div>
      <div className="mb-3 flex items-start gap-2.5 rounded-xl bg-jade-50/70 px-3 py-2.5">
        <Stethoscope className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jade-700" aria-hidden="true" />
        <p className="text-[11px] leading-5 text-jade-900/70">
          用 OPQRST 把时间轴和危险线索问完整；对老年、糖尿病、免疫抑制患者，不典型表现更常见。
        </p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {symptom.opqrst.map((item) => (
          <div
            key={item.letter}
            className="rounded-xl border border-slate-200/80 bg-[#FCFDFC] px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-jade-800 text-[11px] font-bold text-white">
                {item.letter}
              </span>
              <p className="text-[11px] font-semibold text-ink">{item.label}</p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-600">{item.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TcmInquiry({ symptom }: { symptom: Symptom }) {
  return (
    <div>
      <div className="mb-3 flex items-start gap-2.5 rounded-xl bg-amber-50/70 px-3 py-2.5">
        <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-[11px] leading-5 text-amber-800/80">
          十问是完整性框架；<strong>青色标记为本病追问重点</strong>。证型必须与舌脉和整体证候相互印证，不可凭单个症状套方。
        </p>
      </div>
      <div className="space-y-2">
        {TCM_TEN_QUESTIONS.map((question, index) => {
          const focus = symptom.tcmFocus[question.id]
          return (
            <div
              key={question.id}
              className={cn(
                'rounded-xl border px-3.5 py-3',
                focus
                  ? 'border-jade-100 bg-jade-50/55'
                  : 'border-slate-200/70 bg-white',
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md text-[9px] font-bold',
                    focus ? 'bg-jade-700 text-white' : 'bg-slate-100 text-slate-500',
                  )}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-ink">{question.label}</p>
                    {focus ? (
                      <span className="rounded bg-jade-100 px-1.5 py-0.5 text-[9px] font-medium text-jade-800">
                        本病重点
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">{question.prompt}</p>
                  {focus ? (
                    <p className="mt-1.5 border-l-2 border-jade-300 pl-2 text-[11px] leading-5 text-jade-800/80">
                      {focus}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PatternInquiry({ symptom }: { symptom: Symptom }) {
  return (
    <div>
      <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5">
        <BookOpenCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-[11px] leading-5 text-amber-800/85">
          快速记忆用：<strong>先看证据，再对证型</strong>。以下方剂仅为基础方学习示例，不给剂量；实际处方须由合格中医师辨证并核对院内药典。
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {symptom.tcmPatterns.map((pattern) => (
          <article
            key={pattern.id}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-ink">{pattern.name}</h4>
              <span className="rounded-full bg-jade-50 px-2 py-0.5 text-[9px] font-medium text-jade-700">
                证型速记
              </span>
            </div>

            <ul className="mt-2.5 space-y-1.5">
              {pattern.keySigns.map((sign) => (
                <li key={sign} className="flex items-start gap-1.5 text-[11px] leading-5 text-slate-600">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-jade-400" aria-hidden="true" />
                  {sign}
                </li>
              ))}
            </ul>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 px-2.5 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">舌</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-700">{pattern.tongue}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-2.5 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">脉</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-700">{pattern.pulse}</p>
              </div>
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="text-[10px] text-slate-400">治则</p>
              <p className="mt-0.5 text-[11px] font-medium leading-5 text-ink">{pattern.principle}</p>
              <p className="mt-2 text-[10px] text-slate-400">基础方</p>
              <p className="mt-0.5 text-[11px] font-medium leading-5 text-jade-800">{pattern.baseFormula}</p>
            </div>

            <div className="mt-auto pt-3">
              <details className="rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2">
                <summary className="cursor-pointer text-[10px] font-semibold text-amber-800">
                  用药边界与提醒
                </summary>
                <ul className="mt-1.5 space-y-1">
                  {pattern.cautions.map((caution) => (
                    <li key={caution} className="text-[10px] leading-5 text-amber-800/80">
                      · {caution}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
