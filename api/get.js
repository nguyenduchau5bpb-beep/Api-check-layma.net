module.exports = async (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({ success: false, message: "Thiếu user_id" });
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const domainVercel = `https://${req.headers.host}`;
    
    // Tự tạo link rút gọn trực tiếp trỏ về hệ thống check của bạn, không lo lỗi HTML
    const shortUrl = `${domainVercel}/api/check?token=${token}&user=${userId}`;

    return res.json({ 
        success: true, 
        short_url: shortUrl 
    });
};
