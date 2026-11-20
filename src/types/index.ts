/**
 * 台州全科通：核心数据类型
 *
 * 说明：
 * 1. 本文件定义结构，真实院内落地时应由医务、药剂、急诊、信息科共同审核数据。
 * 2. “概率”采用门诊常见度的定性标签，不是经过本地流行病学验证的精确概率。
 */

export type SymptomId =
  | 'fever'
  | 'chest-pain'
  | 'headache'
  | 'dizziness'
  | 'abdominal-pain'
  | 'cough'
  | 'diarrhea'

export type SymptomIcon =
  | 'fever'
  | 'chest'
  | 'brain'
  | 'dizziness'
  | 'abdomen'
  | 'cough'
  | 'bowel'

export type DifferentialTier = 'critical' | 'common' | 'rare'

export type Likelihood = '优先排除' | '最常见' | '常见' | '较少见'

export type TriageUrgency = 'immediate' | 'urgent' | 'routine'

export type ExamTiming = '立即' | '当日' | '按需' | '择期'

export type TcmQuestionId =
  | 'coldHeat'
  | 'sweat'
  | 'headBody'
  | 'stoolUrine'
  | 'appetite'
  | 'chestAbdomen'
  | 'sleep'
  | 'emotion'
  | 'menstruation'
  | 'history'

export interface TcmQuestion {
  id: TcmQuestionId
  label: string
  prompt: string
}

export interface OpqrstPrompt {
  letter: 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  label: string
  prompt: string
}

export interface Differential {
  id: string
  name: string
  englishName?: string
  tier: DifferentialTier
  likelihood: Likelihood
  /** 一句话门诊画像，帮助快速建立“像不像”的直觉 */
  summary: string
  /** 常见度/流行病学提示，避免被误读为精确概率 */
  prevalenceNote: string
  clues: string[]
  redFlags: string[]
  /** 当前场景下的下一步动作，强调安全边界 */
  action: string
  initialWorkup: string[]
}

export interface TriageInfo {
  urgency: TriageUrgency
  label: string
  message: string
  criteria: string[]
}

export interface TcmPattern {
  id: string
  name: string
  /** 典型证候表现 */
  keySigns: string[]
  tongue: string
  pulse: string
  principle: string
  baseFormula: string
  cautions: string[]
}

export interface ExamItem {
  id: string
  name: string
  timing: ExamTiming
  category: '生命体征' | '检验' | '影像' | '床旁' | '其他'
  rationale: string
}

export interface SymptomCommunication {
  plainLanguage: string[]
  referral: string[]
  pitfalls: string[]
}

export interface Symptom {
  id: SymptomId
  name: string
  englishName: string
  aliases: string[]
  icon: SymptomIcon
  category: string
  tagline: string
  overview: string
  epidemiologyNote: string
  triage: TriageInfo
  differentials: Differential[]
  opqrst: OpqrstPrompt[]
  /** 本病在标准十问中的追问重点 */
  tcmFocus: Partial<Record<TcmQuestionId, string>>
  tcmPatterns: TcmPattern[]
  exams: ExamItem[]
  medicationIds: string[]
  formulaIds: string[]
  communication: SymptomCommunication
  reviewNote: string
}

export interface Medication {
  id: string
  name: string
  kind: '中成药' | '西药'
  category: string
  /** 示例规格，上线前必须对照院内招标/基药目录 */
  specs: string
  prescriptionType: 'OTC' | 'Rx' | '院内管理'
  indications: string
  usageNote: string
  cautions: string[]
  interactions: string[]
  tags: string[]
}

export interface Formula {
  id: string
  name: string
  source: string
  composition: string[]
  pattern: string
  principle: string
  indications: string
  cautions: string[]
}

export interface SafetyAlert {
  id: string
  level: 'critical' | 'warning'
  title: string
  combination: string
  risk: string
  action: string
}

export type ScriptCategory =
  | '解释病情'
  | '转诊沟通'
  | '急症升级'
  | '用药沟通'
  | '老年沟通'
  | '中医沟通'

export interface CommunicationScript {
  id: string
  category: ScriptCategory
  title: string
  scenario: string
  audience: string
  lines: string[]
  avoid: string[]
  note?: string
}

export interface ChecklistItem {
  id: string
  title: string
  detail: string
  critical?: boolean
  /** 需按本院实际制度/表单核对 */
  institutionSpecific?: boolean
}

export interface ChecklistSection {
  id: string
  title: string
  subtitle: string
  items: ChecklistItem[]
}

export interface SearchMatch {
  symptom: Symptom
  matchedOn: string
  matchedDifferential?: string
}

export interface HospitalSettings {
  department: string
  emergencyPhone: string
  showLargeText: boolean
}
