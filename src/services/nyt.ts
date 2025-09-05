const API_KEY = import.meta.env.VITE_NYT_API_KEY

function buildTargetUrl(path: string) {
  // Полный URL к NYT API (включая api-key)
  const url = `https://api.nytimes.com/svc${path}${path.includes('?') ? '&' : '?'}api-key=${API_KEY}`
  return url
}

async function fetchWithCors(path: string) {
  const target = buildTargetUrl(path)

  // В dev: идем через локальный Vite-прокси
  if (import.meta.env.DEV) {
    const res = await fetch(`/api${path}${path.includes('?') ? '&' : '?'}api-key=${API_KEY}`)
    if (!res.ok) throw new Error(`NYT API error ${res.status}`)
    return res.json()
  }

  // В prod (GitHub Pages): через AllOrigins
  const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`
  const res = await fetch(proxied)
  if (!res.ok) throw new Error(`NYT API (proxied) error ${res.status}`)
  return res.json()
}

// Типы как были
export type ArchiveDoc = {
  _id: string
  web_url: string
  headline: { main: string }
  byline?: { original?: string }
  abstract?: string
  pub_date?: string
  multimedia?: Array<{ url?: string; subtype?: string }>
}

// Архив: /archive/v1/{year}/{month}.json
export async function fetchArchive(year: number, month: number) {
  return fetchWithCors(`/archive/v1/${year}/${month}.json`) as Promise<{ response: { docs: ArchiveDoc[] } }>
}