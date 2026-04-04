<script setup lang="ts">
useHead({ title: '会社概要 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業株式会社の会社概要。所在地・代表者・設立・資本金・建設業許可番号など基本情報をご紹介します。',
})

const { company } = useSiteContent()

const companyRows = [
  { label: '社名', value: company.name },
  { label: '代表取締役社長', value: company.ceo },
  { label: '専務取締役', value: company.executive },
  { label: '設立', value: company.established },
  { label: '資本金', value: company.capital },
  { label: '従業員数', value: `${company.employees}名` },
  {
    label: '所在地（本社）',
    value: `〒${company.postalCode}<br>${company.address}`,
  },
  {
    label: '所在地（営業所）',
    value: company.officeAddress,
  },
  {
    label: 'TEL',
    value: `<a href="tel:${company.telRaw}" class="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-150">${company.tel}</a>`,
  },
  { label: 'FAX', value: company.fax },
  { label: '受付時間', value: `${company.hours}（${company.holidays}定休）` },
  { label: '営業エリア', value: `${company.area}全域` },
  { label: '事業内容', value: company.businessTypes },
  { label: '建設業許可', value: company.license },
]
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Company"
      title="会社概要"
      description=""
    />

    <!-- ===== 2. 会社概要テーブル + 地図 ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <!-- 左：会社概要テーブル -->
          <div>
            <SectionHeading label="Overview" title="会社概要" align="left" class="mb-8" />
            <dl class="space-y-0 text-sm">
              <div
                v-for="row in companyRows"
                :key="row.label"
                class="grid grid-cols-[9rem_1fr] gap-3 py-3 border-b border-neutral-100 last:border-0"
              >
                <dt class="text-neutral-500 font-medium pt-0.5">{{ row.label }}</dt>
                <dd class="text-neutral-800 leading-relaxed" v-html="row.value" />
              </div>
            </dl>
          </div>

          <!-- 右：地図 -->
          <div class="lg:sticky lg:top-24">
            <div class="rounded-sm overflow-hidden border border-neutral-200 shadow-sm">
              <iframe
                :src="`https://maps.google.com/maps?q=${encodeURIComponent(company.addressFull)}&output=embed&hl=ja`"
                :title="`${company.name} 所在地マップ`"
                class="w-full h-72 lg:h-96"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
            <p class="mt-3 text-xs text-neutral-400 leading-relaxed">
              {{ company.addressFull }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 3. CTA ===== -->
    <CtaSection />
  </main>
</template>
