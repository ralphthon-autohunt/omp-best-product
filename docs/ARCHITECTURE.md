# oh-my-pmf 아키텍처 및 작동 원리

> SEPE 엔진 — 자율 PMF 탐색 시스템
> Sean Ellis 실망 테스트를 자율 반복하는 Claude Code 플러그인

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [핵심 컨셉](#2-핵심-컨셉)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [작동 흐름](#4-작동-흐름)
5. [에이전트 상세](#5-에이전트-상세)
6. [페르소나 시스템](#6-페르소나-시스템)
7. [PMF 검증 프로세스](#7-pmf-검증-프로세스)
8. [상태 관리](#8-상태-관리)
9. [대시보드](#9-대시보드)
10. [에러 복구](#10-에러-복구)

---

## 1. 프로젝트 개요

### 풀고자 하는 문제

스타트업이 제품-시장 적합성(Product-Market Fit, PMF)을 찾는 데는 보통 수개월에서 수년이 걸린다. 기존 방식은 사람이 아이디어를 구상하고, 개발자가 코드를 짜고, 실제 사용자를 모집해 인터뷰하는 순차적 프로세스다. 이 과정은 느리고 비싸며, 생존자 편향과 응답 편향에 취약하다.

### 해결 방법

oh-my-pmf(SEPE 엔진)는 이 전체 과정을 AI 에이전트 팀이 자율적으로 수행하게 한다.

```
아이디어 발굴 → MVP 빌드 → 배포 → AI 페르소나 검증 → 판정 → 개선/폐기
```

이 사이클을 12시간 동안 인간 개입 없이 반복한다. 핵심 가치는 제품을 많이 만드는 것이 아니라, **Sean Ellis 실망 테스트를 통해 PMF를 탐색하는 프로세스 자체의 품질**에 있다.

### Sean Ellis 실망 테스트란?

Superhuman의 CEO Rahul Vohra가 정립한 PMF 측정 방법론이다. 핵심 질문은:

> "이 제품을 더 이상 사용할 수 없다면 어떤 기분이 들겠습니까?"

응답 중 **"매우 실망할 것이다"**의 비율이 40% 이상이면 PMF를 달성했다고 판단한다. Superhuman은 이 방법론에 3가지 질문을 더해 4질문 세트로 확장했다:

| Q | 질문 | 용도 |
|---|------|------|
| Q1 | 이 제품을 더 이상 사용할 수 없다면? | PMF Score 계산 |
| Q2 | 이 제품을 가장 잘 쓸 사람은? | 이상 고객(HXC) 프로필 도출 |
| Q3 | 이 제품의 주요 혜택은? | 강화할 강점 파악 |
| Q4 | 어떻게 개선하면 좋을까? | 이탈 방지 포인트 파악 |

Superhuman은 이 4질문 결과로 다음 전략을 수립한다:
- Q3 강점의 50%를 더 강화 (만족 사용자를 더 만족시킴)
- Q4 개선점의 50%를 반영 ("약간 실망" 사용자를 "매우 실망"으로 전환)

oh-my-pmf는 이 전체 프로세스를 AI 에이전트가 자동으로 수행한다.

---

## 2. 핵심 컨셉

### Claude Code 플러그인으로서의 아키텍처

oh-my-pmf는 별도의 서버(FastAPI, Express 등)를 띄우지 않는다. **Claude Code 세션 자체가 런타임**이다.

```
일반적인 AI 에이전트 시스템:
  Python 서버 → LLM API 호출 → 결과 처리 → DB 저장

oh-my-pmf:
  Claude Code 세션 → 플러그인 에이전트 호출 → 파일 I/O → 다음 에이전트 호출
```

이 방식의 장점:
- 서버 인프라 관리 불필요 (pm2, Docker, DB 없음)
- Claude Code의 모든 도구(Bash, Write, WebSearch 등)를 그대로 활용
- 에이전트 간 통신이 단순 (파일 읽기/쓰기)

단점:
- Claude Code 세션이 끊어지면 루프가 중단됨 → `/omp:resume`으로 복구

### 파일 기반 상태 관리

모든 상태는 `state/` 디렉토리의 JSON 파일로 관리된다. 데이터베이스가 없다.

```
state/
  dashboard.json       ← 대시보드가 폴링하는 데이터
  checkpoint.json      ← 세션 복구 지점
  heartbeat.json       ← 세션 생존 확인
  queue.json           ← 아이디어 큐 + KILL 히스토리
  budget.json          ← API 비용 추적
  deployments.json     ← Vercel 배포 이력
  products/{id}.json   ← 제품별 전체 생명주기
  personas/{id}.json   ← 페르소나 풀
  ideas/{id}.json      ← 생성된 아이디어
```

왜 DB가 아닌 파일인가:
- Claude Code 서브에이전트는 공유 메모리를 가질 수 없음
- 파일이 에이전트 간 유일한 IPC(프로세스 간 통신) 채널
- `isolation: worktree`로 병렬 실행 시에도 파일 경로로 데이터 교환 가능
- 세션 드롭 후에도 파일은 디스크에 남아있어 복구 가능

### 병렬 파이프라인

Conductor는 2~3개의 제품 파이프라인을 동시에 실행할 수 있다.

```
Pipeline A: Ideator → Builder → Deployer → Persona → Validator
Pipeline B: Ideator → Builder → Deployer → Persona → Validator
Pipeline C: Ideator → Builder → Deployer → Persona → Validator
```

각 파이프라인은 `background: true` + `isolation: worktree`로 독립된 작업 공간에서 실행되어 파일 충돌이 없다. 실질적 병렬 상한은 2~3개 (Claude API TPM 레이트 리밋이 병목).

---

## 3. 시스템 아키텍처

### 전체 구조

```
┌─────────────────────────────────────────────────────┐
│                Claude Code 세션 (런타임)               │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │            oh-my-pmf 플러그인                      │ │
│  │                                                   │ │
│  │  Skills                                           │ │
│  │  ├── /omp:run    → 루프 시작                       │ │
│  │  ├── /omp:status → 상태 조회                       │ │
│  │  └── /omp:resume → 세션 복구                       │ │
│  │                                                   │ │
│  │  Agents                                           │ │
│  │  ├── Conductor ─── 루프 오케스트레이터              │ │
│  │  │   ├── Ideator ──── 트렌드 스크래핑 + 아이디어    │ │
│  │  │   ├── Builder-PM ── 제품 스펙                   │ │
│  │  │   ├── Builder-Engineer ── 코드 생성 + 빌드      │ │
│  │  │   ├── Builder-QA ── 빌드 검증                   │ │
│  │  │   ├── Deployer ──── Vercel 배포                 │ │
│  │  │   ├── Persona ───── 페르소나 생성/증식/진화      │ │
│  │  │   └── Validator ─── Sean Ellis 4Q 검증          │ │
│  │  │                                                │ │
│  │  State (파일 기반)                                 │ │
│  │  └── state/*.json                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │ sepe-template │  │  dashboard   │                  │
│  │  (Next.js)    │  │  (Next.js)   │                  │
│  │  Builder fork │  │  port 5483   │                  │
│  └──────────────┘  └──────┬───────┘                  │
└───────────────────────────┼───────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   브라우저     │
                    │ 파일 폴링 20s  │
                    └───────────────┘
```

### 에이전트 호출 체인

```
/omp:run
  └── Conductor (루프)
        ├── Ideator         WebSearch로 트렌드 수집 → 아이디어 JSON 생성
        ├── Builder-PM      아이디어 → 구현 가능한 제품 스펙 변환
        ├── Builder-Engineer 템플릿 fork → 코드 생성 → npm run build
        ├── Builder-QA      .next/ 확인, 에러 체크, 플레이스홀더 잔존 확인
        ├── Deployer        vercel --prod → URL 헬스체크
        ├── Persona         50명 페르소나 풀 생성 (3-tier)
        ├── Validator       Sean Ellis 4Q → PMF Score → 판정
        │
        ├── [GRADUATE] → Persona(proliferate) → Persona(expand_market)
        ├── [ITERATE]  → Builder-PM(개선) → Builder-Engineer → ... → Validator (최대 3회)
        ├── [PIVOT]    → Persona(새 세그먼트) → Validator
        └── [KILL]     → 큐에 기록 → 다음 사이클
```

### Builder 팀 구조

Builder는 시스템 내 유일한 "팀" 구조 에이전트다. 나머지는 모두 단일 역할 에이전트.

```
Builder Team (스타트업처럼 협업)
├── PM        아이디어를 구현 가능한 스펙으로 변환
│             ITERATE 시 Superhuman 50:50 개선 로드맵 작성
│
├── Engineer  sepe-template을 fork하여 핵심 기능 1개 코드 생성
│             Next.js + shadcn/ui + localStorage 기반
│             npm run build 실행
│
└── QA        빌드 성공 확인 (.next/ 존재, 에러 없음)
              플레이스홀더 잔존 확인
              feature/page.tsx 내용 검증
```

---

## 4. 작동 흐름

### `/omp:run` 실행 시 전체 흐름

```
Step 0: 작업 디렉토리 초기화
  ├── sepe-template/ 복사 + npm install
  ├── dashboard/ 복사 + npm install
  ├── state/ 초기화 (6개 JSON)
  ├── Vercel 로그인 확인
  └── Vercel 5-슬롯 사전 생성

Step 1: checkpoint.json 확인 (이전 세션 데이터 유무)

Step 2: dashboard.json 초기화 (status: running)

Step 3: 대시보드 자동 시작 (localhost:5483, 브라우저 열림)

Step 4: 초기 아이디어 큐 생성 (--ideas N, 기본 5개)

Step 5: Conductor 에이전트 호출 → 메인 루프 시작
```

### 단일 PMF 탐색 사이클 (약 11분 목표)

```
 1. Heartbeat 갱신 ──────────────────── 세션 생존 확인
 2. 큐에서 아이디어 꺼내기 ────────────── (큐 비면 Ideator 호출)
 3. Builder-PM ──────────────────────── 스펙 정의 (~30초)
 4. Builder-Engineer ────────────────── 코드 생성 + 빌드 (~3분)
 5. Builder-QA ──────────────────────── 빌드 검증 (~30초)
 6. Deployer ────────────────────────── Vercel 배포 + 헬스체크 (~2분)
 7. Persona ─────────────────────────── 50명 페르소나 생성 (~2분)
 8. Validator ───────────────────────── Sean Ellis 4Q 실행 (~3분)
 9. 판정 ────────────────────────────── GRADUATE/ITERATE/PIVOT/KILL
10. DISCOVERY_LOG.md 갱신 ────────────── 스토리 기록
11. 상태 갱신 ───────────────────────── dashboard.json, checkpoint.json
```

### 판정별 후속 처리

**GRADUATE (PMF Score >= 55%)**
```
PMF 달성! 이 제품은 시장에 맞는다.
  → Bass Diffusion 증식: 만족한 페르소나가 네트워크로 새 유저를 데려옴
  → 시장 확장 체크: PMF>40% → Early Adopters, PMF>55% + K>0.5 → Early Majority
  → 다음 아이디어로 진행
```

**ITERATE (40% <= PMF Score < 55%)**
```
가능성 있다. 개선하면 PMF에 도달할 수 있다.
  → Superhuman 50:50 전략:
    - Q3 강점 50% 강화 (만족 사용자를 더 만족시킴)
    - Q4 개선점 50% 반영 ("약간 실망" → "매우 실망" 전환)
  → Builder-PM이 개선 로드맵 작성
  → Builder-Engineer가 코드 수정
  → 재검증 (같은 페르소나가 기억을 가지고 재평가)
  → 최대 3회 반복 후 최고 점수 버전으로 확정
```

**PIVOT (25% <= PMF Score < 40%)**
```
제품은 괜찮지만 타깃이 잘못됐다.
  → Q2(이상 고객 프로필)에서 실제로 좋아하는 사람의 특성 추출
  → 새로운 타깃 세그먼트로 페르소나 풀 재생성
  → 같은 제품을 새 세그먼트로 재검증
```

**KILL (PMF Score < 25%)**
```
시장이 원하지 않는다. 폐기.
  → KILL 이유를 큐에 기록 (다음 아이디어에서 유사 아이디어 필터링)
  → 즉시 다음 사이클로 진행
```

---

## 5. 에이전트 상세

### Conductor

시스템의 두뇌. 전체 루프를 제어하고 다른 에이전트를 순서대로 호출한다.

| 항목 | 내용 |
|------|------|
| 모델 | Sonnet |
| 역할 | 루프 오케스트레이션, 판정, 에러 복구 |
| maxTurns | 200 (12시간 연속 실행) |
| 핵심 도구 | Agent (서브에이전트 호출), Read/Write (상태 파일), Bash |

Conductor는 다른 에이전트를 호출할 때 **필요한 최소 컨텍스트만** 프롬프트에 주입한다. 전체 히스토리를 전달하지 않음으로써 12시간 동안 컨텍스트 윈도우가 소진되지 않도록 한다.

### Ideator

실시간 트렌드 스크래핑으로 제품 아이디어를 생성한다.

| 항목 | 내용 |
|------|------|
| 모델 | Sonnet |
| 핵심 도구 | WebSearch, WebFetch |
| 트렌드 소스 | ProductHunt, HackerNews, Reddit |

트렌드 스크래핑 흐름:
```
WebSearch("site:producthunt.com trending today") → 상위 5개
WebSearch("site:news.ycombinator.com Show HN") → 상위 5개
WebSearch("site:reddit.com/r/startups trending") → 상위 3개
→ 반복 등장 키워드 + 패턴 식별
→ 아이디어 1개 생성
→ KILL 히스토리와 유사도 체크 (60% 이상 겹침 → 재생성)
→ 카테고리 연속 3개 동일 → 강제 전환
```

출력 구조:
```json
{
  "product_name": "TaskSync Pro",
  "one_liner": "팀 업무를 로컬에서 동기화하는 무설치 협업 도구",
  "target_segment": {
    "demographics": "스타트업 PM, 25-35세",
    "needs": "빠른 업무 동기화",
    "pain_points": "Notion/Slack 전환 피로"
  },
  "core_feature": "드래그&드롭 Kanban 보드",
  "differentiation": "백엔드 없이 로컬스토리지 기반",
  "revenue_model": "freemium",
  "category": "productivity",
  "source_trends": ["ProductHunt: Local-first 트렌드", "HN: Show HN offline-first app"]
}
```

### Builder Team (PM + Engineer + QA)

시스템 내 유일한 팀 구조 에이전트.

**Builder-PM** (Haiku)
- 아이디어를 Next.js + localStorage로 구현 가능한 수준으로 스코프 조정
- 색상 테마, UI 컴포넌트 목록, 온보딩 스텝 정의
- ITERATE 시 Superhuman 50:50 개선 로드맵 작성

**Builder-Engineer** (Sonnet)
- sepe-template을 `rsync + symlink`로 fork (node_modules 294MB 중복 방지)
- `app/page.tsx` (랜딩), `app/feature/page.tsx` (핵심 기능), `tailwind.config.ts` (색상)를 Write tool로 생성
- `npm run build` 실행, 실패 시 1회 수정 재시도

**Builder-QA** (Haiku)
- `.next/` 디렉토리 존재 확인
- 빌드 로그 에러 체크
- 필수 파일 존재 확인 (vercel.json, page.tsx, feature/page.tsx)
- 플레이스홀더 잔존 확인 (`{{`, `BUILDER:` 키워드)

### Deployer

Vercel CLI로 배포하고 헬스체크를 수행한다.

| 항목 | 내용 |
|------|------|
| 모델 | Haiku |
| 핵심 도구 | Bash (vercel CLI, curl) |
| 전략 | 5-슬롯 풀링 (sepe-slot-1 ~ sepe-slot-5 순환) |

Vercel Free Plan은 프로젝트 수에 제한이 있다. 5개 고정 프로젝트를 만들어두고 FIFO로 순환 재사용한다.

```
sepe-slot-1 → prod-001 (최초 배포)
sepe-slot-2 → prod-002
...
sepe-slot-5 → prod-005
sepe-slot-1 → prod-006 (slot-1 덮어쓰기, prod-001 URL은 archived)
```

`--dry-run` 모드에서는 배포를 건너뛰고 가상 URL을 반환한다.

### Persona

가장 복잡한 에이전트. 4가지 모드로 동작한다.

| 모드 | 트리거 | 동작 |
|------|--------|------|
| create | 새 제품 | 50명 페르소나 풀 생성 |
| iterate | ITERATE 판정 | 기존 페르소나 기억 업데이트 + 행동 변화 |
| proliferate | GRADUATE | Bass Diffusion 입소문 시뮬레이션 |
| expand_market | PMF 달성 | Crossing the Chasm 시장 확장 |

(상세는 [6. 페르소나 시스템](#6-페르소나-시스템) 참조)

### Validator

Sean Ellis 4질문 PMF 검증을 실행하고 판정을 내린다.

| 항목 | 내용 |
|------|------|
| 모델 | Sonnet |
| 핵심 로직 | 3-tier 검증 (Deep/Mid/Lite) |
| 판정 | GRADUATE(55%+) / ITERATE(40-54%) / PIVOT(25-39%) / KILL(<25%) |

(상세는 [7. PMF 검증 프로세스](#7-pmf-검증-프로세스) 참조)

---

## 6. 페르소나 시스템

### 3-tier 하이브리드 구조

50명의 페르소나를 3개 티어로 나눠 비용과 품질을 균형 잡는다.

```
┌─────────────────────────────────────────────────┐
│              페르소나 풀 (50명/제품)                │
│                                                   │
│  Deep (10명, 20%)          Claude Sonnet           │
│  ├── Q1~Q4 자연어 응답                              │
│  ├── 구체적 피드백 + 인용 가능한 코멘트              │
│  ├── 기억/반성/행동 변화 (Stanford Generative)      │
│  └── 배경 스토리, 네트워크 연결                      │
│                                                   │
│  Mid (15명, 30%)           Claude Haiku            │
│  ├── Q1 판정 + Q3/Q4 키워드 응답                    │
│  └── 경량 프로필                                    │
│                                                   │
│  Lite (25명, 50%)          규칙 기반 (API 없음)     │
│  ├── Q1 확률 판정 (OCEAN + 행동 가중치)              │
│  └── API 호출 0건 → 비용 절약                       │
└─────────────────────────────────────────────────┘
```

### 페르소나 프로필 (3차원)

각 페르소나는 세 가지 차원으로 구성된다:

**Demographics (인구통계)**
- 이름, 나이, 직업, 소득, 거주지
- 세그먼트 내 상관관계 반영 (나이↔소득↔위치)

**Behavioral (행동)**
- 기술 친숙도 (0~1)
- 가격 민감도 (0~1)
- 경쟁 제품 사용 이력

**Psychographic (심리)**
- Big Five OCEAN 성격 모델
  - Openness (개방성): 새로운 것에 대한 수용도
  - Conscientiousness (성실성): 체계적 판단 성향
  - Extraversion (외향성): 사회적 영향력
  - Agreeableness (동조성): 비판적 vs 동조적 평가
  - Neuroticism (신경증): 변화에 대한 불안
- 리스크 태도 (aggressive/moderate/conservative)
- 혁신 수용도 (Rogers Curve: innovator → laggard)

### OCEAN 기반 다양성 강제

50명 풀 내에서 OCEAN 분포를 강제하여 동질적 응답 편향을 방지한다.

```
Openness:       낮음 15명 | 중간 20명 | 높음 15명
Extraversion:   내향 25명 | 외향 25명
Agreeableness:  비판적 15명 | 중립 20명 | 동조적 15명

혁신 수용도 (Rogers Curve):
  Innovators (2.5%):     2명 이상 강제 포함
  Early Adopters (13%):  6명 이상
  Early Majority (34%):  17명
  Late Majority (34%):   17명
  Laggards (16%):        8명
```

이렇게 하면 같은 제품에 대해서도 "혁신적이라 좋다"부터 "너무 불안정하다"까지 다양한 반응이 나온다.

### Bass Diffusion 입소문 시뮬레이션

GRADUATE 판정 제품에서 만족한 페르소나(만족도 > 0.7)가 네트워크를 통해 새 유저를 데려온다.

```
만족한 페르소나 (Sarah, satisfaction=0.85)
  │
  ├── 네트워크 연결: [Mike, Jane, Tom]
  │
  ├── Mike (innovator, tech_savvy=0.9)
  │   추천 확률 = 0.85 × 0.7(extraversion) × 0.8 = 0.476
  │   채택 확률 = 0.476 × 1.0(innovator 가중치) = 0.476
  │   → random() < 0.476 → 채택! 풀에 추가
  │
  ├── Jane (late_majority, tech_savvy=0.3)
  │   채택 확률 = 0.476 × 0.3(late_majority 가중치) = 0.143
  │   → random() > 0.143 → 미채택
  │
  └── Tom (early_adopter, tech_savvy=0.7)
      채택 확률 = 0.476 × 0.8(early_adopter 가중치) = 0.381
      → random() < 0.381 → 채택! 풀에 추가

바이럴 계수 K = 실제 채택 수 / 만족 페르소나 수
K > 1.0 → 자연 성장 (풀이 자동으로 커짐)
K < 1.0 → 마케팅 필요 (기록만)
```

### 이탈 시뮬레이션

매 스프린트마다 각 페르소나의 이탈 가능성을 계산한다.

```
이탈 확률 = 기본 이탈률(0.05)
          × (1 - 평균 만족도)
          × (1 + 경쟁 제품 수 × 0.1)
          × (1 - conscientiousness × 0.5)

연속 3스프린트 불만족(satisfaction < 0.3):
  → 이탈 확률 +0.3
  → 이탈 시: churned=true
  → 네트워크에 부정적 입소문: 연결된 페르소나 satisfaction -0.1
```

### Crossing the Chasm 시장 확장

PMF 달성 후 페르소나 풀을 단계적으로 확장한다.

```
Innovators (50명, 기본)
    ↓ PMF > 40%
Early Adopters (+100명, 비전 공감형)
    ↓ PMF > 55% AND K > 0.5
Early Majority (+200명, 실용적, 가격 민감)
```

새 세그먼트의 페르소나는 이전 세그먼트와 OCEAN 분포가 다르다:
- Early Adopters: openness 높음, risk_attitude=aggressive 비중↑
- Early Majority: conscientiousness 높음, price_sensitivity 높음

### Stanford Generative Agents 기억/진화

ITERATE 판정 시, Deep 10명 페르소나가 이전 스프린트의 경험을 기억한다.

```
Sprint 1:
  Sarah: "UI가 직관적이었지만 팀 공유 기능이 없어서 아쉬웠다"
  satisfaction: 0.65

Sprint 2 (팀 공유 기능 추가 후):
  Sarah: "팀 공유가 추가되었다! 기본적이지만 방향은 맞다"
  satisfaction: 0.75 (↑0.10)
  → ocean.openness +0.05 (더 열린 태도)

Sprint 3:
  Sarah의 반성: "이 제품이 내 문제를 실제로 해결하고 있는가? → 예, 점점 나아지고 있다"
  → 다음 평가에서 더 긍정적 평가 가능성↑
```

이를 통해 "v1에서 실망했지만 v3에서 만족으로 전환" 같은 현실적 행동이 시뮬레이션된다.

---

## 7. PMF 검증 프로세스

### Sean Ellis 4질문 실행

| Q | 질문 | Deep (10명) | Mid (15명) | Lite (25명) |
|---|------|------------|-----------|------------|
| Q1 | 더 이상 사용할 수 없다면? | Sonnet 자연어 | Haiku 판정 | 규칙 기반 확률 |
| Q2 | 이 제품을 가장 잘 쓸 사람은? | Sonnet 자연어 | - | - |
| Q3 | 주요 혜택은? | Sonnet 자연어 | Haiku 키워드 | - |
| Q4 | 어떻게 개선하면? | Sonnet 자연어 | Haiku 키워드 | - |

### Deep 페르소나 프롬프트 예시

```
당신은 다음과 같은 사람입니다:
- 이름: Sarah Kim, 29세, 스타트업 PM
- 성격 (Big Five): O=0.8, C=0.7, E=0.6, A=0.5, N=0.3
- 기술 친숙도: 0.85, 가격 민감도: 0.4
- 배경: "3년차 PM, Notion과 Slack을 하루 8시간 사용, 업무 효율화 도구에 관심 많음"
- 이전 경험: "v1에서 UI는 좋았지만 팀 공유가 없어서 아쉬웠다"

제품 "TaskSync Pro"에 대해:
설명: 팀 업무를 로컬에서 동기화하는 무설치 협업 도구
URL: https://sepe-slot-1.vercel.app

당신의 성격과 경험에 맞게 솔직하게 답하세요.
```

### Lite 규칙 기반 Q1 알고리즘

API 호출 없이 페르소나 속성값으로 "매우 실망" 확률을 계산한다.

```
score = 0.5 (기본)

OCEAN 가중치:
  openness > 0.7      → +0.10
  conscientiousness > 0.7 → +0.05
  extraversion > 0.6   → +0.05
  neuroticism > 0.7    → -0.10

행동 가중치:
  tech_savviness > 0.7 → +0.10
  price_sensitivity > 0.8 → -0.20

혁신 수용도:
  innovator     → +0.20
  early_adopter → +0.15
  early_majority → +0.05
  late_majority → -0.05
  laggard       → -0.15

최종 score로 확률적 판정:
  random < score×0.6 → "매우 실망"
  random < score×0.8 → "약간 실망"
  random < 0.95      → "실망 안 함"
  else               → "해당 없음"
```

### PMF Score 계산

```
PMF Score = ("매우 실망" 응답 수) / (전체 응답 수 - "해당 없음") × 100

예: 매우실망 23명 / (50명 - 4명 해당없음) = 23/46 = 50.0%
→ ITERATE (40~54%)
```

### 판정 기준

| 판정 | 범위 | Sean Ellis 원본 | SEPE 기준 |
|------|------|----------------|----------|
| GRADUATE | 55%+ | 40%+ (PMF 달성) | 55% (더 엄격) |
| ITERATE | 40~54% | - | 가능성 있음, 개선 필요 |
| PIVOT | 25~39% | - | 타깃 재설정 필요 |
| KILL | <25% | - | 시장이 원하지 않음 |

Sean Ellis 원본 기준(40%)과 SEPE GRADUATE 기준(55%)의 차이는 대시보드에 항상 표시된다.

---

## 8. 상태 관리

### 파일별 역할

| 파일 | 용도 | 쓰기 주체 | 읽기 주체 |
|------|------|----------|----------|
| `dashboard.json` | 대시보드 폴링 | Conductor | 대시보드 API |
| `checkpoint.json` | 세션 복구 | Conductor | /omp:resume |
| `heartbeat.json` | 생존 확인 | Conductor | 대시보드 SessionHealth |
| `queue.json` | 아이디어 큐 | Conductor | Conductor, Ideator |
| `budget.json` | 비용 추적 | Conductor | /omp:status |
| `deployments.json` | 배포 이력 | Deployer | Conductor, 대시보드 |
| `products/{id}.json` | 제품 생명주기 | Builder-PM, Validator | Conductor, 대시보드 |
| `personas/{id}.json` | 페르소나 풀 | Persona | Validator |
| `ideas/{id}.json` | 아이디어 | Ideator | Conductor |

### Race Condition 방지

병렬 파이프라인이 공유 파일을 동시에 쓰지 않도록:
- 공유 파일(`queue.json`, `dashboard.json`, `budget.json`) → Conductor만 쓰기
- 제품별 파일(`products/{id}.json`) → 해당 파이프라인만 쓰기
- 페르소나 파일(`personas/{id}.json`) → Persona 에이전트만 쓰기

### DISCOVERY_LOG.md

대시보드가 실시간 숫자를 보여준다면, Discovery Log는 **스토리**를 기록한다.

매 사이클 완료 후 Conductor가 자동 갱신:
- 어떤 트렌드에서 아이디어가 나왔는지
- 빌드/배포 결과
- PMF 검증 결과 + 페르소나 피드백 인용
- 왜 GRADUATE/KILL 됐는지
- ITERATE 개선 과정
- 시장 확장 이력

---

## 9. 대시보드

### 기술 스택

- Next.js 14 + Tailwind CSS + Recharts
- 포트 5483
- 파일 폴링 방식 (WebSocket 없음)

### 통신 방식

```
Conductor → Write → state/dashboard.json
                         ↓
Next.js API route → fs.readFileSync → JSON 반환
                         ↓
브라우저 → fetch("/api/dashboard") 매 20초 폴링
```

WebSocket을 쓰지 않는 이유:
- 12시간 WebSocket 연결 유지의 안정성 부담
- 30초 이내 업데이트면 폴링으로 충분
- Claude Code의 `run_in_background`로 장시간 서버 유지 시 버그 확인됨

발표 시에는 폴링 간격을 5초로 줄일 수 있다.

### 화면 구성

**메인 대시보드**
- StatsBar: 총 사이클, GRADUATE, KILL, ITERATE 카운터
- PipelineView: 현재 진행 중 파이프라인 + 프로그레스바
- PMFChart: Sean Ellis Q1 분포 차트 (Recharts BarChart)
- CategoryStats: 카테고리별 성적
- TopGraduates: Top 3 GRADUATE 제품 (URL 클릭 가능)
- SessionHealth: Heartbeat 상태 (초록/노랑/빨강)
- ThresholdBadge: 판정 기준 항상 표시

**제품 상세 뷰**
- ProductHeader: 제품명, URL, PMF Score, 판정 배지
- Q1Chart: 실망 분포 차트
- PersonaHighlights: Deep 페르소나 피드백 인용
- Timeline: 사이클 타임라인

### 세션 헬스 인디케이터

| Heartbeat 경과 | 상태 | 표시 |
|---------------|------|------|
| < 5분 | 정상 | 🟢 |
| 5~15분 | 주의 | 🟡 |
| > 15분 | 세션 드롭 의심 | 🔴 + "/omp:resume 실행 필요" |

---

## 10. 에러 복구

### 3레이어 복구 체계

```
Layer 1: 에이전트 레벨
  ├── 빌드 실패 → Builder-QA가 1회 재시도 지시
  ├── 빌드 2회 실패 → KILL
  ├── 배포 실패 → Deployer가 1회 재시도
  ├── 배포 2회 실패 → KILL
  └── 사이클 20분 초과 → 강제 KILL

Layer 2: 파이프라인 레벨
  ├── API Rate Limit → 지수 백오프 (2s→4s→8s→16s)
  ├── Vercel 동시 배포 제한 → 60초 대기 후 재시도
  └── WebSearch 실패 → 3회 재시도 → fallback (트렌드 없이 자체 발상)

Layer 3: 세션 레벨
  ├── 세션 드롭 → 대시보드에서 감지 (heartbeat 빨강)
  ├── 팀원이 Claude Code 재시작
  ├── /omp:resume 실행
  ├── checkpoint.json에서 마지막 완료 시점 복구
  ├── 진행 중이던 사이클은 KILL 처리
  └── 5분 이내 루프 재개
```

### 핵심 원칙

**단일 실패가 전체를 멈추면 안 된다.**

어떤 에이전트가 실패하든, 그 사이클만 KILL로 처리하고 다음 사이클로 즉시 진행한다. 12시간 동안 "끊기지 않고 계속 돌아가는 것"이 가장 중요한 요구사항이다.

### Vercel 5-슬롯 풀링

Vercel Free Plan의 프로젝트 수 제한을 우회하기 위해 5개 고정 프로젝트를 순환 사용한다.

```
sepe-slot-1 ~ sepe-slot-5
→ 빈 슬롯 우선 → 없으면 가장 오래된 슬롯 덮어쓰기 (FIFO)
→ 이전 배포 URL은 "archived"로 기록 (덮어써서 접근 불가)
```

해커톤 전에 `scripts/seed-vercel-slots.sh`로 5개 프로젝트를 사전 생성하거나, `/omp:run`이 자동으로 생성한다.
