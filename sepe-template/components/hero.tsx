import Link from 'next/link'

interface HeroProps {
  productName: string
  tagline: string
  ctaText: string
}

export default function Hero({ productName, tagline, ctaText }: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
        {productName}
      </h1>
      <p className="mt-4 text-xl text-gray-500 max-w-xl">{tagline}</p>
      <Link
        href="/feature"
        className="mt-8 inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors"
      >
        {ctaText}
      </Link>
    </section>
  )
}
