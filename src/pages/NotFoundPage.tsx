import { ArrowLeft, Compass, ShieldAlert } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  useEffect(() => {
    document.title = '页面不存在 · 台州全科通'
  }, [])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-jade-50 text-jade-700">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">404 · Page not found</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">这个页面走丢了</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        链接可能已更新，或手动输入的地址有误。临症请从症状索引重新进入；情况不稳请先走红旗速查。
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-jade-800 px-4 text-sm font-semibold text-white transition hover:bg-jade-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回首页
        </Link>
        <Link
          to="/checklist"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-danger-100 bg-danger-50 px-4 text-sm font-medium text-danger-700 transition hover:bg-danger-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-600"
        >
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          查看避坑清单
        </Link>
      </div>
    </div>
  )
}
