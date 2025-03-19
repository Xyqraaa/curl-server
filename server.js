const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const CACHE_FOLDER = path.join(__dirname, "cache");

if (!fs.existsSync(CACHE_FOLDER)) {
    fs.mkdirSync(CACHE_FOLDER);
}

const getUniqueFilename = (url) => {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const ext = path.extname(url).toLowerCase();
    return `${hash}${ext}`;
};

setInterval(() => {
    fs.readdir(CACHE_FOLDER, (err, files) => {
        if (err) return;
        const now = Date.now();
        files.forEach((file) => {
            const filePath = path.join(CACHE_FOLDER, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && now - stats.mtimeMs > 3600000) {
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
}, 600000);

app.get("/", (req, res) => {
    const imageUrl = req.query.url;
    const refresh = req.query.refresh === "true";

    if (!imageUrl) return res.status(400).json({ error: "No URL provided" });

    const ext = path.extname(imageUrl).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ error: "Invalid file type" });
    }

    const filename = getUniqueFilename(imageUrl);
    const filePath = path.join(CACHE_FOLDER, filename);

    if (fs.existsSync(filePath) && !refresh) {
        return res.sendFile(filePath);
    }

    exec(`curl -o "${filePath}" "${imageUrl}"`, (error) => {
        if (error) {
            return res.status(500).json({ error: "Failed to download image" });
        }
        res.sendFile(filePath);
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
