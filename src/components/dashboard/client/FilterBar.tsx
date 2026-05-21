import React from 'react'
import type { Period } from '../../../../server/types/period'

interface FilterBarProps {
  period: Period
  setPeriod: (period: Period) => void
}

const filters = [
  { label: 'Uge', value: 'week' },
  { label: 'Måned', value: 'month' },
  { label: 'Kvartal', value: 'quarter' },
  { label: 'År', value: 'year' },
]

export default function FilterBar({
  period,
  setPeriod,
}: FilterBarProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setPeriod(filter.value as Period)}
          className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
            period === filter.value
              ? 'bg-white text-gray-900 font-medium shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}