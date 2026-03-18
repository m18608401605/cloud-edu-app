# LEARNINGS.md - 慧爪的经验沉淀

> 这是我在课件制作过程中积累的所有经验教训，适用于所有课程（Business Finance, Microeconomics, 等）

---

## 🎯 核心方法论：通用课件制作框架

### 适用范围
- ✅ 所有学科课程（商科、经济学、数学、编程等）
- ✅ 不同教材格式（PDF、PPT、在线资源）
- ✅ 不同题库来源（Pearson、McGraw-Hill、自建题库）

### 核心原则
1. **内容为王**：先研读教材，再制作课件（不能凭空编造）
2. **来源可追溯**：每道题必须标注来源（教材/题库/改编）
3. **答案必验证**：计算题必须手算，MCQ 必须对照题库
4. **格式统一**：同一课程的所有 Week 保持一致风格
5. **流畅阅读**：从上往下自然流动，避免过多卡片分隔

---

## 📋 通用工作流程（5步法）

### Step 0: 输入材料收集
**必须材料：**
- 教材（PDF/PPT/在线资源）
- 考试大纲（Syllabus/Module Outline）
- 题库链接或题目文件

**如果材料不全：**
- 向用户索取，不能凭空制作
- 记录缺失材料，说明影响

### Step 1: 研读与分析
**核心动作：**
1. 仔细阅读教材章节（不能只看标题）
2. 对照考试大纲确认权重
3. 访问题库抓取题目（或从文件中提取）
4. 输出知识点清单

**输出物：**
- 知识点清单（按考试大纲优先级排序）
- 题库题目汇总（含答案和来源标注）
- 教材例题/练习题清单

### Step 2: 制作 Lecture（讲义）
**结构模板：**
```
Week X | Lecture | [课程名称]
├── Hero（标题 + 副标题）
├── Section 1-N（核心知识点）
│   ├── 📚 h2 标题（英文主标题）
│   ├── concept-box（公式和定义，英文）
│   ├── 🧠 费曼类比（中文，生活化）
│   ├── 🍎 真实案例（知名公司/历史事件）
│   └── ⚠️ Pitfall（陷阱提示）
└── 📋 Pitfall 汇总表（表格形式）
```

**内容标准：**
- h2 标题：`📚 英文主标题`（简洁专业）
- 费曼类比：每个核心概念一个，中文，生活化
- concept-box：公式和定义全英文
- 真实案例：知名公司/历史事件
- Pitfall 汇总表：至少 5 个陷阱

**语言风格：**
- 中文占比：20-30%（主要在费曼类比）
- 术语全英文：NPV, IRR, WACC, GDP, Elasticity 等
- 避免中英混杂：不要写"净现值 NPV"，直接写"NPV"

### Step 3: 制作 Quiz（测验）
**Section A: Multiple Choice（10 题）**
- 全英文（题目、选项、解析）
- 每道题有 `q-source` 标签
- 解析包含：正确答案 + 原因 + 常见陷阱
- 难度梯度：青铜（概念）→ 白银（应用）→ 黄金（陷阱）

**Section B: 计算题（2 题）**
- 全英文
- 第一题：基础计算（来自教材例题或题库）
- 第二题：综合应用（可以是改编题）
- 答案放在 `<details>` 折叠块中
- 解析包含：分步骤计算 + 陷阱提示

**题目来源标注（强制）：**
```html
<!-- Pearson 题库 -->
<div class="q-source">Pearson Ch.X MCQ</div>

<!-- 教材例题 -->
<div class="q-source">[教材名] Ch.X Example</div>

<!-- 教材课后练习 -->
<div class="q-source">[教材名] Ch.X Problem X.X</div>

<!-- 改编题目 -->
<div class="q-source">Adapted from Pearson Ch.X</div>

<!-- 自创题目（基于教材和题库） -->
<div class="q-source">Based on [教材名] Ch.X & Pearson MCQ</div>
```

**答案验证（强制）：**
- 计算题：用计算器或 Python 独立验证每个数字
- MCQ：确认答案与题库一致
- 记录验证过程（可选，但推荐）

### Step 4: 制作 Interactive（交互实验）
**结构要求：**
- 3-4 个 Lab，每个 Lab 对应一个核心概念
- 每个 Lab 包含：
  - 滑块/输入框（让学生调整参数）
  - 实时计算（显示结果变化）
  - scenario-btn（4 个预设场景按钮）
  - 洞察提示（解释结果的含义）

**设计原则：**
- 让学生"动手做"而非"被动看"
- 参数范围合理（避免极端值）
- 结果可视化（图表、颜色变化）

### Step 5: 制作 StudyGuide（导学单）
**内容要求：**
- 教授视角：这周为什么重要
- 学习策略：如何高效掌握
- 模块地图：知识点之间的关系
- 自查清单：学完后应该会什么

---

## ✅ 质量检查清单（提交前必查）

### 内容完整性
- [ ] Lecture 有费曼类比（每个核心概念）
- [ ] Lecture 有 Pitfall 汇总表（至少 5 个）
- [ ] Quiz Section A 有 10 道 MCQ（全英文 + 来源标注）
- [ ] Quiz Section B 有 2 道计算题（全英文 + 折叠答案）
- [ ] Interactive 有 scenario-btn 预设场景（每个 Lab 4 个）
- [ ] StudyGuide 完整

### 语言风格
- [ ] Title 格式：`Week X | 类型 | [课程名称]`
- [ ] h2 标题：`📚 英文主标题`
- [ ] 术语全英文
- [ ] 费曼类比中文（生活化）
- [ ] Quiz 题目全英文

### 题目质量（关键）
- [ ] 每道 MCQ 有 q-source 标签
- [ ] 答案已验证（计算题必须手算）
- [ ] 解析清晰（包含陷阱提示）
- [ ] 难度梯度合理（青铜 → 白银 → 黄金）
- [ ] 来源可追溯（能在教材或题库中找到）

### 技术规范
- [ ] 所有链接正确（导航栏、底部按钮）
- [ ] scenario-btn 功能正常
- [ ] 折叠块 `<details>` 正常工作
- [ ] 响应式设计（手机端可用）
- [ ] HTML 结构清晰（无重复嵌套）

### 排版风格（流畅阅读）
- [ ] 背景色：浅灰色（#f5f7fa）
- [ ] 移除卡片边框分隔
- [ ] 内容从上往下自然流动
- [ ] 响应式导航（桌面侧边栏 + 移动端可折叠）
- [ ] 返回顶部按钮

---

## ⚠️ 经验教训：避免的错误

### 1. HTML 结构问题
**问题：** 重复嵌套的 `<div class="section-label">`
**原因：** 复制粘贴时没有检查结构
**解决：** 
- 使用 `grep -n '<div class="section-label"><div class="section-label"'` 检查
- 用 `sed` 批量修复：`sed -i 's|<div class="section-label"><div class="section-label"|<div class="section-label"|g'`
**预防：** 每次编辑后检查 HTML 结构

### 2. 底部导航对齐问题
**问题：** 底部导航缺少 `<div class="bottom-nav">` 包裹标签
**原因：** 多余的 `</div>` 闭合标签导致布局错乱
**解决：** 
- 检查 `</main>` 前的所有 `</div>` 是否匹配
- 确保 bottom-nav 有完整的包裹标签
**预防：** 使用 HTML 验证工具检查标签匹配

### 3. 排版风格不一致
**问题：** 不同 Week 的排版风格不同（有的是卡片块，有的是流畅阅读）
**原因：** 没有统一的 CSS 模板
**解决：** 
- 建立统一的 CSS 模板
- 所有 Week 使用相同的 `body{background:var(--bg)}`
- 所有 Week 使用相同的 `.card{border-bottom:none}`
**预防：** 制作新 Week 时，复制已有的 Week 作为模板

### 4. 题目来源缺失
**问题：** 题目没有标注来源，无法追溯
**原因：** 制作时忘记添加 `q-source` 标签
**解决：** 
- 每道题制作完立即添加 `q-source` 标签
- 提交前检查所有题目是否有来源标注
**预防：** 在质量检查清单中强制检查

### 5. 答案未验证
**问题：** 计算题答案错误
**原因：** 没有手算验证，直接使用教材答案
**解决：** 
- 用计算器或 Python 独立验证每个数字
- 检查单位（£, %, years）
- 检查公式是否正确
**预防：** 在质量检查清单中强制检查

### 6. 跳过研读教材
**问题：** 内容不准确，遗漏重要知识点
**原因：** 只看标题和摘要，没有仔细阅读
**解决：** 
- 强制执行 Step 1：研读与分析
- 记录研读过程（哪些章节、哪些重点）
**预防：** 在工作日志中记录研读记录

### 7. 格式不统一
**问题：** Week 1-10 的格式不一致
**原因：** 没有统一的模板
**解决：** 
- 建立统一的模板文件
- 所有 Week 使用相同的 Title 格式
- 所有 Week 使用相同的 h2 标题格式
**预防：** 制作新 Week 时，复制已有的 Week 作为模板

---

## 🔧 技术工具与技巧

### HTML 结构检查
```bash
# 检查重复嵌套
grep -n '<div class="section-label"><div class="section-label"' file.html

# 批量修复重复嵌套
sed -i 's|<div class="section-label"><div class="section-label"|<div class="section-label"|g' file.html

# 检查标签匹配
# 使用 HTML 验证工具或浏览器开发者工具
```

### CSS 流畅排版模板
```css
/* 核心样式 */
body{background:var(--bg);line-height:1.8}
main{background:transparent}
.card{border-bottom:none;margin-bottom:2rem}
.section-label{color:var(--muted);margin:2.5rem 0 1.2rem}

/* 元素间距 */
.concept-box, .case, .pitfall, .formula-box, .grid2, table.data{margin:1.5rem 0}

/* 背景色 */
.pill{background:var(--card)}
table.data{background:var(--card)}
```

### Git 提交规范
```bash
# 修复 bug
git commit -m "fix: [描述问题]"

# 新增功能
git commit -m "feat: [描述功能]"

# 样式调整
git commit -m "style: [描述调整]"

# 重构代码
git commit -m "refactor: [描述重构]"
```

---

## 📊 工作记录模板

### 每日工作日志（memory/YYYY-MM-DD.md）
```markdown
# YYYY-MM-DD 慧爪工作日志

## 完成课件
- Week X [课程名称] 四合一课件
- 验证了 X 道 MCQ 题目
- 设计了 X 个交互实验

## 题目来源追溯
- X 道来自 [题库名] Ch.X
- X 道改编自教材例题
- 所有答案已手算验证

## 用户反馈
- [正面反馈]
- [问题反馈]

## 质量问题
- [发现的问题]

## 需要改进
- [改进方向]
```

### 当前任务记录（.learnings/CURRENT_TASK.md）
```markdown
# 当前任务
**任务ID**: TASK-[日期]-[序号]
**接收时间**: YYYY-MM-DD HH:MM
**调用者**: [统爪/用户]
**状态**: 🟡 进行中

## 任务内容
[具体任务]

## 执行计划
- [ ] 步骤1
- [ ] 步骤2

## 当前进度
正在执行...

## 下一步行动
[明确说明]
```

---

## 🎯 跨课程适配指南

### 不同课程的差异点

**商科课程（Business Finance, Accounting）：**
- 重点：公式、计算、案例分析
- 费曼类比：商业场景、投资决策
- 真实案例：知名公司（Apple, Buffett, Tesla）

**经济学课程（Microeconomics, Macroeconomics）：**
- 重点：图表、模型、政策分析
- 费曼类比：市场行为、政府政策
- 真实案例：历史事件、经济危机

**数学课程（Calculus, Statistics）：**
- 重点：定理、证明、计算
- 费曼类比：几何直觉、生活场景
- 真实案例：科学应用、工程问题

**编程课程（Python, JavaScript）：**
- 重点：语法、算法、项目实践
- 费曼类比：生活流程、游戏规则
- 真实案例：开源项目、知名应用

### 通用适配原则
1. **保持核心结构**：Hero + Section 1-N + Pitfall 汇总表
2. **调整内容重点**：根据学科特点调整费曼类比和真实案例
3. **保持语言风格**：中文占比 20-30%，术语全英文
4. **保持质量标准**：题目来源可追溯，答案必验证

---

## 🚀 持续改进机制

### 每次制作课件后
1. 记录到 `memory/YYYY-MM-DD.md`
2. 更新 `.learnings/LEARNINGS.md`（如果有新的经验教训）
3. 更新 `AGENTS.md`（如果有流程优化）

### 每周复盘
1. 回顾本周制作的所有课件
2. 识别共性问题
3. 更新质量检查清单
4. 优化工作流程

### 每月总结
1. 统计课件制作数量和质量
2. 分析用户反馈
3. 提炼最佳实践
4. 更新方法论文档

---

*经验沉淀文档 v1.0 - 2026-03-18 创建*
*适用于所有课程的通用课件制作方法论*
