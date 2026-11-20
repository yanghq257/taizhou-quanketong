import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Symptom } from '../types'
import { SymptomGlyph } from './SymptomGlyph'

interface SymptomCardProps {
  symptom: Symptom
  matchedOn?: string
  matchedDifferential?: string
  compact?: boolean
}

export function SymptomCard({
  symptom,
  matchedOn,
  matchedDifferential,
  compact = false,
}: SymptomCardProps) {
  const criticalCount = symptom.differentials.filter((item) => item.tier === 'critical').length
  const commonCount = symptom.differentials.filter((item) => item.tier === 'common').length

  return (
    <Link
      to={`/symptom/${symptom.id}`}
      className="group flex items-start gap-3.5 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-jade-200 hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
    >
      <SymptomGlyph
        icon={symptom.icon}
        className={compact ? 'h-10 w-10 rounded-xl' : undefined}
        iconClassName={compact ? 'h-[18px] w-[18px]' : undefined}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-ink">{symptom.name}</span>
          <span className="text-[10px] font-medium text-slate-400">{symptom.englishName}</span>
          <ArrowUpRight
            className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-jade-600"
            aria-hidden="true"
          />
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{symptom.tagline}</span>
        {matchedOn ? (
          <span className="mt-2 inline-flex rounded-md bg-jade-50 px-2 py-1 text-[10px] font-medium text-jade-700">
            {matchedDifferential ? `命中鉴别：${matchedDifferential}` : matchedOn}
          </span>
        ) : (
          <span className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
            <span className="rounded-md bg-danger-50 px-2 py-1 text-danger-700">
              {criticalCount} 项红旗
            </span>
            <span className="rounded-md bg-jade-50 px-2 py-1 text-jade-700">{commonCount} 项常见</span>
            <span className="ml-auto inline-flex items-center gap-0.5 text-slate-400">
              查看
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </span>
        )}
      </span>
    </Link>
  )
}
