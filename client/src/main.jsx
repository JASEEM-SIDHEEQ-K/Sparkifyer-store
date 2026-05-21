
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "./index.css";
import { Provider } from 'react-redux'
import  {store}  from './app/store.js'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ToastContainer position="bottom-left" autoClose={1500} />
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
)
