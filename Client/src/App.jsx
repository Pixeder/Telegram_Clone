import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer , Header } from './components/index'

const App = () => {
  return (
    <div>
      <header>
        <Header/>
      </header>
      <main>
        <Outlet/>
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  )
}

export default App