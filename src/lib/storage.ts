import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function saveFile(file: File, folder: string = 'uploads'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = path.extname(file.name);
  const fileName = `${uuidv4()}${extension}`;
  const uploadDir = path.join(process.cwd(), 'public', folder);

  // Ensure directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/${folder}/${fileName}`;
}

export async function deleteFile(fileUrl: string) {
  const filePath = path.join(process.cwd(), 'public', fileUrl);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file: ${fileUrl}`, error);
  }
}
