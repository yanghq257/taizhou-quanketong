import type { SearchMatch, Symptom, SymptomId } from '../../types'
import { fever } from './fever'
import { chestPain } from './chest-pain'
import { headache } from './headache'
import { dizziness } from './dizziness'
import { abdominalPain } from './abdominal-pain'
import { cough } from './cough'
import { diarrhea } from './diarrhea'
import { vomiting } from './vomiting'
import { fatigue } from './fatigue'
import { edema } from './edema'
import { weightLoss } from './weight-loss'
import { anxiety } from './anxiety'

export const symptoms: Symptom[] = [
  fever,
  chestPain,
  headache,
  dizziness,
  abdominalPain,
  cough,
  diarrhea,
  vomiting,
  fatigue,
  edema,
  weightLoss,
  anxiety,
]

export const symptomMap = new Map<string, Symptom>(
  symptoms.map((symptom) => [symptom.id, symptom]),
)

/** 首页按全科门诊学习优先级展示，不代表经审核的本地发病率。 */
export const homeSymptomOrder: SymptomId[] = [
  'fever',
  'cough',
  'diarrhea',
  'vomiting',
  'dizziness',
  'abdominal-pain',
  'headache',
  'chest-pain',
]

/** 未分化疾病 / 全身症状入口；首页单独成组展示。 */
export const undifferentiatedSymptomOrder: SymptomId[] = [
  'fatigue',
  'edema',
  'weight-loss',
  'anxiety',
]

export function getSymptom(id: string | undefined): Symptom | undefined {
  if (!id) return undefined
  return symptomMap.get(id)
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '')
}

/**
 * 轻量级本地检索：支持症状名称、别名、英文名，以及鉴别诊断名称/英文名。
 * 输入“心梗”也能定位到“胸痛”详情。
 */
export function searchSymptoms(rawQuery: string): SearchMatch[] {
  const query = normalize(rawQuery)
  if (!query) return []

  return symptoms.flatMap((symptom) => {
    const fields = [
      symptom.name,
      symptom.englishName,
      ...symptom.aliases,
      symptom.category,
      symptom.tagline,
    ]

    if (fields.some((field) => normalize(field).includes(query))) {
      const matchedOn = normalize(symptom.name).includes(query)
        ? '症状名称'
        : symptom.aliases.some((alias) => normalize(alias).includes(query))
          ? '症状别名'
          : '症状相关'
      return [{ symptom, matchedOn }]
    }

    const differential = symptom.differentials.find(
      (item) =>
        normalize(item.name).includes(query) ||
        (item.englishName ? normalize(item.englishName).includes(query) : false),
    )

    if (differential) {
      return [
        {
          symptom,
          matchedOn: '鉴别诊断',
          matchedDifferential: differential.name,
        },
      ]
    }

    return []
  })
}

export const popularSearches = ['发热', '胸痛', '头晕', '腹痛', '咳嗽', '腹泻']

export const chestPainSymptom = chestPain
