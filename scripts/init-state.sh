#!/bin/bash
# oh-my-pmf state initializer
STATE_DIR="$(cd "$(dirname "$0")/.." && pwd)/state"
mkdir -p "$STATE_DIR/products" "$STATE_DIR/personas" "$STATE_DIR/ideas" "$STATE_DIR/competitors"
mkdir -p "$(cd "$(dirname "$0")/.." && pwd)/logs"

[ ! -f "$STATE_DIR/queue.json" ] && cat > "$STATE_DIR/queue.json" << 'EOF'
{
  "pending_ideas": [],
  "killed_ideas": [],
  "killed_categories_streak": [],
  "total_generated": 0,
  "updated_at": null
}
EOF

[ ! -f "$STATE_DIR/dashboard.json" ] && cat > "$STATE_DIR/dashboard.json" << 'EOF'
{
  "status": "initializing",
  "started_at": null,
  "updated_at": null,
  "summary": {
    "total_cycles": 0,
    "graduates": 0,
    "iterating": 0,
    "pivots": 0,
    "kills": 0
  },
  "current_pipelines": [],
  "top_graduates": [],
  "category_stats": {},
  "recent_kills": [],
  "pmf_thresholds": {
    "graduate": 55,
    "iterate": 40,
    "pivot": 25,
    "sean_ellis_original": 40,
    "sepe_graduate": 55
  }
}
EOF

[ ! -f "$STATE_DIR/checkpoint.json" ] && cat > "$STATE_DIR/checkpoint.json" << 'EOF'
{
  "last_completed_cycle": 0,
  "started_at": null,
  "last_saved_at": null,
  "in_progress_cycles": [],
  "session_drop_count": 0,
  "parallel_slots": 2
}
EOF

[ ! -f "$STATE_DIR/heartbeat.json" ] && cat > "$STATE_DIR/heartbeat.json" << 'EOF'
{
  "last_beat": null,
  "cycle_count": 0,
  "beat_interval_sec": 30,
  "session_id": null,
  "status": "starting"
}
EOF

[ ! -f "$STATE_DIR/budget.json" ] && cat > "$STATE_DIR/budget.json" << 'EOF'
{
  "total_estimated_usd": 0.0,
  "total_input_tokens": 0,
  "total_output_tokens": 0,
  "by_agent": {},
  "updated_at": null
}
EOF

[ ! -f "$STATE_DIR/deployments.json" ] && cat > "$STATE_DIR/deployments.json" << 'EOF'
{
  "deployments": [],
  "slots": {
    "sepe-slot-1": null,
    "sepe-slot-2": null,
    "sepe-slot-3": null,
    "sepe-slot-4": null,
    "sepe-slot-5": null
  }
}
EOF

[ ! -f "$STATE_DIR/learnings.json" ] && cat > "$STATE_DIR/learnings.json" << 'EOF'
{
  "patterns": [],
  "total_kills": 0,
  "total_graduates": 0,
  "updated_at": null
}
EOF

echo "✅ state/ 초기화 완료"
