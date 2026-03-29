import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'state', 'local-ports.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)

    // Enrich each service with product state (verdict, pmf_score, product_name)
    const productsDir = path.join(process.cwd(), '..', 'state', 'products')
    for (const [productId, service] of Object.entries(data.services ?? {})) {
      try {
        const productFile = path.join(productsDir, `${productId}.json`)
        const productRaw = fs.readFileSync(productFile, 'utf-8')
        const product = JSON.parse(productRaw)
        const svc = service as Record<string, unknown>
        svc.verdict = product.status === 'GRADUATE' || product.status === 'ITERATE' || product.status === 'KILL'
          ? product.status
          : product.validation?.verdict ?? null
        svc.pmf_score = product.validation?.pmf_score ?? null
        svc.product_name = svc.product_name || product.idea?.product_name || product.spec?.product_name || null
      } catch {
        // Product file not found — leave fields empty
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      {
        base_port: 20000,
        max_port: 21000,
        services: {},
        error: 'state/local-ports.json not found',
      },
      { status: 503 }
    )
  }
}
