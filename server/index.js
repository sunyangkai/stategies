
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