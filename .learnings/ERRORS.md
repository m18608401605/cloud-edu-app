# ERRORS.md - 错误案例库

> 记录所有遇到的具体错误，避免重复犯错

---

## 🐛 HTML 结构错误

### 错误 1: 重复嵌套的 section-label
**日期：** 2026-03-18  
**文件：** Week3_Lecture_Kiro.html  
**问题：**
```html
<!-- 错误写法 -->
<div class="section-label"><div class="section-label" id="part1">🏗️ Part 1</div>
```
**原因：** 复制粘贴时没有检查结构  
**影响：** 导致布局混乱，section-label 样式失效  
**解决：**
```bash
sed -i 's|<div class="section-label"><div class="section-label"|<div class="section-label"|g' Week3_Lecture_Kiro.html
```
**预防：** 每次编辑后运行检查命令：
```bash
grep -n '<div class="section-label"><div class="section-label"' *.html
```

---

### 错误 2: 底部导航缺少包裹标签
**日期：** 2026-03-18  
**文件：** Week3_Lecture_Kiro.html  
**问题：**
```html
<!-- 错误写法 -->
  </div>
    <a href="#" class="btn btn-outline">← Previous</a>
    <span>Page 1 of 3</span>
    <a href="..." class="btn btn-primary">Next →</a>
  </div>
</div>
</div>
<!-- 10 个多余的 </div> -->
```
**原因：** 缺少 `<div class="bottom-nav">` 开始标签，且有多余的闭合标签  
**影响：** 底部导航无法正确对齐  
**解决：**
```html
<!-- 正确写法 -->
  </div>

  <div class="bottom-nav">
    <a href="#" class="btn btn-outline">← Previous</a>
    <span>Page 1 of 3</span>
    <a href="..." class="btn btn-primary">Next →</a>
  </div>

</main>
</body>
</html>
```
**预防：** 使用 HTML 验证工具检查标签匹配

---

## 🎨 CSS 样式错误

### 错误 3: 背景色不统一
**日期：** 2026-03-18  
**文件：** Week3_Lecture_Kiro.html  
**问题：**
```css
/* 错误写法 */
body{background:#fff}  /* 白色背景 */
main{background:#fff}  /* 白色背景 */
```
**原因：** 没有使用统一的背景色变量  
**影响：** 页面看起来像"卡片块"，不是"流畅阅读"  
**解决：**
```css
/* 正确写法 */
body{background:var(--bg)}  /* 浅灰色背景 #f5f7fa */
main{background:transparent}  /* 透明背景 */
```
**预防：** 使用统一的 CSS 模板

---

### 错误 4: 卡片边框分隔
**日期：** 2026-03-18  
**文件：** Week3_Lecture_Kiro.html  
**问题：**
```css
/* 错误写法 */
.card{border-bottom:1px solid var(--border)}
```
**原因：** 每个卡片都有底部边框，造成分隔感  
**影响：** 内容不流畅，看起来像独立的卡片块  
**解决：**
```css
/* 正确写法 */
.card{border-bottom:none}
```
**预防：** 使用统一的 CSS 模板

---

## 📝 内容质量错误

### 错误 5: 题目来源缺失
**日期：** [待记录]  
**文件：** [待记录]  
**问题：**
```html
<!-- 错误写法 -->
<div class="question-card">
  <div class="q-num">Question 1 / 10</div>
  <!-- 缺少 q-source 标签 -->
  <div class="q-text">The net present value of a project represents:</div>
  ...
</div>
```
**原因：** 制作时忘记添加 `q-source` 标签  
**影响：** 无法追溯题目来源，质量无法保证  
**解决：**
```html
<!-- 正确写法 -->
<div class="question-card">
  <div class="q-num">Question 1 / 10</div>
  <div class="q-source">Pearson Ch.4 MCQ</div>
  <div class="q-text">The net present value of a project represents:</div>
  ...
</div>
```
**预防：** 在质量检查清单中强制检查

---

### 错误 6: 答案未验证
**日期：** [待记录]  
**文件：** [待记录]  
**问题：** 计算题答案错误  
**原因：** 没有手算验证，直接使用教材答案  
**影响：** 学生学到错误的答案  
**解决：** 用计算器或 Python 独立验证每个数字  
**预防：** 在质量检查清单中强制检查

---

## 🔧 技术操作错误

### 错误 7: Git 提交信息不规范
**日期：** [待记录]  
**问题：**
```bash
# 错误写法
git commit -m "fix"
git commit -m "update"
```
**原因：** 提交信息不清晰  
**影响：** 无法追溯修改历史  
**解决：**
```bash
# 正确写法
git commit -m "fix: Remove duplicate nested section-label divs in Week 3 Lecture"
git commit -m "style: Convert Week 3 Lecture to fluid reading layout"
```
**预防：** 使用规范的提交信息格式

---

## 📊 工作流程错误

### 错误 8: 跳过研读教材
**日期：** [待记录]  
**问题：** 内容不准确，遗漏重要知识点  
**原因：** 只看标题和摘要，没有仔细阅读  
**影响：** 课件质量低，学生学不到核心知识  
**解决：** 强制执行 Step 1：研读与分析  
**预防：** 在工作日志中记录研读记录

---

### 错误 9: 格式不统一
**日期：** [待记录]  
**问题：** Week 1-10 的格式不一致  
**原因：** 没有统一的模板  
**影响：** 用户体验不一致  
**解决：** 建立统一的模板文件  
**预防：** 制作新 Week 时，复制已有的 Week 作为模板

---

## 🎯 持续更新

每次遇到新的错误，立即记录到这个文件：
1. 错误编号（递增）
2. 日期
3. 文件
4. 问题描述（代码示例）
5. 原因分析
6. 影响评估
7. 解决方案（代码示例）
8. 预防措施

---

*错误案例库 v1.0 - 2026-03-18 创建*
*持续更新中...*

---

### 错误 10: 重复的 Pitfall 表格和 Answer Templates
**日期：** 2026-03-18  
**文件：** Week3_Lecture_Kiro.html  
**问题：**
- 文件中有两个完全相同的 Pitfall 表格
- 文件中有两个完全相同的 Answer Templates
- 文件中有两个 bottom-nav
- section-label 的 id 重复（part1, part2 被重复使用）
- 总共有 251 行重复内容

**原因：** 多次编辑时内容叠加，没有删除旧版本  
**影响：** 
- 页面排版混乱
- 导航链接跳转错误
- 文件体积增大（949 行 → 706 行）

**解决：**
1. 删除重复的 Pitfall 表格和 Answer Templates
2. 修复 section-label 的 id：
   - `id="part1"` → `id="answer-templates"`（第二个）
   - `id="part2"` → `id="concept-map"`（第二个）
3. 更新导航链接指向正确的 id
4. 删除多余的 bottom-nav

**预防：**
- 编辑前先检查文件结构：`grep -n "section-label.*id=" file.html`
- 避免复制粘贴大段内容，容易造成重复
- 使用版本控制，定期 commit，方便回滚

---

---

### 错误 #11: Week 5&6 导航 CSS 缺失
**日期：** 2026-03-18  
**文件：** Week5_Lecture_Kiro.html, Week6_Lecture_Kiro.html  
**问题：** 缺少 `.toc-sidebar` 和 `.mobile-toc` 的 CSS，导致左侧导航不固定

**解决方案：** 添加完整的导航 CSS：
```css
.toc-sidebar{position:fixed;left:20px;top:120px;...}
.mobile-toc{display:none;position:sticky;top:60px;...}
```

---

### 错误 #12: 导航内容不完整
**日期：** 2026-03-18  
**文件：** Week4_Lecture_Kiro.html, Week5_Lecture_Kiro.html  
**问题：** 导航只有 4-7 项，缺少详细层级（子标题 1.1, 1.2）

**解决方案：** 添加详细层级结构：
```html
<a href="#part1">📊 Part 1: Expected Return</a>
<a href="#part1" style="padding-left:1.5rem;font-size:.8rem">1.1 Expected Return</a>
```

---

### 错误 #13: SVG 图示无法翻译
**日期：** 2026-03-18  
**文件：** Week4_Lecture_Kiro.html  
**问题：** SVG 图片中的文字无法被浏览器翻译

**解决方案：** 在 h2 标题中添加中英文双语：
```html
<h2>🗺️ Ch.6 Risk Analysis Framework 风险分析框架</h2>
```

