# 估值体系总结

## 一、设计哲学

本体系的核心原则是：

> **估值中的主观判断，尽量全部集中在利润预测中；其余因子采用统一、客观、职责清晰的规则化设定。**

这样做的目标有三点：

1. **压缩模型自由度**，避免传统 DCF 因折现率、终值、风险溢价等多重主观参数而失控。  
2. **提高公司之间的可比性**，用统一标尺衡量不同公司。  
3. **提高可复盘性**，让估值误差主要回到利润判断本身，而不是隐藏在分母或终值假设中。  

---

## 二、估值体系的核心结构

本体系将企业价值拆分为三部分：

1. **近三年预测期**：体现对企业未来三年的主观利润判断。  
2. **过渡期**：将第三年预测增速平滑过渡到统一终局增速。  
3. **终值**：反映企业进入成熟稳态后的长期价值。  

其中，**估值基础仍然是调整后利润**，而不是直接以可分配利润作为主方程变量。  
可分配利润的作用，是用于测算当前利润兑现能力，并进一步形成整体估值折价。

---

## 三、方程组

$$
\begin{cases}
V_0
=
\displaystyle \sum_{t=1}^{3}\frac{NP_{adj,t}}{(1+R)^t}
+
\displaystyle \sum_{t=4}^{N}\frac{NP_{adj,t}}{(1+R)^t}
+
\displaystyle \frac{NP_{adj,N}(1+g_{\infty})}{(R-g_{\infty})(1+R)^N}
\\[1.2em]
R = r_f + 5.5\%
\\[0.8em]
g_{\infty}=\displaystyle \frac{m}{1+0.35m}
\\[1.0em]
DP_0 = NP_{adj,0} + DA_0 - MC_0 - \Delta WC^{norm}_0
\\[0.8em]
\theta_0 = \displaystyle \frac{DP_0}{NP_{adj,0}}
\\[1.0em]
\theta = 0.15\theta_0 + 0.85\theta_x
\\[0.8em]
V_0^* = V_0 \cdot \theta
\end{cases}
$$

### 补充说明

过渡期利润增速以第三年预测增速为起点，在过渡期内线性衰减，并于终值起点收敛至终局增速 $g_{\infty}$。

---

## 四、公式含义

### 4.1 利润基础估值

$$
V_0
=
\sum_{t=1}^{3}\frac{NP_{adj,t}}{(1+R)^t}
+
\sum_{t=4}^{N}\frac{NP_{adj,t}}{(1+R)^t}
+
\frac{NP_{adj,N}(1+g_{\infty})}{(R-g_{\infty})(1+R)^N}
$$

- 第一部分：近三年预测期的利润现值  
- 第二部分：过渡期利润现值  
- 第三部分：终值现值  

本体系中，估值主方程仍然建立在利润预测之上。

### 4.2 折现率

$$
R = r_f + 5.5\%
$$

其中：

- $r_f$：10 年期国债收益率  
- 5.5%：沪深 300 股债利差中值  

备注：当前默认取 $r_f = 1.8\%$。

含义：

- 用无风险利率反映估值底座随利率变化；
- 用固定风险补偿隔离市场情绪；
- 不再针对个股主观上调或下调折现率。  

### 4.3 终局增速

$$
g_{\infty}=\frac{m}{1+0.35m}
$$

其中：

- $m$：名义 GDP 增速  

备注：当前默认取 $m = 4.0\%$。

含义：

- 成熟企业终局增长受宏观约束；
- 企业只能分享宏观增长的一部分；
- 宏观越快增长，成熟企业并不能同比例分得全部增量。  

### 4.4 当前可分配利润

$$
DP_0 = NP_{adj,0} + DA_0 - MC_0 - \Delta WC^{norm}_0
$$

其中：

- $NP_{adj,0}$：当前调整后净利润，剔除明显一次性项目  
- $DA_0$：当前折旧摊销，属于非现金费用，加回  
- $MC_0$：当前维持性资本开支，只扣维持当前经营能力必须投入的部分  
- $\Delta WC^{norm}_0$：当前正常化营运资本新增占用，只反映常态化占用，不机械使用单年报表波动  

这一步不是估值主方程，而是用于测算当前利润兑现能力。

### 4.5 当前兑现系数

$$
\theta_0 = \frac{DP_0}{NP_{adj,0}}
$$

含义：

- $\theta_0$ 反映当前利润中有多大比例能够兑现为股东价值；
- 它由当前可分配利润与当前调整后利润之比得到；
- 该值需要结合业务分析后人工输入，不由程序自动计算。  

### 4.6 整体兑现折价

$$
\theta = 0.15\theta_0 + 0.85\theta_x
$$

其中：

- $\theta_0$：当前兑现系数  
- $\theta_x$：成熟阶段或长期阶段兑现系数  

含义：

- 前三年利润现值占比通常较低，经验上约为 15%；
- 过渡期与终值占比通常较高，经验上约为 85%；
- 因此整体估值折价，采用当前兑现系数与长期兑现系数的加权平均。  

### 4.7 股东估值

$$
V_0^* = V_0 \cdot \theta
$$

其中：

- $V_0$：基于利润路径计算得到的基础价值  
- $\theta$：整体兑现折价系数  
- $V_0^*$：折价后的股东估值  

---

## 五、体系的核心原则

### 1. 主观判断主要放在利润预测中

企业之间的差异，主要通过以下变量表达：

- 未来三年利润增速  
- 利润率变化  
- 景气和竞争格局变化  
- 高增长持续时间  

而不是通过折现率自由调整表达。

### 2. 折现率与终局增速统一规则化

- 折现率统一由无风险利率加固定风险补偿决定；
- 终局增速统一由名义 GDP 增速公式决定；
- 分母和终局不再成为随意调节估值的旋钮。  

### 3. 可分配利润不直接进入主方程，而用于测算兑现能力

账面利润并不等于真正属于股东的价值。  
因此，本体系先根据当前可分配利润测算当前兑现系数，再结合长期兑现系数，对利润基础估值进行整体折价。

### 4. 营运资本只扣常态占用，不扣阶段性波动

例如：

- 备货  
- 大客户延迟一个季度回款  
- 季度性项目节奏  

这类时点因素只影响当期现金，不直接影响长期利润兑现能力。  
可分配利润计算中扣除的是：

> **正常经营和正常增长所需的常态化营运资本新增占用。**

---

## 六、程序实现说明

### 说明

- `np1`、`np2`、`np3` 为**前三年调整后利润预测**；
- 程序**不负责**自动计算当前可分配利润 $DP_0$；
- `theta0` 由外部分析得到，对应公式：$\theta_0 = DP_0 / NP_{adj,0}$；
- `thetaX` 为成熟阶段或长期阶段兑现系数，由分析后输入；
- 当前默认参数：`rf = 0.018`，`nominalGdpGrowth = 0.04`；
- 程序只负责：
  - 根据前三年利润计算基础估值；
  - 根据第三年增长率生成过渡期；
  - 根据统一终局增速计算终值；
  - 根据 $\theta = 0.15\theta_0 + 0.85\theta_x$ 计算整体折价。  

---

## 七、JavaScript 实现

```js
/**
 * 三段式利润估值 + 整体兑现折价
 *
 * 约定：
 * 1. np1、np2、np3 为你先分析后输入的“前三年调整后利润”
 * 2. 程序不负责计算 DP0 = NP_adj,0 + DA0 - MC0 - ΔWC^norm,0
 * 3. theta0 由外部分析得到：theta0 = DP0 / NP_adj,0
 * 4. thetaX 为成熟阶段或长期阶段兑现系数
 * 5. 过渡期按“第三年增长率线性衰减，终值起点收敛到终局增速”处理
 *
 * @param {Object} params
 * @param {number} params.np1 - 第1年调整后利润
 * @param {number} params.np2 - 第2年调整后利润
 * @param {number} params.np3 - 第3年调整后利润
 * @param {number} params.rf - 无风险利率，例如 0.02
 * @param {number} params.nominalGdpGrowth - 名义 GDP 增速 m，例如 0.05
 * @param {number} params.theta0 - 当前兑现系数
 * @param {number} params.thetaX - 长期兑现系数
 * @param {number} [params.equityRiskPremium=0.055] - 固定股权风险补偿，默认 5.5%
 * @param {number} [params.transitionYears=3] - 过渡期年数，默认 3 年，此时 N=6
 * @param {number} [params.nearTermWeight=0.15] - 前三年权重，默认 15%
 * @param {number} [params.longTermWeight=0.85] - 长期权重，默认 85%
 * @returns {Object}
 */
function calculateIntrinsicValue({
  np1,
  np2,
  np3,
  rf,
  nominalGdpGrowth,
  theta0,
  thetaX,
  equityRiskPremium = 0.055,
  transitionYears = 3,
  nearTermWeight = 0.15,
  longTermWeight = 0.85,
}) {
  const nums = {
    np1,
    np2,
    np3,
    rf,
    nominalGdpGrowth,
    theta0,
    thetaX,
    equityRiskPremium,
    transitionYears,
    nearTermWeight,
    longTermWeight,
  };

  for (const [key, value] of Object.entries(nums)) {
    if (!Number.isFinite(value)) {
      throw new Error(`${key} 必须是有限数字`);
    }
  }

  if (transitionYears < 0 || !Number.isInteger(transitionYears)) {
    throw new Error("transitionYears 必须是大于等于 0 的整数");
  }

  const weightSum = nearTermWeight + longTermWeight;
  if (Math.abs(weightSum - 1) > 1e-8) {
    throw new Error("nearTermWeight 与 longTermWeight 之和必须等于 1");
  }

  const R = rf + equityRiskPremium;
  const gInfinity = nominalGdpGrowth / (1 + 0.35 * nominalGdpGrowth);

  if (R <= gInfinity) {
    throw new Error("折现率 R 必须大于终局增速 g∞，否则终值公式无意义");
  }

  const g3 = np2 === 0 ? 0 : np3 / np2 - 1;

  const pvFirst3 =
    np1 / Math.pow(1 + R, 1) +
    np2 / Math.pow(1 + R, 2) +
    np3 / Math.pow(1 + R, 3);

  const profitSeries = [np1, np2, np3];
  let pvTransition = 0;
  const N = 3 + transitionYears;

  for (let t = 4; t <= N; t++) {
    const step = (t - 3) / (transitionYears + 1);
    const gt = g3 + step * (gInfinity - g3);

    const prevProfit = profitSeries[profitSeries.length - 1];
    const currentProfit = prevProfit * (1 + gt);

    profitSeries.push(currentProfit);
    pvTransition += currentProfit / Math.pow(1 + R, t);
  }

  const npN = profitSeries[profitSeries.length - 1];
  const npN1 = npN * (1 + gInfinity);

  const terminalValue = npN1 / (R - gInfinity);
  const pvTerminal = terminalValue / Math.pow(1 + R, N);

  const baseValue = pvFirst3 + pvTransition + pvTerminal;
  const theta = nearTermWeight * theta0 + longTermWeight * thetaX;
  const equityValue = baseValue * theta;

  return {
    equityValue,
    baseValue,
    theta,
    breakdown: {
      pvFirst3,
      pvTransition,
      pvTerminal,
      terminalValue,
    },
    assumptions: {
      R,
      gInfinity,
      g3,
      theta0,
      thetaX,
      nearTermWeight,
      longTermWeight,
      rf,
      equityRiskPremium,
      nominalGdpGrowth,
      transitionYears,
      N,
    },
    profitSeries: profitSeries.map((profit, index) => ({
      year: index + 1,
      profit,
    })),
  };
}
```

---

## 八、调用示例

```js
const result = calculateIntrinsicValue({
  np1: 10,
  np2: 12,
  np3: 14,
  rf: 0.02,
  nominalGdpGrowth: 0.05,
  theta0: 0.72,
  thetaX: 0.85,
  transitionYears: 3,
});

console.log(result);
```

---

## 九、一句话总纲

> **本体系以未来利润现值为估值基础，采用统一折现率与统一终局增速，将主观判断主要集中于利润预测；同时通过当前兑现系数与长期兑现系数的加权，对利润基础估值进行整体折价，从而将账面利润修正为更接近股东价值的估值结果。**
