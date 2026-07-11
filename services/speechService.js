const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function speechToText(audioPath) {

    try {

        const transcription =
            await groq.audio.transcriptions.create({

                file: fs.createReadStream(audioPath),

                model: "whisper-large-v3",

                response_format: "verbose_json",

                language: "en"

            });

        return transcription.text;

    }

    catch (error) {

        console.error(error);

        throw new Error("Unable to transcribe audio.");

    }

}

module.exports = {

    speechToText

};