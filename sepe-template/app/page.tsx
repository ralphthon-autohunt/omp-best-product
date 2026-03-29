// BUILDER: Customize {{PRODUCT_NAME}}, {{TAGLINE}}, {{CTA_TEXT}} below
import Hero from '@/components/hero'

const PRODUCT_NAME = '{{PRODUCT_NAME}}'
const TAGLINE = '{{TAGLINE}}'
const CTA_TEXT = '{{CTA_TEXT}}'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero
        productName={PRODUCT_NAME}
        tagline={TAGLINE}
        ctaText={CTA_TEXT}
      />
    </main>
  )
}
