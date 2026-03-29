import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function readConductorLog(): Record<string, { product_name: string; stage: string; message: string; timestamp: string; pmf_score?: number; verdict?: string; url?: string }> {
  try {
    const logPath = path.join(process.cwd(), '..', 'state', 'conductor-log.json')
    const raw = fs.readFileSync(logPath, 'utf-8')
    const log = JSON.parse(raw)
    const events = log.events ?? []

    // Group by product_id, keep latest event per product
    const latest: Record<string, any> = {}
    for (const event of events) {
      if (!event.product_id) continue
      latest[event.product_id] = {
        product_name: event.product_name,
        stage: event.stage,
        message: event.message,
        timestamp: event.timestamp,
        pmf_score: event.pmf_score ?? null,
        verdict: event.verdict ?? null,
        url: event.url ?? null,
      }
    }
    return latest
  } catch {
    return {}
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'state', 'dashboard.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)

    // Enrich with conductor log latest state per product
    data.product_latest = readConductorLog()

    // Compute elapsed_sec from started_at for active pipelines (conductor writes started_at once, not elapsed_sec)
    const now = Date.now()
    if (Array.isArray(data.current_pipelines)) {
      for (const p of data.current_pipelines) {
        if (p.started_at && p.stage !== 'done') {
          p.elapsed_sec = Math.floor((now - new Date(p.started_at).getTime()) / 1000)
        }
      }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      {
        status: 'initializing',
        started_at: null,
        updated_at: null,
        error: 'state/dashboard.json not found',
        summary: { total_cycles: 0, graduates: 0, iterating: 0, pivots: 0, kills: 0 },
        current_pipelines: [],
        top_graduates: [],
        category_stats: {},
        recent_kills: [],
        pmf_thresholds: { graduate: 55, iterate: 40, pivot: 25, sean_ellis_original: 40, sepe_graduate: 55 },
        product_latest: {},
      },
      { status: 503 }
    )
  }
}
