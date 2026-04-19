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

const cashflowFieldLabels = {
  NETCASH_OPERATE: '经营活动产生的现金流量净额',
  TOTAL_OPERATE_INFLOW: '经营活动现金流入小计',
  SALES_SERVICES: '销售商品、提供劳务收到的现金',
  TAX_REFUND: '收到的税收返还',
  RECEIVE_TAX_REFUND: '收到的税收返还',
  OTHER_OPERATE_INFLOW: '收到其他与经营活动有关的现金',
  RECEIVE_OTHER_OPERATE: '收到其他与经营活动有关的现金',
  TOTAL_OPERATE_OUTFLOW: '经营活动现金流出小计',
  BUY_SERVICES: '购买商品、接受劳务支付的现金',
  PAY_STAFF_CASH: '支付给职工以及为职工支付的现金',
  PAY_ALL_TAX: '支付的各项税费',
  PAY_OTHER_OPERATE: '支付其他与经营活动有关的现金',
  NETCASH_INVEST: '投资活动产生的现金流量净额',
  TOTAL_INVEST_INFLOW: '投资活动现金流入小计',
  RECOVER_INVEST_CASH: '收回投资收到的现金',
  WITHDRAW_INVEST: '收回投资收到的现金',
  INVEST_INCOME_CASH: '取得投资收益收到的现金',
  RECEIVE_INVEST_INCOME: '取得投资收益收到的现金',
  DISPOSAL_LONG_ASSET_CASH: '处置固定资产、无形资产和其他长期资产收回的现金净额',
  DISPOSAL_LONG_ASSET: '处置固定资产、无形资产和其他长期资产收回的现金净额',
  DISPOSAL_SUBSIDIARY_OTHER: '处置子公司及其他营业单位收到的现金净额',
  OTHER_INVEST_INFLOW: '收到其他与投资活动有关的现金',
  RECEIVE_OTHER_INVEST: '收到的其他与投资活动有关的现金',
  TOTAL_INVEST_OUTFLOW: '投资活动现金流出小计',
  CONSTRUCT_LONG_ASSET: '购建固定资产、无形资产和其他长期资产支付的现金',
  INVEST_PAY_CASH: '投资支付的现金',
  OBTAIN_SUBSIDIARY_OTHER: '取得子公司及其他营业单位支付的现金净额',
  PAY_OTHER_INVEST: '支付其他与投资活动有关的现金',
  NETCASH_FINANCE: '筹资活动产生的现金流量净额',
  TOTAL_FINANCE_INFLOW: '筹资活动现金流入小计',
  ACCEPT_INVEST_CASH: '吸收投资收到的现金',
  SUBSIDIARY_ACCEPT_INVEST: '其中:子公司吸收少数股东投资收到的现金',
  RECEIVE_LOAN_CASH: '取得借款收到的现金',
  RECEIVE_OTHER_FINANCE: '收到其他与筹资活动有关的现金',
  TOTAL_FINANCE_OUTFLOW: '筹资活动现金流出小计',
  PAY_DEBT_CASH: '偿还债务支付的现金',
  ASSIGN_DIVIDEND_PORFIT: '分配股利、利润或偿付利息支付的现金',
  SUBSIDIARY_PAY_DIVIDEND: '其中:子公司支付给少数股东的股利、利润',
  PAY_OTHER_FINANCE: '支付其他与筹资活动有关的现金',
  RATE_CHANGE_EFFECT: '汇率变动对现金及现金等价物的影响',
  CCE_ADD: '现金及现金等价物净增加额',
  BEGIN_CCE: '期初现金及现金等价物余额',
  END_CCE: '期末现金及现金等价物余额',
  NETPROFIT: '净利润',
  ASSET_IMPAIRMENT: '资产减值准备',
  DEPRECIATE_EXPENSE: '固定资产折旧、油气资产折耗、生产性生物资产折旧',
  FA_IR_DEPR: '固定资产和投资性房地产折旧',
  OILGAS_BIOLOGY_DEPR: '其中:固定资产折旧、油气资产折耗、生产性生物资产折旧',
  USERIGHT_ASSET_AMORTIZE: '使用权资产折旧',
  INTANGIBLE_ASSET_AMORTIZE: '无形资产摊销',
  IA_AMORTIZE: '无形资产摊销',
  LONG_EXPENSE_AMORTIZE: '长期待摊费用摊销',
  LPE_AMORTIZE: '长期待摊费用摊销',
  DISPOSAL_LONG_ASSET_LOSS: '处置固定资产、无形资产和其他长期资产的损失',
  DISPOSAL_LONGASSET_LOSS: '处置固定资产、无形资产和其他长期资产的损失',
  FIXED_ASSET_SCRAP_LOSS: '固定资产报废损失',
  FA_SCRAP_LOSS: '固定资产报废损失',
  FAIRVALUE_CHANGE_LOSS: '公允价值变动损失',
  FINANCE_EXPENSE: '财务费用',
  INVEST_LOSS: '投资损失',
  DEFER_TAX: '递延所得税资产减少',
  DT_ASSET_REDUCE: '其中:递延所得税资产减少',
  DEFER_INCOME_TAX: '递延所得税负债增加',
  DT_LIAB_ADD: '递延所得税负债增加',
  INVENTORY_DEC: '存货的减少',
  INVENTORY_REDUCE: '存货的减少',
  OPERATE_RECE_DEC: '经营性应收项目的减少',
  OPERATE_RECE_REDUCE: '经营性应收项目的减少',
  OPERATE_PAY_ADD: '经营性应付项目的增加',
  OPERATE_PAYABLE_ADD: '经营性应付项目的增加',
  OTHER: '其他',
  NETCASH_OPERATENOTE: '经营活动产生的现金流量净额',
  UNINVOLVE_INVESTFIN_OTHER: '不涉及现金收支的投资和筹资活动金额其他项目',
  END_CASH: '现金的期末余额',
  BEGIN_CASH: '减:现金的期初余额',
  CCE_ADDNOTE: '现金及现金等价物的净增加额',
}

const cashflowFieldOrder = [
  'NETCASH_OPERATE',
  'TOTAL_OPERATE_INFLOW',
  'SALES_SERVICES',
  'TAX_REFUND',
  'OTHER_OPERATE_INFLOW',
  'TOTAL_OPERATE_OUTFLOW',
  'BUY_SERVICES',
  'PAY_STAFF_CASH',
  'PAY_ALL_TAX',
  'PAY_OTHER_OPERATE',
  'NETCASH_INVEST',
  'TOTAL_INVEST_INFLOW',
  'RECOVER_INVEST_CASH',
  'INVEST_INCOME_CASH',
  'DISPOSAL_LONG_ASSET_CASH',
  'DISPOSAL_SUBSIDIARY_OTHER',
  'OTHER_INVEST_INFLOW',
  'TOTAL_INVEST_OUTFLOW',
  'CONSTRUCT_LONG_ASSET',
  'INVEST_PAY_CASH',
  'OBTAIN_SUBSIDIARY_OTHER',
  'PAY_OTHER_INVEST',
  'NETCASH_FINANCE',
  'TOTAL_FINANCE_INFLOW',
  'ACCEPT_INVEST_CASH',
  'RECEIVE_LOAN_CASH',
  'RECEIVE_OTHER_FINANCE',
  'TOTAL_FINANCE_OUTFLOW',
  'PAY_DEBT_CASH',
  'ASSIGN_DIVIDEND_PORFIT',
  'PAY_OTHER_FINANCE',
  'RATE_CHANGE_EFFECT',
  'CCE_ADD',
  'BEGIN_CCE',
  'END_CCE',
  'NETPROFIT',
  'ASSET_IMPAIRMENT',
  'DEPRECIATE_EXPENSE',
  'INTANGIBLE_ASSET_AMORTIZE',
  'LONG_EXPENSE_AMORTIZE',
  'DISPOSAL_LONG_ASSET_LOSS',
  'FIXED_ASSET_SCRAP_LOSS',
  'FAIRVALUE_CHANGE_LOSS',
  'FINANCE_EXPENSE',
  'INVEST_LOSS',
  'DEFER_TAX',
  'DEFER_INCOME_TAX',
  'INVENTORY_DEC',
  'OPERATE_RECE_DEC',
  'OPERATE_PAY_ADD',
  'OTHER',
]

const cashflowFieldOrderIndex = new Map(cashflowFieldOrder.map((field, index) => [field, index]))

function extractStockCode(secucode) {
  return String(secucode).split('.')[0]
}

function getSecurityFolder(secucode) {
  return extractStockCode(secucode)
}

function getDefaultRawOutput(secucode) {
  return path.join(projectRoot, 'src', 'data', getSecurityFolder(secucode), 'eastmoney-cashflow.json')
}

function getDefaultFrontendOutput(secucode) {
  return path.join(projectRoot, 'src', 'data', getSecurityFolder(secucode), 'reportTemplateCashflowData.ts')
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
    type: 'RPT_F10_FINANCE_GCASHFLOW',
    sty: 'APP_F10_GCASHFLOW',
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

async function fetchEastmoneyCashflowStatement(options) {
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

  throw new Error('未找到可处理的现金流量表数据数组')
}

function getSecucodeFromRecords(records) {
  const secucode = records[0]?.SECUCODE

  if (!secucode || typeof secucode !== 'string') {
    throw new Error('无法从数据中识别股票代码 SECUCODE')
  }

  return secucode
}

function getFieldLabel(field) {
  return cashflowFieldLabels[field] ?? field
}

function isSummaryField(field) {
  return (
    field === 'NETCASH_OPERATE' ||
    field === 'NETCASH_INVEST' ||
    field === 'NETCASH_FINANCE' ||
    field === 'TOTAL_OPERATE_INFLOW' ||
    field === 'TOTAL_OPERATE_OUTFLOW' ||
    field === 'TOTAL_INVEST_INFLOW' ||
    field === 'TOTAL_INVEST_OUTFLOW' ||
    field === 'TOTAL_FINANCE_INFLOW' ||
    field === 'TOTAL_FINANCE_OUTFLOW' ||
    field === 'CCE_ADD' ||
    field === 'BEGIN_CCE' ||
    field === 'END_CCE'
  )
}

function hasMeaningfulValue(records, field) {
  return records.some((record) => {
    const value = record[field]
    return typeof value === 'number' ? value !== 0 : value != null && value !== ''
  })
}

function normalizeValue(value) {
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
      const leftOrder = cashflowFieldOrderIndex.get(left) ?? Number.MAX_SAFE_INTEGER
      const rightOrder = cashflowFieldOrderIndex.get(right) ?? Number.MAX_SAFE_INTEGER

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
        records.map((record) => [String(record.REPORT_DATE_NAME), normalizeValue(record[field])]),
      ),
    })),
  }
}

function buildFrontendDataModule(table) {
  return `export type ReportTemplateCashflowRow = {
  key: string
  name: string
  isSummary: boolean
  values: Record<string, number | null>
}

export type ReportTemplateCashflowTable = {
  unit: string
  periods: string[]
  rows: ReportTemplateCashflowRow[]
}

export const reportTemplateCashflowTable: ReportTemplateCashflowTable = ${JSON.stringify(table, null, 2)}
`
}

function printHelp() {
  console.log(`
用法:
  node server/cashflow.js [--secucode 601888.SH] [--dates 2025-12-31,2024-12-31] [--output src/data/601888/eastmoney-cashflow.json]
  node server/cashflow.js --from-file src/data/601888/eastmoney-cashflow.json

示例:
  node server/cashflow.js
  node server/cashflow.js --secucode 600519.SH --dates 2024-12-31,2023-12-31
  node server/cashflow.js --from-file src/data/601888/eastmoney-cashflow.json --frontend-output src/data/601888/reportTemplateCashflowData.ts
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
    const { url, payload } = await fetchEastmoneyCashflowStatement(options)
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
