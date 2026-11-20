import {
  ArrowLeft,
  ClipboardList,
  MessageCircle,
  Pill,
  Search,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { SectionHeading } from '../components/SectionHeading'
import { SymptomGlyph } from '../components/SymptomGlyph'
import { CommunicationPanel } from '../components/symptom/CommunicationPanel'
import { DifferentialPanel } from '../components/symptom/DifferentialPanel'
import { DualConsultationPanel } from '../components/symptom/DualConsultationPanel'
import { TriageBanner } from '../components/symptom/TriageBanner'
import { UndifferentiatedBanner } from '../components/symptom/UndifferentiatedBanner'
import { WorkupPanel } from '../components/symptom/WorkupPanel'
import { getSymptom } from '../data/symptoms'

const sectionLinks = [
  { id: 'differentials', label: '鉴别排序', icon: ShieldCheck },
  { id: 'consultation', label: '双轨问诊', icon: Stethoscope },
  { id: 'workup', label: '开单用药', icon: Pill },
  { id: 'communication', label: '沟通话术', icon: MessageCircle },
] as const

export function SymptomDetailPage() {
  const { id } = useParams()
  const symptom = getSymptom(id)

  useEffect(() => {
    document.title = symptom ? `${symptom.name} · 台州全科通` : '未找到症状 · 台州全科通'
    return () => {
      document.title = '台州全科通 · 首诊学习助手'
    }
  }, [symptom])

  if (!symptom) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-jade-50 text-jade-700">
          <Search className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">没有找到这个症状</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          链接可能已更新，或该症状还未收录。回到症状索引重新选择即可。
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-jade-800 px-4 text-sm font-semibold text-white transition hover:bg-jade-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回症状索引
        </Link>
      </div>
    )
  }

  const criticalCount = symptom.differentials.filter((item) => item.tier === 'critical').length
  const commonCount = symptom.differentials.filter((item) => item.tier === 'common').length
  const rareCount = symptom.differentials.filter((item) => item.tier === 'rare').length
  const hasMurtaghBands = symptom.differentials.some((item) => item.murtaghBand)
  const hasYellowFlags = (symptom.yellowFlags?.length ?? 0) > 0

  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (!element) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <div>
      <div className="pb-1 pt-3 md:pt-4">
        <Link
          to="/"
          className="-ml-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500 transition hover:bg-white hover:text-jade-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          症状索引
        </Link>
      </div>

      <section className="overflow-hidden rounded-[26px] border border-slate-200/70 bg-[linear-gradient(135deg,#FFFFFF_0%,#F8FCF9_55%,#FBF8F1_120%)] p-5 shadow-card md:p-7">
        <div className="flex items-start gap-4">
          <SymptomGlyph icon={symptom.icon} className="h-14 w-14 rounded-[20px] bg-white shadow-sm" iconClassName="h-6 w-6" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-jade-100 bg-jade-50 px-2 py-0.5 text-[9px] font-semibold text-jade-700">
                {symptom.category}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">{symptom.englishName}</span>
            </div>
            <h1 className="mt-1.5 font-display text-[30px] font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {symptom.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-jade-800/80">{symptom.tagline}</p>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-[13px] leading-6 text-slate-600">{symptom.overview}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-xl border border-danger-100 bg-danger-50 px-2.5 py-1.5 text-[10px] font-semibold text-danger-700">
            🚨 {criticalCount} 项绝对红旗
          </span>
          <span className="rounded-xl border border-amber-100 bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-700">
            ⚠️ {commonCount} 项常见病
          </span>
          <span className="rounded-xl border border-jade-100 bg-jade-50 px-2.5 py-1.5 text-[10px] font-semibold text-jade-700">
            🟢 {rareCount} 项罕见病
          </span>
          <span className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-500">
            {symptom.tcmPatterns.length} 个常见证型
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="max-w-2xl text-[10px] leading-5 text-slate-400">{symptom.epidemiologyNote}</p>
          <Link
            to={`/consult?symptom=${symptom.id}`}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-jade-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-jade-800 transition hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
          >
            <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
            开始问诊
          </Link>
        </div>
      </section>

      <TriageBanner triage={symptom.triage} />

      {symptom.undifferentiated ? <UndifferentiatedBanner symptomId={symptom.id} /> : null}

      <nav
        aria-label="本页快捷导航"
        className="sticky top-[60px] z-30 -mx-4 mt-4 border-y border-white/80 bg-canvas/90 px-4 py-2 backdrop-blur-xl md:-mx-6 md:rounded-2xl md:border md:border-slate-200/60 md:px-3"
      >
        <div className="scrollbar-none flex gap-1 overflow-x-auto">
          {sectionLinks.map((link) => {
            const Icon = link.icon
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-medium text-slate-500 transition hover:bg-white hover:text-jade-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {link.label}
              </button>
            )
          })}
          <span className="ml-auto hidden items-center gap-1.5 pl-2 text-[10px] text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
            红旗优先
          </span>
        </div>
      </nav>

      <section id="differentials" className="scroll-mt-36 pt-7">
        <SectionHeading
          kicker="01 · Differential triage"
          title="鉴别诊断"
          description={[
            '先看红旗层；点开每一项查看支持线索、升级指征与初始检查。',
            hasMurtaghBands
              ? '常见病内按 Murtagh 标注「最常见 / 不常见但重要」，仅作教学分层。'
              : '',
            hasYellowFlags ? '黄旗提示心理社会因素，不降低红旗门槛。' : '',
          ].join('')}
        />
        <DifferentialPanel
          differentials={symptom.differentials}
          yellowFlags={symptom.yellowFlags}
        />
      </section>

      <section id="consultation" className="scroll-mt-36 pt-8">
        <SectionHeading
          kicker="02 · Dual-track inquiry"
          title="中西医双轨问诊"
          description="西医完成危险分层，中医补齐整体证候；顺序不能反，也不能互相替代。"
        />
        <DualConsultationPanel symptom={symptom} />
      </section>

      <section id="workup" className="scroll-mt-36 pt-8">
        <SectionHeading
          kicker="03 · Workup & prescribing"
          title="开单与配药避坑"
          description="最容易漏的检查与最常见的中西药边界。勾选只作本页核对，不写入病历。"
        />
        <WorkupPanel symptom={symptom} />
      </section>

      <section id="communication" className="scroll-mt-36 pt-8">
        <SectionHeading
          kicker="04 · Symptom explainer"
          title="医患沟通"
          description="先回应患者担忧，再讲清危险、下一步和何时必须回来。"
        />
        <CommunicationPanel symptomName={symptom.name} communication={symptom.communication} />
      </section>

      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3">
          <p className="text-[10px] leading-5 text-slate-500">
            <strong className="text-slate-700">内容审核状态：</strong>
            {symptom.reviewNote}
          </p>
        </div>
        <DataDisclaimer />
      </div>
    </div>
  )
}
