import { Flag, Info } from 'lucide-react'
import type { YellowFlag } from '../../types'

export function YellowFlagsPanel({ flags }: { flags?: YellowFlag[] }) {
  if (!flags || flags.length === 0) return null

  return (
    <section
      aria-label="心理社会黄旗筛查"
      className="overflow-hidden rounded-2xl border border-amber-200/80 bg-[linear-gradient(135deg,#FFF9EC_0%,#FFFDF8_72%,#FFFFFF_100%)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-amber-100/80 px-4 py-3.5">
        <div className="flex items-start gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <Flag className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
              Yellow flags
            </p>
            <h3 className="mt-0.5 text-sm font-semibold text-ink">黄旗 · 心理社会因素</h3>
          </div>
        </div>
        <span className="rounded-full border border-amber-200 bg-white/80 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
          不降低红旗门槛
        </span>
      </div>

      <div className="px-4 py-3.5">
        <div className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-[10px] leading-5 text-amber-900/75">
          <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" aria-hidden="true" />
          <p>
            黄旗用于提示心理社会因素、沟通难度和随访风险，帮助加强解释与支持；不能据此排除器质性急症，也不能替代问诊、查体和检查。
          </p>
        </div>

        <div className="mt-3 space-y-2.5">
          {flags.map((flag) => (
            <article
              key={flag.id}
              className="rounded-xl border border-amber-100/90 bg-white/80 px-3.5 py-3"
            >
              <h4 className="text-xs font-semibold text-ink">{flag.title}</h4>
              <ul className="mt-2 space-y-1">
                {flag.signals.map((signal) => (
                  <li
                    key={signal}
                    className="flex items-start gap-1.5 text-[11px] leading-5 text-slate-600"
                  >
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400"
                      aria-hidden="true"
                    />
                    {signal}
                  </li>
                ))}
              </ul>
              <p className="mt-2 rounded-lg bg-amber-50/80 px-2.5 py-2 text-[10px] leading-5 text-amber-900/80">
                <strong>处理提示：</strong>
                {flag.action}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
