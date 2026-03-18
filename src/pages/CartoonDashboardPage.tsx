import { useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Progress, Row, Space, Statistic, Tabs, Tag } from 'antd'
import type { TableColumnsType } from 'antd'
import {
  AppstoreOutlined,
  BarChartOutlined,
  EditOutlined,
  HeartOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { CartoonHero, CartoonPageShell, CartoonPanel, CartoonWindowDots } from '../components/cartoon/CartoonLayout'
import {
  DataTableSection,
  ProjectIdentityCell,
  ShowcaseCardGrid,
  StatusTag,
  WorkflowTemplate,
} from '../components/cartoon/CartoonTemplateBlocks'
import {
  heroActions,
  heroBadges,
  heroChips,
  projects,
  showcaseCards,
  workflowConfig,
  type ProjectRecord,
} from '../data/dashboard'

const currency = (value: number) => `¥ ${value.toLocaleString('zh-CN')}`

export function CartoonDashboardPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'全部' | ProjectRecord['status']>('全部')
  const [density, setDensity] = useState<'small' | 'middle' | 'large'>('middle')
  const [currentTab, setCurrentTab] = useState('components')

  const filteredData = useMemo(() => {
    return projects.filter((item) => {
      const matchKeyword =
        !keyword ||
        [item.product, item.owner, item.category, item.region]
          .join(' ')
          .toLowerCase()
          .includes(keyword.toLowerCase())
      const matchStatus = statusFilter === '全部' || item.status === statusFilter
      return matchKeyword && matchStatus
    })
  }, [keyword, statusFilter])

  const kpis = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0)
    const avgScore = filteredData.length
      ? Math.round(filteredData.reduce((sum, item) => sum + item.score, 0) / filteredData.length)
      : 0
    const activeProjects = filteredData.filter((item) => item.status === '进行中').length
    const completionRate = filteredData.length
      ? Math.round(filteredData.reduce((sum, item) => sum + item.progress, 0) / filteredData.length)
      : 0

    return [
      { label: '累计收入', value: currency(totalRevenue), extra: '当前筛选结果的收入汇总' },
      { label: '平均健康度', value: avgScore, extra: '用于快速判断项目状态' },
      { label: '进行中项目', value: activeProjects, extra: '仍在推进中的核心条目数量' },
      { label: '平均完成度', value: `${completionRate}%`, extra: '按 progress 字段计算' },
    ]
  }, [filteredData])

  const columns: TableColumnsType<ProjectRecord> = [
    {
      title: '产品 / 负责人',
      dataIndex: 'product',
      key: 'product',
      fixed: 'left',
      width: 260,
      sorter: (a, b) => a.product.localeCompare(b.product),
      render: (_, record) => (
        <ProjectIdentityCell
          avatar={record.avatar}
          product={record.product}
          owner={record.owner}
          region={record.region}
        />
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(projects.map((item) => item.category))).map((category) => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
      render: (value) => <Tag color="processing">{value}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: ['进行中', '已完成', '待排期'].map((status) => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
      render: (value: ProjectRecord['status']) => <StatusTag value={value} />,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => ['低', '中', '高'].indexOf(a.priority) - ['低', '中', '高'].indexOf(b.priority),
      render: (value: ProjectRecord['priority']) => {
        const color = value === '高' ? 'error' : value === '中' ? 'warning' : 'default'
        return <Tag color={color}>{value}</Tag>
      },
    },
    {
      title: '健康度',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      render: (value: number) => (
        <Space>
          <Progress percent={value} size="small" style={{ width: 110 }} strokeLinecap="round" />
          <span style={{ fontWeight: 700 }}>{value}</span>
        </Space>
      ),
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value: number) => currency(value),
    },
    {
      title: '任务数',
      dataIndex: 'tasks',
      key: 'tasks',
      sorter: (a, b) => a.tasks - b.tasks,
    },
    {
      title: '转化率',
      dataIndex: 'conversion',
      key: 'conversion',
      sorter: (a, b) => a.conversion - b.conversion,
      render: (value: number) => `${value}%`,
    },
    {
      title: '最后更新',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
    },
  ]

  const tabs = [
    {
      key: 'components',
      label: '通用组件',
      children: <ShowcaseCardGrid cards={showcaseCards} />,
    },
    {
      key: 'workflow',
      label: '业务面板',
      children: <WorkflowTemplate config={workflowConfig} />,
    },
  ]

  return (
    <CartoonPageShell>
      <CartoonHero
        badges={heroBadges.map((item, index) => ({
          ...item,
          icon: index === 0 ? <SmileOutlined /> : index === 1 ? <AppstoreOutlined /> : <BarChartOutlined />,
        }))}
        chips={heroChips}
        title="Ant Cartoon 页面模板库"
        description="这套页面已经收敛成模板层、数据层和主题层。后续新增页面时，优先替换模块配置、字段定义和业务数据，而不是重新组织视觉样式。"
        actions={
          <Space wrap>
            {heroActions.map((action) => (
              <Button
                key={action.key}
                type={action.type}
                size="large"
                icon={action.key === 'preview' ? <RocketOutlined /> : undefined}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        }
        preview={
          <Card bordered={false} styles={{ body: { padding: 18 } }}>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>模板复用率</span>
                <Tag color="magenta">Cartoon UI</Tag>
              </div>
              <Progress percent={84} status="active" />
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Statistic title="表格使用率" value={91} suffix="%" prefix={<TrophyOutlined />} />
                </Col>
                <Col span={12}>
                  <Statistic title="录入场景" value={28} prefix={<EditOutlined />} />
                </Col>
              </Row>
            </Space>
          </Card>
        }
      />

      <div className="cartoon-grid cartoon-grid-main">
        <CartoonPanel
          title="模板组件展示"
          subtitle="这里展示可复用的页面模板块，业务页面优先改数据和结构，不再重复写样式。"
          extra={<CartoonWindowDots />}
        >
          <Tabs activeKey={currentTab} onChange={setCurrentTab} items={tabs} />
        </CartoonPanel>

        <div className="cartoon-stack">
          <CartoonPanel title="使用建议" subtitle="这一列只保留高价值说明，避免页面信息过载。">
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <Alert
                showIcon
                type="warning"
                message="样式层"
                description="所有卡通风格收敛到公共 CSS 和 AntD theme，业务代码尽量不再添加零散视觉规则。"
              />
              <Card size="small" title="推荐保留的视觉特征">
                <Space wrap>
                  <Tag color="gold">大圆角</Tag>
                  <Tag color="cyan">糖果背景</Tag>
                  <Tag color="purple">深色描边</Tag>
                  <Tag color="green">轻信息密度</Tag>
                </Space>
              </Card>
              <Card size="small" title="适合继续扩展的页面">
                <Space wrap>
                  <Button icon={<ShoppingCartOutlined />}>商品列表</Button>
                  <Button icon={<TeamOutlined />}>成员管理</Button>
                  <Button icon={<HeartOutlined />}>活动运营</Button>
                </Space>
              </Card>
            </Space>
          </CartoonPanel>
        </div>
      </div>

      <DataTableSection<ProjectRecord>
        title="重点：数据表格模板"
        subtitle="当前表格已经是标准模板。后续页面只需要替换列定义、筛选项和数据源。"
        note="这个示例保留了搜索、筛选、分页、汇总、展开行和密度切换。建议后续页面沿用模板骨架，不要再单独拼一套表格样式。"
        keyword={keyword}
        onKeywordChange={setKeyword}
        keywordPlaceholder="搜索产品、负责人、分类或区域"
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => setStatusFilter(value as '全部' | ProjectRecord['status'])}
        statusOptions={[
          { value: '全部', label: '全部状态' },
          { value: '进行中', label: '进行中' },
          { value: '已完成', label: '已完成' },
          { value: '待排期', label: '待排期' },
        ]}
        density={density}
        onDensityChange={setDensity}
        kpis={kpis}
        columns={columns}
        dataSource={filteredData}
        expandedRowRender={(record) => (
          <div className="cartoon-expanded-panel">
            <span className="cartoon-expanded-title">项目说明</span>
            <span>{record.summary}</span>
            <Space wrap>
              <Tag color="cyan">负责人：{record.owner}</Tag>
              <Tag color="purple">区域：{record.region}</Tag>
              <Tag color="gold">最后更新：{record.updatedAt}</Tag>
            </Space>
          </div>
        )}
      />

      <div className="cartoon-footer-note">
        <strong>当前结构：</strong>
        页面入口负责挂载主题，页面模板负责组织模块，数据文件负责业务内容。这一层级已经适合继续扩展多页面模板。
      </div>
    </CartoonPageShell>
  )
}
