import { ChevronDown, ClipboardCheck, Flag, Info } from 'lucide-react'
import type { Differential, DifferentialTier, MurtaghBand, YellowFlag } from '../../types'
import { cn } from '../../lib/utils'
import { YellowFlagsPanel } from './YellowFlagsPanel'

const tierConfig = {
  critical: {
    emoji: '🚨',
    title: '绝对不可漏诊',
    subtitle: '先排除，再排序；该层不以门诊发生率高低为先后依据',
    heading: 'border-danger-100 bg-danger-50/60',
    titleClass: 'text-danger-900',
    subtitleClass: 'text-danger-700/75',
    countClass: 'bg-danger-100 text-danger-700',
    card: 'border-danger-100 bg-white',
    summaryBg: '[background:linear-gradient(180deg,#FFF9F8_0%,#FFFFFF_78%)]',
    badge: 'bg-danger-50 text-danger-700',
    dot: 'bg-danger-600',
    flagBox: 'border-danger-100 bg-danger-50/70 text-danger-800',
    action: 'border-danger-100 bg-danger-50/60',
  },
  common: {
    emoji: '⚠️',
    title: '常见病',
    subtitle: '按全科门诊常见度学习排序；常见不等于可忽略',
    heading: 'border-amber-100 bg-amber-50/60',
    titleClass: 'text-ink',
    subtitleClass: 'text-amber-700/80',
    countClass: 'bg-amber-100 text-amber-700',
    card: 'border-slate-200/80 bg-white',
    summaryBg: '[background:linear-gradient(180deg,#FFFDF8_0%,#FFFFFF_78%)]',
    badge: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-600',
    flagBox: 'border-amber-100 bg-amber-50/70 text-amber-700',
    action: 'border-amber-100 bg-amber-50/50',
  },
  rare: {
    emoji: '🟢',
    title: '罕见病',
    subtitle: '少见但需要认识；出现升级征象时仍按急症处理',
    heading: 'border-jade-100 bg-jade-50/60',
    titleClass: 'text-ink',
    subtitleClass: 'text-jade-700/75',
    countClass: 'bg-jade-100 text-jade-700',
    card: 'border-slate-200/80 bg-white',
    summaryBg: '[background:linear-gradient(180deg,#F9FDFB_0%,#FFFFFF_78%)]',
    badge: 'bg-jade-50 text-jade-700',
    dot: 'bg-jade-600',
    flagBox: 'border-jade-100 bg-jade-50/70 text-jade-700',
    action: 'border-jade-100 bg-jade-50/50',
  },
} as const

const tierOrder: DifferentialTier[] = ['critical', 'common', 'rare']

const likelihoodStyle: Record<Differential['likelihood'], string> = {
  优先排除: 'border-danger-200 bg-danger-50 text-danger-700',
  最常见: 'border-jade-200 bg-jade-50 text-jade-700',
  常见: 'border-slate-200 bg-slate-50 text-slate-600',
  较少见: 'border-slate-200 bg-white text-slate-500',
}

const murtaghConfig: Record<MurtaghBand, { label: string; frame: string; tag: string }> = {
  'most-common': {
    label: '最常见',
    frame: 'border-jade-200 bg-jade-50 text-jade-800',
    tag: 'bg-jade-700 text-white',
  },
  'less-common-serious': {
    label: '不常见但重要',
    frame: 'border-amber-200 bg-amber-50 text-amber-800',
    tag: 'bg-amber-700 text-white',
  },
}

export function DifferentialPanel({
  differentials,
  yellowFlags,
}: {
  differentials: Differential[]
  yellowFlags?: YellowFlag[]
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-start gap-2.5 rounded-2xl border border-jade-100 bg-jade-50/60 px-4 py-3 text-[11px] leading-5 text-jade-900/75">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jade-700" aria-hidden="true" />
        <p>
          三层排序用于建立首诊的“排除危险 → 识别常见 → 认识少见”思维。层内顺序为学习用常见度排序，不是经过本地流行病学验证的精确患病概率。
        </p>
      </div>

      <YellowFlagsPanel flags={yellowFlags} />

      {tierOrder.map((tier) => {
        const items = differentials.filter((item) => item.tier === tier)
        if (items.length === 0) return null
        const config = tierConfig[tier]

        return (
          <section key={tier} aria-labelledby={`tier-heading-${tier}`}>
            <div
              className={cn(
                'flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5',
                config.heading,
              )}
            >
              <div>
                <h3
                  id={`tier-heading-${tier}`}
                  className={cn('flex items-center gap-2 text-sm font-semibold', config.titleClass)}
                >
                  <span aria-hidden="true">{config.emoji}</span>
                  {config.title}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      config.countClass,
                    )}
                  >
                    {items.length}
                  </span>
                </h3>
                <p className={cn('mt-0.5 text-[10px]', config.subtitleClass)}>{config.subtitle}</p>
                {items.some((item) => item.murtaghBand) ? (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[9px] text-slate-500">
                    <span className="font-medium">Murtagh 常见度：</span>
                    <MurtaghBadge band="most-common" />
                    <MurtaghBadge band="less-common-serious" />
                    <span>教学标注，非本地患病率</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-2.5 space-y-2.5">
              {items.map((item, index) => (
                <DifferentialCard
                  key={item.id}
                  item={item}
                  index={index}
                  config={config}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function MurtaghBadge({ band }: { band: MurtaghBand }) {
  const config = murtaghConfig[band]

  return (
    <span
      className={cn(
        'inline-flex items-center overflow-hidden rounded-full border text-[9px] font-medium',
        config.frame,
      )}
      title="Murtagh 教学分层，不代表本地患病率"
    >
      <span
        className={cn(
          'px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide',
          config.tag,
        )}
      >
        Murtagh
      </span>
      <span className="px-1.5 py-0.5">{config.label}</span>
    </span>
  )
}

function DifferentialCard({
  item,
  index,
  config,
}: {
  item: Differential
  index: number
  config: (typeof tierConfig)[DifferentialTier]
}) {
  return (
    <details
      className={cn(
        'group overflow-hidden rounded-2xl border shadow-[0_4px_20px_rgba(18,59,53,0.035)]',
        config.card,
      )}
    >
      <summary className="cursor-pointer list-none px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-jade-500">
        <div className={cn('-mx-4 -mt-4 mb-3 px-4 pb-3 pt-4', config.summaryBg)}>
          <div className="flex items-start gap-3">
            <span
              className={cn(
                'mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-lg px-1 text-[10px] font-bold',
                config.badge,
              )}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-[15px] font-semibold tracking-tight text-ink">{item.name}</h4>
                {item.murtaghBand ? (
                  <MurtaghBadge band={item.murtaghBand} />
                ) : (
                  <span
                    className={cn(
                      'rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                      likelihoodStyle[item.likelihood],
                    )}
                  >
                    {item.likelihood}
                  </span>
                )}
              </div>
              {item.englishName ? (
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                  {item.englishName}
                </p>
              ) : null}
            </div>
            <ChevronDown
              className="details-chevron mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200"
              aria-hidden="true"
            />
          </div>
          <p className="mt-2.5 text-xs leading-5 text-slate-600">{item.summary}</p>
        </div>

        {item.tier === 'critical' ? (
          <div className={cn('mt-2 rounded-xl border px-3 py-2.5', config.flagBox)}>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold">
              <Flag className="h-3 w-3" aria-hidden="true" />
              关键红旗
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-5">{item.redFlags.join('；')}</p>
          </div>
        ) : (
          <p className="mt-2 line-clamp-1 text-[10px] leading-5 text-slate-400">
            {item.prevalenceNote}
          </p>
        )}

        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-jade-700">
          展开：支持线索、红旗与初始检查
        </span>
      </summary>

      <div className="border-t border-slate-100 px-4 pb-4 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h5 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-jade-800">
              <span className="h-1.5 w-1.5 rounded-full bg-jade-500" aria-hidden="true" />
              支持线索
            </h5>
            <ul className="space-y-1.5">
              {item.clues.map((clue) => (
                <li key={clue} className="flex items-start gap-2 text-[11px] leading-5 text-slate-600">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
                  {clue}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-danger-700">
              <Flag className="h-3 w-3" aria-hidden="true" />
              红旗 / 升级指征
            </h5>
            <ul className="space-y-1.5">
              {item.redFlags.map((flag) => (
                <li key={flag} className="flex items-start gap-2 text-[11px] leading-5 text-danger-800/85">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-danger-500" aria-hidden="true" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cn('mt-4 rounded-xl border px-3.5 py-3', config.action)}>
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-ink">
            <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
            现在要做什么
          </p>
          <p className="mt-1 text-[11px] leading-5 text-slate-600">{item.action}</p>
        </div>

        <div className="mt-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">初始检查思路</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {item.initialWorkup.map((workup) => (
              <span
                key={workup}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] leading-4 text-slate-600"
              >
                {workup}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-3 border-t border-slate-100 pt-2.5 text-[10px] leading-5 text-slate-400">
          {item.prevalenceNote}
        </p>
      </div>
    </details>
  )
}
