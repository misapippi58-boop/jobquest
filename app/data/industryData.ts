export const INDUSTRY_DB = {
  "IT・通信": {
    description: "デジタル技術で社会を支える成長業界。DXやインフラ構築が中心です。",
    jobs: {
      "フロントエンドエンジニア": {
        description: "ユーザーが目にする画面や機能をプログラミングする仕事。",
        salary: "450〜750万円",
        majorCompanies: ["LINEヤフー", "楽天グループ", "メルカリ"]
      },
      "サーバーエンジニア": {
        description: "Webサービスの裏側の仕組みやデータベースを構築・保守する仕事。",
        salary: "500〜850万円",
        majorCompanies: ["NTTデータ", "富士通", "さくらインターネット"]
      }
    }
  },
  "メーカー": {
    description: "モノづくりで生活を支える伝統的な業界。日本の技術力の中心です。",
    jobs: {
      "機械設計": {
        description: "CADソフトを用いて、製品の構造や部品を設計する仕事。",
        salary: "450〜800万円",
        majorCompanies: ["トヨタ自動車", "ソニーグループ", "パナソニック"]
      },
      "生産技術": {
        description: "製品を効率よく、かつ高品質に製造するためのラインを構築する仕事。",
        salary: "400〜750万円",
        majorCompanies: ["デンソー", "ダイキン工業"]
      }
    }
  }
} as const;