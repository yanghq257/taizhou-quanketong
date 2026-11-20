import type { ReactNode } from 'react'

interface SectionHeadingProps {
  title: string
  description?: string
  kicker?: string
  action?: ReactNode
  id?: string
}

export function SectionHeading({ title, description, kicker, action, id }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4 md:mb-4">
      <div className="min-w-0">
        {kicker ? (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-jade-600">
            {kicker}
          </p>
        ) : null}
        <h2 id={id} className="text-lg font-semibold tracking-tight text-ink md:text-xl">
          {title}
        </h2>
        {description ? <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
