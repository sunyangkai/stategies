export interface CalcPEInput {
  np0: number
  g: [number, number, number]
  da?: [number, number, number]
  capex?: [number, number, number]
  rf: number
  erp?: number
  M: number
  gMax?: number
  theta?: number
}

export function calcPE(input: CalcPEInput): number
