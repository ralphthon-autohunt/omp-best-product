import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const logPath = path.join(process.cwd(), '..', 'DISCOVERY_LOG.md')
    const content = fs.readFileSync(logPath, 'utf-8')

    // Also try to get product_name from state/products/{id}.json
    let productName = ''
    try {
      const productPath = path.join(process.cwd(), '..', 'state', 'products', `${params.id}.json`)
      const productRaw = fs.readFileSync(productPath, 'utf-8')
      const product = JSON.parse(productRaw)
      productName = product.idea?.product_name || product.spec?.product_name || ''
    } catch {
      // Product file not found
    }

    // Split by cycle sections (## Cycle #N: ...)
    const sections = content.split(/(?=^## Cycle #)/m)

    // Find sections matching product_id or product_name
    const matches = sections.filter(section => {
      if (section.includes(params.id)) return true
      if (productName && section.includes(productName)) return true
      return false
    })

    if (matches.length === 0) {
      return NextResponse.json({
        product_id: params.id,
        product_name: productName,
        found: false,
        sections: [],
      })
    }

    // Parse each matching section into structured data
    const parsed = matches.map(section => {
      const lines = section.split('\n')
      const titleMatch = lines[0]?.match(/^## Cycle #([\d~]+):\s*(.+?)\s*—\s*(.+)$/)

      const getBlock = (heading: string): string[] => {
        const idx = lines.findIndex(l => l.includes(heading))
        if (idx === -1) return []
        const block: string[] = []
        for (let i = idx + 1; i < lines.length; i++) {
          if (lines[i].startsWith('### ') || lines[i].startsWith('## ')) break
          if (lines[i].trim()) block.push(lines[i].trim())
        }
        return block
      }

      return {
        cycle: titleMatch ? titleMatch[1] : null,
        product_name: titleMatch?.[2]?.trim() ?? productName,
        verdict: titleMatch?.[3]?.trim() ?? null,
        raw_markdown: section.trim(),
        idea_section: getBlock('아이디어 발굴'),
        build_section: getBlock('빌드'),
        pmf_section: getBlock('PMF 검증'),
        persona_section: getBlock('페르소나 하이라이트'),
        iterate_section: getBlock('ITERATE 이력'),
        market_section: getBlock('시장 확장'),
        kill_reason: getBlock('KILL 이유'),
        structural_lesson: getBlock('구조적 교훈'),
      }
    })

    return NextResponse.json({
      product_id: params.id,
      product_name: productName,
      found: true,
      sections: parsed,
    })
  } catch {
    return NextResponse.json(
      {
        product_id: params.id,
        found: false,
        sections: [],
        error: 'DISCOVERY_LOG.md not found',
      },
      { status: 404 }
    )
  }
}
