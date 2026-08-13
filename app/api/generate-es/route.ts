import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { industry, gakuchikaList, gakuchikaDetail, careerGoals, personalityType } = await req.json();

    // 1. AIに渡す命令文（プロンプト）を組み立てる
    const prompt = `
あなたは就活のプロのキャリアアドバイザーです。以下の条件に基づいて、魅力的で熱意が伝わるES（エントリーシート）の文章を1つ作成してください。

【条件】
- 志望業界/職種: ${industry}
- 学生時代に力を入れたこと（ガクチカ）: ${gakuchikaList.join("、")}
- ガクチカの詳細・メモ: ${gakuchikaDetail || "特になし"}
- 将来のビジョン: ${careerGoals.join("、")}
- 性格診断のタイプ: ${personalityType}

【出力形式】
- 自己PR・ガクチカをまとめた自然な文章を作成してください。
- 丁寧で熱意の伝わるトーン（です・ます調）にしてください。
- 余計な解説は省き、ESの本文のみを出力してください。
`;

    // 2. AIのAPIを呼び出す（例としてOpenAIのChatGPT APIを使う場合）
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // または gpt-4o など
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "文章の生成に失敗しました。";

    return NextResponse.json({ esText: generatedText });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}