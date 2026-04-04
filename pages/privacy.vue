<script setup lang="ts">
useHead({ title: 'プライバシーポリシー | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業株式会社のプライバシーポリシーです。個人情報の取扱いについてご説明します。',
})

const { company } = useSiteContent()
</script>

<template>
  <main>
    <PageHero
      label="Privacy Policy"
      title="プライバシーポリシー"
      description=""
    />

    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-3xl mx-auto px-6">

        <p class="text-neutral-600 text-sm leading-relaxed mb-12">
          {{ company.name }}（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、
          以下のとおりプライバシーポリシーを定め、適切な取扱いに努めます。
        </p>

        <!-- 1 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            1. 取得する個人情報
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed mb-3">
            当社は、お問い合わせフォームおよび採用応募を通じて、以下の個人情報を取得することがあります。
          </p>
          <ul class="list-disc list-inside text-sm text-neutral-600 space-y-1 pl-2">
            <li>氏名</li>
            <li>会社名・所属</li>
            <li>メールアドレス</li>
            <li>電話番号</li>
            <li>お問い合わせ・ご相談の内容</li>
          </ul>
        </div>

        <!-- 2 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            2. 利用目的
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed mb-3">
            取得した個人情報は、以下の目的に限り利用します。
          </p>
          <ul class="list-disc list-inside text-sm text-neutral-600 space-y-1 pl-2">
            <li>お問い合わせ・ご相談への回答および連絡</li>
            <li>採用応募への選考・連絡</li>
            <li>当社サービスに関する必要な情報のご案内</li>
          </ul>
        </div>

        <!-- 3 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            3. 第三者への提供
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed mb-3">
            当社は、以下のいずれかに該当する場合を除き、取得した個人情報を第三者に提供しません。
          </p>
          <ul class="list-disc list-inside text-sm text-neutral-600 space-y-1 pl-2">
            <li>ご本人の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
          </ul>
        </div>

        <!-- 4 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            4. 業務委託先への提供
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed">
            当社は、お問い合わせフォームの処理にFormspree, Inc.（米国）のサービスを利用しており、
            フォームに入力された情報は同社のサーバーを経由して当社に送信されます。
            同社は当社の指示に従って情報を処理するものであり、目的外の利用はありません。
            Formspreeのプライバシーポリシーについては同社のウェブサイトをご参照ください。
          </p>
        </div>

        <!-- 5 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            5. 安全管理措置
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed">
            当社は、取得した個人情報の漏洩・滅失・毀損を防止するため、
            適切な安全管理措置を講じます。
            また、個人情報を取り扱う従業者に対して、適切な監督を行います。
          </p>
        </div>

        <!-- 6 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            6. 個人情報の開示・訂正・削除
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed">
            ご本人から個人情報の開示・訂正・削除・利用停止のご請求があった場合は、
            ご本人であることを確認のうえ、合理的な範囲で速やかに対応します。
            下記の窓口までお問い合わせください。
          </p>
        </div>

        <!-- 7 -->
        <div class="mb-10">
          <h2 class="text-base font-black text-primary-900 mb-3 pb-2 border-b border-neutral-200">
            7. プライバシーポリシーの変更
          </h2>
          <p class="text-sm text-neutral-600 leading-relaxed">
            当社は、法令の変更や取扱い内容の変化に応じて、
            本ポリシーを予告なく改定することがあります。
            改定後のポリシーは、当ウェブサイトへの掲載をもって効力を生じるものとします。
          </p>
        </div>

        <!-- 8 お問い合わせ窓口 -->
        <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <h2 class="text-base font-black text-primary-900 mb-4">
            8. 個人情報に関するお問い合わせ窓口
          </h2>
          <dl class="text-sm space-y-2">
            <div class="grid grid-cols-[6rem_1fr] gap-2">
              <dt class="text-neutral-500 font-medium">会社名</dt>
              <dd class="text-neutral-800">{{ company.name }}</dd>
            </div>
            <div class="grid grid-cols-[6rem_1fr] gap-2">
              <dt class="text-neutral-500 font-medium">所在地</dt>
              <dd class="text-neutral-800">〒{{ company.postalCode }} {{ company.address }}</dd>
            </div>
            <div class="grid grid-cols-[6rem_1fr] gap-2">
              <dt class="text-neutral-500 font-medium">電話番号</dt>
              <dd class="text-neutral-800">
                <a
                  :href="`tel:${company.telRaw}`"
                  class="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >{{ company.tel }}</a>
              </dd>
            </div>
            <div class="grid grid-cols-[6rem_1fr] gap-2">
              <dt class="text-neutral-500 font-medium">受付時間</dt>
              <dd class="text-neutral-800">{{ company.hours }}（{{ company.holidays }}定休）</dd>
            </div>
          </dl>
        </div>

        <p class="mt-8 text-xs text-neutral-400 text-right">
          制定日：2026年4月4日
        </p>

      </div>
    </section>
  </main>
</template>
