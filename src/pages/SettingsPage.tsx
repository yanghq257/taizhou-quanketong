import {
  Building2,
  CheckCircle2,
  Download,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  Type,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { DataDisclaimer } from '../components/DataDisclaimer'
import { PageHeader } from '../components/PageHeader'
import { useHospitalSettings, SETTINGS_KEY, CHECKLIST_KEY } from '../hooks/useHospitalSettings'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { cn, onlyPhoneNumber, removeStorage } from '../lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function detectStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  return Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
}

export function SettingsPage() {
  const { settings, saveSettings } = useHospitalSettings()
  const online = useOnlineStatus()
  const [draft, setDraft] = useState({
    department: settings.department,
    emergencyPhone: settings.emergencyPhone,
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(
    () => navigator.userAgent.includes('TaizhouQuanketongAndroid/') || detectStandalone(),
  )
  const savedTimerRef = useRef<number | null>(null)

  useEffect(() => {
    document.title = '设置 · 台州全科通'
    return () => {
      if (savedTimerRef.current !== null) window.clearTimeout(savedTimerRef.current)
    }
  }, [])

  useEffect(() => {
    setDraft({
      department: settings.department,
      emergencyPhone: settings.emergencyPhone,
    })
  }, [settings.department, settings.emergencyPhone])

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  function showSaved() {
    setSaved(true)
    if (savedTimerRef.current !== null) window.clearTimeout(savedTimerRef.current)
    savedTimerRef.current = window.setTimeout(() => setSaved(false), 2400)
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const department = draft.department.trim()
    if (!department) {
      setError('请填写所在科室，便于日后院内配置区分。')
      return
    }
    setError('')
    saveSettings({
      department,
      emergencyPhone: onlyPhoneNumber(draft.emergencyPhone),
    })
    showSaved()
  }

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') setInstalled(true)
    setInstallPrompt(null)
  }

  function clearLocalData() {
    if (!window.confirm('清除本机保存的科室设置、急救电话和清单勾选？不会影响应用缓存，此操作不可撤销。')) {
      return
    }
    removeStorage(SETTINGS_KEY, CHECKLIST_KEY)
    window.location.reload()
  }

  return (
    <div>
      <PageHeader
        eyebrow="Local setup"
        title="设置"
        description="填写院内信息、调整阅读体验、安装到手机桌面。所有设置仅保存在本机浏览器，不需要账号，也不会上传患者数据。"
      />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <section className="surface-card overflow-hidden" aria-labelledby="hospital-heading">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5 md:px-5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-jade-800 text-white" aria-hidden="true">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <p className="eyebrow">Institution profile</p>
              <h2 id="hospital-heading" className="text-sm font-semibold text-ink">
                院内信息
              </h2>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 p-4 md:p-5">
            <div>
              <label htmlFor="department" className="text-[11px] font-semibold text-slate-600">
                所在科室
              </label>
              <input
                id="department"
                type="text"
                value={draft.department}
                onChange={(event) => setDraft((current) => ({ ...current, department: event.target.value }))}
                maxLength={30}
                className="form-input mt-1.5"
                placeholder="全科医学科"
                autoComplete="organization"
              />
            </div>

            <div>
              <label htmlFor="emergency-phone" className="text-[11px] font-semibold text-slate-600">
                院内急救电话
              </label>
              <div className="relative mt-1.5">
                <Phone
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="emergency-phone"
                  type="tel"
                  inputMode="tel"
                  value={draft.emergencyPhone}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, emergencyPhone: event.target.value }))
                  }
                  maxLength={24}
                  className="form-input pl-10"
                  placeholder="请填写本院正式公布的急救内线"
                  autoComplete="off"
                  aria-describedby="emergency-phone-help"
                />
              </div>
              <p id="emergency-phone-help" className="mt-1.5 text-[10px] leading-5 text-slate-400">
                留空也可以使用，但红旗速查页将不能一键拨号。请以本院发布的号码为准，本应用不内置任何示例号码。
              </p>
            </div>

            {error ? (
              <p role="alert" className="rounded-xl border border-danger-100 bg-danger-50 px-3 py-2 text-[10px] leading-5 text-danger-700">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-jade-800 px-4 text-sm font-semibold text-white transition hover:bg-jade-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                保存设置
              </button>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-medium text-jade-700 transition-opacity',
                  saved ? 'opacity-100' : 'opacity-0',
                )}
                aria-live="polite"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                已保存到本机
              </span>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <section className="surface-card overflow-hidden" aria-labelledby="readability-heading">
            <div className="flex items-center gap-2.5 px-4 py-4 md:px-5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-jade-50 text-jade-700" aria-hidden="true">
                <Type className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="readability-heading" className="text-sm font-semibold text-ink">
                  阅读舒适度
                </h2>
                <p className="mt-0.5 text-[10px] leading-5 text-slate-500">
                  适老化大字号，按全站比例放大，不需要缩放页面。
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.showLargeText}
                aria-labelledby="readability-heading"
                onClick={() => saveSettings({ showLargeText: !settings.showLargeText })}
                className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500 focus-visible:ring-offset-2"
              >
                <span
                  className={cn(
                    'relative block h-6 w-11 rounded-full transition',
                    settings.showLargeText ? 'bg-jade-700' : 'bg-slate-200',
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all',
                      settings.showLargeText ? 'left-[22px]' : 'left-0.5',
                    )}
                  />
                </span>
              </button>
            </div>
            <p className="border-t border-slate-100 bg-sand/50 px-4 py-2.5 text-[10px] leading-5 text-amber-800/75 md:px-5">
              大字模式下建议横屏查看表格与鉴别卡片；阅读偏好会随本机设置保存。
            </p>
          </section>

          <section className="surface-card overflow-hidden" aria-labelledby="pwa-heading">
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5 md:px-5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-jade-50 text-jade-700" aria-hidden="true">
                <Smartphone className="h-4 w-4" />
              </span>
              <div>
                <p className="eyebrow">Install as app</p>
                <h2 id="pwa-heading" className="text-sm font-semibold text-ink">
                  安装到手机桌面
                </h2>
              </div>
            </div>
            <div className="p-4 md:p-5">
              {installed ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-jade-200 bg-jade-50/60 px-3.5 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-jade-700" aria-hidden="true" />
                  <p className="text-[11px] leading-5 text-jade-900/80">
                    已以独立应用模式运行。离线时可以继续查阅已缓存内容。
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[11px] leading-5 text-slate-500">
                    安装后可全屏启动，并在弱网/离线时打开已缓存的学习内容。首次打开后建议至少联网使用一次，让缓存完整。
                  </p>
                  {installPrompt ? (
                    <button
                      type="button"
                      onClick={handleInstall}
                      className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-jade-200 bg-jade-50 px-3.5 text-xs font-semibold text-jade-800 transition hover:bg-jade-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-500"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      安装“台州全科通”
                    </button>
                  ) : (
                    <div className="mt-3 rounded-xl bg-slate-50 px-3.5 py-3 text-[10px] leading-5 text-slate-500">
                      <p className="font-semibold text-slate-600">手动添加到桌面：</p>
                      <p className="mt-1">
                        Android / 桌面浏览器：菜单（⋮）→“安装应用”或“添加到主屏幕”。
                      </p>
                      <p>Safari（iPhone / iPad）：分享按钮 →“添加到主屏幕”。</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
        <section className="surface-card overflow-hidden" aria-labelledby="data-heading">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-4 py-3.5 md:px-5">
            <span
              className={cn(
                'grid h-8 w-8 place-items-center rounded-xl',
                online ? 'bg-jade-50 text-jade-700' : 'bg-amber-50 text-amber-700',
              )}
              aria-hidden="true"
            >
              {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            </span>
            <div>
              <p className="eyebrow">Local data</p>
              <h2 id="data-heading" className="text-sm font-semibold text-ink">
                离线与数据
              </h2>
            </div>
            <span
              className={cn(
                'ml-auto rounded-full border px-2 py-0.5 text-[9px] font-medium',
                online
                  ? 'border-jade-100 bg-jade-50 text-jade-700'
                  : 'border-amber-100 bg-amber-50 text-amber-700',
              )}
            >
              {online ? '在线' : '离线'}
            </span>
          </div>
          <div className="space-y-3 p-4 md:p-5">
            <div className="grid gap-2 text-[10px] leading-5 text-slate-500">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jade-600" aria-hidden="true" />
                无账号体系、无后端请求、不采集患者信息；搜索与问诊勾选均在本机完成。
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jade-600" aria-hidden="true" />
                科室、急救电话与清单进度保存在浏览器 localStorage，换手机/清除浏览器数据后不会恢复。
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jade-600" aria-hidden="true" />
                首次构建上线需启用 HTTPS，Service Worker 才能接管离线缓存。
              </p>
            </div>
            <button
              type="button"
              onClick={clearLocalData}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-medium text-slate-500 transition hover:border-danger-100 hover:bg-danger-50 hover:text-danger-700"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              清除本机设置与清单进度
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-amber-100 bg-[linear-gradient(135deg,#FFFDF6_0%,#FFFFFF_80%)] p-4 md:p-5" aria-labelledby="safety-heading">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-700" aria-hidden="true">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="eyebrow text-amber-700">Before clinical use</p>
              <h2 id="safety-heading" className="text-sm font-semibold text-ink">
                上线前必须完成
              </h2>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-[10px] leading-5 text-slate-600">
            {[
              '由医务科、药剂科、急诊/重症与信息科联合审核全部症状、方药和流程。',
              '用本院正式基药目录、处方权限和急救号码替换示例内容。',
              '确认患者数据不进入本应用；本版本不提供病历存储、账号或联网同步。',
              '明确版本负责人、更新周期、问题反馈与下线机制。',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-amber-100 pt-3 text-[9px] leading-5 text-slate-400">
            版本：v0.1.0 教学演示版 · 数据打包在本地前端
          </p>
        </section>
      </div>

      <div className="mt-4">
        <DataDisclaimer />
      </div>
    </div>
  )
}
