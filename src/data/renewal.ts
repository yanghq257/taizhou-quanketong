import type { ChecklistItem } from '../types'

/** 续药/复检场景的临时核对项；不写入病历、不保存患者数据。 */
export const renewalChecklistItems: ChecklistItem[] = [
  {
    id: 'renewal-overdue',
    title: '距离上次复诊是否超期？',
    detail:
      '按该慢病的随访周期核对上次就诊日期、检查结果和用药调整。超期、失访或近期频繁换药时，先补评估再续药。',
    institutionSpecific: true,
  },
  {
    id: 'renewal-labs',
    title: '肝肾功能和关键复检是否到期？',
    detail:
      '核对近 3–6 个月的肝功能、肾功能、电解质、血糖/HbA1c、血脂、尿常规/ACR 等；结果异常或从未复查时，先安排复检。',
    critical: true,
  },
  {
    id: 'renewal-new-symptoms',
    title: '是否出现新的未分化症状？',
    detail:
      '主动问乏力、水肿、消瘦、焦虑、发热、疼痛、黑便、气短等新症状。新症状可能提示并发症、药物不良反应或需要转诊。',
    critical: true,
  },
  {
    id: 'renewal-bp',
    title: '单纯续降压药：先测血压再决定',
    detail:
      '如果患者只是来续降压药，必须核对本次血压是否达标，不能盲目续药；同时问头晕、跌倒、低血压、依从性和家庭血压记录。',
    critical: true,
  },
  {
    id: 'renewal-medication-review',
    title: '当前用药、过敏和不良反应是否核对？',
    detail:
      '逐项核对处方药、OTC、中成药、保健品和偏方；关注重复成分、相互作用、肝肾功能、妊娠/哺乳和老年人跌倒/镇静风险。',
    critical: true,
  },
  {
    id: 'renewal-plan',
    title: '复检、转诊和安全网是否交代？',
    detail:
      '明确下次复诊时间、需要复查的项目、结果领取方式，以及出现胸痛、气短、黑便、意识改变等红旗时立即就诊。',
    institutionSpecific: true,
  },
]
