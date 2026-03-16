# Ch.7 Portfolio Theory - 深度研读笔记
## 2026-03-15 16:10

---

## 📚 Learning Objectives（8个）

1. Mean/variance criterion（期望值/方差准则）
2. Effect of portfolios on risk/return（组合对风险收益的影响）
3. Efficient portfolios and frontier（有效组合与有效前沿）
4. Risk-free rate and two-fund separation（无风险利率与两基金分离）
5. CAPM（资本资产定价模型）
6. Risk/return relationship（风险收益关系）
7. Practical limitations（实际应用限制）
8. Arbitrage pricing model（套利定价模型）

---

## 📖 Examples（教材例题）

### Example 7.1: Expected Value & Variance
**题目：** 项目有3个可能的NPV：
- -£1,000 (p=0.2)
- +£1,000 (p=0.5)
- +£2,000 (p=0.3)

**求：** Expected NPV 和 Variance

**答案：**
- E(NPV) = £900
- Variance = 1,090,000 (in £²)

**公式：**
```
E(x) = Σ(pi × xi)
σ² = Σ[pi × (xi - E(x))²]
```

---

### Example 7.2: EVC Decision Rule
**题目：** 两个项目，风险厌恶投资者如何选择？
- Project A: E(NPV)=£20,000, Var=10,000
- Project B: E(NPV)=£20,000, Var=12,000

**答案：** 选择 Project A（期望值相同，方差更小）

**EVC 准则：**
- 期望值相同或更高 → 选方差更小的
- 方差相同或更小 → 选期望值更高的

---

### Example 7.3: Beta Calculation（Ace plc）
**数据：** 2007-2017年股价和市场指数

**计算步骤：**
1. 计算市场年收益率 rmt = (pmt - pmt-1) / pmt-1
2. 计算市场平均收益 Sm = Σrmt / n
3. 计算市场方差 Var(rm) = Σ(rmt - Sm)² / n
4. 计算股票年收益率 rit
5. 计算协方差 Cov(i,M) = Σ[(rit - Si)(rmt - Sm)] / n
6. 计算 Beta = Cov(i,M) / Var(rm)

**结果：** βAce = 1.56（高风险股票）

---

## 🔑 核心概念

### 1. Specific Risk vs Systematic Risk
- **Specific Risk（特定风险）**：可通过分散化消除
- **Systematic Risk（系统风险）**：无法分散化，由宏观经济因素引起
- **关键发现：** 15-20只股票的组合即可消除大部分特定风险

### 2. Portfolio Risk Formula
**两资产组合的标准差：**
```
σP = √(αA²σA² + αB²σB² + 2αAαBRσAσB)
```
其中 R = 相关系数（-1 到 +1）

**关键洞察：**
- R = +1：无风险降低效果
- R = -1：可能实现零风险组合
- R = 0：完全不相关，有一定风险降低效果

### 3. Efficient Frontier（有效前沿）
- 定义：所有无特定风险的组合构成的曲线
- 特点：给定风险下收益最高，或给定收益下风险最低
- 位置：图形左上方

### 4. Two-Fund Separation（两基金分离）
- 所有投资者都会选择：Portfolio M（市场组合）+ 无风险资产
- 风险厌恶者：部分投资M，部分借出（lending）
- 风险偏好者：借入资金（borrowing），全部投资M

### 5. CAPM Formula
```
E(ri) = rf + [E(rm) - rf] × βi
```
其中：
- E(ri) = 资产i的期望收益
- rf = 无风险利率
- E(rm) = 市场组合期望收益
- βi = Cov(i,M) / σm²

**Beta 含义：**
- β > 1：高风险（aggressive）
- β = 1：市场平均风险
- β < 1：低风险（defensive）

### 6. Security Market Line (SML)
- 横轴：Beta（系统风险）
- 纵轴：期望收益
- 所有资产应位于SML上
- 斜率 = 市场风险溢价 [E(rm) - rf]

---

## 📊 Real-World Betas（2016年英国公司）

| 公司 | Beta |
|------|------|
| Associated British Foods | 0.90 |
| British Petroleum | 1.22 |
| Kingfisher (DIY) | 0.93 |
| Rolls-Royce | 1.15 |
| Tesco | 1.16 |
| WH Smith | 0.51 |

---

## ⚠️ CAPM Assumptions（6个假设）

1. 投资者风险厌恶，最大化期望效用
2. 资本市场无单一投资者主导
3. 投资者只关心期望收益和方差
4. 存在无风险利率，可无限借贷
5. 无交易成本、税收等市场摩擦
6. 所有投资者对证券有相同预期

**现实性：**
- ✅ 假设1：基本成立
- ❌ 假设5：明显不成立
- ⚠️ 其他：部分成立

---

## 🧪 CAPM Tests（实证检验）

### 早期发现（1960s-1990s）
- 基本支持CAPM
- Beta是有效的风险度量

### Fama & French (1992, 1996)
- **发现：** Beta不能完全解释收益
- **额外因素：**
  - Size（公司规模）：小公司收益更高
  - Book-to-Market（账面市值比）：高B/M公司收益更高
- **三因子模型：**
  ```
  E(r) = rf + β(rm-rf) + s×SMB + h×HML
  ```
  - SMB = Small Minus Big（规模因子）
  - HML = High Minus Low（价值因子）

### 最新研究（2010s）
- **支持CAPM：** Hur & Kumar (2007), Levy (2009), Bruckner et al. (2012)
- **质疑CAPM：** Fernandez & Berjemo (2013)
- **Da et al. (2011)：** CAPM对实际投资项目的Beta估计是可靠的

**结论：** CAPM的实际有效性仍不确定

---

## 🎯 Practical Implications

### 对证券投资者
1. 应充分分散化（15-20只股票）
2. 根据个人风险偏好选择Beta水平
3. 使用商业Beta服务（如Digital Look）

### 对财务经理（实际投资项目）
1. 使用CAPM推导折现率
2. 使用行业平均Beta（而非单个项目Beta）
3. 折现率 = rf + β × [E(rm) - rf]

**逻辑：**
- 项目NPV = 企业价值增量
- 资本市场有效 → 正NPV项目提升股价
- CAPM提供市场定价的风险溢价

---

## 📋 Problems（课后习题）

**位置：** 第230页之后（需要继续提取）

---

## 🔍 对照 Week 5 课件检查

### Week 5 课件已覆盖
- ✅ Expected Return & Variance 公式
- ✅ Portfolio Risk 公式
- ✅ Efficient Frontier 概念
- ✅ CAPM 公式
- ✅ Beta 计算示例
- ✅ SML 图示

### Week 5 课件可能缺失
- ⚠️ **EVC Decision Rule**（Example 7.2）
- ⚠️ **Two-Fund Separation** 详细解释
- ⚠️ **Fama-French Three-Factor Model**
- ⚠️ **CAPM Assumptions** 详细列表
- ⚠️ **Real-World Betas** 表格（英国公司）
- ⚠️ **Practical Implications** 对财务经理的应用

---

## 📝 下一步

1. 提取 Ch.7 Summary（第230页附近）
2. 提取 Ch.7 Problems（课后习题）
3. 对照 Week 5 课件，确认缺失内容
4. 更新 Week 5 Lecture（补充费曼类比 + Pitfall表）

---

*研读笔记完成 - 2026-03-15 16:15*
