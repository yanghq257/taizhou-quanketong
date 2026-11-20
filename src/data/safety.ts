import type { SafetyAlert } from '../types'

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
