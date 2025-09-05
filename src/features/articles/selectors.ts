import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import dayjs from 'dayjs'
import type { ArchiveDoc } from '../../services/nyt'

export const selectGroups = createSelector(
  [(s: RootState) => s.articles.items],
  (items: ArchiveDoc[]) => {
    const byDay = new Map<string, ArchiveDoc[]>()

    for (const doc of items) {
      const day = doc.pub_date ? dayjs(doc.pub_date).format('YYYY-MM-DD') : 'unknown'
      if (!byDay.has(day)) byDay.set(day, [])
      byDay.get(day)!.push(doc)
    }

    const daysOrder = Array.from(byDay.keys())
      .filter(d => d !== 'unknown')
      .sort((a, b) => (a > b ? -1 : 1)) // новые выше
    if (byDay.has('unknown')) daysOrder.push('unknown')

    const groupCounts = daysOrder.map(d => byDay.get(d)!.length)
    const itemsFlat = daysOrder.flatMap(d => byDay.get(d)!)

    return { daysOrder, groupCounts, itemsFlat }
  }
)