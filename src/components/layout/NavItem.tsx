import { Link, useLocation } from 'react-router-dom'

interface NavItemProps {
  href: string
  label: string
}

export default function NavItem({
  href,
  label,
}: NavItemProps) {
  const location = useLocation()

  const isActive = location.pathname === href

  return (
    <Link
      to={href}
      className={`flex items-center px-3 py-2 rounded-lg text-xs transition-colors mb-1 ${
        isActive
          ? 'bg-primary-light/25 text-accent-purple font-medium'
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </Link>
  )
}