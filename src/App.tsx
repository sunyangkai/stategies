import { Alert, Col, Layout, Row, Space } from 'antd'
import { FinancialAnalysisCard } from './components/FinancialAnalysisCard'
import { FinancialStatementsTabs } from './components/FinancialStatementsTabs'
import { PECalculator } from './components/PECalculator'
import { ProfitForecastCard } from './components/ProfitForecastCard'
import { TrackingItemsCard } from './components/TrackingItemsCard'
import { companyDatasets } from './data'

const { Content } = Layout

export default function App() {
  const secucode = '601888'
  const dataset = companyDatasets[secucode]

  return (
    <Layout className="report-layout">
      <Content className="report-content report-content-plain">
        <Row justify="center">
          <Col xs={24} xl={18}>
            {dataset ? (
              <Space direction="vertical" size={24} style={{ display: 'flex' }}>
                <PECalculator config={dataset.peCalculator} />
                <FinancialStatementsTabs statements={dataset.statements} />
                <FinancialAnalysisCard analysis={dataset.financialAnalysis} />
                <ProfitForecastCard forecast={dataset.profitForecast} />
                <TrackingItemsCard trackingItems={dataset.trackingItems} />
              </Space>
            ) : (
              <Alert
                type="warning"
                showIcon
                message={`未找到 ${secucode} 的数据`}
                description="请先在 src/data/<股票代码>/ 下补充对应数据文件。"
              />
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
