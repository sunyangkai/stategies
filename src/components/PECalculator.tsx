import { useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputNumber, Modal, Row, Space, Statistic, Typography } from 'antd'
import { calcPE } from '../lib/calcPE'

const { Paragraph, Text } = Typography

type FormValues = {
  np0: number
  g1: number
  g2: number
  g3: number
  capex1: number
  capex2: number
  capex3: number
  da1: number
  da2: number
  da3: number
  rf: number
  erp: number
  M: number
  gMax: number
  theta: number
}

const initialValues: FormValues = {
  np0: 51.55,
  g1: 0.08,
  g2: 0.06,
  g3: 0.05,
  capex1: 0,
  capex2: 0,
  capex3: 0,
  da1: 0,
  da2: 0,
  da3: 0,
  rf: 0.0179,
  erp: 0.055,
  M: 4,
  gMax: 0.04,
  theta: 0.9,
}

function formatPercent(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--'
  }

  return `${(value * 100).toFixed(2)}%`
}

export function PECalculator() {
  const [form] = Form.useForm<FormValues>()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const calculation = useMemo(() => {
    try {
      return {
        error: null,
        result: calcPE({
          np0: values.np0,
          g: [values.g1, values.g2, values.g3],
          capex: [values.capex1, values.capex2, values.capex3],
          da: [values.da1, values.da2, values.da3],
          rf: values.rf,
          erp: values.erp,
          M: values.M,
          gMax: values.gMax,
          theta: values.theta,
        }),
      }
    } catch (currentError) {
      return {
        error: currentError instanceof Error ? currentError.message : '计算失败',
        result: null,
      }
    }
  }, [values])

  const discountRate = values.rf + values.erp
  const terminalGrowth = (values.gMax * (0.35 * values.M)) / (1 + 0.35 * values.M)

  return (
    <Card className="report-card calculator-card" title="PE 计算器" extra={<Text type="secondary">复用 server/index.js 同源公式</Text>}>
      <Space direction="vertical" size={20} style={{ display: 'flex' }}>
        <Paragraph className="muted-paragraph">
          默认只展示核心结果和前三年利润增速。详细参数在“查看详情”里展开。
        </Paragraph>

        {calculation.error ? <Alert showIcon type="error" message={calculation.error} /> : null}

        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Card size="small">
              <Statistic title="计算结果" value={calculation.result ?? 0} precision={2} suffix="x" />
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card size="small">
              <Statistic
                title="前三年利润增速"
                value={`${formatPercent(values.g1)} / ${formatPercent(values.g2)} / ${formatPercent(values.g3)}`}
              />
            </Card>
          </Col>
        </Row>

        <Space>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            查看详情
          </Button>
          <Button onClick={() => form.resetFields()}>恢复默认参数</Button>
        </Space>

        <Modal
          title="PE 详细配置"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => setIsModalOpen(false)}
          width={920}
          okText="完成"
          cancelText="关闭"
        >
          <Space direction="vertical" size={20} style={{ display: 'flex' }}>
            <Form<FormValues>
              form={form}
              layout="vertical"
              initialValues={initialValues}
              onValuesChange={(_, allValues) => setValues(allValues)}
            >
              <Row gutter={[16, 8]}>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item label="当前净利润 np0" name="np0">
                    <InputNumber style={{ width: '100%' }} min={0.01} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} xl={6}>
                  <Form.Item label="第一年增速 g1" name="g1">
                    <InputNumber style={{ width: '100%' }} min={-0.5} max={1} step={0.01} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} xl={6}>
                  <Form.Item label="第二年增速 g2" name="g2">
                    <InputNumber style={{ width: '100%' }} min={-0.5} max={1} step={0.01} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} xl={6}>
                  <Form.Item label="第三年增速 g3" name="g3">
                    <InputNumber style={{ width: '100%' }} min={-0.5} max={1} step={0.01} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 8]}>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item label="无风险利率 rf" name="rf">
                    <InputNumber style={{ width: '100%' }} min={0.001} max={0.2} step={0.001} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item label="股权风险溢价 ERP" name="erp">
                    <InputNumber style={{ width: '100%' }} min={0.001} max={0.2} step={0.001} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item label="乘数 M" name="M">
                    <InputNumber style={{ width: '100%' }} min={0.1} max={10} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item label="终局增长锚 gMax" name="gMax">
                    <InputNumber style={{ width: '100%' }} min={0.001} max={0.1} step={0.001} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 8]}>
                <Col xs={24} md={12} xl={6}>
                  <Form.Item label="兑现折价 theta" name="theta">
                    <InputNumber style={{ width: '100%' }} min={0.1} max={1.2} step={0.01} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} xl={6}>
                  <Form.Item label="第一年 CAPEX" name="capex1">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} xl={6}>
                  <Form.Item label="第二年 CAPEX" name="capex2">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8} xl={6}>
                  <Form.Item label="第三年 CAPEX" name="capex3">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 8]}>
                <Col xs={24} md={8}>
                  <Form.Item label="第一年折旧摊销 DA" name="da1">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="第二年折旧摊销 DA" name="da2">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="第三年折旧摊销 DA" name="da3">
                    <InputNumber style={{ width: '100%' }} step={0.1} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small">
                  <Statistic title="贴现率 R" value={discountRate * 100} precision={2} suffix="%" />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <Statistic title="终局增长 gT" value={terminalGrowth * 100} precision={2} suffix="%" />
                </Card>
              </Col>
            </Row>
          </Space>
        </Modal>

        <Alert
          type="info"
          showIcon
          message="当前计算口径"
          description={`三年显式期后，模型会基于 g3 与 gT 的差额做 4-6 年桥接；当前参数下，R=${formatPercent(discountRate)}，gT=${formatPercent(terminalGrowth)}。`}
        />
      </Space>
    </Card>
  )
}
