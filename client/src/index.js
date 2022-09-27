import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'

document.title = 'SSl Cert for Free'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    <HashRouter>
      <App />
    </HashRouter>
  </>
)