'use client'

import { useState } from 'react'

export function ValidatorLimitations() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-900/60 transition-colors rounded-xl"
      >
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          구조적 한계 (Structural Limitations)
        </span>
        <span className="text-gray-600 text-xs">
          {isOpen ? '▲ 접기' : '▼ 펼치기'}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-3">
          <Limitation
            title="VD 낙관 편향 — 실제보다 15-20p 높게 측정"
            description="(1) Lite 25명(50%)의 규칙 기반 스코어링이 타겟 세그먼트에 유리하게 설계됨 (base 0.5 + innovator +0.20 + tech +0.10). (2) LLM 페르소나는 기본적으로 agreeable — '실망하시겠어요?' → '네' 경향. (3) 페르소나가 제품의 target_segment에 맞춰 생성되어 자기 충족적 예언 구조. 실제 PMF에서 40% 넘기가 어려운 이유는 돈·시간·전환비용이라는 실제 마찰이 있기 때문."
          />
          <Limitation
            title="시뮬레이션으로 시뮬레이션을 검증하는 구조"
            description="AI 페르소나의 응답으로 AI 검증 로직을 개선하는 순환 구조. 실제 인간 사용자의 감정적 반응을 완벽히 재현할 수 없으며, 시뮬레이션 편향이 누적될 위험이 있다."
          />
          <Limitation
            title="VSD/NSD 분류의 LLM 해석 의존"
            description="SD를 VSD와 NSD로 분리하는 기준이 Q3 키워드 매칭에 의존. LLM이 생성한 페르소나의 Q3 응답이 실제 사용자와 다른 패턴을 보일 수 있으며, 이는 VSD/NSD 비율을 왜곡할 수 있다."
          />
          <Limitation
            title="추세 추적의 인위성"
            description="실제 제품에서는 스프린트 간 시간 경과와 시장 변화가 있지만, 시뮬레이션에서는 이를 재현할 수 없다. 추세의 방향성은 유의미하지만 '속도'는 현실과 괴리가 있을 수 있다."
          />
          <Limitation
            title="세그먼트 동질성 가정"
            description="HXC 세그먼트를 하나의 동질 그룹으로 가정하지만, 실제로는 HXC 내에서도 다양한 하위 세그먼트가 존재할 수 있다. 세그먼트를 너무 좁히면 시장 크기가 부족하고, 너무 넓히면 PMF 신호가 희석된다."
          />
          <Limitation
            title="Superhuman 사례의 선택 편향"
            description="레브잇/Superhuman 방법론은 '이미 성공한 사례'에서 역추적한 것. 이 방법론이 모든 제품 카테고리에서 동일하게 작동한다는 보장은 없다. 특히 B2B vs B2C, 하드웨어 vs 소프트웨어에서 VD 비율의 의미가 달라질 수 있다."
          />
        </div>
      )}
    </div>
  )
}

function Limitation({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-l-2 border-amber-500/30 pl-3">
      <p className="text-xs font-medium text-amber-400">{title}</p>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
    </div>
  )
}
