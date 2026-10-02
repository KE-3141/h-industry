<script setup lang="ts">
const heroImageUrl = usePublicUrl('/images/hero_1.JPG')
const rebarWorkUrl = usePublicUrl('/images/kutai.JPG')
const strengthsImageUrl = usePublicUrl('/images/strengths.png')
const presidentSignUrl = usePublicUrl('/images/president_sign.png')
const presidentFaceUrl = usePublicUrl('/images/president_face.png')
const presidentBgUrl = usePublicUrl('/images/president_bg.png')
const { company, strengths, workTypes, projects, businesses } = useSiteContent()
const featuredProjects = projects.slice(0, 4)

const historySteps = [
  {
    step: '1974',
    title: '有限会社平山工業 設立',
    description: '東京都江東区にて有限会社平山工業を設立。鉄筋工事業を中心に関東圏での施工を開始する。',
  },
  {
    step: '1980',
    title: '杭頭補強筋の半自動溶接化技術を開発',
    description: '従来は熟練溶接工のみが担っていた杭頭補強筋溶接を半自動化。施工品質の均一化と工期短縮を同時に実現し、業界に先駆けた独自技術として注目を集める。',
  },
  {
    step: '1990',
    title: '関東全域への対応エリア拡大',
    description: '東京都内にとどまらず神奈川・埼玉・千葉など関東全域の現場に対応。高速道路・高架橋・地下鉄拡幅工事など大型インフラ案件の受注が増加する。',
  },
  {
    step: '2001',
    title: '平山工業株式会社 増資設立',
    description: '事業規模の拡大に伴い株式会社化。資本金1,000万円にて平山工業株式会社を設立し、組織体制をさらに強化する。',
  },
  {
    step: '2010',
    title: 'J-BAR溶接・エンクローズ溶接（CB工法）を本格導入',
    description: '新工法の積極的な採用により、従来工法では困難だった複雑な継手や狭所施工にも対応。多様化する現場ニーズへの対応力をさらに高める。',
  },
  {
    step: '現在',
    title: '従業員25名体制で関東全域を支える',
    description: '鉄筋工・溶接工・管理職を含む25名の体制で、あらゆる規模・工種の現場に対応。創業50年超の実績と技術力を次世代へ継承しながら、さらなる品質向上に取り組んでいる。',
  },
]
const strengthItems = strengths.map(s => ({ ...s, to: `/about/#${s.key}` }))


const companyRows = [
  { label: '社名', value: company.name },
  { label: '所在地', value: `〒${company.postalCode}<br>${company.address}` },
  {
    label: 'TEL',
    value: `<a href="tel:${company.telRaw}" class="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-150">${company.tel}</a>`,
  },
  { label: '設立', value: company.established },
  { label: '従業員数', value: company.employees },
  { label: '営業エリア', value: company.area },
]
</script>

<template>
  <main>
    <!-- ===== 1. ヒーロー ===== -->
    <section
      class="relative min-h-[90svh] flex items-center overflow-hidden
             bg-primary-950"
    >
      <!-- ヒーロー写真（超大容量PNGはIPX経由だとdevでメモリ不足→IPC切断になりやすいため直配信） -->
      <div class="absolute inset-0">
        <img
          :src="heroImageUrl"
          alt="鉄筋工事・溶接工事の施工現場"
          class="w-full h-full object-cover object-center md:object-[center_35%]"
          fetchpriority="high"
          loading="eager"
        />
      </div>
      <!-- 可読性用オーバーレイ（モバイル：下暗め縦グラデ / デスクトップ：左暗め横グラデ） -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary-950/30 via-primary-950/50 to-primary-950/85
               md:bg-gradient-to-r md:from-primary-950/85 md:from-[28%] md:via-primary-950/50 md:to-primary-900/15"
      />
      <!-- グリッド装飾 -->
      <div
        class="absolute inset-0 opacity-[0.04] pointer-events-none"
        style="background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px); background-size: 64px 64px;"
      />
      <!-- 光彩 -->
      <div
        class="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.12]
               bg-accent-500 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl
               pointer-events-none mix-blend-soft-light"
      />

      <div class="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 text-white">
        <p class="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase mb-5">
          Hirayama INDUSTRY .Inc
        </p>
        <h1 class="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-tight mb-7">
          {{ company.tagline }}
        </h1>
        <p class="text-neutral-200 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
          関東全域の建設現場で50年超の実績。<br>
          鉄筋・土木・溶接・圧接工事の専門集団として、<br class="hidden sm:block">
          あらゆる規模・工種の現場に対応します。
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <AppButton to="/contact/" size="lg">
            お問い合わせはこちら
            <IconArrow />
          </AppButton>
          <AppButton to="/business/" size="lg" variant="ghost">
            事業内容を見る
          </AppButton>
        </div>
      </div>

      <!-- スクロールインジケーター -->
      <div
        class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2
               flex flex-col items-center gap-2 text-white/70 text-xs tracking-widest"
      >
        <span>SCROLL</span>
        <div class="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>

    <!-- ===== 2. 会社について ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div v-reveal class="max-w-4xl mx-auto px-6 text-center">
        <SectionHeading
          label="About Us"
          class="mb-6"
        >
          良い製品は<br>良い人がつくる。
        </SectionHeading>
        <p class="text-neutral-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          {{ company.description }}
          地下鉄・高速道路・浄水場など社会インフラを担う現場で、
          確かな技術と安全管理で信頼に応えてきました。
        </p>
        <dl v-reveal class="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div class="text-center">
            <dd class="text-3xl md:text-4xl font-black text-primary-700">
              50<span class="text-xl">年超</span>
            </dd>
            <dt class="text-xs text-neutral-400 mt-1">創業からの実績</dt>
          </div>
          <div class="text-center">
            <dd class="text-3xl md:text-4xl font-black text-primary-700">
              {{ company.employees }}<span class="text-xl">名</span>
            </dd>
            <dt class="text-xs text-neutral-400 mt-1">従業員数</dt>
          </div>
          <div class="text-center">
            <dd class="text-3xl md:text-4xl font-black text-primary-700">
              {{ company.area }}<span class="text-xl">全域</span>
            </dd>
            <dt class="text-xs text-neutral-400 mt-1">対応エリア</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- ===== 2-B. 代表挨拶 ===== -->
    <section class="py-20 md:py-28 relative overflow-hidden bg-white">
      <!-- グリッド装飾 -->
      <div
        class="absolute inset-0 opacity-[0.08] pointer-events-none"
        style="background-image: linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px); background-size: 64px 64px;"
      />
      <div class="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 v-reveal class="text-2xl md:text-3xl font-bold leading-relaxed mb-8 text-primary-900">
          人のために、未来のために。
        </h2>
        <p v-reveal class="text-neutral-800 text-base leading-relaxed mb-5 text-left">
          平山工業株式会社は1974年の創業以来、躯体構築一式工事・土木工事を中心に、人々と地域に貢献してまいりました。ダム、発電所、橋——こうした構造物は、見えないところで多くの人々の暮らしを支えています。
        </p>
        <p v-reveal class="text-neutral-600 text-base leading-relaxed mb-10 text-left">
          50年以上こうして事業を続けてこられたのは、信頼して任せてくださったお客様と、現場を守り続けてくれた職人たちのおかげです。「良い製品は良い人がつくる」——創業からのこの言葉を胸に、これからも地域に必要とされる会社であり続けます。
        </p>
        <div v-reveal class="flex flex-col items-center gap-3">
          <!-- アバター -->
          <div class="w-32 h-32 rounded-full overflow-hidden">
            <img
              :src="presidentFaceUrl"
              alt="代表取締役社長 平山 和彦"
              class="w-full h-full object-cover object-[50%_15%]"
              loading="lazy"
            />
          </div>
          <span class="text-neutral-400 text-xs tracking-widest">代表取締役社長</span>
          <img
            :src="presidentSignUrl"
            alt="平山 和彦 署名"
            class="h-16 w-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <!-- ===== 3. 平山工業の強み ===== -->
    <SplitListSection
      :image-src="strengthsImageUrl"
      image-alt="平山工業の強み"
      label="Our Strengths"
      title="平山工業の強み"
      description="50年超の施工実績が培った技術・対応力・品質安全。3つの強みをご紹介します。"
      link-to="/about/"
      link-text="強みをくわしく見る"
      :items="strengthItems"
    />

    <!-- ===== 4. 事業内容ダイジェスト ===== -->
    <section class="py-20 md:py-28 bg-primary-900">
      <div class="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Our Business"
          title="事業内容"
          title-class="text-white"
          class="mb-14"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <BusinessCard
            v-for="biz in businesses"
            :key="biz.key"
            :label="biz.label"
            :title="biz.title"
            :description="biz.shortDescription"
            to="/business/"
            link-text="詳しく見る"
            :image-src="rebarWorkUrl"
            image-alt="施工現場"
          />
        </div>
      </div>
    </section>

    <!-- ===== 5. 対応工種ハイライト ===== -->
    <section class="pt-16 pb-16 bg-primary-900">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-center text-white text-sm font-medium mb-8 tracking-wide">
          対応工種・施工実績
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <TagBadge
            v-for="work in workTypes"
            :key="work"
            variant="ghost"
          >
            {{ work }}
          </TagBadge>
        </div>
      </div>
    </section>

    <!-- ===== 6. 施工実績 ===== -->
    <section class="py-20 md:py-24 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-end justify-between mb-10">
          <SectionHeading label="Achievements" title="施工実績" align="left" class="mb-0" />
          <SlideLink
            to="/achievements/"
            class="hidden sm:inline-flex items-center text-primary-600 font-semibold text-sm
                   hover:text-primary-800 transition-colors"
          >
            施工実績を全て見る
          </SlideLink>
        </div>
        <ul v-reveal class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <li
            v-for="project in featuredProjects"
            :key="project.key"
            class="group"
          >
            <div class="relative overflow-hidden rounded-xl aspect-[4/3] mb-3 bg-neutral-200">
              <img
                :src="project.images[0]"
                :alt="project.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <p class="text-sm font-bold text-primary-900 leading-snug mb-1">{{ project.name }}</p>
            <p class="text-xs text-neutral-400">{{ project.location }}</p>
          </li>
        </ul>
        <div class="mt-8 text-center sm:hidden">
          <AppButton to="/achievements/" variant="secondary">
            施工実績を全て見る
            <IconArrow />
          </AppButton>
        </div>
      </div>
    </section>

    <!-- ===== 7. 会社沿革 ===== -->
    <StepsSection
      label="History"
      title="会社沿革"
      :steps="historySteps"
    />

    <!-- ===== 7. 会社概要スニペット ===== -->
    <section class="py-20 md:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeading
              label="Company"
              title="会社概要"
              align="left"
              class="mb-8"
            />
            <dl class="space-y-0 text-sm">
              <div
                v-for="row in companyRows"
                :key="row.label"
                class="grid grid-cols-[6rem_1fr] gap-3 py-3 border-b border-neutral-100
                       last:border-0"
              >
                <dt class="text-neutral-500 font-medium">{{ row.label }}</dt>
                <dd class="text-neutral-800" v-html="row.value" />
              </div>
            </dl>
            <SlideLink
              to="/company/"
              class="inline-flex items-center mt-8 text-primary-600 font-semibold
                     hover:text-primary-800 transition-colors"
            >
              会社概要をくわしく見る
            </SlideLink>
          </div>

          <!-- 地図 -->
          <div class="rounded-sm overflow-hidden border border-neutral-200 shadow-sm">
            <iframe
              :src="`https://maps.google.com/maps?q=${encodeURIComponent(company.addressFull)}&output=embed&hl=ja`"
              :title="`${company.name} 所在地マップ`"
              class="w-full aspect-square"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 8. 求人バナー ===== -->
    <section class="py-16 md:py-20 bg-primary-800 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="md:flex items-center justify-between gap-8">
          <div class="mb-8 md:mb-0">
            <p class="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase mb-2">
              Recruitment
            </p>
            <h2 class="text-2xl md:text-3xl font-black mb-3">
              「良い製品は良い人がつくる」
            </h2>
            <p class="text-neutral-300 text-sm md:text-base leading-relaxed max-w-xl">
              鉄筋工・溶接工を随時募集しています。未経験者歓迎。
              資格取得支援制度・単身用寮完備。あなたの成長を全力でサポートします。
            </p>
          </div>
          <div class="flex-shrink-0">
            <AppButton to="/recruitment/" size="lg">
              採用情報を見る
              <IconArrow />
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 9. お問い合わせCTA ===== -->
    <CtaSection />
  </main>
</template>
