import { Card, Empty, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type {
  AnnualProfitBridge,
  AnnualProfitBridgeRow,
  FinalProfitOutlookRow,
  PersonalProfitExpectationRow,
  ProfitBridgeRow,
  ProfitForecast,
  ProfitForecastRow,
} from '../data'

const { Paragraph, Text } = Typography

type ProfitForecastCardProps = {
  forecast?: ProfitForecast
}

export function ProfitForecastCard({ forecast }: ProfitForecastCardProps) {
  if (!forecast) {
    return (
      <Card className="report-card" title="利润预测">
        <Empty description="暂无利润预测数据" />
      </Card>
    )
  }

  const columns: ColumnsType<ProfitForecastRow> = [
    {
      title: '券商',
      dataIndex: 'broker',
      key: 'broker',
      fixed: 'left',
      width: 180,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    ...forecast.years.map((year) => ({
      title: `${year} 利润增速`,
      key: year,
      width: 160,
      render: (_: unknown, record: ProfitForecastRow) => record.years[year] ?? '--',
    })),
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      width: 320,
      render: (value?: string) => value ?? '--',
    },
  ]

  const bridgeColumns: ColumnsType<ProfitBridgeRow> = [
    {
      title: '条件',
      dataIndex: 'condition',
      key: 'condition',
      fixed: 'left',
      width: 180,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '2025 基础数据',
      dataIndex: 'baseData',
      key: 'baseData',
      width: 260,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
    {
      title: '粗略计算逻辑',
      dataIndex: 'roughLogic',
      key: 'roughLogic',
      width: 280,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
    {
      title: '预计可贡献净利润',
      dataIndex: 'estimatedNetProfitContribution',
      key: 'estimatedNetProfitContribution',
      width: 180,
      render: (value: string) => <Text strong className="profit-bridge-contribution">{value}</Text>,
    },
    {
      title: '备注：达成条件要跟踪什么 / 要验证什么逻辑',
      dataIndex: 'trackingNotes',
      key: 'trackingNotes',
      width: 420,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
    {
      title: '观点',
      dataIndex: 'view',
      key: 'view',
      width: 140,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '理由',
      dataIndex: 'rationale',
      key: 'rationale',
      width: 320,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
  ]

  const personalExpectationColumns: ColumnsType<PersonalProfitExpectationRow> = [
    {
      title: '条件',
      dataIndex: 'condition',
      key: 'condition',
      fixed: 'left',
      width: 180,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '2025 基础数据',
      dataIndex: 'baseData',
      key: 'baseData',
      width: 260,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
    {
      title: '我的假设',
      dataIndex: 'assumption',
      key: 'assumption',
      width: 220,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
    {
      title: '对 2026 利润贡献',
      dataIndex: 'profitContribution2026',
      key: 'profitContribution2026',
      width: 180,
      render: (value: string) => <Text strong className="profit-bridge-contribution">{value}</Text>,
    },
    {
      title: '观点',
      dataIndex: 'view',
      key: 'view',
      width: 140,
      render: (value: string) => <Text strong>{value}</Text>,
    },
  ]

  const annualBridgeColumns: ColumnsType<AnnualProfitBridgeRow> = [
    {
      title: '条件',
      dataIndex: 'condition',
      key: 'condition',
      fixed: 'left',
      width: 220,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '我的假设',
      dataIndex: 'assumption',
      key: 'assumption',
      width: 280,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
    {
      title: '利润贡献',
      dataIndex: 'profitContribution',
      key: 'profitContribution',
      width: 180,
      render: (value: string) => <Text strong className="profit-bridge-contribution">{value}</Text>,
    },
  ]

  const finalOutlookColumns: ColumnsType<FinalProfitOutlookRow> = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 160,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '我的合理预期归母净利润',
      dataIndex: 'netProfit',
      key: 'netProfit',
      width: 220,
      render: (value: string) => <Text strong className="profit-bridge-contribution">{value}</Text>,
    },
    {
      title: '同比',
      dataIndex: 'yoy',
      key: 'yoy',
      width: 160,
      render: (value: string) => <Text className="profit-bridge-text">{value}</Text>,
    },
  ]

  function renderAnnualProfitBridge(bridge: AnnualProfitBridge) {
    return (
      <div key={bridge.title} className="forecast-note-block">
        <Text strong>{bridge.title}</Text>
        <Paragraph className="forecast-note-paragraph" style={{ marginTop: 8 }}>
          {bridge.startingPoint}
        </Paragraph>
        <Table<AnnualProfitBridgeRow>
          rowKey="condition"
          style={{ marginTop: 12 }}
          columns={annualBridgeColumns}
          dataSource={bridge.rows}
          pagination={false}
          size="small"
          scroll={{ x: 760 }}
        />
        <div className="profit-bridge-summary-grid">
          {bridge.summaries.map((summary) => (
            <div key={`${bridge.title}-${summary.item}`} className="profit-bridge-summary-card">
              <Text type="secondary">{summary.item}</Text>
              <Text strong>{summary.amount}</Text>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="report-card" title={forecast.title || '利润预测'}>
      <Space direction="vertical" size={20} style={{ display: 'flex' }}>
        <Table<ProfitForecastRow>
          rowKey="broker"
          columns={columns}
          dataSource={forecast.rows}
          pagination={false}
          size="small"
          scroll={{ x: 980 }}
        />

        {forecast.bridgeRows?.length ? (
          <div className="forecast-note-block">
            <Text strong>利润桥拆解分析</Text>
            <Table<ProfitBridgeRow>
              rowKey="condition"
              style={{ marginTop: 12 }}
              columns={bridgeColumns}
              dataSource={forecast.bridgeRows}
              pagination={false}
              size="small"
              scroll={{ x: 1780 }}
            />
          </div>
        ) : null}

        {forecast.personalExpectationRows?.length ? (
          <div className="forecast-note-block">
            <Text strong>我的合理预期</Text>
            <Table<PersonalProfitExpectationRow>
              rowKey="condition"
              className="detail-expand-table"
              style={{ marginTop: 12 }}
              columns={personalExpectationColumns}
              dataSource={forecast.personalExpectationRows}
              pagination={false}
              size="small"
              scroll={{ x: 980 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div className="table-expanded-detail">
                    <Text strong className="table-expanded-detail-label">
                      详细理由
                    </Text>
                    <Text className="profit-bridge-text">{record.rationale}</Text>
                  </div>
                ),
                expandedRowKeys: forecast.personalExpectationRows.map((item) => item.condition),
                showExpandColumn: false,
              }}
            />
          </div>
        ) : null}

        {forecast.annualProfitBridges?.map((bridge) => renderAnnualProfitBridge(bridge))}

        {forecast.finalProfitOutlook?.length ? (
          <div className="forecast-note-block">
            <Text strong>最终版本</Text>
            <Table<FinalProfitOutlookRow>
              rowKey="year"
              style={{ marginTop: 12 }}
              columns={finalOutlookColumns}
              dataSource={forecast.finalProfitOutlook}
              pagination={false}
              size="small"
              scroll={{ x: 540 }}
            />
          </div>
        ) : null}

        <div className="forecast-note-block">
          <Text strong>总结：这版“合理预期”和卖方一致预期的差别，本质在哪里</Text>
          <Space direction="vertical" size={8} style={{ display: 'flex', marginTop: 12 }}>
            {forecast.breakdownNotes.length ? (
              forecast.breakdownNotes.map((note, index) => (
                <Paragraph key={`note-${index}`} className="forecast-note-paragraph">
                  {note}
                </Paragraph>
              ))
            ) : (
              <Paragraph className="forecast-note-paragraph">暂无拆解预测文案。</Paragraph>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  )
}
