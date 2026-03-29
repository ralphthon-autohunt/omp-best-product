import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'state', 'validator-v2', 'status.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json(
      {
        current_step: 0,
        total_steps: 4,
        status: 'waiting',
        started_at: null,
        updated_at: null,
        steps: [],
      },
      { status: 503 }
    )
  }
}
