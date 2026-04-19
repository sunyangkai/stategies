import { Card, Empty, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TrackingItem, TrackingItems } from '../data'

const { Text } = Typography

type TrackingItemsCardProps = {
  trackingItems?: TrackingItems
}

export function TrackingItemsCard({ trackingItems }: TrackingItemsCardProps) {
  if (!trackingItems) {
    return (
      <Card className="report-card" title="跟踪项">
        <Empty description="暂无跟踪项数据" />
      </Card>
    )
  }

  const columns: ColumnsType<TrackingItem> = [
    {
      title: '重要顺序',
      dataIndex: 'rank',
      key: 'rank',
      width: 110,
      fixed: 'left',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '跟踪什么',
      dataIndex: 'target',
      key: 'target',
      width: 220,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: '为什么最重要',
      dataIndex: 'whyImportant',
      key: 'whyImportant',
      width: 320,
      render: (value: string) => <Text className="tracking-item-text">{value}</Text>,
    },
    {
      title: '看什么口径 / 怎么判断',
      dataIndex: 'evaluationMethod',
      key: 'evaluationMethod',
      width: 420,
      render: (value: string) => <Text className="tracking-item-text">{value}</Text>,
    },
    {
      title: '数据源与频率',
      dataIndex: 'dataSource',
      key: 'dataSource',
      width: 220,
      render: (value: string) => <Text className="tracking-item-text">{value}</Text>,
    },
  ]

  return (
    <Card className="report-card" title={trackingItems.title}>
      <Table<TrackingItem>
        rowKey={(record) => `${record.rank}-${record.target}`}
        columns={columns}
        dataSource={trackingItems.items}
        pagination={false}
        size="small"
        scroll={{ x: 1290 }}
      />
    </Card>
  )
}
