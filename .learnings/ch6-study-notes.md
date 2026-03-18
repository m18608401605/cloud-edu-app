# Ch.6 Risk in Investment Appraisal - 研读笔记

**研读时间：** 2026-03-16 18:30 - 2026-03-17 00:10  
**研读方式：** 方式 C（混合方式）- 快速检查模式  
**对应课件：** Week 4

---

## 📚 Learning Objectives

Ch.6 的学习目标包括：

1. **The importance of risk** and its formal consideration in decision-making
2. **Use of sensitivity analysis** to assess project riskiness
3. **Use of statistical probabilities** to assess risk
4. **Expected value** and its deficiencies in treating risk
5. **Systematic and specific risk**
6. **Utility theory**
7. **Risk aversion**
8. **Evidence on dealing with risk in practice**

---

## 📖 章节结构

```
6.1 Introduction
    - Risk and Uncertainty
    - The importance of taking account of risk

6.2 Sensitivity Analysis
    - Example 6.1: Greene plc Sensitivity Analysis
    - Practical use of sensitivity analysis
    - Problems of using sensitivity analysis

6.3 Use of Probabilities
    - Objective probabilities
    - Subjective probabilities
    - Example 6.2: Single Factor Probability

6.4 Expected Value
    - Example 6.3: Multiple Independent Factors
    - The portfolio effect
    - Diversification
    - Example 6.4: Diversification

6.5 Systematic and Specific Risk
    - Specific risk (can be diversified away)
    - Systematic risk (cannot be diversified away)

6.6 Utility Theory
    - Trading off preferences
    - Indifference curves
```

---

## 🔑 核心概念

### 1. Risk vs Uncertainty

**Risk（风险）**：
- 能够识别所有可能的结果
- 能够评估每个结果发生的概率
- 例如：掷骰子（6 个可能结果，每个概率 1/6）

**Uncertainty（不确定性）**：
- 无法识别所有可能的结果
- 无法评估结果发生的概率
- 大多数商业决策都具有不确定性

---

### 2. Sensitivity Analysis（敏感性分析）

**定义**：
- 一种"break-even analysis"
- 评估每个输入变量对 NPV 的影响
- 找出每个变量导致 NPV = 0 的临界值

**Example 6.1: Greene plc**

**项目数据**：
- 初始投资：£50,000
- 年销量：5,000 units
- 售价：£10/unit
- 劳动力成本：£4/unit
- 材料成本：£3/unit
- 折现率：10%
- 项目期限：5 years

**NPV 计算**：
```
Annual Cash Flow = 5,000 × (10 - 4 - 3) = £15,000
NPV = -50,000 + (15,000 × 3.791) = £6,865
```

**敏感性分析结果**：

| 变量 | 原始估计 | 零 NPV 值 | 敏感度 (%) |
|------|----------|-----------|------------|
| 初始投资 | £50,000 | £56,865 | 13.7% |
| 年销量 | 5,000 units | 4,396 units | 12.1% |
| 售价 | £10 | £9.64 | 3.6% |
| 劳动力成本 | £4 | £4.36 | 9.0% |
| 材料成本 | £3 | £3.36 | 12.0% |
| 折现率 | 10% | 15.24% | 52.4% |
| 项目期限 | 5 years | 4.26 years | 14.8% |

**关键发现**：
- **售价最敏感**（只能下降 3.6%）
- **折现率最不敏感**（可以上升 52.4%）
- 敏感性分析帮助识别关键风险因素

**优点**：
- 识别关键输入变量
- 引导管理者关注高风险因素
- 可以采取措施降低风险（如固定价格合同、期权、保险）

**缺点**：
- 每次只能改变一个变量
- 没有提供如何解释结果的规则
- 不同变量的敏感性不总是可直接比较

**实际应用**：
- **Ryanair 案例**：2015 年已锁定 90% 的航空燃油价格（到 2016 年 3 月）
- 通过固定价格合同、期权、保险等方式降低风险

---

### 3. Use of Probabilities（概率的使用）

**两种概率**：

**Objective Probabilities（客观概率）**：
- 基于可验证的历史数据
- 例如：过去 10 年中，6 年需求为 200 万，4 年需求为 300 万
- 推断：明年需求为 200 万的概率 = 0.6，300 万的概率 = 0.4

**Subjective Probabilities（主观概率）**：
- 基于专家意见
- 当历史数据不可靠或不存在时使用

**Example 6.2: Single Factor Probability**

假设只有销量不确定：
- 4,000 units (p = 0.2) → NPV = -£4,508
- 4,500 units (p = 0.5) → NPV = +£1,179
- 5,000 units (p = 0.3) → NPV = +£6,865

**结果**：
- 构建了 NPV 的概率分布
- 但仍然简化（只有一个变量不确定）

---

### 4. Expected Value（期望值）

**定义**：
- 加权平均值
- EV = Σ (Outcome × Probability)

**Example 6.3: Multiple Independent Factors**

假设销量和劳动力成本都不确定：
- 销量：4,000 (0.2), 4,500 (0.5), 5,000 (0.3)
- 劳动力成本：£3 (0.1), £4 (0.7), £5 (0.2)

**9 种可能结果**：

| 结果 | NPV (£) | 概率 |
|------|---------|------|
| C | -19,672 | 0.04 |
| F | -15,881 | 0.10 |
| I | -12,090 | 0.06 |
| B | -4,508 | 0.14 |
| E | +1,179 | 0.35 |
| H | +6,865 | 0.21 |
| A | +10,656 | 0.02 |
| D | +18,238 | 0.05 |
| G | +25,820 | 0.03 |

**Expected NPV**：
```
ENPV = Σ (NPV × p) = +£24
```

**更简单的计算方法**：
```
Expected Sales Volume = (4,000 × 0.2) + (4,500 × 0.5) + (5,000 × 0.3) = 4,550 units
Expected Labour Cost = (3 × 0.1) + (4 × 0.7) + (5 × 0.2) = £4.10
NPV = -50,000 + {4,550 × [10 - (4.1 + 3)] × 3.791} = +£22
```

**ENPV 的缺点**：

1. **信息丢失**：
   - ENPV = +£24 没有告诉我们有 4% 的概率 NPV = -£19,672
   - 也没有告诉我们最可能的结果是 E (NPV = +£1,179, p = 0.35)

2. **ENPV 可能不存在**：
   - +£24 不在 9 种可能结果中
   - 但如果项目数量很多，ENPV 会接近实际结果（大数定律）

---

### 5. Portfolio Effect & Diversification（组合效应与多元化）

**Example 6.4: Diversification**

**情景**：
- 有 £2 million 可投资
- 两个项目 A 和 B，特征相同：
  - Outcome (1): +20% (p = 0.5)
  - Outcome (2): -10% (p = 0.5)
- 项目独立（A 的结果不影响 B）

**策略 1：全部投资于 A 或 B**
- NPV = +£0.4 million (p = 0.5)
- NPV = -£0.2 million (p = 0.5)
- Expected Value = +£0.1 million

**策略 2：各投资 £1 million**

4 种可能结果：
1. A(1) + B(1): NPV = +£0.4 million (p = 0.25)
2. A(1) + B(2): NPV = +£0.1 million (p = 0.25)
3. A(2) + B(1): NPV = +£0.1 million (p = 0.25)
4. A(2) + B(2): NPV = -£0.2 million (p = 0.25)

Expected Value = +£0.1 million

**多元化的效果**：

1. **期望值不变**（仍然是 +£0.1 million）
2. **极端结果概率降低**：
   - 最好结果 (+£0.4m) 概率从 0.5 降到 0.25
   - 最差结果 (-£0.2m) 概率从 0.5 降到 0.25
3. **引入中间结果**：
   - 新增两种中等结果 (+£0.1m)，合计概率 0.5

**结论**：
- 多元化降低了极端结果的可能性
- 大多数投资者愿意接受这种权衡（降低高收益概率以换取降低低收益概率）

---

### 6. Systematic Risk vs Specific Risk

**Specific Risk（特定风险）**：
- 与特定项目相关的风险
- **可以通过多元化消除**
- 例如：
  - 灯泡制造：竞争对手发现新技术
  - 巧克力制造：可可豆全球短缺
  - 这两个风险是独立的

**Systematic Risk（系统性风险）**：
- 影响所有项目的共同因素
- **无法通过多元化消除**
- 例如：
  - 经济整体需求水平
  - 利率
  - 通货膨胀率
  - 劳动力成本
- 这些因素会同时影响灯泡和巧克力制造

**多元化的局限**：
- 跨行业多元化可以消除特定风险
- 但可能导致进入缺乏专业知识的领域

---

### 7. Utility Theory（效用理论）

**定义**：
- 效用（Utility）= 个人从某种因素中获得的满意度水平
- 例如：度假、饮用水、鱼子酱、财富

**无差异曲线（Indifference Curves）**：
- 表示不同组合下相同的效用水平
- 例如：度假天数 vs 保留的金钱

**Example（Figure 6.2）**：
- 横轴：保留的金钱
- 纵轴：度假天数
- 曲线 UU 上的所有点代表相同的满意度
- 曲线特征：
  - 底部右侧：愿意花很多钱换取短期度假（曲线接近水平）
  - 顶部左侧：不愿意再花钱换取更多度假天数（曲线接近垂直）

**关键点**：
- 每个人的效用曲线不同（反映个人偏好）
- 效用理论帮助理解风险厌恶行为

---

## 📊 与 Week 4 课件对照

### ✅ 课件已覆盖的内容
- Sensitivity Analysis 概念和计算
- Probabilities 的使用
- Expected Value 计算
- Systematic vs Specific Risk
- Diversification 的效果

### ⚠️ 课件可能缺失的内容

1. **Pitfall 汇总表**（对标 Week 3 标准）
   - 敏感性分析的常见错误
   - 概率计算的陷阱
   - Expected Value 的误用
   - 多元化的误解

2. **Real-World Examples**
   - Ryanair 燃油对冲案例
   - 其他公司的风险管理实践

3. **Utility Theory 的费曼类比**
   - 可以用"自助餐选择"或"手机套餐选择"类比

---

## 🎯 核心公式

### Sensitivity Analysis
```
Break-even Value = Value that makes NPV = 0
Sensitivity % = (Break-even Value - Original Estimate) / Original Estimate × 100%
```

### Expected Value
```
EV = Σ (Outcome × Probability)
```

### Joint Probability (Independent Events)
```
P(A and B) = P(A) × P(B)
```

---

## 💡 关键洞察

1. **风险管理的层次**：
   - Level 1: Sensitivity Analysis（识别关键变量）
   - Level 2: Probability Analysis（量化不确定性）
   - Level 3: Expected Value（决策标准）
   - Level 4: Portfolio Diversification（降低风险）

2. **多元化的本质**：
   - 不改变期望收益
   - 降低极端结果的概率
   - 引入更多中等结果

3. **风险的两面性**：
   - Specific Risk：可控（通过多元化）
   - Systematic Risk：不可控（需要其他方法）

4. **实践中的风险管理**：
   - 固定价格合同
   - 期权（Options）
   - 保险
   - 市场研究

---

## 📝 研读总结

Ch.6 系统地介绍了投资决策中的风险分析方法，从最简单的敏感性分析，到概率分析，再到期望值和多元化，形成了一个完整的风险管理框架。

**核心要点**：
1. 风险必须被正式考虑，不能作为事后补充
2. 敏感性分析帮助识别关键风险因素
3. 概率分析提供更全面的风险图景
4. 期望值是决策标准，但需要配合分散度指标
5. 多元化可以消除特定风险，但无法消除系统性风险
6. 效用理论解释了个人的风险偏好差异

**与 CAPM 的联系**：
- Ch.6 的 Systematic/Specific Risk 概念是 Ch.7 CAPM 的基础
- 只有 Systematic Risk 需要风险溢价（Risk Premium）
- Specific Risk 可以通过多元化消除，因此不需要补偿

---

**研读完成时间：** 2026-03-17 00:10  
**下一步：** 继续 Ch.8 Sources of Long-Term Finance 研读
