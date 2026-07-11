const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function generateSummary(transcript) {

    const prompt = `
You are an AI Meeting Assistant.

Analyze the meeting transcript.

Return ONLY valid JSON.

{
  "summary":[
      "...",
      "...",
      "...",
      "...",
      "..."
  ],

  "keyDecisions":[
      "...",
      "..."
  ],

  "actionItems":[
      {
          "task":"",
          "owner":"",
          "deadline":""
      }
  ]
}

Rules:

- Exactly 5 summary points.
- Mention every important decision.
- Extract every action item.
- If owner isn't mentioned write "Not Mentioned".
- If deadline isn't mentioned write "Not Mentioned".
- Return ONLY JSON.
- Do not use markdown.
- Do not explain anything.

Meeting Transcript:

${transcript}
`;

    try {

        const completion =
            await groq.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                temperature: 0.2,

                messages: [

                    {
                        role: "user",
                        content: prompt
                    }

                ]

            });

        let text =
            completion.choices[0].message.content.trim();

        // Remove markdown if model adds it

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(text);

    }

    catch (err) {

        console.log(err);

        throw new Error("Summary generation failed.");

    }

}

module.exports = {

    generateSummary

};