import './App.css'
import { Route, Routes } from 'react-router'
import HomePage from './pages/home/HomePage'
import ChatPage from './pages/chat/ChatPage'
import ClearCssPage from './pages/clearCss/ClearCssPage'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path='/chat/:channel' element={<ChatPage/>}/>
      <Route path='/css/clear' element={<ClearCssPage/>}/>
      <Route path='/*' element={<p>Not found</p>}/>
    </Routes>
  )
}

export default App
