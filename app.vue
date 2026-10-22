<script setup lang="ts">
const { company } = useSiteContent()
const { siteUrl } = useRuntimeConfig().public

/** 03-3646-7450 → +81-3-3646-7450 */
const toIntlTel = (tel: string) => tel.replace(/^0/, '+81-')

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: company.name,
        alternateName: company.nameEn,
        url: siteUrl,
        logo: `${siteUrl}/images/logo.svg`,
        telephone: toIntlTel(company.tel),
        faxNumber: toIntlTel(company.fax),
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.addressParts.street,
          addressLocality: company.addressParts.locality,
          addressRegion: company.addressParts.region,
          postalCode: company.postalCode,
          addressCountry: 'JP',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: company.openingHours.days,
            opens: company.openingHours.opens,
            closes: company.openingHours.closes,
          },
        ],
        description: company.description,
        areaServed: `${company.area}全域`,
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
