import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Layout,
  List,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography

const tableData = [
  { key: '1', name: '招商平安', stage: '跟踪中', owner: '研究组', updatedAt: '2026-03-27' },
  { key: '2', name: '短期策略', stage: '已归档', owner: '投研平台', updatedAt: '2026-03-25' },
  { key: '3', name: '行业观察', stage: '待整理', owner: '策略团队', updatedAt: '2026-03-21' },
]

const tableColumns = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  {
    title: '状态',
    dataIndex: 'stage',
    key: 'stage',
    render: (value: string) => {
      const color = value === '跟踪中' ? 'processing' : value === '已归档' ? 'default' : 'warning'
      return <Tag color={color}>{value}</Tag>
    },
  },
  { title: '负责人', dataIndex: 'owner', key: 'owner' },
  { title: '最近更新', dataIndex: 'updatedAt', key: 'updatedAt' },
]

export default function App() {
  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div>
          <Title level={3} style={{ margin: 0, color: '#fff' }}>
            Strategies Workspace
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.72)' }}>
            已移除路由页面、主题皮肤和自定义组件，当前为标准 antd 工作台。
          </Text>
        </div>
      </Header>

      <Content className="app-content">
        <Space direction="vertical" size={24} style={{ display: 'flex' }}>
          <Alert
            type="info"
            showIcon
            message="项目已完成结构收敛"
            description="当前入口只保留 antd 标准组件，适合作为后续重建页面结构的起点。"
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="保留入口" value="1 个" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="已删除页面目录" value="src/pages" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="UI 基线" value="Ant Design" />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={14}>
              <Card
                title="当前工作区"
                extra={<Button type="primary">新建模块</Button>}
              >
                <Paragraph>
                  这个页面只使用 <Text code>antd</Text> 官方组件搭建，没有保留任何业务路由、主题 token
                  覆盖或自定义卡通组件。
                </Paragraph>
                <Table
                  columns={tableColumns}
                  dataSource={tableData}
                  pagination={false}
                  size="middle"
                />
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card title="后续建议">
                <List
                  dataSource={[
                    '按业务重新定义目录结构。',
                    '需要页面时再逐步引入路由。',
                    '优先复用 antd 原生布局和表单体系。',
                  ]}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
                <Divider />
                <Space>
                  <Button>查看文档</Button>
                  <Button type="default">初始化页面</Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  )
}
