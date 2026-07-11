const express = require("express");
const multer = require("multer");

const {
    uploadAudio
} = require("../controllers/uploadController");

const router = express.Router();

/* Storage Configuration */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function (req, file, cb) {

        const uniqueName = Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});

/* Audio Filter */

const fileFilter = (req, file, cb) => {

    const allowed = [

        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/webm",
        "audio/mp4",
        "audio/m4a",
        "audio/ogg"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only audio files are allowed."));

    }

};

const upload = multer({

    storage,

    fileFilter

});

router.post(

    "/upload",

    upload.single("audio"),

    uploadAudio

);

module.exports = router;