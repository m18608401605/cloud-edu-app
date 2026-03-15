# Week 1-10 Quiz 题目来源验证与修正计划

## 任务目标
1. 访问 Pearson 题库每个章节
2. 对照我们的 Quiz 题目
3. 验证来源准确性
4. 补充缺失的 q-source 标签
5. 更新不准确的标注

---

## 验证顺序（按优先级）

### 高优先级（缺少 q-source 标签）
- [ ] Week 1 Quiz（Ch.1 & Ch.2）
- [ ] Week 2 Quiz（Ch.4）
- [ ] Week 3 Quiz（Ch.5）
- [ ] Week 9 Quiz（Ch.12）

### 中优先级（已有标签，需验证准确性）
- [ ] Week 4 Quiz（Ch.6）
- [ ] Week 5 Quiz（Ch.7）
- [ ] Week 6 Quiz（Ch.8）
- [ ] Week 7 Quiz（Ch.10）
- [ ] Week 8 Quiz（Ch.11）
- [ ] Week 10 Quiz（Ch.9）

---

## 验证流程（每个 Week）

### Step 1: 检查三个来源

#### 1.1 Pearson 在线题库
- 访问对应章节的 MCQ 页面
- 逐题对照题目文本和选项

#### 1.2 教材例题（Examples）
- 提取教材对应章节的 Example
- 检查是否有题目来自例题改编

#### 1.3 教材课后练习（Problems）
- 提取教材章节末尾的 Problems
- 检查 Section B 计算题是否来自课后练习

### Step 2: 逐题对照
- 题目文本是否匹配
- 选项是否一致
- 答案是否正确
- 数字是否改编

### Step 3: 记录结果
- ✅ **Pearson MCQ** → 标注 `Pearson Ch.X MCQ`
- 📚 **教材例题** → 标注 `McLaney Ch.X Example X.X`
- 📝 **课后练习** → 标注 `McLaney Ch.X Problem X.X`
- 🔄 **改编题目** → 标注 `Adapted from Pearson Ch.X` 或 `Adapted from McLaney Ch.X Example X.X`
- ❌ **自创题目** → 标注 `Based on McLaney Ch.X & Lecture content`

### Step 4: 更新文件
- 补充缺失的 q-source 标签
- 修正不准确的标注
- 确保格式统一

### Step 5: 提交 commit
- 每个 Week 单独 commit
- commit message 格式：`Week X Quiz: Verify and update source citations`

---

## 预计时间
- 每个 Week 约 15-20 分钟
- 总计约 2.5-3 小时

---

*验证计划 - 2026-03-15*
