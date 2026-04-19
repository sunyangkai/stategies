import { mkdir, readFile, writeFile } from 'node:fs/promises'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const DEFAULT_SECUCODE = '601888.SH'
const DEFAULT_REPORT_DATES = [
  '2025-12-31',
  '2024-12-31',
  '2023-12-31',
  '2022-12-31',
  '2021-12-31',
]

function getSecurityFolder(secucode) {
  return extractStockCode(secucode)
}

function getDefaultRawOutput(secucode) {
  return path.join(projectRoot, 'src', 'data', getSecurityFolder(secucode), 'eastmoney-balance.json')
}

function getDefaultFrontendOutput(secucode) {
  return path.join(projectRoot, 'src', 'data', getSecurityFolder(secucode), 'reportTemplateBalanceData.ts')
}

const nonFinancialFields = new Set([
  'SECUCODE',
  'SECURITY_CODE',
  'SECURITY_NAME_ABBR',
  'ORG_CODE',
  'ORG_TYPE',
  'REPORT_DATE',
  'REPORT_TYPE',
  'REPORT_DATE_NAME',
  'SECURITY_TYPE_CODE',
  'NOTICE_DATE',
  'UPDATE_DATE',
  'CURRENCY',
  'OPINION_TYPE',
  'LISTING_STATE',
])

const financialFieldLabels = {
  ACCOUNTS_PAYABLE: '应付账款',
  ACCOUNTS_RECE: '应收账款',
  ADVANCE_RECEIVABLES: '预收款项',
  ASSET_BALANCE: '资产科目平衡项',
  CAPITAL_RESERVE: '资本公积',
  CIP: '在建工程',
  CONTRACT_LIAB: '合同负债',
  CURRENT_ASSET_BALANCE: '流动资产平衡项',
  CURRENT_LIAB_BALANCE: '流动负债平衡项',
  DEFER_INCOME: '递延收益',
  DEFER_TAX_ASSET: '递延所得税资产',
  DEFER_TAX_LIAB: '递延所得税负债',
  DEVELOP_EXPENSE: '开发支出',
  DIVIDEND_PAYABLE: '应付股利',
  DIVIDEND_RECE: '应收股利',
  EQUITY_BALANCE: '权益科目平衡项',
  FIXED_ASSET: '固定资产',
  GOODWILL: '商誉',
  INTANGIBLE_ASSET: '无形资产',
  INVENTORY: '存货',
  INVEST_REALESTATE: '投资性房地产',
  LEASE_LIAB: '租赁负债',
  LIAB_BALANCE: '负债科目平衡项',
  LONG_EQUITY_INVEST: '长期股权投资',
  LONG_LOAN: '长期借款',
  LONG_PREPAID_EXPENSE: '长期待摊费用',
  LONG_STAFFSALARY_PAYABLE: '长期应付职工薪酬',
  MINORITY_EQUITY: '少数股东权益',
  MONETARYFUNDS: '货币资金',
  NONCURRENT_ASSET_BALANCE: '非流动资产平衡项',
  NONCURRENT_LIAB_1YEAR: '一年内到期的非流动负债',
  NONCURRENT_LIAB_BALANCE: '非流动负债平衡项',
  NOTE_ACCOUNTS_PAYABLE: '应付票据及应付账款',
  NOTE_ACCOUNTS_RECE: '应收票据及应收账款',
  NOTE_PAYABLE: '应付票据',
  OTHER_COMPRE_INCOME: '其他综合收益',
  OTHER_CURRENT_ASSET: '其他流动资产',
  OTHER_CURRENT_LIAB: '其他流动负债',
  OTHER_NONCURRENT_ASSET: '其他非流动资产',
  PARENT_EQUITY_BALANCE: '归母权益平衡项',
  PREPAYMENT: '预付款项',
  SHARE_CAPITAL: '股本',
  SHORT_LOAN: '短期借款',
  STAFF_SALARY_PAYABLE: '应付职工薪酬',
  SURPLUS_RESERVE: '盈余公积',
  TAX_PAYABLE: '应交税费',
  TOTAL_ASSETS: '总资产',
  TOTAL_CURRENT_ASSETS: '流动资产合计',
  TOTAL_CURRENT_LIAB: '流动负债合计',
  TOTAL_EQUITY: '股东权益合计',
  TOTAL_LIAB_EQUITY: '负债和股东权益总计',
  TOTAL_LIABILITIES: '负债合计',
  TOTAL_NONCURRENT_ASSETS: '非流动资产合计',
  TOTAL_NONCURRENT_LIAB: '非流动负债合计',
  TOTAL_OTHER_PAYABLE: '其他应付款合计',
  TOTAL_OTHER_RECE: '其他应收款合计',
  TOTAL_PARENT_EQUITY: '归母股东权益合计',
  UNASSIGN_RPOFIT: '未分配利润',
  USERIGHT_ASSET: '使用权资产',
}

const balanceSheetFieldOrder = [
  'MONETARYFUNDS',
  'NOTE_ACCOUNTS_RECE',
  'ACCOUNTS_RECE',
  'PREPAYMENT',
  'OTHER_CURRENT_ASSET',
  'INVENTORY',
  'TOTAL_OTHER_RECE',
  'ADVANCE_RECEIVABLES',
  'TOTAL_CURRENT_ASSETS',
  'LONG_EQUITY_INVEST',
  'INVEST_REALESTATE',
  'FIXED_ASSET',
  'CIP',
  'INTANGIBLE_ASSET',
  'GOODWILL',
  'DEVELOP_EXPENSE',
  'LONG_PREPAID_EXPENSE',
  'DEFER_TAX_ASSET',
  'OTHER_NONCURRENT_ASSET',
  'USERIGHT_ASSET',
  'TOTAL_NONCURRENT_ASSETS',
  'TOTAL_ASSETS',
  'SHORT_LOAN',
  'NOTE_PAYABLE',
  'NOTE_ACCOUNTS_PAYABLE',
  'ACCOUNTS_PAYABLE',
  'CONTRACT_LIAB',
  'OTHER_CURRENT_LIAB',
  'STAFF_SALARY_PAYABLE',
  'TAX_PAYABLE',
  'DIVIDEND_PAYABLE',
  'TOTAL_OTHER_PAYABLE',
  'NONCURRENT_LIAB_1YEAR',
  'TOTAL_CURRENT_LIAB',
  'LONG_LOAN',
  'LEASE_LIAB',
  'LONG_STAFFSALARY_PAYABLE',
  'DEFER_INCOME',
  'DEFER_TAX_LIAB',
  'TOTAL_NONCURRENT_LIAB',
  'TOTAL_LIABILITIES',
  'SHARE_CAPITAL',
  'CAPITAL_RESERVE',
  'OTHER_COMPRE_INCOME',
  'SURPLUS_RESERVE',
  'UNASSIGN_RPOFIT',
  'MINORITY_EQUITY',
  'TOTAL_PARENT_EQUITY',
  'TOTAL_EQUITY',
  'TOTAL_LIAB_EQUITY',
]

const balanceSheetFieldOrderIndex = new Map(balanceSheetFieldOrder.map((field, index) => [field, index]))

function parseArgs(argv) {
  const options = {
    secucode: DEFAULT_SECUCODE,
    reportDates: DEFAULT_REPORT_DATES,
    output: '',
    frontendOutput: '',
    fromFile: '',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]

    if (current === '--secucode' && argv[index + 1]) {
      options.secucode = argv[index + 1]
      index += 1
      continue
    }

    if (current === '--dates' && argv[index + 1]) {
      options.reportDates = argv[index + 1]
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      index += 1
      continue
    }

    if (current === '--output' && argv[index + 1]) {
      options.output = path.resolve(process.cwd(), argv[index + 1])
      index += 1
      continue
    }

    if (current === '--frontend-output' && argv[index + 1]) {
      options.frontendOutput = path.resolve(process.cwd(), argv[index + 1])
      index += 1
      continue
    }

    if (current === '--from-file' && argv[index + 1]) {
      options.fromFile = path.resolve(process.cwd(), argv[index + 1])
      index += 1
      continue
    }

    if (current === '--help') {
      options.help = true
    }
  }

  return options
}

function buildFilter(secucode, reportDates) {
  const dateList = reportDates.map((item) => `'${item}'`).join(',')
  return `(SECUCODE="${secucode}")(REPORT_DATE in (${dateList}))`
}

function buildRequestUrl({ secucode, reportDates }) {
  const params = new URLSearchParams({
    type: 'RPT_F10_FINANCE_GBALANCE',
    sty: 'F10_FINANCE_GBALANCE',
    filter: buildFilter(secucode, reportDates),
    p: '1',
    ps: String(reportDates.length),
    sr: '-1',
    st: 'REPORT_DATE',
    source: 'HSF10',
    client: 'PC',
    v: Date.now().toString(),
  })

  return `https://datacenter.eastmoney.com/securities/api/data/get?${params.toString()}`
}

async function fetchEastmoneyBalanceSheet(options) {
  const url = buildRequestUrl(options)
  const payload = await requestJson(url, {
    Accept: 'application/json, text/plain, */*',
    Referer: 'https://data.eastmoney.com/',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  })

  return {
    url,
    payload,
  }
}

function requestJson(url, headers) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers,
      },
      (response) => {
        const chunks = []

        response.on('data', (chunk) => {
          chunks.push(chunk)
        })

        response.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8')

          if ((response.statusCode ?? 500) >= 400) {
            reject(new Error(`请求失败: ${response.statusCode} ${response.statusMessage ?? ''}`.trim()))
            return
          }

          try {
            resolve(JSON.parse(body))
          } catch (error) {
            reject(error)
          }
        })
      },
    )

    request.on('error', reject)
  })
}

async function readJsonDocument(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'))
}

async function writeDocument(outputPath, content) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, content, 'utf8')
}

function getRawRecords(document) {
  if (Array.isArray(document?.result?.result?.data)) {
    return document.result.result.data
  }

  if (Array.isArray(document?.result?.data)) {
    return document.result.data
  }

  throw new Error('未找到可处理的财务数据数组')
}

function extractStockCode(secucode) {
  return String(secucode).split('.')[0]
}

function getSecucodeFromRecords(records) {
  const secucode = records[0]?.SECUCODE

  if (!secucode || typeof secucode !== 'string') {
    throw new Error('无法从数据中识别股票代码 SECUCODE')
  }

  return secucode
}

function getFieldLabel(field) {
  return financialFieldLabels[field] ?? field
}

function isSummaryField(field) {
  return field.startsWith('TOTAL_')
}

function hasMeaningfulValue(records, field) {
  return records.some((record) => {
    const value = record[field]
    return typeof value === 'number' ? value !== 0 : value != null && value !== ''
  })
}

function toYiAmount(value) {
  if (typeof value !== 'number' || Number.isNaN(value) || value === 0) {
    return null
  }

  return Number((value / 100000000).toFixed(2))
}

function buildFrontendTable(records) {
  const allKeys = [...new Set(records.flatMap(Object.keys))]

  const effectiveFields = allKeys
    .filter((field) => !nonFinancialFields.has(field))
    .filter((field) => !field.endsWith('_YOY'))
    .filter((field) => hasMeaningfulValue(records, field))
    .sort((left, right) => {
      const leftOrder = balanceSheetFieldOrderIndex.get(left) ?? Number.MAX_SAFE_INTEGER
      const rightOrder = balanceSheetFieldOrderIndex.get(right) ?? Number.MAX_SAFE_INTEGER

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }

      return allKeys.indexOf(left) - allKeys.indexOf(right)
    })

  return {
    unit: '亿元',
    periods: records.map((record) => String(record.REPORT_DATE_NAME)),
    rows: effectiveFields.map((field) => ({
      key: field,
      name: getFieldLabel(field),
      isSummary: isSummaryField(field),
      values: Object.fromEntries(
        records.map((record) => [String(record.REPORT_DATE_NAME), toYiAmount(record[field])]),
      ),
    })),
  }
}

function buildFrontendDataModule(table) {
  return `export type ReportTemplateBalanceRow = {
  key: string
  name: string
  isSummary: boolean
  values: Record<string, number | null>
}

export type ReportTemplateBalanceTable = {
  unit: string
  periods: string[]
  rows: ReportTemplateBalanceRow[]
}

export const reportTemplateBalanceTable: ReportTemplateBalanceTable = ${JSON.stringify(table, null, 2)}
`
}

function printHelp() {
  console.log(`
用法:
  node server/table.js [--secucode 601888.SH] [--dates 2025-12-31,2024-12-31] [--output src/data/601888/eastmoney-balance.json]
  node server/table.js --from-file src/data/601888/eastmoney-balance.json

示例:
  node server/table.js
  node server/table.js --secucode 600519.SH --dates 2024-12-31,2023-12-31
  node server/table.js --from-file src/data/601888/eastmoney-balance.json --frontend-output src/data/601888/reportTemplateBalanceData.ts
`.trim())
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    return
  }

  let rawDocument
  let effectiveSecucode = options.secucode

  if (options.fromFile) {
    rawDocument = await readJsonDocument(options.fromFile)
  } else {
    const { url, payload } = await fetchEastmoneyBalanceSheet(options)
    rawDocument = {
      fetchedAt: new Date().toISOString(),
      request: {
        secucode: options.secucode,
        reportDates: options.reportDates,
        url,
      },
      result: payload,
    }

  }

  const records = getRawRecords(rawDocument)
  effectiveSecucode = getSecucodeFromRecords(records)

  const rawOutputPath = options.output || getDefaultRawOutput(effectiveSecucode)
  const frontendOutputPath = options.frontendOutput || getDefaultFrontendOutput(effectiveSecucode)

  if (!options.fromFile) {
    await writeDocument(rawOutputPath, `${JSON.stringify(rawDocument, null, 2)}\n`)
    console.log(`已写入原始 JSON: ${rawOutputPath}`)
  }

  const table = buildFrontendTable(records)
  const frontendModule = buildFrontendDataModule(table)

  await writeDocument(frontendOutputPath, frontendModule)

  console.log(`股票代码目录: ${getSecurityFolder(effectiveSecucode)}`)
  console.log(`已写入前端数据: ${frontendOutputPath}`)
  console.log(`期数: ${table.periods.length}`)
  console.log(`有效字段数: ${table.rows.length}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
