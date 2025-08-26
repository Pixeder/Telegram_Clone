import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import {  AuthLayout , CreateGroupPopup } from './components/index.js'
import { LoginPage , HomePage , SignUpPage} from './pages/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/',
        element: <AuthLayout >
          <HomePage/>
        </AuthLayout>
      },
      {
        path: '/register',
        element: <AuthLayout authentication={false}>
          <SignUpPage/>
        </AuthLayout>
      },
      {
        path: '/login',
        element: <AuthLayout authentication={false}>
          <LoginPage/>
        </AuthLayout>
      },
      {
        path: '/createGroup',
        element: <AuthLayout>
          <CreateGroupPopup />
        </AuthLayout>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
