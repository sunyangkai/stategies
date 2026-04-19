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

const incomeFieldLabels = {
  TOTAL_OPERATE_INCOME: '营业总收入',
  OPERATE_INCOME: '营业收入',
  INTEREST_INCOME: '利息收入',
  PREMIUM_EARNED: '已赚保费',
  FEE_COMMISSION_INCOME: '手续费及佣金收入',
  TOTAL_OPERATE_COST: '营业总成本',
  OPERATE_COST: '营业成本',
  INTEREST_EXPENSE: '利息支出',
  FEE_COMMISSION_EXPENSE: '手续费及佣金支出',
  REFUND_PREMIUM: '退保金',
  NETPAY_INSURANCE_CLAIM: '赔付支出净额',
  WITHDRAW_INSURANCE_CONTRACT_RESERVE: '提取保险责任准备金净额',
  POLICY_DIVIDEND_PAYOUT: '保单红利支出',
  REINSURANCE_EXPENSE: '分保费用',
  OPERATE_TAX_ADD: '税金及附加',
  SALE_EXPENSE: '销售费用',
  MANAGE_EXPENSE: '管理费用',
  RESEARCH_EXPENSE: '研发费用',
  FINANCE_EXPENSE: '财务费用',
  FE_INTEREST_EXPENSE: '其中:利息费用',
  FE_INTEREST_INCOME: '其中:利息收入',
  ASSET_IMPAIRMENT_LOSS: '资产减值损失',
  CREDIT_IMPAIRMENT_LOSS: '信用减值损失',
  ASSET_IMPAIRMENT_INCOME: '资产减值收益',
  CREDIT_IMPAIRMENT_INCOME: '信用减值收益',
  OTHER_INCOME: '其他收益',
  INVEST_INCOME: '投资收益',
  INVEST_JOINT_INCOME: '对联营企业和合营企业的投资收益',
  FAIRVALUE_CHANGE_INCOME: '公允价值变动收益',
  ASSET_DISPOSAL_INCOME: '资产处置收益',
  OPERATE_PROFIT: '营业利润',
  NONBUSINESS_INCOME: '营业外收入',
  NONBUSINESS_EXPENSE: '营业外支出',
  TOTAL_PROFIT: '利润总额',
  INCOME_TAX: '所得税费用',
  NETPROFIT: '净利润',
  CONTINUED_NETPROFIT: '持续经营净利润',
  PARENT_NETPROFIT: '归母净利润',
  MINORITY_PROFIT: '少数股东损益',
  MINORITY_INTEREST: '少数股东损益',
  DEDUCT_PARENT_NETPROFIT: '扣非归母净利润',
  BASIC_EPS: '基本每股收益',
  DILUTED_EPS: '稀释每股收益',
  COMPRE_INCOME: '综合收益总额',
  TOTAL_COMPRE_INCOME: '综合收益总额',
  OTHER_COMPRE_INCOME: '其他综合收益',
  PARENT_OCI: '归母其他综合收益',
  MINORITY_OCI: '少数股东其他综合收益',
  UNABLE_OCI: '不能重分类进损益的其他综合收益',
  ABLE_OCI: '将重分类进损益的其他综合收益',
  RIGHTLAW_ABLE_OCI: '权益法下可转损益的其他综合收益',
  CONVERT_DIFF: '外币财务报表折算差额',
  SETUP_PROFIT_CHANGE: '其他权益工具投资公允价值变动',
  PARENT_COMPRE_INCOME: '归母综合收益总额',
  MINORITY_COMPRE_INCOME: '少数股东综合收益总额',
  PARENT_TCI: '归母综合收益总额',
  MINORITY_TCI: '少数股东综合收益总额',
}

const incomeFieldOrder = [
  'TOTAL_OPERATE_INCOME',
  'OPERATE_INCOME',
  'INTEREST_INCOME',
  'PREMIUM_EARNED',
  'FEE_COMMISSION_INCOME',
  'TOTAL_OPERATE_COST',
  'OPERATE_COST',
  'INTEREST_EXPENSE',
  'FEE_COMMISSION_EXPENSE',
  'REFUND_PREMIUM',
  'NETPAY_INSURANCE_CLAIM',
  'WITHDRAW_INSURANCE_CONTRACT_RESERVE',
  'POLICY_DIVIDEND_PAYOUT',
  'REINSURANCE_EXPENSE',
  'OPERATE_TAX_ADD',
  'SALE_EXPENSE',
  'MANAGE_EXPENSE',
  'RESEARCH_EXPENSE',
  'FINANCE_EXPENSE',
  'ASSET_IMPAIRMENT_LOSS',
  'CREDIT_IMPAIRMENT_LOSS',
  'OTHER_INCOME',
  'INVEST_INCOME',
  'FAIRVALUE_CHANGE_INCOME',
  'ASSET_DISPOSAL_INCOME',
  'OPERATE_PROFIT',
  'NONBUSINESS_INCOME',
  'NONBUSINESS_EXPENSE',
  'TOTAL_PROFIT',
  'INCOME_TAX',
  'NETPROFIT',
  'PARENT_NETPROFIT',
  'MINORITY_PROFIT',
  'DEDUCT_PARENT_NETPROFIT',
  'BASIC_EPS',
  'DILUTED_EPS',
  'COMPRE_INCOME',
  'PARENT_COMPRE_INCOME',
  'MINORITY_COMPRE_INCOME',
]

const incomeFieldOrderIndex = new Map(incomeFieldOrder.map((field, index) => [field, index]))

function extractStockCode(secucode) {
  return String(secucode).split('.')[0]
}

function getSecurityFolder(secucode) {
  return extractStockCode(secucode)
}

function getDefaultRawOutput(secucode) {
  return path.join(projectRoot, 'src', 'data', getSecurityFolder(secucode), 'eastmoney-income.json')
}

function getDefaultFrontendOutput(secucode) {
  return path.join(projectRoot, 'src', 'data', getSecurityFolder(secucode), 'reportTemplateIncomeData.ts')
}

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
    type: 'RPT_F10_FINANCE_GINCOME',
    sty: 'APP_F10_GINCOME',
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

async function fetchEastmoneyIncomeStatement(options) {
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

  throw new Error('未找到可处理的利润表数据数组')
}

function getSecucodeFromRecords(records) {
  const secucode = records[0]?.SECUCODE

  if (!secucode || typeof secucode !== 'string') {
    throw new Error('无法从数据中识别股票代码 SECUCODE')
  }

  return secucode
}

function getFieldLabel(field) {
  return incomeFieldLabels[field] ?? field
}

function isSummaryField(field) {
  return (
    field.startsWith('TOTAL_') ||
    field === 'OPERATE_PROFIT' ||
    field === 'TOTAL_PROFIT' ||
    field === 'NETPROFIT' ||
    field === 'PARENT_NETPROFIT' ||
    field === 'DEDUCT_PARENT_NETPROFIT' ||
    field === 'COMPRE_INCOME' ||
    field === 'PARENT_COMPRE_INCOME'
  )
}

function hasMeaningfulValue(records, field) {
  return records.some((record) => {
    const value = record[field]
    return typeof value === 'number' ? value !== 0 : value != null && value !== ''
  })
}

function normalizeValue(field, value) {
  if (typeof value !== 'number' || Number.isNaN(value) || value === 0) {
    return null
  }

  if (field === 'BASIC_EPS' || field === 'DILUTED_EPS') {
    return Number(value.toFixed(2))
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
      const leftOrder = incomeFieldOrderIndex.get(left) ?? Number.MAX_SAFE_INTEGER
      const rightOrder = incomeFieldOrderIndex.get(right) ?? Number.MAX_SAFE_INTEGER

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
        records.map((record) => [String(record.REPORT_DATE_NAME), normalizeValue(field, record[field])]),
      ),
    })),
  }
}

function buildFrontendDataModule(table) {
  return `export type ReportTemplateIncomeRow = {
  key: string
  name: string
  isSummary: boolean
  values: Record<string, number | null>
}

export type ReportTemplateIncomeTable = {
  unit: string
  periods: string[]
  rows: ReportTemplateIncomeRow[]
}

export const reportTemplateIncomeTable: ReportTemplateIncomeTable = ${JSON.stringify(table, null, 2)}
`
}

function printHelp() {
  console.log(`
用法:
  node server/income.js [--secucode 601888.SH] [--dates 2025-12-31,2024-12-31] [--output src/data/601888/eastmoney-income.json]
  node server/income.js --from-file src/data/601888/eastmoney-income.json

示例:
  node server/income.js
  node server/income.js --secucode 600519.SH --dates 2024-12-31,2023-12-31
  node server/income.js --from-file src/data/601888/eastmoney-income.json --frontend-output src/data/601888/reportTemplateIncomeData.ts
`.trim())
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    return
  }

  let rawDocument

  if (options.fromFile) {
    rawDocument = await readJsonDocument(options.fromFile)
  } else {
    const { url, payload } = await fetchEastmoneyIncomeStatement(options)
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
  const effectiveSecucode = getSecucodeFromRecords(records)
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
