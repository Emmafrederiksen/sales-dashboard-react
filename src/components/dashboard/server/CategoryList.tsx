import React from 'react'

import type { Category }
from '../../../../server/types/category'

interface CategoryListProps {
  categories: Category[]
}

const categoryColors: Record<string, string> = {
  'Jakker & frakker': 'bg-primary-light',
  'Bukser & jeans': 'bg-kpi-green',
  'Toppe & bluser': 'bg-kpi-amber',
  'Sko & støvler': 'bg-kpi-blue',
  'Accessories': 'bg-kpi-purple',
}

export default function CategoryList({
  categories,
}: CategoryListProps) {

  return (

    <div className="bg-white rounded-xl border border-gray-100 p-4 h-full">

      {/* Header */}
      <div className="mb-4">

        <h2 className="text-card-title text-gray-900">
          Salg per kategori
        </h2>

        <p className="text-xs text-gray-400 mt-0.5">
          Andel af total omsætning
        </p>

      </div>

      {/* Categories */}
      <div className="space-y-3">

        {categories.map((cat) => (

          <div key={cat.name}>

            <div className="flex justify-between text-xs mb-1">

              <span className="text-gray-600">
                {cat.name}
              </span>

              <span className="font-medium text-gray-900">
                {cat.percentage}%
              </span>

            </div>

            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">

              <div
                className={`h-full rounded-full ${
                  categoryColors[cat.name] || 'bg-gray-400'
                }`}
                style={{
                  width: `${cat.percentage}%`
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}