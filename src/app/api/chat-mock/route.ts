import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  try {
    let fileName = '';
    if (type === 'starter') {
      fileName = 'starter.md';
    } else if (type === 'response-1') {
      fileName = 'response-1.md';
    } else if (type === 'keqing') {
      fileName = 'keqing.md';
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'content', 'response', fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
