import { App as AntApp, ConfigProvider } from 'antd'
import { Zgpa2026Q3Page } from './pages/zgpa'
import { cartoonTheme } from './theme/cartoonTheme'

export default function App() {
  return (
    <ConfigProvider theme={cartoonTheme}>
      <AntApp>
        <Zgpa2026Q3Page />
      </AntApp>
    </ConfigProvider>
  )
}
