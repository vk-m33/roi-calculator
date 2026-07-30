import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EmbedPage from './pages/EmbedPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_ROUTER_BASENAME || '/'}>
      <Routes>
        <Route path="/" element={
          <ThemeProvider>
            <LandingPage />
          </ThemeProvider>
        } />
        <Route path="/app" element={
          <ThemeProvider>
            <App />
          </ThemeProvider>
        } />
        <Route path="/embed" element={<EmbedPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
