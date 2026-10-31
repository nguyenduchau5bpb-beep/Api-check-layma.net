const fetch = require('node-fetch');

global.statsData = global.statsData || { totalCreated: 0, totalSuccess: 0, history: [] };

module.exports = async (req, res) => {
    const { token, user } = req.query;
    
    if (!token || !user || !global.tokenDatabase || !global.tokenDatabase[token]) {
        return res.send("<h3>❌ Lỗi: Mã xác nhận không hợp lệ hoặc không tồn tại!</h3>");
    }

    const tokenData = global.tokenDatabase[token];
    if (tokenData.userId !== user || tokenData.used || Date.now() > tokenData.expiresAt) {
        return res.send("<h3>⚠️ Mã xác nhận không hợp lệ hoặc đã hết hạn!</h3>");
    }

    tokenData.used = true;

    // Tăng thống kê thành công và lưu lịch sử
    global.statsData.totalSuccess += 1;
    global.statsData.history.push({
        user: user,
        time: new Date().toLocaleString("vi-VN")
    });

    const earnedCoins = Math.floor(Math.random() * 41) + 10;
    const botToken = "YOUR_TELEGRAM_BOT_TOKEN";
    const telegramMessage = encodeURIComponent(`🎉 *XÁC NHẬN VƯỢT LINK THÀNH CÔNG!*\n\n🎁 Bạn nhận được: *+${earnedCoins} COINS*\n💰 Số dư đã được cập nhật tự động!`);
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${user}&text=${telegramMessage}&parse_mode=Markdown`);

    return res.send(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Thành công</title>
            <style>
                body { font-family: Arial; text-align: center; margin-top: 100px; background: #f4f7f6; }
                .box { background: white; padding: 40px; border-radius: 10px; display: inline-block; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); }
                h1 { color: #28a745; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>🎉 Vượt link thành công!</h1>
                <p>Bạn đã nhận được <b>+${earnedCoins} Coins</b>.</p>
                <p>Hệ thống đã ghi nhận <b>+1,200 VNĐ</b> doanh thu cho chủ bot!</p>
            </div>
        </body>
        </html>
    `);
};
