const axios = require("axios");

exports.analyzeReviewsWithAI = async (reviews) => {
  try {
    const reviewTexts = reviews.map((r) => r.Comment);

    const prompt = `
Analyze these restaurant reviews and return ONLY JSON in this format:

{
  "sentiment": "positive | negative | mixed",
  "summaryBullets": ["point1", "point2", "point3"],
  "topMentions": ["word1", "word2"]
}

Reviews:
${reviewTexts.join("\n")}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // 🔥 STEP 1: Extract ONLY JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // 🔥 STEP 2: Fix sentiment (ENUM SAFE)
    if (parsed.sentiment) {
      parsed.sentiment = parsed.sentiment
        .toLowerCase()
        .split("|")[0]
        .trim();

      if (!["positive", "negative", "mixed"].includes(parsed.sentiment)) {
        parsed.sentiment = "mixed";
      }
    } else {
      parsed.sentiment = "mixed";
    }

    // 🔥 STEP 3: Ensure arrays exist
    parsed.summaryBullets = Array.isArray(parsed.summaryBullets)
      ? parsed.summaryBullets
      : [];

    parsed.topMentions = Array.isArray(parsed.topMentions)
      ? parsed.topMentions
      : [];

    return parsed;

  } catch (error) {
    console.log("AI Error:", error.message);
    throw error;
  }
};