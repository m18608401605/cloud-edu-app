# Ch.10 Cost of Capital - 深度研读笔记
## 2026-03-16 11:25

---

## 📚 Learning Objectives（5个）

1. **Estimating the cost of individual sources of capital**
2. **The difficulties of estimating the cost of equity finance**
3. **Target gearing ratios**
4. **WACC and its practical relevance as a discount rate**
5. **WACC and CAPM derivation compared**

---

## 📖 Examples（4个）

### Example 10.1: Loan Notes Cost Calculation
**题目**：
- 贷款票据面值 £100，当前市价 £93
- 5 年后到期，每年支付 10% 利息
- 公司税率 20%

**公式**：
```
93 = Σ [10(1-0.20)/(1+kL)^n] + 100/(1+kL)^5
```

**答案**：约 9.9%（税后）

**关键点**：
- 利息可抵税，本金偿还不可抵税
- 使用 IRR 方法求解
- 成本不是简单的 8%，因为市价低于面值

---

### Example 10.2: Cost of Equity (Gordon Growth Model)
**题目**：
- 股价 £2.00（除息）
- 明年股息 £0.14
- 股息增长率 5%

**公式**：
```
kE = d1/pE0 + g
   = 0.14/2.00 + 0.05
   = 12%
```

**关键点**：
- Gordon Growth Model 假设股息恒定增长
- 增长率 g = b × r（b=留存比例，r=再投资回报率）

---

### Example 10.3: Convertible Loan Notes
**题目**：
- 可转换债券面值 £100，市价 £140
- 年利息 £9.625
- 5 年后可转换为 50 股普通股
- 当前股价 £2.20，预期增长 5%
- 公司税率 20%

**答案**：约 5.5%

**关键点**：
- 可转换债券 = 债券 + 转换期权
- 需要预测未来股价

---

### Example 10.4: WACC Calculation
**题目**：
- 100 万股普通股，市价 £1.80/股
- £800,000 贷款票据，市价 £95/£100 面值
- 股息 £0.10，增长率 10%
- 债券利息 9.625%，3 年到期
- 公司税率 20%

**计算步骤**：
1. 权益成本：kE = 0.10/1.80 + 0.10 = 16%
2. 债务成本：kL = 9%（IRR 计算）
3. 权益价值：VE = £1.80m
4. 债务价值：VL = £0.76m
5. WACC = 16% × (1.80/2.56) + 9% × (0.76/2.56) = 14%

---

## 🔑 核心概念

### 1. Cost of Capital 基本公式
```
p0 = Σ Cn/(1 + k)^n
```
- p0 = 当前市场价格
- Cn = 未来现金流
- k = 资本成本
- n = 时间期数

### 2. Loan Notes（贷款票据）
- **利息可抵税**：有效利息 = 票面利率 × (1 - 税率)
- **本金不可抵税**：偿还时无税收优惠
- **Perpetual Loan Notes**：k = 年利息/当前市价

### 3. Preference Shares（优先股）
- 类似债券，但股息**不可抵税**
- 股息支付不是强制性的

### 4. Ordinary Shares（普通股）
- **Gordon Growth Model**：kE = d1/pE0 + g
- **困难**：难以预测未来股息和增长率
- **Retained Profit**：不是免费资金，有机会成本

### 5. Target Gearing Ratios（目标杠杆比率）
- **定义**：企业维持的债务/权益比例
- **证据**：
  - 81% 的美国企业有目标比率（Graham & Harvey, 2001）
  - 62% 的英国企业有目标比率（Tucker et al., 2010）
- **示例**：BP 目标杠杆率 10-20%（2014）

### 6. WACC（加权平均资本成本）
**公式**：
```
WACC = kE × (VE/V) + kL × (VL/V)
```
- VE = 权益市值
- VL = 债务市值
- V = VE + VL

**三个假设**：
1. 有已知的目标融资比例
2. 各要素成本不变
3. 投资项目风险与企业平均风险相似

### 7. WACC vs CAPM
- **Traditional WACC**：基于当前市价和未来现金流
- **CAPM**：基于风险溢价和 Beta
- **趋势**：大企业越来越多使用 CAPM

---

## 📊 实践应用

### WACC 使用情况
- **53%** 的英国上市公司使用 WACC（McLaney et al., 2004）
- **80%** 的公司每年或更频繁地重新评估
- 许多公司在年报中提及使用 WACC

### 目标杠杆比率的影响因素
- 利率水平
- 债务利息的税收优势
- 经营现金流的稳定性
- 行业规范

---

## ⚠️ 关键要点

1. **机会成本原则**：资本成本是放弃其他投资的机会成本
2. **市场价格优先**：使用当前市价而非账面价值
3. **税收影响**：债务利息可抵税，权益股息不可抵税
4. **风险匹配**：折现率应与项目风险相匹配
5. **动态调整**：目标杠杆比率会随时间和环境变化

---

## 📋 Summary（教材总结）

### Cost of Capital Estimations
- k = IRR，使当前市价等于未来现金流的折现值
- 使用市价因为需要机会成本
- 永续年金：k = 年付款额/当前市价

### Loan Notes
- 利息可抵税
- 可能可赎回，赎回款不可抵税

### Preference Shares
- 类似债券，但股息不可抵税
- 股息支付非强制

---

## 🔍 下一步：对照 Week 7 课件

需要检查：
1. Week 7 课件是否覆盖所有 5 个 Learning Objectives
2. 是否包含 WACC 计算示例
3. 是否解释 WACC vs CAPM
4. 是否有 Pitfall 汇总表

---

*研读笔记完成 - 2026-03-16 11:25*
*Ch.10 深度研读完成！*
