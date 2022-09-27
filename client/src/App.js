import MainPage from './pages/main/MainPage'
import React from 'react'
import io from 'socket.io-client'
import DetailPage from './pages/detail/DetailPage'
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom"
import { AnimatePresence } from 'framer-motion'

function App() {
  const [ws, setWs] = React.useState(null)
  // const [page, setPage] = React.useState(0)
  const [ready, setReady] = React.useState(false)
  const [domain, setDomain] = React.useState('')

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
    // setPage(1)
    // console.log(domain)
  }

  const router = createHashRouter([
    {
      path: '/',
      element:
        <MainPage
          ws={ws}
          moveon={handleNext}
        />
    },
    {
      path: '/issue/',
      element:
        <DetailPage
          ws={ws}
          domain={domain}
        />
    }
  ])

  return (
    <div className='App'>
      <AnimatePresence>
        <RouterProvider router={router} />
      </AnimatePresence>
    </div>
  )
}

export default App
