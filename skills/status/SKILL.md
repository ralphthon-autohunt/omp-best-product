---
name: omp:status
description: 현재 SEPE 루프 상태를 조회한다
user-invocable: true
---

# /omp:status

현재 SEPE 루프의 상태를 조회한다.

## 사용법
```
/omp:status
```

## 실행 절차

1. state/dashboard.json 읽기
2. state/heartbeat.json 읽기
3. state/budget.json 읽기

## 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SEPE 엔진 상태
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💓 Heartbeat: {staleness} 전 ({status_color})
🔄 총 사이클: {total} | ✅ GRADUATE: {n} | ❌ KILL: {n} | 🔁 ITERATE: {n}
💰 예상 비용: ${amount}

📋 진행 중:
  - {product_name}: {stage} ({agent}) {progress_bar}

🏆 Top GRADUATE:
  1. {name} — PMF {score}% ({market_phase})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Heartbeat staleness:
- < 5분: 🟢 정상
- 5~15분: 🟡 주의
- > 15분: 🔴 세션 드롭 의심 → /omp:resume 안내
