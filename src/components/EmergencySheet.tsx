import { ArrowRight, Phone, Settings2, ShieldAlert, Siren, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { onlyPhoneNumber } from '../lib/utils'
import { useHospitalSettings } from '../hooks/useHospitalSettings'

const emergencyChecks = [
  {
    title: '胸痛 / 胸闷',
    body: '有设备时 10 分钟内完成 12 导联心电图；持续胸痛、冷汗、晕厥、低氧 → 立即呼叫上级/胸痛团队。',
    route: '/symptom/chest-pain',
  },
  {
    title: '疑似卒中',
    body: '看平衡、眼睛、面部、手臂、语言；记录“最后正常时间”，立即启动卒中绿色通道，不等待门诊 CT 排队。',
    route: '/symptom/headache',
  },
  {
    title: '呼吸困难 / 低氧',
    body: 'SpO₂ < 92% 或呼吸窘迫、不能完整说话 → 坐位、给氧、监护，呼叫急诊/呼吸科。',
    route: '/symptom/cough',
  },
  {
    title: '休克 / 意识改变',
    body: '低血压、皮肤花斑、少尿、反应迟钝 → 立即启动院内急救，建立监护，不要独留患者。',
    route: '/symptom/fever',
  },
  {
    title: '过敏反应 / 气道受累',
    body: '喉紧、喘鸣、全身荨麻疹、低血压 → 按院内过敏反应流程使用肾上腺素并呼救，不要只观察抗组胺效果。',
    route: '/checklist',
  },
] as const

export function EmergencySheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { settings } = useHospitalSettings()
  const phoneHref = onlyPhoneNumber(settings.emergencyPhone)

  useEffect(() => {
    if (!open) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousActiveElement?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-sheet-title"
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[28px] border border-white/60 bg-[#FFFDFC] shadow-float sm:rounded-[28px]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-danger-100 bg-[#FFFDFC]/95 px-5 pb-4 pt-5 backdrop-blur">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-danger-50 text-danger-600">
              <Siren className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-danger-600">
                Red flag first
              </p>
              <h2 id="emergency-sheet-title" className="mt-0.5 text-lg font-semibold text-ink">
                先停下搜索，处理不稳定患者
              </h2>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
            aria-label="关闭红旗速查"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-danger-100 bg-danger-50/80 p-3.5 text-xs leading-5 text-danger-900">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              如果患者正在发生以下情况，请立即呼叫身边同事/上级并启动院内急救。不要一个人搬运患者，也不要为了继续查资料而延误处置。
            </p>
          </div>

          <div className="space-y-2.5">
            {emergencyChecks.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-danger-50 text-[11px] font-bold text-danger-700">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  <Link
                    to={item.route}
                    onClick={onClose}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-jade-700 hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-400"
                  >
                    查看
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
                <p className="mt-2 pl-8 text-xs leading-5 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-jade-900 p-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-jade-100/80">院内急救电话（占位）</p>
                <p className="mt-1 text-lg font-semibold">
                  {settings.emergencyPhone || '待填写'}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-jade-100/70">
                  {settings.emergencyPhone
                    ? `来源：设置中的院内信息 · ${settings.department}`
                    : '本应用不内置虚构号码，请先在设置中填写本院真实急救电话。'}
                </p>
              </div>
              {phoneHref ? (
                <a
                  href={`tel:${phoneHref}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-jade-900 transition hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  呼叫院内
                </a>
              ) : (
                <Link
                  to="/settings"
                  onClick={onClose}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Settings2 className="h-4 w-4" aria-hidden="true" />
                  去设置
                </Link>
              )}
            </div>
          </div>

          <p className="mt-3 px-1 text-[11px] leading-5 text-slate-500">
            公共急救电话 120 可用于院外场景；院内流程与急救电话须以本院制度为准。此处内容仅作学习提示。
          </p>
        </div>
      </div>
    </div>
  )
}
