import { Card, Empty, Table, Tabs, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { STATEMENT_TITLES, type FinancialStatement, type StatementTitle } from '../data'

const { Text } = Typography

type StatementRow = {
  key: string
  name: string
  values: Record<string, string>
  level: number
  rowType: 'section' | 'item' | 'summary'
}

type FinancialStatementsTabsProps = {
  statements: Partial<Record<StatementTitle, FinancialStatement>>
}

function flattenStatementRows(statement: FinancialStatement): StatementRow[] {
  return statement.sections.flatMap((section, sectionIndex) => {
    const sectionRow: StatementRow = {
      key: `section-${sectionIndex}`,
      name: section.name,
      values: {},
      level: 0,
      rowType: 'section',
    }

    const itemRows = section.items.map<StatementRow>((item, itemIndex) => ({
      key: `section-${sectionIndex}-item-${itemIndex}`,
      name: item.name,
      values: item.values,
      level: item.level ?? 0,
      rowType: item.level ? 'item' : 'summary',
    }))

    return [sectionRow, ...itemRows]
  })
}

function renderStatementTable(statement: FinancialStatement) {
  const rows = flattenStatementRows(statement)

  const columns: ColumnsType<StatementRow> = [
    {
      title: '项目',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 280,
      render: (value: string, record: StatementRow) => {
        const style = { paddingLeft: `${record.level * 20}px` }

        if (record.rowType === 'item') {
          return <span style={style}>{value}</span>
        }

        return (
          <Text strong style={style}>
            {value}
          </Text>
        )
      },
    },
    ...statement.dates.map((date) => ({
      title: date,
      key: date,
      width: 160,
      render: (_: unknown, record: StatementRow) => {
        const value = record.values[date] ?? '--'
        return record.rowType === 'item' ? value : <Text strong>{value}</Text>
      },
    })),
  ]

  return (
    <Table<StatementRow>
      rowKey="key"
      columns={columns}
      dataSource={rows}
      pagination={false}
      size="small"
      scroll={{ x: 1080 }}
      rowClassName={(record) => `statement-row-${record.rowType}`}
    />
  )
}

export function FinancialStatementsTabs({ statements }: FinancialStatementsTabsProps) {
  const items = STATEMENT_TITLES.filter((title) => statements[title]).map((title) => ({
    key: title,
    label: title,
    children: renderStatementTable(statements[title]!),
  }))

  return (
    <Card className="report-card" title="三大财务报表">
      {items.length ? <Tabs items={items} /> : <Empty description="暂无三表数据" />}
    </Card>
  )
}
