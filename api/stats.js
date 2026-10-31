// api/stats.js
global.statsData = global.statsData || {
    totalCreated: 0,
    totalSuccess: 0,
    history: []
};

module.exports = (req, res) => {
    const totalVND = global.statsData.totalSuccess * 1200; // 1200 VNĐ mỗi lượt vượt thành công
    return res.json({
        success: true,
        totalCreated: global.statsData.totalCreated,
        totalSuccess: global.statsData.totalSuccess,
        totalVND: totalVND,
        history: global.statsData.history.slice(-10).reverse() // Lấy 10 lịch sử mới nhất
    });
};
