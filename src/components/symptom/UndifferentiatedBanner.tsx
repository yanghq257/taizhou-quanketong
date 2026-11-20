import { ClipboardList, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function UndifferentiatedBanner({ symptomId }: { symptomId: string }) {
  return (
    <section
      className="mt-4 rounded-2xl border border-jade-200/80 bg-[linear-gradient(135deg,#F1FAF6_0%,#FFFFFF_70%,#FBF8F1_120%)] p-4 shadow-sm md:p-5"
      aria-label="未分化疾病首诊提示"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-jade-800 text-white"
          aria-hidden="true"
        >
          <Compass className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-jade-700">
            全科首诊 · 未分化疾病
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-jade-950">
            这是典型的未分化疾病，不要急于推给专科，先在这里进行全面分析，必要时再转诊。
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              to={`/consult?symptom=${symptomId}`}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-jade-800 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-jade-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
            >
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              开始全科问诊
            </Link>
            <span className="text-[10px] leading-5 text-jade-800/70">
              先完成红旗排查，再决定检查与转诊。
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
