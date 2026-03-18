import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const cartoonTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#ff8a45',
    colorInfo: '#40a9ff',
    colorSuccess: '#73d13d',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorBgLayout: '#fffaf0',
    colorBgContainer: '#ffffff',
    colorBorder: '#2f2a26',
    colorText: '#2f2a26',
    borderRadius: 22,
    wireframe: false,
    fontSize: 14,
    boxShadow: '0 10px 22px rgba(47,42,38,.12)',
  },
  components: {
    Button: {
      borderRadius: 18,
      primaryShadow: '0 4px 0 rgba(47,42,38,.9)',
      defaultShadow: '0 4px 0 rgba(47,42,38,.9)',
      contentFontSize: 14,
    },
    Card: { borderRadiusLG: 24, headerBg: '#fffef6' },
    Table: {
      borderColor: '#2f2a26',
      headerBg: '#fff1b8',
      rowHoverBg: '#fffbe6',
      headerSplitColor: 'rgba(47,42,38,.25)',
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
    },
    Tabs: {
      itemActiveColor: '#2f2a26',
      itemSelectedColor: '#2f2a26',
      inkBarColor: '#2f2a26',
    },
    Input: { activeBorderColor: '#2f2a26', hoverBorderColor: '#2f2a26' },
    Select: { activeBorderColor: '#2f2a26', hoverBorderColor: '#2f2a26' },
    Pagination: { itemActiveBg: '#ffd666' },
    Progress: { defaultColor: '#ff8a45', remainingColor: '#fff1b8' },
    Tag: { defaultBg: '#fff' },
    Segmented: { trackBg: '#fff8e7', itemSelectedBg: '#ffe7a3' },
  },
}
