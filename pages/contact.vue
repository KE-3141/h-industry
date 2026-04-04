<script setup lang="ts">
useHead({ title: 'お問い合わせ | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業株式会社へのお問い合わせはこちら。鉄筋工事・溶接工事のご依頼・ご相談はお電話またはお問い合わせフォームよりお気軽にどうぞ。',
})

const { company } = useSiteContent()

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjogknd'

const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const errorMessage = ref('')

async function handleSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  const data = new FormData(form)

  status.value = 'submitting'
  errorMessage.value = ''

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    if (res.ok) {
      status.value = 'success'
      form.reset()
    } else {
      const json = await res.json().catch(() => ({}))
      errorMessage.value = json?.errors?.[0]?.message ?? '送信に失敗しました。時間をおいて再度お試しください。'
      status.value = 'error'
    }
  } catch {
    errorMessage.value = 'ネットワークエラーが発生しました。時間をおいて再度お試しください。'
    status.value = 'error'
  }
}
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Contact"
      title="お問い合わせ"
      description="鉄筋工事・溶接工事のご依頼・ご相談はお気軽にご連絡ください。お電話またはフォームにてお受けしています。"
    />

    <!-- ===== 2. メインコンテンツ ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          <!-- 左：お問い合わせフォーム -->
          <div class="lg:col-span-3">
            <h2 class="text-xl font-black text-primary-900 mb-8">お問い合わせフォーム</h2>
            <!-- 送信完了メッセージ -->
            <div
              v-if="status === 'success'"
              class="rounded-lg bg-green-50 border border-green-200 px-6 py-8 text-center"
            >
              <p class="text-green-800 font-bold text-base mb-1">送信が完了しました</p>
              <p class="text-green-700 text-sm">お問い合わせいただきありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。</p>
            </div>

            <form v-else class="space-y-6" @submit.prevent="handleSubmit">
              <!-- お名前 -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1.5" for="name">
                  お名前 <span class="text-accent-500 text-xs ml-1">必須</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder="例：山田 太郎"
                  required
                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-800
                         placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150"
                />
              </div>

              <!-- 会社名 -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1.5" for="company">
                  会社名
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  autocomplete="organization"
                  placeholder="例：株式会社〇〇建設"
                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-800
                         placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150"
                />
              </div>

              <!-- メールアドレス -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1.5" for="email">
                  メールアドレス <span class="text-accent-500 text-xs ml-1">必須</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="例：info@example.com"
                  required
                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-800
                         placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150"
                />
              </div>

              <!-- 電話番号 -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1.5" for="tel">
                  電話番号
                </label>
                <input
                  id="tel"
                  type="tel"
                  name="tel"
                  autocomplete="tel"
                  placeholder="例：03-0000-0000"
                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-800
                         placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150"
                />
              </div>

              <!-- お問い合わせ種別 -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1.5" for="type">
                  お問い合わせ種別 <span class="text-accent-500 text-xs ml-1">必須</span>
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-800
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150 bg-white"
                >
                  <option value="" disabled selected>選択してください</option>
                  <option value="鉄筋工事のご依頼・ご相談">鉄筋工事のご依頼・ご相談</option>
                  <option value="溶接工事のご依頼・ご相談">溶接工事のご依頼・ご相談</option>
                  <option value="採用に関するお問い合わせ">採用に関するお問い合わせ</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <!-- お問い合わせ内容 -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-1.5" for="message">
                  お問い合わせ内容 <span class="text-accent-500 text-xs ml-1">必須</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="お問い合わせ内容をご記入ください"
                  required
                  class="w-full border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-800
                         placeholder:text-neutral-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150"
                />
              </div>

              <!-- エラーメッセージ -->
              <p v-if="status === 'error'" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {{ errorMessage }}
              </p>

              <!-- 送信ボタン -->
              <button
                type="submit"
                :disabled="status === 'submitting'"
                class="w-full bg-primary-900 hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed
                       text-white font-bold py-4 px-8 rounded-lg transition duration-150 text-sm tracking-wide"
              >
                {{ status === 'submitting' ? '送信中…' : '送信する' }}
              </button>
            </form>
          </div>

          <!-- 右：連絡先情報 -->
          <div class="lg:col-span-2 lg:sticky lg:top-24 space-y-8">
            <!-- お電話 -->
            <div class="bg-primary-950 rounded-2xl p-8 text-white">
              <p class="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase mb-4">
                Phone
              </p>
              <a
                :href="`tel:${company.telRaw}`"
                :aria-label="`電話する ${company.tel}`"
                class="flex items-center gap-3 mb-2 group"
              >
                <IconPhone class="w-5 h-5 text-accent-400 flex-shrink-0" aria-hidden="true" />
                <span class="text-2xl font-black tracking-wide group-hover:text-accent-300 transition-colors">
                  {{ company.tel }}
                </span>
              </a>
              <p class="text-neutral-400 text-xs">{{ company.hoursLabel }}</p>
            </div>

            <!-- 所在地 -->
            <div class="border border-neutral-200 rounded-2xl p-8">
              <p class="text-primary-900 text-xs font-medium tracking-[0.2em] uppercase mb-4">
                Address
              </p>
              <dl class="space-y-3 text-sm">
                <div>
                  <dt class="text-neutral-500 text-xs mb-0.5">本社</dt>
                  <dd class="text-neutral-800 leading-relaxed">{{ company.addressFull }}</dd>
                </div>
                <div>
                  <dt class="text-neutral-500 text-xs mb-0.5">営業所</dt>
                  <dd class="text-neutral-800 leading-relaxed">{{ company.officeAddress }}</dd>
                </div>
                <div>
                  <dt class="text-neutral-500 text-xs mb-0.5">FAX</dt>
                  <dd class="text-neutral-800">{{ company.fax }}</dd>
                </div>
              </dl>
            </div>

            <!-- 地図 -->
            <div class="rounded-2xl overflow-hidden border border-neutral-200">
              <iframe
                :src="`https://maps.google.com/maps?q=${encodeURIComponent(company.addressFull)}&output=embed&hl=ja`"
                :title="`${company.name} 所在地マップ`"
                class="w-full h-56"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>
</template>
