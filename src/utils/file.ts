import fs from 'node:fs';
import path from 'node:path';

/**
 * Mendapatkan ukuran file dalam bytes dari direktori public
 * @param publicPath Path file relatif terhadap folder public (misal: /images/blog/test.png)
 * @returns Ukuran file dalam bytes, atau 0 jika tidak ditemukan
 */
export function getPublicFileSize(publicPath: string): number {
  try {
    const absolutePath = path.join(process.cwd(), 'public', publicPath);
    if (fs.existsSync(absolutePath)) {
      const stats = fs.statSync(absolutePath);
      return stats.size;
    }
  } catch (error) {
    console.error(`Error getting file size for ${publicPath}:`, error);
  }
  return 0;
}
