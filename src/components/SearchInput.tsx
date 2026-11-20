import { Search, X } from 'lucide-react'
import { useId } from 'react'
import { cn } from '../lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  label?: string
  autoFocus?: boolean
  className?: string
  hero?: boolean
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = '搜索症状、疾病或别名',
  label = '搜索症状',
  autoFocus,
  className,
  hero = false,
}: SearchInputProps) {
  const inputId = useId()

  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(value.trim())
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search
        className={cn(
          'pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2',
          hero ? 'text-jade-600' : 'text-slate-400',
        )}
        aria-hidden="true"
      />
      <input
        id={inputId}
        type="text"
        inputMode="search"
        autoComplete="off"
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-2xl border bg-white pl-11 pr-11 text-[15px] text-ink outline-none transition placeholder:text-slate-400',
          hero
            ? 'h-14 border-white/70 shadow-[0_12px_40px_rgba(4,47,43,0.22)] focus:border-jade-300 focus:ring-4 focus:ring-white/20'
            : 'h-12 border-slate-200/80 shadow-sm focus:border-jade-400 focus:ring-4 focus:ring-jade-100',
        )}
        aria-describedby={undefined}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-400"
          aria-label="清空搜索"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <span
          className={cn(
            'pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:block',
            hero ? 'border-white/20 text-white/50' : 'border-slate-200 text-slate-400',
          )}
        >
          回车
        </span>
      )}
    </form>
  )
}
