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
      title: '为什么重要',
      dataIndex: 'whyImportant',
      key: 'whyImportant',
      width: 220,
      render: (value: string) => <Text className="tracking-item-text">{value}</Text>,
    },
    {
      title: '看什么口径 / 怎么判断',
      dataIndex: 'evaluationMethod',
      key: 'evaluationMethod',
      width: 260,
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
        className="detail-expand-table"
        columns={columns}
        dataSource={trackingItems.items}
        pagination={false}
        size="small"
        scroll={{ x: 1030 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="table-expanded-detail-stack">
              <div className="table-expanded-detail">
                <Text strong className="table-expanded-detail-label">
                  为什么重要
                </Text>
                <Text className="tracking-item-text">{record.whyImportant}</Text>
              </div>
              <div className="table-expanded-detail">
                <Text strong className="table-expanded-detail-label">
                  看什么口径 / 怎么判断
                </Text>
                <Text className="tracking-item-text">{record.evaluationMethod}</Text>
              </div>
            </div>
          ),
          expandedRowKeys: trackingItems.items.map((item) => `${item.rank}-${item.target}`),
          showExpandColumn: false,
        }}
      />
    </Card>
  )
}
