import { ChevronDown, MessageCircle, ShieldAlert, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { communicationScripts, scriptCategories } from '../data/scripts'
import type { ScriptCategory } from '../types'
import { cn } from '../lib/utils'

type CategoryFilter = ScriptCategory | '全部'

const categoryOptions: CategoryFilter[] = ['全部', ...scriptCategories]

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '')
}

export function ScriptsPage() {
  const [category, setCategory] = useState<CategoryFilter>('全部')
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = '话术库 · 台州全科通'
  }, [])

  const q = normalize(query.trim())

  const filtered = useMemo(
    () =>
      communicationScripts.filter((script) => {
        if (category !== '全部' && script.category !== category) return false
        if (!q) return true
        return normalize(
          [script.title, script.category, script.scenario, script.audience, ...script.lines, ...script.avoid, script.note ?? ''].join(' '),
        ).includes(q)
      }),
    [category, q],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Conversation scripts"
        title="话术库"
        description="把危险讲清楚，把下一步说具体。模板不是背诵稿，先听患者的担心，再按实际病情改写。"
      />

      <div className="mb-4 rounded-2xl border border-jade-100 bg-jade-50/50 px-4 py-3">
        <p className="text-[11px] leading-5 text-jade-900/80">
          <strong>使用原则：</strong>方言只用于拉近距离，不能用自创谐音替代医学解释。台州各县（市、区）口音差异大，优先普通话慢速、短句；请患者复述回诊红线，而不是只问“听懂没有”。
        </p>
      </div>

      <SearchInput
        value={query}
        onChange={setQuery}
        onSubmit={() => undefined}
        placeholder="搜索场景：发热、转诊、抗生素、老年沟通…"
        label="搜索沟通话术"
      />

      <div className="mt-3">
        <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="按场景筛选话术">
          {categoryOptions.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                'min-h-8 shrink-0 rounded-full border px-3 text-[10px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500',
                category === item
                  ? 'border-jade-700 bg-jade-800 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-jade-200 hover:text-jade-700',
              )}
            >
              {item}
              {item !== '全部' ? (
                <span className={cn('ml-1 text-[9px]', category === item ? 'text-white/55' : 'text-slate-400')}>
                  {communicationScripts.filter((script) => script.category === item).length}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 mt-2 text-[10px] text-slate-400">
        找到 {filtered.length} 条 · 点开查看完整话术与“别说”提示
      </p>

      {filtered.length > 0 ? (
        <div className="grid items-start gap-2.5 lg:grid-cols-2">
          {filtered.map((script) => {
            const copyText = [
              `台州全科通 · ${script.title}`,
              `适用场景：${script.scenario}`,
              `沟通对象：${script.audience}`,
              '',
              '【参考说法】',
              ...script.lines.map((line, index) => `${index + 1}. ${line}`),
              '',
              '【避免这样说】',
              ...script.avoid.map((line) => `- ${line}`),
              ...(script.note ? ['', `备注：${script.note}`] : []),
              '',
              '提示：教学模板，请按患者情况调整；不替代知情同意与院内制度。',
            ].join('\n')

            return (
              <details
                key={script.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_18px_rgba(18,59,53,0.035)]"
              >
                <summary className="cursor-pointer list-none px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-jade-500">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-jade-50 text-jade-700" aria-hidden="true">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-jade-50 px-1.5 py-0.5 text-[9px] font-medium text-jade-700">
                          {script.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] text-slate-400">
                          <UserRound className="h-2.5 w-2.5" aria-hidden="true" />
                          {script.audience}
                        </span>
                      </div>
                      <h2 className="mt-1.5 text-sm font-semibold leading-5 text-ink">{script.title}</h2>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-slate-500">{script.scenario}</p>
                    </div>
                    <ChevronDown
                      className="details-chevron mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                </summary>

                <div className="border-t border-slate-100 px-4 pb-4 pt-4">
                  <div className="rounded-xl bg-sand/60 px-3 py-2.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-amber-700">适用场景</p>
                    <p className="mt-1 text-[10px] leading-5 text-slate-600">{script.scenario}</p>
                  </div>

                  <ol className="mt-3 space-y-2.5">
                    {script.lines.map((line, index) => (
                      <li key={`${script.id}-line-${index}`} className="flex gap-2.5 text-[11px] leading-5 text-slate-600">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-jade-50 text-[9px] font-semibold text-jade-700">
                          {index + 1}
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-3 rounded-xl border border-danger-100 bg-danger-50/55 px-3 py-2.5">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold text-danger-700">
                      <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                      避免这样说
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {script.avoid.map((line, index) => (
                        <li key={`${script.id}-avoid-${index}`} className="text-[10px] leading-5 text-danger-900/70">
                          · {line}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {script.note ? (
                    <p className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2 text-[10px] leading-5 text-slate-500">
                      <strong className="text-slate-600">备注：</strong>
                      {script.note}
                    </p>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[9px] text-slate-400">模板 · 不替代知情同意</p>
                    <CopyButton text={copyText} label="复制这条话术" copiedLabel="话术已复制" />
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
          <p className="text-sm font-medium text-ink">
            {query.trim() ? `没有找到“${query.trim()}”` : '这个分类还没有话术'}
          </p>
          <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
            试试更短的关键词，或切换到“全部”。紧急场景请直接使用红旗速查并启动院内急救流程。
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory('全部')
              setQuery('')
            }}
            className="mt-4 min-h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:border-jade-300 hover:text-jade-700"
          >
            清除筛选
          </button>
        </div>
      )}

      <div className="mt-6">
        <DataDisclaimer />
      </div>
    </div>
  )
}
