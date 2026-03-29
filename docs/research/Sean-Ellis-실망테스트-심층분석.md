
# Sean Ellis 실망 테스트 (Disappointment Test) 심층 분석

> 작성일: 2026-03-24
> PMF(Product-Market Fit)를 정량적으로 측정하는 가장 널리 알려진 방법론에 대한 실무 레퍼런스

## 핵심 요약

- Sean Ellis가 100+개 스타트업 데이터를 비교 분석하여 도출한 PMF 측정 프레임워크
- 핵심 질문: "이 제품을 더 이상 사용할 수 없다면 어떤 기분이 들겠습니까?"
- **40% 이상이 "매우 실망"** 이라고 답하면 PMF 달성으로 판정
- Superhuman이 이를 확장하여 4질문 PMF 엔진을 만들고 22% → 58%로 개선한 것이 가장 유명한 사례
- 단일 지표로는 한계가 명확 — 리텐션 곡선, NPS, 행동 데이터와 병행 필수


## 2. 실제 적용 사례

### Superhuman PMF 엔진 — 가장 상세한 사례

| 시점 | PMF Score | 이벤트 |
|------|-----------|--------|
| 2017년 여름 (프라이빗 베타 시작) | **22%** | 2년간 개발 후 첫 측정 |
| 세그먼트 필터링 후 | **33%** | High-Expectation Customer만 추출 |
| 3분기 뒤 | **58%** | PMF 엔진 적용 결과 |

**Rahul Vohra (CEO)의 4질문 서베이**:

| # | 질문 | 목적 |
|---|------|------|
| 1 | "How would you feel if you could no longer use Superhuman?" | PMF Score 측정 |
| 2 | "What type of people do you think would most benefit from Superhuman?" | 이상적 고객 페르소나 발견 |
| 3 | "What is the main benefit you receive from Superhuman?" | 핵심 가치 제안 도출 |
| 4 | "How can we improve Superhuman for you?" | 로드맵 인풋 |

**핵심 인사이트**:
- Q2에서 만족 사용자는 **자기 자신을 묘사**한다 (다른 사람이 아님)
- 이를 통해 **HXC (High-Expectation Customer)** 페르소나 "Nicole" 도출: 하루 100~200통 이메일을 처리하는 바쁜 프로페셔널
- Q3에서 핵심 가치가 **"속도(Speed)"**임을 발견
- 로드맵 구성: **50%는 사랑받는 기능 강화** + **50%는 이탈 요인 제거**

**Superhuman PMF 엔진 4단계**:

```
Step 1: 세그먼트 분류 → HXC 식별
Step 2: "Somewhat disappointed" 그룹 분석 → 이탈 방지 전환 포인트 발견
Step 3: 로드맵 구성 (50:50 강화:개선)
Step 4: 반복 측정 (주간/월간/분기)
```

### 기타 회사 사례

| 회사 | PMF Score | 맥락 | 출처 |
|------|-----------|------|------|
| **Slack** | **51%** | 2015년, Hiten Shah가 731명 대상 서베이 | OpinionX |
| **Superhuman** (초기) | **22%** | 2017년 프라이빗 베타 | First Round Review |
| **Superhuman** (개선 후) | **58%** | 3분기 PMF 엔진 적용 후 | First Round Review |
| **Buffer** | **78%** | 초기 울트라 인게이지 그룹 대상 (편향 주의) | Justin Jackson |
| **Dropbox** | 미공개 | Ellis가 직접 적용, 구체적 수치 비공개 | — |
| **LogMeIn** | 미공개 | Ellis가 직접 적용 | — |
| **Eventbrite** | 미공개 | 주최자/참석자 별도 테스트 실시 | Learning Loop |

> Slack 51%는 당시 폭발적 성장기와 일치하며, 벤치마크의 타당성을 뒷받침하는 대표 사례다.


## 4. 보완 프레임워크

### Sean Ellis Test 단독 사용 금지 — 병행해야 할 지표

| 지표 | 측정 방법 | Sean Ellis Test와의 관계 |
|------|----------|------------------------|
| **리텐션 곡선** | 코호트별 잔존율 추이 | 서베이 편향 없음. 곡선이 수평 안정화되는 높이 = PMF 강도 |
| **NPS (Net Promoter Score)** | "추천 의향 0~10" | PMF와 다른 측면 측정. NPS 40+ ≈ strong PMF |
| **DAU/WAU/MAU 비율** | 활성 사용자 비율 | 실제 사용 빈도 기반. DAU/MAU > 25% = 높은 인게이지먼트 |
| **유기적 성장률** | 유료 마케팅 제외 성장 | PMF가 있으면 구전 성장이 발생 |
| **이탈률 (Churn Rate)** | 월간/연간 이탈 | 서베이와 행동의 괴리 검증 |
| **결제 전환율** | 무료→유료 전환 | "실망하겠다"와 "돈 낼 의향"은 다른 질문 |
| **North Star Metric** | 제품 핵심 가치 전달 측정 | 장기 PMF 추적의 선행 지표 |

### Justin Jackson의 대안: 과거 경험 기반 질문

서베이의 "미래 예측" 문제를 해결하기 위한 대안:

> **"이 제품이 사용 불가능했던 적이 있나요? 그때 어떤 기분이었나요?"**

- 가설이 아닌 **실제 경험**에 기반
- 장애/다운타임이 있었던 제품에 적용 가능
- 행동과 감정의 실제 연관성 측정

### 통합 PMF 대시보드 (실무 권장 구성)

```
┌─────────────────────────────────────────┐
│           PMF Dashboard                  │
├──────────────┬──────────────────────────┤
│ Sean Ellis   │ 42% "Very Disappointed"  │  ← 선행 지표 (서베이)
│ NPS          │ 45 (Promoter 우세)       │  ← 추천 의향
│ Retention    │ D30: 38%, D90: 22%       │  ← 행동 기반 후행 지표
│ DAU/MAU      │ 28%                      │  ← 인게이지먼트
│ Organic %    │ 62%                      │  ← 구전 성장
│ Churn        │ 4.2% monthly             │  ← 이탈 검증
│ North Star   │ +12% MoM                 │  ← 핵심 가치 전달
└──────────────┴──────────────────────────┘
```


## 6. 실무 적용 가이드

### 서베이 실행 체크리스트

- [ ] 대상: 핵심 기능 경험 + 2회 이상 사용 + 최근 2주 활성 사용자
- [ ] 최소 40명, 이상적으로 100명+ 응답
- [ ] 4질문 모두 포함 (Superhuman 방식)
- [ ] 세그먼트별 분석 (전체 평균만 보지 말 것)
- [ ] 리텐션 곡선, NPS와 교차 검증
- [ ] 주간/월간 반복 측정으로 추세 추적

### 점수 해석 가이드

| PMF Score | 해석 | 다음 행동 |
|-----------|------|----------|
| < 20% | PMF 미달. 피벗 또는 근본적 가치 재정의 필요 | 고객 인터뷰 → 문제 재정의 |
| 20~30% | 신호는 있으나 약함. 세그먼트 분석 필수 | HXC 식별 → 해당 세그먼트 집중 |
| 30~40% | PMF 근접. 특정 세그먼트에서는 이미 달성했을 수 있음 | 로드맵 50:50 (강화+개선) |
| 40~60% | PMF 달성. 성장 투자 시점 | 그로스 실험 시작 |
| 60%+ | 강한 PMF. 조심: 응답 편향 가능성 점검 | 편향 검증 + 스케일 |

### 주의사항

1. **서베이만으로 PMF 선언하지 말 것** — 행동 데이터와 반드시 교차 검증
2. **전체 평균에 속지 말 것** — 세그먼트별로 보면 40%+ 그룹이 숨어 있을 수 있음
3. **초기에는 자주 측정** — Superhuman은 초기에 주간 단위로 추적
4. **"Somewhat disappointed"가 금광** — 이 그룹을 "Very disappointed"로 전환하는 것이 PMF 엔진의 핵심


## Sources

- [Superhuman PMF Engine — First Round Review](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/)
- [Superhuman PMF Engine — Rahul Vohra (Coda)](https://coda.io/@rahulvohra/superhuman-product-market-fit-engine)
- [Sean Ellis Score — Learning Loop](https://learningloop.io/glossary/sean-ellis-score)
- [PMF Survey Guide — Learning Loop](https://learningloop.io/plays/product-market-fit-survey)
- [Is the PMF Survey Accurate? — Justin Jackson](https://justinjackson.ca/product-market-fit-survey)
- [PMF Item Statistical Analysis — MeasuringU](https://measuringu.com/product-market-fit-item/)
- [PMF Survey — Sean Ellis & GoPractice](https://pmfsurvey.com/)
- [PMF Measurement Frameworks — MarketFit](https://market-fit.ai/blog/product-market-fit-measurement-frameworks)
- [Sean Ellis Test — Pisano](https://www.pisano.com/en/academy/sean-ellis-test-figure-out-product-market-fit)
