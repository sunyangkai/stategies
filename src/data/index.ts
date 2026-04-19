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

export type CompanyDataset = {
  secucode: string
  statements: Partial<Record<StatementTitle, FinancialStatement>>
}

function loadCompanyDatasets() {
  const context = require.context('./', true, /table\.json$/)

  return context.keys().reduce<Record<string, CompanyDataset>>((datasets, path) => {
    const match = path.match(/^\.\/([^/]+)\/table\.json$/)

    if (!match) {
      return datasets
    }

    const secucode = match[1]
    const module = context<CompanyTableModule>(path)
    const tableJson = 'default' in module ? module.default : module

    datasets[secucode] = {
      secucode,
      statements: tableJson.statements ?? {},
    }

    return datasets
  }, {})
}

export const companyDatasets: Record<string, CompanyDataset> = loadCompanyDatasets()
