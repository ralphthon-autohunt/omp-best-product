import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SAFE_ID = /^[a-zA-Z0-9_-]+$/

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url)
  const cycle = url.searchParams.get('cycle') ?? '1'

  if (!SAFE_ID.test(params.id) || !SAFE_ID.test(cycle)) {
    return NextResponse.json(
      { error: 'Invalid product id or cycle' },
      { status: 400 }
    )
  }

  const filePath = path.join(
    process.cwd(),
    '..',
    'state',
    'validator-v2',
    params.id,
    `cycle-${cycle}`,
    'persona-responses.json'
  )

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: `persona-responses not found for ${params.id} cycle ${cycle}` },
      { status: 404 }
    )
  }
}
