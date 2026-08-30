import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './index.css'
import App from './App.tsx'
import { OthersProduct } from './pages/OthersProduct.tsx'
import { ContentHubDocs } from './pages/ContentHubDocs.tsx'
import { ContentHubHuongDan } from './pages/ContentHubHuongDan.tsx'
import { SitePreview } from './pages/SitePreview.tsx'
import { ComingSoon } from './pages/ComingSoon.tsx'
import { OpenClawSetup } from './pages/OpenClawSetup.tsx'
import { ScrollToTop } from './components/ScrollToTop.tsx'
import { RedirectToHome } from './components/RedirectToHome.tsx'
import { UniverseBackdrop } from './components/UniverseBackdrop.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ScrollToTop />
          <UniverseBackdrop />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/contenthub" element={<RedirectToHome />} />
            <Route path="/others-product" element={<OthersProduct />} />
            <Route path="/contenthub/docs" element={<ContentHubDocs />} />
            <Route path="/contenthub/huong-dan-api" element={<ContentHubHuongDan />} />
            <Route path="/psi69/huong-dan" element={<ComingSoon prefix="Psi" suffix="69" />} />
            <Route path="/jobhub/huong-dan" element={<ComingSoon prefix="Job" suffix="Hub" />} />
            <Route path="/lifehub/huong-dan" element={<ComingSoon prefix="Life" suffix="Hub" />} />
            <Route path="/contenthub/openclaw" element={<OpenClawSetup />} />
            <Route path="/preview" element={<SitePreview />} />
          </Routes>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
