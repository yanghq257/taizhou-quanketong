# 台州全科通

面向台州市中医院新入职全科医生的**首诊学习与决策辅助 PWA**。核心顺序是：

> 先排雷，再辨病；先危险分层，再谈概率。

所有内容为**教学演示示例**，不替代医院制度、临床指南、上级医师判断或药师审核。应用不接入真实后端，不保存患者信息。

---

## 1. 技术架构

| 层 | 选型 | 说明 |
|---|---|---|
| UI | React 19 + TypeScript | 组件化、类型约束；移动端优先 |
| 构建 | Vite 8 | 快速开发与静态打包 |
| 样式 | Tailwind CSS 3.4 | 自定义玉青/纯白色板，无额外 UI 框架 |
| 路由 | react-router-dom 7 + `HashRouter` | 静态托管和离线导航无需服务端 rewrite |
| 数据 | 本地 TypeScript 模块 | 类型安全，无后端/外部 API；保留接口替换能力 |
| 图标 | lucide-react | 按需引入 |
| PWA | manifest + 自建 Service Worker | 可安装、离线可查；无额外 PWA 插件 |
| 本机状态 | localStorage | 仅保存科室、急救电话、大字偏好、清单勾选 |

**设计原则**

1. **红旗优先**：鉴别诊断固定分为 🚨 绝对红旗 / ⚠️ 常见 / 🟢 罕见三层，红旗层不被“概率”淹没。
2. **双轨问诊**：西医 OPQRST 与中医十问并列，但先完成危险分层。
3. **不给剂量**：药品规格均标注“示例”，不提供处方剂量与疗程。
4. **不伪造院内数据**：急救电话为空占位，由使用者在设置中填写；排序明确标注为学习框架，不是本地流行病学概率。
5. **数据不出本机**：无登录、无接口请求、无患者数据存储。

---

## 2. 目录结构

```text
中医全科/
├─ index.html                     # PWA 元信息、manifest / 图标引用
├─ package.json
├─ vite.config.ts                 # base: './'，HashRouter 静态部署
├─ tailwind.config.js             # 玉青、朱砂、砂纸色板
├─ tsconfig.json
├─ public/
│  ├─ manifest.webmanifest        # PWA 安装信息、快捷方式
│  ├─ sw.js                       # 离线缓存与导航回退
│  └─ icons/                      # SVG favicon + 192/512/maskable/Apple 图标
├─ scripts/
│  └─ generate_icons.py           # 用 Pillow 重新生成 PNG 图标
├─ .github/workflows/
│  ├─ pages.yml                   # 构建并发布 GitHub Pages
│  └─ android-apk.yml             # 构建 APK 并上传 GitHub Releases
├─ android_app/                   # 本地 WebView 安卓壳（不依赖网络）
│  └─ app/src/main/               # AndroidManifest、MainActivity、图标
└─ src/
   ├─ main.tsx                    # React 入口、HashRouter、生产环境 SW 注册
   ├─ App.tsx                     # 路由表
   ├─ types/index.ts              # 全部医学数据结构
   ├─ components/
   │  ├─ AppShell.tsx             # 顶栏、在线状态、红旗入口、底部导航
   │  ├─ BottomNav.tsx            # 查症状 / 问诊单 / 配药房 / 话术库 / 设置
   │  ├─ EmergencySheet.tsx       # 全局红旗急症速查与院内电话
   │  └─ symptom/                 # 鉴别、双轨问诊、检查/用药、沟通四个面板
   ├─ data/
   │  ├─ symptoms/                # 7 个症状入口的完整 Mock 数据
   │  ├─ medications.ts           # 16 条中西药示例条目
   │  ├─ formulas.ts              # 17 个经典方（无剂量）
   │  ├─ safety.ts                # 8 条相互作用/联用红灯
   │  ├─ scripts.ts               # 11 条医患沟通模板
   │  ├─ checklist.ts             # 6 组 28 项避坑清单
   │  └─ tcm.ts                   # 中医十问通用问诊项
   ├─ hooks/
   │  ├─ useHospitalSettings.ts   # 科室/急救电话/大字偏好 + 清理键名
   │  ├─ useLocalStorageState.ts  # 通用本机持久化
   │  └─ useOnlineStatus.ts
   ├─ lib/utils.ts                # cn、复制、存储、百分比等
   └─ pages/
      ├─ HomePage.tsx             # 搜索 + 高频症状 + 工具入口
      ├─ SymptomDetailPage.tsx    # 四段式症状鉴别详情
      ├─ ConsultPage.tsx          # OPQRST + 中医十问问诊单
      ├─ MedicationPage.tsx       # 药品/经典方/相互作用红灯
      ├─ ScriptsPage.tsx          # 沟通话术
      ├─ ChecklistPage.tsx        # 首诊避坑清单（可持久化）
      ├─ SettingsPage.tsx         # 院内信息、字号、安装、数据
      └─ NotFoundPage.tsx
```

---

## 3. 数据结构

全部接口位于 [`src/types/index.ts`](src/types/index.ts)，主要类型：

- `Symptom`：症状入口，包含 `triage`、`differentials`、`opqrst`、`tcmFocus`、`tcmPatterns`、`exams`、`medicationIds`、`formulaIds`、`communication`。
- `Differential`：`tier`（critical/common/rare）、`likelihood`、`clues`、`redFlags`、`action`、`initialWorkup`。
- `TcmPattern`：证型、舌象、脉象、治则、基础方、注意事项。
- `Medication` / `Formula` / `SafetyAlert`：药品示例规格、方剂组成、相互作用红灯。
- `CommunicationScript`：场景、对象、参考说法、避免说法。
- `ChecklistSection` / `ChecklistItem`：红旗项、本院制度项。
- `HospitalSettings`：科室、急救电话、大字模式。

### 新增一个症状

1. 在 `src/data/symptoms/` 新建 `xxx.ts`，按 `Symptom` 类型填写。
2. 在 `src/data/symptoms/index.ts` 导入，加入 `symptoms` 与 `homeSymptomOrder`。
3. 若是全新的 `SymptomId` / `SymptomIcon`，同步更新 `src/types/index.ts` 与 `SymptomGlyph.tsx`。
4. 运行 `npm run typecheck`，确保药物/方剂 ID、数组结构、路由入口均正确。

药物、方剂、话术、清单均可独立扩充。组件不直接依赖具体数据源，后续接院内 API 时，可保持 `src/types` 不变，将 `src/data` 的同步导出替换为查询层。

---

## 4. 本地运行

**环境（本项目实测）**：Windows 11、Node.js `v24.14.0`、npm `11.9.0`。建议 Node.js ≥ 22。

```bash
cd /d D:\yhq\中医全科
npm install
npm run dev
```

打开 Vite 输出的地址，默认 <http://localhost:5173>。

### 类型检查与生产构建

```bash
npm run typecheck
npm run build
npm run preview
```

生产预览默认 <http://localhost:4173>。

> `npm run build` 会提示单个 JS 包约 560 kB（gzip 约 180 kB）。这是因为全部离线教学数据与页面一次性打包，便于断网时完整查阅，属于非阻断提示。若院内对首屏体积有更严格的要求，可再做路由分包与预缓存改造。

### 重新生成 PNG 图标（可选）

```bash
d:\min\python.exe scripts\generate_icons.py
```

需要 Pillow（本项目实测 `10.4.0`）。

---

## 5. PWA 安装与离线

- 清单文件：[`public/manifest.webmanifest`](public/manifest.webmanifest)
- Service Worker：[`public/sw.js`](public/sw.js)
- 生产构建后自动复制到 `dist/`；开发环境不注册 SW。
- 构建后需通过 **HTTPS** 或 **localhost** 打开，Service Worker 才能启用。
- 首次联网打开后，SW 会预缓存应用壳、图标，并从 `index.html` 自动发现、缓存带哈希的 JS/CSS。
- 当前是单包构建，预缓存完成后**所有前端页面均可离线打开**，未访问过的页面也无需再次联网；应用不会缓存任何外部请求或患者数据。

### 手机安装

1. **Android / 桌面 Chrome/Edge**：地址栏或菜单 → “安装应用” / “添加到主屏幕”。
2. **iPhone / iPad Safari**：分享按钮 → “添加到主屏幕”。
3. 应用内“设置 → 安装到手机桌面”也会给出对应提示；满足条件时显示安装按钮。

> 局域网 `http://192.168.x.x` 不是安全上下文，**不能直接安装 PWA**。请在手机预览 UI，正式安装时部署到院内 HTTPS 地址（Nginx/Caddy 等），或使用可信 HTTPS 隧道。

### 静态部署

将 `npm run build` 生成的 `dist/` 整体部署到静态目录即可。`manifest.webmanifest` 的 `id`、`start_url`、`scope` 均使用相对路径，已适配 GitHub Pages 项目子路径（如 `/taizhou-quanketong/`）。`base: './'` + `HashRouter` 不要求服务端配置路由回退；但 `sw.js` 与 `manifest.webmanifest` 必须位于同一部署目录下。

### GitHub Pages 与 Android APK

- 网页版工作流：[`.github/workflows/pages.yml`](.github/workflows/pages.yml)，推送到 `main` 后构建并发布 `dist/`。
- GitHub 仓库需在 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**；该设置无法由默认 `GITHUB_TOKEN` 代替仓库管理员开启。
- 若 Release 发布失败，检查 **Settings → Actions → General → Workflow permissions** 是否允许 **Read and write permissions**。
- 预期 Pages 地址：`https://yanghq257.github.io/taizhou-quanketong/`（以仓库实际名称和 Pages 设置为准）。
- Android 工作流：[`.github/workflows/android-apk.yml`](.github/workflows/android-apk.yml)，将同一份 `dist/` 打包进本地 WebView 壳，生成 **debug 签名测试 APK** 并上传到 GitHub Releases。
- Android 壳源码：[`android_app/`](android_app/)。它不依赖网络，不需要网页端 Service Worker；联网权限仅用于 WebView 基础运行与外部链接跳转。
- APK 下载页：`https://github.com/yanghq257/taizhou-quanketong/releases`

仓库创建步骤：

1. GitHub 新建 **Public** 空仓库 `taizhou-quanketong`，不要初始化 README、`.gitignore` 或 License。
2. 打开仓库 **Settings → Pages**，把 Source 设为 **GitHub Actions**。
3. 打开 **Settings → Actions → General**，确认 Workflow permissions 允许 **Read and write permissions**。
4. 首次推送 `main` 后，两个工作流分别部署网页和构建 APK；Release 标签为 `v0.1.0`。

> 仓库为公开状态，任何拿到 Pages 或 Release 链接的人都能访问内容。正式院内使用前需完成信息科审核和访问控制。

---

## 6. 上线前必须完成

本仓库是功能完整的**教学原型**，不能直接作为临床正式系统上线。至少需要：

- [ ] 医务科审核全部症状、鉴别、红旗与初始检查。
- [ ] 急诊/重症审核升级条件、绿色通道与交接流程。
- [ ] 药剂科审核所有药品、方剂、规格、相互作用与妊娠/肝肾功能边界。
- [ ] 用医院正式基药目录与处方权限替换示例规格。
- [ ] 在“设置”中填写真实院内急救电话，并在科室培训中验证。
- [ ] 中医科审核证型、舌脉描述、基础方与加减原则。
- [ ] 信息科确认 HTTPS、静态托管、版本更新、缓存策略与下线机制。
- [ ] 明确版本负责人、内容更新周期、问题反馈渠道。
- [ ] 确认不采集患者信息；若未来接入 HIS/EMR，先完成隐私、安全与合规评审。

---

## 7. 已验证项

在 Windows 11 + Edge Headless（移动端模拟）下完成：

- `npm run typecheck` 通过。
- `npm run build` 通过。
- 首页、7 个症状详情、问诊单、配药房、话术库、避坑清单、设置页均正常渲染。
- 390 px 与 320 px 宽度下无横向溢出，5 个底部导航完整可见。
- 搜索“心梗”可匹配到“胸痛”相关条目。
- 科室与急救电话保存后写入 localStorage；清单勾选刷新后保留；急救电话可传递到清单页。
- 全新浏览器配置首次联网打开后，SW 已预缓存 JS/CSS；未再次刷新直接断网重载，仍可打开首页，SW 控制正常。
- Chrome DevTools `Page.getInstallabilityErrors` 返回空数组，manifest 无解析错误。
- iOS PWA 元信息、180×180 不透底 Apple Touch Icon 与 192/512 图标均已核对；缓存版本为 `tkt-v2`，重新启用后会清理旧版 `tkt-v1` 缓存。
- 在本地模拟 `/taizhou-quanketong/` 子路径完成验证：manifest 无解析错误、无安装性错误，SW scope 正确落在子路径，缓存包含子路径首页、manifest、JS、CSS；断网刷新仍能打开首页。
- 模拟 Android 壳 User-Agent 验证：SW 不注册，设置页显示“已以独立应用模式运行”，不再显示网页安装提示。

### 已知限制

- 没有自动化单元测试；当前验证以类型检查、构建和浏览器烟雾测试为主。
- 未做真实老年人可用性测试，也未有台州本地流行病学数据验证。
- 未接后端、账号、HIS/EMR 或正式药品数据库。
- 沟通话术不包含自创方言；台州各县市口音差异大，临床使用时应按患者实际情况调整。
- Android APK 为 debug 签名测试包，只用于内部试用；正式分发需由医院信息科配置稳定签名、版本号和发布流程。
- iOS 目前通过 Safari 安装 PWA，不提供 IPA 安装包。
