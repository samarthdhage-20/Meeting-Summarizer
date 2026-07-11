const { speechToText } =
require("../services/speechService");

const { generateSummary } =
require("../services/summaryService");

exports.uploadAudio = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No file uploaded."

            });

        }

        const transcript =
            await speechToText(req.file.path);

        const summary =
            await generateSummary(transcript);

        res.json({

            success: true,

            transcript,

            summary

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};