import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { copyText, cn } from '../lib/utils'

interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}

export function CopyButton({
  text,
  label = '复制',
  copiedLabel = '已复制',
  className,
}: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  async function handleCopy() {
    const ok = await copyText(text)
    setStatus(ok ? 'copied' : 'failed')
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setStatus('idle'), 2000)
  }

  const currentLabel = status === 'copied' ? copiedLabel : status === 'failed' ? '复制失败' : label

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-jade-200 hover:bg-jade-50 hover:text-jade-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-400',
        status === 'copied' && 'border-jade-200 bg-jade-50 text-jade-800',
        status === 'failed' && 'border-danger-200 bg-danger-50 text-danger-700',
        className,
      )}
      aria-live="polite"
    >
      {status === 'copied' ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {currentLabel}
    </button>
  )
}
