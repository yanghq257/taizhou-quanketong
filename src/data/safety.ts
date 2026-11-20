import type { ComorbidityMedicationRule, SafetyAlert } from '../types'

/** 门诊开方前的“红灯速查”。是学习提示，不是完整药物相互作用数据库。 */
export const safetyAlerts: SafetyAlert[] = [
  {
    id: 'ma-huang-cardio',
    level: 'critical',
    title: '含麻黄中成药 × 心血管/代谢病',
    combination: '连花清瘟、苏黄止咳，以及含麻黄/伪麻黄碱的复方感冒药',
    risk: '可能升压、加快心率、诱发心绞痛或心律失常；与拟交感药/部分抗抑郁药合用风险叠加。',
    action: '核对血压、心率和心血管病史；控制不佳时换用不含麻黄方案；同类药不要叠加。',
  },
  {
    id: 'bleeding-herbs',
    level: 'critical',
    title: '活血化瘀中药 × 抗凝/抗血小板',
    combination: '复方丹参滴丸、血府逐瘀方、三七/银杏制剂 + 华法林、利伐沙班、阿司匹林、氯吡格雷',
    risk: '出血风险增加，包括消化道出血和颅内出血。',
    action: '首诊不要自行叠加；已经出现瘀斑、黑便、血尿或 INR 异常时立即停药并请上级/药师评估。',
  },
  {
    id: 'alcohol-disulfiram',
    level: 'critical',
    title: '含乙醇藿香正气水 × 头孢/甲硝唑',
    combination: '藿香正气水（含乙醇）+ 头孢菌素、甲硝唑、替硝唑等',
    risk: '可能发生双硫仑样反应：面红、心悸、低血压、呕吐，严重可休克。',
    action: '首选不含乙醇的软胶囊/口服液；处方时主动核对近期抗菌药和饮酒史。',
  },
  {
    id: 'apap-duplication',
    level: 'critical',
    title: '对乙酰氨基酚重复叠加',
    combination: '对乙酰氨基酚 + 多种复方感冒药/退热中成药',
    risk: '总剂量超限可导致急性肝损伤，尤其在饮酒、营养不良或肝病背景下。',
    action: '逐个核对成分和每日总量；患者自购感冒药要照片核对；不明成分不允许叠加。',
  },
  {
    id: 'nsaid-aki',
    level: 'critical',
    title: 'NSAID × 脱水/肾功能/CV 高风险',
    combination: '布洛芬 + ACEI/ARB + 利尿剂；或伴脱水、老年、心衰、肾功能不全',
    risk: '急性肾损伤、消化道出血、心衰加重；妊娠晚期禁用。',
    action: '先评估容量状态和用药史；能不用则不用；必须用时选择最低风险方案并安排复诊。',
  },
  {
    id: 'cardiac-glycoside',
    level: 'warning',
    title: '含蟾酥中成药 × 强心苷',
    combination: '麝香保心丸 + 地高辛等强心苷类药物',
    risk: '可能增加心律失常/强心苷毒性风险，尤其伴电解质紊乱时。',
    action: '处方前请心内科/药师评估；监测心率、电解质和心电图。',
  },
  {
    id: 'adsorbent-interaction',
    level: 'warning',
    title: '蒙脱石散“吸附”其他口服药',
    combination: '蒙脱石散 + 任何口服药物，尤其是甲状腺素、左氧氟沙星、地高辛等',
    risk: '可降低其他药物吸收，导致疗效不足。',
    action: '与所有其他口服药间隔至少 2 小时；优先用口服补液盐纠正脱水。',
  },
  {
    id: 'nephrotoxic-herbs',
    level: 'critical',
    title: '来源不明偏方 × 肝肾功能',
    combination: '关木通、广防己、青木香等含马兜铃酸药材；成分不明的“排毒/减肥/止痛”偏方',
    risk: '马兜铃酸肾病、肝损伤和潜在致癌风险；慢性肾病患者风险更高。',
    action: '不采信自制药酒/偏方；询问所有保健品和草药；已服用者查肝肾功能并停用可疑药物。',
  },
]

/**
 * 多病共存患者的开方前红线。
 * 重点不是“多开一种药”，而是先做疾病组合、器官功能和监测计划的综合评估。
 */
export const comorbidityRules: ComorbidityMedicationRule[] = [
  {
    id: 'htn-dm-licorice',
    title: '高血压 + 糖尿病 × 含甘草制剂',
    comorbidities: ['高血压', '糖尿病'],
    medicationExamples: ['复方甘草片', '含甘草的止咳/化痰中成药', '成分未标明的自购复方'],
    risk: '甘草酸相关的水钠潴留可升高血压、引起低钾；血糖控制可能波动，合并肾病时风险叠加。',
    assessment: [
      '逐项核对复方中成药、止咳药和自购药品是否含甘草',
      '评估血压、血糖近期控制、肾功能和有无水肿',
      '避免长期自行服用；需要时由医生/药师选择替代方案',
    ],
    monitoring: ['血压', '血钾、肾功能', '血糖/HbA1c', '体重和下肢水肿'],
  },
  {
    id: 'hypertension-ephedra',
    title: '高血压 / 冠心病 × 含麻黄制剂',
    comorbidities: ['高血压', '冠心病', '心律失常'],
    medicationExamples: ['含麻黄/伪麻黄碱的复方感冒药', '苏黄止咳胶囊', '部分宣肺平喘中成药'],
    risk: '拟交感成分可能升压、加快心率、诱发心绞痛或心律失常，与其他拟交感药合用风险叠加。',
    assessment: [
      '问血压/心率控制、胸痛和心悸史',
      '核对复方感冒药、止咳药和减肥产品中的麻黄/伪麻黄碱',
      '控制不佳或近期心绞痛时换用不含麻黄方案',
    ],
    monitoring: ['血压', '心率/心律', '胸痛、心悸症状', '必要时心电图'],
  },
  {
    id: 'ckd-nsaid',
    title: '慢性肾病 / 糖尿病肾病 × NSAIDs',
    comorbidities: ['慢性肾病', '糖尿病', '心衰'],
    medicationExamples: ['布洛芬', '双氯芬酸等 NSAIDs', '成分不明的止痛/偏方'],
    risk: '肾血流下降可诱发急性肾损伤、高钾和水肿；与 ACEI/ARB、利尿剂合用风险更高。',
    assessment: [
      '核对 eGFR、尿白蛋白、血钾和容量状态',
      '问脱水、感染、腹泻和近期造影史',
      '能不用则不用；必须用时选择最低风险方案并安排复诊',
    ],
    monitoring: ['血肌酐/eGFR', '血钾', '血压、体重和尿量', '消化道出血风险'],
  },
  {
    id: 'heart-failure-fluid',
    title: '心衰 / 高血压 × 水钠潴留药物',
    comorbidities: ['心衰', '高血压'],
    medicationExamples: ['NSAIDs', '含甘草制剂', '噻唑烷二酮类', '含钠量高的中成药/补液'],
    risk: '水钠潴留可导致体重快速增加、水肿和心衰失代偿。',
    assessment: [
      '问体重变化、气短、端坐呼吸和下肢水肿',
      '核对所有可能引起水肿的药物和含钠制剂',
      '心衰不稳定时先处理容量负荷，不自行加药',
    ],
    monitoring: ['每日体重', '血压、心率', '气短/水肿', '肾功能和电解质'],
  },
  {
    id: 'anticoagulant-bleeding-herbs',
    title: '抗凝 / 抗血小板 × 活血化瘀中药',
    comorbidities: ['房颤/抗凝', '冠心病/抗血小板', '既往消化道出血'],
    medicationExamples: ['复方丹参滴丸', '血府逐瘀方', '三七/银杏制剂'],
    risk: '叠加抗凝作用可增加消化道、颅内和其他部位出血风险。',
    assessment: [
      '核对华法林、利伐沙班、阿司匹林、氯吡格雷等全部抗栓药',
      '问瘀斑、黑便、血尿、牙龈出血和近期手术/跌倒',
      '不要自行叠加活血化瘀中成药；必须联用时请药师/专科评估',
    ],
    monitoring: ['INR（华法林）', '血常规/血红蛋白', '大便颜色、尿色和皮肤瘀斑', '肾功能（部分抗凝药）'],
  },
  {
    id: 'bph-anticholinergic-ephedra',
    title: '前列腺增生 × 麻黄 / 抗胆碱成分',
    comorbidities: ['前列腺增生', '高血压', '青光眼'],
    medicationExamples: ['含麻黄/伪麻黄碱的复方感冒药', '含抗胆碱成分的复方制剂', '部分止咳/止泻药'],
    risk: '可能加重排尿困难、尿潴留，麻黄还可能升压；青光眼患者抗胆碱成分可诱发急性发作。',
    assessment: [
      '问排尿困难、夜尿、尿潴留史和青光眼病史',
      '核对复方感冒药、止咳药和抗胆碱药',
      '高风险患者选择替代方案，必要时泌尿科/眼科评估',
    ],
    monitoring: ['排尿情况/残余尿（按需）', '血压', '眼压/眼部症状（青光眼患者）', '尿路感染风险'],
  },
]
