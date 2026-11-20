import type { TcmQuestion } from '../types'

/**
 * 通用十问框架。各症状通过 Symptom.tcmFocus 给出本病追问重点。
 * 用于训练问诊完整性，不替代正式中医四诊。
 */
export const TCM_TEN_QUESTIONS: TcmQuestion[] = [
  {
    id: 'coldHeat',
    label: '寒热',
    prompt: '恶寒与发热孰轻孰重？有无寒战、寒热往来、但热不寒或潮热？',
  },
  {
    id: 'sweat',
    label: '汗',
    prompt: '有汗无汗？自汗、盗汗、半身汗？得汗后症状是否缓解？',
  },
  {
    id: 'headBody',
    label: '头身',
    prompt: '有无头痛、头晕、身重、身痛或肢体麻木无力？',
  },
  {
    id: 'stoolUrine',
    label: '二便',
    prompt: '大便次数、性状、颜色、有无黏液脓血；小便的量、色、频次及排尿不适。',
  },
  {
    id: 'appetite',
    label: '饮食',
    prompt: '食欲、口渴及喜冷热饮；有无恶心、呕吐、口苦、口黏。',
  },
  {
    id: 'chestAbdomen',
    label: '胸腹',
    prompt: '有无胸闷、心悸、气短、腹胀、腹痛及其部位、性质和压痛点。',
  },
  {
    id: 'sleep',
    label: '睡眠',
    prompt: '入睡困难、易醒、多梦或嗜睡？是否影响白天活动？',
  },
  {
    id: 'emotion',
    label: '情志',
    prompt: '近期压力、焦虑、抑郁、易怒或善太息？睡眠与情绪是否相关？',
  },
  {
    id: 'menstruation',
    label: '经带',
    prompt: '育龄女性必问：末次月经、周期、经量、带下及妊娠可能。',
  },
  {
    id: 'history',
    label: '旧病用药',
    prompt: '基础病、过敏史、近期抗生素/激素/免疫抑制剂、长期中西药和保健品。',
  },
]
