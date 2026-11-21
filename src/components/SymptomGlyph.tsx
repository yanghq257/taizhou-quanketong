import {
  BatteryLow,
  Brain,
  Compass,
  Droplets,
  HeartHandshake,
  HeartPulse,
  Stethoscope,
  Thermometer,
  TrendingDown,
  Utensils,
  Waves,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SymptomIcon } from '../types'
import { cn } from '../lib/utils'

const iconMap: Record<SymptomIcon, LucideIcon> = {
  fever: Thermometer,
  chest: HeartPulse,
  brain: Brain,
  dizziness: Compass,
  abdomen: Stethoscope,
  cough: Wind,
  bowel: Droplets,
  vomiting: Utensils,
  fatigue: BatteryLow,
  edema: Waves,
  'weight-loss': TrendingDown,
  anxiety: HeartHandshake,
}

export function SymptomGlyph({
  icon,
  className,
  iconClassName,
}: {
  icon: SymptomIcon
  className?: string
  iconClassName?: string
}) {
  const Icon = iconMap[icon]

  return (
    <span
      className={cn(
        'grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-jade-100/80 bg-jade-50 text-jade-700',
        className,
      )}
      aria-hidden="true"
    >
      <Icon className={cn('h-5 w-5', iconClassName)} strokeWidth={1.8} />
    </span>
  )
}
