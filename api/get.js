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
    
    // Tạo link check nhưng thay thế dấu : và / thành dạng mã hóa an toàn để layma không bị lỗi parse
    const redirectUrl = `${domainVercel}/api/check?token=${token}&user=${userId}`;
    const linkDuPhong = "https://layma.net/backup";

    // Gọi API layma với chuẩn encodeURIComponent hoàn toàn
    const laymaUrl = `https://api.layma.net/api/admin/shortlink/quicklink?tokenUser=${apiTokenUser}&format=json&url=${encodeURIComponent(redirectUrl)}&link_du_phong=${encodeURIComponent(linkDuPhong)}`;

    try {
        const response = await fetch(laymaUrl);
        const textResponse = await response.text(); // Đọc dạng text trước để phòng hờ layma trả về html lỗi

        try {
            const data = JSON.parse(textResponse);
            if (data.success) {
                return res.json({ success: true, short_url: data.html });
            } else {
                return res.json({ success: false, message: data.message || "Layma từ chối tạo link." });
            }
        } catch (jsonError) {
            // Nếu layma trả về HTML lỗi, in ra để dễ debug
            return.status(500).json({ 
                success: false, 
                message: "Layma trả về dữ liệu không phải JSON", 
                raw: textResponse,
                sent_url: laymaUrl 
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
