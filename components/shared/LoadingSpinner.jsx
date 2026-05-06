import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">Loading amazing livestock...</p>
    </div>
  )
}
