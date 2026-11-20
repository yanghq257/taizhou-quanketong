import {
  ArrowRight,
  Check,
  ClipboardList,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Siren,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CopyButton } from '../components/CopyButton'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { PageHeader } from '../components/PageHeader'
import { checklistSections } from '../data/checklist'
import { CHECKLIST_KEY, useHospitalSettings } from '../hooks/useHospitalSettings'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { cn, onlyPhoneNumber, percent } from '../lib/utils'

export function ChecklistPage() {
  const [checked, setChecked] = useLocalStorageState<Record<string, boolean>>(CHECKLIST_KEY, {})
  const [onlyOpen, setOnlyOpen] = useState(false)
  const { settings } = useHospitalSettings()

  useEffect(() => {
    document.title = '避坑清单 · 台州全科通'
  }, [])

  const allItems = useMemo(() => checklistSections.flatMap((section) => section.items), [])
  const total = allItems.length
  const completed = allItems.filter((item) => checked[item.id]).length
  const progress = percent(completed, total)
  const criticalPending = allItems.filter((item) => item.critical && !checked[item.id]).length
  const pendingCount = total - completed

  const incompleteText = useMemo(() => {
    const lines: string[] = ['台州全科通 · 首诊避坑清单（未完成项）', `完成 ${completed}/${total}`, '']
    checklistSections.forEach((section) => {
      const pending = section.items.filter((item) => !checked[item.id])
      if (pending.length === 0) return
      lines.push(`【${section.title}】`)
      pending.forEach((item) => {
        lines.push(`- ${item.title}${item.critical ? '（红旗）' : ''}`)
      })
      lines.push('')
    })
    lines.push('提示：勾选仅保存在本机浏览器，不上传；本清单不替代院内制度与正式表单。')
    return lines.join('\n')
  }, [checked, completed, total])

  function toggle(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }))
  }

  function reset() {
    if (pendingCount === 0) return
    if (!window.confirm('清空本机保存的全部勾选进度？此操作不可撤销。')) return
    setChecked({})
  }

  return (
    <div>
      <PageHeader
        eyebrow="Onboarding safety net"
        title="新医生避坑清单"
        description="从开诊前 60 秒到转诊交接的逐项核对。勾选自动保存在本机浏览器，不上传、不写入病历。"
      />

      <section className="overflow-hidden rounded-[24px] border border-jade-100 bg-[linear-gradient(135deg,#F1FAF6_0%,#FFFFFF_70%,#FBF8F1_120%)] p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Progress</p>
            <p className="mt-1 text-sm font-semibold text-ink">
              已完成 <span className="text-jade-700">{completed}</span>
              <span className="text-xs font-normal text-slate-500"> / {total} 项</span>
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              {criticalPending > 0 ? (
                <span className="font-medium text-danger-700">仍有 {criticalPending} 项红旗项未核对</span>
              ) : (
                <span className="font-medium text-jade-700">全部红旗项已核对 ✓</span>
              )}
              <span className="mx-1.5 text-slate-300">·</span>
              本院制度项需按科室实际确认
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold tracking-tight text-jade-800">{progress}%</p>
              <p className="text-[9px] text-slate-400">本机进度</p>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={pendingCount === 0}
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
            aria-label="清单完成度"
          />
        </div>
      </section>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        <div
          className={cn(
            'flex items-center gap-3 rounded-2xl border px-4 py-3',
            settings.emergencyPhone
              ? 'border-danger-100 bg-danger-50/50'
              : 'border-amber-100 bg-sand/80',
          )}
        >
          <span
            className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
              settings.emergencyPhone ? 'bg-danger-100 text-danger-700' : 'bg-amber-100 text-amber-700',
            )}
            aria-hidden="true"
          >
            <Phone className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">院内急救电话</p>
            {settings.emergencyPhone ? (
              <a
                href={`tel:${onlyPhoneNumber(settings.emergencyPhone)}`}
                className="mt-0.5 inline-flex min-h-7 items-center text-sm font-bold text-danger-700 underline-offset-4 hover:underline"
              >
                {settings.emergencyPhone}
              </a>
            ) : (
              <p className="mt-0.5 text-[11px] leading-5 text-amber-800/80">尚未填写，请先补上本院正式内线</p>
            )}
          </div>
          <Link
            to="/settings"
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[9px] font-medium text-slate-500 transition hover:text-jade-700"
          >
            {settings.emergencyPhone ? '修改' : '去设置'}
          </Link>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-jade-50 text-jade-700" aria-hidden="true">
            <ClipboardList className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">进度保存</p>
            <p className="mt-0.5 text-[11px] leading-5 text-slate-500">仅存本机浏览器，不上传患者数据</p>
          </div>
          {pendingCount > 0 ? (
            <CopyButton
              text={incompleteText}
              label="复制未完成"
              copiedLabel="已复制"
              className="shrink-0 px-2 text-[10px]"
            />
          ) : null}
        </div>
      </div>

      <div className="mb-3 mt-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="eyebrow">{total} items · 6 sections</p>
          <h2 className="mt-0.5 text-base font-semibold text-ink">逐项核对</h2>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={onlyOpen}
          onClick={() => setOnlyOpen((value) => !value)}
          className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-500 transition hover:border-jade-200 hover:text-jade-700"
        >
          <span
            className={cn(
              'relative h-4 w-7 rounded-full transition',
              onlyOpen ? 'bg-jade-600' : 'bg-slate-200',
            )}
            aria-hidden="true"
          >
            <span
              className={cn(
                'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all',
                onlyOpen ? 'left-3.5' : 'left-0.5',
              )}
            />
          </span>
          只看未完成
        </button>
      </div>

      <div className="space-y-3">
        {checklistSections.map((section, sectionIndex) => {
          const sectionCompleted = section.items.filter((item) => checked[item.id]).length
          const visibleItems = section.items.filter((item) => !onlyOpen || !checked[item.id])
          if (visibleItems.length === 0) return null

          return (
            <section
              key={section.id}
              className="surface-card overflow-hidden"
              aria-labelledby={`checklist-${section.id}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[linear-gradient(135deg,#FAFCFB_0%,#FFFFFF_80%)] px-4 py-3.5 md:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-jade-800 font-display text-[11px] font-bold text-white">
                    {String(sectionIndex + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 id={`checklist-${section.id}`} className="text-sm font-semibold text-ink">
                      {section.title}
                    </h2>
                    <p className="mt-0.5 text-[10px] text-slate-400">{section.subtitle}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold',
                    sectionCompleted === section.items.length
                      ? 'border-jade-200 bg-jade-50 text-jade-700'
                      : 'border-slate-200 bg-white text-slate-400',
                  )}
                >
                  {sectionCompleted}/{section.items.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 px-4 md:px-5">
                {visibleItems.map((item) => {
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
                              红旗
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
            </section>
          )
        })}
      </div>

      {onlyOpen && pendingCount === 0 ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-jade-200 bg-jade-50/60 px-4 py-5">
          <ShieldCheck className="h-5 w-5 shrink-0 text-jade-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-jade-900">全部核对完成</p>
            <p className="mt-0.5 text-[10px] text-jade-800/70">
              清单只是起点。遇到不确定的患者，仍然优先请示上级、联系药师或启动院内流程。
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-100 bg-sand/70 px-4 py-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <div className="text-[10px] leading-5 text-amber-800/80">
          <p>
            <strong>本院制度项尚未锁定。</strong>
            急救电话、绿色通道、处方权限和交接表单必须按台州市中医院现行制度填写与核对。本清单不是正式医疗文书，也不替代岗前培训。
          </p>
          <Link
            to="/settings"
            className="mt-1 inline-flex items-center gap-1 font-semibold text-amber-700 underline-offset-4 hover:underline"
          >
            前往设置急救电话
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <DataDisclaimer compact />
      </div>
    </div>
  )
}
