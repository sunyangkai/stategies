import { BookOutlined, LineChartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Layout, Row, Space, Statistic, Tag, Typography } from 'antd'
import { companyDatasets } from './data'
import { CompanyTemplatePage } from './pages/CompanyTemplatePage'

const { Header, Content } = Layout
const { Title, Paragraph, Text } = Typography

const REPORT_ROUTE = '/reports/601888'

function navigateTo(pathname: string) {
  if (window.location.pathname !== pathname) {
    window.history.pushState({}, '', pathname)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

function HomePage() {
  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div>
          <Title level={3} className="app-header-title">
            Strategies Workspace
          </Title>
          <Text className="app-header-subtitle">模版页面与估值工具都从这个入口继续扩展。</Text>
        </div>
      </Header>

      <Content className="app-content">
        <Space direction="vertical" size={24} style={{ display: 'flex' }}>
          <Card className="workspace-hero">
            <Space direction="vertical" size={16} style={{ display: 'flex' }}>
              <Tag color="blue">新建路由页</Tag>
              <Title level={2} style={{ margin: 0 }}>
                模版页已经接入计算器和财务表格
              </Title>
              <Paragraph className="muted-paragraph">
                当前这是一个实验模版；通过子路径里的股票代码决定展示哪家公司的财务数据。
              </Paragraph>
              <Space wrap>
                <Button type="primary" size="large" onClick={() => navigateTo(REPORT_ROUTE)}>
                  打开模版页
                </Button>
              </Space>
            </Space>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="metric-card">
                <Statistic title="路由地址" value={REPORT_ROUTE} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="metric-card">
                <Statistic title="页面类型" value="Report Template" prefix={<BookOutlined />} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="metric-card">
                <Statistic title="核心能力" value="Calculator + 三表 Tabs" prefix={<LineChartOutlined />} />
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  )
}

export default function App() {
  const pathname = window.location.pathname
  const reportPrefix = '/reports/'

  if (pathname.startsWith(reportPrefix)) {
    const secucode = decodeURIComponent(pathname.slice(reportPrefix.length)) || '601888'
    return <CompanyTemplatePage secucode={secucode} dataset={companyDatasets[secucode]} />
  }

  return <HomePage />
}
