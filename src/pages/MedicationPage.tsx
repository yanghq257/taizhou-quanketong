import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  Leaf,
  Pill,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { ComorbidityRedlines } from '../components/medication/ComorbidityRedlines'
import { RenewalChecklist } from '../components/medication/RenewalChecklist'
import { formulas } from '../data/formulas'
import { medications } from '../data/medications'
import { renewalChecklistItems } from '../data/renewal'
import { safetyAlerts } from '../data/safety'
import { cn } from '../lib/utils'

type MedicationTab = 'drugs' | 'formulas' | 'alerts' | 'renewal'
type KindFilter = '全部' | '中成药' | '西药'

const tabs: Array<{ id: MedicationTab; label: string; icon: typeof Pill; count: number }> = [
  { id: 'drugs', label: '药品速查', icon: Pill, count: medications.length },
  { id: 'formulas', label: '经典方剂', icon: BookOpen, count: formulas.length },
  { id: 'alerts', label: '相互作用红灯', icon: ShieldAlert, count: safetyAlerts.length },
  { id: 'renewal', label: '续药核对', icon: RefreshCw, count: renewalChecklistItems.length },
]

const kindFilters: KindFilter[] = ['全部', '中成药', '西药']

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '')
}

export function MedicationPage() {
  const [tab, setTab] = useState<MedicationTab>('drugs')
  const [kind, setKind] = useState<KindFilter>('全部')
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = '配药房 · 台州全科通'
  }, [])

  const q = normalize(query.trim())

  const filteredMedications = useMemo(
    () =>
      medications.filter((med) => {
        if (kind !== '全部' && med.kind !== kind) return false
        if (!q) return true
        const haystack = normalize(
          [
            med.name,
            med.kind,
            med.category,
            med.specs,
            med.indications,
            med.usageNote,
            ...med.cautions,
            ...med.interactions,
            ...med.tags,
            med.prescriptionType,
          ].join(' '),
        )
        return haystack.includes(q)
      }),
    [kind, q],
  )

  const filteredFormulas = useMemo(
    () =>
      formulas.filter((formula) => {
        if (!q) return true
        const haystack = normalize(
          [
            formula.name,
            formula.source,
            formula.pattern,
            formula.principle,
            formula.indications,
            ...formula.composition,
            ...formula.cautions,
          ].join(' '),
        )
        return haystack.includes(q)
      }),
    [q],
  )

  const filteredAlerts = useMemo(
    () =>
      safetyAlerts.filter((alert) => {
        if (!q) return true
        return normalize(
          [alert.title, alert.combination, alert.risk, alert.action, alert.level].join(' '),
        ).includes(q)
      }),
    [q],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Medication guardrail"
        title="配药房"
        description="常见中成药、西药与经典方的快速安全边界。这里不提供剂量，不替代基药目录和药师审核。"
      />

      <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-danger-100 bg-danger-50/65 px-4 py-3">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden="true" />
        <p className="text-[11px] leading-5 text-danger-900/80">
          <strong>规格为待核对示例，不是台州市中医院正式基药目录。</strong>{' '}
          所有药名、规格、医保属性与院内可及性，开方前必须对照正式目录；药品相互作用清单不完整，不能作为唯一决策依据。
        </p>
      </div>

      <div
        role="group"
        aria-label="配药房内容切换"
        className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200/80 bg-white p-1 shadow-sm sm:grid-cols-4"
      >
        {tabs.map((item) => {
          const Icon = item.icon
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setTab(item.id)}
              className={cn(
                'flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-1.5 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500',
                active
                  ? 'bg-jade-800 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-jade-50 hover:text-jade-800',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
              <span
                className={cn(
                  'hidden rounded-full px-1.5 py-0.5 text-[9px] min-[380px]:inline',
                  active ? 'bg-white/15 text-white/80' : 'bg-slate-100 text-slate-500',
                )}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {tab === 'drugs' || tab === 'formulas' ? (
        <div className="mt-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            onSubmit={() => undefined}
            placeholder={tab === 'drugs' ? '搜索药名、成分、慎用人群或相互作用…' : '搜索方名、组成、证型或注意…'}
            label={tab === 'drugs' ? '搜索药品' : '搜索方剂'}
          />
        </div>
      ) : null}

      {tab === 'drugs' ? (
        <section className="mt-4" aria-labelledby="drugs-heading">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="eyebrow">Formulary preview</p>
              <h2 id="drugs-heading" className="mt-0.5 text-base font-semibold text-ink">
                中成药与常用西药
              </h2>
            </div>
            <div className="flex gap-1">
              {kindFilters.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={kind === item}
                  onClick={() => setKind(item)}
                  className={cn(
                    'min-h-8 rounded-lg border px-2.5 text-[10px] font-medium transition',
                    kind === item
                      ? 'border-jade-200 bg-jade-50 text-jade-800'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-ink',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-3 text-[10px] text-slate-400">
            找到 {filteredMedications.length} 个药品条目 · 点开查看完整注意与相互作用
          </p>

          {filteredMedications.length > 0 ? (
            <div className="space-y-2.5">
              {filteredMedications.map((med) => (
                <details
                  key={med.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(18,59,53,0.035)]"
                >
                  <summary className="cursor-pointer list-none px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-jade-500">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                          med.kind === '中成药'
                            ? 'bg-jade-50 text-jade-700'
                            : 'bg-slate-100 text-slate-600',
                        )}
                        aria-hidden="true"
                      >
                        {med.kind === '中成药' ? <Leaf className="h-4 w-4" /> : <Pill className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-semibold text-ink">{med.name}</h3>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                            {med.category}
                          </span>
                          <span
                            className={cn(
                              'rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                              med.prescriptionType === 'OTC'
                                ? 'border-jade-100 bg-jade-50 text-jade-700'
                                : 'border-amber-100 bg-amber-50 text-amber-700',
                            )}
                          >
                            {med.prescriptionType}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">示例规格：{med.specs}</p>
                        <p className="mt-1.5 line-clamp-1 text-[11px] leading-5 text-slate-600">
                          {med.indications}
                        </p>
                      </div>
                      <ChevronDown
                        className="details-chevron mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-2 rounded-lg bg-amber-50/70 px-2.5 py-1.5 text-[10px] leading-5 text-amber-800/80">
                      <strong>首要边界：</strong>
                      {med.cautions[0]}
                    </p>
                  </summary>

                  <div className="border-t border-slate-100 px-4 pb-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          适应证 / 使用边界
                        </h4>
                        <p className="mt-1.5 text-[11px] leading-5 text-slate-600">{med.indications}</p>
                        <p className="mt-2 rounded-xl bg-jade-50/60 px-3 py-2 text-[10px] leading-5 text-jade-900/75">
                          {med.usageNote}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {med.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-500"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-danger-600">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          慎用 / 禁忌要点
                        </h4>
                        <ul className="mt-1.5 space-y-1.5">
                          {med.cautions.map((caution) => (
                            <li key={caution} className="flex items-start gap-1.5 text-[10px] leading-5 text-slate-600">
                              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-danger-400" aria-hidden="true" />
                              {caution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/45 px-3.5 py-2.5">
                      <h4 className="text-[10px] font-semibold text-amber-800">相互作用 / 联用提示</h4>
                      <ul className="mt-1.5 space-y-1">
                        {med.interactions.map((interaction) => (
                          <li key={interaction} className="text-[10px] leading-5 text-amber-900/75">
                            · {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-2 text-[9px] text-slate-400">
                      本页不提供剂量与疗程；处方前以说明书和院内规范为准。
                    </p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <EmptyResult query={query} />
          )}
        </section>
      ) : null}

      {tab === 'formulas' ? (
        <section className="mt-4" aria-labelledby="formulas-heading">
          <div className="mb-3">
            <p className="eyebrow">Classical formulas</p>
            <h2 id="formulas-heading" className="mt-0.5 text-base font-semibold text-ink">
              经典方 · 方证速记
            </h2>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              展示基础组成与方证思路，不给剂量。辨证不符、孕妇、肝肾功能异常或合并多重用药时，须先请中医师/药师评估。
            </p>
          </div>

          <p className="mb-3 text-[10px] text-slate-400">找到 {filteredFormulas.length} 个方剂条目</p>

          {filteredFormulas.length > 0 ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              {filteredFormulas.map((formula) => (
                <details
                  key={formula.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_18px_rgba(18,59,53,0.03)]"
                >
                  <summary className="cursor-pointer list-none outline-none focus-visible:ring-2 focus-visible:ring-jade-500">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-semibold text-ink">{formula.name}</h3>
                          <span className="rounded-full bg-jade-50 px-1.5 py-0.5 text-[9px] font-medium text-jade-700">
                            {formula.pattern}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {formula.source} · {formula.principle}
                        </p>
                      </div>
                      <ChevronDown
                        className="details-chevron mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {formula.composition.slice(0, 7).map((herb) => (
                        <span
                          key={herb}
                          className="rounded-md border border-jade-100 bg-jade-50/50 px-1.5 py-0.5 text-[9px] text-jade-800"
                        >
                          {herb}
                        </span>
                      ))}
                      {formula.composition.length > 7 ? (
                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] text-slate-400">
                          +{formula.composition.length - 7}
                        </span>
                      ) : null}
                    </div>
                  </summary>

                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <p className="text-[10px] leading-5 text-slate-600">{formula.indications}</p>
                    <div className="mt-2.5 rounded-xl border border-amber-100 bg-amber-50/45 px-3 py-2">
                      <p className="text-[9px] font-semibold text-amber-800">使用边界</p>
                      <ul className="mt-1 space-y-1">
                        {formula.cautions.map((caution) => (
                          <li key={caution} className="text-[10px] leading-5 text-amber-900/75">
                            · {caution}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-2 text-[9px] text-slate-400">
                      组成仅作学习展示；具体炮制、剂量、煎服法必须遵院内药典与处方规范。
                    </p>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <EmptyResult query={query} />
          )}
        </section>
      ) : null}

      {tab === 'alerts' ? (
        <section className="mt-4" aria-labelledby="alerts-heading">
          <ComorbidityRedlines />

          <div className="mb-3">
            <p className="eyebrow">Interaction red lights</p>
            <h2 id="alerts-heading" className="mt-0.5 text-base font-semibold text-ink">
              开方前先扫一眼
            </h2>
            <p className="mt-1 text-[10px] leading-5 text-slate-500">
              以下是常见但容易漏的高风险组合，不构成完整相互作用数据库。
            </p>
          </div>

          {filteredAlerts.length > 0 ? (
            <div className="space-y-2.5">
              {filteredAlerts.map((alert) => (
                <article
                  key={alert.id}
                  className={cn(
                    'rounded-2xl border p-4',
                    alert.level === 'critical'
                      ? 'border-danger-100 bg-[linear-gradient(135deg,#FFF9F8_0%,#FFFFFF_80%)]'
                      : 'border-amber-100 bg-[linear-gradient(135deg,#FFFDF7_0%,#FFFFFF_80%)]',
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-xl',
                        alert.level === 'critical'
                          ? 'bg-danger-50 text-danger-600'
                          : 'bg-amber-50 text-amber-700',
                      )}
                      aria-hidden="true"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-ink">{alert.title}</h3>
                        <span
                          className={cn(
                            'rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
                            alert.level === 'critical'
                              ? 'bg-danger-100 text-danger-700'
                              : 'bg-amber-100 text-amber-700',
                          )}
                        >
                          {alert.level === 'critical' ? '高警示' : '需关注'}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-5 text-slate-500">{alert.combination}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-white/80 px-3 py-2.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-danger-600">风险</p>
                      <p className="mt-1 text-[10px] leading-5 text-slate-600">{alert.risk}</p>
                    </div>
                    <div className="rounded-xl bg-white/80 px-3 py-2.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-jade-700">处理</p>
                      <p className="mt-1 text-[10px] leading-5 text-slate-600">{alert.action}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyResult query={query} />
          )}
        </section>
      ) : null}

      {tab === 'renewal' ? <RenewalChecklist /> : null}

      <div className="mt-6">
        <DataDisclaimer />
      </div>
    </div>
  )
}

function EmptyResult({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <p className="text-sm font-medium text-ink">
        {query.trim() ? `没有找到“${query.trim()}”` : '没有匹配条目'}
      </p>
      <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
        试试更短的药名/方名，或回到症状详情页查看相关药物。任何不确定的相互作用都应请药师会诊。
      </p>
    </div>
  )
}
