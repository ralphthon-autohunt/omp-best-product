---
name: omp:resume
description: 세션 드롭 후 SEPE 루프를 재개한다
user-invocable: true
---

# /omp:resume

Claude Code 세션 드롭 후 SEPE 루프를 checkpoint에서 재개한다.

## 사용법
```
/omp:resume
```

## 실행 절차

1. state/checkpoint.json 읽기
   - last_completed_cycle 확인
   - in_progress_cycles 확인

2. 진행 중이던 사이클 정리
   - in_progress_cycles의 모든 항목을 KILL 처리
   - 각 products/{id}.json status를 KILL로 변경
   - "중단된 사이클 {N}개를 KILL 처리했습니다" 출력

3. session_drop_count 증가

4. dashboard.json 업데이트
   - status: "running" (재시작)

5. heartbeat.json 갱신

6. Conductor 에이전트 호출
   ```
   Agent(
     subagent_type="omp:conductor",
     prompt="세션 복구. last_completed_cycle={N}부터 재개. state/ 파일을 읽고 메인 루프를 계속하라."
   )
   ```

## 출력
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▶️ SEPE 루프 재개
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 마지막 완료 사이클: #{N}
❌ 중단된 사이클: {M}개 KILL 처리
🔄 드롭 횟수: {count}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
