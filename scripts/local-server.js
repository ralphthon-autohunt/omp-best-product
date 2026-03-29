#!/usr/bin/env node

/**
 * local-server.js — Local Next.js dev server process manager for omp:local
 *
 * Usage (called by local-deployer agent):
 *   node scripts/local-server.js start <projectDir> [port]
 *   node scripts/local-server.js stop <pid>
 *   node scripts/local-server.js stop-all
 *   node scripts/local-server.js list
 *   node scripts/local-server.js cleanup
 */

const { spawn, execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const STATE_FILE = path.join(__dirname, '..', 'state', 'local-ports.json')
const SEPE_TEMPLATE = path.join(__dirname, '..', 'sepe-template')
const BASE_PORT = 20000
const MAX_PORT = 21000

// --- State helpers ---

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'))
  } catch {
    const initial = { base_port: BASE_PORT, max_port: MAX_PORT, services: {} }
    writeState(initial)
    return initial
  }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true })
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n')
}

// --- PID helpers ---

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function isNextProcess(pid) {
  try {
    const cmd = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf-8' }).trim()
    return cmd.includes('next')
  } catch {
    return false
  }
}

// --- Port helpers ---

function findAvailablePort(state) {
  const usedPorts = new Set(
    Object.values(state.services)
      .filter(s => s.status === 'running')
      .map(s => s.port)
  )

  for (let port = state.base_port; port < state.max_port; port++) {
    if (!usedPorts.has(port)) {
      // Also check if port is in use by external process
      try {
        execSync(`lsof -i :${port} -t 2>/dev/null`, { encoding: 'utf-8' })
        // Port is in use by something else, skip
        continue
      } catch {
        // Port is free
        return port
      }
    }
  }
  return null
}

// --- node_modules guard ---

function ensureNodeModules(projectDir) {
  const nodeModulesPath = path.join(projectDir, 'node_modules')
  const templateNodeModules = path.join(SEPE_TEMPLATE, 'node_modules')

  if (fs.existsSync(nodeModulesPath)) return true

  if (fs.existsSync(templateNodeModules)) {
    fs.symlinkSync(templateNodeModules, nodeModulesPath, 'dir')
    console.log(`Symlinked node_modules from sepe-template`)
    return true
  }

  console.error('ERROR: sepe-template/node_modules not found. Run npm install in sepe-template first.')
  return false
}

// --- Commands ---

function cleanup() {
  const state = readState()
  let cleaned = 0

  for (const [productId, service] of Object.entries(state.services)) {
    if (service.status !== 'running') continue

    if (!isProcessAlive(service.pid) || !isNextProcess(service.pid)) {
      delete state.services[productId]
      cleaned++
    }
  }

  writeState(state)
  console.log(JSON.stringify({ cleaned, remaining: Object.keys(state.services).length }))
}

function start(projectDir, requestedPort) {
  // Auto-cleanup stale entries first
  cleanup()

  const state = readState()
  const productId = path.basename(projectDir)

  // Check if already running
  if (state.services[productId] && state.services[productId].status === 'running') {
    const existing = state.services[productId]
    if (isProcessAlive(existing.pid)) {
      console.log(JSON.stringify({
        success: true,
        product_id: productId,
        port: existing.port,
        pid: existing.pid,
        already_running: true
      }))
      return
    }
  }

  // Ensure node_modules
  if (!ensureNodeModules(projectDir)) {
    console.log(JSON.stringify({ success: false, error: 'node_modules not available' }))
    process.exit(1)
  }

  // Find port
  const port = requestedPort || findAvailablePort(state)
  if (!port) {
    console.log(JSON.stringify({ success: false, error: 'No available port in range' }))
    process.exit(1)
  }

  // Resolve next binary
  const nextBin = path.join(projectDir, 'node_modules', '.bin', 'next')
  const cmd = fs.existsSync(nextBin) ? nextBin : 'npx'
  const args = cmd === nextBin ? ['dev', '-p', String(port)] : ['next', 'dev', '-p', String(port)]

  // Spawn detached process
  const child = spawn(cmd, args, {
    cwd: projectDir,
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, NODE_ENV: 'development', PORT: String(port) }
  })
  child.unref()

  // Record in state
  state.services[productId] = {
    port,
    pid: child.pid,
    status: 'running',
    project_path: projectDir,
    started_at: new Date().toISOString()
  }
  writeState(state)

  console.log(JSON.stringify({
    success: true,
    product_id: productId,
    port,
    pid: child.pid,
    deploy_url: `http://localhost:${port}`
  }))
}

function stop(pidOrProductId) {
  const state = readState()

  // Try to find by product_id first
  if (state.services[pidOrProductId]) {
    const service = state.services[pidOrProductId]
    try {
      process.kill(-service.pid, 'SIGTERM')
    } catch {
      try { process.kill(service.pid, 'SIGTERM') } catch { /* already dead */ }
    }
    delete state.services[pidOrProductId]
    writeState(state)
    console.log(JSON.stringify({ success: true, stopped: pidOrProductId, port: service.port }))
    return
  }

  // Try by PID
  const pid = parseInt(pidOrProductId, 10)
  if (!isNaN(pid)) {
    try {
      process.kill(-pid, 'SIGTERM')
    } catch {
      try { process.kill(pid, 'SIGTERM') } catch { /* already dead */ }
    }

    // Remove from state
    for (const [productId, service] of Object.entries(state.services)) {
      if (service.pid === pid) {
        delete state.services[productId]
        break
      }
    }
    writeState(state)
    console.log(JSON.stringify({ success: true, stopped_pid: pid }))
    return
  }

  console.log(JSON.stringify({ success: false, error: `Not found: ${pidOrProductId}` }))
}

function stopAll() {
  const state = readState()
  let stopped = 0

  for (const [productId, service] of Object.entries(state.services)) {
    try {
      process.kill(-service.pid, 'SIGTERM')
    } catch {
      try { process.kill(service.pid, 'SIGTERM') } catch { /* already dead */ }
    }
    stopped++
  }

  state.services = {}
  writeState(state)
  console.log(JSON.stringify({ success: true, stopped }))
}

function list() {
  cleanup() // Prune stale first
  const state = readState()

  const services = Object.entries(state.services).map(([id, s]) => ({
    product_id: id,
    port: s.port,
    pid: s.pid,
    status: s.status,
    started_at: s.started_at,
    alive: isProcessAlive(s.pid)
  }))

  console.log(JSON.stringify({ services, count: services.length }))
}

// --- CLI ---

const [,, command, ...args] = process.argv

switch (command) {
  case 'start':
    start(args[0], args[1] ? parseInt(args[1], 10) : null)
    break
  case 'stop':
    stop(args[0])
    break
  case 'stop-all':
    stopAll()
    break
  case 'list':
    list()
    break
  case 'cleanup':
    cleanup()
    break
  default:
    console.error('Usage: local-server.js <start|stop|stop-all|list|cleanup> [args]')
    process.exit(1)
}
