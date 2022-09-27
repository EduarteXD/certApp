import MainPage from './pages/main/MainPage'
import React from 'react'
import io from 'socket.io-client'
import DetailPage from './pages/detail/DetailPage'

function App() {
  const [ws, setWs] = React.useState(null)
  const [page, setPage] = React.useState(0)
  const [domain, setDomain] = React.useState('')

  React.useEffect(() => {
    const initWs = () => {
      ws.on('msg', msg => {
        console.log(msg)
      })
    }

    if (!ws) {
      setWs(io(process.env.NODE_ENV === 'development' ? 'wss://ssl4free.tk' : '/'))
    } else {
      initWs()
    }
  }, [ws])

  const handleNext = (domain) => {
    setDomain(domain)
    setPage(1)
    // console.log(domain)
  }

  // const handleSubmit = (data) => {

  // }

  return (
    <div className='App'>
      {
        page === 0 &&
        <MainPage
          ws={ws}
          moveon={handleNext}
        />
      }
      {
        page === 1 &&
        <DetailPage
          ws={ws}
          // moveon={handleSubmit}
          domain={domain}
        />
      }
    </div>
  )
}

export default App
