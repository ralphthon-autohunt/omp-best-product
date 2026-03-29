# Validator v3 — 3-Layer 퍼널 검증

## What

현재 Validator v2의 "전원 체험 후 설문" 방식을 3-Layer 퍼널 검증으로 전환한다. 페르소나가 랜딩 페이지를 보고 관심을 보이는지(Layer 1), 체험 후 재방문/추천 의향이 있는지(Layer 2), 실제로 실망하는지(Layer 3)를 단계적으로 측정하여, 현실적인 PMF Score를 산출한다.

## Why

- **현재 문제**: v2에서 21사이클 중 17개가 GRADUATE (81%). 현실 스타트업에서는 10개 중 1~2개만 PMF 도달.
- **근본 원인**: 분모가 잘못됨. 전체 노출 인원이 아닌 Activation 완료자만으로 PMF 계산 → 뻥튀기.
- **원하는 결과**: AI slop(막 찍어낸 앱)은 v1에서 KILL. 고객 피드백 반영으로 극적 변화를 거친 제품만 GRADUATE. "AI slop은 죽고, 고객집착만이 살린다"를 보여줌.

## Acceptance Criteria

### Must Have

- [ ] Layer 1 (관심 게이트): 랜딩 페이지 텍스트만 보고 "써볼래/안 써볼래" 판단. 통과율 10~20%.
- [ ] Layer 2 (가치 게이트): E2E 체험 후 "재방문 의향 AND 추천 의향" 둘 다 Yes여야 통과.
- [ ] Layer 3 (실망 게이트): 기존 Sean Ellis Q1~Q4 설문 유지.
- [ ] PMF Score = VD / 전체 페르소나 수 × 100 (Layer 1 DROP 포함, ND로 카운트).
- [ ] GRADUATE 기준: PMF Score ≥ 40% (전체 노출 대비).
- [ ] KILL 기준: PMF Score < 10%.
- [ ] ITERATE 범위: 10% ≤ PMF Score < 40%.
- [ ] 페르소나 풀: 200~300명 (타겟 50% + 비타겟 50%).
- [ ] Layer 1 DROP 이유 수집 → Builder-PM에 전달 (태그라인/포지셔닝 개선용).
- [ ] ITERATE 시 태그라인 + 기능 모두 변경 가능 (제품 방향 자체 전환 허용).
- [ ] 사이클당 시간 상한: 30분.
- [ ] 기존 8축 분석, 사전설문, Playwright E2E는 Layer 2, 3에 통합 유지.

### Should Have

- [ ] Layer 1 DROP 이유 클러스터링 → `drop_reasons[]` 필드로 구조화
- [ ] Layer 2 추천 의향 데이터 → 대시보드에서 바이럴 가능성 지표로 활용
- [ ] iterate_history에 Layer별 통과율 기록 (퍼널 변천사 추적)

### Won't Have (This Iteration)

- [ ] 실제 사용자 대상 검증 (AI 페르소나만 사용)
- [ ] Layer 간 A/B 테스트 (통과율 파라미터 자동 조정)
- [ ] 8축 분석의 Layer별 재배치 (기존 위치 유지)

## Context

### 전체 퍼널 흐름

```
페르소나 250명 생성
├── 타겟 세그먼트 125명 (제품의 target_segment에 맞는 사람)
└── 비타겟 125명 (일반 대중 — 다양한 직업, 연령, 관심사)

      ┌─────────────────────────────────────────┐
      │         Layer 1: 관심 게이트             │
      │                                          │
      │  입력: 제품명 + 태그라인 + 랜딩 텍스트    │
      │  질문: "이거 써볼 의향 있어?"             │
      │  통과: Yes → Layer 2                     │
      │  DROP: No → ND로 카운트 + DROP 이유 수집  │
      │  기대 통과율: 10~20% (25~50명)            │
      └────────────────┬────────────────────────┘
                       ↓
      ┌─────────────────────────────────────────┐
      │         Layer 2: 가치 게이트             │
      │                                          │
      │  사전설문 (Pain + 대안 우위)              │
      │  → ND 조기확정 (기존 v2 로직 유지)        │
      │  → E2E 체험 (Playwright + AI)            │
      │  → 8축 분석 + 미시 평가                   │
      │  질문: "다음 주에 다시 올 것 같아?" AND    │
      │        "친구에게 추천하겠어?"              │
      │  통과: 둘 다 Yes → Layer 3               │
      │  DROP: 하나라도 No → ND로 카운트          │
      │  기대 통과율: 통과자의 30~50%             │
      └────────────────┬────────────────────────┘
                       ↓
      ┌─────────────────────────────────────────┐
      │         Layer 3: 실망 게이트             │
      │                                          │
      │  Q1: Sean Ellis 실망 설문 → VD/SD/ND     │
      │  Q2: 핵심 가치 추출 (VD만)               │
      │  Q3: VSD/NSD 분류 (SD만)                 │
      │  Q4: 전환 조건 추출 (VSD만)              │
      │                                          │
      │  기존 v2 로직 그대로 유지                 │
      └────────────────┬────────────────────────┘
                       ↓
      ┌─────────────────────────────────────────┐
      │           PMF Score 계산                 │
      │                                          │
      │  PMF = VD / 전체 250명 × 100             │
      │                                          │
      │  ≥ 40% → GRADUATE                       │
      │  10~39% → ITERATE                       │
      │  < 10% → KILL                           │
      └─────────────────────────────────────────┘
```

### Layer 1: 관심 게이트 상세

#### 입력 데이터
페르소나에게 제공하는 정보 (랜딩 페이지 전체 텍스트):
```
제품명: SpendLens
태그라인: "30초 입력, 즉시 통찰"

[랜딩 페이지 텍스트]
지출을 입력하면 자동으로 카테고리별로 분류하고, 도넛 차트와 월간 추이로
당신의 소비 패턴을 즉시 시각화합니다.

✓ 계정 없음 — 바로 시작
✓ 서버 없음 — 개인정보 걱정 제로
✓ 30초 입력 — 가계부 포기자도 OK
```

#### 페르소나 프롬프트
```
당신은 {name}, {age}세, {job}입니다.
{background_story}

아래 제품 소개를 읽고 판단하세요.

---
{랜딩 페이지 전체 텍스트}
---

질문: 이 제품을 클릭해서 써볼 의향이 있나요?

솔직하게 판단하세요:
- 당신은 바쁜 사람입니다. 매일 수십 개의 앱/사이트를 스쳐 지나갑니다.
- 대부분의 새 제품은 당신에게 필요 없습니다.
- "있으면 좋겠다" 수준이면 클릭하지 않습니다. 지금 당장 아픈 문제를 해결해줄 것 같을 때만 클릭합니다.
- 비타겟 사용자라면 이 카테고리 자체에 관심이 없을 가능성이 높습니다.

응답:
- interested: true/false
- reason: "왜 관심이 있는지 / 없는지" (1문장)
```

#### DROP 이유 수집
관심 없음(interested=false)인 페르소나의 `reason`을 클러스터링하여 `drop_reasons[]` 생성:
```json
{
  "drop_reasons": [
    {"reason": "이미 뱅크샐러드 쓰고 있어서 굳이", "count": 45},
    {"reason": "가계부 자체에 관심 없음", "count": 38},
    {"reason": "30초도 귀찮음, 자동 연동이 아니면 안 씀", "count": 22}
  ]
}
```

### Layer 2: 가치 게이트 상세

Layer 1 통과자에 대해 기존 v2의 Step 3~6을 실행한다:
1. 사전설문 (Pain + 대안 우위) → ND 조기확정
2. E2E 체험 (Playwright / WebFetch)
3. 8축 분석
4. 미시 평가 (이해도/작동성/가치/재사용)

이후 추가 질문:
```
체험을 마쳤습니다. 두 가지를 솔직하게 답하세요:

1. "다음 주에 이 제품을 자발적으로 다시 방문할 것 같은가요?"
   - 알림도 없고 앱도 없습니다. 본인이 기억해서 찾아와야 합니다.
   - 북마크에 안 쓰는 사이트가 200개입니다.
   → revisit: true/false

2. "이 제품을 친구나 동료에게 추천하시겠어요?"
   - 추천한다는 건 당신의 평판을 걸고 보증하는 겁니다.
   - "괜찮긴 한데 굳이 추천까지는..." 이면 No입니다.
   → recommend: true/false
```

**통과 조건**: revisit=true AND recommend=true
**DROP**: 하나라도 false → ND로 카운트 (이유 수집)

### Layer 3: 실망 게이트 상세

기존 v2의 Step 7~12를 그대로 유지한다:
- Q1: Sean Ellis 실망 설문
- Q2: 핵심 가치 추출 (VD만)
- Q3: VSD/NSD 분류 (SD만)
- Q4: 전환 조건 추출 (VSD만)
- VD 가능 조건 (Pain=2, 대안 우위=2, 가치=2 등) 그대로 유지

### PMF Score 계산

```
PMF Score = VD / 전체 페르소나 수(250명) × 100

예시 — AI slop 제품:
  250명 → L1 통과 15명 → L2 통과 5명 → VD 2명
  PMF = 2/250 = 0.8% → KILL

예시 — 괜찮은 제품 v1:
  250명 → L1 통과 40명 → L2 통과 15명 → VD 8명
  PMF = 8/250 = 3.2% → KILL (하지만 피드백 풍부)

예시 — 극적 개선 후 v2:
  250명 → L1 통과 60명 → L2 통과 30명 → VD 25명
  PMF = 25/250 = 10% → ITERATE

예시 — v3 (고객집착 반영):
  250명 → L1 통과 80명 → L2 통과 50명 → VD 40명
  PMF = 40/250 = 16% → ITERATE

예시 — v4 (진짜 PMF 도달):
  250명 → L1 통과 120명 → L2 통과 80명 → VD 100명
  PMF = 100/250 = 40% → GRADUATE
```

### 판정 기준

| 판정 | PMF Score | 의미 |
|------|-----------|------|
| GRADUATE | ≥ 40% | Strong PMF (전체 노출의 40%가 VD) |
| ITERATE (Nascent) | 20~39% | 방향 맞음, 강한 개선 필요 |
| ITERATE | 10~19% | 아직 부족, 피드백 기반 개선 |
| KILL | < 10% | 폐기 |

### ITERATE 시 피드백 체인

기존 v2와 달리, **3개 소스의 피드백**을 Builder-PM에 전달:

```json
{
  "layer1_drop_reasons": [
    {"reason": "가계부 자체에 관심 없음", "count": 38},
    {"reason": "자동 연동이 아니면 안 씀", "count": 22}
  ],
  "layer2_drop_reasons": [
    {"reason": "한번 써봤는데 재방문까지는 아님", "count": 8},
    {"reason": "추천하기엔 아직 부족", "count": 5}
  ],
  "layer3_vsd_conversion_conditions": [
    {"condition": "월별 비교 트렌드", "mentions": 14},
    {"condition": "구독료 자동 감지", "mentions": 11}
  ],
  "core_values": ["30초 입력", "즉시 시각화"],
  "hxc_profile": "...",
  "pm_instruction": "Layer 1 drop_reasons 분석 → 태그라인/포지셔닝 변경 검토. Layer 3 conversion_conditions → 기능 개선."
}
```

**Builder-PM이 변경 가능한 범위**:
- 태그라인 / 포지셔닝 변경 (Layer 1 피드백 기반)
- 기능 추가/개선 (Layer 3 VSD 피드백 기반)
- 타겟 세그먼트는 유지 (이번 iteration에서는)

### 페르소나 풀 구성

```
총 250명:
├── 타겟 세그먼트 125명 (Persona 에이전트가 기존 방식으로 생성)
│   ├── Deep 25명 (풍부한 배경 + 상세 시뮬레이션)
│   ├── Mid 40명 (중간 수준)
│   └── Lite 60명 (경량)
│
└── 비타겟 125명 (일반 대중)
    ├── Deep 15명
    ├── Mid 40명
    └── Lite 70명
    - 다양한 직업, 연령 (18~65세), 관심사
    - 제품 카테고리와 무관한 사람들
    - Layer 1에서 대부분 DROP됨 (현실의 "지나가던 사람")
```

### 성능 최적화

**사이클당 30분 상한** 내에 250명 처리를 위한 최적화:

- Layer 1: 텍스트 기반 판단만 (E2E 없음) → 250명을 빠르게 처리
- Layer 2: Layer 1 통과자(25~50명)만 E2E → Playwright 부하 대폭 감소
- Layer 3: Layer 2 통과자(10~25명)만 상세 설문 → 가장 경량

```
시간 배분 예상:
- Layer 1 (250명, 텍스트만): ~3분
- Layer 2 (30~50명, E2E): ~15분
- Layer 3 (10~25명, 설문): ~5분
- 집계 + 로그: ~2분
- 여유: ~5분
- 합계: ~30분
```

### Edge Cases

- **Layer 1 통과자 < 10명**: `LOW_INTEREST` 경고. 랜딩 텍스트 품질 문제 신호. KILL 처리 가능.
- **Layer 2 통과자 < 5명**: 설문 모수 부족. 정성 평가로 전환하거나 KILL.
- **비타겟에서 VD 발생**: 예상 밖 세그먼트 발견 → `unexpected_segment` 필드로 기록. Builder-PM에 타겟 확장 신호.
- **Layer 1 통과율 > 40%**: 페르소나가 너무 관대할 수 있음. 경고 로그.
- **전체 VD = 0**: 즉시 KILL. 피드백은 Layer 1 drop_reasons만 전달.

### iterate_history 확장

기존 iterate_history 엔트리에 Layer별 퍼널 데이터를 추가:

```json
{
  "version": 1,
  "pmf_score": 3.2,
  "verdict": "KILL",
  "funnel": {
    "total_personas": 250,
    "layer1_passed": 40,
    "layer1_pass_rate": 0.16,
    "layer1_drop_reasons": [
      {"reason": "가계부 자체에 관심 없음", "count": 38}
    ],
    "layer2_passed": 15,
    "layer2_pass_rate": 0.375,
    "layer3_vd": 8,
    "layer3_sd": 5,
    "layer3_nd": 2
  },
  "iterate_direction_applied": null,
  ...기존 필드
}
```

### Related Specs

- `agents/builder-engineer.md` — 버전별 path 빌드 (v1/v2 코드 보존)
- `agents/builder-pm.md` — ITERATE 시 Layer 1 피드백 반영, rationale 필드
- `agents/conductor.md` — iterate_history append-only 누적
- `agents/persona.md` — 비타겟 페르소나 생성 로직 추가 필요
- `state/SCHEMA.md` — iterate_history funnel 필드 추가

### 기존 v2 대비 변경 요약

| 항목 | v2 | v3 |
|------|-----|-----|
| 페르소나 수 | 100명 (타겟 100%) | 250명 (타겟 50% + 비타겟 50%) |
| E2E 대상 | 사전설문 ND 제외 전원 (~84명) | Layer 1 통과자만 (~35명) |
| PMF 분모 | Activation 완료자 (~70명) | 전체 페르소나 (250명) |
| GRADUATE | ≥ 55% | ≥ 40% |
| KILL | < 25% | < 10% |
| ITERATE 피드백 | VSD Q4만 | Layer 1 DROP + Layer 2 DROP + VSD Q4 |
| ITERATE 범위 | 기능 개선 (Superhuman 50:50) | 태그라인 + 기능 모두 변경 가능 |
| 8축 분석 | Step 4에서 실행 | Layer 2에서 실행 (위치 변경 없음) |
| 사전설문 | Step 3 | Layer 2 진입 시 (Layer 1 이후) |

## Open Questions

- [ ] 비타겟 페르소나 생성 시 Persona 에이전트에 어떤 프롬프트를 줄 것인가? (별도 mode 추가 필요?)
- [ ] Layer 1 통과율이 제품마다 크게 다를 텐데, 이를 정규화할 필요가 있는가?
- [ ] ITERATE 최대 횟수를 3회에서 늘려야 하는가? (태그라인 변경까지 포함하면 더 많은 시도 필요할 수 있음)
- [ ] 비타겟에서 예상 밖 VD가 나오면 타겟 세그먼트를 자동으로 변경하는 로직이 필요한가?
