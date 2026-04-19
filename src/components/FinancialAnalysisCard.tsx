import { Card, Empty, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FinancialAnalysis, FinancialAnalysisItem } from '../data'

const { Paragraph, Text } = Typography

type FinancialAnalysisCardProps = {
  analysis?: FinancialAnalysis
}

type AnalysisTableRow = FinancialAnalysisItem & {
  key: string
}

function renderBulletList(items: string[], className?: string) {
  return (
    <ul className={className ?? 'analysis-table-list'}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function FinancialAnalysisCard({ analysis }: FinancialAnalysisCardProps) {
  if (!analysis) {
    return (
      <Card className="report-card" title="财务报表分析">
        <Empty description="暂无财务分析内容" />
      </Card>
    )
  }

  const dataSource: AnalysisTableRow[] = analysis.items.map((item, index) => ({
    key: `analysis-${index}`,
    ...item,
  }))

  const columns: ColumnsType<AnalysisTableRow> = [
    {
      title: '主题',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      fixed: 'left',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '发生了什么',
      dataIndex: 'whatHappened',
      key: 'whatHappened',
      width: 360,
      render: (value: string[]) => renderBulletList(value),
    },
    {
      title: '核心原因',
      dataIndex: 'coreReasons',
      key: 'coreReasons',
      width: 360,
      render: (value: string[]) => renderBulletList(value),
    },
  ]

  return (
    <Card className="report-card" title={analysis.title}>
      {analysis.intro ? <Paragraph className="analysis-intro">{analysis.intro}</Paragraph> : null}

      <Table<AnalysisTableRow>
        rowKey="key"
        className="analysis-table"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        scroll={{ x: 1000 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="analysis-row-takeaway">
              <Text strong className="analysis-row-takeaway-label">
                总结
              </Text>
              <Text className="analysis-takeaway">{record.takeaway}</Text>
            </div>
          ),
          expandedRowKeys: dataSource.map((item) => item.key),
          showExpandColumn: false,
        }}
      />

      {analysis.finalConclusion ? (
        <div className="analysis-conclusion-block">
          <Text strong>最终压缩成一句结论</Text>
          <Paragraph className="analysis-paragraph">{analysis.finalConclusion}</Paragraph>
        </div>
      ) : null}
    </Card>
  )
}
