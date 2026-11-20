import type { SafetyNet, Symptom } from '../types'
import { TCM_TEN_QUESTIONS } from '../data/tcm'
import { formulaMap } from '../data/formulas'
import { medicationMap } from '../data/medications'

export interface SoapDraft {
  subjective: string[]
  objective: string[]
  assessment: string[]
  plan: string[]
  text: string
}

export function buildSafetyNetSentence(safetyNet: SafetyNet): string {
  return `如果出现${safetyNet.triggers.join('、')}，请立刻复诊/去急诊。`
}

export function buildSafetyNetText(safetyNet: SafetyNet): string {
  return [
    '如果出现以下任一情况，请立刻复诊/去急诊：',
    ...safetyNet.triggers.map((trigger, index) => `${index + 1}. ${trigger}`),
    safetyNet.action,
    `随访：${safetyNet.followUp}`,
  ].join('\n')
}

/**
 * 生成学习用 SOAP 草稿。
 *
 * 当前问诊单只记录“问过哪些问题”，不记录患者的具体回答，因此本函数不会
 * 虚构病史、诊断或已执行检查；未采集内容统一保留为【待补充】。
 */
export function buildSoapDraft(symptom: Symptom, checked: Set<string>): SoapDraft {
  const westernDone = symptom.opqrst.filter((item) => checked.has(`west:${item.letter}`))
  const tcmDone = TCM_TEN_QUESTIONS.filter((item) => checked.has(`tcm:${item.id}`))

  const askedParts: string[] = []
  if (westernDone.length > 0) {
    askedParts.push(
      `OPQRST ${westernDone.map((item) => `${item.letter} ${item.label}`).join('、')}`,
    )
  }
  if (tcmDone.length > 0) {
    askedParts.push(`中医十问 ${tcmDone.map((item) => item.label).join('、')}`)
  }

  const subjective = [
    `主诉：${symptom.name}【待补充起病时间、持续时间及严重程度】`,
    askedParts.length > 0
      ? `现病史：已勾选问及 ${askedParts.join('；')}。具体阳性/阴性所见及演变经过【待补充】。`
      : '现病史：问诊要点尚未勾选；请补充起病、演变、伴随症状及诊疗经过。',
    '既往史、用药史、过敏史：【待补充】',
  ]

  if (symptom.yellowFlags && symptom.yellowFlags.length > 0) {
    subjective.push(
      `黄旗筛查：${symptom.yellowFlags.map((flag) => flag.title).join('、')}（是否阳性及具体表现【待补充】）。`,
    )
  }

  const examSummary = symptom.exams
    .map((exam) => `${exam.name}（${exam.timing}）`)
    .join('；')
  const objective = [
    '查体：生命体征、心肺查体及本症状重点查体【待补充】',
    `辅助检查建议（不代表已执行）：${examSummary}。`,
  ]

  const criticalNames = symptom.differentials
    .filter((item) => item.tier === 'critical')
    .map((item) => item.name)
    .join('、')
  const commonNames = symptom.differentials
    .filter((item) => item.tier === 'common')
    .map((item) => item.name)
    .join('、')
  const patternNames = symptom.tcmPatterns.map((pattern) => pattern.name).join('、')

  const assessment = [
    `西医评估：${symptom.name}待查；优先排除：${criticalNames || '【待补充】'}。`,
    `常见考虑：${commonNames || '【待补充】'}。初步诊断【待明确】。`,
    `中医证型：待辨证；可参考：${patternNames || '【待补充】'}。舌象、脉象【待补充】。`,
  ]

  const medicationNames = symptom.medicationIds
    .map((id) => medicationMap.get(id)?.name)
    .filter((name): name is string => Boolean(name))
  const formulaNames = symptom.formulaIds
    .map((id) => formulaMap.get(id)?.name)
    .filter((name): name is string => Boolean(name))
  const relatedReferences = [...medicationNames, ...formulaNames]

  const plan = [
    `用药：【待填写；本工具不提供剂量与疗程】${
      relatedReferences.length > 0
        ? ` 相关参考（非处方建议）：${relatedReferences.join('、')}。`
        : ''
    }`,
    `健康宣教：${symptom.communication.plainLanguage[0] ?? '按本次评估进行个体化健康宣教。'}`,
    `随访：${
      symptom.safetyNet?.followUp ?? '按本次评估约定时间复诊；症状加重随时复诊。'
    }`,
    symptom.safetyNet
      ? `安全网：${buildSafetyNetSentence(symptom.safetyNet)}${symptom.safetyNet.action}`
      : '安全网：如出现意识改变、呼吸困难、晕厥或症状明显加重，请立刻复诊/去急诊。',
  ]

  const text = [
    '台州全科通 · SOAP 病历草稿（学习模板）',
    `症状入口：${symptom.name}`,
    '说明：本草稿不包含患者身份信息，不能直接写入病历；请补充真实问诊、查体和检查结果。',
    '',
    'S 主观',
    ...subjective.map((line) => `- ${line}`),
    '',
    'O 客观',
    ...objective.map((line) => `- ${line}`),
    '',
    'A 评估',
    ...assessment.map((line) => `- ${line}`),
    '',
    'P 计划',
    ...plan.map((line) => `- ${line}`),
  ].join('\n')

  return { subjective, objective, assessment, plan, text }
}
