import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, GridFSBucket } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const folder = formData.get('folder') as string || 'general'

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    await client.connect()
    const db = client.db('stellarfit')
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Сохраняем в GridFS
    const uploadStream = bucket.openUploadStream(
      `${Date.now()}_${file.name}`,
      { metadata: { folder } }
    )
    uploadStream.write(buffer)
    uploadStream.end()

    const url = `/api/image/${uploadStream.id}`
    
    return NextResponse.json({ 
      success: true, 
      url: url,
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}