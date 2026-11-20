import { NotebookPen, X } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import type { Symptom } from '../types'
import { buildSoapDraft } from '../lib/soap'
import { cn } from '../lib/utils'
import { CopyButton } from './CopyButton'

const sectionTone = {
  S: {
    badge: 'bg-jade-800 text-white',
    border: 'border-jade-100',
    title: '主观 Subjective',
  },
  O: {
    badge: 'bg-slate-700 text-white',
    border: 'border-slate-200',
    title: '客观 Objective',
  },
  A: {
    badge: 'bg-amber-600 text-white',
    border: 'border-amber-100',
    title: '评估 Assessment',
  },
  P: {
    badge: 'bg-jade-700 text-white',
    border: 'border-jade-100',
    title: '计划 Plan · 含安全网',
  },
} as const

export function SoapDraftDialog({
  open,
  onClose,
  symptom,
  checked,
  totalQuestions,
}: {
  open: boolean
  onClose: () => void
  symptom: Symptom
  checked: Set<string>
  totalQuestions: number
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const draft = useMemo(() => buildSoapDraft(symptom, checked), [symptom, checked])

  useEffect(() => {
    if (!open) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousActiveElement?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="soap-draft-title"
        className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] border border-white/60 bg-[#FFFDFC] shadow-float sm:rounded-[28px]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-jade-100 bg-[#FFFDFC]/95 px-5 pb-4 pt-5 backdrop-blur">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-jade-50 text-jade-700">
              <NotebookPen className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-jade-700">
                Clinical reasoning · draft only
              </p>
              <h2 id="soap-draft-title" className="mt-0.5 text-lg font-semibold text-ink">
                SOAP 病历草稿
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {symptom.name} · 临时模板 · 不保存患者信息
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
            aria-label="关闭 SOAP 病历草稿"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-slate-100 bg-jade-50/35 px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <span className="font-semibold text-jade-800">
              问诊完成度：{checked.size} / {totalQuestions} 项
            </span>
            <span className="text-slate-500">未勾选项不会自动写成“已问”</span>
          </div>
          {checked.size < totalQuestions ? (
            <p className="mt-1.5 text-[10px] leading-5 text-amber-800/80">
              本次问诊尚未全部勾选。草稿仍可生成，但请补充真实问诊结果，不能把待补充内容直接作为病历。
            </p>
          ) : (
            <p className="mt-1.5 text-[10px] leading-5 text-jade-800/70">
              问诊要点已勾选完成。请继续补充真实的阳性/阴性所见、查体和检查结果。
            </p>
          )}
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3.5 py-2.5 text-[10px] leading-5 text-amber-900/80">
            <strong>病历安全提示：</strong>
            本草稿是学习用模板，不是正式病历。所有【待补充】必须由接诊医生根据真实资料填写；本工具不虚构患者身份、诊断、检查结果或处方剂量。
          </div>

          <SoapSection letter="S" tone="S" lines={draft.subjective} />
          <SoapSection letter="O" tone="O" lines={draft.objective} />
          <SoapSection letter="A" tone="A" lines={draft.assessment} />
          <SoapSection letter="P" tone="P" lines={draft.plan} />

          <p className="px-1 text-[10px] leading-5 text-slate-400">
            复制后会得到带 S/O/A/P 标题的纯文本；请粘贴到院内系统前再次核对事实、诊断和随访安排。
          </p>
        </div>

        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-[#FFFDFC]/95 px-5 py-3 backdrop-blur">
          <p className="text-[10px] text-slate-400">不替代病历书写规范 · 不提供处方剂量</p>
          <CopyButton text={draft.text} label="复制 SOAP 草稿" copiedLabel="SOAP 已复制" />
        </div>
      </div>
    </div>
  )
}

function SoapSection({
  letter,
  tone,
  lines,
}: {
  letter: 'S' | 'O' | 'A' | 'P'
  tone: keyof typeof sectionTone
  lines: string[]
}) {
  const config = sectionTone[tone]

  return (
    <section className={cn('rounded-2xl border bg-white/80 p-3.5', config.border)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'grid h-6 w-6 place-items-center rounded-lg text-[11px] font-bold',
            config.badge,
          )}
          aria-hidden="true"
        >
          {letter}
        </span>
        <h3 className="text-xs font-semibold text-ink">{config.title}</h3>
      </div>
      <ul className="mt-2.5 space-y-2">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2 text-[11px] leading-5 text-slate-600">
            <span
              className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-300"
              aria-hidden="true"
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
