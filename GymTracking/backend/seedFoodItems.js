require('dotenv').config();
const mongoose = require('mongoose');
const FoodItem = require('./src/models/FoodItem');

const foodItems = [
  {
    "name": "Bánh bao chay 2 cái",
    "calories": 220.3,
    "protein": 10.5,
    "fat": 4.7,
    "carbs": 34.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 20.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bao nhân cadé 1 cái",
    "calories": 209.3,
    "protein": 5.2,
    "fat": 4.1,
    "carbs": 37.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 22.7,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bao nhân thịt 1 cái",
    "calories": 327.9,
    "protein": 16.1,
    "fat": 7.9,
    "carbs": 48.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 28.9,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bèo 1 đĩa",
    "calories": 357.9,
    "protein": 13.3,
    "fat": 13.9,
    "carbs": 44.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 26.9,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bèo thập cẩm 1 đĩa",
    "calories": 608.8,
    "protein": 15.6,
    "fat": 21.6,
    "carbs": 88.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 52.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bía 1 cái",
    "calories": 697.8,
    "protein": 16.1,
    "fat": 29.8,
    "carbs": 91.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 54.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bích quy 100g",
    "calories": 376.0,
    "protein": 8.8,
    "fat": 4.5,
    "carbs": 75.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 45.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bò 2 cái",
    "calories": 100.1,
    "protein": 1.1,
    "fat": 4.5,
    "carbs": 13.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 8.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bông lan chén 1 cái",
    "calories": 214.1,
    "protein": 4.3,
    "fat": 12.1,
    "carbs": 22.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 13.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bông lan cuốn 1 khoanh",
    "calories": 152.2,
    "protein": 4.2,
    "fat": 2.2,
    "carbs": 28.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 17.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bông lan kem vuông 1 cái nhỏ",
    "calories": 257.4,
    "protein": 5.2,
    "fat": 9.0,
    "carbs": 38.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 23.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh bột lọc 1 đĩa",
    "calories": 485.4,
    "protein": 13.2,
    "fat": 20.2,
    "carbs": 62.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 37.6,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh cay 1 cái nhỏ",
    "calories": 24.2,
    "protein": 0.2,
    "fat": 1.0,
    "carbs": 3.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 2.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh chả 100g",
    "calories": 395.0,
    "protein": 3.4,
    "fat": 6.6,
    "carbs": 80.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 48.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh chocopie 1 cái",
    "calories": 121.0,
    "protein": 1.0,
    "fat": 5.0,
    "carbs": 18.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 10.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh chưng 1 cái",
    "calories": 407.9,
    "protein": 14.9,
    "fat": 5.5,
    "carbs": 74.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 44.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh chuối 1 miếng",
    "calories": 505.9,
    "protein": 4.3,
    "fat": 13.9,
    "carbs": 90.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 54.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh chuối chiên 1 cái lớn",
    "calories": 139.1,
    "protein": 1.0,
    "fat": 9.9,
    "carbs": 11.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 6.9,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh cuốn 1 đĩa",
    "calories": 590.4,
    "protein": 25.7,
    "fat": 25.6,
    "carbs": 64.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 38.6,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh da lợn 1 miếng",
    "calories": 363.9,
    "protein": 3.6,
    "fat": 11.9,
    "carbs": 60.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 36.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh đậu xanh nướng 1 miếng",
    "calories": 404.8,
    "protein": 13.6,
    "fat": 11.2,
    "carbs": 62.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 37.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh dorayaki 1 cái",
    "calories": 195.0,
    "protein": 4.1,
    "fat": 2.7,
    "carbs": 38.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 23.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh đúc 100g",
    "calories": 51.5,
    "protein": 0.9,
    "fat": 0.3,
    "carbs": 11.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 6.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh Flan 1 cái tròn",
    "calories": 66.4,
    "protein": 1.7,
    "fat": 1.6,
    "carbs": 11.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 6.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh giò 1 cái",
    "calories": 215.1,
    "protein": 9.3,
    "fat": 7.1,
    "carbs": 28.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 17.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh in chay 100g",
    "calories": 376.3,
    "protein": 3.2,
    "fat": 0.3,
    "carbs": 90.2,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 54.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh ít nhân đậu 1 cái",
    "calories": 257.1,
    "protein": 6.6,
    "fat": 1.9,
    "carbs": 53.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 32.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh ít nhân dừa 1 cái",
    "calories": 261.1,
    "protein": 3.5,
    "fat": 5.1,
    "carbs": 50.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 30.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh kem xốp 100g",
    "calories": 492.0,
    "protein": 8.3,
    "fat": 24.0,
    "carbs": 60.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 36.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh khảo 100g",
    "calories": 376.0,
    "protein": 3.2,
    "fat": 0.3,
    "carbs": 90.2,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 54.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh khoai mì nướng 1 miếng",
    "calories": 391.7,
    "protein": 2.8,
    "fat": 14.5,
    "carbs": 62.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 37.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh khọt 1 đĩa 5 cái",
    "calories": 154.12,
    "protein": 5.8,
    "fat": 7.1,
    "carbs": 16.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 10.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh lá chả tôm 1 đĩa",
    "calories": 331.6,
    "protein": 17.1,
    "fat": 5.2,
    "carbs": 54.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 32.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh lá dứa nhân chuối 1 cái",
    "calories": 154.1,
    "protein": 4.8,
    "fat": 3.7,
    "carbs": 25.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 15.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh lá dừa nhân đậu 1 cái",
    "calories": 156.2,
    "protein": 5.4,
    "fat": 4.6,
    "carbs": 23.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 14.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mè 1 cái nhỏ",
    "calories": 170.1,
    "protein": 3.1,
    "fat": 11.7,
    "carbs": 13.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 7.9,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh men 100g",
    "calories": 368.5,
    "protein": 9.6,
    "fat": 3.7,
    "carbs": 74.2,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 44.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì cadé Kinh đô 1 cái",
    "calories": 111.6,
    "protein": 3.0,
    "fat": 2.0,
    "carbs": 20.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 12.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì kẹp cá hộp 1 ổ",
    "calories": 398.9,
    "protein": 15.1,
    "fat": 13.7,
    "carbs": 53.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 32.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì kẹp chà bông 1 ổ",
    "calories": 331.6,
    "protein": 18.4,
    "fat": 4.8,
    "carbs": 53.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 32.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì kẹp chả lụa 1 ổ",
    "calories": 430.6,
    "protein": 20.1,
    "fat": 14.2,
    "carbs": 55.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 33.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì khô 100g",
    "calories": 346.1,
    "protein": 12.3,
    "fat": 1.3,
    "carbs": 71.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 42.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì ngọt Đức phát 1 ổ",
    "calories": 303.3,
    "protein": 9.5,
    "fat": 4.9,
    "carbs": 55.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 47.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì ổ 1 ổ trung",
    "calories": 239.6,
    "protein": 7.6,
    "fat": 0.8,
    "carbs": 50.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 30.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì sandwich 1 lát vuông",
    "calories": 88.4,
    "protein": 2.6,
    "fat": 1.2,
    "carbs": 16.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 10.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì sandwich kẹp thịt 1 cái",
    "calories": 467.0,
    "protein": 18.9,
    "fat": 26.2,
    "carbs": 38.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 23.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh mì thịt 1 ổ",
    "calories": 460.7,
    "protein": 17.8,
    "fat": 18.7,
    "carbs": 55.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 33.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh patechaud 1 cái",
    "calories": 373.0,
    "protein": 10.5,
    "fat": 20.2,
    "carbs": 37.3,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 22.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh phồng tôm 1 đĩa 5 cái",
    "calories": 168.8,
    "protein": 0.4,
    "fat": 14.8,
    "carbs": 8.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 5.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh pía 1 cái",
    "calories": 709.0,
    "protein": 29.8,
    "fat": 91.3,
    "carbs": 161.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 96.6,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh quẩy đường 100g",
    "calories": 290.0,
    "protein": 6.0,
    "fat": 5.3,
    "carbs": 47.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 40.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh quế 100g",
    "calories": 435.0,
    "protein": 8.3,
    "fat": 10.7,
    "carbs": 76.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 45.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh quy bơ (biscuit) 1 cái nhỏ",
    "calories": 38.1,
    "protein": 0.9,
    "fat": 0.5,
    "carbs": 7.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 4.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh snack 1 gói",
    "calories": 122.9,
    "protein": 4.0,
    "fat": 3.7,
    "carbs": 18.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 11.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh sôcôla 100g",
    "calories": 449.2,
    "protein": 3.9,
    "fat": 17.6,
    "carbs": 68.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 41.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh su kem 1 cái",
    "calories": 112.4,
    "protein": 2.4,
    "fat": 7.2,
    "carbs": 9.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 5.7,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh sừng trâu 1 cái",
    "calories": 226.9,
    "protein": 4.6,
    "fat": 7.3,
    "carbs": 35.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 21.4,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh tét nhân chuối 1 cái",
    "calories": 304.4,
    "protein": 6.2,
    "fat": 1.2,
    "carbs": 67.2,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 40.3,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh tét nhân đậu ngọt 1 cái",
    "calories": 445.4,
    "protein": 13.7,
    "fat": 1.8,
    "carbs": 93.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 79.6,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh tét nhân mặn 1 cái",
    "calories": 407.9,
    "protein": 14.9,
    "fat": 5.5,
    "carbs": 74.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 44.8,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh thỏi sôcôla 100g",
    "calories": 543.2,
    "protein": 4.9,
    "fat": 30.4,
    "carbs": 62.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 37.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh tiêu 1 cái lớn",
    "calories": 131.8,
    "protein": 1.9,
    "fat": 7.8,
    "carbs": 13.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 8.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh tiramisu 100g",
    "calories": 295.0,
    "protein": 5.0,
    "fat": 13.0,
    "carbs": 36.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 21.6,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh trứng nhện 100g",
    "calories": 369.0,
    "protein": 9.6,
    "fat": 3.7,
    "carbs": 74.2,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 44.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh ướt 1 đĩa",
    "calories": 748.9,
    "protein": 22.9,
    "fat": 19.3,
    "carbs": 120.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 72.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh xèo 1 cái",
    "calories": 517.3,
    "protein": 15.0,
    "fat": 19.3,
    "carbs": 70.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 42.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bắp giã 1 gói",
    "calories": 328.6,
    "protein": 6.3,
    "fat": 11.0,
    "carbs": 51.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 10.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chè bắp 1 chén",
    "calories": 351.7,
    "protein": 4.7,
    "fat": 10.1,
    "carbs": 60.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 51.4,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè chuối chưng 1 chén",
    "calories": 333.1,
    "protein": 3.5,
    "fat": 10.7,
    "carbs": 55.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 47.3,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè đậu đen 1 ly",
    "calories": 419.4,
    "protein": 13.0,
    "fat": 9.8,
    "carbs": 69.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 59.3,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè đậu trắng 1 ly",
    "calories": 412.3,
    "protein": 12.0,
    "fat": 9.9,
    "carbs": 68.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 58.5,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè đậu xanh đánh 1 chén",
    "calories": 358.2,
    "protein": 13.2,
    "fat": 10.2,
    "carbs": 53.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 45.4,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè đậu xanh phổ tai 1 ly",
    "calories": 422.9,
    "protein": 12.9,
    "fat": 10.1,
    "carbs": 70.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 59.6,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè nếp đậu trắng 1 chén",
    "calories": 435.6,
    "protein": 11.5,
    "fat": 10.0,
    "carbs": 74.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 63.7,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè nếp khoai môn 1 chén",
    "calories": 385.0,
    "protein": 4.7,
    "fat": 11.0,
    "carbs": 66.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 56.8,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè táo xọn 1 chén",
    "calories": 310.4,
    "protein": 7.4,
    "fat": 9.6,
    "carbs": 48.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 41.3,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè thạch nhãn 1 ly",
    "calories": 198.5,
    "protein": 2.2,
    "fat": 0.1,
    "carbs": 47.2,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 40.1,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè thưng 1 chén",
    "calories": 329.1,
    "protein": 7.1,
    "fat": 11.9,
    "carbs": 48.4,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 41.1,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Chè trôi nước 1 chén",
    "calories": 513.2,
    "protein": 11.7,
    "fat": 12.0,
    "carbs": 89.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 76.2,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Kem cây Kido/Wall 1 cây",
    "calories": 82.9,
    "protein": 1.3,
    "fat": 3.7,
    "carbs": 11.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 6.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kem Cornetto 1 cây",
    "calories": 201.9,
    "protein": 3.3,
    "fat": 10.3,
    "carbs": 24.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 14.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kem hộp 500ml",
    "calories": 380.2,
    "protein": 6.0,
    "fat": 17.0,
    "carbs": 50.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 30.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo bơ cứng (Toffee) 100g",
    "calories": 448.0,
    "protein": 2.1,
    "fat": 17.2,
    "carbs": 71.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 60.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo cà phê 100g",
    "calories": 377.7,
    "protein": 1.3,
    "fat": 91.5,
    "carbs": 0.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo chocolate nhân đậu phộng 1 gói nhỏ",
    "calories": 101.1,
    "protein": 2.5,
    "fat": 6.7,
    "carbs": 7.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 6.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo đậu phộng 100g",
    "calories": 448.9,
    "protein": 10.3,
    "fat": 16.5,
    "carbs": 64.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 55.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo dẻo 1 cái nhỏ",
    "calories": 8.8,
    "protein": 0.2,
    "fat": 2.0,
    "carbs": 0.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Kẹo dừa 1 viên nhỏ",
    "calories": 31.3,
    "protein": 0.1,
    "fat": 0.9,
    "carbs": 5.7,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 4.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo dừa mềm 100g",
    "calories": 414.6,
    "protein": 0.6,
    "fat": 12.2,
    "carbs": 75.6,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 64.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo ngậm bạc hà 100g",
    "calories": 268.4,
    "protein": 5.2,
    "fat": 61.9,
    "carbs": 0.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo sôcôla 100g",
    "calories": 388.2,
    "protein": 1.6,
    "fat": 4.6,
    "carbs": 85.1,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 72.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo sữa 1 viên nhỏ",
    "calories": 13.4,
    "protein": 0.1,
    "fat": 0.2,
    "carbs": 2.8,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 2.4,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Kẹo trái cây 1 viên nhỏ",
    "calories": 12.4,
    "protein": 3.1,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Kẹo vừng 100g",
    "calories": 417.0,
    "protein": 2.8,
    "fat": 6.9,
    "carbs": 85.9,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 73.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khoai dẻo 1 viên",
    "calories": 13.0,
    "protein": 3.3,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mứt bí ngô 100g",
    "calories": 198.0,
    "protein": 0.5,
    "fat": 49.1,
    "carbs": 0.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Sâm bổ lượng 1 ly",
    "calories": 268.1,
    "protein": 6.4,
    "fat": 0.5,
    "carbs": 59.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 11.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Tào phớ nước đường 100g",
    "calories": 38.0,
    "protein": 2.6,
    "fat": 1.1,
    "carbs": 4.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 3.8,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Tào phớ trân châu 100g",
    "calories": 71.0,
    "protein": 2.3,
    "fat": 1.6,
    "carbs": 11.5,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 2.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Trân châu 100g",
    "calories": 347.0,
    "protein": 9.5,
    "fat": 0.2,
    "carbs": 55.0,
    "category": "Bánh, kẹo, đồ ngọt",
    "glucose": 11.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh bắp cải 1 chén",
    "calories": 37.3,
    "protein": 1.8,
    "fat": 2.1,
    "carbs": 2.8,
    "category": "Canh",
    "glucose": 0.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh bầu 1 chén",
    "calories": 29.7,
    "protein": 1.2,
    "fat": 2.1,
    "carbs": 1.5,
    "category": "Canh",
    "glucose": 0.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh bí đao 1 chén",
    "calories": 28.9,
    "protein": 1.2,
    "fat": 2.1,
    "carbs": 1.3,
    "category": "Canh",
    "glucose": 0.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh bí rợ 1 chén",
    "calories": 42.1,
    "protein": 1.2,
    "fat": 2.1,
    "carbs": 4.6,
    "category": "Canh",
    "glucose": 0.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh cải ngọt 1 chén",
    "calories": 30.1,
    "protein": 1.7,
    "fat": 2.1,
    "carbs": 1.1,
    "category": "Canh",
    "glucose": 0.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh chua 1 chén",
    "calories": 29.1,
    "protein": 1.9,
    "fat": 1.1,
    "carbs": 2.9,
    "category": "Canh",
    "glucose": 0.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh hẹ 1 chén",
    "calories": 33.3,
    "protein": 2.9,
    "fat": 2.1,
    "carbs": 0.7,
    "category": "Canh",
    "glucose": 0.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh khổ qua hầm 1 chén",
    "calories": 87.2,
    "protein": 4.5,
    "fat": 4.0,
    "carbs": 8.3,
    "category": "Canh",
    "glucose": 1.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh khoai mỡ 1 chén",
    "calories": 50.7,
    "protein": 1.5,
    "fat": 1.1,
    "carbs": 8.7,
    "category": "Canh",
    "glucose": 1.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh kiểm 1 tô",
    "calories": 290.3,
    "protein": 5.4,
    "fat": 13.1,
    "carbs": 37.7,
    "category": "Canh",
    "glucose": 7.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh mướp 1 chén",
    "calories": 30.9,
    "protein": 1.4,
    "fat": 2.1,
    "carbs": 1.6,
    "category": "Canh",
    "glucose": 0.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh rau dền 1 chén",
    "calories": 22.9,
    "protein": 0.9,
    "fat": 2.1,
    "carbs": 0.1,
    "category": "Canh",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh rau ngót 1 chén",
    "calories": 29.3,
    "protein": 1.9,
    "fat": 2.1,
    "carbs": 0.7,
    "category": "Canh",
    "glucose": 0.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo đậu đỏ 1 tô",
    "calories": 323.4,
    "protein": 10.6,
    "fat": 11.8,
    "carbs": 43.7,
    "category": "Cháo",
    "glucose": 8.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo gỏi vịt 1 tô",
    "calories": 931.9,
    "protein": 50.2,
    "fat": 60.3,
    "carbs": 47.1,
    "category": "Cháo",
    "glucose": 9.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo huyết 1 tô",
    "calories": 331.7,
    "protein": 22.1,
    "fat": 8.9,
    "carbs": 40.8,
    "category": "Cháo",
    "glucose": 8.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo lòng 1 tô",
    "calories": 411.5,
    "protein": 30.8,
    "fat": 13.5,
    "carbs": 41.7,
    "category": "Cháo",
    "glucose": 8.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo sườn 1 tô (300g) 328",
    "calories": 12.9,
    "protein": 6.9,
    "fat": 50.7,
    "carbs": 0.0,
    "category": "Cháo",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo trắng 1 tô (300g)",
    "calories": 252.0,
    "protein": 8.1,
    "fat": 1.3,
    "carbs": 52.0,
    "category": "Cháo",
    "glucose": 10.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún ăn liền 100g",
    "calories": 346.6,
    "protein": 6.4,
    "fat": 9.0,
    "carbs": 60.0,
    "category": "Đồ ăn liền",
    "glucose": 9.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cháo ăn liền 100g",
    "calories": 346.8,
    "protein": 6.8,
    "fat": 4.4,
    "carbs": 70.0,
    "category": "Đồ ăn liền",
    "glucose": 14.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mì ăn liền 100g",
    "calories": 434.7,
    "protein": 9.7,
    "fat": 19.5,
    "carbs": 55.1,
    "category": "Đồ ăn liền",
    "glucose": 8.3,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Mì tôm Hàn Quốc 1 gói (130g) 550",
    "calories": 8.0,
    "protein": 20.0,
    "fat": 84.0,
    "carbs": 0.0,
    "category": "Đồ ăn liền",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Miến ăn liền 100g",
    "calories": 367.2,
    "protein": 3.8,
    "fat": 9.6,
    "carbs": 66.4,
    "category": "Đồ ăn liền",
    "glucose": 13.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Phở ăn liền 100g",
    "calories": 342.2,
    "protein": 6.8,
    "fat": 4.2,
    "carbs": 69.3,
    "category": "Đồ ăn liền",
    "glucose": 10.4,
    "image": "https://images.unsplash.com/photo-1582878826629-d58e38f65805"
  },
  {
    "name": "Cơm chiên dương châu 1 đĩa",
    "calories": 532.1,
    "protein": 14.9,
    "fat": 11.3,
    "carbs": 92.7,
    "category": "Cơm phần",
    "glucose": 13.9,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Cơm tấm bì 1 phần",
    "calories": 628.1,
    "protein": 26.0,
    "fat": 19.3,
    "carbs": 87.6,
    "category": "Cơm phần",
    "glucose": 13.1,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Cơm tấm chả 1 phần",
    "calories": 593.7,
    "protein": 17.0,
    "fat": 18.1,
    "carbs": 90.7,
    "category": "Cơm phần",
    "glucose": 13.6,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Cơm tấm sườn 1 phần",
    "calories": 528.9,
    "protein": 20.7,
    "fat": 13.3,
    "carbs": 81.6,
    "category": "Cơm phần",
    "glucose": 12.2,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Cơm trắng 1 chén",
    "calories": 200.0,
    "protein": 4.6,
    "fat": 0.6,
    "carbs": 44.2,
    "category": "Cơm phần",
    "glucose": 6.6,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Onigiri Tamago 1 cái",
    "calories": 243.1,
    "protein": 7.6,
    "fat": 7.9,
    "carbs": 35.4,
    "category": "Đồ ăn tiện lợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Onigiri Tsukune 1 cái",
    "calories": 243.1,
    "protein": 7.6,
    "fat": 7.9,
    "carbs": 35.4,
    "category": "Đồ ăn tiện lợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Bánh tráng trộn 100g",
    "calories": 300.0,
    "protein": 5.0,
    "fat": 16.3,
    "carbs": 32.5,
    "category": "Đồ ăn vặt",
    "glucose": 19.5,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bắp luộc 1 trái",
    "calories": 191.7,
    "protein": 4.5,
    "fat": 2.5,
    "carbs": 37.8,
    "category": "Đồ ăn vặt",
    "glucose": 18.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bắp nướng 1 trái",
    "calories": 271.6,
    "protein": 4.8,
    "fat": 7.6,
    "carbs": 46.0,
    "category": "Đồ ăn vặt",
    "glucose": 23.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bắp umai 1 cái",
    "calories": 43.5,
    "protein": 0.5,
    "fat": 2.7,
    "carbs": 4.3,
    "category": "Đồ ăn vặt",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Bắp xào 1 đĩa",
    "calories": 316.3,
    "protein": 10.4,
    "fat": 12.3,
    "carbs": 41.0,
    "category": "Đồ ăn vặt",
    "glucose": 8.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khoai lang chiên 100g",
    "calories": 325.0,
    "protein": 2.6,
    "fat": 15.8,
    "carbs": 43.1,
    "category": "Đồ ăn vặt",
    "glucose": 8.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khoai tây chiên 100g",
    "calories": 524.6,
    "protein": 2.2,
    "fat": 35.4,
    "carbs": 49.3,
    "category": "Đồ ăn vặt",
    "glucose": 9.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bia 1 ly",
    "calories": 36.4,
    "protein": 1.6,
    "fat": 7.5,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cà phê đen phin 1 tách",
    "calories": 39.6,
    "protein": 9.9,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cà phê sữa gói tan 1 tách",
    "calories": 81.6,
    "protein": 1.0,
    "fat": 2.4,
    "carbs": 14.0,
    "category": "Đồ uống",
    "glucose": 2.8,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Chôm chôm đóng hộp 1 ly",
    "calories": 138.8,
    "protein": 0.9,
    "fat": 33.8,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cocktail trái cây 1 ly",
    "calories": 158.9,
    "protein": 0.9,
    "fat": 0.1,
    "carbs": 38.6,
    "category": "Đồ uống",
    "glucose": 19.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nước cam vắt 1 ly",
    "calories": 226.4,
    "protein": 0.9,
    "fat": 55.7,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước chanh 1 ly",
    "calories": 149.2,
    "protein": 0.1,
    "fat": 37.2,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước ép trái cây đóng hộp 1 ly",
    "calories": 73.6,
    "protein": 18.4,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước mía 1 ly",
    "calories": 104.0,
    "protein": 26.0,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước ngọt có gaz 1 lon",
    "calories": 144.8,
    "protein": 36.2,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước rau má 1 ly",
    "calories": 74.0,
    "protein": 2.0,
    "fat": 16.5,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước sâm 1 ly",
    "calories": 79.6,
    "protein": 19.9,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Phô mai Bò cười 1 miếng",
    "calories": 67.0,
    "protein": 4.6,
    "fat": 5.4,
    "carbs": 0.0,
    "category": "Đồ uống",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Sữa chua nếp cẩm Ba Vì 1 hũ",
    "calories": 90.0,
    "protein": 2.0,
    "fat": 1.6,
    "carbs": 17.5,
    "category": "Đồ uống",
    "glucose": 3.5,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Sữa chua nếp cẩm Vinamilk 1 hũ",
    "calories": 104.5,
    "protein": 2.9,
    "fat": 2.1,
    "carbs": 18.5,
    "category": "Đồ uống",
    "glucose": 3.7,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Sữa chua uống YoMost 1 hộp nhỏ",
    "calories": 140.3,
    "protein": 2.8,
    "fat": 1.9,
    "carbs": 28.0,
    "category": "Đồ uống",
    "glucose": 5.6,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Sữa chua Yoghurt Vinamilk 1 hủ nhỏ",
    "calories": 137.6,
    "protein": 3.8,
    "fat": 4.0,
    "carbs": 21.6,
    "category": "Đồ uống",
    "glucose": 4.3,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Sữa đậu nành Tribeco 1 hộp nhỏ",
    "calories": 110.1,
    "protein": 6.0,
    "fat": 2.9,
    "carbs": 15.0,
    "category": "Đồ uống",
    "glucose": 3.0,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Sữa hộp Cô gái Hà lan 1 hộp nhỏ",
    "calories": 152.4,
    "protein": 6.5,
    "fat": 6.0,
    "carbs": 18.1,
    "category": "Đồ uống",
    "glucose": 3.6,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Trà đào (cam sả) 240ml",
    "calories": 122.0,
    "protein": 0.2,
    "fat": 0.5,
    "carbs": 28.5,
    "category": "Đồ uống",
    "glucose": 14.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Trà sữa trân châu 1 ly size M",
    "calories": 500.0,
    "protein": 11.0,
    "fat": 19.0,
    "carbs": 39.0,
    "category": "Đồ uống",
    "glucose": 7.8,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Bầu xào trứng 1 đĩa",
    "calories": 108.5,
    "protein": 4.0,
    "fat": 8.5,
    "carbs": 4.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bò bía 3 cuốn",
    "calories": 92.7,
    "protein": 5.8,
    "fat": 4.3,
    "carbs": 7.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bò cuốn lá lốt 8 cuốn",
    "calories": 840.9,
    "protein": 49.0,
    "fat": 12.5,
    "carbs": 133.1,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bò cuốn mỡ chài 8 cuốn",
    "calories": 1180.1,
    "protein": 60.4,
    "fat": 46.1,
    "carbs": 130.9,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bông cải xào thập cẩm 1 đĩa",
    "calories": 141.9,
    "protein": 6.7,
    "fat": 6.3,
    "carbs": 14.6,
    "category": "Món mặn",
    "glucose": 2.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cá bạc má chiên 1 con",
    "calories": 134.3,
    "protein": 13.1,
    "fat": 9.1,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá bạc má kho 1 con",
    "calories": 166.9,
    "protein": 21.1,
    "fat": 5.3,
    "carbs": 8.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá chép chưng tương 1 con",
    "calories": 156.6,
    "protein": 16.4,
    "fat": 6.6,
    "carbs": 7.9,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá chim chiên 1 con",
    "calories": 110.4,
    "protein": 10.5,
    "fat": 7.6,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cà chua dồn thịt 2 trái",
    "calories": 130.8,
    "protein": 7.3,
    "fat": 7.2,
    "carbs": 9.2,
    "category": "Món mặn",
    "glucose": 4.6,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Cá cơm lăn bột chiên 1 đĩa",
    "calories": 316.1,
    "protein": 6.7,
    "fat": 17.3,
    "carbs": 33.4,
    "category": "Món mặn",
    "glucose": 5.0,
    "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99"
  },
  {
    "name": "Cá đối chiên 1 con",
    "calories": 108.5,
    "protein": 9.8,
    "fat": 7.7,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá đối kho 1 con",
    "calories": 82.7,
    "protein": 10.2,
    "fat": 2.7,
    "carbs": 4.4,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá hú kho 1 lát cá",
    "calories": 184.5,
    "protein": 15.6,
    "fat": 9.7,
    "carbs": 8.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá lóc chiên 1 lát",
    "calories": 169.4,
    "protein": 14.9,
    "fat": 12.2,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá lóc kho 1 lát cá",
    "calories": 131.8,
    "protein": 15.7,
    "fat": 3.8,
    "carbs": 8.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá mòi kho 1 đĩa",
    "calories": 105.4,
    "protein": 4.3,
    "fat": 5.0,
    "carbs": 10.8,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá ngừ kho 1 lát cá",
    "calories": 121.8,
    "protein": 17.7,
    "fat": 1.8,
    "carbs": 8.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cà ri 1 tô",
    "calories": 277.8,
    "protein": 7.8,
    "fat": 11.4,
    "carbs": 36.0,
    "category": "Món mặn",
    "glucose": 7.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cà tím nướng 1 đĩa",
    "calories": 33.2,
    "protein": 1.5,
    "fat": 6.8,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cá trê chiên 1 con",
    "calories": 219.7,
    "protein": 12.4,
    "fat": 18.9,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Cá viên kho 10 viên nhỏ",
    "calories": 99.6,
    "protein": 15.1,
    "fat": 2.8,
    "carbs": 3.5,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Chả cá thác lác chiên 1 miếng tròn",
    "calories": 133.3,
    "protein": 11.3,
    "fat": 9.7,
    "carbs": 0.2,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Chả giò chiên 10 cuốn",
    "calories": 40.5,
    "protein": 1.8,
    "fat": 2.1,
    "carbs": 3.6,
    "category": "Món mặn",
    "glucose": 0.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chả lụa chiên 1 khoanh",
    "calories": 336.1,
    "protein": 36.7,
    "fat": 18.5,
    "carbs": 5.7,
    "category": "Món mặn",
    "glucose": 1.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chả lụa kho 1 khoanh",
    "calories": 102.2,
    "protein": 11.7,
    "fat": 4.6,
    "carbs": 3.5,
    "category": "Món mặn",
    "glucose": 0.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chả trứng chưng 1 lát",
    "calories": 126.7,
    "protein": 10.8,
    "fat": 5.1,
    "carbs": 9.4,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chao (đậu hũ nhũ) 100g",
    "calories": 116.0,
    "protein": 8.0,
    "fat": 8.0,
    "carbs": 5.0,
    "category": "Món mặn",
    "glucose": 1.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chim cút chiên bơ 1 con",
    "calories": 203.7,
    "protein": 10.6,
    "fat": 16.9,
    "carbs": 2.3,
    "category": "Món mặn",
    "glucose": 0.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Đậu hủ chiên xả 1 miếng",
    "calories": 148.2,
    "protein": 11.6,
    "fat": 11.0,
    "carbs": 0.7,
    "category": "Món mặn",
    "glucose": 0.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Đậu hủ dồn thịt 1 miếng",
    "calories": 196.3,
    "protein": 9.1,
    "fat": 14.3,
    "carbs": 7.8,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Đậu hủ sốt cà 1 đĩa",
    "calories": 238.8,
    "protein": 18.1,
    "fat": 13.6,
    "carbs": 11.0,
    "category": "Món mặn",
    "glucose": 2.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Đùi gà chiên 1 cái",
    "calories": 173.1,
    "protein": 11.0,
    "fat": 12.3,
    "carbs": 4.6,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Gà kho gừng 1 đĩa",
    "calories": 300.7,
    "protein": 21.9,
    "fat": 19.1,
    "carbs": 10.3,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1532550905667-62e81f1c70c1"
  },
  {
    "name": "Gà rô ti 1 cái đùi",
    "calories": 300.3,
    "protein": 20.3,
    "fat": 23.1,
    "carbs": 2.8,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Gà xào sả ớt 1 đĩa",
    "calories": 272.3,
    "protein": 20.4,
    "fat": 19.1,
    "carbs": 4.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1532550905667-62e81f1c70c1"
  },
  {
    "name": "Gan heo xào 1 đĩa",
    "calories": 200.1,
    "protein": 24.8,
    "fat": 9.7,
    "carbs": 3.4,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Giò cháo quẩy 1 cái đôi",
    "calories": 116.7,
    "protein": 3.2,
    "fat": 4.3,
    "carbs": 16.3,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Gỏi bắp chuối 1 đĩa",
    "calories": 123.2,
    "protein": 5.1,
    "fat": 6.4,
    "carbs": 11.3,
    "category": "Món mặn",
    "glucose": 5.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Gỏi bì cuốn 3 cuốn",
    "calories": 116.0,
    "protein": 10.3,
    "fat": 3.6,
    "carbs": 10.6,
    "category": "Món mặn",
    "glucose": 2.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Gỏi khô bò 1 đĩa",
    "calories": 267.1,
    "protein": 15.8,
    "fat": 11.5,
    "carbs": 25.1,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Gỏi ngó sen 1 đĩa",
    "calories": 286.1,
    "protein": 12.2,
    "fat": 9.3,
    "carbs": 38.4,
    "category": "Món mặn",
    "glucose": 7.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Gỏi tôm cuốn 3 cuốn",
    "calories": 147.0,
    "protein": 7.7,
    "fat": 5.0,
    "carbs": 17.8,
    "category": "Món mặn",
    "glucose": 3.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Há cảo 1 đĩa",
    "calories": 363.4,
    "protein": 7.4,
    "fat": 12.2,
    "carbs": 56.0,
    "category": "Món mặn",
    "glucose": 11.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khổ qua xào trứng 1 đĩa",
    "calories": 113.3,
    "protein": 4.6,
    "fat": 8.5,
    "carbs": 4.6,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khoai tây bò bít tết 1 đĩa",
    "calories": 246.5,
    "protein": 12.4,
    "fat": 12.9,
    "carbs": 20.2,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Lạp xưởng chiên 1 cái",
    "calories": 292.7,
    "protein": 10.4,
    "fat": 27.5,
    "carbs": 0.9,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Mắm chưng 1 miếng tròn",
    "calories": 194.1,
    "protein": 13.3,
    "fat": 13.7,
    "carbs": 4.4,
    "category": "Món mặn",
    "glucose": 0.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mắm Thái 1 đĩa",
    "calories": 166.6,
    "protein": 11.1,
    "fat": 7.4,
    "carbs": 13.9,
    "category": "Món mặn",
    "glucose": 2.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Măng kho thập cẩm 1 đĩa",
    "calories": 141.4,
    "protein": 8.9,
    "fat": 6.2,
    "carbs": 12.5,
    "category": "Món mặn",
    "glucose": 2.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mít kho 1 đĩa",
    "calories": 99.8,
    "protein": 3.7,
    "fat": 5.0,
    "carbs": 10.0,
    "category": "Món mặn",
    "glucose": 2.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mực xào sả ớt 1 đĩa",
    "calories": 184.7,
    "protein": 31.0,
    "fat": 6.7,
    "carbs": 0.1,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mực xào thập cẩm 1 đĩa",
    "calories": 136.7,
    "protein": 17.4,
    "fat": 5.9,
    "carbs": 3.5,
    "category": "Món mặn",
    "glucose": 0.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nấm rơm kho 1 đĩa",
    "calories": 153.7,
    "protein": 7.5,
    "fat": 10.5,
    "carbs": 7.3,
    "category": "Món mặn",
    "glucose": 1.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Sườn nướng 1 miếng",
    "calories": 123.6,
    "protein": 10.6,
    "fat": 7.2,
    "carbs": 4.1,
    "category": "Món mặn",
    "glucose": 0.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Sườn ram 1 miếng",
    "calories": 155.7,
    "protein": 10.9,
    "fat": 11.3,
    "carbs": 2.6,
    "category": "Món mặn",
    "glucose": 0.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Tàu hủ ky chiên 1 đĩa",
    "calories": 306.6,
    "protein": 37.2,
    "fat": 15.4,
    "carbs": 4.8,
    "category": "Món mặn",
    "glucose": 1.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Tép rang 10 con",
    "calories": 100.1,
    "protein": 5.6,
    "fat": 6.5,
    "carbs": 4.8,
    "category": "Món mặn",
    "glucose": 1.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Thị heo quay 1 đĩa",
    "calories": 144.8,
    "protein": 9.2,
    "fat": 12.0,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Thịt bò xào đậu que 1 đĩa",
    "calories": 195.7,
    "protein": 16.8,
    "fat": 6.9,
    "carbs": 16.6,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt bò xào giá hẹ 1 đĩa",
    "calories": 143.7,
    "protein": 15.6,
    "fat": 6.9,
    "carbs": 4.8,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt bò xào hành tây 1 đĩa",
    "calories": 132.5,
    "protein": 11.8,
    "fat": 6.9,
    "carbs": 5.8,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt bò xào măng 1 đĩa",
    "calories": 104.1,
    "protein": 10.5,
    "fat": 6.9,
    "carbs": 0.0,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt bò xào nấm rơm 1 đĩa",
    "calories": 152.0,
    "protein": 13.5,
    "fat": 9.6,
    "carbs": 2.9,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt heo phá lấu 1 đĩa",
    "calories": 241.1,
    "protein": 13.9,
    "fat": 19.9,
    "carbs": 1.6,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt heo quay 1 đĩa",
    "calories": 249.7,
    "protein": 7.0,
    "fat": 14.1,
    "carbs": 23.7,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt heo xào đậu que 1 đĩa",
    "calories": 240.2,
    "protein": 20.5,
    "fat": 10.2,
    "carbs": 16.6,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt heo xào giá hẹ 1 đĩa",
    "calories": 188.2,
    "protein": 19.3,
    "fat": 10.2,
    "carbs": 4.8,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt kho tiêu 1 đĩa",
    "calories": 312.0,
    "protein": 22.5,
    "fat": 16.0,
    "carbs": 19.5,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Thịt kho trứng 1 trứng+2 miếng thịt",
    "calories": 315.3,
    "protein": 19.8,
    "fat": 22.9,
    "carbs": 7.5,
    "category": "Món mặn",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Tôm lăn bột chiên 1 đĩa",
    "calories": 246.5,
    "protein": 2.6,
    "fat": 10.1,
    "carbs": 36.3,
    "category": "Món mặn",
    "glucose": 7.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Tôm sốt cà 1 đĩa",
    "calories": 248.1,
    "protein": 12.5,
    "fat": 9.3,
    "carbs": 28.6,
    "category": "Món mặn",
    "glucose": 5.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xíu mại 2 viên",
    "calories": 103.8,
    "protein": 11.9,
    "fat": 4.2,
    "carbs": 4.6,
    "category": "Món mặn",
    "glucose": 0.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bánh canh chay 1 tô",
    "calories": 225.0,
    "protein": 5.0,
    "fat": 9.0,
    "carbs": 10.0,
    "category": "Món sợi",
    "glucose": 6.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh canh cua 1 tô",
    "calories": 378.4,
    "protein": 21.4,
    "fat": 8.4,
    "carbs": 54.3,
    "category": "Món sợi",
    "glucose": 32.6,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh canh giò heo 1 tô",
    "calories": 482.8,
    "protein": 19.0,
    "fat": 23.6,
    "carbs": 48.6,
    "category": "Món sợi",
    "glucose": 29.2,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh canh thịt gà 1 tô",
    "calories": 345.1,
    "protein": 12.8,
    "fat": 11.1,
    "carbs": 48.5,
    "category": "Món sợi",
    "glucose": 29.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh canh thịt heo 1 tô",
    "calories": 321.7,
    "protein": 12.8,
    "fat": 8.5,
    "carbs": 48.5,
    "category": "Món sợi",
    "glucose": 29.1,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bánh hỏi (tươi) 100g",
    "calories": 112.0,
    "protein": 2.3,
    "fat": 0.3,
    "carbs": 25.0,
    "category": "Món sợi",
    "glucose": 15.0,
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  },
  {
    "name": "Bột chiên 1 đĩa",
    "calories": 443.0,
    "protein": 13.2,
    "fat": 25.8,
    "carbs": 39.5,
    "category": "Món sợi",
    "glucose": 7.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún bò huế 1 tô",
    "calories": 478.8,
    "protein": 18.4,
    "fat": 16.0,
    "carbs": 65.3,
    "category": "Món sợi",
    "glucose": 9.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún bò huế (giò) 1 tô",
    "calories": 621.8,
    "protein": 30.2,
    "fat": 30.6,
    "carbs": 56.4,
    "category": "Món sợi",
    "glucose": 8.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún đậu mắm tôm 1 suất",
    "calories": 760.0,
    "protein": 58.3,
    "fat": 44.5,
    "carbs": 48.9,
    "category": "Món sợi",
    "glucose": 7.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún mắm 1 tô",
    "calories": 479.5,
    "protein": 28.2,
    "fat": 15.5,
    "carbs": 56.8,
    "category": "Món sợi",
    "glucose": 8.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún măng 1 tô",
    "calories": 484.7,
    "protein": 20.9,
    "fat": 19.5,
    "carbs": 56.4,
    "category": "Món sợi",
    "glucose": 8.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún mộc 1 tô",
    "calories": 513.0,
    "protein": 28.1,
    "fat": 19.4,
    "carbs": 56.5,
    "category": "Món sợi",
    "glucose": 8.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún riêu 1 tô",
    "calories": 481.2,
    "protein": 16.5,
    "fat": 16.8,
    "carbs": 66.0,
    "category": "Món sợi",
    "glucose": 9.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún riêu cua 1 tô",
    "calories": 413.0,
    "protein": 17.8,
    "fat": 12.2,
    "carbs": 58.0,
    "category": "Món sợi",
    "glucose": 8.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún riêu ốc 1 tô",
    "calories": 530.4,
    "protein": 28.4,
    "fat": 17.2,
    "carbs": 65.5,
    "category": "Món sợi",
    "glucose": 9.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bún thịt nướng 1 tô",
    "calories": 451.3,
    "protein": 14.7,
    "fat": 13.7,
    "carbs": 67.3,
    "category": "Món sợi",
    "glucose": 10.1,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Bún thịt nướng chả giò 1 tô",
    "calories": 598.04,
    "protein": 24.0,
    "fat": 21.2,
    "carbs": 77.9,
    "category": "Món sợi",
    "glucose": 11.7,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Bún xào 1 đĩa",
    "calories": 569.6,
    "protein": 23.4,
    "fat": 28.0,
    "carbs": 56.0,
    "category": "Món sợi",
    "glucose": 8.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Canh bún 1 tô",
    "calories": 294.9,
    "protein": 13.6,
    "fat": 6.9,
    "carbs": 44.6,
    "category": "Món sợi",
    "glucose": 6.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hoành thánh 1 tô",
    "calories": 242.6,
    "protein": 12.3,
    "fat": 7.4,
    "carbs": 31.7,
    "category": "Món sợi",
    "glucose": 6.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hủ tíu bò kho 1 tô",
    "calories": 410.2,
    "protein": 17.0,
    "fat": 13.4,
    "carbs": 55.4,
    "category": "Món sợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hủ tíu giò heo 1 tô",
    "calories": 637.0,
    "protein": 29.0,
    "fat": 33.0,
    "carbs": 55.9,
    "category": "Món sợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hủ tíu mì 1 tô",
    "calories": 410.5,
    "protein": 16.7,
    "fat": 12.9,
    "carbs": 56.9,
    "category": "Món sợi",
    "glucose": 8.5,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Hủ tíu Nam vang 1 tô",
    "calories": 400.4,
    "protein": 24.3,
    "fat": 14.8,
    "carbs": 42.5,
    "category": "Món sợi",
    "glucose": 8.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hủ tíu thịt heo 1 tô",
    "calories": 361.3,
    "protein": 14.4,
    "fat": 12.5,
    "carbs": 47.8,
    "category": "Món sợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Hủ tíu xào 1 đĩa",
    "calories": 646.3,
    "protein": 41.4,
    "fat": 25.5,
    "carbs": 62.8,
    "category": "Món sợi",
    "glucose": 12.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mì bò viên 1 tô",
    "calories": 456.0,
    "protein": 19.5,
    "fat": 14.4,
    "carbs": 62.1,
    "category": "Món sợi",
    "glucose": 9.3,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Mì căn xào sả 1 đĩa",
    "calories": 298.6,
    "protein": 7.7,
    "fat": 5.8,
    "carbs": 53.9,
    "category": "Món sợi",
    "glucose": 8.1,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Mì quảng 1 tô",
    "calories": 541.0,
    "protein": 22.4,
    "fat": 20.2,
    "carbs": 67.4,
    "category": "Món sợi",
    "glucose": 33.7,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Mì thịt heo 1 tô",
    "calories": 415.4,
    "protein": 19.0,
    "fat": 8.2,
    "carbs": 66.4,
    "category": "Món sợi",
    "glucose": 10.0,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Mì vịt tiềm 1 tô",
    "calories": 776.6,
    "protein": 32.9,
    "fat": 43.0,
    "carbs": 64.5,
    "category": "Món sợi",
    "glucose": 9.7,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Mì xào giòn 1 đĩa",
    "calories": 638.9,
    "protein": 42.2,
    "fat": 29.3,
    "carbs": 51.6,
    "category": "Món sợi",
    "glucose": 7.7,
    "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    "name": "Miến gà 1 tô",
    "calories": 634.9,
    "protein": 17.8,
    "fat": 18.1,
    "carbs": 100.2,
    "category": "Món sợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1532550905667-62e81f1c70c1"
  },
  {
    "name": "Nui chiên 1 đĩa",
    "calories": 523.5,
    "protein": 18.2,
    "fat": 24.3,
    "carbs": 58.0,
    "category": "Món sợi",
    "glucose": 11.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nui thịt heo 1 đĩa",
    "calories": 399.3,
    "protein": 17.5,
    "fat": 9.3,
    "carbs": 61.4,
    "category": "Món sợi",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e"
  },
  {
    "name": "Phở bò chín 1 tô",
    "calories": 430.6,
    "protein": 20.9,
    "fat": 12.2,
    "carbs": 59.3,
    "category": "Món sợi",
    "glucose": 8.9,
    "image": "https://images.unsplash.com/photo-1582878826629-d58e38f65805"
  },
  {
    "name": "Phở bò tái 1 tô",
    "calories": 414.1,
    "protein": 17.9,
    "fat": 11.7,
    "carbs": 59.3,
    "category": "Món sợi",
    "glucose": 8.9,
    "image": "https://images.unsplash.com/photo-1582878826629-d58e38f65805"
  },
  {
    "name": "Phở bò viên 1 tô",
    "calories": 430.5,
    "protein": 16.3,
    "fat": 14.1,
    "carbs": 59.6,
    "category": "Món sợi",
    "glucose": 8.9,
    "image": "https://images.unsplash.com/photo-1582878826629-d58e38f65805"
  },
  {
    "name": "Phở gà 1 tô",
    "calories": 483.5,
    "protein": 21.3,
    "fat": 17.9,
    "carbs": 59.3,
    "category": "Món sợi",
    "glucose": 8.9,
    "image": "https://images.unsplash.com/photo-1582878826629-d58e38f65805"
  },
  {
    "name": "Hột vịt muối 1 trái",
    "calories": 90.6,
    "protein": 6.4,
    "fat": 7.0,
    "carbs": 0.5,
    "category": "Món trứng",
    "glucose": 0.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Trứng cút 1 trái",
    "calories": 17.2,
    "protein": 1.5,
    "fat": 1.2,
    "carbs": 0.1,
    "category": "Món trứng",
    "glucose": 0.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Trứng gà Mỹ 1 trái",
    "calories": 81.3,
    "protein": 7.3,
    "fat": 5.7,
    "carbs": 0.2,
    "category": "Món trứng",
    "glucose": 0.1,
    "image": "https://images.unsplash.com/photo-1532550905667-62e81f1c70c1"
  },
  {
    "name": "Trứng gà ta 1 trái",
    "calories": 58.5,
    "protein": 5.2,
    "fat": 4.1,
    "carbs": 0.2,
    "category": "Món trứng",
    "glucose": 0.1,
    "image": "https://images.unsplash.com/photo-1532550905667-62e81f1c70c1"
  },
  {
    "name": "Trứng vịt bắc thảo 1 trái",
    "calories": 89.7,
    "protein": 6.0,
    "fat": 7.3,
    "carbs": 0.0,
    "category": "Món trứng",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Trứng vịt luộc 1 trái",
    "calories": 90.6,
    "protein": 6.4,
    "fat": 7.0,
    "carbs": 0.5,
    "category": "Món trứng",
    "glucose": 0.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Coca Cola 100g",
    "calories": 41.6,
    "protein": 10.4,
    "fat": 0.0,
    "carbs": 0.0,
    "category": "Nước giải khát",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nước dừa tươi 100g",
    "calories": 21.0,
    "protein": 0.4,
    "fat": 4.8,
    "carbs": 0.0,
    "category": "Nước giải khát",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước ép cà chua 100g",
    "calories": 19.0,
    "protein": 0.8,
    "fat": 0.6,
    "carbs": 2.6,
    "category": "Nước giải khát",
    "glucose": 0.5,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Nước quýt tươi 100g",
    "calories": 24.0,
    "protein": 0.4,
    "fat": 0.2,
    "carbs": 5.1,
    "category": "Nước giải khát",
    "glucose": 1.0,
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"
  },
  {
    "name": "Rượu nếp 100g",
    "calories": 166.8,
    "protein": 4.0,
    "fat": 37.7,
    "carbs": 0.0,
    "category": "Nước giải khát",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bơ 1 trái",
    "calories": 184.7,
    "protein": 3.5,
    "fat": 17.1,
    "carbs": 4.2,
    "category": "Quả chín",
    "glucose": 2.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Bưởi 1 múi",
    "calories": 20.8,
    "protein": 0.1,
    "fat": 5.1,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cam 1 trái",
    "calories": 68.8,
    "protein": 1.7,
    "fat": 15.5,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chôm chôm 1 trái",
    "calories": 14.4,
    "protein": 0.3,
    "fat": 3.3,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chuối cau 1 trái",
    "calories": 36.2,
    "protein": 0.5,
    "fat": 0.2,
    "carbs": 8.1,
    "category": "Quả chín",
    "glucose": 4.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chuối già 1 trái",
    "calories": 73.8,
    "protein": 1.1,
    "fat": 0.2,
    "carbs": 16.9,
    "category": "Quả chín",
    "glucose": 8.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chuối khô 1 trái",
    "calories": 42.4,
    "protein": 0.7,
    "fat": 9.9,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chuối sấy 1 đĩa nhỏ",
    "calories": 253.5,
    "protein": 1.8,
    "fat": 10.7,
    "carbs": 37.5,
    "category": "Quả chín",
    "glucose": 18.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Chuối sứ 1 trái",
    "calories": 35.0,
    "protein": 0.5,
    "fat": 0.2,
    "carbs": 7.8,
    "category": "Quả chín",
    "glucose": 3.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Cóc 1 trái",
    "calories": 33.6,
    "protein": 1.0,
    "fat": 7.4,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Đậu phộng chiên muối 1 đĩa nhỏ",
    "calories": 617.5,
    "protein": 27.5,
    "fat": 49.5,
    "carbs": 15.5,
    "category": "Quả chín",
    "glucose": 7.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Đậu phộng rang 1 đĩa nhỏ",
    "calories": 572.5,
    "protein": 27.5,
    "fat": 44.5,
    "carbs": 15.5,
    "category": "Quả chín",
    "glucose": 7.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Đu đủ 1 miếng",
    "calories": 125.2,
    "protein": 3.6,
    "fat": 27.7,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Dưa hấu 1 miếng",
    "calories": 21.1,
    "protein": 1.6,
    "fat": 0.3,
    "carbs": 3.0,
    "category": "Quả chín",
    "glucose": 1.5,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hạt điều 1 đĩa",
    "calories": 291.9,
    "protein": 9.2,
    "fat": 24.7,
    "carbs": 8.2,
    "category": "Quả chín",
    "glucose": 4.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Hồng đỏ 1 trái",
    "calories": 24.8,
    "protein": 0.6,
    "fat": 5.6,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khế 1 trái",
    "calories": 9.2,
    "protein": 0.4,
    "fat": 1.9,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Khoai môn 1 củ",
    "calories": 457.7,
    "protein": 0.9,
    "fat": 0.1,
    "carbs": 113.3,
    "category": "Quả chín",
    "glucose": 56.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Lê 1 trái",
    "calories": 91.6,
    "protein": 1.4,
    "fat": 0.4,
    "carbs": 20.6,
    "category": "Quả chín",
    "glucose": 10.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mận đỏ 1 trái",
    "calories": 11.2,
    "protein": 0.3,
    "fat": 2.5,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mãng cầu ta 1 trái",
    "calories": 56.0,
    "protein": 1.4,
    "fat": 12.6,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mãng cầu xiêm 1 miếng",
    "calories": 40.0,
    "protein": 1.4,
    "fat": 8.6,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Măng cụt 1 trái",
    "calories": 14.4,
    "protein": 0.1,
    "fat": 3.5,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mít nghệ 1 múi",
    "calories": 11.2,
    "protein": 0.3,
    "fat": 2.5,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mít sấy 1 đĩa nhỏ",
    "calories": 109.1,
    "protein": 1.8,
    "fat": 2.7,
    "carbs": 19.4,
    "category": "Quả chín",
    "glucose": 9.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Mít tố nữ 1 múi",
    "calories": 9.6,
    "protein": 0.2,
    "fat": 2.2,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nhãn thường 1 trái",
    "calories": 4.0,
    "protein": 0.1,
    "fat": 0.9,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nhãn tiêu 1 trái",
    "calories": 3.2,
    "protein": 0.4,
    "fat": 0.4,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Nho khô 1 đĩa nhỏ",
    "calories": 173.3,
    "protein": 1.4,
    "fat": 0.1,
    "carbs": 41.7,
    "category": "Quả chín",
    "glucose": 20.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Ổi 1 trái",
    "calories": 53.2,
    "protein": 1.0,
    "fat": 12.3,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Quýt 1 trái",
    "calories": 28.0,
    "protein": 0.6,
    "fat": 6.4,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Táo ta 1 trái",
    "calories": 9.2,
    "protein": 0.2,
    "fat": 2.1,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Thạch dừa 1 cái",
    "calories": 17.2,
    "protein": 0.4,
    "fat": 3.9,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
  },
  {
    "name": "Thanh long 1 trái",
    "calories": 225.2,
    "protein": 7.3,
    "fat": 49.0,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Thơm 1 miếng",
    "calories": 17.6,
    "protein": 0.5,
    "fat": 3.9,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Trái dừa tươi 1 trái",
    "calories": 127.3,
    "protein": 5.2,
    "fat": 1.7,
    "carbs": 22.8,
    "category": "Quả chín",
    "glucose": 11.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Vú sữa 1 trái",
    "calories": 82.0,
    "protein": 2.0,
    "fat": 18.5,
    "carbs": 0.0,
    "category": "Quả chín",
    "glucose": 0.0,
    "image": "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5"
  },
  {
    "name": "Xoài 1 trái",
    "calories": 178.4,
    "protein": 1.6,
    "fat": 0.8,
    "carbs": 41.2,
    "category": "Quả chín",
    "glucose": 20.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi bắp 1 gói",
    "calories": 312.7,
    "protein": 8.2,
    "fat": 8.3,
    "carbs": 51.3,
    "category": "Xôi",
    "glucose": 7.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi đậu đen 1 gói",
    "calories": 551.9,
    "protein": 17.4,
    "fat": 11.1,
    "carbs": 95.6,
    "category": "Xôi",
    "glucose": 14.3,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi đậu phộng 1 gói",
    "calories": 659.9,
    "protein": 19.9,
    "fat": 28.3,
    "carbs": 81.4,
    "category": "Xôi",
    "glucose": 12.2,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi đậu xanh 1 gói",
    "calories": 533.6,
    "protein": 15.4,
    "fat": 11.2,
    "carbs": 92.8,
    "category": "Xôi",
    "glucose": 13.9,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi gấc 1 gói",
    "calories": 582.2,
    "protein": 12.1,
    "fat": 13.8,
    "carbs": 102.4,
    "category": "Xôi",
    "glucose": 15.4,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi khúc 1 gói",
    "calories": 396.1,
    "protein": 10.4,
    "fat": 10.5,
    "carbs": 65.0,
    "category": "Xôi",
    "glucose": 9.8,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi lá cẩm 1 gói",
    "calories": 578.9,
    "protein": 15.0,
    "fat": 11.3,
    "carbs": 104.3,
    "category": "Xôi",
    "glucose": 15.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi mặn 1 gói",
    "calories": 500.5,
    "protein": 17.9,
    "fat": 18.9,
    "carbs": 64.7,
    "category": "Xôi",
    "glucose": 9.7,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi nếp than 1 gói",
    "calories": 516.2,
    "protein": 13.5,
    "fat": 11.0,
    "carbs": 90.8,
    "category": "Xôi",
    "glucose": 13.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi vị 1 gói",
    "calories": 460.2,
    "protein": 11.6,
    "fat": 13.0,
    "carbs": 74.2,
    "category": "Xôi",
    "glucose": 11.1,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    "name": "Xôi vò 1 gói",
    "calories": 510.1,
    "protein": 14.8,
    "fat": 6.9,
    "carbs": 97.2,
    "category": "Xôi",
    "glucose": 14.6,
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthflow')
  .then(async () => {
    console.log('Connected to DB');
    await FoodItem.deleteMany({});
    await FoodItem.insertMany(foodItems);
    console.log('Seeded Food items with estimates successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
