import { Check, ClipboardCheck, FlaskConical, Pill, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ExamTiming, Symptom } from '../../types'
import { formulaMap } from '../../data/formulas'
import { medicationMap } from '../../data/medications'
import { cn, percent } from '../../lib/utils'

const timingStyle: Record<ExamTiming, string> = {
  立即: 'border-danger-200 bg-danger-50 text-danger-700',
  当日: 'border-amber-200 bg-amber-50 text-amber-700',
  按需: 'border-jade-200 bg-jade-50 text-jade-700',
  择期: 'border-slate-200 bg-slate-50 text-slate-600',
}

export function WorkupPanel({ symptom }: { symptom: Symptom }) {
  const [checkedExams, setCheckedExams] = useState<Set<string>>(() => new Set())
  const meds = symptom.medicationIds
    .map((id) => medicationMap.get(id))
    .filter((item) => item !== undefined)
  const relevantFormulas = symptom.formulaIds
    .map((id) => formulaMap.get(id))
    .filter((item) => item !== undefined)
  const progress = percent(checkedExams.size, symptom.exams.length)

  function toggleExam(id: string) {
    setCheckedExams((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
      <section className="surface-card overflow-hidden" aria-label="检查开单清单">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#F7FBF9_0%,#FFFFFF_75%)] p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow flex items-center gap-1.5">
                <FlaskConical className="h-3 w-3" aria-hidden="true" />
                Workup checklist
              </p>
              <h3 className="mt-1 text-base font-semibold text-ink">首诊检查 · 最容易漏开</h3>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                勾选仅用于本页核对，不写入病历、不上传。实际开单须结合适应证与院内路径。
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-jade-100 bg-jade-50 px-2.5 py-1 text-[10px] font-semibold text-jade-800">
              {checkedExams.size}/{symptom.exams.length}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-jade-50">
            <div
              className="h-full rounded-full bg-jade-600 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="检查清单核对进度"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 px-4 md:px-5">
          {symptom.exams.map((exam) => {
            const checked = checkedExams.has(exam.id)
            return (
              <label
                key={exam.id}
                className="group flex cursor-pointer items-start gap-3 py-3.5 transition focus-within:rounded-xl focus-within:bg-jade-50/40 focus-within:outline-none focus-within:ring-2 focus-within:ring-jade-400"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleExam(exam.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition',
                    checked
                      ? 'border-jade-700 bg-jade-700 text-white'
                      : 'border-slate-300 bg-white text-transparent group-hover:border-jade-400',
                  )}
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={cn('text-xs font-semibold', checked ? 'text-slate-400 line-through' : 'text-ink')}>
                      {exam.name}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                        timingStyle[exam.timing],
                      )}
                    >
                      {exam.timing}
                    </span>
                    <span className="text-[9px] text-slate-400">{exam.category}</span>
                  </span>
                  <span className="mt-1 block text-[10px] leading-5 text-slate-500">{exam.rationale}</span>
                </span>
              </label>
            )
          })}
        </div>

        <div className="border-t border-slate-100 bg-sand/60 px-4 py-3.5 md:px-5">
          <p className="text-[10px] leading-5 text-amber-800/85">
            <strong>漏开提醒：</strong>危急患者先处置后补单；育龄女性腹痛/晕厥先想 β-hCG；胸痛有设备先做心电图；用药/影像前核对妊娠、肾功能和过敏。
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] text-slate-400">学习用清单，非正式医嘱</span>
            {checkedExams.size > 0 ? (
              <button
                type="button"
                onClick={() => setCheckedExams(new Set())}
                className="text-[10px] font-medium text-jade-700 underline-offset-4 hover:underline"
              >
                清空勾选
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden" aria-label="相关药物与方剂">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#FBFAF5_0%,#FFFFFF_75%)] p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow flex items-center gap-1.5 text-amber-700">
                <Pill className="h-3 w-3" aria-hidden="true" />
                Medication guardrail
              </p>
              <h3 className="mt-1 text-base font-semibold text-ink">相关药与基础方</h3>
            </div>
            <Link
              to="/medications"
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-600 transition hover:border-jade-200 hover:text-jade-700"
            >
              配药房
            </Link>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            规格为待核对示例；此处不提供剂量。所有处方须核对院内目录、说明书、过敏和相互作用。
          </p>
        </div>

        <div className="space-y-2.5 p-4 md:p-5">
          {meds.map((med) => (
            <div
              key={med.id}
              className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-xs font-semibold text-ink">{med.name}</h4>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                  {med.kind}
                </span>
                <span className="ml-auto rounded-full border border-amber-100 bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
                  {med.prescriptionType}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">{med.specs}</p>
              <ul className="mt-2 space-y-1">
                {med.cautions.slice(0, 2).map((caution) => (
                  <li key={caution} className="flex items-start gap-1.5 text-[10px] leading-5 text-slate-600">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    {caution}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-xl border border-jade-100 bg-jade-50/45 p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-jade-800">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              辨证基础方（无剂量）
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {relevantFormulas.map((formula) => (
                <span
                  key={formula.id}
                  className="rounded-lg border border-jade-100 bg-white px-2 py-1 text-[10px] font-medium text-jade-800"
                  title={formula.principle}
                >
                  {formula.name}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-5 text-jade-700/70">
              先辨证再选方；中药与西药的相互作用、妊娠禁忌和肝肾功能边界必须核对。
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-danger-100 bg-danger-50/60 px-3 py-2.5">
            <ClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger-600" aria-hidden="true" />
            <p className="text-[10px] leading-5 text-danger-800/80">
              本症状相关中成药不得相互叠加；含麻黄、活血化瘀、含蟾酥或含乙醇剂型需特别核对。详细红灯请进入配药房。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
