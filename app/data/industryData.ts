export const INDUSTRY_DB = {
  "製薬・医療": {
    description: "医薬品開発から医療機器、サービスまでを扱う業界。",
    commonJobs: ["営業(MR)", "事務", "マーケティング", "人事・総務"],
    specializedJobs: {
      "研究開発": { description: "新薬の基礎研究・臨床試験", salary: "600-1200万" },
      "生産管理": { description: "医薬品の製造・品質管理", salary: "500-900万" },
      "薬事": { description: "当局への承認申請業務", salary: "600-1100万" }
    }
  },
  "IT・通信": {
    description: "Webサービスやインフラ、ソフトウェア開発など。",
    commonJobs: ["営業", "事務", "マーケティング", "人事・総務"],
    specializedJobs: {
      "フロントエンドエンジニア": { description: "UIの実装", salary: "450-800万" },
      "データサイエンティスト": { description: "分析・AI活用", salary: "600-1200万" },
      "インフラエンジニア": { description: "サーバー・ネットワーク構築", salary: "400-850万" }
    }
  },
  "金融・証券": {
    description: "銀行、証券、保険などお金の流れを支える業界。",
    commonJobs: ["事務", "人事・総務"],
    specializedJobs: {
      "法人営業": { description: "企業への融資・資金調達提案", salary: "500-1000万" },
      "運用担当(ファンドマネージャー)": { description: "資産運用の戦略・実行", salary: "800-1500万" },
      "金融コンサルタント": { description: "個人・法人への資産運用アドバイス", salary: "500-1200万" }
    }
  },
  "コンサルティング": {
    description: "企業の経営課題を解決するプロフェッショナル。",
    commonJobs: ["事務", "人事・総務"],
    specializedJobs: {
      "経営コンサルタント": { description: "戦略立案・業務改善", salary: "700-1500万" },
      "ITコンサルタント": { description: "ITシステム導入の戦略立案", salary: "600-1200万" }
    }
  },
  "テレビ・マスコミ": {
    description: "放送、映像制作、コンテンツビジネス。",
    commonJobs: ["営業", "事務", "マーケティング", "人事・総務"],
    specializedJobs: {
      "番組ディレクター": { description: "番組制作の指揮", salary: "400-900万" },
      "編成": { description: "番組枠の企画・戦略", salary: "500-1000万" },
      "技術スタッフ": { description: "撮影・照明・音響", salary: "350-700万" }
    }
  },
  "商社": {
    description: "物流・販売網を活用したトレード・事業投資。",
    commonJobs: ["営業", "事務", "人事・総務"],
    specializedJobs: {
      "海外営業": { description: "グローバルな製品輸出入・調達", salary: "600-1300万" },
      "物流管理": { description: "サプライチェーンの最適化", salary: "500-900万" }
    }
  }
} as const;