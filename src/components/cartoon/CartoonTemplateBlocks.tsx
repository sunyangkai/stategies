import type { ReactNode } from 'react'
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Input,
  List,
  Progress,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableColumnsType } from 'antd'
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  InboxOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { CartoonKpiRow, CartoonPanel } from './CartoonLayout'

const { Text } = Typography

export type ShowcaseCardConfig =
  | {
      key: string
      kind: 'form'
      title: string
      pill: string
      selectDefault: string
      selectOptions: Array<{ label: string; value: string }>
      searchPlaceholder: string
    }
  | {
      key: string
      kind: 'stats'
      title: string
      pill: string
      primaryStat: { title: string; value: number; suffix?: string }
      secondaryStat: { title: string; value: number; suffix?: string }
      progress: number
    }
  | {
      key: string
      kind: 'alerts'
      title: string
      pill: string
      alerts: Array<{ key: string; type: 'info' | 'success' | 'warning' | 'error'; title: string; description: string }>
    }

export type WorkflowSectionConfig = {
  segmentedOptions: string[]
  listItems: string[]
  collapseItems: Array<{ key: string; label: string; children: string }>
}

export type TableFilterOption = {
  label: string
  value: string
}

export type DataTableSectionProps<T extends { key: string }> = {
  title: string
  subtitle: string
  note: string
  keyword: string
  onKeywordChange: (value: string) => void
  keywordPlaceholder: string
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  statusOptions: TableFilterOption[]
  density: 'small' | 'middle' | 'large'
  onDensityChange: (value: 'small' | 'middle' | 'large') => void
  kpis: Array<{ label: string; value: ReactNode; extra: string }>
  columns: TableColumnsType<T>
  dataSource: T[]
  expandedRowRender: (record: T) => ReactNode
  summary?: (pageData: readonly T[]) => ReactNode
}

export function ShowcaseCardGrid({ cards }: { cards: ShowcaseCardConfig[] }) {
  return (
    <div className="cartoon-mini-grid">
      {cards.map((card) => {
        if (card.kind === 'form') {
          return (
            <Card
              key={card.key}
              title={
                <span className="cartoon-app-card-title">
                  <span>{card.title}</span>
                  <span className="cartoon-tag-pill">{card.pill}</span>
                </span>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                <Input prefix={<SearchOutlined />} placeholder={card.searchPlaceholder} />
                <Select style={{ width: '100%' }} defaultValue={card.selectDefault} options={card.selectOptions} />
                <DatePicker style={{ width: '100%' }} />
              </Space>
            </Card>
          )
        }

        if (card.kind === 'stats') {
          return (
            <Card
              key={card.key}
              title={
                <span className="cartoon-app-card-title">
                  <span>{card.title}</span>
                  <span className="cartoon-tag-pill">{card.pill}</span>
                </span>
              }
            >
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Statistic
                    title={card.primaryStat.title}
                    value={card.primaryStat.value}
                    suffix={card.primaryStat.suffix}
                    prefix={<ThunderboltOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title={card.secondaryStat.title}
                    value={card.secondaryStat.value}
                    suffix={card.secondaryStat.suffix}
                    prefix={<BarChartOutlined />}
                  />
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <Progress percent={card.progress} status="active" />
            </Card>
          )
        }

        return (
          <Card
            key={card.key}
            title={
              <span className="cartoon-app-card-title">
                <span>{card.title}</span>
                <span className="cartoon-tag-pill">{card.pill}</span>
              </span>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {card.alerts.map((item) => (
                <Alert
                  key={item.key}
                  message={item.title}
                  description={item.description}
                  type={item.type}
                  showIcon
                />
              ))}
            </Space>
          </Card>
        )
      })}
    </div>
  )
}

export function WorkflowTemplate({ config }: { config: WorkflowSectionConfig }) {
  return (
    <div className="cartoon-stack">
      <Card
        title={
          <span className="cartoon-app-card-title">
            <span>业务流程</span>
            <span className="cartoon-tag-pill">组合模板</span>
          </span>
        }
      >
        <Space direction="vertical" size={14} style={{ width: '100%' }}>
          <Segmented block options={config.segmentedOptions} />
          <Radio.Group defaultValue="week" optionType="button" buttonStyle="solid">
            <Radio.Button value="day">今日</Radio.Button>
            <Radio.Button value="week">本周</Radio.Button>
            <Radio.Button value="month">本月</Radio.Button>
          </Radio.Group>
          <List bordered dataSource={config.listItems} renderItem={(item) => <List.Item>{item}</List.Item>} />
        </Space>
      </Card>

      <Collapse items={config.collapseItems} />
    </div>
  )
}

export function DataTableSection<T extends { key: string }>(props: DataTableSectionProps<T>) {
  const {
    title,
    subtitle,
    note,
    keyword,
    onKeywordChange,
    keywordPlaceholder,
    statusFilter,
    onStatusFilterChange,
    statusOptions,
    density,
    onDensityChange,
    kpis,
    columns,
    dataSource,
    expandedRowRender,
    summary,
  } = props

  return (
    <CartoonPanel title={title} subtitle={subtitle}>
      <p className="cartoon-note">{note}</p>

      <CartoonKpiRow items={kpis} />

      <div className="cartoon-toolbar-shell">
        <div className="cartoon-toolbar">
          <div className="cartoon-toolbar-group">
          <Input
            className="cartoon-toolbar-search"
            allowClear
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            prefix={<SearchOutlined />}
            placeholder={keywordPlaceholder}
            style={{ width: 300 }}
          />
          <Select
            className="cartoon-toolbar-filter"
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: 160 }}
            prefix={<FilterOutlined />}
            options={statusOptions.map((item) => ({ value: item.value, label: item.label }))}
            />
          </div>

          <div className="cartoon-toolbar-group">
          <Segmented
            className="cartoon-toolbar-density"
            value={density}
            onChange={(value) => onDensityChange(value as 'small' | 'middle' | 'large')}
            options={[
                { label: '紧凑', value: 'small' },
                { label: '默认', value: 'middle' },
                { label: '宽松', value: 'large' },
              ]}
            />
            <Button icon={<DownloadOutlined />}>导出视图</Button>
          </div>
        </div>
      </div>

      <Table<T>
        className="cartoon-data-table"
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
        size={density}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        scroll={{ x: 1180 }}
        expandable={{ expandedRowRender }}
        summary={summary}
      />
    </CartoonPanel>
  )
}

export function ProjectIdentityCell({
  avatar,
  product,
  owner,
  region,
}: {
  avatar: string
  product: string
  owner: string
  region: string
}) {
  return (
    <div className="cartoon-identity-cell">
      <Avatar className="cartoon-identity-avatar">{avatar}</Avatar>
      <div>
        <div className="cartoon-identity-title">{product}</div>
        <Text type="secondary">
          {owner} · {region}
        </Text>
      </div>
    </div>
  )
}

export function StatusTag({ value }: { value: string }) {
  const config =
    {
      进行中: { color: 'gold', icon: <ClockCircleOutlined /> },
      已完成: { color: 'success', icon: <CheckCircleOutlined /> },
      待排期: { color: 'default', icon: <InboxOutlined /> },
    }[value] ?? { color: 'default', icon: undefined }

  return (
    <Tag color={config.color} icon={config.icon}>
      {value}
    </Tag>
  )
}
