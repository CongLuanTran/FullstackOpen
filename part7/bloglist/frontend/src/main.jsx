import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'

import App from './App'
import { AuthContextProvider } from './context/AuthContext'
import { NotificationContextProvider } from './context/NotificationContext'

import 'bootstrap/dist/css/bootstrap.min.css'

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
