/**
 * パンフレット専用の設定・コピー。
 * 会社情報・強み・施工実績などの共有データは composables/useSiteContent.ts から読み込み、
 * ここにはパンフレットにしか出てこない文言とレイアウト設定だけを置く。
 * ※ 会社概要以外の文言・写真は仮。
 */
export const brochure = {
  /** 総ページ数（表紙4ページ込み・4の倍数）。施工実績の一覧ページは残りの枠に自動で割り付ける */
  totalPages: 8,
  /** 施工実績 1ページあたりの最大件数（6件 = 2列 × 3段） */
  projectsPerPage: 6,

  /** サイトURL。空のあいだは QR コードを仮枠で表示する */
  siteUrl: '',

  cover: {
    catchcopy: ['丁寧な施工が', '未来を作る'],
    label: 'COMPANY PROFILE',
    /** パターンごとの表紙写真（A = classic / B = airy） */
    image: {
      classic: '/images/kutai.JPG',
      airy: '/images/projects/液化水素サプライチェーンの商用化実証における国内基地建設工事_2.JPG',
    },
  },

  greeting: {
    title: '人のために、未来のために。',
    paragraphs: [
      '平山工業株式会社は1974年の創業以来、躯体構築一式工事・土木工事を中心に、人々と地域に貢献してまいりました。ダム、発電所、橋——こうした構造物は、見えないところで多くの人々の暮らしを支えています。',
      '50年以上こうして事業を続けてこられたのは、信頼して任せてくださったお客様と、現場を守り続けてくれた職人たちのおかげです。「良い製品は良い人がつくる」——創業からのこの言葉を胸に、これからも地域に必要とされる会社であり続けます。',
    ],
    faceImage: '/images/president_face.png',
    signImage: '/images/president_sign.png',
  },

  business: {
    lead: '鉄筋・型枠から足場・支保工・コンクリート打設まで。躯体と土木の両面から、元請け様の現場を支えます。',
    images: {
      structure: '/images/projects/館山電源室新設建築その他工事_1.JPG',
      civil: '/images/projects/社会資本整備総合交付金（補助街路）工事（坂戸市場・Ｐ２橋脚工）_1.JPG',
    },
  },

  strengths: {
    lead: '計画段階からの参画、工種・規模を問わない対応力、そして基準を満たした施工と安全管理。元請け様の「任せて安心」を3つの柱で支えます。',
  },

  /**
   * 大きく見せる施工実績（2件・1ページ）。key = useSiteContent の projects[].key
   * images = 使う写真の番号（先頭が大きい写真・2〜3枚。表紙と同じ写真は自動で外す）、comment = 紹介文（仮）
   */
  pickupProjects: [
    {
      key: 'hydrogen',
      images: [0, 1, 2],
      comment: '水素社会の実現に向けた国家的プロジェクトの基地建設に参画。大規模な基礎・躯体を鉄筋から打設まで一式で担い、厳しい品質基準と工程に応えました。',
    },
    {
      key: 'mishima',
      images: [0, 1, 2],
      comment: '供用中のダムの洪水吐を改修。限られたヤードと水位変動のなかで、鉄筋・型枠・足場・打設を自社で組み合わせ、安全第一で施工を進めました。',
    },
  ],

  /** 一覧で見せる施工実績（key = useSiteContent の projects[].key、image = 使う写真の番号） */
  featuredProjects: [
    { key: 'nomikawa', image: 0 },
    { key: 'ukima', image: 0 },
    { key: 'ariake', image: 0 },
    { key: 'hitachiomiya', image: 0 },
    { key: 'otomi', image: 0 },
    { key: 'oyama', image: 0 },
  ],
} as const
