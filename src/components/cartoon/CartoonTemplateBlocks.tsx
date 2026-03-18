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
  Switch,
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
  bordered: boolean
  onBorderedChange: (checked: boolean) => void
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
  expandedRowRender: (record: T) => React.ReactNode
  summary: (pageData: readonly T[]) => React.ReactNode
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
                <Select
                  style={{ width: '100%' }}
                  defaultValue={card.selectDefault}
                  options={card.selectOptions}
                />
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
                  <Statistic title={card.primaryStat.title} value={card.primaryStat.value} suffix={card.primaryStat.suffix} prefix={<ThunderboltOutlined />} />
                </Col>
                <Col span={12}>
                  <Statistic title={card.secondaryStat.title} value={card.secondaryStat.value} suffix={card.secondaryStat.suffix} prefix={<BarChartOutlined />} />
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
    bordered,
    onBorderedChange,
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
    <CartoonPanel
      title={title}
      subtitle={subtitle}
      extra={
        <Space>
          <Switch checked={bordered} onChange={onBorderedChange} />
          <Text strong>边框模式</Text>
        </Space>
      }
    >
      <p className="cartoon-note">{note}</p>

      <CartoonKpiRow items={kpis} />

      <div className="cartoon-toolbar">
        <div className="cartoon-toolbar-group">
          <Input
            allowClear
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            prefix={<SearchOutlined />}
            placeholder={keywordPlaceholder}
            style={{ width: 280 }}
          />
          <Select
            value={statusFilter}
            onChange={onStatusFilterChange}
            style={{ width: 150 }}
            prefix={<FilterOutlined />}
            options={statusOptions.map((item) => ({ value: item.value, label: item.label }))}
          />
        </div>

        <div className="cartoon-toolbar-group">
          <Segmented
            value={density}
            onChange={(value) => onDensityChange(value as 'small' | 'middle' | 'large')}
            options={[
              { label: '紧凑', value: 'small' },
              { label: '默认', value: 'middle' },
              { label: '宽松', value: 'large' },
            ]}
          />
          <Button icon={<DownloadOutlined />}>导出</Button>
        </div>
      </div>

      <Table<T>
        rowKey="key"
        columns={columns}
        dataSource={dataSource}
        size={density}
        bordered={bordered}
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
    <Space align="start">
      <Avatar style={{ background: '#ffd666', color: '#2f2a26', border: '2px solid #2f2a26', fontWeight: 900 }}>
        {avatar}
      </Avatar>
      <div>
        <div style={{ fontWeight: 900 }}>{product}</div>
        <Text type="secondary">
          {owner} · {region}
        </Text>
      </div>
    </Space>
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
