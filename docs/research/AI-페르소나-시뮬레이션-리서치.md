
# AI 페르소나 시뮬레이션 심층 리서치

> SEPE 프로젝트 동적 페르소나 시스템 설계를 위한 심층 리서치
> 관련: 20_projects/랄프톤2-SEPE/🏭 랄프톤2 SEPE | 20_projects/랄프톤2-SEPE/SPEC-SEPE-엔진 | 30_research/제품실험/Sean-Ellis-실망테스트-심층분석
> 리서치 일자: 2026-03-24


## 1. MiroFish 모델 분석

### 1.1 MiroFish란?

[MiroFish](https://github.com/666ghj/MiroFish)는 중국 개발자 BaiFu(666ghj)가 만든 오픈소스 **다중 에이전트 군집지능 예측 엔진**이다. 실제 세계의 시드 정보(문서, 뉴스, 데이터)를 입력하면, 수백~수천 명의 AI 에이전트가 독립된 성격/기억/행동 로직을 가지고 상호작용하며 **미래를 시뮬레이션**한다.

| 항목 | 내용 |
|------|------|
| 유형 | 오픈소스 다중 에이전트 시뮬레이션 엔진 |
| 기반 | OASIS 프레임워크 (CAMEL-AI) |
| 규모 | 수백~50만 에이전트 (OASIS는 100만까지) |
| 용도 | 여론 예측, 시장 센티멘트, PR 위기 시뮬, 마케팅 전략 평가 |
| 스택 | Node.js 프론트(3000) + Python/Flask 백엔드(5001) + Neo4j(지식그래프) |
| 성과 | $4M 자금 24시간 내 확보, Polymarket 봇에 통합하여 338건 거래로 $4,266 수익 |

### 1.2 작동 원리 (5단계 워크플로우)

```
1. Graph Construction
   시드 자료(문서/뉴스) → 엔티티/관계 추출 → Neo4j 지식그래프 구축

2. Environment Setup
   지식그래프 기반 → Environment Agent가 에이전트 페르소나 자동 생성
   각 에이전트: 성격, 의견 편향, 반응 속도, 영향력, 과거 기억

3. Dual-Platform Simulation
   Platform A (Twitter-like): 짧은 포스트, 바이럴 메커닉, 고속/저심도
   Platform B (Reddit-like): 스레드 토론, 투표 시스템, 저속/고심도
   → 크로스 플랫폼 다이나믹스 모델링

4. Report Generation
   ReportAgent가 시뮬레이션 결과 분석 → 예측 리포트 생성

5. Deep Interaction
   시뮬레이션된 에이전트와 직접 대화 가능
```

### 1.3 페르소나 생성/증식 메커니즘

| 속성 | 설명 |
|------|------|
| 성격 특성 | 낙관/비관 성향, 리스크 선호, 전문 배경 |
| 의견 편향 | 시드 자료 기반 초기 입장 설정 |
| 반응 속도 | 즉각 반응 vs 숙고형 |
| 영향력 수준 | 네트워크 내 오피니언 리더 vs 팔로워 |
| 기억 시스템 | 개인 기억 + 그룹 기억 (Neo4j에 저장) |

**핵심 인사이트 (SEPE 적용)**:
- MiroFish의 페르소나는 **지식그래프에서 자동 파생**됨 — SEPE도 제품/시장 데이터에서 페르소나를 자동 생성할 수 있음
- 듀얼 플랫폼 설계가 다양한 상호작용 패턴을 포착 — SEPE에서는 "제품 내 사용"과 "커뮤니티 입소문"으로 매핑 가능
- 에이전트 간 **상호 영향**이 핵심 — 단순 개별 평가가 아닌 집단 역학

### 1.4 SEPE와의 차이점 및 적용 전략

| 차원 | MiroFish | SEPE (SPEC 반영) |
|------|---------|-----------------|
| 목적 | 여론/시장 예측 | PMF 검증 + 시장 성장 시뮬 |
| 페르소나 생성 | 지식그래프 자동 파생 | 제품별 3차원(Demo×Behavior×Psycho) 자동 생성 + QA 필터 |
| 상호작용 | 소셜미디어 시뮬 | Superhuman 4질문 + 입소문 증식 + 이탈 (Stretch) |
| 규모 | 수백~50만 | 50 → 200 → 500 (Crossing the Chasm Phase별) |
| 시간 역학 | 실시간 시뮬 | 사이클(~14분) + 시장 성장 Phase |
| 비용 최적화 | LLM + 규칙 하이브리드 | Deep(Sonnet 20%) + Mid(Haiku 30%) + Lite(규칙 50%) |


## 3. PMF 탐색에서 페르소나 활용 패턴

### 3.1 Superhuman PMF 엔진 — 세그먼트 기반 페르소나 진화

[Superhuman의 PMF 엔진](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/)은 SEPE의 핵심 레퍼런스. 22% → 32% → 48% → 58%로 매 분기 PMF 점수를 올린 실전 사례.

**핵심 메커니즘: 페르소나 필터링**

```
전체 유저 (PMF 22%)
    ↓ Q2 분석: "이 제품을 누가 가장 잘 쓸까?"
    ↓ "매우 실망" 그룹의 공통 프로필 추출
    ↓
핵심 페르소나(HXC) 격리 (PMF 33%)
    ↓ Q3: 이들이 좋아하는 것 강화 (로드맵 50%)
    ↓ Q4: "약간 실망" → "매우 실망" 전환 (로드맵 50%)
    ↓
개선된 제품 (PMF 48% → 58%)
```

**SEPE 자동화 매핑**:

| Superhuman (수동) | SEPE (자동) |
|------------------|-----------|
| 분기별 설문 수집 | 매 스프린트 페르소나 50명 자동 응답 |
| 수동 세그먼트 분석 | Validator가 자동 HXC 추출 |
| 로드맵 수동 조정 | PM Agent가 자동 로드맵 조정 |
| 분기 → 분기 반복 | 스프린트(~11분) → 스프린트 반복 |

### 3.2 니치 → 인접 시장 확장 (Crossing the Chasm)

[Crossing the Chasm](https://en.wikipedia.org/wiki/Crossing_the_Chasm) 프레임워크를 페르소나 풀 전환으로 구현:

```
Phase 0: Innovators (50명)
  - 기술 친숙도 높음, 리스크 수용, 불완전 제품 OK
  - 목표: PMF 신호 발견 (40%+ "매우 실망")

Phase 1: Early Adopters (+ 100명)
  - Innovators의 입소문으로 유입
  - 비전에 공감, 솔루션의 잠재력에 투자
  - 목표: 바이럴 계수 K > 0.5

  ──── THE CHASM ────

Phase 2: Early Majority (+ 200명)
  - 검증된 솔루션 선호, 레퍼런스 요구
  - 페르소나 성격: 실용적, 가격 민감, 완성도 중시
  - 목표: 전환율, 리텐션 지표 안정화

Phase 3: Late Majority (+ 150명)
  - 업계 표준이 된 후 진입
  - 기술 친숙도 낮음, 지원 요구 높음
```

**SEPE에서의 구현**:
- 각 Phase에 맞는 페르소나 풀을 **자동 생성**
- Phase 전환 트리거: PMF 점수 + 바이럴 계수 기준
- 페르소나 성격 분포가 Phase마다 다름 (Innovator는 risk-taker 위주, Early Majority는 pragmatist 위주)

### 3.3 타겟 고객 변화 패턴

실제 스타트업에서 PMF 과정 중 타겟이 바뀌는 3가지 패턴:

| 패턴 | 설명 | SEPE 시뮬레이션 |
|------|------|---------------|
| **Niche Shift** | 초기 타겟이 반응하지 않아 인접 니치로 이동 | PIVOT 판정 시 Q2(HXC) 기반 새 세그먼트 페르소나 재생성 |
| **Expansion** | 핵심 니치 PMF 확보 후 인접 시장으로 확장 | Phase 전환 시 기존 페르소나 유지 + 새 세그먼트 추가 |
| **Upstream** | B2C에서 B2B로, 또는 개인에서 기업으로 | 페르소나 프로필에 "구매 의사결정 구조" 추가 |


## 5. Agent-Based Modeling (ABM) 프레임워크

### 5.1 Mesa + Mesa-LLM

[Mesa](https://github.com/mesa/mesa)는 Python 기반 ABM 프레임워크. [Mesa-LLM](https://github.com/projectmesa/mesa-llm)은 LLM을 에이전트 의사결정에 통합하는 확장.

**Mesa 3 (2025)**:
- Python 3.10+ 지원
- `DiscreteEventSimulator`: 고정 틱 대신 임의 타임스탬프 이벤트 스케줄링
- 하이브리드 접근: 전통적 ABM 시간 단계 + 이벤트 기반 모델 결합
- 시각화: 브라우저 기반 인터랙티브 뷰

**Mesa-LLM (0.1.1)**:
- 모듈 구조: 추론(Reasoning), 기억(Memory), 커뮤니케이션(Communication) 모듈
- 커스텀 모듈 플러그인 가능
- Chain-of-Thought 추론 옵션
- 에이전트 간 자연어 협상/대화
- **주의**: 아직 초기 개발 단계, API 변경 가능

**SEPE 적용 가능성**:
- Mesa의 `AgentSet`으로 페르소나 풀 관리
- `DiscreteEventSimulator`로 스프린트 내 비동기 이벤트 (입소문 전파, 이탈) 처리
- Mesa-LLM의 Memory 모듈 → 페르소나 기억 시스템

### 5.2 LLM-ABM-StockSim (하이브리드 참고 사례)

[LLM-ABM-StockSim](https://github.com/mihirchhiber/LLM-ABM-StockSim): Mesa + LangChain + LLaMA3.2로 구현한 주식 시장 시뮬레이션.

- 에이전트마다 고유 성격 (공격적/보수적/기술분석가 등)
- LLM이 시장 상황을 해석하고 자율적으로 행동
- 행동경제학 원리가 공급-수요 역학에서 자연 발생

**SEPE 시사점**: 동일 구조를 "시장 시뮬 → 제품 시장 시뮬"로 전환 가능. 에이전트의 "매수/매도" → "사용/이탈/추천"으로 매핑.

### 5.3 NetLogo + Bass Diffusion Model

[NetLogo 기반 제품 채택 시뮬레이션](https://cjlise.github.io/machine-learning/NetLogo-ProductAdoption/): 소셜 네트워크 위에 Bass 모델 구현.

- broadcast-influence (마케팅 효과)와 social-influence (입소문 효과)를 분리
- 네트워크 토폴로지에 따라 채택 곡선이 달라짐
- Scale-free 네트워크에서 assortative 상관이 채택 피크를 지연시킴

**SEPE 시사점**:
- 입소문 전파를 순수 확률이 아닌 네트워크 구조 위에서 시뮬레이션
- 마케터 Agent의 캠페인 효과를 broadcast-influence로, 자연 전파를 social-influence로 분리

### 5.4 프레임워크 비교 (SEPE 관점)

| 프레임워크 | 장점 | 단점 | SEPE 적합도 |
|-----------|------|------|-----------|
| Mesa + Mesa-LLM | Python, 모듈화, LLM 통합 | 초기 단계, 대규모 미검증 | ★★★★★ |
| OASIS | 100만 에이전트, 검증됨 | 소셜미디어 특화, 커스터마이징 복잡 | ★★★ |
| NetLogo | 교육용, 시각화 우수 | LLM 통합 없음, 레거시 | ★★ |
| 커스텀 Python | 완전 제어, SEPE 특화 | 개발 비용, 검증 필요 | ★★★★ |

**SPEC 반영**: 해커톤은 커스텀 Python (FastAPI). Mesa-LLM은 장기 리팩토링 후보.


## 7. 검증 및 한계

### 7.1 합성 페르소나의 검증된 정확도

| 연구 | 검증 방법 | 정확도 |
|------|----------|-------|
| Stanford 1,000명 | 실제 인간 대비 GSS 응답 | 85% (본인 재현의) |
| Deepsona | YouGov/GWI 실제 캠페인 대비 | 74~90% |
| OASIS | 실제 Twitter 전파 대비 RMSE | ~30% |
| NNGroup 연구 | 3개 연구 메타분석 | "트렌드는 포착, 크기는 부정확" |

### 7.2 알려진 한계 (솔직한 우려)

| 한계 | 완화 전략 |
|------|----------|
| LLM 페르소나는 **트렌드**는 맞추지만 **효과 크기(magnitude)**는 부정확 | 절대값이 아닌 상대 비교(A vs B)로 판단 |
| "통계적으로 확률 높은 토큰"을 생성할 뿐, 진짜 사고하는 것이 아님 | PMF 점수를 절대 기준이 아닌 상대 지표로 활용 |
| 극단적 소수 의견(outlier)을 잘 포착하지 못함 | Deep Persona 10%에 의도적으로 극단 프로필 포함 |
| 현실 시장의 비합리성, 감정적 결정을 완전히 재현 불가 | "빠른 탐색과 방향 감각"이 SEPE의 가치 (PRD에 명시) |

