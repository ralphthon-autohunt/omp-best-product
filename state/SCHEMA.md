# oh-my-pmf State Schema

This document describes all state files used by the oh-my-pmf plugin.
All files live under `state/`. Subdirectories `products/`, `personas/`, and `ideas/` hold per-product records.

---

## 5.1 `state/dashboard.json`

**Purpose**: Master dashboard file. Polled by `/omp:status` and the Next.js dashboard UI. Gives a real-time snapshot of the running loop.

**Who writes**: Conductor agent — updated after every cycle completes.
**Who reads**: `/omp:status` skill, `GET /api/dashboard` route, SessionHealth component.

```json
{
  "status": "running|paused|completed",
  "started_at": "2026-03-29T09:00:00+09:00",
  "updated_at": "2026-03-29T10:23:45+09:00",
  "summary": {
    "total_cycles": 47,       // total product cycles attempted
    "graduates": 3,           // products that reached GRADUATE verdict
    "iterating": 2,           // products currently in ITERATE loop
    "pivots": 5,              // total PIVOT decisions made
    "kills": 37               // total KILL decisions made
  },
  "current_pipelines": [
    {
      "product_id": "prod-047",
      "product_name": "TaskSync Pro",
      "stage": "ideating|spec|build|qa|deploy|validate|done",
      "stage_detail": "Builder-Engineer: 코드 생성 중",
      "progress_pct": 60,     // 0–100 percent complete
      "started_at": "ISO8601",
      "elapsed_sec": 340
    }
  ],
  "top_graduates": [
    {
      "product_id": "prod-023",
      "product_name": "TaskSync Pro",
      "pmf_score": 61.2,
      "url": "https://sepe-023.vercel.app",
      "verdict": "GRADUATE",
      "market_phase": "early_adopters"
    }
  ],
  "category_stats": {
    "productivity": {"total": 15, "graduates": 2, "rate": 0.133},
    "health": {"total": 12, "graduates": 1, "rate": 0.083}
  },
  "recent_kills": [
    {
      "product_id": "prod-046",
      "product_name": "TaskSync Pro",
      "reason": "PMF 4.4% (L1: 115/250, L2: 20/115, VD: 11/250)",
      "url": "http://localhost:20000",
      "killed_at": "ISO8601",
      "funnel_summary": {
        "layer1_pass_rate": 0.46,
        "layer2_pass_rate": 0.17,
        "vd_count": 11,
        "pmf_score": 4.4
      }
    }
  ],
  "pmf_thresholds": {
    "graduate": 40,             // SEPE v3 graduate threshold (%)
    "iterate": 10,              // minimum to enter ITERATE loop
    "kill": 10,                 // below this → KILL
    "sean_ellis_original": 40,  // classic Sean Ellis threshold
    "sepe_graduate": 40         // SEPE v3-adjusted graduate threshold
  }
}
```

---

## 5.2 `state/products/{id}.json`

**Purpose**: Full lifecycle record for a single product. Created when a product idea is accepted; updated at every stage transition.

**Who writes**: Each pipeline agent (Builder-PM, Builder-Engineer, Deployer, Validator, Conductor) updates its own section.
**Who reads**: Conductor, `/omp:status`, `GET /api/products/{id}` route, product detail page.

```json
{
  "product_id": "prod-023",
  "idea_id": "idea-abc",
  "version": 1,                 // increments on each ITERATE cycle
  "status": "ideating|spec|build|qa|deploy|validate|GRADUATE|ITERATE|PIVOT|KILL",
  "slot_type": "normal|anchor",      // "anchor" = KILL 면제, 최대 10회 ITERATE
  "created_at": "ISO8601",
  "idea": {
    "product_name": "TaskSync Pro",
    "one_liner": "팀 업무를 로컬에서 동기화하는 무설치 협업 도구",
    "target_segment": {},       // persona segment descriptor object
    "core_feature": "드래그&드롭 Kanban",
    "differentiation": "백엔드 없이 로컬스토리지 기반",
    "revenue_model": "freemium",
    "category": "productivity"
  },
  "spec": {
    "tagline": "...",
    "cta_text": "지금 시작하기",
    "color_theme": {"primary": "#6366f1", "secondary": "#a5b4fc"},
    "feature_description": "...",
    "feature_ui_components": ["KanbanBoard", "TaskCard", "DragHandle"],
    "iterate_direction": null   // filled by Conductor on ITERATE decision
  },
  "build": {
    "project_path": "projects/prod-023",
    "build_success": true,
    "build_attempts": 1,
    "build_duration_sec": 87,
    "built_at": "ISO8601"
  },
  "deployment": {
    "url": "https://sepe-023.vercel.app",
    "deployed_at": "ISO8601",
    "health_check": "200",
    "vercel_project_id": "prj_xxxx"
  },
  "validation": {
    "pmf_score": 35.0,
    "pmf_delta": null,
    "verdict": "ITERATE",
    "nascent_pmf": false,
    "validator_version": "v3",      // "v2" or "v3"
    "funnel": {                     // v3 only — null for v2 products
      "total_personas": 250,
      "target_count": 125,
      "nontarget_count": 125,
      "layer1_passed": 40,
      "layer1_pass_rate": 0.16,
      "layer1_drop_reasons": [
        {"reason": "가계부 자체에 관심 없음", "count": 38, "segment": "nontarget"}
      ],
      "layer2_entered": 40,
      "layer2_pre_survey_nd": 10,
      "layer2_e2e_attempted": 30,
      "layer2_passed": 15,
      "layer2_pass_rate": 0.375,
      "layer2_drop_reasons": [
        {"reason": "재방문까지는 아님", "count": 8, "drop_gate": "revisit"}
      ],
      "layer3_entered": 15,
      "layer3_vd": 8,
      "layer3_sd": 5,
      "layer3_nd": 2,
      "layer3_not_applicable": 0
    },
    "unexpected_segments": [],      // v3 only — nontarget personas that reached VD
    "population": {                 // v2 compatibility — null for v3 products
      "total_personas": 50,
      "pre_survey_nd": 8,
      "e2e_attempted": 42,
      "activation_completed": 35,
      "survey_respondents": 35
    },
    "q1_distribution": {
      "very_disappointed": 12,
      "somewhat_disappointed": 15,
      "not_disappointed": 6,
      "not_applicable": 2
    },
    "wtp_distribution": {       // Q5a 집계 (Deep). raw_voices 없으면 null.
      "free_only": 2,
      "1_to_5": 3,
      "5_to_15": 3,
      "15_to_30": 1,
      "30_plus": 1
    },
    "wtp_median": "5_to_15",    // Q5a 중앙값 구간. nullable.
    "price_ceiling_avg": 12.5,  // Q5b 자유 응답 평균 (USD). 파싱 실패 시 null.
    "resemblance_score": 0.6,   // raw_voice_top5 ∩ q4_top5 / 5.0. raw_voices 없으면 null.
    "confidence_basis": {       // 판정 근거 메타데이터. nullable.
      "methodology": "Sean Ellis PMF Survey ...",
      "persona_grounding": {
        "proxy_sources": ["ProductHunt", "HackerNews", "Reddit"],
        "raw_voices_count": 12,
        "resemblance_score": 0.6
      },
      "theoretical_models": ["OCEAN", "Rogers Curve", "Bass Diffusion", "Crossing the Chasm", "Stanford Generative Agents"],
      "known_limitations": ["...", "...", "..."]
    },
    "vd_count": 12,
    "sd_count": 15,
    "nd_count": 6,
    "vsd_count": 9,
    "nsd_count": 6,
    "core_values": ["위험 조항 즉시 발견", "쉬운 설명"],
    "conversion_conditions": [
      {"condition": "위험도 점수", "mentions": 14},
      {"condition": "카톡 공유", "mentions": 11}
    ],
    "hxc_profile": "첫 자취 20~30대, 부동산 지식 부족",
    "pm_instruction": "상위 1~2개만 선택하여 개선",
    "validated_at": "ISO8601"
  },
  "persona_evolution": {
    "initial_pool_size": 50,
    "current_pool_size": 73,
    "churned_count": 0,
    "new_adopters": 23          // viral word-of-mouth additions
  },
  "timeline": {
    "idea_created": "ISO8601",
    "build_started": "ISO8601",
    "build_completed": "ISO8601",
    "deployed": "ISO8601",
    "validated": "ISO8601",
    "total_duration_sec": 623
  },
  "iterate_history": [           // append-only 배열 — 버전별 의사결정→평가 체인
    {
      "product_id": "prod-023",
      "version": 1,
      "pmf_score": 3.2,
      "verdict": "KILL",
      "validated_at": "ISO8601",
      "version_path": "/v1",

      // Builder-PM 의사결정 (v1은 null — 최초 빌드)
      "iterate_direction_applied": null,

      // v3 퍼널 데이터 (v2 제품은 null)
      "funnel": {
        "total_personas": 250,
        "layer1_passed": 40,
        "layer1_pass_rate": 0.16,
        "layer1_drop_reasons": [{"reason": "가계부 자체에 관심 없음", "count": 38}],
        "layer2_passed": 15,
        "layer2_pass_rate": 0.375,
        "layer3_vd": 8,
        "layer3_sd": 5,
        "layer3_nd": 2
      },

      // v2 호환 필드 (v3에서는 funnel로 대체)
      "surveyed_count": null,
      "q1_distribution": null,

      "q2_hxc_profile": "이상 고객 프로필",
      "q3_top_strengths": ["강점1 (N명)", "강점2 (N명)"],
      "q4_top_improvements": ["개선1 (N명)", "개선2 (N명)"]
    },
    {
      "product_id": "prod-023",
      "version": 2,
      "pmf_score": 12.0,
      "verdict": "ITERATE",
      "validated_at": "ISO8601",
      "version_path": "/v2",

      // Builder-PM 의사결정 (v3 3소스 피드백 기반)
      "iterate_direction_applied": {
        "positioning_change": "태그라인 변경: '30초 입력, 즉시 통찰' → '지출 패턴, 한눈에'",
        "strengthen": "도넛 차트 시각화 강화",
        "improve": "월별 비교 트렌드 추가",
        "retention_fix": "주간 지출 리포트 알림 CTA",
        "rationale": {
          "positioning_source": "Layer 1 drop #1: '자동 연동이 아니면 안 씀' (22명)",
          "strengthen_source": "core_values #1: '즉시 시각화'",
          "improve_source": "Layer 3 VSD #1: '월별 비교 트렌드' (14명)",
          "retention_source": "Layer 2 drop #1: '재방문까지는 아님' (8명)"
        }
      },

      "funnel": {
        "total_personas": 250,
        "layer1_passed": 60,
        "layer1_pass_rate": 0.24,
        "layer1_drop_reasons": [{"reason": "이미 다른 가계부 앱 씀", "count": 30}],
        "layer2_passed": 30,
        "layer2_pass_rate": 0.50,
        "layer3_vd": 25,
        "layer3_sd": 3,
        "layer3_nd": 2
      },

      "surveyed_count": null,
      "q1_distribution": null,

      "q2_hxc_profile": "갱신된 이상 고객 프로필",
      "q3_top_strengths": ["강점1 (N명)", "강점2 (N명)"],
      "q4_top_improvements": ["개선1 (N명)", "개선2 (N명)"]
    }
  ]
}
```

---

## 5.3 `state/personas/{product_id}.json`

**Purpose**: Persona pool for a given product. Tracks individual simulated users, their memory across sprints, satisfaction history, churn, and viral spread through the Crossing the Chasm model.

**Who writes**: Persona agent — creates on first validation, updates on each subsequent validation sprint.
**Who reads**: Validator agent, Conductor (for persona_evolution stats).

```json
{
  "product_id": "prod-023",
  "persona_mode": "target_and_nontarget",  // "target_only" (v2) or "target_and_nontarget" (v3)
  "total_count": 250,           // 100 for v2, 250 for v3
  "target_count": 125,          // 100 for v2, 125 for v3
  "nontarget_count": 125,       // 0 for v2, 125 for v3
  "market_phase": "early_adopters",
  "viral_coefficient": 1.23,
  "personas": [
    {
      "persona_id": "p-001",
      "tier": "deep",           // deep | mid | lite
      "segment_type": "target", // "target" or "nontarget" — default "target" for v2 compat
      "demographics": {},       // age, occupation, location, income bracket
      "behavioral": {},         // usage frequency, device, tech savviness
      "psychographic": {
        "ocean": {},            // Big Five personality scores
        "risk_attitude": "...",
        "innovation_adoption": "innovator|early_adopter|early_majority|late_majority|laggard"
      },
      "background_story": "...",
      "network": ["p-005", "p-012"],  // persona IDs this user can refer
      "memory": [
        {
          "sprint": 1,
          "experience": "UI가 직관적이었지만 팀 공유 기능이 없어서 아쉬웠다",
          "satisfaction": 0.65  // 0.0–1.0
        }
      ],
      "satisfaction_history": [0.65],
      "churned": false,
      "churn_reason": null
    }
  ],
  "chasm_phases": {
    "innovators":      {"count": 50, "unlocked_at": "ISO8601"},
    "early_adopters":  {"count": 23, "unlocked_at": "ISO8601"},
    "early_majority":  {"count": 0,  "unlocked_at": null}
  },
  "updated_at": "ISO8601"
}
```

---

## 5.4 `state/queue.json`

**Purpose**: Idea generation queue. Tracks pending ideas waiting to enter a pipeline, killed product history (for deduplication), category streak tracking (to avoid flooding a single category), and total generation count.

**Who writes**: Ideator agent (adds to pending_ideas, increments total_generated), Conductor (moves ideas from pending to active, moves killed products to killed_ideas).
**Who reads**: Conductor, Ideator agent (reads killed history to avoid duplicates), `/omp:status`.

```json
{
  "pending_ideas": [],          // array of idea objects waiting to be scheduled
  "killed_ideas": [
    {
      "product_name": "AI Receipt Scanner",
      "category": "finance",
      "reason": "PMF 12%",
      "keywords": ["receipt", "scan", "expense"]
    }
  ],
  "killed_categories_streak": ["productivity", "productivity"],  // last N killed categories
  "total_generated": 47,        // cumulative ideas generated since loop start
  "updated_at": "ISO8601"
}
```

---

## 5.5 `state/checkpoint.json`

**Purpose**: Session continuity record. Used by `/omp:resume` to recover from session drops without losing progress. Tracks the last fully completed cycle and any cycles that were in-flight when the session ended.

**Who writes**: Conductor — written after every cycle completion and at heartbeat intervals.
**Who reads**: `/omp:resume` skill, Conductor on startup.

```json
{
  "last_completed_cycle": 46,
  "started_at": "2026-03-29T09:00:00+09:00",
  "last_saved_at": "2026-03-29T10:22:15+09:00",
  "in_progress_cycles": [
    {
      "product_id": "prod-047",
      "stage": "building",        // stage where the cycle was interrupted
      "started_at": "ISO8601"
    }
  ],
  "session_drop_count": 0,        // number of times resume has been triggered
  "parallel_slots": 2             // number of concurrent pipeline slots
}
```

---

## 5.6 `state/heartbeat.json`

**Purpose**: Liveness signal. The Conductor writes this every `beat_interval_sec` seconds while the loop is running. The dashboard uses staleness of `last_beat` to display session health (green / yellow / red).

**Staleness thresholds**:
- < 5 min: healthy (green)
- 5–15 min: warning (yellow)
- 15+ min: session drop suspected (red) — prompt user to run `/omp:resume`

**Who writes**: Conductor agent at each heartbeat tick.
**Who reads**: `/omp:status`, `GET /api/health` route, SessionHealth dashboard component.

```json
{
  "last_beat": "2026-03-29T10:23:30+09:00",
  "cycle_count": 47,              // total cycles completed so far
  "beat_interval_sec": 30,        // how often the conductor writes this file
  "session_id": "claude-session-xxxx",
  "status": "alive|paused|completed|starting"
}
```

---

## 5.7 `state/budget.json`

**Purpose**: Token and cost accounting across the entire run. Each agent appends its own token usage after completing work. Provides visibility into per-agent costs and total spend estimate.

**Who writes**: Every agent — each appends its own entry under `by_agent` after completing a task.
**Who reads**: `/omp:status`, Conductor (for budget guardrails), dashboard UI.

```json
{
  "total_estimated_usd": 8.43,
  "total_input_tokens": 1250000,
  "total_output_tokens": 480000,
  "by_agent": {
    "ideator":          {"input_tokens": 150000, "output_tokens": 45000,  "estimated_usd": 0.85},
    "builder_pm":       {"input_tokens": 90000,  "output_tokens": 30000,  "estimated_usd": 0.51},
    "builder_engineer": {"input_tokens": 400000, "output_tokens": 200000, "estimated_usd": 3.60},
    "builder_qa":       {"input_tokens": 50000,  "output_tokens": 10000,  "estimated_usd": 0.21},
    "deployer":         {"input_tokens": 30000,  "output_tokens": 10000,  "estimated_usd": 0.14},
    "persona":          {"input_tokens": 200000, "output_tokens": 80000,  "estimated_usd": 1.68},
    "validator":        {"input_tokens": 250000, "output_tokens": 90000,  "estimated_usd": 2.10},
    "conductor":        {"input_tokens": 80000,  "output_tokens": 15000,  "estimated_usd": 0.54}
  },
  "updated_at": "ISO8601"
}
```

---

## 5.8 `state/ideas/{id}.json`

**Purpose**: 단일 제품 아이디어 레코드. Ideator가 생성하고 Conductor가 소비한다.
raw_voices는 Conductor가 Persona 에이전트 호출 시 함께 전달한다.

**Who writes**: Ideator agent
**Who reads**: Conductor, Persona agent (raw_voices 소비), Validator (keywords[] 소비)

```json
{
  "id": "idea-{YYYYMMDD-HHmmss}",
  "product_name": "제품명 (영어, 2-3 단어)",
  "one_liner": "한 줄 설명 (최대 60자)",
  "target_segment": {
    "demographics": "주요 사용자 특성",
    "needs": "핵심 니즈",
    "pain_points": "현재 겪는 문제점"
  },
  "core_feature": "MVP 핵심 기능 1개",
  "keywords": ["keyword1", "keyword2", "..."],
  "differentiation": "기존 제품 대비 차별점",
  "revenue_model": "freemium | subscription | transaction",
  "category": "카테고리",
  "source_trends": ["출처1: ...", "출처2: ..."],
  "raw_voices": [
    {
      "voice_id": "v-001",
      "source": "reddit | producthunt | hackernews | appstore",
      "source_url": "https://...",
      "text": "원본 발언 최대 200자",
      "sentiment": "positive | negative | neutral"
    }
  ],
  "created_at": "ISO8601"
}
```

**Field notes:**
- `keywords[]`: Validator의 FR-3 pain_match_bonus 계산에 사용. Ideator가 core_feature에서 추출. 3~7개.
- `raw_voices[]`: 소스당 최대 5개, 전체 최대 15개 (NFR-4). 수집 실패 시 빈 배열.
- `raw_voices[].voice_id`: "v-{NNN}" 형식. Validator의 grounding_sources 배열에서 참조.
- Both `keywords[]` and `raw_voices[]` are nullable for backward compatibility (see Migration Compatibility below).

---

## 5.9 `state/local-ports.json`

**Purpose**: Local dev server port registry. Tracks which products are running locally on which ports, managed by `scripts/local-server.js`.

**Who writes**: `local-deployer` agent (via `scripts/local-server.js`), `/omp:local` skill (stop/cleanup).
**Who reads**: Dashboard `GET /api/local-ports` route, `ProductPreview` component, `/omp:local list` subcommand.

```json
{
  "base_port": 20000,
  "max_port": 21000,
  "services": {
    "prod-abc123": {
      "port": 20000,
      "pid": 12345,
      "status": "running",
      "project_path": "/absolute/path/to/projects/prod-abc123",
      "started_at": "2026-03-28T10:00:00+09:00"
    }
  }
}
```

**Field notes:**
- `base_port`: Starting port for auto-assignment (inclusive). Default 20000.
- `max_port`: Upper bound for port range (exclusive). Default 21000.
- `services`: Map of product_id → service info. Only running services are retained; stopped/stale entries are pruned on each `list` or `start` invocation.
- `services[].port`: Assigned port number. Gap-fill strategy reuses freed ports.
- `services[].pid`: OS process ID of the `next dev` process. Used for lifecycle management (`kill -0` liveness check, `process.kill(-pid)` group kill).
- `services[].status`: Always `"running"` for active entries (stale entries are deleted, not marked).
- `services[].project_path`: Absolute path to the project directory.
- `services[].started_at`: ISO 8601 timestamp when the server was started.
- This file is ephemeral (gitignored by `state/*.json` pattern). It does not survive across machines.

---

## 5.10 `state/competitors/{product_id}.json`

**Purpose**: Competitive landscape for a product. Contains competitor names, strengths, weaknesses, and pricing. Used by Validator v2 to inject competitive context into persona evaluations.

**Who writes**: Competitor Researcher agent.
**Who reads**: Validator v2 agent (Step 2: competitor injection).

```json
{
  "product_id": "prod-023",
  "competitors": [
    {
      "name": "직방 안심중개",
      "strength": "공인중개사 직접 검토, 브랜드 신뢰",
      "weakness": "유료 (10만원+), 예약 필요, 즉시 불가",
      "price": "10~15만원/건"
    }
  ],
  "researched_at": "ISO8601"
}
```

---

## 5.11 `logs/{product_id}/cycle-{n}.json`

**Purpose**: Detailed validation log per cycle. Contains full E2E reports, persona responses, and PMF calculations.

**Who writes**: Validator v2 agent (Step 13).
**Who reads**: Dashboard (future), post-mortem analysis.

See `agents/validator-v2.md` Step 13 for full schema.

---

## 5.12 `state/validator-v2/{product_id}/cycle-{n}/persona-responses.json`

**Purpose**: 사이클별 페르소나 상세 응답 파일. 각 페르소나의 행동 추적, 사전 설문, E2E 체험 결과, Q1~Q4 설문 응답, 8축 분류 결과를 구조화하여 저장한다. 판정 근거의 가시성과 재현 가능성을 확보하기 위한 전용 파일이다.

**Who writes**: Validator v2 agent (Step 14) — Step 13 완료 직후, 판정 결과 반환 전.
**Who reads**: Dashboard API (`GET /api/products/{id}/persona-responses?cycle=N`), post-mortem analysis, Conductor (meta.status 확인용).

**Path pattern**: `state/validator-v2/{product_id}/cycle-{cycle_number}/persona-responses.json`

**Write protocol**: 임시 파일(`persona-responses.tmp.json`)에 먼저 완전히 쓴 후 atomic rename으로 최종 파일명으로 교체한다 (race condition 방지, HR-5).

**Collision handling**: 동일 경로에 파일이 이미 존재하면 `persona-responses-{YYYYMMDD-HHmmss}.json`으로 저장한다 (FR-8).

**schema_version**: `"1.0"` (고정). 축 이름 또는 구조 변경 시 버전 업 필요 (HR-4).

```json
{
  "meta": {
    "schema_version": "1.0",
    "status": "complete"
  },
  "cycle_meta": {
    "product_id": "productivity-helper-v1",
    "cycle_number": 2,
    "recorded_at": "2026-03-29T09:30:00+09:00"
  },
  "personas": [
    {
      "persona_meta": {
        "id": "p-001",
        "name": "김지연",
        "age": 32,
        "occupation": "스타트업 마케터",
        "bio": "중소 스타트업에서 콘텐츠 마케팅을 담당하는 3년차. 업무 효율화 도구에 관심이 많지만 학습 비용이 낮은 도구만 채택한다. 노션과 카카오워크를 병행 사용 중이다.",
        "tier": "deep",
        "ocean": {
          "openness": 0.75,
          "conscientiousness": 0.68,
          "extraversion": 0.55,
          "agreeableness": 0.60,
          "neuroticism": 0.40
        },
        "innovation_adoption": "early_adopter",
        "willingness_to_pay": "medium",
        "daily_usage_likelihood": "moderate"
      },
      "behavior_tracking": {
        "activated": true,
        "activation_reason": "success",
        "e2e_method": "playwright",
        "core_action_count": 3,
        "playwright_results": {
          "steps_completed": 8,
          "steps_failed": 1,
          "error_messages": ["Element '.save-btn' not found after 5s timeout"]
        }
      },
      "pre_survey": {
        "pain": 2,
        "alternative_advantage": 2
      },
      "survey_eligible": true,
      "survey_responses": {
        "q1_disappointment": "very_disappointed",
        "q1_text": "매일 반복하는 보고서 작성 시간을 절반으로 줄여줘서 퇴근 후 여유가 생겼다.",
        "q1_reasoning": "Pain=2, 대안 우위=2, 작동성 양호, 가치=2. 8축 중 5개 긍정. VD 조건 충족.",
        "q2_core_value": "반복 작업 자동화로 실질적인 시간 절약",
        "q3_classification": "VD",
        "q4_conversion_condition": null
      },
      "classification": {
        "label": "VD",
        "eight_axis_scores": {
          "inertia":           {"score": 2, "reason": "기존 수동 작업 대비 명확한 시간 절약 경험. 전환 비용보다 이득이 크다고 판단."},
          "frequency":         {"score": 2, "reason": "매일 사용하는 업무 루틴에 통합됨."},
          "trust":             {"score": 1, "reason": "MVP이지만 실제로 작동해서 기본 신뢰는 형성됨. 장기 지속성은 불확실."},
          "mvp_quality":       {"score": 1, "reason": "저장 버튼 간헐적 오류 외 핵심 기능은 정상 동작."},
          "problem_intensity": {"score": 2, "reason": "보고서 작업이 매일 1-2시간 소요. 해결 시 체감 효과 큼."},
          "diy_substitution":  {"score": 1, "reason": "노션 템플릿으로 일부 해결 가능하지만 자동화 수준에서 차별화."},
          "social_proof":      {"score": 1, "reason": "팀 내 도구 공유 가능성 있음. 아직 팀 전체 채택은 미확인."},
          "retention":         {"score": 2, "reason": "매일 쓰는 업무 루틴에 통합되어 재방문 동기가 자연스럽게 형성됨."}
        }
      }
    },
    {
      "persona_meta": {
        "id": "p-002",
        "name": "박민준",
        "age": 45,
        "occupation": "중소기업 영업부장",
        "bio": "15년 영업 경력. 엑셀과 이메일로 모든 업무를 처리하며 새 도구 도입에 보수적이다. 모바일 업무 비중이 70% 이상이다.",
        "tier": "lite",
        "ocean": {
          "openness": 0.30,
          "conscientiousness": 0.80,
          "extraversion": 0.70,
          "agreeableness": 0.55,
          "neuroticism": 0.35
        },
        "innovation_adoption": "late_majority",
        "willingness_to_pay": "low",
        "daily_usage_likelihood": "low"
      },
      "behavior_tracking": {
        "activated": false,
        "activation_reason": "playwright_failure",
        "e2e_method": "playwright",
        "core_action_count": 1,
        "playwright_results": {
          "steps_completed": 3,
          "steps_failed": 4,
          "error_messages": [
            "Mobile viewport not supported",
            "Navigation timeout after 10s"
          ]
        }
      },
      "pre_survey": {
        "pain": 1,
        "alternative_advantage": 0
      },
      "survey_eligible": false,
      "survey_responses": null,
      "classification": {
        "label": "ND",
        "eight_axis_scores": {
          "inertia":           {"score": 0, "reason": "15년 된 엑셀 워크플로 전환 의지 없음. '지금도 잘 되는데'."},
          "frequency":         {"score": 1, "reason": "해당 기능이 필요한 상황이 주 1-2회에 불과."},
          "trust":             {"score": 0, "reason": "회사명 없는 MVP 사이트에 업무 데이터 입력 거부감."},
          "mvp_quality":       {"score": 0, "reason": "모바일 미지원으로 핵심 사용 시나리오 자체가 불가."},
          "problem_intensity": {"score": 1, "reason": "불편하지만 지금 방식으로도 해결되고 있음."},
          "diy_substitution":  {"score": 0, "reason": "엑셀 + 카카오톡으로 충분히 대체 가능."},
          "social_proof":      {"score": 0, "reason": "팀이 이 도구를 쓰지 않는 한 혼자 도입할 이유 없음."},
          "retention":         {"score": 0, "reason": "시간 절약 효과가 학습 비용과 전환 비용을 상쇄하지 못함."}
        }
      }
    }
  ]
}
```

**Field notes:**
- `meta.status`: `"complete"` = 정상 완료. `"partial"` = 에이전트 중간 실패 또는 INSUFFICIENT_USERS 조기 종료. Dashboard와 Conductor는 `"partial"` 파일을 무시하거나 경고 표시해야 한다 (HR-1).
- `behavior_tracking.activation_reason`: `activated=true`이면 `"success"`, 사전 설문 ND 확정이면 `"pre_survey_nd"`, Playwright 실패이면 `"playwright_failure"`, WebFetch fallback도 실패이면 `"webfetch_failure"`.
- `behavior_tracking.e2e_method`: 사전 설문 ND로 E2E 미수행 시 `null` 허용.
- `pre_survey`: E2E 체험 전 수행. `pain` 0=느끼지 못함, 1=불편하지만 살 만함, 2=진짜 고통. `alternative_advantage` 0=기존으로 충분, 1=약간 다름, 2=압도적 우위.
- `survey_eligible`: `behavior_tracking.activated == true`인 경우에만 `true`. `false`이면 `survey_responses`는 `null`.
- `survey_responses.q1_disappointment`: `"not_applicable"` 응답자는 PMF 비율 계산 모수에서 제외되지만 파일에는 기록한다.
- `survey_responses.q4_conversion_condition`: VSD이면 문자열, VD/NSD/ND이면 `null`.
- `classification.eight_axis_scores`: 8축 고정 — `inertia`, `frequency`, `trust`, `mvp_quality`, `problem_intensity`, `diy_substitution`, `social_proof`, `retention`. 각각 `score`(0-2 정수)와 `reason`(비어있지 않은 문자열) 필수.
- `persona_meta.bio`: `background_story` 원본값. 500자 초과 시 절단 (NFR-3).
- 기존 `state/validator-v2/status.json`, `step-1.json`, `step-2.json` 구조는 변경 없이 유지된다 (NFR-5).

---

## Notes

- All timestamps use ISO 8601 format with timezone offset (e.g., `2026-03-29T09:00:00+09:00`).
- `null` values indicate a field has not yet been populated (loop not started, or stage not reached).
- `state/products/`, `state/personas/`, and `state/ideas/` are directories holding one JSON file per entity, keyed by ID.
- `scripts/init-state.sh` initializes the root-level JSON files on first run without overwriting existing files.

---

## Migration Compatibility (HR-5)

기존 진행 중인 사이클의 `state/products/{id}.json`에 신규 필드가 없을 수 있다.
Validator는 아래 필드가 absent일 경우 null default로 처리하고 에러를 발생시키지 않는다:
- `validation.wtp_distribution` → null
- `validation.wtp_median` → null
- `validation.price_ceiling_avg` → null
- `validation.resemblance_score` → null
- `validation.confidence_basis` → null
- `validation.q1_distribution.vsd_count` → 0
- `validation.q1_distribution.nsd_count` → 0

`state/ideas/{id}.json`에 신규 필드가 없을 경우:
- `keywords` → [] (빈 배열, pain_match_bonus=0으로 처리)
- `raw_voices` → [] (빈 배열, raw_voices 없음으로 처리, NFR-2 fallback)

`iterate_history[]` 엔트리에 신규 필드가 없을 경우 (기존 형식 호환):
- `iterate_history[].product_id` → null
- `iterate_history[].version_path` → null
- `iterate_history[].iterate_direction_applied` → null
- `iterate_history[].surveyed_count` → null
- `iterate_history[].q1_distribution` → null
- `iterate_history[].q2_hxc_profile` → null
- `iterate_history[].q3_top_strengths` → []
- `iterate_history[].q4_top_improvements` → []
- `iterate_history[].funnel` → null (v3 퍼널 데이터 — v2 엔트리는 없음)

`state/products/{id}.json` 슬롯 관련 신규 필드:
- `slot_type` → "normal" (기본값)

`state/products/{id}.json` validation v3 신규 필드:
- `validation.validator_version` → "v2" (기본값)
- `validation.funnel` → null (v2 제품에는 없음)
- `validation.unexpected_segments` → [] (빈 배열)

`state/personas/{product_id}.json` v3 신규 필드:
- `persona_mode` → "target_only" (기본값)
- `total_count` → personas 배열 길이
- `target_count` → total_count (v2는 전원 타겟)
- `nontarget_count` → 0
- `personas[].segment_type` → "target" (기본값)

**중요**: `iterate_history`는 append-only 배열이다. 기존 엔트리를 수정/삭제하지 않고, 새 버전 완료 시 배열 끝에 추가만 한다.

No schema version bump is required — all new fields are nullable additions.

---

## `state/conductor-log.json`

**Purpose**: Conductor 에이전트의 단계별 활동 로그. 각 파이프라인 단계 시작/완료 이벤트를 시간순으로 기록한다.

**Who writes**: Conductor agent — 매 단계 전환 시 append.
**Who reads**: `/omp:status` skill, 대시보드 (향후 Activity Feed).

```json
{
  "events": [
    {
      "timestamp": "2026-03-29T10:03:00+09:00",
      "cycle": 1,
      "product_id": "idea-20260329-100300",
      "product_name": "CalenScope",
      "stage": "ideating|spec|build|qa|deploy|validate|kill",
      "message": "트렌드 스크래핑 시작",
      "duration_sec": null,
      "pmf_score": null,
      "verdict": null,
      "url": null
    }
  ]
}
```

**관리 규칙**:
- 최근 200개 이벤트만 유지 (오래된 것 자동 제거)
- 새 루프 시작 시 초기화하지 않음 (이전 루프 로그도 보존)
