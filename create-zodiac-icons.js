// create-zodiac-icons.js
const fs = require('fs');
const path = require('path');

const zodiacData = [
  { name: 'Овен', symbol: '♈', color: '#FF4500', slug: 'oven' },
  { name: 'Телец', symbol: '♉', color: '#2ECC71', slug: 'telec' },
  { name: 'Близнецы', symbol: '♊', color: '#FFD700', slug: 'bliznetsy' },
  { name: 'Рак', symbol: '♋', color: '#6C5CE7', slug: 'rak' },
  { name: 'Лев', symbol: '♌', color: '#FFD700', slug: 'lev' },
  { name: 'Дева', symbol: '♍', color: '#95A5A6', slug: 'deva' },
  { name: 'Весы', symbol: '♎', color: '#FFB6C1', slug: 'vesy' },
  { name: 'Скорпион', symbol: '♏', color: '#FF6B6B', slug: 'skorpion' },
  { name: 'Стрелец', symbol: '♐', color: '#8A2BE2', slug: 'strelets' },
  { name: 'Козерог', symbol: '♑', color: '#708090', slug: 'kozerog' },
  { name: 'Водолей', symbol: '♒', color: '#00FFFF', slug: 'vodoley' },
  { name: 'Рыбы', symbol: '♓', color: '#48D1CC', slug: 'ryby' },
];

const uploadDir = path.join(__dirname, 'public', 'uploads', 'zodiac');

// Создаем папку если её нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

zodiacData.forEach((zodiac) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="90" fill="${zodiac.color}" opacity="0.15"/>
  <circle cx="100" cy="100" r="70" fill="${zodiac.color}" opacity="0.1"/>
  <text x="100" y="125" font-family="Arial, sans-serif" font-size="80" text-anchor="middle" fill="${zodiac.color}">${zodiac.symbol}</text>
  <text x="100" y="175" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="${zodiac.color}" opacity="0.6">${zodiac.name}</text>
</svg>`;

  const filePath = path.join(uploadDir, `${zodiac.slug}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Создан: ${zodiac.slug}.svg`);
});

console.log('🎉 Все иконки знаков зодиака созданы!');