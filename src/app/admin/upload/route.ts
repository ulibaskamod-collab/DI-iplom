import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 5MB)' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/\s/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    // ✅ Сохраняем в public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${folder}/${fileName}`;

    console.log('Файл загружен:', imageUrl);
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Ошибка сервера при загрузке' }, { status: 500 });
  }
}