import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'state', 'heartbeat.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const heartbeat = JSON.parse(raw)

    // Compute staleness
    let staleness_min: number | null = null
    let health: 'green' | 'yellow' | 'red' = 'red'

    if (heartbeat.last_beat) {
      const diffMs = Date.now() - new Date(heartbeat.last_beat).getTime()
      staleness_min = Math.floor(diffMs / 1000 / 60)
      if (staleness_min < 5) health = 'green'
      else if (staleness_min < 15) health = 'yellow'
      else health = 'red'
    }

    return NextResponse.json({ ...heartbeat, staleness_min, health })
  } catch {
    return NextResponse.json(
      {
        last_beat: null,
        cycle_count: 0,
        status: 'unknown',
        staleness_min: null,
        health: 'red',
        error: 'state/heartbeat.json not found',
      },
      { status: 503 }
    )
  }
}
