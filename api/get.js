const fetch = require('node-fetch');

global.tokenDatabase = global.tokenDatabase || {};
global.statsData = global.statsData || { totalCreated: 0, totalSuccess: 0, history: [] };

module.exports = async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({ success: false, message: "Thiếu user_id" });
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 10 * 60 * 1000;

    global.tokenDatabase[token] = { userId, expiresAt, used: false };
    global.statsData.totalCreated += 1;

    const apiTokenUser = "e2608871b447b4b99eb1c01cde278024";
    const domainVercel = `https://${req.headers.host}`;
    const redirectUrl = `${domainVercel}/api/check?token=${token}&user=${userId}`;
    const linkDuPhong = "https://layma.net/backup";

    const laymaUrl = `https://api.layma.net/api/admin/shortlink/quicklink?tokenUser=${apiTokenUser}&format=json&url=${encodeURIComponent(redirectUrl)}&link_du_phong=${encodeURIComponent(linkDuPhong)}`;

    try {
        const response = await fetch(laymaUrl);
        const data = await response.json();

        // Kiểm tra đúng định dạng JSON trả về từ layma (có success: true và html chứa link)
        if (data.success && data.html) {
            return res.json({ success: true, short_url: data.html });
        } else {
            return res.json({ success: false, message: "Layma không trả về link rút gọn." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
