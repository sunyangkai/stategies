import { calcPE } from '../shared/calcPE.js'

console.log(
  calcPE({
    np0: 44.15,
    g: [0.2, 0.15, 0.12],
    capex: [0, 0, 0],
    da: [0, 0, 0],
    rf: 0.018,
    erp: 0.055,
    M: 4,
    gMax: 0.04,
    theta: 0.95,
  }),
)
