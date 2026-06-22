const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// Создаем папки если их нет
const folders = ['designers', 'clothing', 'zodiac', 'works'];
folders.forEach(folder => {
  const dir = path.join(uploadDir, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Создаем placeholder для одежды
const clothingPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#1a1a2e"/>
  <rect x="50" y="50" width="300" height="300" rx="10" fill="#2a2a4e" stroke="#444" stroke-width="2"/>
  <text x="200" y="180" font-family="Arial" font-size="60" text-anchor="middle" fill="#666">👕</text>
  <text x="200" y="240" font-family="Arial" font-size="18" fill="#555" text-anchor="middle">Нет изображения</text>
</svg>`;

// Сохраняем для каждой папки
folders.forEach(folder => {
  const filePath = path.join(uploadDir, folder, 'placeholder.svg');
  fs.writeFileSync(filePath, clothingPlaceholder);
  console.log(`✅ Создан: ${folder}/placeholder.svg`);
});

console.log('🎉 Все заглушки созданы!');