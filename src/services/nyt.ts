const API_KEY = import.meta.env.VITE_NYT_API_KEY
const API_BASE = import.meta.env.DEV ? '/api' : 'https://api.nytimes.com/svc'

// Архив NYT: /archive/v1/{year}/{month}.json
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
  const res = await fetch(`${API_BASE}/archive/v1/${year}/${month}.json?api-key=${API_KEY}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`NYT API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<{ response: { docs: ArchiveDoc[] } }>
}