/**
 * パンフレット専用の設定・コピー。
 * 会社情報・代表挨拶・強み・施工実績などの共有データは composables/useSiteContent.ts から読み込み、
 * ここにはパンフレットにしか出てこない文言とレイアウト設定だけを置く。
 */
export const brochure = {
  /** 総ページ数（表紙4ページ込み・4の倍数）。施工実績の一覧ページは残りの枠に自動で割り付ける */
  totalPages: 12,
  /** 施工実績 1ページあたりの最大件数（9件 = 3列 × 3段。件数はページ間で均等に割り振る） */
  projectsPerPage: 9,

  /** サイトURL（裏表紙の QR コードと表記）。空のあいだは QR コードを仮枠で表示する */
  siteUrl: 'https://www.hirayama-industry.jp/',

  cover: {
    /** トップページの見出しと同じ言葉 */
    catchcopy: ['誠実な人が、', '確かな施工をする。'],
    label: 'COMPANY PROFILE',
    /** パターンごとの表紙写真（A = classic / B = airy） */
    image: {
      classic: '/images/kutai.JPG',
      airy: '/images/projects/液化水素サプライチェーンの商用化実証における国内基地建設工事_3.JPG',
    },
  },

  greeting: {
    faceImage: '/images/president_face.jpg',
    signImage: '/images/president_sign.png',
  },

  business: {
    /** 事業内容ページのリード文と同じ */
    /** 先頭が大きい写真（2〜3枚）。hero_1.JPG は液化水素の写真と同じなのでピックアップと重複させない */
    images: [
      '/images/recruitment_bg.jpg',
      '/images/projects/館山電源室新設建築その他工事_1.JPG',
      '/images/projects/新東名高速道路秦野インターチェンジ工事_1.JPG',
    ],
  },

  strengths: {
    /** 強みページのリード文と同じ */
    lead: '創業50年超の実績が培った技術力・現場対応力・品質安全管理。平山工業が現場で大切にする3つの強みをご紹介します。',
  },

  /**
   * 大きく見せる施工実績（2件・1ページ）。key = useSiteContent の projects[].key
   * images = 使う写真の番号（先頭が大きい写真・2〜3枚。表紙と同じ写真は自動で外す）、comment = 紹介文（仮）
   */
  pickupProjects: [
    {
      key: 'hydrogen',
      images: [2, 3, 0],
      comment: '水素社会の実現に向けた国家的プロジェクトの基地建設に参画。大規模な基礎・躯体を鉄筋から打設まで一式で担い、厳しい品質基準と工程に応えました。',
    },
    {
      key: 'mishima',
      images: [0, 1],
      comment: '供用中のダムの洪水吐を改修。限られたヤードと水位変動のなかで、鉄筋・型枠・足場・打設を自社で組み合わせ、安全第一で施工を進めました。',
    },
  ],

  /**
   * 一覧の写真。ピックアップ以外の実績はサイトに載っているものをすべて一覧に出す（並びはサイトと同じ）。
   * key = useSiteContent の projects[].key、image = 使う写真の番号（省略時は先頭）、
   * focus = トリミングの中心（CSS の object-position。省略時は中央）
   */
  projectPhotos: {
    'shin-tomei': { image: 2 },
    'chiba-nogiku': { image: 2 },
    // 縦長の写真なので、奥の明るい坑口が枠に入るよう少し上を中心にする
    'gaikaku': { image: 2, focus: '50% 45%' },
    'ukima': { image: 1 },
    // _1 は解像度が低いので 2.png を使う
    'nomikawa': { image: 1 },
    // _1 は事業内容ページで使っている
    'tateyama': { image: 1 },
    'twin-city': { image: 2 },
  } as Record<string, { image?: number, focus?: string }>,

  /**
   * 施工実績のタイトルの改行位置。1行に収まらないときは区切りの位置で折り返す（収まるときは1行のまま）。
   * key = useSiteContent の projects[].key。区切りをつなげるとサイトのタイトルと一致すること（区切りの空白は末尾に付ける）
   */
  nameLines: {
    'hydrogen': ['液化水素サプライチェーンの', '商用化実証における', '国内基地建設工事'],
    'oyama': ['小山市大行寺', '雨水ポンプ場建設工事'],
    'shin-tomei': ['新東名高速道路 ', '秦野インターチェンジ工事'],
    'gaikaku': ['外郭放水路第3工区', 'トンネル覆工工事'],
    'sakado': ['社会資本整備総合交付金', '（補助街路）工事', '（坂戸市場・Ｐ２橋脚工）'],
    'ukima': ['浮間水再生センター', '導水渠耐震補強工事'],
    'ariake': ['R7国道357号', '有明橋山側下部工事'],
    'twin-city': ['ツインシティ', '大神地区調整池築造工事'],
  } as Record<string, string[]>,
} as const
