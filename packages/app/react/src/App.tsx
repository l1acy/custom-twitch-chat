import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import HomePage from './pages/home/HomePage'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='/chat/:channel' element={<p>Чат</p>}/>
      <Route path='/css/clear' element={<p>Очистка CSS</p>}/>
      <Route path='/*' element={<p>Не найдено</p>}/>
    </Routes>
  )
}

export default App
