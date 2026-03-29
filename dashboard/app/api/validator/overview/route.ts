import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import type { ValidatorStatus, ValidatorStepDetail, ValidatorOverview } from '@/lib/validator-types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseDir = path.join(process.cwd(), '..', 'state', 'validator-v2')

  // Read status
  let status: ValidatorStatus
  try {
    const raw = fs.readFileSync(path.join(baseDir, 'status.json'), 'utf-8')
    status = JSON.parse(raw)
  } catch {
    return NextResponse.json(
      {
        current_step: 0,
        total_steps: 4,
        status: 'waiting',
        products: [],
        matrix: {},
        verdicts: {},
        steps_meta: [],
        pmf_definitions: undefined,
      } satisfies ValidatorOverview,
      { status: 503 }
    )
  }

  // Read all completed step files
  const matrix: Record<string, Record<string, number>> = {}
  const verdicts: Record<string, Record<string, string>> = {}
  let pmfDefinitions: Record<string, any> | undefined
  const products: string[] = []

  // Read v1 baseline from state/products/
  const productsDir = path.join(process.cwd(), '..', 'state', 'products')
  try {
    const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'))
    for (const file of productFiles) {
      const prod = JSON.parse(fs.readFileSync(path.join(productsDir, file), 'utf-8'))
      const id = prod.id || file.replace('.json', '')
      if (!products.includes(prod.product_name)) products.push(prod.product_name)
      matrix[id] = { v1: prod.validation?.pmf_score ?? 0 }
      verdicts[id] = { v1: prod.validation?.verdict ?? prod.status ?? 'UNKNOWN' }
    }
  } catch { /* no products */ }

  // Read step files
  for (let i = 1; i <= status.current_step; i++) {
    try {
      const stepRaw = fs.readFileSync(path.join(baseDir, `step-${i}.json`), 'utf-8')
      const step: ValidatorStepDetail = JSON.parse(stepRaw)

      for (const [prodId, result] of Object.entries(step.products)) {
        if (!matrix[prodId]) matrix[prodId] = {}
        matrix[prodId][`step-${i}`] = result.v2_pmf_score
        if (!verdicts[prodId]) verdicts[prodId] = {}
        verdicts[prodId][`step-${i}`] = result.v2_verdict
      }

      if (step.pmf_definitions) {
        pmfDefinitions = step.pmf_definitions
      }
    } catch { /* step not yet written */ }
  }

  const overview: ValidatorOverview = {
    current_step: status.current_step,
    total_steps: status.total_steps,
    status: status.status,
    products,
    matrix,
    verdicts,
    steps_meta: status.steps,
    pmf_definitions: pmfDefinitions,
  }

  return NextResponse.json(overview)
}
