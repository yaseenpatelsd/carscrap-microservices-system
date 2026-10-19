import { lazy } from 'react'
import type { ComponentType } from 'react'

/**
 * Wraps React.lazy with a one-shot retry.
 *
 * After a redeploy, a browser tab holding an old build can request a chunk
 * that no longer exists, which surfaces as "Failed to fetch dynamically
 * imported module". Reloading once fetches the fresh HTML + chunk map, so we
 * do that automatically instead of showing a raw error to the user.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  key: string,
) {
  return lazy(async () => {
    const RELOAD_KEY = `carscrapy.chunk-reload:${key}`
    try {
      const mod = await factory()
      // Success — clear the guard so a future deploy can reload again.
      try {
        sessionStorage.removeItem(RELOAD_KEY)
      } catch {
        /* storage unavailable; ignore */
      }
      return mod
    } catch (error) {
      let alreadyRetried = false
      try {
        alreadyRetried = sessionStorage.getItem(RELOAD_KEY) === '1'
      } catch {
        /* storage unavailable; treat as first attempt */
      }
      if (!alreadyRetried) {
        try {
          sessionStorage.setItem(RELOAD_KEY, '1')
        } catch {
          /* ignore */
        }
        // Force a clean reload to pick up the new build's asset manifest.
        window.location.reload()
        // Return a never-resolving import so React keeps the fallback visible
        // until the reload takes over.
        return await new Promise<{ default: T }>(() => {})
      }
      throw error
    }
  })
}
