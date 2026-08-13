export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: string; // "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"
  }[];
}

export interface Industry {
  id: string;
  name: string;
  description: string;
}

// ガクチカのテーマ ＋ 汎用的なサブ選択肢
export const gakuchikaOptions = [
  { 
    id: "part_time", 
    label: "アルバイト・接客経験",
    subOptions: ["接客・販売スタッフ", "飲食店・カフェスタッフ", "事務・データ入力アシスタント", "塾講師・家庭教師・教育系"] 
  },
  { 
    id: "study", 
    label: "学業・資格の取得・勉強",
    subOptions: ["資格試験・検定対策の勉強", "語学学習（TOEIC・英会話など）", "プログラミング・ITスキル学習", "専門分野の深い研究・履修"] 
  },
  { 
    id: "lab_research", 
    label: "研究・ゼミ活動",
    subOptions: ["卒業研究・論文執筆", "データ収集・分析作業", "プレゼンテーション・発表", "チームでの共同研究"] 
  },
  { 
    id: "circle", 
    label: "サークル・部活動・イベント運営",
    subOptions: ["リーダー・幹部としての組織運営", "イベント・文化祭の企画実行", "チームでの練習・大会出場", "メンバーのサポート・調整役"] 
  },
  { 
    id: "internship", 
    label: "インターン・長期インターン",
    subOptions: ["実務・プロジェクト参加", "マーケティング・企画の実践", "業界研究・企業ワーク", "チームでの課題解決"] 
  },
  { 
    id: "study_abroad", 
    label: "留学・語学学習",
    subOptions: ["語学留学・ホームステイ", "オンライン英会話・自習の継続", "異文化交流・ボランティア", "グローバルな環境での学び"] 
  },
];

// 将来のビジョン（汎用的な選択肢）
export const careerGoalOptions = [
  { id: "specialist", label: "専門性を深く極めてスペシャリストになる" },
  { id: "management", label: "マネジメントやリーダーとして組織を牽引する" },
  { id: "global", label: "グローバルな環境や海外に関わる仕事をする" },
  { id: "marketing", label: "データやマーケティングで新しい価値や戦略を創る" },
  { id: "customer_facing", label: "人との対話や接客を活かして信頼関係を築く" },
  { id: "team_supporter", label: "チームの縁の下の力持ちとして組織を支える" },
  { id: "entrepreneur", label: "将来的に起業や新規事業の立ち上げに挑戦する" },
  { id: "problem_solver", label: "課題を発見し、効率的な仕組みやシステムを構築する" },
];

export const industries: Industry[] = [
  { id: "it_web", name: "IT・Web・ベンチャー", description: "自社開発やアプリ運営、デジタルマーケティング" },
  { id: "manufacturer", name: "メーカー・商社", description: "モノづくりやグローバルな流通、法人営業" },
  { id: "consulting", name: "コンサルティング・金融", description: "データ分析、課題解決、戦略立案" },
  { id: "general", name: "一般企業・サービス・総合職", description: "幅広い業界で企画や営業、事務に挑戦する" },
];

export const questions: Question[] = [
  // --- E / I 次元 (3問) ---
  {
    id: 1,
    text: "人と話すことや、大勢のチームで何かを成し遂げるときは？",
    options: [
      { label: "みんなを巻き込んでワイワイ進めるのが好き", value: "E" },
      { label: "1人でじっくり考えたり、少人数で深く話す方が落ち着く", value: "I" },
    ],
  },
  {
    id: 2,
    text: "休日のエネルギーチャージの方法として近いのは？",
    options: [
      { label: "外に出て友人や知人と会ったり、イベントに参加する", value: "E" },
      { label: "自宅で1人静かに過ごしたり、趣味の時間を満喫する", value: "I" },
    ],
  },
  {
    id: 3,
    text: "会議やグループワークでの自分の立ち振る舞いは？",
    options: [
      { label: "積極的に発言し、その場の議論をリードしていく方だ", value: "E" },
      { label: "全体の意見を慎重に聞き、要所を突いた発言をする方だ", value: "I" },
    ],
  },

  // --- S / N 次元 (3問) ---
  {
    id: 4,
    text: "物事を進めるときに重視するのは？",
    options: [
      { label: "これまでのデータや実績、現実的な数字や事実", value: "S" },
      { label: "将来の可能性や、直感・ワクワクするアイデア", value: "N" },
    ],
  },
  {
    id: 5,
    text: "新しい知識や情報をインプットするときの好みは？",
    options: [
      { label: "すぐに実務や日常で使える具体的なノウハウや事例", value: "S" },
      { label: "物事の背景にある仕組みや、未来のトレンド・抽象的な概念", value: "N" },
    ],
  },
  {
    id: 6,
    text: "プロジェクトや計画を考えるとき、意識が向きやすいのは？",
    options: [
      { label: "足元のリスクや、今確実にやれる具体的なステップ", value: "S" },
      { label: "まだ誰もやっていないような新しいアプローチや全体像", value: "N" },
    ],
  },

  // --- T / F 次元 (3問) ---
  {
    id: 7,
    text: "チームやプロジェクトで決断を下すときは？",
    options: [
      { label: "論理的な正しさや、効率・合理性を優先する", value: "T" },
      { label: "周りの人の気持ちや、人間関係の調和を大切にする", value: "F" },
    ],
  },
  {
    id: 8,
    text: "トラブルや意見の対立が起きたとき、どう解決したい？",
    options: [
      { label: "事実と筋道（ロジック）に基づいて、客観的に正しい結論を出す", value: "T" },
      { label: "お互いの感情や立場に配慮し、全員が納得できる着地点を探す", value: "F" },
    ],
  },
  {
    id: 9,
    text: "メンバーの成果や取り組みを評価・フィードバックするときは？",
    options: [
      { label: "設定された目標に対する達成度や客観的な成果を基準にする", value: "T" },
      { label: "プロセスにおける本人の努力や、チームへの貢献度を温かく伝える", value: "F" },
    ],
  },

  // --- J / P 次元 (3問) ---
  {
    id: 10,
    text: "日々のスケジュールやタスクの管理は？",
    options: [
      { label: "事前にカチッと計画を立てて、その通りに進めたい", value: "J" },
      { label: "状況に合わせて柔軟に、臨機応変に変えていきたい", value: "P" },
    ],
  },
  {
    id: 11,
    text: "旅行や大きなイベントの準備をするときは？",
    options: [
      { label: "スケジュールや持ち物を細かくリストアップして備える", value: "J" },
      { label: "大まかな方向性だけ決めて、その場のノリや発見を楽しむ", value: "P" },
    ],
  },
  {
    id: 12,
    text: "仕事や課題の締め切りに対する取り組み方は？",
    options: [
      { label: "スケジュールを前倒しして、余裕を持って完了させる", value: "J" },
      { label: "直前の集中力（スパート）を活かして、期限ギリギリまで粘る", value: "P" },
    ],
  },
];