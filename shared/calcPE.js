export function calcPE({
  np0,
  g = [],
  da = [],
  capex = [],
  rf,
  erp = 0.055,
  M,
  gMax = 0.04,
  theta = 0.9,
}) {
  const R = rf + erp
  const gT = (gMax * (0.35 * M)) / (1 + 0.35 * M)
  const [g1, g2, g3] = g
  const [capex1, capex2, capex3] = capex
  const [da1, da2, da3] = da

  if (R <= gT) {
    throw new Error('R 必须大于 gT')
  }

  const np1 = np0 * (1 + g1)
  const np2 = np1 * (1 + g2)
  const np3 = np2 * (1 + g3)

  const fcf1 = np1 + da1 - capex1
  const fcf2 = np2 + da2 - capex2
  const fcf3 = np3 + da3 - capex3

  const excess = Math.max(g3 - gT, 0)
  const g4 = gT + 0.75 * excess
  const g5 = gT + 0.5 * excess
  const g6 = gT + 0.25 * excess

  const fcf4 = fcf3 * (1 + g4)
  const fcf5 = fcf4 * (1 + g5)
  const fcf6 = fcf5 * (1 + g6)

  const np4 = np3 * (1 + g4)
  const np5 = np4 * (1 + g5)
  const np6 = np5 * (1 + g6)

  const tv6 = (np6 * (1 + gT)) / (R - gT)

  const v0Base =
    fcf1 / (1 + R) ** 1 +
    fcf2 / (1 + R) ** 2 +
    fcf3 / (1 + R) ** 3 +
    fcf4 / (1 + R) ** 4 +
    fcf5 / (1 + R) ** 5 +
    fcf6 / (1 + R) ** 6 +
    tv6 / (1 + R) ** 6

  const v0 = theta * v0Base

  return Number((v0 / np0).toFixed(2))
}
