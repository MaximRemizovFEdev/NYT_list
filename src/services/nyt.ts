const API_KEY = import.meta.env.VITE_NYT_API_KEY

export type ArchiveDoc = {
  _id: string
  web_url: string
  headline: { main: string }
  byline?: { original?: string }
  abstract?: string
  pub_date?: string
}

export async function fetchArchive(year: number, month: number) {
  const res = await fetch(`/api/archive/v1/${year}/${month}.json?api-key=${API_KEY}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`NYT API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<{ response: { docs: ArchiveDoc[] } }>
}