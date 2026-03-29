#!/bin/bash
# oh-my-pmf Vercel 슬롯 사전 생성
# 해커톤 전일에 실행하여 5개 프로젝트를 Vercel에 등록한다.

echo "🚀 Vercel 슬롯 사전 생성 시작"

# Vercel 로그인 확인
vercel whoami || { echo "❌ Vercel 로그인 필요: vercel login"; exit 1; }

SLOTS=("sepe-slot-1" "sepe-slot-2" "sepe-slot-3" "sepe-slot-4" "sepe-slot-5")
TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)/sepe-template"

for SLOT in "${SLOTS[@]}"; do
  echo "📦 $SLOT 생성 중..."
  TEMP_DIR=$(mktemp -d)
  cp -r "$TEMPLATE_DIR"/* "$TEMP_DIR/"
  cd "$TEMP_DIR"
  vercel link --project "$SLOT" --yes 2>&1 || echo "⚠️ $SLOT 링크 실패 (이미 존재할 수 있음)"
  vercel --prod --yes 2>&1 || echo "⚠️ $SLOT 초기 배포 실패"
  cd -
  rm -rf "$TEMP_DIR"
  echo "✅ $SLOT 완료"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 5개 슬롯 생성 완료"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
