import { useState } from 'react'
import { Card, Checkbox, Empty, Flex, Table, Tabs, Typography } from 'antd'
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

function parseAmount(value: string | undefined) {
  if (!value || value === '--') {
    return null
  }

  const normalized = value.replace(/,/g, '').trim()
  const matched = normalized.match(/^(-?\d+(?:\.\d+)?)(亿|万)?$/)

  if (!matched) {
    return null
  }

  const amount = Number(matched[1])
  const unit = matched[2]

  if (Number.isNaN(amount)) {
    return null
  }

  if (unit === '亿') {
    return amount * 100000000
  }

  if (unit === '万') {
    return amount * 10000
  }

  return amount
}

function formatYoY(currentValue: string | undefined, previousValue: string | undefined) {
  const current = parseAmount(currentValue)
  const previous = parseAmount(previousValue)

  if (current == null || previous == null || previous === 0) {
    return null
  }

  const ratio = ((current - previous) / previous) * 100

  if (!Number.isFinite(ratio)) {
    return null
  }

  return ratio
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

function renderStatementTable(statement: FinancialStatement, showYoY: boolean) {
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
        const currentIndex = statement.dates.indexOf(date)
        const previousDate = statement.dates[currentIndex + 1]
        const yoy = previousDate ? formatYoY(record.values[date], record.values[previousDate]) : null
        const valueNode = record.rowType === 'item' ? value : <Text strong>{value}</Text>

        if (!showYoY || record.rowType === 'section') {
          return valueNode
        }

        return (
          <Flex vertical gap={2}>
            {valueNode}
            <Text
              className={yoy == null ? 'statement-yoy-neutral' : yoy >= 0 ? 'statement-yoy-up' : 'statement-yoy-down'}
              type="secondary"
            >
              {yoy == null ? '--' : `${yoy >= 0 ? '+' : ''}${yoy.toFixed(2)}%`}
            </Text>
          </Flex>
        )
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
  const [showYoY, setShowYoY] = useState(false)

  const items = STATEMENT_TITLES.filter((title) => statements[title]).map((title) => ({
    key: title,
    label: title,
    children: renderStatementTable(statements[title]!, showYoY),
  }))

  return (
    <Card
      className="report-card"
      title={
        <Flex align="center" justify="space-between" gap={12} wrap>
          <span>三大财务报表</span>
          <Checkbox checked={showYoY} onChange={(event) => setShowYoY(event.target.checked)}>
            显示同比
          </Checkbox>
        </Flex>
      }
    >
      {items.length ? <Tabs items={items} /> : <Empty description="暂无三表数据" />}
    </Card>
  )
}
