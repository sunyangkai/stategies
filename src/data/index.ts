type WebpackRequireContext = {
  keys: () => string[]
  <T>(id: string): T
}

declare const require: {
  context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp) => WebpackRequireContext
}

export const STATEMENT_TITLES = ['资产负债表', '利润表', '现金流量表'] as const

export type StatementTitle = (typeof STATEMENT_TITLES)[number]

export type FinancialStatementItem = {
  name: string
  values: Record<string, string>
  level?: number
}

export type FinancialStatementSection = {
  name: string
  items: FinancialStatementItem[]
}

export type FinancialStatement = {
  title: string
  dates: string[]
  sections: FinancialStatementSection[]
}

type CompanyTableJson = {
  statements: Partial<Record<StatementTitle, FinancialStatement>>
}

type CompanyTableModule = CompanyTableJson | { default: CompanyTableJson }

export type ProfitForecastRow = {
  broker: string
  years: Record<string, string>
  summary?: string
}

export type ProfitBridgeRow = {
  condition: string
  baseData: string
  roughLogic: string
  estimatedNetProfitContribution: string
  trackingNotes: string
  view: string
  rationale: string
}

export type PersonalProfitExpectationRow = {
  condition: string
  baseData: string
  assumption: string
  profitContribution2026: string
  view: string
  rationale: string
}

export type AnnualProfitBridgeRow = {
  condition: string
  assumption: string
  profitContribution: string
}

export type AnnualProfitBridgeSummary = {
  item: string
  amount: string
}

export type AnnualProfitBridge = {
  title: string
  startingPoint: string
  rows: AnnualProfitBridgeRow[]
  summaries: AnnualProfitBridgeSummary[]
}

export type FinalProfitOutlookRow = {
  year: string
  netProfit: string
  yoy: string
}

export type PECalculatorConfig = {
  np0: number
  g1: number
  g2: number
  g3: number
  capex1?: number
  capex2?: number
  capex3?: number
  da1?: number
  da2?: number
  da3?: number
  rf?: number
  erp?: number
  M?: number
  gMax?: number
  theta?: number
}

export type ProfitForecast = {
  title: string
  years: string[]
  rows: ProfitForecastRow[]
  bridgeRows?: ProfitBridgeRow[]
  personalExpectationRows?: PersonalProfitExpectationRow[]
  annualProfitBridges?: AnnualProfitBridge[]
  finalProfitOutlook?: FinalProfitOutlookRow[]
  breakdownNotes: string[]
}

type CompanyProfitForecastModule = ProfitForecast | { default: ProfitForecast }

export type FinancialAnalysisItem = {
  title: string
  whatHappened: string[]
  coreReasons: string[]
  takeaway: string
}

export type FinancialAnalysis = {
  title: string
  intro?: string
  items: FinancialAnalysisItem[]
  finalConclusion?: string
}

type CompanyFinancialAnalysisModule = FinancialAnalysis | { default: FinancialAnalysis }

export type CompanyDataset = {
  secucode: string
  statements: Partial<Record<StatementTitle, FinancialStatement>>
  profitForecast?: ProfitForecast
  financialAnalysis?: FinancialAnalysis
  peCalculator?: PECalculatorConfig
}

function loadCompanyDatasets() {
  const tableContext = require.context('./', true, /table\.json$/)
  const forecastContext = require.context('./', true, /profitForecast\.json$/)
  const analysisContext = require.context('./', true, /financialAnalysis\.json$/)
  const peContext = require.context('./', true, /peCalculator\.json$/)
  const datasets = tableContext.keys().reduce<Record<string, CompanyDataset>>((result, path) => {
    const match = path.match(/^\.\/([^/]+)\/table\.json$/)

    if (!match) {
      return result
    }

    const secucode = match[1]
    const module = tableContext<CompanyTableModule>(path)
    const tableJson = 'default' in module ? module.default : module

    result[secucode] = {
      secucode,
      statements: tableJson.statements ?? {},
    }

    return result
  }, {})

  forecastContext.keys().forEach((path) => {
    const match = path.match(/^\.\/([^/]+)\/profitForecast\.json$/)

    if (!match) {
      return
    }

    const secucode = match[1]
    const module = forecastContext<CompanyProfitForecastModule>(path)
    const profitForecast = 'default' in module ? module.default : module

    if (!datasets[secucode]) {
      datasets[secucode] = {
        secucode,
        statements: {},
      }
    }

    datasets[secucode].profitForecast = profitForecast
  })

  analysisContext.keys().forEach((path) => {
    const match = path.match(/^\.\/([^/]+)\/financialAnalysis\.json$/)

    if (!match) {
      return
    }

    const secucode = match[1]
    const module = analysisContext<CompanyFinancialAnalysisModule>(path)
    const financialAnalysis = 'default' in module ? module.default : module

    if (!datasets[secucode]) {
      datasets[secucode] = {
        secucode,
        statements: {},
      }
    }

    datasets[secucode].financialAnalysis = financialAnalysis
  })

  peContext.keys().forEach((path) => {
    const match = path.match(/^\.\/([^/]+)\/peCalculator\.json$/)

    if (!match) {
      return
    }

    const secucode = match[1]
    const module = peContext<PECalculatorConfig | { default: PECalculatorConfig }>(path)
    const peCalculator = 'default' in module ? module.default : module

    if (!datasets[secucode]) {
      datasets[secucode] = {
        secucode,
        statements: {},
      }
    }

    datasets[secucode].peCalculator = peCalculator
  })

  return datasets
}

export const companyDatasets: Record<string, CompanyDataset> = loadCompanyDatasets()
