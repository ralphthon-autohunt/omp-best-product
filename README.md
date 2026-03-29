[발표 자료 (Google Slides)](https://docs.google.com/presentation/d/1JB1zZEh-dPJQhxRCh3fCap7tle0-mp-W-SJBbJKCxWE/edit?usp=sharing)

# oh-my-pmf (omp)

> 자율 PMF 탐색 시스템 — SEPE 엔진
> Claude Code 플러그인으로 12시간 자율 운영

Sean Ellis 실망 테스트(Superhuman PMF Engine)를 자율 반복 실행하여 제품-시장 적합성(PMF)을 탐색하는 Claude Code 플러그인.

아이디어 생성 → MVP 빌드 → Vercel 배포 → AI 페르소나 검증 → 판정(GRADUATE/ITERATE/KILL) 사이클을 인간 개입 없이 반복한다.

## 핵심 가치

제품을 많이 만드는 것이 목적이 **아니다**. **PMF를 탐색하는 프로세스 자체의 품질**이 핵심이다.

- Sean Ellis 4질문 (Q1: 실망도, Q2: 이상 고객, Q3: 강점, Q4: 개선)
- 50명 AI 페르소나 (Big Five OCEAN 기반 다양성)
- Bass Diffusion 입소문 시뮬레이션
- Crossing the Chasm 시장 확장
- Stanford Generative Agents 기억/진화

## 설치

Claude Code 세션 안에서 슬래시 명령으로 설치한다.

### GitHub에서 설치

```
/plugin marketplace add ralphthon-autohunt/oh-my-pmf
/plugin install oh-my-pmf@ralphthon-autohunt-seokan-autohunt
/reload-plugins
```

### 로컬에서 설치

```
/plugin marketplace add ~/Desktop/github/seokan-autohunt
/plugin install oh-my-pmf@ralphthon-autohunt-oh-my-pmf
/reload-plugins
```

## 사용법

### 빠른 시작

원하는 디렉토리에서 Claude Code를 실행하고 `/omp:run`만 치면 된다.

```bash
# 1. 작업 디렉토리 생성
mkdir my-pmf-project && cd my-pmf-project

# 2. Claude Code 시작
claude --dangerously-skip-permissions

# 3. 루프 시작 (자동으로 필요한 파일 초기화)
/omp:run
```

`/omp:run`이 자동으로 처리하는 것:
- `sepe-template/` 복사 + `npm install` (플러그인 디렉토리에서)
- `dashboard/` 복사 + `npm install`
- `state/` 초기화 (6개 JSON 파일)
- `projects/` 디렉토리 생성
- Vercel 로그인 확인 (미로그인 시 안내)
- Vercel 5-슬롯 사전 생성 (최초 실행 시)
- 대시보드 자동 시작 (http://localhost:5483)
- Conductor 루프 시작

### 사전 준비

Vercel CLI 로그인만 미리 해두면 된다 (인터랙티브 로그인이라 자동화 불가):

```bash
npm i -g vercel
vercel login
```

나머지는 `/omp:run`이 전부 자동 처리한다.

### PMF 탐색 루프 시작

```
/omp:run                  # 기본 (병렬 2 슬롯)
/omp:run --parallel 3     # 병렬 3 슬롯
/omp:run --dry-run        # Vercel 배포 없이 테스트
/omp:run --dry-run --parallel 3  # 조합 가능
```

### 상태 조회

```
/omp:status
```

출력 예시:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SEPE 엔진 상태
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💓 Heartbeat: 2분 전 🟢
🔄 총 사이클: 47 | ✅ GRADUATE: 3 | ❌ KILL: 39 | 🔁 ITERATE: 5
💰 예상 비용: $8.43

📋 진행 중:
  - TaskSync Pro: 빌드 중 (Builder-Engineer) ██████░░░░ 60%

🏆 Top GRADUATE:
  1. TaskSync Pro — PMF 61% (Early Adopters 단계)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 세션 복구

Claude Code 세션이 끊어졌을 때:

```
/omp:resume
```

중단된 사이클은 자동 KILL 처리되고, 마지막 완료 시점부터 재개한다.

### 대시보드

`/omp:run` 실행 시 자동으로 시작된다.

```
http://localhost:5483
```

실시간 파이프라인 현황, Sean Ellis 분포 차트, Top GRADUATE 제품, 세션 헬스 인디케이터를 표시한다.

## 아키텍처

### 전체 구조

```
/omp:run
  │
  ├─ Step 0: 환경 초기화 (sepe-template, dashboard, state)
  ├─ Step 1~3: 대시보드 시작 (localhost:5483)
  └─ Step 4~5: Conductor 루프 시작
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Conductor (무한 루프)                        │
│          사람이 멈추거나 세션이 끊길 때까지 반복                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 매 사이클                                            │    │
│  │                                                     │    │
│  │  1. Ideator ─── 트렌드 스캔 → 아이디어 1개 생성        │    │
│  │       │         (이전 KILL/GRADUATE 학습 반영)         │    │
│  │       ▼                                             │    │
│  │  2. Builder-PM ── 스펙 정의 (activation_criteria 포함) │    │
│  │       │                                             │    │
│  │       ▼                                             │    │
│  │  3. Builder-Engineer ⇄ Builder-QA ── 코드 생성 + 검증  │    │
│  │       │                 (빌드 실패 시 1회 재시도)       │    │
│  │       ▼                                             │    │
│  │  4. Deployer ── Vercel 배포 (5-슬롯 풀링)             │    │
│  │       │                                             │    │
│  │       ▼                                             │    │
│  │  5. Persona + Competitor Researcher ── 병렬 실행      │    │
│  │       │    100명 페르소나 생성    경쟁 제품 조사         │    │
│  │       ▼                                             │    │
│  │  6. Validator v2 ── E2E 체험 + 실망 설문 → 판정        │    │
│  │       │                                             │    │
│  │       ├─ GRADUATE (≥55%) → 기록 → 다음 사이클          │    │
│  │       ├─ KILL (<25%) → 기록 + 학습 → 다음 사이클       │    │
│  │       └─ ITERATE (25~54%) ──┐                       │    │
│  │                             ▼                       │    │
│  │                    PM → Engineer ⇄ QA → 재배포       │    │
│  │                    → 새 페르소나 풀 → 재검증            │    │
│  │                    (최대 3회, 이후 최고 점수로 종료)     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  state/     ── 파일 기반 상태 (JSON)                         │
│  projects/  ── 빌드 출력                                     │
│  dashboard/ ── Next.js 대시보드 (파일 폴링)                   │
└─────────────────────────────────────────────────────────────┘
```

### Learnings 피드백 루프

KILL/GRADUATE 결과의 교훈이 다음 사이클의 Ideator와 Builder-PM에 자동 반영된다.
아이디어는 큐에 일괄 생성하지 않고, 매 사이클 1개씩 생성하여 직전 학습을 즉시 반영한다.

### 에이전트 구성

| 에이전트 | 모델 | 역할 |
|---------|------|------|
| Conductor | Sonnet | 루프 오케스트레이션, 판정, 에러 복구 |
| Ideator | Sonnet | ProductHunt/HN/Reddit 트렌드 → 아이디어 |
| Builder-PM | Haiku | 아이디어 → 구현 가능한 제품 스펙 |
| Builder-Engineer | Sonnet | 템플릿 fork → 핵심 기능 코드 생성 |
| Builder-QA | Haiku | 빌드 성공 검증 |
| Deployer | Haiku | Vercel CLI 배포 + 헬스체크 |
| Persona | Sonnet | 3-tier 페르소나 (Deep/Mid/Lite) + OCEAN |
| Competitor Researcher | Sonnet | 경쟁 제품 조사 → 페르소나에 주입 |
| Validator v2 | Sonnet | Playwright E2E + 실망 설문 → PMF Score |

### PMF 검증 플로우 (Validator v2)

Validator v2는 "통계적 고객집착" 방법론을 따른다. 핵심은 **제품을 충분히 써본 사람만 설문한다**는 것.

```
Step 1~2.  데이터 로드 + 경쟁 정보 주입
              페르소나에게 기존 대안 인지시킴

Step 3.    사전 설문 (Pain + 대안 우위)
              "이 문제가 진짜 아픈가?" + "기존 대안보다 나은가?"

Step 4.    E2E 체험 (Playwright)
              실제 배포 URL에서 핵심 행동 수행 (2라운드)

Step 5.    Activation 필터 ← 핵심
              핵심 행동 2회 이상 완료자만 설문 모수에 포함
              미완료자는 제외 (제품을 충분히 안 써봤으므로)

Step 6.    미시 평가
              이해도 / 작동성 / 가치 / 재사용 의향

Step 7.    Q1 실망 설문 → PMF Score
              "이 제품이 사라지면 얼마나 실망하시겠습니까?"
              → Very Disappointed(VD) / Somewhat(SD) / Not(ND)
              → PMF Score = VD / (전체 - N/A) × 100

Step 8.    Q2: VD만 → 핵심 가치 추출
              "이 제품의 가장 큰 장점은?"

Step 9.    Q3: SD만 → VSD/NSD 분류
              "이상적 고객(VD)과 비슷한 니즈를 가진 SD인가?"

Step 10.   Q4: VSD만 → 전환 조건 추출
              "무엇이 바뀌면 Very Disappointed가 되겠는가?"

Step 11.   판정
              GRADUATE ≥ 55% / ITERATE 25~54% / KILL < 25%

Step 12.   ITERATE 시 → 개선 패키지 (Q4 전환 조건 기반) → Builder-PM
```

**핵심 원칙:**
- VD의 목소리로 **지킬 것**을 정하고, VSD의 목소리로 **만들 것**을 정한다
- NSD와 ND의 목소리는 무시한다
- ITERATE 시 매번 새 페르소나 풀을 생성한다 (동일인 재설문 X)

### PMF 판정 기준

| 판정 | PMF Score | 액션 |
|------|-----------|------|
| GRADUATE | ≥ 55% | Strong PMF. 기록 후 다음 사이클 |
| ITERATE | 25~54% | 개선. Q4 전환 조건 기반 재빌드 → 새 페르소나로 재검증 (최대 3회) |
| KILL | < 25% | 폐기. 학습 기록 후 다음 아이디어로 진행 |

Sean Ellis 원본 기준(40%)과 SEPE GRADUATE 기준(55%)은 대시보드에 항상 표시된다.

### 페르소나 시스템

**3-tier 하이브리드 (50명/제품)**

| 티어 | 인원 | 모델 | 역할 |
|------|------|------|------|
| Deep | 10명 | Sonnet | Q1~Q4 자연어 + 기억/반성 |
| Mid | 15명 | Haiku | Q1 판정 + Q3/Q4 키워드 |
| Lite | 25명 | 규칙 기반 | Q1 확률 판정 (API 없음) |

- Big Five OCEAN 기반 다양성 강제
- Bass Diffusion 입소문 시뮬레이션 (K > 1.0 → 자연 성장)
- 이탈 시뮬레이션 (3스프린트 연속 불만족 → 이탈)
- Crossing the Chasm 시장 확장 (Innovators → Early Adopters → Early Majority)
- Stanford Generative Agents 기억/반성/행동 변화

## Discovery Log

`/omp:run` 실행 중 매 사이클마다 `DISCOVERY_LOG.md`가 자동 갱신된다. 대시보드가 실시간 숫자를 보여준다면, Discovery Log는 **스토리**를 기록한다.

기록 내용:
- 어떤 트렌드에서 아이디어가 나왔는지
- 빌드/배포 결과
- PMF 검증: Sean Ellis 4Q 결과, 페르소나 피드백 인용
- 왜 GRADUATE/KILL 됐는지
- ITERATE 개선 과정
- 시장 확장 (Bass Diffusion K값, 신규 유입)

KILL된 제품도 기록한다 — 왜 실패했는지가 발표에서 중요한 스토리가 된다.

## 에러 복구

3레이어 복구 체계:

1. **에이전트 레벨**: 빌드/배포 실패 → 1회 재시도 → 2회 KILL
2. **파이프라인 레벨**: API rate limit → 지수 백오프, 사이클 20분 초과 → 강제 KILL
3. **세션 레벨**: 세션 드롭 → 대시보드 경고 → `/omp:resume`으로 재개

## 해커톤 당일

자세한 운영 가이드는 [docs/RUNBOOK.md](docs/RUNBOOK.md) 참조.

```bash
# 08:55 — 시작
/omp:run --parallel 2

# 수시 — 상태 확인
/omp:status

# 세션 드롭 시
/omp:resume
```

## 팀

- 황태용
- 정석환
- 권윤환

## 라이선스

MIT
