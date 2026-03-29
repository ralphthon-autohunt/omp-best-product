import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      '..',
      'state',
      'products',
      `${params.id}.json`
    )
    const raw = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json(
      { error: `Product ${params.id} not found` },
      { status: 404 }
    )
  }
}
