const fetch = require('node-fetch');

global.tokenDatabase = global.tokenDatabase || {};

module.exports = async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({ success: false, message: "Thiếu user_id" });
    }

    // Tạo mã code ngẫu nhiên cho lần vượt link này
    const secretCode = "SOI-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Date.now() + 15 * 60 * 1000; // Hết hạn sau 15 phút

    global.tokenDatabase[secretCode] = { 
        userId: String(userId), 
        expiresAt: expiresAt, 
        used: false 
    };

    const domainVercel = `https://${req.headers.host}`;
    const targetWebUrl = `${domainVercel}/verify.html?code=${secretCode}`;
    const linkDuPhong = "https://layma.net/backup";

    const apiTokenUser = "e2608871b447b4b99eb1c01cde278024";
    const laymaUrl = `https://api.layma.net/api/admin/shortlink/quicklink?tokenUser=${apiTokenUser}&format=text&url=${encodeURIComponent(targetWebUrl)}&link_du_phong=${encodeURIComponent(linkDuPhong)}`;

    try {
        const response = await fetch(laymaUrl);
        let shortLink = await response.text();
        shortLink = shortLink.trim();

        if (shortLink.startsWith("http") && shortLink.includes("layma.net")) {
            return res.json({ success: true, short_url: shortLink });
        } else {
            return res.status(500).json({ success: false, message: "Layma bận: " + shortLink.substring(0, 40) });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
