import { App as AntApp, ConfigProvider } from 'antd'
import { CartoonDashboardPage } from './pages/CartoonDashboardPage'
import { cartoonTheme } from './theme/cartoonTheme'

export default function App() {
  return (
    <ConfigProvider theme={cartoonTheme}>
      <AntApp>
        <CartoonDashboardPage />
      </AntApp>
    </ConfigProvider>
  )
}
