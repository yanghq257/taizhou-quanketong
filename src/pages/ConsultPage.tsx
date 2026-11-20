import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Leaf,
  ListChecks,
  RotateCcw,
  Siren,
  Stethoscope,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CopyButton } from '../components/CopyButton'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { PageHeader } from '../components/PageHeader'
import { TCM_TEN_QUESTIONS } from '../data/tcm'
import { getSymptom, symptoms } from '../data/symptoms'
import { cn, percent } from '../lib/utils'

export function ConsultPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const symptom = getSymptom(searchParams.get('symptom') ?? '') ?? symptoms[0]
  const [checked, setChecked] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    document.title = '问诊单 · 台州全科通'
  }, [])

  useEffect(() => {
    setChecked(new Set())
  }, [symptom.id])

  const totalQuestions = symptom.opqrst.length + TCM_TEN_QUESTIONS.length
  const progress = percent(checked.size, totalQuestions)

  const outline = useMemo(() => {
    const western = symptom.opqrst.map((item) => {
      const key = `west:${item.letter}`
      return `- ${item.letter} ${item.label}：${item.prompt}${checked.has(key) ? ' [已问]' : ''}`
    })
    const tcm = TCM_TEN_QUESTIONS.map((item) => {
      const key = `tcm:${item.id}`
      const focus = symptom.tcmFocus[item.id]
      return `- ${item.label}：${focus ? `${focus}（本病重点）` : item.prompt}${checked.has(key) ? ' [已问]' : ''}`
    })

    return [
      '台州全科通 · 首诊问诊提纲（学习用）',
      `症状：${symptom.name}`,
      '说明：本提纲不包含患者身份信息，不自动写入病历。',
      '',
      '【红旗核对】',
      ...symptom.triage.criteria.map((item) => `- ${item}`),
      '',
      '【西医 OPQRST】',
      ...western,
      '',
      '【中医十问】',
      ...tcm,
      '',
      '【舌脉与证型】',
      ...symptom.tcmPatterns.map((pattern) => `- ${pattern.name}：舌${pattern.tongue}，脉${pattern.pulse}；基础方 ${pattern.baseFormula}`),
      '',
      '提示：复制后请按实际问诊结果修改，不得将未询问内容写成已问。',
    ].join('\n')
  }, [checked, symptom])

  function selectSymptom(id: string) {
    setSearchParams({ symptom: id }, { replace: true })
    setChecked(new Set())
  }

  function toggle(key: string) {
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div>
      <PageHeader
        eyebrow="First-visit inquiry"
        title="首诊问诊单"
        description="选一个症状，逐项问完西医 OPQRST 与中医十问。勾选只在本页临时保存，离开即清空。"
      />

      <div className="surface-card p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label htmlFor="consult-symptom" className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              本次问诊症状
            </label>
            <div className="relative mt-1.5">
              <select
                id="consult-symptom"
                value={symptom.id}
                onChange={(event) => selectSymptom(event.target.value)}
                className="form-input appearance-none pr-9 text-[15px] font-medium"
              >
                {symptoms.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.category}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
              <span>本症状 {totalQuestions} 个问诊要点</span>
              <Link
                to={`/symptom/${symptom.id}`}
                className="inline-flex items-center gap-0.5 font-medium text-jade-700 underline-offset-4 hover:underline"
              >
                查看鉴别与证型
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-jade-100 bg-jade-50/55 px-4 py-3 md:min-w-[250px]">
            <div aria-live="polite">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-jade-700">已完成</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">
                {checked.size}
                <span className="text-xs font-normal text-slate-500"> / {totalQuestions} 项</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-jade-800">{progress}%</p>
              <button
                type="button"
                onClick={() => setChecked(new Set())}
                disabled={checked.size === 0}
                className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 transition hover:text-jade-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                重置
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-jade-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="问诊完成度"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-slate-400">临时核对 · 不上传 · 离开后可清空</p>
          <CopyButton text={outline} label="复制问诊提纲" copiedLabel="提纲已复制" />
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-danger-100 bg-danger-50/60 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <Siren className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold text-danger-900">先完成红旗核对，再问中医十问</p>
            <p className="mt-1 text-[10px] leading-5 text-danger-800/75">{symptom.triage.message}</p>
            <Link
              to={`/symptom/${symptom.id}`}
              className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-danger-700 underline-offset-4 hover:underline"
            >
              查看本症状全部升级条件
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="space-y-4">
          <section className="surface-card overflow-hidden" aria-labelledby="western-inquiry-title">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3.5 md:px-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-jade-800 text-white">
                  <Stethoscope className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="eyebrow">OPQRST</p>
                  <h2 id="western-inquiry-title" className="text-sm font-semibold text-ink">
                    西医问诊 · 危险分层优先
                  </h2>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">6 项</span>
            </div>
            <div className="divide-y divide-slate-100 px-4 md:px-5">
              {symptom.opqrst.map((item) => {
                const key = `west:${item.letter}`
                const isChecked = checked.has(key)
                return (
                  <label
                    key={item.letter}
                    className="flex cursor-pointer items-start gap-3 py-3.5 focus-within:rounded-xl focus-within:bg-jade-50/40 focus-within:outline-none focus-within:ring-2 focus-within:ring-jade-400"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition',
                        isChecked
                          ? 'border-jade-700 bg-jade-700 text-white'
                          : 'border-slate-300 bg-white text-transparent',
                      )}
                      aria-hidden="true"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-md bg-jade-50 text-[9px] font-bold text-jade-700">
                          {item.letter}
                        </span>
                        <span className={cn('text-xs font-semibold', isChecked ? 'text-slate-400' : 'text-ink')}>
                          {item.label}
                        </span>
                      </span>
                      <span className="mt-1 block text-[11px] leading-5 text-slate-500">{item.prompt}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section className="surface-card overflow-hidden" aria-labelledby="tcm-inquiry-title">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3.5 md:px-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-jade-100 text-jade-800">
                  <Leaf className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="eyebrow">Ten questions</p>
                  <h2 id="tcm-inquiry-title" className="text-sm font-semibold text-ink">
                    中医十问 · 本病重点已高亮
                  </h2>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">10 项</span>
            </div>
            <div className="divide-y divide-slate-100 px-4 md:px-5">
              {TCM_TEN_QUESTIONS.map((question, index) => {
                const key = `tcm:${question.id}`
                const isChecked = checked.has(key)
                const focus = symptom.tcmFocus[question.id]
                return (
                  <label
                    key={question.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 py-3.5 focus-within:rounded-xl focus-within:bg-jade-50/40 focus-within:outline-none focus-within:ring-2 focus-within:ring-jade-400',
                      focus && '-mx-1 rounded-lg bg-jade-50/30 px-1 md:-mx-2 md:px-2',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition',
                        isChecked
                          ? 'border-jade-700 bg-jade-700 text-white'
                          : 'border-slate-300 bg-white text-transparent',
                      )}
                      aria-hidden="true"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-semibold text-slate-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={cn('text-xs font-semibold', isChecked ? 'text-slate-400' : 'text-ink')}>
                          {question.label}
                        </span>
                        {focus ? (
                          <span className="rounded bg-jade-100 px-1.5 py-0.5 text-[9px] font-medium text-jade-800">
                            重点
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                        {focus ?? question.prompt}
                      </span>
                      {focus ? (
                        <span className="mt-1 block text-[10px] leading-5 text-slate-400">
                          通用：{question.prompt}
                        </span>
                      ) : null}
                    </span>
                  </label>
                )
              })}
            </div>
            <div className="border-t border-slate-100 bg-sand/40 px-4 py-3 text-[10px] leading-5 text-amber-800/75 md:px-5">
              完成十问后，再结合舌象、脉象和整体证候判断证型。证型与基础方请返回症状详情页查看，不可凭单个症状套方。
            </div>
          </section>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24">
          <div className="surface-card p-4">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-jade-700" aria-hidden="true" />
              <h2 className="text-xs font-semibold text-ink">问诊优先序</h2>
            </div>
            <ol className="mt-3 space-y-2">
              {['生命体征与危险分层', '主诉的时间轴与伴随症状', '中医寒热、汗、二便与舌脉', '红线交代与复诊计划'].map((item, index) => (
                <li key={item} className="flex items-start gap-2 text-[11px] leading-5 text-slate-600">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-jade-50 text-[9px] font-semibold text-jade-700">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-danger-100 bg-danger-50/55 p-4">
            <div className="flex items-center gap-2">
              <Siren className="h-4 w-4 text-danger-600" aria-hidden="true" />
              <h2 className="text-xs font-semibold text-danger-900">本症状红旗速记</h2>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {symptom.triage.criteria.slice(0, 3).map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[10px] leading-5 text-danger-800/80">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-danger-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-jade-700" aria-hidden="true" />
              <h2 className="text-xs font-semibold text-ink">复制说明</h2>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              复制内容只含问诊提纲，不含患者身份信息。粘贴到任何系统前，请确认未将“未询问”写成“已问”。
            </p>
            <div className="mt-2.5">
              <CopyButton text={outline} className="w-full justify-center" />
            </div>
          </div>

          <DataDisclaimer compact />
        </aside>
      </div>
    </div>
  )
}
