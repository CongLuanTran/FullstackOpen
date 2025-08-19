import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import { NotificationContextProvider } from './context/NotificationContext'
import { AuthContextProvider } from './context/AuthContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>
)
