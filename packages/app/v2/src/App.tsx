import { Route, Routes } from "react-router";
import "./App.css";
import IndexPage from "./pages/Index";
import NotFoundPage from "./pages/NotFound";
import ChatPage from "./pages/Chat";
import StorageSync from "./components/internal/StorageSync";
import PreviewPage from "./pages/Preview";

function App() {
  return (
    <>
      <StorageSync/>
      <Routes>
        <Route index element={<IndexPage/>}/>
        <Route path='/chat/:channelName' element={<ChatPage/>}/>
        <Route path='/preview' element={<PreviewPage/>}/>
        <Route path='/*' element={<NotFoundPage/>}/>
      </Routes>
    </>
  );
}

export default App;
