global.tokenDatabase = global.tokenDatabase || {};

module.exports = async (req, res) => {
    const code = req.query.code || (req.body && req.body.code);
    const userId = req.query.user || (req.body && req.body.user);

    if (!code || !userId) {
        return res.json({ success: false, message: "Thiếu mã xác nhận hoặc thông tin người dùng!" });
    }

    const upperCode = code.toUpperCase();
    const tokenData = global.tokenDatabase[upperCode];

    if (!tokenData) {
        return res.json({ success: false, message: "Mã xác nhận không tồn tại hoặc đã hết hạn!" });
    }

    if (tokenData.used) {
        return res.json({ success: false, message: "Mã xác nhận này đã được sử dụng rồi!" });
    }

    if (Date.now() > tokenData.expiresAt) {
        return res.json({ success: false, message: "Mã xác nhận đã hết hạn (quá 15 phút)!" });
    }

    // Đánh dấu đã sử dụng
    tokenData.used = true;

    return res.json({ 
        success: true, 
        reward: 20, 
        message: "Xác nhận thành công!" 
    });
};
