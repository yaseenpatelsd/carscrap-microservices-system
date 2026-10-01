import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/**
 * Full-width banner shown when the browser reports it is offline.
 * Purely cosmetic feedback — React Query refetches on reconnect.
 */
export function OfflineBanner() {
  const [offline, setOffline] = useState(() => !navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-amber-950"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      You are offline. Changes may not save until your connection returns.
    </div>
  )
}