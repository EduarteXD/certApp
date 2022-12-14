import React from 'react'
import io from 'socket.io-client'
import MainPage from './pages/main/MainPage'
import IssuePage from './pages/issue/IssuePage'
import ErrorPage from './pages/error/ErrorPage'
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom"
import { AnimatePresence } from 'framer-motion'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const App = () => {
  const [ws, setWs] = React.useState(null)
  const [ready, setReady] = React.useState(false)
  const [domain, setDomain] = React.useState('')

  const location = useLocation()

  React.useEffect(() => {
    const initWs = () => {
      ws.on('msg', () => {
        setReady(true)
      })
    }

    if (!ws) {
      setWs(io(process.env.NODE_ENV === 'development' ? 'wss://ssl4free.tk' : '/'))
    } else {
      initWs()
    }
  }, [ws])

  const handleNext = (domain) => {
    if (ready) {
      setDomain(domain)
      window.location.hash = '/issue/'
    } else {
      alert('please wait for the ws connection to establish...')
    }
  }

  return (
    <div className='App'>
      <AnimatePresence mode='wait'>
        <Routes key={location.pathname} location={location}>
          <Route path='/'
            element={
              <MainPage
                ws={ws}
                moveon={handleNext}
                ready={ready}
              />
            }
          />
          <Route path='/issue/'
            element={
              <IssuePage
                ws={ws}
                domain={domain}
              />
            }
          />
          <Route path='*' 
            element={<ErrorPage />}
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
