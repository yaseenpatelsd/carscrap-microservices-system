import { useEffect } from 'react'

const BASE_TITLE = 'CarScrapy'
const BASE_URL = 'https://carscrapy.online'

interface SeoOptions {
  title: string
  description: string
  /** Path only, e.g. "/about". Used to build the canonical URL. */
  path?: string
  /** Absolute image URL. Defaults to the site OG image. */
  image?: string
  /** Set true for portal/app screens that should not be indexed. */
  noindex?: boolean
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Keeps the document title, meta description, Open Graph, Twitter and
 * canonical tags in sync with the current route. Social crawlers read the
 * static index.html, but updating these client-side keeps shared links and
 * in-app navigation accurate.
 */
export function useSeo({ title, description, path, image, noindex }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE
    const url = `${BASE_URL}${path ?? '/'}`
    const img = image ?? `${BASE_URL}/og-image.svg`

    document.title = fullTitle

    setMeta('meta[name="description"]', 'name', 'description', description)

    // Canonical
    setLink('canonical', url)

    // Robots — portal screens opt out of indexing.
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    )

    // Open Graph
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:image"]', 'property', 'og:image', img)

    // Twitter
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img)
  }, [title, description, path, image, noindex])
}
