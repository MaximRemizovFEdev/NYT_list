const API_KEY = import.meta.env.VITE_NYT_API_KEY
const PROXY_BASE = import.meta.env.VITE_PROXY_BASE || 'https://nyt-list-proxy.onrender.com'

function fullNyTimesUrl(path: string) {
  return `https://api.nytimes.com/svc${path}${path.includes('?') ? '&' : '?'}api-key=${API_KEY}`
}

async function fetchWithProxy(path: string) {
  if (import.meta.env.DEV) {
    const res = await fetch(`/api${path}${path.includes('?') ? '&' : '?'}api-key=${API_KEY}`)
    if (!res.ok) throw new Error(`NYT API error ${res.status}`)
    return res.json()
  }
  const target = fullNyTimesUrl(path)
  // ВАЖНО: добавляем /proxy/
  const url = `${PROXY_BASE}/proxy/${target}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Proxy error ${res.status}`)
  return res.json()
}

export type ArchiveDoc = {
  _id: string
  web_url: string
  headline: { main: string }
  byline?: { original?: string }
  abstract?: string
  pub_date?: string
  multimedia?: Array<{ url?: string; subtype?: string }>
}

export async function fetchArchive(year: number, month: number) {
  return fetchWithProxy(`/archive/v1/${year}/${month}.json`) as Promise<{ response: { docs: any[] } }>
}