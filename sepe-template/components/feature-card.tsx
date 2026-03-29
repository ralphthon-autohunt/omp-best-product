import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  )
}
