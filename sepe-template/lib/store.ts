export const store = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
  },
  set: (key: string, value: unknown) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
}
