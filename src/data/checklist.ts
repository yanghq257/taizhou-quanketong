import type { ChecklistSection } from '../types'

export const checklistSections: ChecklistSection[] = [
  {
    id: 'preflight',
    title: '开诊前 60 秒',
    subtitle: '把急救路径和设备位置变成肌肉记忆',
    items: [
      {
        id: 'preflight-emergency',
        title: '确认当天院内急救电话与支援路径',
        detail: '用“设置”里填写的真实内线替换占位。明确找谁、从哪里进入抢救室、除颤仪/急救车在哪里。',
        critical: true,
        institutionSpecific: true,
      },
      {
        id: 'preflight-triage',
        title: '确认分诊升级标准与绿色通道触发方式',
        detail: '胸痛、卒中、脓毒症、过敏性休克、孕产妇急症分别走哪条通道？哪一位当班上级可先电话请示？',
        critical: true,
        institutionSpecific: true,
      },
      {
        id: 'preflight-system',
        title: '登录 HIS/EMR，确认模板、打印机和药品目录',
        detail: '首诊前测试开单、检验申请、处方打印与病历模板；确认当日基药目录和替代药，避免把时间耗在系统问题上。',
        institutionSpecific: true,
      },
    ],
  },
  {
    id: 'record',
    title: '首诊病历书写',
    subtitle: '完整、可复核、能交接；具体字段以本院模板为准',
    items: [
      {
        id: 'record-chief',
        title: '主诉 = 主要症状 + 持续时间，不写诊断',
        detail: '例：“胸痛 2 小时”“发热伴咳嗽 3 天”。避免“冠心病待查”“胃肠炎”这类未经确认的诊断性主诉。',
        institutionSpecific: true,
      },
      {
        id: 'record-history',
        title: '现病史覆盖起病、演变、伴随、诊疗、一般情况',
        detail: '记录诱因、性质、部位/放射、程度、持续时间、缓解/加重因素；发病以来饮食、睡眠、二便、体重变化；既往用药和疗效。',
      },
      {
        id: 'record-redflags',
        title: '把红旗问题写进现病史/查体，而不是只记阴性症状',
        detail: '如胸痛记录“无晕厥、无低氧、双上肢血压差异”；发热记录“SpO₂、血压、意识清楚”。写清评估依据。',
        critical: true,
      },
      {
        id: 'record-exam',
        title: '生命体征 + 针对性查体 + 必要的妇科/神经/直肠检查',
        detail: '腹痛记录腹膜刺激征与 β-hCG；眩晕记录卧立位血压与神经查体；老年患者记录跌倒风险和功能状态。',
      },
      {
        id: 'record-meds',
        title: '既往史、过敏史、全部用药史三者齐全',
        detail: '包括处方药、OTC、中成药、保健品和偏方。抗凝/抗血小板、降压药、降糖药、激素和抗生素尤其不可漏。',
        critical: true,
      },
      {
        id: 'record-plan',
        title: '诊断/鉴别诊断、处理计划、复诊与回诊红线',
        detail: '未明确诊断时写“待排”与下一步；提供具体复诊时间、检查结果领取方式和需立即急诊的症状。',
        institutionSpecific: true,
      },
    ],
  },
  {
    id: 'redflags',
    title: '门诊红旗触发',
    subtitle: '不确定就早请示，宁可多打一个电话',
    items: [
      {
        id: 'redflag-vitals',
        title: '生命体征不稳：立即停止常规问诊',
        detail: '低血压、低氧、呼吸窘迫、意识改变、抽搐、少尿、皮肤灌注差。先呼叫支援、给氧/监护，再补病史。',
        critical: true,
      },
      {
        id: 'redflag-chest',
        title: '胸痛：10 分钟内心电图，持续痛/冷汗/晕厥不等待',
        detail: '有设备立即做，无设备立即转诊；不要以“按压痛”“年轻”“像反流”为由跳过风险筛查。',
        critical: true,
      },
      {
        id: 'redflag-stroke',
        title: '突发局灶神经缺损、言语不清、面歪或共济失调',
        detail: '记录最后正常时间，立即启动卒中绿色通道；不要先开 CT 排队或让患者自行回家观察。',
        critical: true,
        institutionSpecific: true,
      },
      {
        id: 'redflag-anaphylaxis',
        title: '喉紧、喘鸣、全身荨麻疹、低血压 = 过敏反应',
        detail: '立即呼救并按院内急救流程使用肾上腺素，平卧/抬高下肢，监护气道；不要仅肌注抗组胺药后观察。',
        critical: true,
      },
      {
        id: 'redflag-pregnancy',
        title: '育龄女性腹痛/晕厥：尿/血 β-hCG 不在“可选”里',
        detail: '不能仅凭患者自述“不可能怀孕”排除异位妊娠。血流动力学不稳直接急诊/妇产科绿色通道。',
        critical: true,
      },
      {
        id: 'redflag-uncertain',
        title: '“我心里没底”：打电话给上级，不要用观察拖延',
        detail: '不确定是否符合急诊条件、患者病情与门诊能力不匹配时，先电话请示；必要时安排转诊而不是反复自行解释。',
        institutionSpecific: true,
      },
    ],
  },
  {
    id: 'prescription',
    title: '开方前核对',
    subtitle: '中西药都适用；安全优先于“按患者要求”',
    items: [
      {
        id: 'rx-allergy',
        title: '过敏史、肝肾功能、年龄、妊娠/哺乳状态',
        detail: '核对青霉素/头孢过敏、NSAID 风险、肾功能剂量、老年人跌倒/镇静风险、育龄女性妊娠可能。',
        critical: true,
      },
      {
        id: 'rx-antibiotic',
        title: '抗菌药是否有明确指征与病原/疗程计划',
        detail: '病毒性上呼吸道感染不常规使用；有指征时记录部位、严重度、培养计划和复评节点。不要以“患者要求”为唯一理由。',
        critical: true,
      },
      {
        id: 'rx-duplicate',
        title: '复方感冒药/退热药/中成药是否重复成分',
        detail: '重点核对对乙酰氨基酚、麻黄/伪麻黄碱、抗组胺药和活血化瘀成分；同类中成药不得叠加。',
        critical: true,
      },
      {
        id: 'rx-interaction',
        title: '抗凝/抗血小板、强心苷、降压药与中药相互作用',
        detail: '活血化瘀类、含麻黄类、含蟾酥类和含甘草类需特别核对；必要时请药师会诊并把监测计划写进病历。',
      },
      {
        id: 'rx-injection',
        title: '中药注射剂只在符合院内条件的区域使用',
        detail: '首诊门诊不自行开展；如确需使用，必须核对过敏史、溶媒、滴速、抢救设备与院内审批。出现反应立即停药并抢救。',
        critical: true,
        institutionSpecific: true,
      },
      {
        id: 'rx-opioid',
        title: '阿片类/第二类精神药品按本院权限开具',
        detail: '核对适应证、处方权限、实名登记和随访要求；不要为方便患者跨科/超量开具。',
        institutionSpecific: true,
      },
    ],
  },
  {
    id: 'tcm',
    title: '中医病历与辨证',
    subtitle: '证型有依据，方药有边界',
    items: [
      {
        id: 'tcm-four',
        title: '四诊合参，不只写一个“湿气重”或“体虚”',
        detail: '记录寒热、汗、饮食、二便、睡眠、情志；舌质、舌苔、脉象须具体。辨证结论附证据，未收集到的信息不要臆补。',
      },
      {
        id: 'tcm-formula',
        title: '写清基础方 + 加减 + 煎服/疗程和复诊节点',
        detail: '方名、组成、剂数、煎法/服法、注意事项和何时复诊都要可追溯；不要只写“中药调理”。',
        institutionSpecific: true,
      },
      {
        id: 'tcm-safety',
        title: '中药也有禁忌与相互作用',
        detail: '孕妇、肝肾功能不全、抗凝药、强心苷、降压药、糖尿病和儿童属于高风险组合；使用前查证并记录患者知情。',
        critical: true,
      },
      {
        id: 'tcm-emergency',
        title: '中医辨证不能延迟急救',
        detail: '胸痛、卒中、脓毒症、重度脱水等急症先走急诊路径；不得用针灸、放血、中成药“观察一下”。',
        critical: true,
      },
    ],
  },
  {
    id: 'handoff',
    title: '转诊与交接',
    subtitle: '让下一班医生在 30 秒内知道“为什么危险”',
    items: [
      {
        id: 'handoff-sbar',
        title: '用 SBAR 结构化交接',
        detail: '现状（主要症状/生命体征）、背景（病史/用药/过敏）、评估（可能的危险诊断）、建议（已联系谁、需要什么检查/床位）。',
      },
      {
        id: 'handoff-contact',
        title: '确认接收科室/医生已经知情',
        detail: '记录联系时间、接收人和建议；危重患者需有陪同转运和途中监测，不让患者独自前往。',
        institutionSpecific: true,
      },
      {
        id: 'handoff-doc',
        title: '转诊记录、回诊红线和患者/家属理解情况',
        detail: '写明转诊原因、目的地、交通方式、携带资料；让患者/家属复述回诊红线。拒绝转诊时记录风险沟通和见证人。',
        critical: true,
      },
    ],
  },
]
