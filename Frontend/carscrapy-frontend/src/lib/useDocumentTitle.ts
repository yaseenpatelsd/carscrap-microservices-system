import { useSeo } from '@/lib/useSeo'

/**
 * @deprecated Use {@link useSeo} instead — it manages the full set of SEO tags
 * (title, description, canonical, Open Graph, Twitter) in one place.
 *
 * Kept as a thin wrapper so existing imports keep working.
 */
export function useDocumentTitle(title?: string) {
  useSeo({
    title: title ?? 'CarScrapy',
    description:
      'CarScrapy — a vehicle scrap valuation and yard booking platform built on Spring Boot microservices.',
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
  })
}
