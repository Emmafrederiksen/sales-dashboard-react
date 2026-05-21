import React from 'react'

interface NavItemProps {
  href: string
  label: string
}

export default function NavItem({
  href,
  label,
}: NavItemProps) {

  return (

    <a
      href={href}
      className="flex items-center px-3 py-2 rounded-lg text-xs transition-colors mb-1 text-gray-400 hover:text-white hover:bg-white/10"
    >
      {label}
    </a>

  )
}