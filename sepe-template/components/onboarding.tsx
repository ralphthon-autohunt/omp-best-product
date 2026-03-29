'use client'

import { useEffect, useState } from 'react'
import { store } from '@/lib/store'

const ONBOARDING_KEY = 'sepe_onboarding_seen'

export default function Onboarding() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = store.get(ONBOARDING_KEY)
    if (!seen) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    store.set(ONBOARDING_KEY, true)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900">Welcome!</h2>
        <p className="mt-2 text-gray-500 text-sm">
          Get started by exploring the core feature below.
        </p>
        <button
          onClick={dismiss}
          className="mt-6 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get started
        </button>
      </div>
    </div>
  )
}
