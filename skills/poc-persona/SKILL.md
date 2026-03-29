---
name: omp:poc-persona
description: 페르소나 개선안 POC — raw_voices 그라운딩 + 검증 파이프라인 단독 실행
user-invocable: true
---

# /omp:poc-persona

페르소나 시스템 개선안(raw_voices 그라운딩, WTP, VSD/NSD, Resemblance Score, confidence_basis, 출처 태깅)을 전체 SEPE 루프 없이 격리 테스트한다.

## 사용법
```
/omp:poc-persona                          # 기본: Ideator로 아이디어 1개 생성 후 테스트
/omp:poc-persona --idea {idea_id}         # 기존 아이디어로 테스트 (state/ideas/{id}.json)
/omp:poc-persona --mock                   # 내장 mock 아이디어로 즉시 테스트
```

## 실행 절차

### Step 0: state 디렉토리 확인
```
mkdir -p state/products state/personas state/ideas
```

### Step 1: 아이디어 확보

**--mock 모드** (가장 빠름):
mock 아이디어를 `state/ideas/poc-mock.json`에 생성한다:
```json
{
  "id": "poc-mock",
  "product_name": "FocusFlow",
  "one_liner": "AI가 Slack 알림을 우선순위 정리해주는 생산성 앱",
  "target_segment": {
    "demographics": "30대 스타트업 PM, 하루 50+ Slack 메시지 처리",
    "needs": "중요 메시지 놓치지 않으면서 딥워크 시간 확보",
    "pain_points": "알림 과부하, 컨텍스트 스위칭, 중요 메시지 매몰"
  },
  "core_feature": "AI Slack 알림 우선순위 분류 및 딥워크 모드",
  "keywords": ["Slack", "알림", "우선순위", "딥워크", "생산성"],
  "differentiation": "규칙 기반이 아닌 AI가 대화 맥락으로 중요도 판단",
  "revenue_model": "freemium",
  "category": "productivity",
  "source_trends": ["PH: AI notification tools trending", "Reddit: Slack fatigue posts"],
  "raw_voices": [
    {"voice_id": "v-001", "source": "reddit", "source_url": "https://reddit.com/r/productivity/example1", "text": "I have 50+ Slack channels and miss critical messages daily. Muting doesn't work because then I miss important stuff.", "sentiment": "negative"},
    {"voice_id": "v-002", "source": "producthunt", "source_url": "https://producthunt.com/example2", "text": "Switched from SlackBot filters to this because it actually understands context, not just keywords.", "sentiment": "positive"},
    {"voice_id": "v-003", "source": "hackernews", "source_url": "https://news.ycombinator.com/example3", "text": "The real problem isn't notifications, it's context switching. Every ping breaks flow state.", "sentiment": "negative"},
    {"voice_id": "v-004", "source": "reddit", "source_url": "https://reddit.com/r/startups/example4", "text": "As a PM I spend 2 hours just triaging Slack. Would pay for something that does this automatically.", "sentiment": "negative"},
    {"voice_id": "v-005", "source": "producthunt", "source_url": "https://producthunt.com/example5", "text": "Love the concept but pricing is too high for individual users. $5/mo max.", "sentiment": "negative"}
  ],
  "created_at": "2026-03-26T10:00:00+09:00"
}
```

**--idea {id} 모드**:
`state/ideas/{id}.json`을 읽어서 사용한다.
raw_voices가 없으면 경고를 출력하고 fallback 모드로 진행한다.

**기본 모드** (옵션 없음):
```
Agent(
  subagent_type="omp:ideator",
  prompt="아이디어 1개 생성. raw_voices 수집을 반드시 포함하라. killed_ideas: [], recent_categories: []"
)
```
→ 결과를 `state/ideas/{id}.json`에 저장

### Step 2: 페르소나 생성 (Persona 에이전트)
```
Agent(
  subagent_type="omp:persona",
  prompt="mode: create
  target_segment: {idea.target_segment}
  raw_voices: {idea.raw_voices}

  50명 페르소나 풀을 생성하라.
  결과를 state/personas/poc-{idea.id}.json에 저장하라."
)
```

### Step 3: PMF 검증 (Validator 에이전트)

deploy_url 없이 dry-run 모드로 실행한다. 제품 설명만으로 검증한다.

```
Agent(
  subagent_type="omp:validator",
  prompt="product_name: {idea.product_name}
  product_description: {idea.one_liner + core_feature + differentiation}
  deploy_url: null (dry-run, 설명 기반 검증)
  personas_path: state/personas/poc-{idea.id}.json
  product_pain_keywords: {idea.keywords}
  target_demographics_keywords: {idea.target_segment.demographics에서 추출}
  raw_voices: {idea.raw_voices}

  Sean Ellis 4질문 + Q5 WTP + 출처 태깅으로 50명 검증하라.
  결과를 state/products/poc-{idea.id}.json에 저장하라."
)
```

### Step 4: 결과 출력

state/products/poc-{idea.id}.json에서 결과를 읽어 출력한다:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 POC 페르소나 검증 결과
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Product: {product_name}
📝 설명: {one_liner}

📊 PMF Score: {pmf_score}%
🎯 Verdict: {verdict}

💰 WTP:
  중앙값: {wtp_median}
  분포: {wtp_distribution 시각화}
  가격 상한: ${price_ceiling_avg}

🔄 VSD/NSD 분석:
  somewhat_disappointed: {total}명
  ├─ VSD (전환 가능): {vsd_count}명
  └─ NSD (무시):      {nsd_count}명

📏 Resemblance Score: {resemblance_score}
  (raw_voices ↔ 페르소나 Q4 키워드 유사도)

🔍 신뢰 근거 (confidence_basis):
  방법론: {methodology}
  프록시 소스: {proxy_sources} ({raw_voices_count}건)
  이론 모델: {theoretical_models}
  한계: {known_limitations}

📎 Deep 10명 출처 태깅 샘플:
  Persona #1: Q1={q1} | 근거: {q1_reasoning}
              출처: {grounding_sources}
  Persona #2: Q1={q1} | 근거: {q1_reasoning}
              출처: {grounding_sources}
  ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Before/After 비교 (선택)

raw_voices 효과를 비교하려면:
1. --mock으로 한 번 실행 (raw_voices 포함)
2. mock JSON에서 raw_voices를 빈 배열로 바꿔서 다시 실행
3. 두 결과의 PMF Score, Resemblance Score, WTP 비교

## 검증 체크리스트

실행 후 다음을 확인한다:

- [ ] state/ideas/{id}.json에 raw_voices[]와 keywords[]가 존재하는가
- [ ] state/personas/poc-{id}.json에 Deep 10명의 pain_points가 raw_voices 내용을 반영하는가
- [ ] Lite 25명의 Q1 판정에 pain_match_bonus가 적용되었는가 (제품 무관 점수와 다른가)
- [ ] validation에 wtp_distribution, wtp_median, price_ceiling_avg가 존재하는가
- [ ] somewhat_disappointed 있을 경우 vsd_count + nsd_count == total인가
- [ ] resemblance_score가 0.0~1.0 사이인가 (raw_voices 있을 때)
- [ ] confidence_basis에 methodology, persona_grounding, theoretical_models, known_limitations 4개 필드가 있는가
- [ ] Deep 10명 응답에 q1_reasoning(비어있지 않음)과 grounding_sources(배열)가 있는가
