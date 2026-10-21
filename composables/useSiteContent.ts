/**
 * サイト全体で共有するデータを提供する composable。
 * テキスト・数値・URLなどの固定値はここに集約し、
 * コンポーネント内に直接書かない。
 */
export const useSiteContent = () => {
  // ─────────────────────────────────────────
  // 会社基本情報
  // ─────────────────────────────────────────
  const company = {
    name: '平山工業株式会社',
    nameEn: 'Hirayama Kogyo Co., Ltd.',
    tagline: '安全 丁寧 誠実',
    description:
      '平山工業株式会社は、1974年の創業以来、躯体構築一式工事の専門集団として関東全域の建設現場を支え続けています。',
    postalCode: '136-0073',
    address: '東京都江東区北砂6-7-13 ヒラヤマビル2階',
    addressFull: '〒136-0073 東京都江東区北砂6-7-13 ヒラヤマビル2階',
    tel: '03-3646-7450',
    telRaw: '0336467450', // href="tel:" 用
    fax: '03-3615-6522',
    hours: '9:00〜17:00',
    holidays: '土曜・日曜・祝日',
    hoursLabel: '受付時間 9:00〜17:00（土・日・祝定休）',
    established: '1974年（昭和49年）4月23日 有限会社平山工業設立<br>2001年（平成13年）12月23日 平山工業株式会社として増資設立',
    capital: '1,000万円',
    employees: '25',
    area: '関東',
    areaLabel: '関東全域（※他地域は要ご相談）',
    license: '東京都知事 許可（般-4）第71065号',
    ceo: '平山 和彦',
    executive: '平山 輝邦',
    officeAddress: '東京都江東区北砂5-17-37 福原マンション1階',
    businessTypes: '躯体構築工事一式',
    businessServices: [
      'コンクリート打設工事',
      '鉄筋工事',
      '大工工事',
      '足場工事',
      '型枠支保工工事',
      '溶接工事',
      '鍛冶工事',
    ] as readonly string[],
  } as const

  // ─────────────────────────────────────────
  // ナビゲーション
  // ─────────────────────────────────────────

  /** グローバルヘッダー用ナビ（ロゴ＝トップ、お問い合わせ=CTAボタンのため除く） */
  const navItems = [
    { label: '平山工業の強み', to: '/about/' },
    { label: '事業内容', to: '/business/' },
    { label: '施工実績', to: '/achievements/' },
    { label: '会社概要', to: '/company/' },
    { label: '求人情報', to: '/recruitment/' },
  ]

  /** フッター用ナビ（全8ページ） */
  const footerNavItems = [
    { label: 'トップページ', to: '/' },
    ...navItems,
    { label: 'お問い合わせ', to: '/contact/' },
  ]

  // ─────────────────────────────────────────
  // トップページコンテンツ
  // ─────────────────────────────────────────

  /** 3つの強み（icon = イラストアイコン名 genre/slug。assets/illust・public/images/illust にある） */
  const strengths = [
    {
      key: 'planning',
      title: '上流工程からでもワンストップで対応',
      shortDescription: 'スケジュール管理・工法選定など計画段階から参加し、現場を最適化します。',
      description:
        '施工だけでなく、工程計画の立案・工法選定・材料手配まで上流工程からご相談いただけます。元請け様の負担を減らしながら、現場全体の最適化を一緒に考えます。',
      detail:
        '着工前の施工計画・スケジュール調整・工法の選定から参加し、材料手配・施工・後片付けまでワンストップで対応いたしますので、元請け様の管理負担を大幅に削減することが可能です。もちろん、施工のみのご依頼も承っております。',
      highlights: [
        '着工前の工程計画・スケジュール管理から参加',
        '現場状況に合わせた工法選定をご提案',
        '材料手配から施工・後処理まで一括対応',
        '元請け様の管理負担を軽減するパートナー体制',
      ],
      icon: 'business/blueprint-ruler',
      imageSrc: '/images/strength_planning.JPG',
    },
    {
      key: 'versatility',
      title: 'あらゆる現場への対応力',
      shortDescription: '工種・規模を問わず関東全域に対応。住宅から大型インフラまで創業50年超の実績で応えます。',
      description:
        '戸建住宅の基礎から高速道路・地下鉄・浄水場まで、工種・規模を問わず対応。鉄筋・型枠・溶接・圧接を自社で一括して担える体制が、どんな現場の要望にも応えます。',
      detail:
        '鉄筋・型枠・足場・コンクリート打設など、躯体構築に必要な工種を一式で対応できるのが平山工業の強みです。さらには高速道路・地下鉄拡幅・浄水場・ダムといった大規模インフラまで、あらゆる規模の工事が可能です。創業50年超で積み上げた施工実績が、どんな現場でも通用する引き出しをつくっています。',
      highlights: [
        '躯体構築工事一式に対応可能',
        '各種工事は自社で一括完結',
        '関東全域・創業50年超の豊富な施工実績',
      ],
      icon: 'machines/tower-crane-site',
      imageSrc: '/images/strength_versatility.jpg',
    },
    {
      key: 'quality',
      title: '基準を満たした施工と安全管理',
      shortDescription: '職長による自主検査と全現場事故0の目標で、品質と安全を一体的に追求します。',
      description:
        '設計図・施工図への忠実な配筋と、職長による工程ごとの自主検査で品質を担保。作業前のヒヤリハット確認と全現場事故0の目標で、現場の安全を守ります。',
      detail:
        '平山工業では設計図・施工図に基づく正確な施工を徹底し、職長による配筋自主検査を各工程で実施しております。さらに作業前のヒヤリハット確認・現場ごとの安全ルール共有を通じて全現場での事故0を目標に掲げ、品質と安全を一体的に追求しています。',
      highlights: [
        '職長による自主検査を全工程で実施',
        '設計図・施工図への忠実な施工',
        '作業前のヒヤリハット確認・安全ルールの組織共有',
        '全現場における事故0を経営目標に設定',
      ],
      icon: 'safety/hard-hat',
      imageSrc: '/images/strength_quality.jpg',
    },
  ]

  /** 実績数値（強みページ・トップページで共用） */
  const stats = [
    { value: '50', unit: '年超', label: '創業からの実績' },
    { value: '25', unit: '名', label: '従業員数' },
    { value: '2', unit: '名', label: '1級土木施工管理技士' },
    { value: '2', unit: '名', label: '2級土木施工管理技士' },
  ]

  /** 会社沿革（トップページ・パンフレットで共用） */
  const history = [
    {
      step: '1974',
      title: '有限会社平山工業 設立',
      description: '東京都江東区にて有限会社平山工業を設立。鉄筋ガス圧接を中心に関東圏での施工を開始する。',
    },
    {
      step: '1980s',
      title: '杭頭補強筋の半自動溶接化技術を開発',
      description: '従来は熟練溶接工のみが担っていた杭頭補強筋溶接を半自動化。施工品質の均一化と工期短縮を同時に実現し、業界に先駆けた独自技術として注目を集める。',
    },
    {
      step: '1990',
      title: '関東全域への対応エリア拡大',
      description: '東京都内にとどまらず神奈川・埼玉・千葉など関東全域の現場に対応。高速道路・高架橋・地下鉄拡幅工事など大型インフラ案件の受注が増加する。',
    },
    {
      step: '1995',
      title: '鉄筋工事全般を開始',
      description: 'ガス圧接に加え、鉄筋の加工・組立を含む鉄筋工事全般の施工を開始。鉄筋工事全般・溶接工事の2本柱で、時代のニーズに応えながら事業を拡大していく。',
    },
    {
      step: '2001',
      title: '平山工業株式会社 増資設立',
      description: '事業規模の拡大に伴い株式会社化。資本金1,000万円にて平山工業株式会社を設立し、組織体制をさらに強化する。',
    },
    {
      step: '2002',
      title: 'J-BAR溶接・エンクローズ溶接（CB工法）を本格導入',
      description: '新工法の積極的な採用により、従来工法では困難だった複雑な継手や狭所施工にも対応。多様化する現場ニーズへの対応力をさらに高める。',
    },
    {
      step: '2018',
      title: '土木構築一式の施工を開始',
      description: 'お客様からのご要望に応え、土木構築一式の施工を開始する。',
    },
    {
      step: '現在',
      title: '従業員25名体制で関東全域を支える',
      description: '多能工・管理職を含む25名の体制で、あらゆる規模・工種の現場に対応。創業50年超の実績と技術力を次世代へ継承しながら、さらなる品質向上に取り組んでいる。',
    },
  ]

  /** 主要取引先 */
  const clients = [
    '大成建設株式会社',
    '五洋建設株式会社',
    '株式会社竹中土木',
    'RN建設株式会社',
    '株式会社フジタ',
    '飛島建設株式会社',
    'アイサワ工業株式会社',
    '千代田建設興業株式会社',
    '株式会社宮本組',
    '株式会社三沢工務店',
    '株式会社村上組',
    '株式会社ルチル開発',
  ]

  // ─────────────────────────────────────────
  // 求人情報
  // ─────────────────────────────────────────

  /** 募集職種 */
  const jobs = [
    {
      key: 'scaffolder',
      title: '鳶工',
      description:
        '足場や支保工の組立・解体を行い、現場の安全な作業環境をつくる仕事です。すべての工程の土台となる、現場に欠かせない存在です。',
      requirements: [
        '未経験者歓迎（先輩作業員が丁寧に指導します）',
        '経験者は給与・待遇を優遇',
        '足場の組立て等作業主任者などの資格取得を支援',
      ],
      icon: 'materials/scaffolding',
    },
    {
      key: 'laborer',
      title: '土工',
      description:
        '掘削・埋戻し・コンクリート打設など、現場の基礎づくりを幅広く担う仕事です。さまざまな工程に関わりながら、建設の基本を身につけられます。',
      requirements: [
        '未経験者歓迎（先輩作業員が丁寧に指導します）',
        '経験者は給与・待遇を優遇',
        '車両系建設機械などの資格取得を支援',
      ],
      icon: 'people/worker-digging',
    },
    {
      key: 'formwork',
      title: '型枠工',
      description:
        'コンクリートを流し込むための型枠を、図面をもとに加工・組立する仕事です。構造物の形と仕上がりを左右する、精度が求められる工程を担います。',
      requirements: [
        '未経験者歓迎（先輩作業員が丁寧に指導します）',
        '経験者は給与・待遇を優遇',
        '型枠施工技能士などの資格取得を支援',
      ],
      icon: 'people/worker',
    },
    {
      key: 'rebar',
      title: '鉄筋工',
      description:
        '設計図・施工図をもとに鉄筋を加工・運搬・組立する、建物の骨格をつくる仕事です。ベース配筋から柱・梁配筋まで、あらゆる現場で技術を磨けます。',
      requirements: [
        '未経験者歓迎（先輩作業員が丁寧に指導します）',
        '経験者は給与・待遇を優遇',
        '施工管理技士・1級鉄筋技能士の資格取得を支援',
      ],
      icon: 'people/engineer-helmet',
    },
    {
      key: 'manager',
      title: '現場管理',
      description:
        '工程・品質・安全を管理し、職人と元請けをつなぎながら現場を動かす仕事です。現場全体を見渡し、工事を完成へ導きます。',
      requirements: [
        '未経験者歓迎（現場経験から段階的に学べます）',
        '施工管理経験者は給与・待遇を優遇',
        '施工管理技士の資格取得を支援',
      ],
      icon: 'people/inspector',
    },
  ]

  /** 福利厚生 */
  const benefits = [
    {
      title: '社会保険完備',
      description: '健康保険・厚生年金・雇用保険・労災保険に加入しています。安心して長く働ける環境を整えています。',
    },
    {
      title: '資格取得支援制度',
      description: '施工管理技士・1級鉄筋技能士など、各種資格の取得費用を会社が支援します。',
    },
    {
      title: '単身用寮完備',
      description: '遠方からの入社もご安心ください。単身用の寮を用意しています。引越し費用については入社時にご相談ください。',
    },
    {
      title: '制服・安全具支給',
      description: '作業服・ヘルメット・安全靴など、業務に必要な装備はすべて会社が支給します。',
    },
    {
      title: '経験・スキル考慮',
      description: '経験年数・保有資格に応じて給与・待遇を優遇します。未経験からスタートしても段階的なキャリアアップが可能です。',
    },
    {
      title: '休暇制度',
      description: '土曜・日曜・祝日、夏季休暇、年末年始休暇。',
    },
  ]

  /** 採用コンセプトの3ポイント（ImageSplitSection の items に渡す） */
  const recruitmentPoints = [
    {
      key: 'team',
      title: 'チームの一員として行動できる方',
      shortDescription: '現場は仲間との連携が必須です。報告・連絡・相談を大切にできる方を求めています。',
    },
    {
      key: 'rules',
      title: '定められた手順を遵守できる方',
      shortDescription: '安全と品質を守るために、手順書・作業ルールを確実に守れる方を歓迎します。',
    },
    {
      key: 'manner',
      title: '社会人としての基本的なマナーが守れる方',
      shortDescription: '時間を守り、挨拶ができ、誠実に働ける方であれば経験・未経験は問いません。',
    },
  ]

  /** 応募〜入社の流れ */
  const applicationSteps = [
    {
      step: '01',
      title: 'お問い合わせ',
      description: 'お電話またはお問い合わせフォームよりご連絡ください。採用担当者が対応します。',
    },
    {
      step: '02',
      title: '書類選考',
      description: '履歴書（写真貼付）をご提出ください。内容を確認後、1週間以内にご連絡します。',
    },
    {
      step: '03',
      title: '面接',
      description: '弊社（東京都江東区）にお越しいただき、代表または担当者と面接を行います。',
    },
    {
      step: '04',
      title: '採用決定・入社',
      description: '合否をご連絡後、入社日・条件を調整して入社となります。不明点はお気軽にご相談ください。',
    },
  ]

  // ─────────────────────────────────────────
  // 施工実績
  // ─────────────────────────────────────────

  /**
   * 施工実績一覧。
   * 画像ファイルがある実績のみ。images は public/images/projects/ のパス。
   */
  const projects = [
    {
      key: 'hydrogen',
      name: '液化水素サプライチェーンの商用化実証における国内基地建設工事',
      location: '神奈川県川崎市',
      client: '大成建設株式会社',
      businessTypes: ['躯体一式'],
      images: [
        '/images/projects/液化水素サプライチェーンの商用化実証における国内基地建設工事_1.JPG',
        '/images/projects/液化水素サプライチェーンの商用化実証における国内基地建設工事_2.JPG',
        '/images/projects/液化水素サプライチェーンの商用化実証における国内基地建設工事_3.JPG',
        '/images/projects/液化水素サプライチェーンの商用化実証における国内基地建設工事_4.JPG',
      ],
    },
    {
      key: 'oyama',
      name: '小山市大行寺雨水ポンプ場建設工事',
      location: '栃木県小山市',
      client: '株式会社トーヨー冨士工',
      businessTypes: ['鉄筋工事', '足場工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/小山市大行寺雨水ポンプ場建設工事_1.JPG',
      ],
    },
    {
      key: 'mishima',
      name: '三島ダム洪水吐改修工事',
      location: '千葉県君津市',
      client: '五洋建設株式会社',
      businessTypes: ['鉄筋工事', '型枠工事', '足場工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/三島ダム洪水吐改修工事_1.JPG',
        '/images/projects/三島ダム洪水吐改修工事_2.JPG',
      ],
    },
    {
      key: 'shin-tomei',
      name: '新東名高速道路 秦野インターチェンジ工事',
      location: '神奈川県秦野市',
      client: '株式会社竹中土木',
      businessTypes: ['鉄筋工事'],
      images: [
        '/images/projects/新東名高速道路秦野インターチェンジ工事_1.JPG',
        '/images/projects/新東名高速道路秦野インターチェンジ工事_2.JPG',
        '/images/projects/新東名高速道路秦野インターチェンジ工事_3.JPG',
        '/images/projects/新東名高速道路秦野インターチェンジ工事_4.JPG',
      ],
    },
    {
      key: 'chiba-nogiku',
      name: 'ちば野菊の里浄水場築造工事',
      location: '千葉県松戸市',
      client: '飛島建設株式会社',
      businessTypes: ['鉄筋工事'],
      images: [
        '/images/projects/ちば野菊の里浄水場築造工事_1.JPG',
        '/images/projects/ちば野菊の里浄水場築造工事_2.JPG',
        '/images/projects/ちば野菊の里浄水場築造工事_3.JPG',
      ],
    },
    {
      key: 'gaikaku',
      name: '外郭放水路第3工区トンネル覆工工事',
      location: '埼玉県春日部市',
      client: '株式会社フジタ',
      businessTypes: ['鉄筋工事'],
      images: [
        '/images/projects/外郭放水路第3工区トンネル覆工工事_1.JPG',
        '/images/projects/外郭放水路第3工区トンネル覆工工事_2.JPG',
        '/images/projects/外郭放水路第3工区トンネル覆工工事_3.JPG',
      ],
    },
    {
      key: 'sakado',
      name: '社会資本整備総合交付金（補助街路）工事（坂戸市場・Ｐ２橋脚工）',
      location: '千葉県袖ヶ浦市',
      client: '株式会社シバサキ建設',
      businessTypes: ['躯体一式'],
      images: [
        '/images/projects/社会資本整備総合交付金（補助街路）工事（坂戸市場・Ｐ２橋脚工）_1.JPG',
        '/images/projects/社会資本整備総合交付金（補助街路）工事（坂戸市場・Ｐ２橋脚工）_2.JPG',
      ],
    },
    {
      key: 'hitachiomiya',
      name: '常陸大宮2太陽光発電所工事',
      location: '茨城県常陸大宮市',
      client: '株式会社フジタ',
      businessTypes: ['鉄筋工事'],
      images: [
        '/images/projects/常陸大宮2太陽光発電所工事_1.JPG',
        '/images/projects/常陸大宮2太陽光発電所工事_2.JPG',
      ],
    },
    {
      key: 'ukima',
      name: '浮間水再生センター導水渠耐震補強工事',
      location: '東京都北区',
      client: 'アイサワ工業株式会社',
      businessTypes: ['鉄筋工事', '型枠工事', '足場工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/浮間水再生センター導水渠耐震補強工事_1.JPG',
        '/images/projects/浮間水再生センター導水渠耐震補強工事_2.JPG',
      ],
    },
    {
      key: 'nomikawa',
      name: '呑川防潮堤耐震補強工事',
      location: '東京都大田区',
      client: 'アイサワ工業株式会社',
      businessTypes: ['鉄筋工事', '型枠工事', '足場工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/呑川防潮堤耐震補強工事_1.JPG',
        '/images/projects/2.png',
        '/images/projects/3.png',
      ],
    },
    {
      key: 'otomi',
      name: '大富橋維持工事',
      location: '東京都江東区',
      client: '千代田建設興業株式会社',
      businessTypes: ['鉄筋工事', '型枠工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/大富橋維持工事_1.JPG',
        '/images/projects/大富橋維持工事_2.JPG',
      ],
    },
    {
      key: 'tateyama',
      name: '館山電源室新設建築その他工事',
      location: '千葉県館山市',
      client: '株式会社トーヨー冨士工',
      businessTypes: ['鉄筋工事', '型枠工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/館山電源室新設建築その他工事_1.JPG',
        '/images/projects/館山電源室新設建築その他工事_2.JPG',
        '/images/projects/館山電源室新設建築その他工事_3.JPG',
      ],
    },
    {
      key: 'ariake',
      name: 'R7国道357号有明橋山側下部工事',
      location: '東京都江東区',
      client: 'RN建設株式会社',
      businessTypes: ['躯体一式'],
      images: [
        '/images/projects/R7国道357号有明橋山側下部工事_1.JPG',
        '/images/projects/R7国道357号有明橋山側下部工事_2.JPG',
        '/images/projects/R7国道357号有明橋山側下部工事_3.JPG',
      ],
    },
    {
      key: 'twin-city',
      name: 'ツインシティ大神地区調整池築造工事',
      location: '神奈川県平塚市',
      client: '飛島建設株式会社',
      businessTypes: ['足場工事', '支保工事', 'コンクリート打設工事'],
      images: [
        '/images/projects/ツインシティ大神地区調整池築造工事_1.JPG',
        '/images/projects/ツインシティ大神地区調整池築造工事_2.JPG',
        '/images/projects/ツインシティ大神地区調整池築造工事_3.JPG',
      ],
    },
  ].map(project => ({
    ...project,
    images: project.images.map(src => usePublicUrl(src)),
  }))

  /** トップページに掲載する施工実績（この順で表示） */
  const featuredProjectKeys = ['hydrogen', 'oyama', 'mishima', 'sakado']
  const featuredProjects = featuredProjectKeys.flatMap(key => projects.filter(p => p.key === key))

  // ─────────────────────────────────────────
  // 品質と安全
  // ─────────────────────────────────────────

  /** 品質管理の取り組み */
  const qualityItems = [
    {
      key: 'drawing',
      title: '設計図・施工図への忠実な施工',
      description: '設計図・施工図に基づき、鉄筋の径・間隔・かぶり厚さを正確に再現。図面との乖離をゼロにすることが品質の起点です。',
      icon: 'business/blueprint-roll',
    },
    {
      key: 'inspection',
      title: '職長による配筋自主検査',
      description: '各工程の完了時に職長が配筋の自主検査を実施。組立・結束・かぶり厚さを目視と計測で確認し、次工程へ進む前に品質を担保します。',
      icon: 'safety/checklist',
    },
    {
      key: 'visual',
      title: '作業後の目視確認の徹底',
      description: '施工後の全体目視確認を義務化。見落としやすい端部・交差部・コーナー部の確認を徹底し、補修が必要な箇所は即座に対応します。',
      icon: 'safety/magnifier',
    },
  ]

  /** 安全管理の取り組み */
  const safetyItems = [
    {
      key: 'kiken',
      title: '作業前のヒヤリハット確認',
      description: '毎朝の作業開始前にKY（危険予知）活動を実施。その日の作業内容に潜む危険を洗い出し、対策を全員で共有してから施工を開始します。',
      icon: 'safety/caution-triangle',
    },
    {
      key: 'rules',
      title: '現場ごとの安全ルール共有',
      description: '現場の環境・工種に応じた安全ルールを策定し、作業員全員へ周知。ルールの形骸化を防ぐため、定期的な内容の見直しと再共有を行います。',
      icon: 'business/presentation-board',
    },
    {
      key: 'report',
      title: '違和感・不備の即時報告',
      description: '作業中に気づいた違和感・不備は即時報告・共有を義務化。小さな気づきを組織全体で積み上げることで、事故の芽を事前に摘み取ります。',
      icon: 'business/smartphone',
    },
  ]

  // ─────────────────────────────────────────
  // 技術紹介
  // ─────────────────────────────────────────

  /** 対応溶接工法 */
  const weldingMethods = [
    {
      key: 'flare',
      title: 'フレア溶接',
      description:
        '鉄筋を重ね合わせた部分にアーク溶接を施す工法。複雑な形状の鉄筋製作が可能で、耐震補強建築物・高速道路高架橋などで採用されています。',
      icon: 'materials/arc-welding',
    },
    {
      key: 'jbar',
      title: 'J-BAR溶接（NewJ-BAR）',
      description:
        'J形開先溶接継手による工法。従来のフレア溶接が抱えていた溶接欠陥・有効のど厚管理の困難さを解決し、信頼性の高い継手を実現します。',
      icon: 'materials/welding-torch-spark',
    },
    {
      key: 'enclose',
      title: 'エンクローズ溶接（CB工法）',
      description:
        'セラミック製裏当材と半自動溶接機による開先内溶接工法。狭い場所でも施工でき、2本の鉄筋を確実に接合します。',
      icon: 'materials/corner-welding',
    },
    {
      key: 'pile',
      title: '鋼管杭ズレ止溶接',
      description:
        '鋼管杭にリングを溶接・補強することでズレを防止する工法。正確な位置決めと強固な接合で地盤への定着を確実にします。',
      icon: 'materials/tig-welding',
    },
  ]

  // ─────────────────────────────────────────
  // 事業内容
  // ─────────────────────────────────────────

  /** 事業一覧 */
  const businesses = [
    {
      key: 'structure',
      title: '躯体構築工事一式',
      shortDescription:
        '鉄筋・型枠・足場・支保工・コンクリート打設を中心に、土木躯体構築に必要な工事を一式で対応。スポットでの個別依頼にもお応えします。',
      description:
        '躯体構築工事を一式で請け負います。主力の鉄筋・型枠・足場・支保工・コンクリート打設に加え、左官・鍛冶・圧接・溶接にも対応。一式でのご依頼はもちろん、必要な工種だけのスポット対応も可能です。',
      services: [
        { name: '鉄筋工事', primary: true },
        { name: '型枠工事', primary: true },
        { name: '足場工事', primary: true },
        { name: '支保工事', primary: true },
        { name: 'コンクリート打設工事', primary: true },
        { name: '左官工事', primary: false },
        { name: '鍛冶工事', primary: false },
        { name: '圧接工事', primary: false },
        { name: '溶接工事', primary: false },
      ],
      icon: 'structures/building-frame',
    },
  ]

  /** 施工実績・対応工種 */
  const workTypes = [
    '橋台工事',
    '橋脚工事',
    '擁壁工事',
    '浄水場',
    '耐震補強工事',
    '高速道路',
    'トンネル工事',
    '高架橋',
    '公共施設',
    '基礎工事',
    '地下鉄拡幅工事',
  ]

  return {
    company,
    navItems,
    footerNavItems,
    strengths,
    stats,
    history,
    clients,
    projects,
    featuredProjects,
    qualityItems,
    safetyItems,
    weldingMethods,
    businesses,
    workTypes,
    jobs,
    benefits,
    applicationSteps,
    recruitmentPoints,
  }
}
