---
name: omp:run
description: SEPE PMF 탐색 루프를 시작한다
user-invocable: true
---

# /omp:run

SEPE 엔진의 PMF 탐색 루프를 시작한다. 해커톤 당일 09:00에 실행하면 21:00까지 자율 운영된다.

## 사용법
```
/omp:run                  # 기본 (병렬 2 슬롯, 초기 아이디어 5개)
/omp:run --parallel 3     # 병렬 3 슬롯
/omp:run --ideas 20       # 초기 아이디어 20개 생성 후 큐에 적재
/omp:run --dry-run        # Vercel 배포 건너뛰기 (테스트용)
/omp:run --ideas 10 --dry-run --parallel 3  # 조합 가능
```

## 실행 절차

### Step 0: 작업 디렉토리 초기화

현재 작업 디렉토리(CWD)에 필요한 파일이 없으면 플러그인 디렉토리에서 복사한다.
플러그인 설치 경로는 Glob으로 탐색한다: `~/.claude/plugins/cache/**/oh-my-pmf/**/sepe-template/package.json`

#### 0a. sepe-template 확인 및 복사
```
if sepe-template/package.json 없으면:
  1. 플러그인 디렉토리에서 sepe-template/ 복사 (rsync, node_modules 제외)
  2. cd sepe-template && npm install
  3. npm run build (검증)
```

#### 0b. dashboard 확인 및 복사
```
if dashboard/package.json 없으면:
  1. 플러그인 디렉토리에서 dashboard/ 복사 (rsync, node_modules 제외)
  2. cd dashboard && npm install
```

#### 0c. scripts 확인 및 복사
```
if scripts/init-state.sh 없으면:
  플러그인 디렉토리에서 scripts/ 복사
```

#### 0d. 디렉토리 생성
```
mkdir -p state/products state/personas state/ideas state/.locks projects
```

#### 0e. state/ 초기화
```
bash scripts/init-state.sh
```

#### 0f. Vercel 로그인 확인
```
vercel whoami 2>&1
if 실패하면:
  "⚠️ Vercel 로그인이 필요합니다. 터미널에서 'vercel login'을 실행해 주세요." 출력 후 중단
  (--dry-run 모드면 스킵)
```

#### 0g. Vercel 슬롯 사전 생성 (--dry-run이 아닐 때)
```
if state/deployments.json의 slots가 전부 null이면:
  bash scripts/seed-vercel-slots.sh
```

### Step 1: checkpoint.json 확인
- last_completed_cycle > 0이면 이전 세션 존재
- "이전 세션 데이터가 있습니다. 새로 시작하시겠습니까?" 확인
- 이어서 하려면 /omp:resume 안내

### Step 2: dashboard.json 초기화
- status: "running"
- started_at: 현재 시간

### Step 3: 대시보드 자동 시작
```
Bash(run_in_background=true): cd dashboard && npm run dev
Bash: sleep 3 && open http://localhost:5483
```
→ 대시보드가 브라우저에 자동으로 열린다

### Step 4: 초기 아이디어 큐 생성

`--ideas N` 옵션이 있으면 (기본값: 5):
```
N회 반복:
  Agent(
    subagent_type="omp:ideator",
    prompt="아이디어 1개 생성. killed_ideas: {큐에서 읽기}, recent_categories: {최근 3개}"
  )
  → 결과를 state/ideas/{id}.json 저장
  → state/queue.json의 pending_ideas에 추가
```

큐에 N개 아이디어가 적재된 후 Conductor가 순차적으로 소비한다.
큐가 비면 Conductor가 Ideator를 다시 호출하여 보충한다.

### Step 4.5: Watchdog 크론 등록
```
CronCreate(
  cron="*/3 * * * *",
  recurring=true,
  prompt="omp watchdog 체크:
1. state/dashboard.json을 읽어 status 확인. 파일이 없거나 stopped 또는 completed이면 아무것도 하지 말고 조용히 종료.
2. state/heartbeat.json을 읽어 last_beat 확인. 파일이 없으면 stale로 간주하고 step 3으로.
3. last_beat가 null이거나 현재 시각 대비 2분(120초) 이상 경과했으면 /omp:resume 실행.
4. 그 외에는 아무것도 하지 않고 조용히 종료 (출력 없음)."
)
```
→ 3분마다 heartbeat staleness를 감지하여 Conductor 중단 시 자동 재개
→ 세션 종료 시 또는 7일 후 자동 만료 (CronCreate 기본 동작)

### Step 5: Conductor 에이전트 호출
```
Agent(
  subagent_type="omp:conductor",
  prompt="SEPE 루프를 시작한다. parallel_slots={N}, dry_run={bool}, initial_ideas={ideas_count}. state/queue.json에서 아이디어를 꺼내 파이프라인을 실행하라. 큐가 비면 Ideator를 호출하여 보충하라."
)
```

※ --dry-run 옵션은 해커톤 전일 테스트 용도. Deployer 호출을 건너뛰고 나머지 파이프라인만 실행.
