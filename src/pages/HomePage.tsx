import {
  ArrowRight,
  ClipboardList,
  MessageCircle,
  Pill,
  ShieldCheck,
  Siren,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { EmergencySheet } from '../components/EmergencySheet'
import { SearchInput } from '../components/SearchInput'
import { SectionHeading } from '../components/SectionHeading'
import { SymptomCard } from '../components/SymptomCard'
import { homeSymptomOrder, popularSearches, searchSymptoms, symptoms } from '../data/symptoms'

const quickTools = [
  {
    to: '/consult',
    title: '首诊问诊单',
    copy: 'OPQRST + 中医十问，逐项核对不漏项',
    icon: ClipboardList,
  },
  {
    to: '/checklist',
    title: '新医生避坑清单',
    copy: '病历、红旗、开方与交接的 60 秒核对',
    icon: ShieldCheck,
  },
  {
    to: '/medications',
    title: '中西药安全圈',
    copy: '规格示例、配伍红灯与重复成分提醒',
    icon: Pill,
  },
  {
    to: '/scripts',
    title: '医患沟通话术',
    copy: '解释病情、转诊劝说与老年沟通模板',
    icon: MessageCircle,
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [emergencyOpen, setEmergencyOpen] = useState(false)

  const results = useMemo(() => searchSymptoms(query), [query])
  const orderedSymptoms = useMemo(
    () =>
      homeSymptomOrder
        .map((id) => symptoms.find((symptom) => symptom.id === id))
        .filter((symptom) => symptom !== undefined),
    [],
  )
  const searching = query.trim().length > 0

  function handleSubmit() {
    const first = results[0]
    if (first) navigate(`/symptom/${first.symptom.id}`)
  }

  return (
    <>
      <div className="pb-2 pt-2 md:pt-4">
        <section className="relative overflow-hidden rounded-[30px] bg-jade-900 px-5 py-6 text-white shadow-[0_24px_70px_rgba(13,67,63,0.22)] sm:px-7 sm:py-8 md:px-9 md:py-10">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/[0.08]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-28 right-16 h-56 w-56 rounded-full bg-jade-400/[0.08] blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-10 top-10 hidden h-36 w-36 opacity-[0.12] sm:block"
            aria-hidden="true"
          >
            <svg viewBox="0 0 160 160" fill="none">
              <path
                d="M21 96C25 55 54 27 102 19C94 64 68 95 25 104"
                stroke="#C8F5E7"
                strokeWidth="2"
              />
              <path
                d="M116 17C105 54 80 82 42 94"
                stroke="#C8F5E7"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium tracking-wide text-jade-100">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                台州市中医院 · 全科首诊学习
              </span>
              <span className="rounded-full bg-jade-50/10 px-2.5 py-1 text-[10px] text-jade-100/75">
                中西医双轨 · 本地化示例
              </span>
            </div>

            <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.15] tracking-tight text-white sm:text-[42px] md:text-[46px]">
              先排雷，再辨病。
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-jade-100/85 sm:text-[15px] sm:leading-7">
              从症状入口快速完成危险分层，再用 OPQRST 与中医十问把首诊问全。按红旗、常见、罕见三层看鉴别。
            </p>

            <div className="mt-5 max-w-2xl">
              <SearchInput
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                hero
                placeholder="试试：发热、胸痛、头晕、心慌、心梗…"
                label="搜索症状或鉴别诊断"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] text-jade-100/65">
              <span>热门：</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="rounded-md px-1.5 py-0.5 text-jade-50/80 underline-offset-4 transition hover:bg-white/10 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => setEmergencyOpen(true)}
          className="group mt-4 flex w-full items-center gap-3 rounded-2xl border border-danger-100 bg-[#FFF8F7] px-4 py-3.5 text-left shadow-[0_8px_24px_rgba(214,57,57,0.05)] transition hover:border-danger-200 hover:bg-danger-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-600 focus-visible:ring-offset-2"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-danger-100/80 text-danger-700">
            <Siren className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-danger-900">
              情况不稳？先停一下 · 红旗速查
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-danger-700/80">
              胸痛、卒中征象、呼吸困难、休克 → 先呼救，再检查
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-danger-500 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      <section className="pt-6" aria-live="polite">
        <SectionHeading
          kicker={searching ? 'Local search' : 'Symptom index'}
          title={searching ? '搜索结果' : '高频症状'}
          description={
            searching
              ? `匹配“${query.trim()}”的症状与相关鉴别，点开即可查看三层红旗排序。`
              : '按全科门诊学习常见度排列；进入详情后先看绝对不可漏诊的红旗层。'
          }
          action={
            !searching ? (
              <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-500 sm:inline-flex">
                {symptoms.length} 个症状入口
              </span>
            ) : null
          }
        />

        {searching ? (
          results.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <SymptomCard
                  key={`${result.symptom.id}-${result.matchedDifferential ?? result.matchedOn}`}
                  symptom={result.symptom}
                  matchedOn={result.matchedOn}
                  matchedDifferential={result.matchedDifferential}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
              <p className="text-sm font-medium text-ink">没有找到“{query.trim()}”</p>
              <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                可以试试更宽泛的症状名，或直接使用热门入口。若患者存在胸痛、呼吸困难、意识改变，请先走红旗速查。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {popularSearches.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="min-h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:border-jade-300 hover:text-jade-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {orderedSymptoms.map((symptom) => (
              <SymptomCard key={symptom.id} symptom={symptom} />
            ))}
          </div>
        )}
      </section>

      <section className="pt-7">
        <SectionHeading
          kicker="Before you prescribe"
          title="门诊工具"
          description="不替代临床判断，只把最容易漏的步骤放到手边。"
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="group flex min-h-[112px] flex-col justify-between rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-jade-200 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-jade-50 text-jade-700">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-jade-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-ink">{tool.title}</h3>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{tool.copy}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="pt-7">
        <div className="overflow-hidden rounded-2xl border border-jade-100 bg-[linear-gradient(135deg,#F0FAF6_0%,#FAFCF9_65%,#FBF8F1_100%)] p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <p className="eyebrow">How to read the ranking</p>
              <h2 className="mt-1.5 text-lg font-semibold text-ink">三层排序不是“概率高低排行榜”</h2>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                第一层优先展示后果重、不能漏的病因，即使门诊发生率低；第二层按常见度学习排序；第三层是少见但需要认识的情况。
                真实概率应由本院数据与患者特征共同决定，本应用仅作首诊思维框架。
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <span className="rounded-full bg-white px-2.5 py-1.5 text-danger-700 shadow-sm">🚨 先排雷</span>
              <span className="rounded-full bg-white px-2.5 py-1.5 text-amber-700 shadow-sm">⚠️ 常见病</span>
              <span className="rounded-full bg-white px-2.5 py-1.5 text-jade-700 shadow-sm">🟢 罕见病</span>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6">
        <DataDisclaimer />
      </div>

      <EmergencySheet open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  )
}
