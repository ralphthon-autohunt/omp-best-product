# RUNBOOK — 해커톤 당일 운영 가이드

> 랄프톤 Seoul #2 | 2026-03-29 (09:00~21:00)
> 팀: 황태용, 정석환, 권윤환

## 시작 절차 (08:30~09:00)

### 1. 환경 확인

```bash
# Vercel CLI 확인
vercel whoami

# 플러그인 확인
claude plugin list | grep oh-my-pmf

# 대시보드 시작
cd dashboard && npm run dev &
# → http://localhost:3001 에서 확인
```

### 2. SEPE 루프 시작 (09:00)

```
/omp:run --parallel 2
```

## 모니터링

### 상태 확인

```
/omp:status
```

### 대시보드

- URL: http://localhost:3001
- 폴링 간격: 20초 (기본) → 발표 전 5초로 변경

### Heartbeat 확인

- 🟢 < 5분: 정상
- 🟡 5~15분: 주의 — 세션 확인
- 🔴 > 15분: 세션 드롭 → /omp:resume 실행

## 세션 드롭 복구

### 1. Claude Code 재시작

```bash
claude
```

### 2. 루프 재개

```
/omp:resume
```

- 중단된 사이클은 자동 KILL 처리
- 마지막 완료 사이클부터 재개
- 5분 이내 복구 목표

## 팀 역할 분담

| 팀원 | 역할 | 주요 임무 |
|------|------|---------|
| 황태용 | 기술 리드 | 세션 드롭 감지 → /omp:resume, Vercel 이슈 대응 |
| 정석환 | 데이터 분석 | state/ 모니터링, PMF 트렌드 분석, 발표 데이터 준비 |
| 권윤환 | 발표 | 대시보드 시연, 5분 발표 진행 |

## 비상 대응

### Vercel 배포 실패 연속

- /omp:status로 상태 확인
- state/deployments.json에서 슬롯 상태 점검
- vercel whoami로 로그인 확인

### API 비용 급증

- state/budget.json 확인
- 비용은 관찰 목적이므로 중단 불필요

### 대시보드 다운

```bash
cd dashboard && npm run dev &
```

## 발표 준비 (20:30~)

1. 대시보드 폴링 간격을 5초로 변경 (lib/polling.ts의 intervalMs)
2. 대시보드에서 Top GRADUATE 제품 URL 확인
3. state/products/ 에서 흥미로운 사례 선별
