import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { OfflineBanner } from '@/components/OfflineBanner'
import { AuthProvider } from '@/lib/auth'
import { queryClient } from '@/lib/queryClient'
import { AppRouter } from '@/routes/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OfflineBanner />
          <AppRouter />
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            visibleToasts={4}
            duration={4000}
            toastOptions={{ className: 'rounded-xl' }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)