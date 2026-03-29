#!/usr/bin/env bash
# scripts/watchdog.sh
# oh-my-pmf external watchdog — detects Conductor maxTurns exhaustion and auto-resumes
# Usage: bash scripts/watchdog.sh [/path/to/oh-my-pmf]
# Background: nohup bash scripts/watchdog.sh > logs/watchdog.log 2>&1 &
# Note: nohup은 외부에서 반드시 적용해야 watchdog 크래시 시에도 터미널이 유지됨

set -euo pipefail

# ─── Configuration ──────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${SCRIPT_DIR}/.."

# 인자 파싱: positional arg만 허용
if [ $# -ge 1 ]; then
  PROJECT_DIR="$1"
fi
PROJECT_DIR="$(cd "${PROJECT_DIR}" && pwd)"

STATE_DIR="${PROJECT_DIR}/state"
LOGS_DIR="${PROJECT_DIR}/logs"
HEARTBEAT_FILE="${STATE_DIR}/heartbeat.json"
LOCKFILE="${LOGS_DIR}/watchdog.pid"
WATCHDOG_LOG="${LOGS_DIR}/watchdog.log"

POLL_INTERVAL=30          # polling interval (seconds)
STALE_THRESHOLD=120       # heartbeat staleness threshold (seconds) — 2 minutes
RESUME_COOLDOWN=60        # minimum seconds between resume calls

# ─── Directory initialization ────────────────────────────────────────────────
mkdir -p "${LOGS_DIR}"

# ─── Duplicate run prevention (lockfile + noclobber) ─────────────────────────
if ( set -C; echo $$ > "${LOCKFILE}" ) 2>/dev/null; then
  : # 락 획득 성공
else
  EXISTING_PID=$(cat "${LOCKFILE}" 2>/dev/null || echo "")
  if [ -n "${EXISTING_PID}" ] && kill -0 "${EXISTING_PID}" 2>/dev/null; then
    echo "watchdog already running (PID: ${EXISTING_PID})" | tee -a "${WATCHDOG_LOG}"
    exit 0
  fi
  # stale lockfile — previous process terminated abnormally
  echo "[$(date -Iseconds)] stale lockfile detected (PID: ${EXISTING_PID}), cleaning up" | tee -a "${WATCHDOG_LOG}"
  rm -f "${LOCKFILE}"
  echo $$ > "${LOCKFILE}"
fi
echo "[$(date -Iseconds)] watchdog started (PID: $$, project: ${PROJECT_DIR})" | tee -a "${WATCHDOG_LOG}"

# ─── Cleanup on exit ─────────────────────────────────────────────────────────
cleanup() {
  echo "[$(date -Iseconds)] watchdog stopping (PID: $$)" | tee -a "${WATCHDOG_LOG}"
  rm -f "${LOCKFILE}"
  exit 0
}
trap cleanup SIGTERM SIGINT SIGHUP

# ─── Heartbeat staleness calculation ─────────────────────────────────────────
get_stale_seconds() {
  local heartbeat_file="$1"
  if [ ! -f "${heartbeat_file}" ]; then
    echo 9999
    return
  fi
  local stale_sec
  stale_sec=$(python3 -c "
import json, sys, datetime

try:
    with open('${heartbeat_file}') as f:
        data = json.load(f)
    lb = data.get('last_beat')
    if not lb:
        print(9999)
        sys.exit(0)
    # Parse ISO 8601 — try fromisoformat first, fall back to strptime
    try:
        dt = datetime.datetime.fromisoformat(lb)
    except ValueError:
        dt = datetime.datetime.strptime(lb[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=datetime.timezone.utc)
    # Ensure timezone-aware for comparison
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=datetime.timezone.utc)
    now = datetime.datetime.now(datetime.timezone.utc)
    delta = (now - dt.astimezone(datetime.timezone.utc)).total_seconds()
    print(int(delta))
except Exception:
    print(9999)
" 2>/dev/null || echo 9999)
  echo "${stale_sec}"
}

# ─── omp:resume call ─────────────────────────────────────────────────────────
call_resume() {
  echo "[$(date -Iseconds)] heartbeat stale — calling /omp:resume" | tee -a "${WATCHDOG_LOG}"
  cd "${PROJECT_DIR}"
  # Run claude CLI resume skill in background
  claude --print "/omp:resume" >> "${WATCHDOG_LOG}" 2>&1 &
  local resume_pid=$!
  echo "[$(date -Iseconds)] resume dispatched (background PID: ${resume_pid})" | tee -a "${WATCHDOG_LOG}"
}

# ─── Main polling loop ────────────────────────────────────────────────────────
LAST_RESUME_AT=0

while true; do
  STALE_SEC=$(get_stale_seconds "${HEARTBEAT_FILE}")
  NOW_EPOCH=$(date +%s)

  echo "[$(date -Iseconds)] heartbeat stale=${STALE_SEC}s (threshold=${STALE_THRESHOLD}s)" >> "${WATCHDOG_LOG}"

  if [ "${STALE_SEC}" -ge "${STALE_THRESHOLD}" ]; then
    # Minimum RESUME_COOLDOWN seconds must pass between resume calls
    SINCE_LAST_RESUME=$(( NOW_EPOCH - LAST_RESUME_AT ))
    if [ "${SINCE_LAST_RESUME}" -ge "${RESUME_COOLDOWN}" ]; then
      call_resume
      LAST_RESUME_AT=${NOW_EPOCH}
    else
      echo "[$(date -Iseconds)] resume cooldown (${SINCE_LAST_RESUME}s < ${RESUME_COOLDOWN}s), skipping" >> "${WATCHDOG_LOG}"
    fi
  fi

  sleep "${POLL_INTERVAL}"
done
