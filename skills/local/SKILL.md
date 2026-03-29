---
name: omp:local
description: 로컬 모드 SEPE PMF 탐색 루프를 시작한다
user-invocable: true
---

# /omp:local

SEPE 엔진의 PMF 탐색 루프를 로컬 모드로 시작한다. Vercel 배포 대신 로컬 Next.js dev 서버로 제품을 서빙한다.

## 사용법
```
/omp:local                    # 기본 (로컬 서빙 SEPE 루프 시작)
/omp:local --ideas 10         # 초기 아이디어 10개 생성
/omp:local --parallel 2       # 병렬 2 슬롯
/omp:local --ideas 10 --parallel 2  # 조합 가능
/omp:local stop {product-id}  # 특정 제품 로컬 서버 중지
/omp:local stop --all         # 모든 로컬 서버 중지
/omp:local list               # 실행 중인 로컬 서버 목록
```

## 서브커맨드

### 기본 (SEPE 루프 시작)
`/omp:local` 또는 `/omp:local --ideas N --parallel N`

omp:run과 동일한 SEPE 루프를 시작하되, Conductor에게 `--local` 플래그를 전달한다.
Conductor는 Step 6(배포)에서 Deployer 대신 Local-Deployer를 호출한다.

### stop
```
/omp:local stop {product-id}  # 특정 제품 서버 중지
/omp:local stop --all         # 모든 로컬 서버 중지
```
`scripts/local-server.js`를 호출하여 프로세스를 종료한다.

### list
```
/omp:local list
```
현재 실행 중인 로컬 서버 목록을 표시한다. (product_id, port, pid, status)

## 실행 절차

### Step 0: 작업 디렉토리 초기화

omp:run과 동일한 초기화 수행:

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
mkdir -p state/products state/personas state/ideas projects
```

#### 0e. state/ 초기화
```
bash scripts/init-state.sh
```

#### 0f. 기존 로컬 서버 정리
```
node scripts/local-server.js stop-all
```
이전 루프의 Next.js 프로세스를 모두 종료하고 local-ports.json을 초기화한다.

#### 0g. local-ports.json 초기화
```
if state/local-ports.json 없으면:
  {"base_port": 20000, "max_port": 21000, "services": {}} 생성
```

※ Vercel 로그인 확인과 슬롯 생성은 로컬 모드이므로 건너뛴다.

### Step 1: checkpoint.json 확인
- omp:run과 동일

### Step 2: dashboard.json 초기화
- status: "running"
- started_at: 현재 시간

### Step 3: 대시보드 자동 시작
```
Bash(run_in_background=true): cd dashboard && npm run dev
Bash: sleep 3 && open http://localhost:5483
```

### Step 4: 초기 아이디어 큐 생성
- omp:run과 동일 (기본 5개)

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
  prompt="SEPE 루프를 시작한다. --local 모드. parallel_slots={N}, initial_ideas={ideas_count}. state/queue.json에서 아이디어를 꺼내 파이프라인을 실행하라. 큐가 비면 Ideator를 호출하여 보충하라. Step 6(배포)에서는 omp:deployer 대신 omp:local-deployer를 사용하라."
)
```
