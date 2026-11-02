#!/usr/bin/env bash
# copy-images.sh
# Run once from the project root to copy all guide images into public/images/guides/
# Usage: bash scripts/copy-images.sh

set -e

BRAIN="/Users/user/.gemini/antigravity-ide/brain/61cc3544-9809-4cb4-8074-f7f8e458c8a8"
PUBLIC="$(cd "$(dirname "$0")/.." && pwd)/public/images/guides"

echo "📂 Brain folder : $BRAIN"
echo "📂 Public target: $PUBLIC"
echo ""

# ── Google Business Profile (11 images) ──────────────────────────────────────
GBP="$PUBLIC/google-business-profile-optimization"
mkdir -p "$GBP"

cp "$BRAIN/gbp_step01_claim_1793510011731.png"        "$GBP/step01_claim.png"
cp "$BRAIN/gbp_step02_categories_1793510022178.png"   "$GBP/step02_categories.png"
cp "$BRAIN/gbp_step03_verify_1793511566086.png"       "$GBP/step03_verify.png"
cp "$BRAIN/gbp_step04_description_1793511582686.png"  "$GBP/step04_description.png"
cp "$BRAIN/gbp_step05_services_1793511603636.png"     "$GBP/step05_services.png"
cp "$BRAIN/gbp_step06_hours_1793511621063.png"        "$GBP/step06_hours.png"
cp "$BRAIN/gbp_step07_photos_1793511645105.png"       "$GBP/step07_photos.png"
cp "$BRAIN/gbp_step08_reviews_1793511670280.png"      "$GBP/step08_reviews.png"
cp "$BRAIN/gbp_step09_posts_1793511698373.png"        "$GBP/step09_posts.png"
cp "$BRAIN/gbp_step10_qanda_1793511719111.png"        "$GBP/step10_qanda.png"
cp "$BRAIN/gbp_step11_performance_1793511752468.png"  "$GBP/step11_performance.png"

echo "✅ GBP images (11) copied"

# ── SEO Audit (6 images so far – steps 7–10 pending quota reset 8 Nov) ───────
AUDIT="$PUBLIC/how-to-do-an-seo-audit"
mkdir -p "$AUDIT"

cp "$BRAIN/audit_step01_baseline_1793512770850.png"   "$AUDIT/audit_step01_baseline.png"
cp "$BRAIN/audit_step02_crawl_1793512780836.png"      "$AUDIT/audit_step02_crawl.png"
cp "$BRAIN/audit_step03_indexing_1793512790652.png"   "$AUDIT/audit_step03_indexing.png"
cp "$BRAIN/audit_step04_pagespeed_1793512801390.png"  "$AUDIT/audit_step04_pagespeed.png"
cp "$BRAIN/audit_step05_onpage_1793512837488.png"     "$AUDIT/audit_step05_onpage.png"
cp "$BRAIN/audit_step06_contentgap_1793512848193.png" "$AUDIT/audit_step06_contentgap.png"

echo "✅ SEO Audit images (6/10) copied"

echo ""
echo "🎉 Done! All available images are in $PUBLIC"
echo "   Steps 7–10 of the audit + all other guides pending image quota reset (8 Nov)."
