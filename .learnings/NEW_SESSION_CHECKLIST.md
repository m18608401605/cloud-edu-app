# 新 Session 启动检查清单
## 2026-03-15 创建

---

## ✅ 必读文件（按顺序）

1. **`.learnings/CURRENT_TASK.md`** ⭐ 最重要
   - 当前任务状态
   - 下一步行动
   - 必读文件列表

2. **`memory/2026-03-15.md`**
   - 今日完整工作日志
   - Quiz 验证结果
   - Ch.7 初步研读记录

3. **`.learnings/ch7-study-notes-brief.md`**
   - Ch.7 Learning Objectives
   - Examples 位置
   - 初步发现

4. **`.learnings/textbook-study-plan.md`**
   - 方式 C 流程
   - 章节优先级

---

## 📚 教材资源

### 教材 PDF 位置
```
/Users/a1/.openclaw/media/inbound/Business_Finance---4362ffe8-42a0-453c-9e3a-52d4df08359c.pdf
```

### 章节页码（已确认）
- **Ch.7 Portfolio Theory**: 第 200-230 页
- Ch.10 Cost of Capital: 待确认
- Ch.5 Practical Investment Appraisal: 待确认

### 提取命令
```bash
# 提取 Ch.7
pdftotext -f 200 -l 230 "/Users/a1/.openclaw/media/inbound/Business_Finance---4362ffe8-42a0-453c-9e3a-52d4df08359c.pdf" -

# 查找 Examples
pdftotext -f 200 -l 230 "..." - | grep -A 5 "Example"
```

---

## 🔗 在线题库链接

### Pearson 配套网站（无需登录）
```
https://media.pearsoncmg.com/intl/wps-wraps/ema_uk_he_mclaney_busfin_11/cw/content/studentresources.php
```

### MCQ 题库入口
```
https://media.pearsoncmg.com/intl/wps-wraps/ema_uk_he_mclaney_busfin_11/cw/content/multiple-choice-questions.php
```

---

## 📁 课件仓库

### Git 仓库位置
```
/tmp/cloud-edu-app
```

### 如果不存在，重新 clone
```bash
git clone git@github.com:m18608401605/cloud-edu-app.git /tmp/cloud-edu-app
```

### 课件文件位置
```
/tmp/cloud-edu-app/courses/business_finance/Week{1-10}_*.html
```

---

## 🎯 当前任务优先级

### 优先级 1：教材研读（核心）
- Ch.7 Portfolio Theory（进行中，已扫描）
- Ch.10 Cost of Capital
- Ch.5 Practical Investment Appraisal

### 优先级 2：添加标签
- Week 1: `Pearson Ch.1 MCQ` + `Pearson Ch.2 MCQ`
- Week 3: `Pearson Ch.5 MCQ`
- Week 9: `Based on McLaney Ch.12 & Pearson MCQ`

---

## ⚠️ 重要提醒

1. **Session 启动第一件事：读 CURRENT_TASK.md**
2. **做决策后立即更新 CURRENT_TASK.md**
3. **完成阶段立即更新进度**
4. **不要依赖"记忆"，一切写入文件**

---

*检查清单创建 - 2026-03-15 16:00*
