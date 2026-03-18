# Chapter 4 研读笔记
## Investment Appraisal Methods

**研读时间：** 2026-03-15 11:52-12:05  
**状态：** ✅ 核心内容已提取  

---

## Learning Objectives

1. ✅ Investment decision 的重要性
2. ✅ NPV 概念的推导
3. ✅ NPV 的含义
4. ⏳ 其他评估方法（IRR, Payback, ARR）
5. ⏳ 实践中的应用研究

---

## 核心概念

### 1. Time Value of Money
**核心原理：** £1 today ≠ £1 tomorrow

**三个原因：**
1. **Interest forgone** - 机会成本
2. **Inflation** - 购买力下降
3. **Risk** - 未来不确定性

### 2. Net Present Value (NPV)

**定义：** 将未来现金流折现到现在的价值，减去初始投资

**公式（1 年）：**
```
NPV = C0 + C1/(1+r)
```
- C0 = 初始现金流（通常为负）
- C1 = 1 年后现金流
- r = 利率/折现率

**公式（多年）：**
```
NPV = C0 + C1/(1+r) + C2/(1+r)² + ... + Cn/(1+r)ⁿ
```

**决策规则：**
- NPV > 0 → Accept（增加股东财富）
- NPV < 0 → Reject（减少股东财富）
- 多个项目：选择 NPV 最大的

### 3. Present Value (PV)

**公式：**
```
PV = Future Value / (1 + r)ⁿ
```

**Discount Factor：**
```
DF = 1 / (1 + r)ⁿ
```

### 4. Annuity（年金）

**定义：** 每年相同的现金流

**Annuity Factor 公式：**
```
AF = [1 - 1/(1+r)ⁿ] / r
```

**NPV 计算（年金）：**
```
NPV = C0 + (Annual Cash Flow × Annuity Factor)
```

---

## Example 汇总

### Example 4.1: Seagull plc - 机器选择
**问题：** 两台机器（Zenith vs Super），选哪个？
- Zenith: 成本 £20,000，5 年节省 £4k, £6k, £6k, £7k, £6k
- Super: 成本 £25,000，5 年节省 £8k, £6k, £5k, £6k, £8k
- 折现率：12%

**答案：**
- Zenith NPV = £479（正值，接受）
- Super NPV = -£1,163（负值，拒绝）
- **结论：** 买 Zenith

**关键点：** 
- 不能简单相加现金流（£29k vs £20k）
- 必须考虑时间价值
- 折现后 Zenith 只增加 £479 价值

### Example 4.2: 年金计算
**问题：** 初始投资 £35,000，5 年每年收入 £10,000，折现率 10%

**答案：**
- 使用 Annuity Factor = 3.791
- NPV = -£35,000 + (£10,000 × 3.791) = £2,910
- **结论：** 接受（NPV > 0）

---

## 关键术语

- **Discounting** - 折现（将未来价值转换为现在价值）
- **Discount Rate** - 折现率（通常等于资本成本）
- **Discount Factor** - 折现因子
- **Annuity** - 年金（每期相同的现金流）
- **Annuity Factor** - 年金因子
- **Cost of Capital** - 资本成本

---

## 待补充内容

### 其他评估方法（需要继续研读）
1. **IRR (Internal Rate of Return)** - 内部收益率
2. **Payback Period** - 回收期
3. **ARR (Accounting Rate of Return)** - 会计收益率

### Problems（课后习题）
- 需要提取章末习题列表
- 用于 Quiz 题目来源验证

---

## 对照 Week 2 课件（待完成）

**需要检查：**
- [ ] Week 2 Lecture 是否覆盖所有核心概念
- [ ] 费曼类比是否准确
- [ ] Pitfall 是否完整
- [ ] Interactive 场景是否合理

---

## 发现的问题

（研读过程中发现的课件问题，待补充）

---

*下一步：验证 Week 2 Quiz 题目来源*
