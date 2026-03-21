import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ContentHubDocs } from './pages/ContentHubDocs.tsx'
import { ContentHubHuongDan } from './pages/ContentHubHuongDan.tsx'
import { ComingSoon } from './pages/ComingSoon.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/contenthub/docs" element={<ContentHubDocs />} />
        <Route path="/contenthub/huong-dan-api" element={<ContentHubHuongDan />} />
        <Route path="/contenthub/huong-dan" element={<ComingSoon prefix="Content" suffix="Hub" />} />
        <Route path="/psi69/huong-dan" element={<ComingSoon prefix="Psi" suffix="69" />} />
        <Route path="/jobhub/huong-dan" element={<ComingSoon prefix="Job" suffix="Hub" />} />
        <Route path="/lifehub/huong-dan" element={<ComingSoon prefix="Life" suffix="Hub" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
