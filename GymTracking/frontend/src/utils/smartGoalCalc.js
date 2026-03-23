export function calcSmartTargets(user) {
    if (!user || !user.goals || !user.measurements) return null;
    const currentWeight = user.measurements.weight;
    const targetWeight = user.goals.targetWeight;
    const durationMonths = user.goals.durationMonths || 3;
    const durationWeeks = durationMonths * 4.33; // Trung bình 4.33 tuần/tháng
    
    if (!currentWeight || !targetWeight) return null;

    const diff = currentWeight - targetWeight;
    // Chỉ tính cho mục tiêu giảm cân (cut)
    if (diff <= 0) return null;

    // 1kg mỡ = 7700 kcal
    const totalBurnt = diff * 7700;
    const dailyDeficit = Math.round(totalBurnt / (durationWeeks * 7));

    // Nguyên tắc phân bổ thâm hụt:
    // Tối đa 500 kcal từ cắt giảm ăn uống (để không bị lả/mất cơ), phần còn lại ép buộc phải đốt qua tập luyện
    let dietCut = 500;
    if (dailyDeficit < 500) dietCut = dailyDeficit;
    
    const tdee = user.autoStats?.tdee || 2000;
    
    // Mức giới hạn tiêu thụ (Calories Nạp vào Tối đa mỗi ngày)
    const targetIntake = Math.round(tdee - dietCut);
    
    // Mức Calo phải tập luyện cực nhọc để đốt (Calories Phải Đốt mỗi ngày)
    let targetBurn = Math.round(dailyDeficit - dietCut);
    
    // Mặc định khuyến nghị đốt thấp nhất 150kcal/ngày cho cơ bản khỏe mạnh
    if (targetBurn < 150) targetBurn = 150;

    return {
        dailyDeficit,
        targetIntake,
        targetBurn,
    };
}
