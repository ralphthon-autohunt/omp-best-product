import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { step: string } }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      '..',
      'state',
      'validator-v2',
      `step-${params.step}.json`
    )
    const raw = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json(
      { error: `Step ${params.step} not found` },
      { status: 404 }
    )
  }
}
