# DISCOVERY LOG — SEPE 엔진 PMF 탐색 기록

> 시작: 2026-03-26T09:10:00+09:00 | 총 사이클: 15 | GRADUATE: 12 | KILL: 2

---

## Cycle #1~3: FocusLens / LetterDrop / PulseLog / MoodLoop / PetRoute Planner

이전 세션(last_completed_cycle=3)에서 완료. 5개 제품 처리:
- prod-001 FocusLens: GRADUATE (PMF 62.0%, Productivity)
- prod-002 LetterDrop: GRADUATE (PMF 58.0%, creator_economy) — PIVOT 후 GRADUATE
- prod-003 PulseLog: GRADUATE (PMF 61.0%, Health & Wellness)
- prod-004 MoodLoop: GRADUATE (PMF 58.0%, Health & Wellness)
- prod-005 PetRoute Planner: GRADUATE (PMF 62.0%, pet care/travel)

---

## Cycle #4: InterviewForge — GRADUATE

### 아이디어 발굴
- 트렌드 소스: Reddit r/cscareerquestions 2026, ProductHunt AI 커리어 도구 카테고리, LinkedIn 이직 의향자 62% 증가
- 카테고리: career / job search
- 핵심 기능: 채용 공고 텍스트 입력 → 직무별 예상 면접 질문 10개 + STAR 답변 프레임 생성 + localStorage 저장
- 차별점: 설치·회원가입 없이 브라우저 즉시 사용, 비기술직 포지션 지원, Pramp/Interviewing.io와 달리 '이 공고에 맞는 질문'에 집중

### 빌드
- 빌드 시간: 약 45초 (재시도 1회 — TypeScript SavedAnswer Record 인덱스 타입 에러 수정)
- 배포 URL: https://sepe-slot-6.vercel.app
- 주요 기능: 채용 공고 입력 → 직무 자동 감지 (6개 직군) → 질문 10개 생성 → STAR 섹션 인라인 작성 → localStorage 자동 저장

### PMF 검증
- PMF Score: 58.0% → **GRADUATE**
- Q1 분포: 매우실망 29명 / 약간실망 15명 / 실망안함 6명
- HXC 프로필: 이직 준비 중인 25~35세 직장인 (IT/마케팅/기획). 면접 경험이 있지만 공고별 맞춤 준비가 어렵고 STAR 답변 구조화에 약점이 있는 사람
- 핵심 강점: 공고별 맞춤 질문 적중률, STAR 프레임 답변 구조화, 즉시 사용 가능
- 개선 요청: 경력 레벨별 난이도 분리, 답변 예시 샘플, 모의 면접 타이머

### 페르소나 하이라이트
> "김지훈, 29세 스타트업 프론트엔드 개발자": "이거 진짜 신기하게 맞아요. 공고 붙여넣었더니 실제 면접에서 나온 질문이 3개나 나왔어요. STAR로 정리하니까 횡설수설하던 게 확 줄었고요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.52
- 시장 단계: innovators → early_adopters
- 신규 유입: 15명 (Wave 1)

---

## Cycle #5: LeaseRadar — GRADUATE

### 아이디어 발굴
- 트렌드 소스: Reddit r/Korea·에브리타임 2026, 한국 전세사기 이슈 2023~2026, ProductHunt Legal AI 카테고리
- 카테고리: legal tech / real estate
- 핵심 기능: 임대차 계약서 텍스트 붙여넣기 → 위험 조항 고/중/저 위험도 분류 → 각 조항 설명 + 협상 팁
- 차별점: 개인 소비자용, 30초 내 즉시 결과, 한국 임대차보호법 기반 룰셋 내장, 브라우저 내 처리 (서버 전송 없음)

### 빌드
- 빌드 시간: 약 35초 (1회 통과)
- 배포 URL: https://sepe-slot-7.vercel.app
- 주요 기능: 계약서 텍스트 입력 → 10개 위험 규칙 매칭 → 위험도별 탭 UI → 조항 원문 + 설명 + 협상 팁 → localStorage 자동 저장

### PMF 검증
- PMF Score: 72.0% → **GRADUATE** (세션 최고 점수)
- Q1 분포: 매우실망 36명 / 약간실망 12명 / 실망안함 2명
- HXC 프로필: 첫 자취 또는 이사를 앞둔 20~30대. 부동산 지식이 거의 없고 계약서 위험 조항을 전문가 없이 빠르게 확인하고 싶은 사람. 특히 계약 당일 시간 압박을 받는 상황
- 핵심 강점: 위험 조항 색상 구분 직관성, 법률 용어 없는 쉬운 설명, 구체적 협상 팁
- 개선 요청: 계약서 전체 위험 점수, 결과 공유 기능, 등기부등본 체크리스트

### 페르소나 하이라이트
> "김태희, 24세 사회초년생": "계약서 사인 전날 밤에 이거 써봤는데 '임대인 임의 해지' 조항이 빨간색으로 나오는 거 보고 소름 돋았어요. 실제로 다음날 삭제 요청해서 수정했어요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.71
- 시장 단계: innovators → early_adopters
- 신규 유입: 26명 (Wave 1)

---

## Cycle #6: BillBuddy — GRADUATE (ITERATE x1)

### 아이디어 발굴
- 트렌드 소스: Reddit r/personalfinance 2026 더치페이 앱 불만, Toss/카카오페이 정착에도 '기록 앱' 공백, Gen Z 모임 문화에서 소액 정산 분쟁이 관계 마찰 1위
- 카테고리: fintech / expense sharing
- 핵심 기능: 회원가입 없이 URL 하나로 그룹 생성 → 지출 기록 → Debt Simplification 알고리즘으로 최소 이체 계산 → 단톡방 링크 공유
- 차별점: 회원가입 없음·URL 상태 공유·원화 기본·카톡 메시지 복사 버튼

### 빌드
- 빌드 시간: v1 약 30초, v2 약 30초 (2회 모두 1회 통과)
- 배포 URL: https://sepe-slot-8.vercel.app

### PMF 검증
- PMF Score: v1: 54.0% → ITERATE / v2: 60.0% → **GRADUATE** (+6.0%p)
- Q1 분포 (v2): 매우실망 30명 / 약간실망 13명 / 실망안함 7명
- HXC 프로필: 5~10명 규모 모임·여행·회식의 정산 담당자
- 핵심 강점: 최소 이체 알고리즘 정확성, 회원가입 없는 링크 공유, 지출 수정/삭제
- 개선 요청: 기기 변경 데이터 유지, 카카오페이 연동, 정산 히스토리

### ITERATE 이력
- v1: PMF 54.0% → v2: PMF 60.0%

### 페르소나 하이라이트
> "박수진, 26세 마케터": "링크 하나 단톡방에 던졌더니 다들 바로 들어가서 확인했어요. 예전엔 엑셀 캡처 찍어서 올리고 누가 얼마인지 일일이 알려줬는데 이제 그럴 필요가 없어요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.63
- 시장 단계: innovators → early_adopters
- 신규 유입: 20명 (Wave 1)

---

## Cycle #7: StudySync — GRADUATE

### 아이디어 발굴
- 트렌드 소스: Reddit r/Korean 수험생 커뮤니티 Forest 피로감, 에브리타임 2026 공시 준비생 '오늘 뭘 공부했는지 정리 안 된다', 유튜브 공부 브이로그 문화
- 카테고리: edtech / study tools
- 핵심 기능: 과목별 타이머 + GitHub 잔디 히트맵 + 주간 리포트 카드 공유
- 차별점: 앱 설치 없는 즉시 시작, 잔디 시각화, SNS 공유용 이미지 export

### 빌드
- 빌드 시간: 약 35초 (1회 통과)
- 배포 URL: https://sepe-slot-9.vercel.app

### PMF 검증
- PMF Score: 58.0% → **GRADUATE**
- Q1 분포: 매우실망 29명 / 약간실망 13명 / 실망안함 8명
- HXC 프로필: 매일 정해진 목표 시간을 채우려는 수험생·자기계발 준비자. 주간 리포트 카드 SNS/오픈카톡 공유로 외부 책임감 형성
- 핵심 강점: 잔디 시각적 동기부여, 과목별 색상 타이머, 리포트 카드 SNS 공유
- 개선 요청: 백그라운드 타이머, 수동 시간 입력, PC-모바일 동기화

### 페르소나 하이라이트
> "강민서, 22세 공무원 시험 준비생": "잔디가 끊기면 안 된다는 게 진짜로 매일 공부하게 만들어요. 주간 카드를 스터디 오픈카톡에 올렸더니 다들 어디서 만들었냐고 물어봤어요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.58
- 시장 단계: innovators → early_adopters
- 신규 유입: 18명 (Wave 1)

---

## Cycle #8: MenuMate — GRADUATE

### 아이디어 발굴
- 트렌드 소스: 음식 결정 장애 검색 급증, 채식/비건 인구 증가, 그룹 외식 증가, 메뉴 선택 시 평균 8분 낭비 리서치
- 카테고리: food & dining
- 핵심 기능: 메뉴판 텍스트 입력 → 식이제한 + 우선순위 필터링 → Top 3 추천 + 이유 표시 → 그룹 투표 공유
- 차별점: '지금 이 식당에서 뭐 먹을지' 결정 지원. 개인화 + 그룹 합의 기능

### 빌드
- 빌드 시간: 약 40초 (1회 통과)
- 배포 URL: https://sepe-slot-10.vercel.app

### PMF 검증
- PMF Score: 58.0% → **GRADUATE**
- Q1 분포: 매우실망 29명 / 약간실망 16명 / 실망안함 5명
- HXC 프로필: 식이제한 보유 20-32세 직장인·대학생. 그룹 외식 빈도 주 3회 이상
- 핵심 강점: 식이제한 필터 즉시 활용, 그룹 투표로 팀 점심 갈등 해소
- 개선 요청: OCR/사진 입력, 카카오 공유 링크, 영양정보

### 페르소나 하이라이트
> "김채연, 27세 마케터": "메뉴판 볼 때마다 비건인지 일일이 확인해야 했는데, 이제 30초면 될 것 같아요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.55
- 시장 단계: innovators → early_adopters
- 신규 유입: 16명 (Wave 1)

---

## Cycle #9: CircleSync — GRADUATE

### 아이디어 발굴
- 트렌드 소스: 고독감·외로움 증가 (WHO 2026 보고서), 소규모 커뮤니티 선호 트렌드, '취미 친구 어떻게 사귀나요?' 커뮤니티 질문 폭증
- 카테고리: social / micro-community
- 핵심 기능: 관심사 태그로 4-8명 소모임 생성 → 익명 아이스브레이킹 Q&A 3라운드 → 공개 연결 후 그룹 채팅
- 차별점: 익명 Q&A로 첫 만남 부담 해소. 소규모·고품질 연결. 연애 목적 아닌 순수 취미 포지셔닝

### 빌드
- 빌드 시간: 약 38초 (1회 통과)
- 배포 URL: https://sepe-slot-11.vercel.app

### PMF 검증
- PMF Score: 66.0% → **GRADUATE** (사이클 최고 점수 공동 2위)
- Q1 분포: 매우실망 33명 / 약간실망 13명 / 실망안함 4명
- HXC 프로필: 타 도시 이사자·재택근무자·사회초년생 22-30세. 취미 친구 없음 + 첫 만남 부담감
- 핵심 강점: 익명 Q&A 아이스브레이킹, 소규모 진짜 연결, 취미 전용 포지셔닝
- 개선 요청: 나이대/지역 필터, 오프라인 모임 날짜 투표, 서클 활성도 표시

### 페르소나 하이라이트
> "한소리, 23세 첫 직장 1개월차": "취업하고 나서 갑자기 아무도 없어진 느낌이에요. 게임 같이 할 친구 진짜 없어요. 이런 앱 진심으로 필요했어요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.72
- 시장 단계: innovators → early_adopters
- 신규 유입: 24명 (Wave 1)

---

## Cycle #10: ReframeAI — GRADUATE

### 아이디어 발굴
- 트렌드 소스: MZ세대 정신건강 관심 급증, AI 심리케어 시장 성장, CBT 앱 글로벌 투자 증가, 치료비 부담으로 셀프케어 수요 확대
- 카테고리: mental health / therapy tech
- 핵심 기능: 오늘의 부정적 생각 입력 → AI CBT 5단계 질문으로 인지 왜곡 발견 → 왜곡 유형 라벨링 → 3가지 대안 관점 제시 → 주간 패턴 리포트
- 차별점: 기존 명상 앱(이완)과 달리 생각 패턴 자체를 바꾸는 CBT 기법 일상화. 하루 5분 마이크로 포맷

### 빌드
- 빌드 시간: 약 40초 (1회 통과)
- 배포 URL: https://sepe-slot-12.vercel.app

### PMF 검증
- PMF Score: 74.0% → **GRADUATE**
- Q1 분포: 매우실망 37명 / 약간실망 11명 / 실망안함 2명
- HXC 프로필: 24-35세 직장인·대학원생. 반복적 부정 사고 패턴. 심리상담 비용·접근성 장벽. 명상 앱으로 해결 안 됨
- 핵심 강점: AI 소크라테스식 질문으로 스스로 인지 왜곡 발견, 5분 짧은 세션, 인지 왜곡 유형 라벨링
- 개선 요청: 실제 AI 연동, 세션 저장·공유, 알림 기능

### 페르소나 하이라이트
> "신태양, 34세 레지던트": "5분짜리 세션이라는 게 핵심이에요. 15분 이상이었으면 안 썼을 거예요. 짧지만 확실히 머리가 맑아져요."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.168
- 시장 단계: innovators → early_adopters
- 신규 유입: 405명 (시뮬레이션)

---

## Cycle #11: NestPlan — GRADUATE

### 아이디어 발굴
- 트렌드 소스: 1인 가구 900만 돌파, 자취 인테리어 유튜브·틱톡 폭발적 성장, AI 홈 디자인 스타트업 투자 증가, 오늘의집 MAU 700만 돌파
- 카테고리: home & living / interior
- 핵심 기능: 방 타입/평수/예산/스타일 4가지 입력 → AI 가구 배치 우선순위 + 예산별 3단계 쇼핑 리스트 + 스타일 무드보드 즉시 생성
- 차별점: '내 방 크기·예산에 맞는 실행 가능한 플랜' 즉시 제공. 인테리어 초보의 결정 장애 해소

### 빌드
- 빌드 시간: 약 42초 (1회 통과)
- 배포 URL: https://sepe-slot-13.vercel.app

### PMF 검증
- PMF Score: 76.0% → **GRADUATE** (이번 세션 최고 점수)
- Q1 분포: 매우실망 38명 / 약간실망 10명 / 실망안함 2명
- HXC 프로필: 23-30세 첫 자취 직장인·학생 또는 신혼부부. 인테리어 경험 전무. 오늘의집 영감은 넘치지만 내 공간 적용 방법 모름
- 핵심 강점: 가구 구매 우선순위, 예산 3단계 티어, 스타일 무드보드 시각화
- 개선 요청: 실제 제품 이미지, 방 크기별 가구 사이즈 추천, 예산 초과 경고

### 페르소나 하이라이트
> "김다은, 25세 첫 자취 마케터": "소파 먼저 사면 안 된다는 거, 이 앱 보고 처음 알았어요. 진작 있었으면 100만원은 아꼈을텐데."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 0.252
- 시장 단계: innovators → early_adopters
- 신규 유입: 1,098명 (시뮬레이션)

---

## Cycle #12-13: CalenScope — ITERATE v1 (27.9%) → GRADUATE v2 (57.5%)

### 아이디어 발굴
- 트렌드 소스: HackerNews Show HN — Calens 브라우저 기반 캘린더 분석 도구 '서버 없음·온디바이스' 높은 관심 (2026-03); Millipixels 2026: 원격근무자 번아웃 대응 도구 수요 급증
- 카테고리: productivity
- 핵심 기능: Google 캘린더 .ics 파일 드래그앤드롭 → 카테고리별(회의/딥워크/행정/휴식) 주간 히트맵 + 도넛 차트 즉시 렌더링. 모든 데이터 localStorage, 서버 없음
- 차별점: 파일 업로드만으로 동작 — 계정·OAuth·서버 전송 없음. 30초 안에 인사이트 제공. RescueTime/Reclaim은 OAuth 필수이고 무거움

### 빌드
- v1 빌드 시간: 7초 (2차 시도)
- v2 빌드 시간: 40초 (1회 통과) — iterate_direction 반영, 818줄
- 배포 URL: https://sepe-slot-1.vercel.app

### PMF 검증
- PMF Score v1: 27.9% → ITERATE
- PMF Score v2: **57.5% → GRADUATE** (+29.6%p)
- Q1 분포 (v2): 매우실망 23명 / 약간실망 12명 / 실망안함 5명 (설문 모수 40명)
- HXC 프로필: 프리랜서·독립 컨설턴트, 30-45세, 다중 클라이언트 관리, 기존 타이머 앱 포기 경험, 캘린더가 이미 진실이라고 생각하는 사람, 프라이버시 중시
- 핵심 강점: 파일 업로드만으로 즉시 분석(계정·OAuth 없음), 기존 캘린더 데이터 그대로 활용(타이머 불필요), 모든 데이터 로컬 처리, 클라이언트/프로젝트별 필터링, 카테고리 규칙 커스터마이징
- 잔여 전환 조건: 주간/월간 트렌드 리포트 내보내기(5), 날짜 범위 선택(4), 팀 공유 기능(3)

### ITERATE 이력
- v1: PMF 27.9% → v2: PMF 57.5%

### 핵심 ITERATE 결정
- core_values 절대 유지 (즉시성·비서버·타이머 없음)
- Superhuman 50:50: 강화(히트맵 상단 카테고리 요약 카드 + 시간대 구분) + 개선(클라이언트 필터링 + 카테고리 커스터마이징)
- VSD 13명 중 9명이 conversion_condition 상위 2개 요청 → 구현 후 VD 전환 확인

### 페르소나 하이라이트
> "Tom Bauer, 44세 1인 경영 컨설턴트": "클라이언트명을 이벤트 제목에 붙이는 습관이 있는데, 이게 그대로 필터가 된다고요? 이건 Excel 집계를 완전히 버릴 수 있는 거네요. 내일부터 매주 씁니다."

### 시장 확장 (GRADUATE)
- 바이럴 계수 K: 산출 예정 (Bass Diffusion 증식 단계)
- 시장 단계: innovators (PMF 57.5% > 40% → early_adopters 확장 조건 충족)
- 주목: v1 27.9% → v2 57.5% 의 +29.6%p 점프는 세션 내 최대 ITERATE 개선폭

---

## Cycle #14: QuizForge — KILL

### 아이디어 발굴
- 트렌드 소스: HackerNews Show HN — Talimio IRT 기반 적응형 학습 플랫폼 높은 관심 (2026-03); Micro SaaS 2026 AI 학습 도구 30%+ 성장 예측
- 카테고리: education
- 핵심 기능: 텍스트 붙여넣기 → AI 퀴즈 생성 → IRT 기반 난이도 자동 조절 → 취약 토픽 분석
- 차별점: IRT 난이도 적응 + 계정 없이 즉시 사용 + 자체 자료로 문제 생성

### 빌드
- 빌드 시간: 약 35초 (1회 통과)
- 배포 URL: https://sepe-slot-2.vercel.app
- 주요 기능: 텍스트 입력 → 문제 수 선택 → IRT theta 기반 적응형 퀴즈 → 난이도별 정답률 분석 → localStorage 세션 저장 (425줄)

### PMF 검증
- PMF Score: **3.6% → KILL** (기준 25% 대비 현저히 미달)
- Q1 분포: 매우실망 1명 / 약간실망 10명 / 실망안함 17명 (활성화 완료 28명)
- 사전 설문 ND 확정: 14명 (50명 중)
- HXC 프로필 (VD 1명): 교육공학 전공 연구자, 24-28세, IRT 이론에 익숙한 innovator — 일반 수험생과 완전히 다른 동기
- 핵심 강점: IRT 난이도 적응 UI (진행 상황 + 능력치 표시), 퀴즈 세션 흐름 직관적, 난이도별 정답률 분석
- 개선 요청: 실제 AI 퀴즈 생성 (GPT 연동) 전원 1순위, 생성 문제 품질 검증, 모바일 최적화

### 8축 현실성 분석
- 관성: ChatGPT DIY가 강력한 대안. 관성 돌파 실패
- 빈도: 시험 시즌 고빈도, 비시즌 낮음 — 계절적 제품
- 신뢰: MVP 무명 사이트, 사용자 0명
- MVP 품질: 핵심 기능(AI 생성) 미작동. 더미 퀴즈만 생성 — 치명적
- 문제 강도: 카드 만들기 pain 실재하나 ChatGPT로 해결 중
- DIY 대체: ChatGPT로 80% 대체 가능 — 가장 치명적 약점
- 사회적 증거: 사용자 0, 리뷰 없음
- 리텐션: 더미 퀴즈로 재방문 동기 없음

### 페르소나 하이라이트
> "Eunbin Yoo, 25세 교육공학 석사생": "IRT + 즉시 생성 조합이 교육학적으로 의미있어요. 더미라서 아쉽지만, 실제 AI가 연동되면 제 연구에 진짜 쓸 것 같아요. 지금은... GPT한테 물어보면 되니까요."

### KILL 이유
1. 핵심 가치 제안(AI 퀴즈 생성)이 MVP에서 실제로 작동하지 않음 (더미 데이터)
2. ChatGPT DIY 대체가 너무 강함 — "ChatGPT에 붙여넣으면 되는데?"가 표준 반응
3. VD는 교육공학 전공 innovator 1명뿐. 일반 수험생/학생에게 충분한 가치 미전달
4. 프론트엔드 전용 MVP 한계: GPT API 클라이언트 연동 없이는 진짜 시연 불가

---

## Cycle #15: OrgLens — KILL

### 아이디어 발굴
- 트렌드 소스: ProductHunt 2026-03-27: InsideOrg — '모든 기업의 조직도 무료 뷰어' 상위권; SaaS 트렌드 2026: B2B 영업팀 AI 아웃리치 도구 수요 급증
- 카테고리: sales-intelligence
- 핵심 기능: 회사명 입력 → 공개 데이터 기반 조직 계층 트리 자동 렌더링 → 부서별 색상 구분, 의사결정자/게이트키퍼 강조, 접근 전략 표시
- 차별점: 무료 + 영업 맥락 특화 시각화. InsideOrg보다 게이트키퍼 식별·접근 전략 제공

### 빌드
- 빌드 시간: 5초 (1회 통과)
- 배포 URL: https://idea-20260328-093002-fnbk9b4wn-rhswl2135-9706s-projects.vercel.app
- 주요 기능: 회사명 입력 → 조직 계층 트리 → DM/GK 뱃지 → 노드 클릭 → 접근 전략 표시 → localStorage 저장/다중 회사 관리

### PMF 검증 (Validator v2 — 8축 현실성 평가)
- 총 페르소나: 100명 (Deep 20 / Mid 30 / Lite 50)
- 활성화 통과: 45명 (핵심 행동 2회: 조직도 생성 + 의사결정자 노드 클릭)
- PMF Score: **11.1% → KILL** (기준 25% 미달)
- Q1 분포: 매우실망 5명 / 약간실망 22명 / 실망안함 18명 (평가 모수 45명)
- VSD (전환 가능 SD): 14명 — 실제 데이터 연동 조건

### 8축 현실성 분석 (평균 점수 /10)
- 관성 2.8: 구글링+LinkedIn 수동 검색이 무료 대안. 관성 극복 어려움
- 빈도 7.1: B2B 영업에서 아웃리치는 주 1회+ → 빈도 강점 (유일한 긍정 축)
- 신뢰 2.1: MVP 무명 사이트, 데이터 출처 불명확
- MVP 품질 1.5: **치명적** — mock 데이터, 입력 회사 무관 동일 조직도 표시
- 문제 강도 5.2: 잘못된 연락처 아웃리치는 실제 시간 낭비 — 중간 강도
- DIY 대체 3.8: 구글링+LinkedIn으로 60~70% 대체 가능
- 사회적 증거 1.2: 0명, 신생 사이트
- 리텐션 2.3: mock 데이터면 다음 주 재방문 이유 없음

### HXC 프로필 (VD 5명)
Innovator/Early Adopter B2B 영업 종사자, 25-33세, 예산 제한으로 유료 도구 사용 불가, 아이디어에 열광하지만 mock 데이터 한계 인식. 일일 outbound 업무 비중 높음 (SDR, BDR, 스타트업 창업자)

### 핵심 강점 (Q3 — VD의 목소리)
- 조직 계층 시각화 컨셉과 의사결정자/게이트키퍼 구분 아이디어
- 접근 전략 제안 (노드별 아웃리치 방법 표시)
- 무료 + 즉시 접근 (로그인 불필요)

### 전환 조건 (Q4 — VSD의 목소리)
- 실제 회사 데이터 연동 (14/14명 요청) — LinkedIn public 스크래핑, 기업 사이트 크롤링
- 검색한 회사의 실제 인물 정보 표시
- 정기 업데이트 및 데이터 신뢰성 보장

### 페르소나 하이라이트
> "Priya Sharma, 28세 BDR (초기 스타트업)": "예산 없는 저한테 무료 조직도 시각화 도구는 정말 필요해요. 근데 Salesforce 넣었는데 Sarah Chen CEO가 나오는 게... 진짜 데이터가 아니잖아요. 실제 데이터가 연동되면 바로 쓸 것 같아요. 지금은 없어도 별 차이 없어요."

### KILL 이유
1. MVP의 근본적 한계: mock 데이터라서 어떤 회사를 입력해도 동일한 샘플 조직도 표시 → 실제 영업 활용 불가
2. 프론트엔드 전용 아키텍처로는 실제 데이터 수집 불가능 (LinkedIn 스크래핑 = 백엔드 필수)
3. 이 아이디어는 Sales Navigator/ZoomInfo와 같이 실제 데이터 파이프라인이 핵심 자산인 분야 → SEPE-template 범위 초과
4. 연속 2사이클 (QuizForge → OrgLens) 동일 패턴: "핵심 기능을 프론트엔드만으로 구현 불가"

### 구조적 교훈
QuizForge(AI 생성 미작동) + OrgLens(실제 데이터 없음) 연속 KILL은 중요한 패턴이다:
**프론트엔드 전용 MVP로 가치를 전달할 수 없는 아이디어 카테고리가 존재한다:**
- 실제 외부 데이터 의존 도구 (조직도, 가격 트래킹, 리뷰 집계 등)
- AI 생성 의존 도구 (실시간 GPT 호출 필요)
다음 아이디어 선정 시 "localStorage + 규칙 기반으로 핵심 가치를 충분히 데모할 수 있는가?"를 사전 체크해야 한다.

---

---

## Cycle #N+1 (2026-03-29 세션): MeetingGuard — KILL

### 아이디어 발굴
- 트렌드 소스: ProductHunt (Emery, Zenkit), HackerNews (264pt), G2 Calendly reviews, Quora
- 카테고리: productivity
- 핵심 기능: 캘린더 미팅 부하 시각화 + 위험 구간 강조 + 정중한 거절 템플릿 생성
- 차별점: Calendly처럼 미팅을 추가하는 게 아니라 미팅을 줄이는 도구
- Ranking Score: 77.8 (hype 85, trending 83, attention 67)

### 빌드
- 배포 URL: http://localhost:20004
- 빌드: Next.js, localStorage 기반 미팅 입력 + heatmap + 거절 템플릿

### PMF 검증
- PMF Score: 7.2% → **KILL**
- Layer 1: 122/250 통과 (48.8%)
- Layer 2: 96/122 통과 (78.7%)
- Layer 3: VD 18명 / SD 35명 / ND 197명
- HXC 프로필: Senior knowledge worker (Manager/Director), 30-45세, early adopter, 미팅 20+시간/주

### 핵심 실패 원인
- Retention Cliff: 미팅 수동 입력이 핵심 장벽. "Google Calendar에 이미 있는데 왜 다시 입력하나?"
- 8축 inertia + retention 실패: Google Calendar/Outlook 이미 쓰는 관성 극복 불가
- 학습: 캘린더 데이터는 .ics import 또는 API 연동 없이는 MVP로 핵심 가치 전달 불가

---

## Cycle #N+2 (2026-03-29 세션): LinkGuard — KILL

### 아이디어 발굴
- 트렌드 소스: HackerNews (UneeBee 459pt), Reddit r/startups, G2 Impact.com reviews, Amazon Affiliate 2026 변경
- 카테고리: creator
- 핵심 기능: 어필리에이트 링크 헬스 모니터링 — 일간 fetch 체크, 404 알림, 예상 손실 수익 표시
- 차별점: Linktree(수동 호스팅)와 달리 링크 상태 모니터링에 집중
- Ranking Score: 67.8

### 빌드
- 배포 URL: http://localhost:20001

### PMF 검증
- PMF Score: 0.0% → **KILL**
- Layer 1: 92/250 통과 (36.8%)
- Layer 2: 1/92 통과 (1.1%) — 치명적 Layer 2 붕괴
- Layer 3: VD 0명 / SD 1명 / ND 249명

### 핵심 실패 원인
- 낮은 빈도: 링크 깨짐은 월 1-2회 이벤트. 주 3회 이상 문제가 아님
- 긴급성 부족: Pain=1, AltAdv=1로 76명 Layer 2에서 조기 탈락
- 학습: 빈도가 주 1회 미만인 문제는 Sean Ellis VD 나오기 매우 어려움

---

## Cycle #N+3 (2026-03-29 세션): SpendSnap — ITERATE (PMF 13.2%)

### 아이디어 발굴
- 트렌드 소스: ProductHunt (Mint 종료 후 3.6M 이탈), Quora, Reddit (YNAB rage-quit), G2, AppStore
- 카테고리: finance
- 핵심 기능: 지출 텍스트 입력 → 키워드 카테고리 자동분류 → 도넛 차트 시각화 (은행 연동 없음)
- 차별점: 은행 연동 없음, 복잡한 설정 불필요, 완전 무료 기본
- Ranking Score: 68.5

### 빌드
- 배포 URL: http://localhost:20003

### PMF 검증
- PMF Score: 13.2% → **ITERATE**
- Layer 1: 98/250 통과 (39.2%)
- Layer 2: 86/98 통과 (87.8%) — Layer 2 통과율 높음: 가치 게이트는 강함
- Layer 3: VD 33명 / SD 30명 / ND 187명

### 핵심 가치 (core_values)
- 심플함 + 은행 연동 불필요
- 로컬 저장 (개인정보 보호)

### VSD 전환 조건 (만들 것)
1. 더 많은 시각화 옵션 (4명)
2. 예산 한도 알림 (3명)
3. 더 정확한 AI 카테고리 분류 (3명)
4. 내보내기 기능 (3명)

### ITERATE v2 방향
- 태그라인 변경: "수동 입력" 대신 "30초 지출 기록"으로 포지셔닝
- 예산 한도 알림 기능 추가
- 카테고리 분류 정확도 개선


---

## Cycle #N+4 (2026-03-29 세션): SpendSnap v2 — ITERATE Nascent (PMF 24.8%)

### ITERATE v2 개선사항
- 태그라인 변경: '영수증 입력 1초' → '30초 지출 기록, 과소비 자동 경고'
- 예산 한도 알림 추가 (카테고리별 월 예산 설정 + 초과 경고)
- 바 차트 추가 (주간 지출 비교)

### PMF 검증
- PMF Score: 24.8% → **ITERATE Nascent** (v1 13.2% → v2 24.8%, +11.6%p)
- Layer 1: 98/250 통과 (39.2%)
- Layer 2: 86/98 통과 (87.8%)
- Layer 3: VD 62명 / SD 30명 / ND 158명

### 인사이트
- VD 거의 2배 증가 (33→62명) — 태그라인 + 예산 알림 효과
- Layer 2 통과율 87.8% 유지 — 가치 게이트 강함
- v3 방향: 영수증 사진 스캔 (top VSD 요청) + 더 많은 시각화 옵션

---

## Cycle #N+5 (2026-03-29 세션): FocusLane — KILL

### PMF 검증
- PMF Score: 0.8% → **KILL**
- Layer 2 통과율 22.4% — 8축에서 inertia 극복 실패
- 핵심 실패: 급진적 제약 UX는 기존 투두앱 전환 비용 극복 불가

---

## Cycle #N+6 (2026-03-29 세션): ScreenParse — KILL

### PMF 검증
- PMF Score: 8.0% → **KILL**
- Layer 2: DIY축 실패 — ChatGPT Vision으로 대체 가능
- 핵심 실패: OCR 단독 기능은 LLM 이미지 입력으로 완전 대체 가능


---

## Cycle #N+7 (2026-03-29 세션): SpendSnap v3 — KILL (ITERATE 한도 소진)

### PMF 검증
- PMF Score: 0.4% → **KILL** (v1 13.2% → v2 24.8% → v3 0.4%)
- v3 영수증 사진 스캔 + 월별 트렌드 추가 → 오히려 포지셔닝 희석
- 교훈: v2의 '심플한 수동 입력 + 즉각 시각화' 포지셔닝이 핵심이었는데 v3에서 복잡도 추가로 이탈
- 이 세션 최고 PMF: SpendSnap v2 24.8% Nascent

---

## Cycle #N+8 (2026-03-29 세션): MoodMirror — KILL

### PMF 검증
- PMF Score: 0.0% → **KILL**
- Layer 2 통과율 15.5% — alt_advantage 낮음 (Daylio, Apple Health와 차별점 없음)
- 교훈: wellness/health 카테고리는 빅테크 앱 대비 명확한 차별화 필수

---

## Cycle #N+9 (2026-03-29 세션): FridgeSnap — KILL

### PMF 검증
- PMF Score: 1.6% → **KILL**
- Layer 1 통과율 20.4% — 비타겟 무관심 압도적
- 교훈: 냉장고 재고 관리는 능동적 입력 필요, 자동 데이터 수집 없으면 retention 불가

---

## 세션 중간 점검 (Cycle 9 완료 시점)

| 제품 | PMF | 판정 |
|------|-----|------|
| MeetingGuard | 7.2% | KILL |
| LinkGuard | 0.0% | KILL |
| SpendSnap v1 | 13.2% | ITERATE |
| FocusLane | 0.8% | KILL |
| ScreenParse | 8.0% | KILL |
| SpendSnap v2 | 24.8% | **ITERATE Nascent (최고)** |
| SpendSnap v3 | 0.4% | KILL (한도 소진) |
| MoodMirror | 0.0% | KILL |
| FridgeSnap | 1.6% | KILL |

**누적 학습 패턴 7개 확립 — Cycle 6부터 적용**


---

## Cycle #10: CommitCraft — KILL

### 아이디어 발굴
- 카테고리: career
- 핵심 기능: git log 텍스트 붙여넣기 → 기술 스택 키워드 감지 → 정량화된 이력서 bullet 자동 생성
- 차별점: 커밋 히스토리를 경력 스토리로 전환, 이직 준비 개발자 대상

### 빌드
- 배포 URL: http://localhost:20010

### PMF 검증
- PMF Score: 8.4% → **KILL**
- VD: 21/250 | VSD: 22 | ND: 16
- L1 통과율 (target): 66.4% (83/125)
- L2 통과율 (target): 63.9% (53/83)
- L2 주요 이탈: "ChatGPT에 붙여넣는 게 더 낫다", "generic bullet", "영어만 생성"

### 교훈
> git log 파싱 자체는 가치이나 bullet 생성 품질이 ChatGPT보다 낮으면 전환 불가. 단순 텍스트 변환은 AI 도구로 즉시 대체 가능.

---

## Cycle #11: PortfolioMood — KILL

### 아이디어 발굴
- 카테고리: finance
- 핵심 기능: 기분 일지 + 포트폴리오 수익률 상관관계 분석 — "기분이 투자 성과에 영향을 미치는가?"
- 차별점: 감정적 투자 패턴 인식, 로컬 저장

### 빌드
- 배포 URL: http://localhost:20009

### PMF 검증
- PMF Score: 3.2% → **KILL**
- VD: 8/250 | VSD: 12 | ND: 24
- L1 통과율 (target): 60.0% (75/125)
- L2 통과율 (target): 42.7% (32/75)
- L2 주요 이탈: "수동 포트폴리오 입력 부담", "인사이트가 너무 단순", "기간 데이터 없어 패턴 파악 불가"

### 교훈
> '투자자 AND 기분추적자' 교차점은 전체 모집단의 5% 미만. 두 가지 독립 습관의 교차점 제품은 타겟 풀이 치명적으로 작음.

---

## Cycle #12: FriendMeter — KILL

### 아이디어 발굴
- 카테고리: social
- 핵심 기능: 친구/지인 연락 빈도 추적 + 소홀해진 관계 알림
- 차별점: 로컬 저장, 연락 히트맵, 관계 점수

### 빌드
- 배포 URL: http://localhost:20011

### PMF 검증
- PMF Score: 6.0% → **KILL**
- VD: 15/250 | VSD: 22 | ND: 24
- L1 통과율 (target): 61.6% (77/125)
- L2 통과율 (target): 54.5% (42/77)
- L2 주요 이탈: "카톡 최근 대화 보면 되는데", "수동 입력 귀찮음", "알림 기능 없음"

### 교훈
> 연락 빈도 추적은 카카오톡/iMessage가 이미 제공. API 연동 없이는 retention cliff 불가피. 소셜 앱은 기존 메신저 연동 필수.

---

## 세션 요약 (Cycle 1~12)
- 총 KILL: 10개 | GRADUATE: 0개
- 최고 PMF: SpendSnap v2 24.8% (Nascent)
- 확인된 kill 패턴: 10개
- 다음 사이클 방향: 자동 데이터 수집, 기존 워크플로우 위에 얹히는 제품, 매일 발생하는 문제

