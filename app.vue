<script setup lang="ts">
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: '平山工業株式会社',
        alternateName: 'Hirayama Kogyo Co., Ltd.',
        url: 'https://h-industry.co.jp',
        telephone: '+81-3-3646-7450',
        faxNumber: '+81-3-3615-6522',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '北砂6-7-13 ヒラヤマビル2階',
          addressLocality: '江東区',
          addressRegion: '東京都',
          postalCode: '136-0073',
          addressCountry: 'JP',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '08:00',
            closes: '17:00',
          },
        ],
        description: '平山工業株式会社は、1974年の創業以来、鉄筋工事・溶接工事の専門企業として関東全域の建設現場を支え続けています。',
        areaServed: '関東全域',
      }),
    },
  ],
})
</script>

<template>
  <div>
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>
