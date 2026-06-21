import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];
    const folder = (formData.get('folder') as string) || 'general';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Файлы не найдены' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue;
      if (!file.type.startsWith('image/')) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const originalName = file.name.replace(/\s/g, '_');
      const fileName = `${timestamp}_${originalName}`;

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      uploadedUrls.push(`/uploads/${folder}/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedUrls.length,
      urls: uploadedUrls,
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}