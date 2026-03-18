import type { ShowcaseCardConfig, WorkflowSectionConfig } from '../components/cartoon/CartoonTemplateBlocks'

export type ProjectStatus = '进行中' | '已完成' | '待排期'
export type ProjectPriority = '高' | '中' | '低'

export type ProjectRecord = {
  key: string
  product: string
  owner: string
  avatar: string
  category: string
  status: ProjectStatus
  priority: ProjectPriority
  region: string
  score: number
  revenue: number
  growth: number
  conversion: number
  updatedAt: string
  tasks: number
  progress: number
  summary: string
}

export const heroBadges = [
  { key: 'visual', label: '卡通视觉' },
  { key: 'modules', label: '模板复用' },
  { key: 'table', label: '数据看板' },
]

export const heroChips = [
  { key: 'radius', label: '大圆角', background: '#fff1b8' },
  { key: 'border', label: '厚描边', background: '#ffd6e7' },
  { key: 'shadow', label: '强投影', background: '#bae0ff' },
]

export const heroActions = [
  { key: 'preview', label: '查看模板', type: 'primary' as const },
  { key: 'guide', label: '设计说明', type: 'default' as const },
]

export const showcaseCards: ShowcaseCardConfig[] = [
  {
    key: 'form',
    kind: 'form',
    title: '表单录入',
    pill: '录入',
    searchPlaceholder: '搜索组件或业务对象',
    selectDefault: '卡通主题',
    selectOptions: [
      { value: '卡通主题', label: '卡通主题' },
      { value: '插画主题', label: '插画主题' },
      { value: '清新主题', label: '清新主题' },
    ],
  },
  {
    key: 'stats',
    kind: 'stats',
    title: '数据反馈',
    pill: '分析',
    primaryStat: { title: '本周新增', value: 128 },
    secondaryStat: { title: '转化提升', value: 18.6, suffix: '%' },
    progress: 76,
  },
  {
    key: 'alerts',
    kind: 'alerts',
    title: '提醒与说明',
    pill: '规范',
    alerts: [
      {
        key: 'style',
        type: 'info',
        title: '样式策略',
        description: '视觉统一收敛在公共 CSS 与 Ant Design Theme，业务页面不再单独维护零散样式。',
      },
      {
        key: 'template',
        type: 'success',
        title: '模板策略',
        description: '后续页面优先复用 Hero、Panel、KPI 与 Table 模板块，只替换文案、字段和数据源。',
      },
    ],
  },
]

export const workflowConfig: WorkflowSectionConfig = {
  segmentedOptions: ['需求池', '开发中', '已发布'],
  listItems: [
    '统一组件边框、阴影和圆角语言',
    '优先复用 Hero、Panel、KPI、Table 四类模板块',
    '业务页面尽量只维护数据源、字段定义和模块顺序',
  ],
  collapseItems: [
    {
      key: '1',
      label: '怎么复用这套页面',
      children: '页面层主要负责拼模板和接数据，视觉细节由公共主题和通用样式兜底。',
    },
    {
      key: '2',
      label: '为什么这么拆',
      children: '这样做可以降低页面维护成本，让后续扩展更接近“换模板 + 换数据”，而不是重新写一页。',
    },
  ],
}

export const projects: ProjectRecord[] = [
  {
    key: '1',
    product: '云朵记事本',
    owner: 'Mika',
    avatar: 'M',
    category: '效率',
    status: '进行中',
    priority: '高',
    region: '华东',
    score: 92,
    revenue: 189000,
    growth: 23,
    conversion: 7.1,
    updatedAt: '2026-03-16',
    tasks: 34,
    progress: 78,
    summary: '支持富文本、标签管理和多端同步，近期重点优化编辑器性能。',
  },
  {
    key: '2',
    product: '气泡商城',
    owner: 'Ari',
    avatar: 'A',
    category: '零售',
    status: '已完成',
    priority: '中',
    region: '华南',
    score: 88,
    revenue: 265000,
    growth: 14,
    conversion: 8.2,
    updatedAt: '2026-03-15',
    tasks: 18,
    progress: 100,
    summary: '大促版本已上线，订单转化率在最近两周保持稳定。',
  },
  {
    key: '3',
    product: '像素伙伴',
    owner: 'Juno',
    avatar: 'J',
    category: '社交',
    status: '待排期',
    priority: '低',
    region: '华北',
    score: 75,
    revenue: 98000,
    growth: -3,
    conversion: 4.9,
    updatedAt: '2026-03-12',
    tasks: 9,
    progress: 36,
    summary: '等待活动规则确认，互动功能原型已评审通过。',
  },
  {
    key: '4',
    product: '星球工单台',
    owner: 'Luca',
    avatar: 'L',
    category: '企业服务',
    status: '进行中',
    priority: '高',
    region: '西南',
    score: 95,
    revenue: 312000,
    growth: 31,
    conversion: 9.4,
    updatedAt: '2026-03-17',
    tasks: 41,
    progress: 84,
    summary: '工单 SLA 监控已接入，下一步完善权限体系与报表导出。',
  },
  {
    key: '5',
    product: '软糖课堂',
    owner: 'Nina',
    avatar: 'N',
    category: '教育',
    status: '进行中',
    priority: '中',
    region: '华中',
    score: 81,
    revenue: 154000,
    growth: 17,
    conversion: 6.4,
    updatedAt: '2026-03-14',
    tasks: 22,
    progress: 62,
    summary: '课程推荐模型已上线 A/B 测试，留存表现仍需继续观察。',
  },
  {
    key: '6',
    product: '果冻日历',
    owner: 'Owen',
    avatar: 'O',
    category: '效率',
    status: '已完成',
    priority: '低',
    region: '华东',
    score: 86,
    revenue: 122000,
    growth: 11,
    conversion: 5.8,
    updatedAt: '2026-03-11',
    tasks: 12,
    progress: 100,
    summary: '共享排期和节日模板已经落地，自定义提醒体验表现稳定。',
  },
]
