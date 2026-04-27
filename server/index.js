




const finalPe = calculateIntrinsicPe({
  company: {
    growthForecasts: [0.12, 0.12, 0.12],
    theta0: 0.9,
    thetaX: 0.9,
    transitionYears: 3,
  },
  macro: {
    rf: 0.018,
    nominalGdpGrowth: 4,
  },
});

console.log(finalPe.toFixed(1));


























/**
 * 三段式利润估值 + 整体兑现折价
 *
 * 约定：
 * 1. company.growthForecasts 为未来三年利润增速预测 [g1, g2, g3]
 * 2. 函数内部默认当前利润 np0 = 1，因此最终直接返回 PE
 * 3. 程序不负责计算 DP0 = NP_adj,0 + DA0 - MC0 - ΔWC^norm,0
 * 4. company.theta0 由外部分析得到：theta0 = DP0 / NP_adj,0
 * 5. company.thetaX 为成熟阶段或长期阶段兑现系数
 * 6. 过渡期按“第三年增长率线性衰减，终值起点收敛到终局增速”处理
 *
 * @param {Object} params
 * @param {Object} params.company - 公司层面参数
 * @param {number[]} params.company.growthForecasts - 三年利润增速预测 [g1, g2, g3]
 * @param {number} params.company.theta0 - 当前兑现系数
 * @param {number} params.company.thetaX - 长期兑现系数
 * @param {number} [params.company.transitionYears=3] - 过渡期年数，默认 3 年
 * @param {number} [params.company.nearTermWeight=0.15] - 前三年权重，默认 15%
 * @param {number} [params.company.longTermWeight=0.85] - 长期权重，默认 85%
 *
 * @param {Object} params.macro - 宏观层面参数
 * @param {number} params.macro.rf - 无风险利率，例如 0.018
 * @param {number} params.macro.nominalGdpGrowth - 名义 GDP 增速 m，例如 0.04
 * @param {number} [params.macro.equityRiskPremium=0.055] - 固定股权风险补偿，默认 5.5%
 *
 * @returns {number} finalPe
 */
function calculateIntrinsicPe({ company, macro }) {
  const {
    growthForecasts,
    theta0,
    thetaX,
    transitionYears = 3,
    nearTermWeight = 0.15,
    longTermWeight = 0.85,
  } = company || {};

  const {
    rf,
    nominalGdpGrowth,
    equityRiskPremium = 0.055,
  } = macro || {};

  if (!Array.isArray(growthForecasts) || growthForecasts.length !== 3) {
    throw new Error("company.growthForecasts 必须是长度为 3 的数组，例如 [0.12, 0.10, 0.08]");
  }

  const [g1, g2, g3] = growthForecasts;

  const nums = {
    g1,
    g2,
    g3,
    theta0,
    thetaX,
    transitionYears,
    nearTermWeight,
    longTermWeight,
    rf,
    nominalGdpGrowth,
    equityRiskPremium,
  };

  for (const [key, value] of Object.entries(nums)) {
    if (!Number.isFinite(value)) {
      throw new Error(`${key} 必须是有限数字`);
    }
  }

  if (!Number.isInteger(transitionYears) || transitionYears < 0) {
    throw new Error("transitionYears 必须是大于等于 0 的整数");
  }

  if (Math.abs(nearTermWeight + longTermWeight - 1) > 1e-8) {
    throw new Error("nearTermWeight 与 longTermWeight 之和必须等于 1");
  }

  if (g1 <= -1 || g2 <= -1 || g3 <= -1) {
    throw new Error("growthForecasts 中每个增速都必须大于 -1；当前版本不考虑亏损情形");
  }

  const R = rf + equityRiskPremium;
  const gInfinity = (0.35 * nominalGdpGrowth / (1 + 0.35 * nominalGdpGrowth)) * 0.04;

  if (R <= gInfinity) {
    throw new Error("折现率 R 必须大于终局增速 g∞");
  }

  // 内部标准化：np0 = 1
  const np0 = 1;
  const np1 = np0 * (1 + g1);
  const np2 = np1 * (1 + g2);
  const np3 = np2 * (1 + g3);

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

    if (currentProfit <= 0) {
      throw new Error("过渡期利润小于等于 0；当前版本不考虑亏损情形");
    }

    profitSeries.push(currentProfit);
    pvTransition += currentProfit / Math.pow(1 + R, t);
  }

  const npN = profitSeries[profitSeries.length - 1];
  const npN1 = npN * (1 + gInfinity);

  const terminalValue = npN1 / (R - gInfinity);
  const pvTerminal = terminalValue / Math.pow(1 + R, N);

  const basePe = pvFirst3 + pvTransition + pvTerminal;
  const theta = nearTermWeight * theta0 + longTermWeight * thetaX;

  return basePe * theta;
}